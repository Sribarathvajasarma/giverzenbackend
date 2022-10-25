const router = require('express').Router()
const nonSmartphoneUserCtrl = require("../controllers/nonSmartphoneUserCtrl")

// .post('/nonsmartphoneuser_add', nonSmartphoneUserCtrl.addUser)
router.post('/nonsmartphoneuser_register', nonSmartphoneUserCtrl.register)
router.post('/nonsmartphoneuser_sendsms', nonSmartphoneUserCtrl.sendSMS)
router.post('/nonsmartphoneuser_sendmsg', nonSmartphoneUserCtrl.sendmsg)

module.exports = router
