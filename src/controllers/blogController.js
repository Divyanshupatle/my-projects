const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

const isValid = function (value) {
    if (typeof value === "undefined" || value === Number || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

//Create a blog document from request body. Get authorId in request body only
exports.blogs = async function (req, res) {
    try {
        let blogBody = req.body;
        if (Object.keys(blogBody).length == 0) {
            return res.status(400).send({ status: false, msg: "data is required" });
        }
        if (!isValid(blogBody.title)) {
            return res.status(400).send({ status: false, msg: "title is required" });
        }

        if (!isValid(blogBody.body)) {
            return res.status(400).send({ status: false, msg: "body is required" });
        }

        if (!isValid(blogBody.authorId)) {
            return res.status(400).send({ status: false, msg: "authorId is required" });
        }

        if (!isValid(blogBody.tags)) {
            return res.status(400).send({ status: false, msg: "tags is required" });
        }

        if (!isValid(blogBody.category)) {
            return res.status(400).send({ status: false, msg: "category is required" });
        }

        if (!isValid(blogBody.subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory is required" });
        }

        if (!isValid(blogBody.publishedAt)) {
            return res.status(400).send({ status: false, msg: "publishedAt is required" });
        }

        if (!isValid(blogBody.deletedAt)) {
            return res.status(400).send({ status: false, msg: "deletedAt is required" });
        }

        let checkAuthorId = await authorModel.findById(req.body.authorId);
        if (!checkAuthorId) {
            return res.status(400).send({ msg: "Please Enter Valid AuthorId" });
        } else {
            let blogData = await blogModel.create(blogBody);
            res.status(201).send({ data: blogData });
        }
    } catch (err) {
        res.status(500).send({ ErrorName: err.name, ErrorMsg: err.message });
    }
};

const getblogs = async function (req, res) {
    try {
        let obj = { isDeleted: false, isPublished: true };
        // by author Id
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory

        // applying filters
        if (authorId) { obj.authorId = authorId }
        if (category) { obj.category = category }
        if (tags) { obj.tags = tags }
        if (subcategory) { obj.subcategory = subcategory }

        let savedData = await blogModel.find(obj);
        if (savedData.length == 0) {
            return res.status(404).send({ status: false, msg: 'blogs not found' });
        }
        return res.status(200).send({ data: savedData });
    }
    catch (err) {
       return res.status(500).send({ msg: 'Error', error: err.message });
    }
};
exports.blogsUpdate = async function (req, res) {
    try {
      //If param value is undefined
      let blogBody = req.body;
      if (req.params.blogId == ":blogId") {
        return res.status(400).send({ msg: "ID is madatory" });
      }
  
      //Validating BlogId(Present/Not)
  
      let checkBlogId = await blogModel.findById(req.params.blogId);
      if (!checkBlogId) {
        return res.status(400).send({ msg: "Blog Id is Invalid" });
      }
  
      //Allowing Only Whose Document Is Not Delected
      if (checkBlogId.isDeleted == true) {
        return res
          .status(400)
          .send({ msg: "if deleted is true deletedAt will have a date" });
      }
      //All Validation Working
      //Upadting user Changes
      else {
        let blogUpdateData = await blogModel.findByIdAndUpdate(
          {
            _id: checkBlogId._id,
          },
          blogBody,
          { new: true }
        );
        return res.status(201).send({ data: blogUpdateData });
      }
    } catch (err) {
      res.status(500).send({
        msg: "HTTP 500 Server Error",
        ErrorName: err.name,
        ErrorMessage: err.message,
      });
    }
  };

module.exports.getblogs = getblogs;