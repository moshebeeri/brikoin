import fs = require('fs');
import {DEFAULT_BYTE_RANGE_PLACEHOLDER} from './signpdf'
import SignPdfError from './SignPdfError'
import {ERROR_TYPE_PARSE} from './SignPdfError'
import PDFObject, {PDFReferenceMock} from './pdfobject'

export const DEFAULT_SIGNATURE_LENGTH = 8192

/**
 * Removes a trailing new line if there is such.
 *
 * Also makes sure the file ends with an EOF line as per spec.
 * @param {Buffer} pdf
 * @returns {Buffer}
 */
export const removeTrailingNewLine = (pdf) => {
    const lastChar = pdf.slice(pdf.length - 1).toString()
    if (lastChar === '\n') {
        // remove the trailing new line
        return pdf.slice(0, pdf.length - 1)
    }

    const lastLine = pdf.slice(pdf.length - 6).toString()
    if (lastLine !== '\n%%EOF') {
        throw new SignPdfError(
            'A PDF file must end with an EOF line.',
            ERROR_TYPE_PARSE
        )
    }

    return pdf
}

/**
 * @param {Buffer} pdf
 * @returns {object}
 */
export const readRefTable = (pdf, position) => {
    const offsetsMap = new Map()
    let refTable = pdf.slice(position)
    if (refTable.indexOf('xref') !== 0) {
        throw new SignPdfError(
            'Unexpected cross-reference table format.',
            ERROR_TYPE_PARSE
        )
    }
    refTable = refTable.slice(4)
    refTable = refTable.slice(refTable.indexOf('\n') + 1)

    // FIXME: This only expects one subsection. Will go wrong if there are multiple.
    let nextNewLine = refTable.indexOf('\n')
    let line = refTable.slice(0, nextNewLine)
    refTable = refTable.slice(nextNewLine + 1)
    let [startingIndex, length] = line.toString().split(' ')
    startingIndex = parseInt(startingIndex)
    length = parseInt(length)

    const tableRows = []
    let maxOffset = 0
    let maxIndex = 0
    for (let i = startingIndex; i < startingIndex + length; i += 1) {
        nextNewLine = refTable.indexOf('\n')
        line = refTable.slice(0, nextNewLine).toString()
        refTable = refTable.slice(nextNewLine + 1)
        tableRows.push(line)

        let [offset, generation, inUseOrFree] = line.split(' ')
        offset = parseInt(offset)
        maxOffset = Math.max(maxOffset, offset)
        maxIndex = Math.max(maxIndex, i)

        offsetsMap.set(i, offset)
    }

    return {
        tableOffset: position,
        tableRows,
        maxOffset,
        startingIndex,
        maxIndex,
        offsets: offsetsMap
    }
}

/**
 * @param {object} refTable
 * @param {string} ref
 * @returns {number}
 */
const getIndexFromRef = (refTable, ref) => {
    let [index] = ref.split(' ')
    index = parseInt(index)
    if (!refTable.offsets.has(index)) {
        throw new SignPdfError(
            `Failed to locate object "${ref}".`,
            ERROR_TYPE_PARSE
        )
    }
    return index
}

/**
 * @param {Buffer} pdf
 * @param {Map} refTable
 * @returns {object}
 */
export const findObject = (pdf, refTable, ref) => {
    const index = getIndexFromRef(refTable, ref)

    const offset = refTable.offsets.get(index)
    let slice = pdf.slice(offset)
    slice = slice.slice(0, slice.indexOf('endobj'))

    // FIXME: What if it is a stream?
    slice = slice.slice(slice.indexOf('<<') + 2)
    slice = slice.slice(0, slice.lastIndexOf('>>'))
    return slice
}

/**
 * @param {Buffer} pdf
 */
export const readPdf = (pdf) => {
    const trailerStart = pdf.lastIndexOf('trailer')
    const trailer = pdf.slice(trailerStart, pdf.length - 6)

    if (trailer.lastIndexOf('/Prev') !== -1) {
        throw new SignPdfError(
            'Incrementally updated PDFs are not yet supported.',
            ERROR_TYPE_PARSE
        )
    }

    let rootSlice = trailer.slice(trailer.indexOf('/Root'))
    rootSlice = rootSlice.slice(0, rootSlice.indexOf('/', 1))
    const rootRef = rootSlice.slice(6).toString().trim() // /Root + at least one space

    let xRefPosition = trailer.slice(trailer.lastIndexOf('startxref') + 10).toString()
    xRefPosition = parseInt(xRefPosition)
    const refTable = readRefTable(pdf, xRefPosition)

    const root = findObject(pdf, refTable, rootRef).toString()
    if (root.indexOf('AcroForm') !== -1) {
        throw new SignPdfError(
            'The document already contains a form. This is not yet supported.',
            ERROR_TYPE_PARSE
        )
    }
    if (refTable.maxOffset > refTable.tableOffset) {
        throw new SignPdfError(
            'Ref table is not at the end of the document. This document can only be signed in incremental mode.',
            ERROR_TYPE_PARSE
        )
    }

    return {
        xref: refTable,
        rootRef,
        root,
        trailerStart
    }
}

/**
 * Adds the objects that are needed for Adobe.PPKLite to read the signature.
 * Also includes a placeholder for the actual signature.
 * Returns an Object with all the added PDFReferences.
 * @param {PDFDocument} pdf
 * @param {string} reason
 * @returns {object}
 */
export const addSignaturePlaceholder = ({
                                            pdf,
                                            reason,
                                            signatureLength = DEFAULT_SIGNATURE_LENGTH
                                        }) => {
    /* eslint-disable no-underscore-dangle,no-param-reassign */
    // Generate the signature placeholder
    const signature = pdf.ref({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange: [
            0,
            DEFAULT_BYTE_RANGE_PLACEHOLDER,
            DEFAULT_BYTE_RANGE_PLACEHOLDER,
            DEFAULT_BYTE_RANGE_PLACEHOLDER
        ],
        Contents: Buffer.from(String.fromCharCode(0).repeat(signatureLength)),
        Reason: new String(reason), // eslint-disable-line no-new-wrappers
        M: new Date()
    })

    // Generate signature annotation widget
    const widget = pdf.ref({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [0, 0, 0, 0],
        V: signature,
        T: new String('Signature1'), // eslint-disable-line no-new-wrappers
        F: 4,
        P: pdf.page.dictionary // eslint-disable-line no-underscore-dangle
    })
    // Include the widget in a page
    pdf.page.dictionary.data.Annots = [widget]

    // Create a form (with the widget) and link in the _root
    const form = pdf.ref({
        Type: 'AcroForm',
        SigFlags: 3,
        Fields: [widget]
    })
    pdf._root.data.AcroForm = form

    return {
        signature,
        form,
        widget
    }
    /* eslint-enable no-underscore-dangle,no-param-reassign */
}

const createBufferRootWithAcroform = (pdf, info, form) => {
    const rootIndex = getIndexFromRef(info.xref, info.rootRef)

    return Buffer.concat([
        Buffer.from(`${rootIndex} 0 obj\n`),
        Buffer.from('<<\n'),
        Buffer.from(`${info.root}\n`),
        Buffer.from(`/AcroForm ${form}`),
        Buffer.from('\n>>\nendobj\n')
    ])
}

const getPagesDictionaryRef = (info) => {
    const pagesRefRegex = new RegExp('\\/Type\\s*\\/Catalog\\s*\\/Pages\\s+(\\d+\\s\\d+\\sR)', 'g')
    const match = pagesRefRegex.exec(info.root)
    if (match === null) {
        throw new SignPdfError(
            'Failed to find the pages descriptor. This is probably a problem in node-signpdf.',
            ERROR_TYPE_PARSE
        )
    }

    return match[1]
}

const createBufferPageWithAnnotation = (pdf, info, pagesRef, widget) => {
    const pagesDictionary = findObject(pdf, info.xref, pagesRef).toString()
    if (pagesDictionary.indexOf('/Annots') !== -1) {
        throw new SignPdfError(
            'There already are /Annots described. This is not yet supported',
            ERROR_TYPE_PARSE
        )
    }

    const pagesDictionaryIndex = getIndexFromRef(info.xref, pagesRef)

    return Buffer.concat([
        Buffer.from(`${pagesDictionaryIndex} 0 obj\n`),
        Buffer.from('<<\n'),
        Buffer.from(`${pagesDictionary}\n`),
        Buffer.from(`/Annots [${widget}]`),
        Buffer.from('\n>>\nendobj\n')
    ])
}

const createBufferTrailer = (pdf, info, addedReferences) => {
    const rows = info.xref.tableRows
    addedReferences.forEach((offset, index) => {
        const paddedOffset = (`0000000000${offset}`).slice(-10)
        rows[index] = `${paddedOffset} 00000 n `
    })

    return Buffer.concat([
        Buffer.from('xref\n'),
        Buffer.from(`${info.xref.startingIndex} ${rows.length}\n`),
        Buffer.from(rows.join('\n')),
        Buffer.from('\ntrailer\n'),
        Buffer.from('<<\n'),
        Buffer.from(`/Size ${rows.length}\n`),
        Buffer.from(`/Prev ${info.xref.tableOffset}\n`),
        Buffer.from(`/Root ${info.rootRef}\n`),
        Buffer.from('>>\n'),
        Buffer.from('startxref\n'),
        Buffer.from(`${pdf.length}\n`),
        Buffer.from('%%EOF')
    ])
}

const getPageRef = (pdf, info) => {
    const pagesRef = getPagesDictionaryRef(info)
    const pagesDictionary = findObject(pdf, info.xref, pagesRef)
    const kidsPosition = pagesDictionary.indexOf('/Kids')
    const kidsStart = pagesDictionary.indexOf('[', kidsPosition) + 1
    const kidsEnd = pagesDictionary.indexOf(']', kidsPosition)
    const pages = pagesDictionary.slice(kidsStart, kidsEnd).toString()
    const split = pages.trim().split(' ', 3)
    return `${split[0]} ${split[1]} ${split[2]}`
}

/**
 * @param {Buffer} pdf
 */
export const plainAdd = (pdfBuffer, {reason, signatureLength = DEFAULT_SIGNATURE_LENGTH}) => {
    let pdf = removeTrailingNewLine(pdfBuffer)
    const info = readPdf(pdf)
    const pageRef = getPageRef(pdf, info)
    const pageIndex = getIndexFromRef(info.xref, pageRef)
    const addedReferences = new Map()

    const pdfKitMock = {
        ref: (input) => {
            info.xref.maxIndex += 1

            addedReferences.set(info.xref.maxIndex, pdf.length + 1) // + 1 new line

            pdf = Buffer.concat([
                pdf,
                Buffer.from('\n'),
                Buffer.from(`${info.xref.maxIndex} 0 obj\n`),
                Buffer.from(PDFObject.convert(input)),
                Buffer.from('\nendobj\n')
            ])
            return new PDFReferenceMock(info.xref.maxIndex)
        },
        page: {
            dictionary: new PDFReferenceMock(
                pageIndex,
                {
                    data: {
                        Annots: []
                    }
                }
            )
        },
        _root: {
            data: {}
        }
    }

    fs.createWriteStream('./_before.pdf').end(pdf)
    const {
        form,
        widget
    } = addSignaturePlaceholder({
        pdf: pdfKitMock,
        reason,
        signatureLength
    })

    const rootIndex = getIndexFromRef(info.xref, info.rootRef)
    addedReferences.set(rootIndex, pdf.length + 1)
    pdf = Buffer.concat([
        pdf,
        Buffer.from('\n'),
        createBufferRootWithAcroform(pdf, info, form)
    ])

    addedReferences.set(pageIndex, pdf.length + 1)
    pdf = Buffer.concat([
        pdf,
        Buffer.from('\n'),
        createBufferPageWithAnnotation(pdf, info, pageRef, widget)
    ])

    pdf = Buffer.concat([
        pdf,
        Buffer.from('\n'),
        createBufferTrailer(pdf, info, addedReferences)
    ])

    fs.createWriteStream('./_after.pdf').end(pdf)

    return pdf
}

export const extractSignature = (pdf) => {
    const byteRangePos = pdf.indexOf('/ByteRange [')
    if (byteRangePos === -1) {
        throw new SignPdfError(
            'Failed to locate ByteRange.',
            ERROR_TYPE_PARSE
        )
    }

    const byteRangeEnd = pdf.indexOf(']', byteRangePos)
    if (byteRangeEnd === -1) {
        throw new SignPdfError(
            'Failed to locate the end of the ByteRange.',
            ERROR_TYPE_PARSE
        )
    }

    const byteRange = pdf.slice(byteRangePos, byteRangeEnd + 1).toString()
    const matches = (/\/ByteRange \[(\d+) +(\d+) +(\d+) +(\d+)\]/).exec(byteRange)

    const signedData = Buffer.concat([
        pdf.slice(
            parseInt(matches[1]),
            parseInt(matches[1]) + parseInt(matches[2])
        ),
        pdf.slice(
            parseInt(matches[3]),
            parseInt(matches[3]) + parseInt(matches[4])
        )
    ])

    let signatureHex = pdf.slice(
        parseInt(matches[1]) + parseInt(matches[2]) + 1,
        parseInt(matches[3]) - 1
    ).toString('binary')
    signatureHex = signatureHex.replace(/(?:00)*$/, '')

    const signature = Buffer.from(signatureHex, 'hex').toString('binary')

    return {ByteRange: matches.slice(1, 5).map(Number), signature, signedData}
}
