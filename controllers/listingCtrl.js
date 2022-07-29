const db = require('../config/db')

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
            const { poster_id, name, description, quantity, longitude, latitude, avatar, expires_in, type } = req.body
            const status = "available"
            const requester_id = 0


            db.query("INSERT INTO listings (poster_id, name, description, quantity, longitude, latitude, avatar, expires_in, type,status,requester_id) VALUES ('" + poster_id + "','" + name + "', '" + description + "','" + quantity + "','" + longitude + "','" + latitude + "', '" + avatar + "','" + expires_in + "', '" + type + "', '" + status + "','" + requester_id + "')", (err, results) => {
                if (err) {
                    throw err;
                }

                if (results) {
                    res.json({
                        msg: 'listing Added Successfully',
                        code: 1


                    })
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
            db.query("SELECT requests.id,requests.listings_id,requests.requester_id,requests.created_at,user.avatar,user.username FROM requests,user where requests.listings_id = '" + id + "' AND user.id = requests.requester_id", (err, results) => {
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
    }





}

module.exports = listingCtrl