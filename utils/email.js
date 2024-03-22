// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    // return nodemailer.createTransport({
    //   service: 'SendGrid',
    //   auth: {
    //     user: process.env.SENDGRID_USERNAME,
    //     pass: process.env.SENDGRID_PASSWORD
    //   }
    // });
    return nodemailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // res.render('')
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Danyl Slabukho node.js Okr');
  }

  async sendPasswordRest() {
    await this.send('passwordReset', 'Password Reset Token (10 minutes valid)');
  }
};

const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM}`,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
};

// module.exports = Email;
