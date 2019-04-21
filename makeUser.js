const connect = require('./dbConnect.js');
connect(require('./settings').DEV_DB_URI);

const User = require('./models/User.js');
const LocationBlog = require('./models/LocationBlog.js');
const Position = require('./models/Position.js');

function positionCreator(lon, lat, userId, dateInFuture) {
	const posDetail = { user: userId, loc: { coordinates: [lon, lat] } };
	if (dateInFuture) {
		posDetail.created = '2022-09-25T20:40:21.899Z';
	}
	return posDetail;
}
async function makeData() {
	console.log('Making users');
	try {
		const userInfos = [
			{
				firstName: 'aaaaaaa',
				lastName: 'aaaaaaa',
				userName: 'aaaaaaa',
				password: 'aaaaaaaa',
				email: 'aaaa@aaaa.dk',
				job: [
					{ type: 't1', company: 'c1', companyUrl: 'url1' },
					{ type: 't2', company: 'c2', companyUrl: 'url2' }
				]
			},
			{
				firstName: 'bbbbbbb',
				lastName: 'bbbbbb',
				userName: 'bbbbbb',
				password: 'bbbbbb',
				email: 'bbbbb@bbbb.dk',
				job: [
					{ type: 't1', company: 'c1', companyUrl: 'url1' },
					{ type: 't2', company: 'c2', companyUrl: 'url2' }
				]
			},
			{
				firstName: 'cccccccc',
				lastName: 'ccccccccc',
				userName: 'cccccccc',
				password: 'cccccc',
				email: 'ccccccccc@cccccc.dk',
				job: [
					{ type: 't1', company: 'c1', companyUrl: 'url1' },
					{ type: 't2', company: 'c2', companyUrl: 'url2' }
				]
			}
		];
		await User.deleteMany({});
		await Position.deleteMany({});
		await LocationBlog.deleteMany({});

		const users = await User.insertMany(userInfos);
		console.log(users);

		const positions = [
			positionCreator(10, 11, users[0]._id),
			positionCreator(11, 12, users[1]._id, true)
		];

		const blogs = [
			{ info: 'Some place 1', pos: { longitude: 5, latitude: 10 }, author: users[0]._id }
		];

		await Position.insertMany(positions);
		await LocationBlog.insertMany(blogs);
	} catch (err) {
		console.log(err);
	}
}
makeData();