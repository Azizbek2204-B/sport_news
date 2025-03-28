const { addMinutesToDate } = require("../helpers/add_minutes")
const { errorHandler } = require("../helpers/error_handler")
const otpGenerator = require("otp-generator")
const config = require('config');
const pool = require("../config/db");
const uuid = require('uuid');
const { encode, decode } = require("../helpers/crypt");
const mailServer = require("../services/mail.server");
const smsService = require("../services/sms.service");

const createOtp = async (req, res)=>{
    try {
        const {phone_number}=req.body
        const otp = otpGenerator.generate(4, {
            digits:true,
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        const now = new Date()
        const expirationTime = addMinutesToDate(now, config.get("expiration_minute"))
        const newOtp = await pool.query(`INSERT INTO otp (id, otp, expiration_time) VALUES ($1, $2, $3) RETURNING id`, [uuid.v4(), otp, expirationTime])

        //send otp to SMS, email, bot ...
        await mailServer.sendActivationMail(config.get("smtp_user"), otp)
        const response = await smsService.sendSms(phone_number, otp)

        if (response.status != 200) {
            return res.status(503).send({message:"OTP yuborishda xatolik"})
        }

        const message = `Code has been send to user ${phone_number.slice(phone_number.length - 4)}`

        const details = {
            timestamp:now,
            phone_number,
            otp_id:newOtp.rows[0].id
        }

        const encodedData = await encode(JSON.stringify(details))

        res.status(201).send({verification_key:encodedData, message})
    } catch (error) {
        errorHandler(error, res)
    }
}

const verifyOpt = async(req, res)=>{
    try {
        const {verification_key, phone_number, otp} = req.body
        const now = new Date()
        const decodedData = await decode(verification_key)
        const details = JSON.parse(decodedData)
        if (details.phone_number != phone_number) {
            const response = {
                Status:"Failure",
                Message:"OPT bu raqamga yuborilmagan"
            }
            return res.status(400).send(response)
        }
        const otpData = await pool.query(`SELECT * FROM otp WHERE id=$1`, [details.otp_id])
        const otpResult = otpData.rows[0]
        // console.log(otpResult);
        // res.send(otpResult)

        if (otpData.rowCount == 0) {
            const response = {
                Status:"Failure",
                Message:"OPT topilmadi"
            }
            return res.status(400).send(response)
        }
        if (otpResult.verified == true) {
            const response = {
                Status:"Failure",
                Message:"OPTdan avval foydalanilgan"
            }
            return res.status(400).send(response)
        }
        if(otpResult.expiration_time < now){
            const response = {
                Status:"Failure",
                Message:"OPTning vaqti chiqib ketgan"
            }
            return res.status(400).send(response)
        }
        if(otpResult.otp !=otp){
            const response = {
                Status:"Failure",
                Message:"OPT mos emas"
            }
            return res.status(400).send(response)
        }

        await pool.query(`UPDATE otp SET verified=true WHERE id=$1`,[otpResult.id])
        //yangi usermi yoki eski user

        let userId, isNew;

        const userData = await pool.query(`SELECT * FROM users WHERE phone_number=$1`, phone_number)

        if (userData.rows.length==0) {
            const newUser = await pool.query(`INSERT INTO users(phone_number,is_active) VALUES ($1, true) RETURING id`,[phone_number])
            userId = newUser.rows[0].id
            isNew = true
        }else{
            userId = userData.rows[0].id
            isNew = false
        }

        const response = {
            Status:"Success",
            userId,
            isNew
        }
        return res.status(200).send(response)
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    createOtp,
    verifyOpt
}