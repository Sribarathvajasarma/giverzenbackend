const router = require('express').Router()
const nonSmartphoneUserCtrl = require("../controllers/nonSmartphoneUserCtrl")

// .post('/nonsmartphoneuser_add', nonSmartphoneUserCtrl.addUser)
router.post('/nonsmartphoneuser_register', nonSmartphoneUserCtrl.register)

module.exports = router
