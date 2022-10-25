const db = require('../config/db')
const axios = require("axios")


const listingCtrl = {
    getListings: async (req, res) => {
        try {
            db.query("SELECT * FROM listings", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No listings found',
                    })
                } else {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    addListings: async (req, res) => {
        try {
            const { poster_id, name, description, quantity, longitude, latitude, avatar, expires_in, type, phone } = req.body
            const status = "available"
            const requester_id = 0


            db.query("INSERT INTO listings (poster_id, name, description, quantity, longitude, latitude, avatar, expires_in, type,status,requester_id, phone) VALUES ('" + poster_id + "','" + name + "', '" + description + "','" + quantity + "','" + longitude + "','" + latitude + "', '" + avatar + "','" + expires_in + "', '" + type + "', '" + status + "','" + requester_id + "', '" + phone + "')", async (err, results) => {
                if (err) {
                    throw err;
                }

                if (results) {
                    res.json({
                        msg: 'listing Added Successfully',
                        code: 1,


                    })

                    db.query("SELECT * FROM nonsmartphoneuser", (err1, results1) => {
                        if (err1) {
                            throw err1;
                        }
                        else if (results1.length === 0) {
                            console.log(results1.length)
                            res.json({
                                msg: 'No users found',
                            })
                        } else {
                            results1.map((item, index) => {
                                var point_distance = getHaversineDistance(latitude, longitude, item.latitude, item.longitude)
                                if (point_distance <= 1.00000) {

                                    console.log(point_distance)
                                    console.log(phone)

                                    var phoneNo = item.phonenumber
                                    console.log(phoneNo)

                                    // var phone1 = `https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=GIVERSZEN&to=${item.phonenumber}&message=Please contact this mobile number and collect the item. mobilenumber=${phone}`

                                    // console.log(phone1)

                                        axios({

                                        method:"POST",
                                        url :`https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=NotifyDEMO&to=${item.phonenumber}&message=There is a listing posted nearby your area. If you want that,Please contact this mobile number and collect the item. mobilenumber=${phone}`,

                                    })


                                } else {
                                    console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
                                }


                            })







                            // var longitude2 = results1[0].longitude
                            //  var latitude2 =  results1[0].latitude
                            // console.log(latitude)
                            // console.log(longitude)
                            // console.log(latitude3)
                            // console.log(longitude3)
                            // console.log(phonenumber1)


                            //var point_distance = getHaversineDistance(latitude, longitude, latitude3, longitude3)


                            //console.log(point_distance)
                            //if(point_distance <= 1.00000){

                            //var phoneNo = results1[0].phonenumber
                            //console.log(phoneNo)


                            //     axios({

                            //     method:"POST",
                            //     url :`https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=NotifyDEMO&to=${results1[0].phonenumber}&message=Testthuve`,

                            // })

                            //} 
                            function getHaversineDistance(lat1, lon1, lat2, lon2) {
                                var R = 6371; // Radius of the earth in km
                                var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                                var dLon = deg2rad(lon2 - lon1);
                                var a =
                                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                                    ;
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                var d = R * c; // Distance in km
                                return d;
                            }

                            function deg2rad(deg) {
                                return deg * (Math.PI / 180)
                            }


                            // var phone = `https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=NotifyDEMO&to=${results1[0].phonenumber}&message=Testthuve`

                            // console.log(phone)
                            // axios({

                            //     method:"POST",
                            //     url :`https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=NotifyDEMO&to=${results1[0].phonenumber}&message=Testthuve`,

                            // })

                        }

                    }
                    )
                }


            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    addRequests: async (req, res) => {
        try {
            const { requester_id, listings_id } = req.body
            db.query("SELECT * FROM requests WHERE listings_id='" + listings_id + "' AND requester_id='" + requester_id + "'", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length !== 0) {
                    res.json({
                        msg: 'Listings already requested',
                    })
                } else {
                    db.query("INSERT INTO requests (listings_id, requester_id) VALUES ('" + listings_id + "','" + requester_id + "')", (err2, results2) => {
                        if (err2) {
                            throw err2
                        }

                        else {
                            res.json({
                                msg: 'Listing requested successfully',
                            })
                        }

                    })
                }
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },


    getRequests: async (req, res) => {
        try {
            const { id } = req.body
            db.query("SELECT requests.id,requests.listings_id,requests.requester_id,requests.created_at,user.avatar,user.username,user.latitude,user.longitude FROM requests,user where requests.listings_id = '" + id + "' AND user.id = requests.requester_id", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No requests found',
                    })
                } else {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    deleteRequest: async (req, res) => {
        try {
            const { requester_id, listings_id } = req.body
            await db.query("SELECT * FROM requests WHERE listings_id='" + listings_id + "' AND requester_id='" + requester_id + "'", async (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No requests found',
                    })
                } else {
                    await db.query("DELETE FROM requests WHERE listings_id='" + listings_id + "' AND requester_id='" + requester_id + "'", (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        else {
                            res.json({
                                msg: 'Request removed',
                            })
                        }

                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    acceptRequest: async (req, res) => {
        try {
            const { requester_id, listings_id } = req.body
            await db.query("UPDATE listings SET requester_id='" + requester_id + "',status='taken' WHERE id='" + listings_id + "'", async (err, results) => {
                if (err) {
                    throw err
                }
                else {
                    await db.query("DELETE FROM requests WHERE listings_id='" + listings_id + "'", (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        else {
                            res.json({
                                msg: 'Request accepted',
                            })
                        }
                    })
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })

        }
    },

    checkRequested: async (req, res) => {
        try {
            const { requester_id, listings_id } = req.body
            db.query("SELECT * FROM requests WHERE listings_id='" + listings_id + "' AND requester_id='" + requester_id + "'", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length !== 0) {
                    res.json({
                        code: 1
                    })
                } else {
                    res.json({
                        code: 0
                    })
                }
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    getDrivers: async (req, res) => {
        try {
            db.query("SELECT * FROM driver", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No Available Drivers found',
                    })
                } else {
                    res.json({
                        results
                    })
                }
            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    addDriverRequest: async (req, res) => {
        try {
            const { user_id, driver_id, listing_id, pickup_longitude, pickup_latitude, dest_longitude, dest_latitude, user_avatar, driver_avatar, user_name, driver_name } = req.body
            const status = "Requested"
            db.query("INSERT INTO request_driver (user_id, driver_id, listing_id,status,pickup_longitude, pickup_latitude, dest_longitude, dest_latitude, user_avatar, driver_avatar, user_name, driver_name) VALUES ('" + user_id + "','" + driver_id + "', '" + listing_id + "','" + status + "','" + pickup_longitude + "','" + pickup_latitude + "','" + dest_longitude + "','" + dest_latitude + "','" + user_avatar + "','" + driver_avatar + "','" + user_name + "','" + driver_name + "')", (err, results) => {
                if (err) {
                    throw err;
                }

                if (results) {
                    res.json({
                        msg: 'Driver requested Successfully',
                        code: 1


                    })
                }


            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    getDriverRequests: async (req, res) => {
        try {
            db.query("Select * from request_driver", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No driver reuqest found',
                    })
                } else {
                    res.json({
                        results
                    })
                }


            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }








}

module.exports = listingCtrl