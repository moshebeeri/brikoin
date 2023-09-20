export const ERROR_TYPE_UNKNOWN = 1
export const ERROR_TYPE_INPUT = 2
export const ERROR_TYPE_PARSE = 3
export const ERROR_VERIFY_SIGNATURE = 4
class SignPdfError extends Error {

    type: any

    constructor (msg, type = ERROR_TYPE_UNKNOWN) {
        super(msg)
        this.type = type
    }
}

export default SignPdfError
