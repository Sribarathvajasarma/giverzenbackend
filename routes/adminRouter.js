const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")
const userCtrl = require("../controllers/userCtrl")
const compCtrl = require("../controllers/compCtrl")

router.get('/anlistings', listingCtrl.getListings)
router.get('/users', userCtrl.getUsers)
router.get('/complaints', compCtrl.getComplaints)



module.exports = router