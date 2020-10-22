const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const bcrypt = require('bcryptjs');

const { validateRegisterInput } = require('../../util/validation');

const { UserInputError } = require('apollo-server');
const jwt = require('jsonwebtoken');
module.exports = {
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
		) {
			//  validate user data

			const { valid, error } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword,
			);
			if (!valid) {
				throw new UserInputError('Errors', { error });
			}
			//todo make sure users docent al;ready exists
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('username is taken', {
					errors: {
						username: 'this username is taken',
					},
				});
			}
			// hash passwords create an auth token
			password = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});
			const res = await newUser.save();
			const token = jwt.sign(
				{
					id: res.id,
					email: res.email,
					username: res.username,
				},
				SECRET_KEY,
				{ expiresIn: '1h' },
			);
			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
