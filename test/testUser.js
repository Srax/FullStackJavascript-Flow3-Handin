const mongoose = require('mongoose');
const expect = require('chai').expect;
var connect = require('../dbConnect.js');
const db_con = require('../settings').TEST_DB_URI;
var userFacade = require('../facades/userFacade');
var User = require('../models/User');

describe('Testing userfacade', function() {
	/* Connect to the TEST-DATABASE */
	before(async function() {
		//this.timeout(require("../settings").MOCHA_TEST_TIMEOUT);
		await connect(db_con);
	});

	after(async function() {
		await mongoose.disconnect();
	});

	var users = [];
	/* Setup the database in a known state (2 users) BEFORE EACH test */
	beforeEach(async function() {
		await User.deleteMany({});
		users = await User.insertMany([
			{
				firstName: 'Bobby',
				lastName: 'Jones',
				userName: 'bj',
				password: 'test',
				email: 'b@bjdk'
			},
			{
				firstName: 'Johnny',
				lastName: 'Bob',
				userName: 'jb',
				password: 'test',
				email: 'j@b.dk'
			}
		]);
	});

	it('Should find all users (Right now we only have Bobby and Johnny in the db)', async function() {
		var users = await userFacade.getAllUsers();
		expect(users.length).to.be.equal(2);
	});

	it('Should find Bobby Jones by his username', async function() {
		var user = await userFacade.findByUsername('bj');
		expect(user.firstName).to.be.equal('Bobby');
	});

	it('Should find Bobby Jones by his id', async function() {
		var user = await userFacade.findById(users[0]._id);
		expect(user.firstName).to.be.equal('Bobby');
	});

	it('Should add Spider Man', async function() {
		var user = await userFacade.addUser(
			'Spider',
			'Man',
			'SpiderMan111',
			'spidermaniscool123',
			'spider@man.dk'
		);
		expect(user).to.not.be.null;
		expect(user.firstName).to.be.equal('Spider');
		var users = await userFacade.getAllUsers();
		expect(users.length).to.be.equal(3);
	});
});
