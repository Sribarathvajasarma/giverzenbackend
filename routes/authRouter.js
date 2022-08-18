const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.post('/register', authCtrl.register)

router.post('/login', authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)

router.patch('/edit_profile', authCtrl.editProfile)

router.post('/forgot', authCtrl.forgotPassword)

router.post('/confirmPinNumber',authCtrl.confirmpinNumber)

router.post('/reset', authCtrl.resetPassword)


module.exports = router