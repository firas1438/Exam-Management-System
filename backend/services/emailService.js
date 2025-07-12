const nodemailer = require("nodemailer");

const nodeMailer=async(to,subject,html)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "islemchammakhi@gmail.com",
          pass: process.env.EMAIL_PASS,
        },
      });
        const msg ={
          from: '"ISIMM 👻" islemchammakhi@gmail.com', // sender address
          to: to, // list of receivers
          subject: subject, // Subject line
          text: subject, // plain text body
          html: html, // html body
        }
       await transporter.sendMail(msg,(err,info)=>{
          if(err){
              console.log(err)
          } else {
              console.log("Message sent: %s", info.messageId);
          }
        });
}

module.exports = nodeMailer;