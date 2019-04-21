var express = require('express');
var router = express.Router();
var userFacade = require('../facades/userFacade');
var blogFacade = require('../facades/blogFacade');
var loginFacade = require('../facades/loginFacade');
var mongoose = require('mongoose');


//The path is "http://localhost/api"
/*

Example: Test logging in in postman:
Method: POST
URL: http://localhost:3000/api/login
DATA: {
	"username" : "bbbbbb",
	"password" : "bbbbbb",
	"latitude" : "1",
	"longitude" : "2",
	"distance" : 2
}

Should log you in as user "bbbbbb" and find nearest friends

*/

/*POST login*/
router.post('/login', async function(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;
	const latitude = req.body.latitude;
	const longitude = req.body.longitude;
	const distance = req.body.distance;

	const response = await loginFacade.login(
		username,
		password,
		latitude,
		longitude,
		distance
	);

	if (response.msg) {
		res.statusCode = 403;
	}

	res.json(response);
});

/* GET users listing. */
router.get('/users', async function(req, res, next) {
	res.json({ users: await userFacade.getAllUsers() });
});

/* GET user by userName */
router.get('/users/username=:userName', async function(req, res, next) {
	var userName = req.params.userName;
	res.json({ users: await userFacade.findByUsername(userName) });
});

/* GET user by id */
router.get('/users/id=:id', async function(req, res, next) {
	var id = req.params.id;
	res.json({ users: await userFacade.findById(id) });
});

/* POST creates user */
router.post('/user/add', async function(req, res, next) {
	var body = req.body;
	var firstname = body.firstname;
	var lastname = body.lastname;
	var username = body.username;
	var password = body.password;
	var email = body.email;

	var user = await userFacade.addUser(
		firstname,
		lastname,
		username,
		password,
		email
	);
	res.json(user);
});

/* GET locationblog listing. */
router.get('/blogs', async function(req, res, next) {
	res.json({ blogs: await blogFacade.getAllLocationBlogs() });
});

/* GET locationblog by id */
router.get('/blogs/id=:id', async function(req, res, next) {
	var id = req.params.id;
	res.json({ blogs: await blogFacade.findById(id) });
});

/* POST Create LocationBlog */
router.post('/blog/add', async function(req, res, next) {
	var info = req.body.info;
	var img = req.body.img === undefined ? ' ' : req.body.img;
	var pos = req.body.pos;
	var author = req.body.author;

	var log = await blogFacade.addLocationBlog(info, img, pos, author);
	console.log(log);
	res.json(log);
});

/* POST Like a Blog */
router.post('/blog/like', async function(req, res, next) {
	var userid = req.body.userid;
	var blogid = req.body.blogid;

	var blog = await blogFacade.likeLocationBlog(blogid, userid);
	res.json(blog);
});

router.get('/error', function(req, res, next) {
	if (true) {
		var err = new Error('Err');
		err.isJson = true;
		return next(err);
	}
});

module.exports = router;
