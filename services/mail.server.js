const nodemailer = require('nodemailer');
const config = require('config');

class MailService{
    constructor(){
        this.tramsporter = nodemailer.createTransport({
            service:"gmail",
            host:config.get("smtp_host"),
            port:config.get("smtp_port"),
            secure:false,
            auth:{
                user:config.get("smtp_user"),
                pass:config.get("smtp_password")
            }
        })
    }
    async sendActivationMail(toEmail, link){
        await this.tramsporter.sendMail({
            from:config.get("smtp_user"),
            to:toEmail,
            subject:"Express Cargo akkountni faollashtirish",
            text:"",
            html:`
            <>
                <h3>Sizning otp kodingiz</h3>
                <h5>${link}</h5>
            </<div>`
        })
    }
}

module.exports = new MailService()