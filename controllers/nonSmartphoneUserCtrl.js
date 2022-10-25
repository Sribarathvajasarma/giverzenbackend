const db = require('../config/db')
const axios = require("axios");

const nonSmartphoneUserCtrl = {


    register: async (req, res) => {
        try {
            const { username, phonenumber, longitude, latitude, listingdistance } = req.body

            if (!username || !phonenumber || !longitude || !latitude || !listingdistance)
                return res.status(400).json({ msg: "please fill in all fields!" })

            let newUserName = username.toLowerCase().replace(/ /g, '')



            db.query("SELECT * FROM nonsmartphoneuser where username = '" + newUserName + "'", (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.length !== 0) {
                    return res.status(400).json({ msg: "This user name already exists." })
                } else
                    db.query("INSERT INTO nonsmartphoneuser ( username, phonenumber, longitude, latitude, listingdistance) VALUES ('" + username + "', '" + phonenumber + "','" + longitude + "','" + latitude + "','" + listingdistance + "')", (err3, results3) => {
                        if (err3) {
                            throw (err3)

                        }
                        if (results3) {
                            res.json({
                                msg: 'non smart phone user Added Successfully',


                            })
                        }
                    })
            })


            // res.json({msg: "Register success"})
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    sendmsg: async (req, res) => {
        try {
            db.query("SELECT * FROM nonsmartphoneuser", (err, results) => {
                //    const { id, username,phonenumber, longitude,latitude,listingdistance} = res.body

                console.log(results);
               
                if (err) {
                    throw err
                }
                if (results.length === 0) {
                    res.json({
                        msg: 'No users found',
                    })
                } else {
                    axios({

                        method: "POST",
                        url: ` https://app.notify.lk/api/v1/send?user_id=23241&api_key=eNUuqBMwsTQ66DypMWT3&sender_id=NotifyDEMO&to='"+phonenumber+"'&message=Testthuvethika`,

                    })
                    res.json({
                        msg: 'listings Added Successfully',
 })
                }

            })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },



}
module.exports = nonSmartphoneUserCtrl;