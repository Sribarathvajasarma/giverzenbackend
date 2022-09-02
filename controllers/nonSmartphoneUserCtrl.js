const db = require('../config/db')


const nonSmartphoneUserCtrl= {
    

register: async(req, res) => {
    try{
        const { username,phonenumber,longitude,latitude,listingdistance } = req.body

      

        let newUserName = username.toLowerCase().replace(/ /g, '')

        

        db.query("SELECT * FROM nonsmartphoneuser where username = '" + newUserName + "'", (err, results) => {
            if (err) {
                throw err;
            }
            if (results.length !== 0) {
                return res.status(400).json({ msg: "This user name already exists." })
            } else
        db.query( "INSERT INTO nonsmartphoneuser ( username, phonenumber, longitude, latitude, listingdistance) VALUES ('" + username + "', '" + phonenumber + "','" + longitude + "','" + latitude + "','" + listingdistance + "')", (err3, results3) => {
            if (err3) {
                throw (err3)

            }
            if (results3) {
                res.json({
                    msg: 'non smart phone user Added Successfully',
                   
        
                })
            }
        })})
        

       // res.json({msg: "Register success"})
    }
    catch (err){
      return res.status(500).json({ msg: err.message })  
    }
}
}
    module.exports=nonSmartphoneUserCtrl;