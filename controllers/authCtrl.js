const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Users = require("../models/userModel");
const sendMail = require("./sendMail");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const authCtrl = {
  //user register function
  register: async (req, res) => {
    try {
      const { username, email, password, longitude, latitude } = req.body;

      let newUserName = username.toLowerCase().replace(/ /g, "");
      const passwordHash = await bcrypt.hash(password, 12);

      db.query(
        "SELECT * FROM user where username = '" + newUserName + "'",
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length !== 0) {
            return res
              .status(400)
              .json({ msg: "This user name already exists." });
          } else {
            db.query(
              "SELECT * FROM user where email = '" + email + "'",
              (err2, results2) => {
                if (err2) {
                  throw err2;
                }
                if (results2.length !== 0) {
                  return res
                    .status(400)
                    .json({ msg: "This email already exists." });
                } else {
                  if (password.length < 6)
                    return res
                      .status(400)
                      .json({ msg: "Password must be at least 6 characters." });
                  else {
                    db.query(
                      "INSERT INTO user (username, email, password, longitude, latitude) VALUES ('" +
                      username +
                      "','" +
                      email +
                      "','" +
                      passwordHash +
                      "','" +
                      longitude +
                      "','" +
                      latitude +
                      "')",
                      (err3, results3) => {
                        if (err3) {
                          throw err3;
                        }
                        if (results3) {
                          db.query(
                            "SELECT * FROM user where username = '" +
                            username +
                            "'",
                            (err4, results4) => {
                              if (err4) {
                                throw err4;
                              }
                              if (results4) {
                                const access_token = createAccessToken({
                                  id: results4[0].id,
                                });

                                res.json({
                                  msg: "Register Success",
                                  access_token,
                                  user: {
                                    ...results4[0],
                                    password: "",
                                  },
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //user login function
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      db.query(
        "SELECT * FROM user where email = '" + email + "'",
        async (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length === 0) {
            return res.status(400).json({ msg: "This email does not exist." });
          } else {
            const isMatch = await bcrypt.compare(password, results[0].password);

            if (!isMatch)
              return res.status(400).json({ msg: "Password is incorrect" });
            else {
              const access_token = createAccessToken({ id: results[0].id });

              res.json({
                msg: "Login Success",
                access_token,
                user: {
                  ...results[0],
                  password: "",
                },
              });
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // user logout function
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // generate access token to login
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now." });
      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now." });

          db.query(
            "SELECT * FROM user where id = '" + result.id + "'",
            async (err, results) => {
              if (err) {
                throw err;
              }
              if (result.length === 0) {
                return res.status(400).json({ msg: "This does not exist." });
              } else {
                const access_token = createAccessToken({ id: result.id });
                res.json({
                  access_token,
                  user: {
                    ...results[0],
                    password: "",
                  },
                });
              }
            }
          );
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },


  // user edit profile function 

  editProfile: async (req, res) => {
    try {
      const {
        id,
        username,
        email,
        about,
        image,
        phone,
        password,
        longitude,
        latitude,
      } = req.body;

      let newUserName = username.toLowerCase().replace(/ /g, "");
      const passwordHash = await bcrypt.hash(password, 12);

      db.query(
        "SELECT * FROM user where username = '" + newUserName + "'",
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length !== 0 && results[0].id !== id) {
            return res
              .status(400)
              .json({ msg: "This user name already exists." });
          } else {
            db.query(
              "SELECT * FROM user where email = '" + email + "'",
              (err2, results2) => {
                if (err2) {
                  throw err2;
                }
                if (results2.length !== 0 && results2[0].id !== id) {
                  return res
                    .status(400)
                    .json({ msg: "This email already exists." });
                } else {
                  if (password.length < 6)
                    return res
                      .status(400)
                      .json({ msg: "Password must be at least 6 characters." });
                  else {
                    db.query(
                      "UPDATE user SET username='" +
                      username +
                      "', email='" +
                      email +
                      "' , about='" +
                      about +
                      "', avatar='" +
                      image +
                      "', phone= '" +
                      phone +
                      "' , password='" +
                      passwordHash +
                      "' , longitude='" +
                      longitude +
                      "' , latitude='" +
                      latitude +
                      "' WHERE id= '" +
                      id +
                      "'",
                      (err, ressults) => {
                        if (err) {
                          throw err;
                        } else {
                          res.json({
                            msg: "Update Success!",
                          });
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //  user forgot password function
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      db.query("select * from user where email=?", email, (err, results) => {
        if (err) throw err;
        if (results.length === 0)
          return res
            .status(400)
            .json({ msg: "The email doesnot exist", code: 0 });
        else {
          const number = between(10, 100000);
          db.query(
            "UPDATE user SET pinNumber = ? WHERE email = ? ",
            [number, email],
            (err1, results1) => {
              if (err1) throw err1;
              console.log(results1);
            }
          );
          // sending pin number to email eccount
          sendMail(email, number);
          res.json({
            msg: "Send the Pin Number , please check your email.",
            code: 1,
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // confirm the pin number which sent to the personal email account
  confirmpinNumber: async (req, res) => {
    try {
      const { pinNumber } = req.body;
      console.log(pinNumber);
      if (pinNumber === "") {
        return res.status(400).json({
          msg: "Give the pin Number",
          code: 2,
        });
      }
      db.query(
        " select * from user where pinNumber = ?",
        pinNumber,
        (err, results) => {
          if (err) throw err;
          if (results.length === 0) {
            return res
              .status(400)
              .json({ msg: "The Pin Number is doesnot Match", code: 0 });
          } else {
            res.json({
              msg: "pin number is match Now you can reset You Password",
              code: 1,
            });
          }
        }
      );

      console.log(pinNumber);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // user reset password account
  resetPassword: async (req, res) => {
    try {
      const { password, email } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);  // password encryption
      console.log(passwordHash);

      db.query(
        "UPDATE user SET password = ? WHERE email = ?",
        [passwordHash, email],
        (err, results) => {
          if (err) throw err;
          else {
            res.json({ msg: "Password successfully changed!", code: 1 });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });   //send error response
    }
  },
};

function between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//create new access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
