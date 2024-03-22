const nodemailer = require("nodemailer");
const ejs = require("ejs")


let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


function sendMail(email, otp) {
    ejs.renderFile(__dirname + '/mailTemplate/index.ejs', { otp }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let options = {
                to: email,
                from: process.env.NODEMAILER_EMAIL,
                subject: `SparkLine - OTP ${otp}`,
                html: data
            }
            transport.sendMail(options, (err, info) => {
                if (err) { return console.log(err); }
                console.log('Message sent: %s', info.messageId)
            })
        }
    })
}

module.exports = sendMail;