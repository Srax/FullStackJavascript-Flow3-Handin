var mongoose = require('mongoose');
var LocationBlog = require('../models/LocationBlog');
var User = require('../models/User');

function getAllLocationBlogs() {
	return LocationBlog.find({}).exec();
}

function findByInfo(info) {
	return LocationBlog.findOne({ info }).exec();
}

function findById(id) {
	return LocationBlog.findById({ _id: id }).exec();
}

async function addLocationBlog(info, img, pos, author) {
	var locationBlog = new LocationBlog({
		info: info,
		img: img,
		pos: pos,
		author: author
	});
	await locationBlog.save();
	return locationBlog;
}

async function likeLocationBlog(blogid, userid) {
	return LocationBlog.findOneAndUpdate(
		{ _id: blogid },
		{ $push: { likedBy: userid } },
		{ new: true }
	).exec();
}

module.exports = {
	getAllLocationBlogs,
	findByInfo,
	findById,
	addLocationBlog,
	likeLocationBlog
};
