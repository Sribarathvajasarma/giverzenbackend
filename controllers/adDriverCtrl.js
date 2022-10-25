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
                  msg: "Delete sucessfully",
                });
              }
            }
          );
        } catch (err) {
          return res.status(500).json({ msg: err.message });
        }
      },
  
  
}

module.exports = adDriverCtrl