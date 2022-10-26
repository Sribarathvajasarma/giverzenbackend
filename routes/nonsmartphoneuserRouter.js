const router = require('express').Router()
const nonSmartphoneUserCtrl = require("../controllers/nonSmartphoneUserCtrl")

// nonsmartphoneuser part

router.post('/nonsmartphoneuser_register', nonSmartphoneUserCtrl.register)


module.exports = router
