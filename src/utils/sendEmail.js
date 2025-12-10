const nodemailer = require("nodemailer");

// handler the mail service
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "javier.okon98@ethereal.email",
    pass: "s9Dh5DVtBXXJNa5TzW",
  },
});

const sendMessage = (mailOptions) => {
  /* const mailOptions = {
        from: "",
        to: "",
        subject: "",
        text: ""
    } */

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error Sending Message:", error.message);
    }

    console.log(`Message Sent: ${info.messageId} - ${info.response}`);
  });
};

module.exports = sendMessage;
