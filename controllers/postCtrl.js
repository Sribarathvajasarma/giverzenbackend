const db = require("../config/db");

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { category, Description, postImage, userID } = req.body;
      db.query(
        "INSERT INTO forumposts (category,Description,postImage,userID) VALUES ('" +
          category +
          "','" +
          Description +
          "', '" +
          postImage +
          "','" +
          userID +
          "')",
        (err, results) => {
          if (err) {
            throw err;
          } else {
            res.json({
                msg: "Posted succesfully ",
                code: 1,
                results
              });
          }
        }
      );

     
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPosts: async (req, res) => {
    db.query(
      "SELECT user.avatar,user.username,user.email,forumposts.category,forumposts.Description,forumposts.postImage FROM user INNER JOIN forumposts on user.id=forumposts.userID",
      (err, results) => {
        if (err) throw err;
        else {
          res.json({
            results,
          });
        }
      }
    );
  },
  
  updatePost: async (req, res) => {
    const id = req.params.id;
    const { category, Description, postImage, userID } = req.body;
    db.query("select * from forumposts where postid = ?",
    id,
   
    (err,results)=>{
        if(err) throw err;
        else {
            db.query("UPDATE forumposts SET category = ? ,Description = ? ,postImage = ? where postid = ?",
            [category,Description,postImage,id],
             (err2,results2)=>{
                if(err2) throw err2
                else {
                    res.json({
                        results2,
                        msg :"Update SucessFully "
                    })
                }
             }
            )
        }
    }
    );
  },
  getPost: async (req, res) => {
    try {
      const id = req.params.id;
      db.query(
        "SELECT user.avatar,user.username,user.email,forumposts.category,forumposts.Description,forumposts.postImage FROM user INNER JOIN forumposts on user.id=forumposts.userID where postid = ?",
        id,
        (err, results) => {
          if (err) throw err;
          else {
            res.json({
              results,
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const id = req.params.id;
      db.query(
        "DELETE FROM forumposts where postID = ?",
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
};

module.exports = postCtrl;
