'use strict'

const nodemailer = require('nodemailer')
const EmailTemplate = require('email-templates')
const path = require('path')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'THIS@low.la',
    pass: 's3EE2rzhRtxA'
  }
})

export function Email () {
}

Email.send = Email.prototype.send = function (template, to, locals, callback) {
  console.log(`sending email template ${template} to:${to} locals=${JSON.stringify(locals)}`)
  let email = new EmailTemplate({
    views: { root: path.join(__dirname, 'emailSender/templates') },
    message: {
      from: 'THIS@low.la'
    },
    send: true,
    transport: transporter,
    i18n: {
      locales: ['en'],
      directory: path.join(__dirname, 'emailSender/locales')
    },
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.join(__dirname,'emailSender/css')
      }
    }
  })

  email
    .send({
      template: template,
      message: {
        to: to
      },
      locals: locals
    })
    .then(console.log)
    .catch(console.error)
  callback(null)
}

Email.sendTest =
  Email.prototype.sendTest = function (callback) {
    // see https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799
    const mailOptions = {
      from: 'THIS@low.la', // sender address
      to: 'roi.g.landshut@gmail.com', // list of receivers
      subject: 'Subject of your email', // Subject line
      html: '<p>Your html here</p>'// plain text body
    }

    transporter.sendMail(mailOptions, callback)
  }

Email.prototype.handleFreeTier = function (payer, callback) {
}

module.exports = Email
