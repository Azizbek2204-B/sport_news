const { createOtp, verifyOpt } = require("../controllers/otp.controller")

const router = require("express").Router()

router.post("/createopt", createOtp)
router.post("/verifyotp", verifyOpt)

module.exports = router