const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY2)
console.log(process.env.SENDGRID_API_KEY2);
const msg = {
  to: 'prikollist85@gmail.com', // Change to your recipient
  from: 'gal4enock86@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })