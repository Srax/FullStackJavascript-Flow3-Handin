const mongoose = require('mongoose');
const expect = require('chai').expect;
var connect = require('../dbConnect.js');
const db_con = require('../settings').DEV_DB_URI;
var blogFacade = require('../facades/blogFacade');
var userFacade = require('../facades/userFacade');
var LocationBlog = require('../models/LocationBlog');

describe('Testing locationblog facade', function() {
	/* Connect to the TEST-DATABASE */
	before(async function() {
		await connect(db_con);
	});

	after(async function() {
		await mongoose.disconnect();
	});

	var locationBlogs = [];
	var users = [];
	/* Setup the database in a known state (2 users) BEFORE EACH test */
	beforeEach(async function() {
		await LocationBlog.deleteMany({});
		users = await userFacade.getAllUsers();
		locationBlogs = await LocationBlog.insertMany([
			{
				info: 'Some place 1',
				img: 'img.png',
				pos: { longitude: 12, latitude: 12 },
				author: users[0]._id
			},
			{
				info: 'Some place 2',
				img: 'img.png',
				pos: { longitude: 18, latitude: 75 },
				author: users[0]._id
			}
		]);
	});

	it('Should find all locationblogs', async function() {
		var locationBlogs = await blogFacade.getAllLocationBlogs();
		expect(locationBlogs.length).to.be.equal(2);
	});

	it('Should Find Some place by ID', async function() {
		var locationBlog = await blogFacade.findById(locationBlogs[0]._id);
		expect(locationBlog.info).to.be.equal("Some place 1");
	});

	it('Should Find Some place 1 by info', async function() {
		var locationBlog = await blogFacade.findByInfo(locationBlogs[0].info);
		expect(locationBlog.info).to.be.equal('Some place 1');
	});

	it('Should add Some place 3', async function() {
		var locationBlog = await blogFacade.addLocationBlog(
			'Some place 3',
			'img.png',
			{ longitude: 99, latitude: 11 },
			users[1]._id
		);
		expect(locationBlog).to.not.be.null;
		expect(locationBlog.info).to.be.equal('Some place 3');
		var locationBlogs = await blogFacade.getAllLocationBlogs();
		expect(locationBlogs.length).to.be.equal(3);
	});

	it('Should like Some place 2 for Bobby Jones', async function() {
		var locationBlogs = await blogFacade.getAllLocationBlogs();
		var locationBlog = await blogFacade.findById(locationBlogs[1]._id);
		expect(locationBlog.likedBy).to.be.empty;
		locationBlog = await blogFacade.likeLocationBlog(
			locationBlogs[1]._id,
			users[0]._id
		);
		expect(locationBlog).to.not.be.null;
		expect(locationBlog.info).to.be.equal('Some place 2');
		expect(locationBlogs.length).to.be.equal(2);
		expect(locationBlog.likedBy).to.be.contains(users[0]._id);
	});
});
