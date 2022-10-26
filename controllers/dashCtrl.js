const db = require('../config/db')

const dashCtrl = {
    // selecting user count in admin dashboard
    getTotusers: async (req, res) => {
        try {
            db.query("Select count(id) as count1 FROM user", (err, results) => {
                if (err) {
                    throw err
                }
                 {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
 //  select listing count in admin dashboard
    getTotlistings: async (req, res) => {
        try {
            db.query("Select count(id) as count3 FROM listings", (err, results) => {
                if (err) {
                    throw err
                }
                 {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //select driver count in admin dashboard
    getTotdrivers: async (req, res) => {
        try {
            db.query("Select count(id) as count4 FROM driver", (err, results) => {
                if (err) {
                    throw err
                }
                 {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
// select complaint count in admin dashboard
    getTotcomplaints: async (req, res) => {
        try {
            db.query("Select count(complaint_id) as count2 FROM complaints", (err, results) => {
                if (err) {
                    throw err
                }
                 {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //select request count in admin dashboard
    getTotwanted: async (req, res) => {
        try {
            db.query("Select count(id) as count5 FROM requests", (err, results) => {
                if (err) {
                    throw err
                }
                 {
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = dashCtrl