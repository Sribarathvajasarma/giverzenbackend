const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")


router.get('/anlistings', listingCtrl.getListings)





module.exports = router