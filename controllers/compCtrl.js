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

    addComplaints: async (req, res) => {
        try {
            const { username,complaint,reportedto,date } = req.body

            db.query("INSERT INTO complaints ( username, complaint, reportedto,date) VALUES ('" + username + "', '" + complaint + "','" + reportedto + "','" + date + "')", (err, results) => {
                if (err) {
                    throw err
                }
                if (results){
                    res.json({
                        results
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteComplaints: async (req, res) => {
        try {
            


            db.query("DELETE FROM complaints", (err, ressults) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        msg: "Complaints removed successfully!"
                    })
                }

            })




        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = compCtrl