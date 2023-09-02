import nodemailer from "nodemailer"

let configOptions = {
    host: 'mail.diversus.ao',
    port: 465,
    secure: true,
    secureConnection: true,
    auth: {
      user: 'nilton.manuel@diversus.ao',
      pass: 'DVnilton2000',
    },
    tls: {
      rejectUnauthorized: false
    }
};

let Transporter = nodemailer.createTransport(configOptions);

async function SendEmail({to, text} : {to: string, text: string}){
  try {
    const info = await nodemailer.createTransport(configOptions).sendMail({
      from: '"Horizon" <geral@diversus.ao>',
      to: to,
      subject: "HorizonPay",
      text: text,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

export {Transporter, SendEmail};