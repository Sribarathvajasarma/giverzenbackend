const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")




router.get('/listings', listingCtrl.getListings)

router.post('/add_listings', listingCtrl.addListings)

router.get('/get_requests', listingCtrl.getRequests)

router.post('/add_request', listingCtrl.addRequests)

router.delete('/delete_request', listingCtrl.deleteRequest)

router.post('/accept_request', listingCtrl.acceptRequest)

router.post('/accept', listingCtrl.getListings)


module.exports = router