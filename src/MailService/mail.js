const auth_config = require('./config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: auth_config
});

const mailOptions = {
  from: 'user@gmail.com',
  to: 'user1@gmail.com',
  subject: 'Test Mail',
  text: 'How are you?'
};

exports.sendEmail = () => {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
