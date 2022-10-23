const db = require('../config/db')

const adDriverCtrl = {
    getDrivers: async (req, res) => {
        try {
            db.query("SELECT * FROM driver", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'Drivers found',
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

module.exports = adDriverCtrl