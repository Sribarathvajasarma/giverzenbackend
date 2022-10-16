const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")
const userCtrl = require("../controllers/userCtrl")

router.get('/anlistings', listingCtrl.getListings)
router.get('/users', userCtrl.getUsers)




module.exports = router