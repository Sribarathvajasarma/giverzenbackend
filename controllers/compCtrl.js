const db = require('../config/db')

const compCtrl = {
    getComplaints: async (req, res) => {
        try {
            db.query("SELECT * FROM complaints", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No complaints found',
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

}

module.exports = compCtrl