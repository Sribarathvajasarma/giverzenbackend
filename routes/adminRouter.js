const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")
const userCtrl = require("../controllers/userCtrl")
const compCtrl = require("../controllers/compCtrl")
const adminauthCtrl = require("../controllers/adminauthCtrl")
const adDriverCtrl = require("../controllers/adDriverCtrl")

router.get('/anlistings', listingCtrl.getListings)
router.get('/users', userCtrl.getUsers)
router.get('/complaints', compCtrl.getComplaints)
router.post('/adlogin', adminauthCtrl.adlogin)
router.get('/drivers', adDriverCtrl.getDrivers)

module.exports = router