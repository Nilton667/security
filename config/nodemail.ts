import nodemailer from "nodemailer"

let configOptions = {
    host: 'mail.construvision.ao',
    port: 465,
    secure: true,
    secureConnection: true,
    auth: {
      user: 'geral@construvision.ao',
      pass: 'nnTTvision2022!',
    },
    tls: {
        rejectUnauthorized: false
    }
};

let transporter = nodemailer.createTransport(configOptions);

export default transporter;