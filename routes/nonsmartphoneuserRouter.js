const router = require('express').Router()
const nonSmartphoneUserCtrl = require("../controllers/nonSmartphoneUserCtrl")


router.post('/nonsmartphoneuser_register', nonSmartphoneUserCtrl.register)


module.exports = router
