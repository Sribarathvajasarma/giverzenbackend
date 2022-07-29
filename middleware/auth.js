const jwt = require('jsonwebtoken')
const db = require('../config/db')


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if (!token) return res.status(400).json({ msg: "Invalid Authentication." })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) return res.status(400).json({ msg: "Invalid Authentication." })

        db.query("SELECT * FROM user where id = '" + decoded.id + "'", (err, results) => {
            if (err) {
                throw err
            } else {
                const user = results[0]
                req.user = user
                next()
            }
        })


    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}


module.exports = auth