const db = require('../config/db')
const Users = require('../models/userModel')


const userCtrl = {
    searchUser: async (req, res) => {
        try {
            await db.query("select id,username,avatar from user where username LIKE '%" + req.query.username + "%'", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length !== 0) {
                    res.json({ users: results })
                }
            })
            // const users = await Users.find({ username: { $regex: req.query.username } })
            //     .limit(10).select("username avatar")

            // res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, gender } = req.body

            if (!fullname) return res.status(400).json({ msg: "Please add your full name." })

            db.query("UPDATE user SET fullname='" + fullname + "', mobile='" + mobile + "' , address='" + address + "', gender='" + gender + "', avatar= '" + avatar + "' WHERE id= '" + req.user.id + "'", (err, ressults) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        msg: "Update Success!"
                    })
                }

            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    addCommiteeMember: async (req, res) => {
        try {
            const { fullname, username, email, password, gender, mobile, address } = req.body

            const role = 1;

            let newUserName = username.toLowerCase().replace(/ /g, '')
            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                username: newUserName

            })

            await newUser.save()
            const mongo_id = newUser._id

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

                                db.query("INSERT INTO user (fullname, username, email, password, gender, role, mobile, address, mongo_id) VALUES ('" + fullname + "','" + username + "', '" + email + "','" + passwordHash + "','" + gender + "','" + role + "', '" + mobile + "','" + address + "', '" + mongo_id + "')", (err3, results3) => {
                                    if (err3) {
                                        throw (err3)

                                    }
                                    if (results3) {
                                        db.query("SELECT * FROM user where username = '" + username + "'", (err4, results4) => {
                                            if (err4) {
                                                throw err4
                                            }
                                            if (results4) {


                                                res.json({
                                                    msg: 'Commitee Member Added Successfully',
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

    getCommiteeMembers: async (req, res) => {
        try {
            db.query("SELECT * FROM user where role=1", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No members found',
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


    editCommiteeMember: async (req, res) => {
        try {
            const { id, fullname, mobile, address, gender } = req.body

            if (!fullname) return res.status(400).json({ msg: "Please add your full name." })

            db.query("UPDATE user SET fullname='" + fullname + "', mobile='" + mobile + "' , address='" + address + "', gender='" + gender + "'  WHERE id= '" + id + "'", (err, ressults) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        msg: "Member details updated Successfully!"
                    })
                }

            })




        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteCommiteeMember: async (req, res) => {
        try {
            const { id } = req.body


            db.query("DELETE FROM user WHERE id= '" + id + "'", (err, ressults) => {
                if (err) {
                    throw err
                } else {
                    res.json({
                        msg: "Member removed successfully!"
                    })
                }

            })




        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getCoordinates: async (req, res) => {
        try {
            db.query("SELECT * FROM cordinates", (err, results) => {
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No members found',
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

module.exports = userCtrl