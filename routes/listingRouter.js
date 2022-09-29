const router = require('express').Router()
const listingCtrl = require("../controllers/listingCtrl")




router.get('/listings', listingCtrl.getListings)

router.post('/add_listings', listingCtrl.addListings)

router.post('/get_requests', listingCtrl.getRequests)

router.post('/add_request', listingCtrl.addRequests)

router.delete('/delete_request', listingCtrl.deleteRequest)

router.post('/accept_request', listingCtrl.acceptRequest)

router.post('/check_request', listingCtrl.checkRequested)

router.get('/get_drivers', listingCtrl.getDrivers)

router.post('/add_driver_request', listingCtrl.addDriverRequest)

router.get('/get_driver_requests', listingCtrl.getDriverRequests)


module.exports = router