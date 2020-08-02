const jwt = require('jsonwebtoken');
const User = [
	{
		name: 'Rohan',
		password: 'sdfsdfsdfsdf'
	}
];

module.exports = (req, res, next) => {
	const { authorization } = req.headers;

	if(!authorization) {
		return res.status(401).send({ error: 'You must be logged in!' });
	}

	const token = authorization.replace('Bearer ', '');

	jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
		if(err) {
			return res.status(401).send({ error: 'You must be logged in!' });
		}
		const { userId } = payload;

		const user = User[userId];
		req.user = user;
		next();
	});
};