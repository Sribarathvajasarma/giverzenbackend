const db = require('../config/db')

const adDriverCtrl = {
    getDrivers: async (req, res) => {
      //get drivers
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
    // Delete driver
    deleteDriver: async (req, res) => {
        try {
          const id = req.params.id;
          db.query(
            "DELETE FROM driver where id = ?",
            id,
            (err, results) => {
              if (err) throw err;
              
              else {
                console.log(results);
                res.json({
                  msg: "Delete successfully",
                });
              }
            }
          );
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
   // addDriver
      addDriver: async (req, res) => {
        try {
            const { drivername, vehicle, costperkm, status } = req.body
            db.query("INSERT INTO driver (drivername,vehicle, costperkm, status) VALUES ('" + drivername + "', '" + vehicle + "','" + costperkm + "','" + status + "')", (err, results) => {
                if (err) {
                    throw err;
                }

                if (results) {
                    res.json({
                        msg: 'Driver Added Successfully',
                    })
                }


            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = adDriverCtrl