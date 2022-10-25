const db = require("../config/db");

const manageuserCtrl = {

    //   deleteUser: async (req, res) => {
    //     try {
    //       const id = req.params.id;
    //       db.query(
    //         "DELETE FROM user where id = ?",
    //         id,
    //         (err, results) => {
    //           if (err) throw err;
    //           else {
    //             console.log(results);
    //             res.json({
    //               msg: "Delete sucessfully",
    //             });
    //           }
    //         }
    //       );
    //     } catch (err) {
    //       return res.status(500).json({ msg: err.message });
    //     }
    //   },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            db.query(
              "DELETE FROM user where id= ?",
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
            return res.status(500).json({ msg: err.message })
        }
    
    }

};

module.exports = manageuserCtrl;