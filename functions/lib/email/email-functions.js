"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const utils_1 = require("../operations/utils");
const os = require('os');
const fs = require('fs');
const path = require('path');
const EmailTemplate = require('email-templates');
// TODO: Remember to set token using >> firebase functions:config:set server="Firebase server root"
const fileBucket = functions.config().file.bucket;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'info@brikoin.com',
        pass: '8Cj>BnC513906'
    }
});
exports.sendMail = functions.database
    .ref(`server/operations/events/sendMailTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('sendEmail');
    if (request) {
        // sendEmail(request.to,request.subject,request.message,callback);
        yield sendMail(request);
        db.ref('server').child('/operations/events/sendEmail').child(request.key).update({ active: false });
        db.ref('server').child('/operations/events/sendMailTrigger').update({ tome: new Date().getTime() });
    }
}));
//
// function sendEmail (to,subject,message,callback) {
//     const mailOptions = {
//         from: 'THIS@low.la', // sender address
//         to: to, // list of receivers
//         subject: subject, // Subject line
//         html: message
//     }
//     console.log(`sending mail: ${JSON.stringify(mailOptions)}`)
//    // sendMail('roi@low.la');
//     transporter.sendMail(mailOptions, callback)
// }
function sendMail(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucket = admin.storage().bucket(fileBucket);
        const templatesTempFilePath = path.join(os.tmpdir(), 'templates');
        const templateFilePath = path.join(templatesTempFilePath, request.template);
        const cssFilePath = path.join(templatesTempFilePath, 'css');
        //
        const logoFilePath = path.join(cssFilePath, 'logo');
        const localeFilePath = path.join(templatesTempFilePath, 'locale');
        const htmlPath = path.join(templateFilePath, 'html.pug');
        const subjectPath = path.join(templateFilePath, 'subject.pug');
        const cssFile = path.join(cssFilePath, 'app.css');
        const brikoinLogoFile = path.join(logoFilePath, 'THISLogo.png');
        if (!fs.existsSync(templatesTempFilePath)) {
            fs.mkdirSync(templatesTempFilePath);
        }
        console.log(`done creating ${templatesTempFilePath}`);
        if (!fs.existsSync(templateFilePath)) {
            fs.mkdirSync(templateFilePath);
        }
        console.log(`done creating ${templateFilePath}`);
        if (!fs.existsSync(cssFilePath)) {
            fs.mkdirSync(cssFilePath);
        }
        console.log(`done creating ${cssFilePath}`);
        if (!fs.existsSync(logoFilePath)) {
            fs.mkdirSync(logoFilePath);
        }
        // console.log(`done creating ${logoFilePath}`)
        console.log(`templatesTempFilePath ${templatesTempFilePath}`);
        console.log(`templateFilePath ${templateFilePath}`);
        console.log(`cssFilePath ${cssFilePath}`);
        console.log(`htmlPath ${htmlPath}`);
        console.log(`subjectPath ${subjectPath}`);
        // console.log(`brikoinLogoFile ${brikoinLogoFile}`)
        // gs://firestone-1.appspot.com/emailTemplates/logo/brikoinLogo.png
        yield bucket.file(`emailTemplates/${request.template}/html.pug`).download({ destination: htmlPath });
        yield bucket.file(`emailTemplates/${request.template}/subject.pug`).download({ destination: subjectPath });
        yield bucket.file('emailTemplates/css/app.css').download({ destination: cssFile });
        yield bucket.file('emailTemplates/logo/brikoinLogo.png').download({ destination: brikoinLogoFile });
        console.log(`download emailTemplates/logo/brikoinLogo.png to ${brikoinLogoFile} done`);
        const localeFile = path.join(localeFilePath, `${request.locale}/translation.json`);
        if (request.locale) {
            if (!fs.existsSync(localeFilePath)) {
                yield fs.mkdirSync(localeFilePath);
            }
            if (!fs.existsSync(path.join(localeFilePath, `${request.locale}`))) {
                yield fs.mkdirSync(path.join(localeFilePath, `${request.locale}`));
            }
            yield bucket
                .file(`emailTemplates/locales/${request.locale}/translation.json`)
                .download({ destination: localeFile });
        }
        let email = new EmailTemplate({
            views: { root: templatesTempFilePath },
            message: {
                from: 'THIS@low.la',
                attachments: [
                    {
                        filename: 'brikoinLogo.png',
                        path: brikoinLogoFile,
                        cid: 'BrikoinLogo'
                    }
                ]
            },
            send: true,
            transport: transporter,
            i18n: {
                locales: request.locale ? [request.locale] : ['en'],
                directory: localeFilePath
            },
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: cssFilePath
                }
            }
        });
        console.log(`sending email to ${request.to}`);
        request.params.serverURL = functions.config().server.url;
        yield email.send({
            template: request.template,
            message: {
                to: request.to
            },
            locals: request.params
        });
        console.log('sending template mail done');
        fs.unlinkSync(htmlPath);
        fs.unlinkSync(subjectPath);
        fs.unlinkSync(cssFile);
        fs.unlinkSync(brikoinLogoFile);
        if (request.locale) {
            fs.unlinkSync(localeFile);
        }
    });
}
function callback() {
    console.log('sending mail done');
}
exports.callback = callback;
//# sourceMappingURL=email-functions.js.map