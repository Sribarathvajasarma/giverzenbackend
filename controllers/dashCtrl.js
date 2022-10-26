const db = require('../config/db')

const dashCtrl = {
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