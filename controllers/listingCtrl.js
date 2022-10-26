const db = require("../config/db");
const axios = require("axios");

const listingCtrl = {
  getListings: async (req, res) => {
    try {
      db.query("SELECT * FROM listings", (err, results) => {             //fetch litings data
        if (err) {
          throw err;
        }
        if (results.length === 0) {                                    //check any listings exists
          res.json({
            msg: "No listings found",
          });
        } else {
          res.json({                                                 //send listings array as response
            results,
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });                  //throw error message
    }
  },

  addListings: async (req, res) => {
    try {
      const {
        poster_id,
        name,
        description,
        quantity,
        longitude,
        latitude,
        avatar,
        expires_in,
        type,
        phone,                                                          
      } = req.body;                                                         //Getting data from client
      const status = "available";
      const requester_id = 0;

      db.query(
        "INSERT INTO listings (poster_id, name, description, quantity, longitude, latitude, avatar, expires_in, type,status,requester_id, phone) VALUES ('" +
          poster_id +
          "','" +
          name +
          "', '" +
          description +
          "','" +
          quantity +
          "','" +
          longitude +
          "','" +
          latitude +
          "', '" +
          avatar +
          "','" +
          expires_in +
          "', '" +
          type +
          "', '" +
          status +
          "','" +
          requester_id +
          "', '" +
          phone +                                                                     //Insert data to database
          "')",                                     
        async (err, results) => {
          if (err) {
            throw err;
          }

          if (results) {
            res.json({
              msg: "listing Added Successfully",                                 //Send response
              code: 1,
            });

            db.query("SELECT * FROM nonsmartphoneuser", (err1, results1) => {          
              if (err1) {
                throw err1;
              } else if (results1.length === 0) {                                    //check if there is non smart phone user exist
                console.log(results1.length);
                res.json({
                  msg: "No users found",
                });
              } else {
                results1.map((item, index) => {                                 //if exist apply prioritization algorithm to their location
                  var point_distance = getHaversineDistance(
                    latitude,
                    longitude,
                    item.latitude,
                    item.longitude
                  );
                  if (point_distance <= 1.0) {                              //check weather pickup point and non smart phone location distance less than or equal to 1km 
                    console.log(point_distance);
                    console.log(phone);

                    var phoneNo = item.phonenumber;

                    axios({
                      method: "POST",
                      url: `https://app.notify.lk/api/v1/send?user_id=23139&api_key=qzNhoJQsPs9gV93SQsHi&sender_id=NotifyDEMO&to=${item.phonenumber}&message=There is a listing posted nearby your area. If you want that,Please contact this mobile number and collect the item. mobilenumber=${phone}`,                      //Send message to that user about listings
                    });
                  } else {
                  }
                });

                function getHaversineDistance(lat1, lon1, lat2, lon2) {                //Haversine formula
                  var R = 6371; // Radius of the earth in km
                  var dLat = deg2rad(lat2 - lat1); // deg2rad below
                  var dLon = deg2rad(lon2 - lon1);
                  var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) *
                      Math.cos(deg2rad(lat2)) *
                      Math.sin(dLon / 2) *
                      Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c; // Distance in km
                  return d;
                }

                function deg2rad(deg) {
                  return deg * (Math.PI / 180);
                }
              }
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addRequests: async (req, res) => {
    try {
      const { requester_id, listings_id } = req.body;
      db.query(
        "SELECT * FROM requests WHERE listings_id='" +
          listings_id +
          "' AND requester_id='" +
          requester_id +
          "'",
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length !== 0) {                         //Check weather the listings already requested
            res.json({
              msg: "Listings already requested",
            });
          } else {
            db.query(
              "INSERT INTO requests (listings_id, requester_id) VALUES ('" +
                listings_id +
                "','" +
                requester_id +
                "')",
              (err2, results2) => {
                if (err2) {
                  throw err2;
                } else {
                  res.json({
                    msg: "Listing requested successfully",                 //Insert listing request to database and send response
                  });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });                           //send error response
    }
  },

  getRequests: async (req, res) => {
    try {
      const { id } = req.body;
      db.query(
        "SELECT requests.id,requests.listings_id,requests.requester_id,requests.created_at,user.avatar,user.username,user.latitude,user.longitude FROM requests,user where requests.listings_id = '" +                                  //Get all requests from database
          id +
          "' AND user.id = requests.requester_id",
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length === 0) {                             //Check weather any requests exists
            res.json({
              msg: "No requests found",
            });
          } else {
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

  deleteRequest: async (req, res) => {
    try {
      const { requester_id, listings_id } = req.body;
      await db.query(
        "SELECT * FROM requests WHERE listings_id='" +
          listings_id +
          "' AND requester_id='" +
          requester_id +
          "'",
        async (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length === 0) {                    //Check weather particular request exist in database
            res.json({
              msg: "No requests found",
            });
          } else {
            await db.query(
              "DELETE FROM requests WHERE listings_id='" +
                listings_id +
                "' AND requester_id='" +
                requester_id +
                "'",
              (err2, results2) => {
                if (err2) {
                  throw err2;
                } else {
                  res.json({
                    msg: "Request removed",              //Delete request and send response
                  });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });               //send error message
    }
  },

  acceptRequest: async (req, res) => {
    try {
      const { requester_id, listings_id } = req.body;
      await db.query(
        "UPDATE listings SET requester_id='" +                           //change the listing status from requested to taken
          requester_id +
          "',status='taken' WHERE id='" +
          listings_id +
          "'",
        async (err, results) => {
          if (err) {
            throw err;
          } else {
            await db.query(
              "DELETE FROM requests WHERE listings_id='" + listings_id + "'",       //delete all other requests related to this listing
              (err2, results2) => {
                if (err2) {
                  throw err2;
                } else {
                  res.json({
                    msg: "Request accepted",                             
                  });
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

  checkRequested: async (req, res) => {
    try {
      const { requester_id, listings_id } = req.body;
      db.query(
        "SELECT * FROM requests WHERE listings_id='" +            //Check the user already requested this listing
          listings_id +
          "' AND requester_id='" +
          requester_id +
          "'",
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.length !== 0) {
            res.json({
              code: 1,
            });
          } else {
            res.json({
              code: 0,
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getDrivers: async (req, res) => {
    try {
      db.query("SELECT * FROM driver", (err, results) => {              //Get driver data from database
        if (err) {
          throw err;
        }
        if (results.length === 0) {                                    //Check if any drivers exists
          res.json({
            msg: "No Available Drivers found",
          });
        } else {
          res.json({
            results,                                                 //Send driver data as response
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addDriverRequest: async (req, res) => {
    try {
      const {
        user_id,
        driver_id,
        listing_id,
        pickup_longitude,
        pickup_latitude,
        dest_longitude,
        dest_latitude,
        user_avatar,
        driver_avatar,
        user_name,
        driver_name,
      } = req.body;                                //Get driver data from client
      const status = "Requested";
      db.query(
        "INSERT INTO request_driver (user_id, driver_id, listing_id,status,pickup_longitude, pickup_latitude, dest_longitude, dest_latitude, user_avatar, driver_avatar, user_name, driver_name) VALUES ('" +                     //insert driver data into database
          user_id +
          "','" +
          driver_id +
          "', '" +
          listing_id +
          "','" +
          status +
          "','" +
          pickup_longitude +
          "','" +
          pickup_latitude +
          "','" +
          dest_longitude +
          "','" +
          dest_latitude +
          "','" +
          user_avatar +
          "','" +
          driver_avatar +
          "','" +
          user_name +
          "','" +
          driver_name +
          "')",
        (err, results) => {
          if (err) {
            throw err;
          }

          if (results) {
            res.json({
              msg: "Driver requested Successfully",                         //Send successful response
              code: 1,
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });                   //Send error message
    }
  },

  getDriverRequests: async (req, res) => {
    try {
      db.query("Select * from request_driver", (err, results) => {                  //Select driver requests from database
        if (err) {
          throw err;
        }
        if (results.length === 0) {                                            //Check weather any driver request exist
          res.json({
            msg: "No driver reuqest found",
          });
        } else {
          res.json({
            results,                                                  //Send driver request response
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = listingCtrl;
