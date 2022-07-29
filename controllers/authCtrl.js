const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const Users = require('../models/userModel')


const authCtrl = {
    register: async (req, res) => {
        try {
            const { username, email, password, longitude, latitude } = req.body



            let newUserName = username.toLowerCase().replace(/ /g, '')
            const passwordHash = await bcrypt.hash(password, 12)



            db.query("SELECT * FROM user where username = '" + newUserName + "'", (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.length !== 0) {
                    return res.status(400).json({ msg: "This user name already exists." })
                } else {
                    db.query("SELECT * FROM user where email = '" + email + "'", (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        if (results2.length !== 0) {
                            return res.status(400).json({ msg: "This email already exists." })
                        } else {
                            if (password.length < 6)
                                return res.status(400).json({ msg: "Password must be at least 6 characters." })
                            else {

                                db.query("INSERT INTO user (username, email, password, longitude, latitude) VALUES ('" + username + "','" + email + "','" + passwordHash + "','" + longitude + "','" + latitude + "')", (err3, results3) => {
                                    if (err3) {
                                        throw (err3)

                                    }
                                    if (results3) {
                                        db.query("SELECT * FROM user where username = '" + username + "'", (err4, results4) => {
                                            if (err4) {
                                                throw err4
                                            }
                                            if (results4) {
                                                const access_token = createAccessToken({ id: results4[0].id })



                                                res.json({
                                                    msg: 'Register Success',
                                                    access_token,
                                                    user: {
                                                        ...results4[0],
                                                        password: ''
                                                    }

                                                })
                                            }
                                        })
                                    }
                                })


                            }

                        }
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body


            db.query("SELECT * FROM user where email = '" + email + "'", async (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    return res.status(400).json({ msg: "This email does not exist." })
                }
                else {
                    const isMatch = await bcrypt.compare(password, results[0].password)

                    if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" })

                    else {
                        const access_token = createAccessToken({ id: results[0].id })



                        res.json({
                            msg: 'Login Success',
                            access_token,
                            user: {
                                ...results[0],
                                password: ''
                            }


                        })
                    }



                }



            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: "Logged out!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Please login now." })
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err) return res.status(400).json({ msg: "Please login now." })

                db.query("SELECT * FROM user where id = '" + result.id + "'", async (err, results) => {
                    if (err) {
                        throw err
                    }
                    if (result.length === 0) {
                        return res.status(400).json({ msg: "This does not exist." })
                    } else {
                        const access_token = createAccessToken({ id: result.id })
                        res.json({
                            access_token,
                            user: {
                                ...results[0],
                                password: ''
                            }
                        })
                    }
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    editProfile: async (req, res) => {
        try {
            const { id, username, email, about, image, phone, password, longitude, latitude } = req.body



            let newUserName = username.toLowerCase().replace(/ /g, '')
            const passwordHash = await bcrypt.hash(password, 12)



            db.query("SELECT * FROM user where username = '" + newUserName + "'", (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.length !== 0 && results[0].id !== id) {
                    return res.status(400).json({ msg: "This user name already exists." })
                } else {
                    db.query("SELECT * FROM user where email = '" + email + "'", (err2, results2) => {
                        if (err2) {
                            throw err2
                        }
                        if (results2.length !== 0 && results2[0].id !== id) {
                            return res.status(400).json({ msg: "This email already exists." })
                        } else {
                            if (password.length < 6)
                                return res.status(400).json({ msg: "Password must be at least 6 characters." })
                            else {
                                db.query("UPDATE user SET username='" + username + "', email='" + email + "' , about='" + about + "', avatar='" + image + "', phone= '" + phone + "' , password='" + passwordHash + "' , longitude='" + longitude + "' , latitude='" + latitude + "' WHERE id= '" + id + "'", (err, ressults) => {
                                    if (err) {
                                        throw err
                                    } else {
                                        res.json({
                                            msg: "Update Success!"
                                        })
                                    }

                                })




                            }

                        }
                    })
                }

            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }


    }


}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })

}

module.exports = authCtrl