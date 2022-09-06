const authorModel = require("../models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}


const authors = async function (req, res) {
  try {
    let data = req.body;
    if(Object.keys(data).length==0){
     return res.status(400).send({status:false, msg: "data is required" });
    }
    if(!isValid(data.fname)){
      return res.status(400).send({status:false, msg: "fname is required" }); 
    }

    if(!isValid(data.lname)){
      return res.status(400).send({status:false, msg: "lname is required" }); 
    }

    if(!isValid(data.title)){
      return res.status(400).send({status:false, msg: "title is required" }); 
    }

    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(data.email)) {
      res.status(400).send({status: false,message: `Email should be a valid email address`});
      return;
    }

    if(!isValid(data.password)){
      return res.status(400).send({status:false, msg: "password is required" }); 
    }
    

    let savedData = await authorModel.create(data);
    res.status(201).send({ msg: savedData });
  } catch (err) {
    return res.status(500).send({ ErrorName: err.name, ErrorMessage: err.message });
  }
};

module.exports.authors = authors;