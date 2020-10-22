module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword,
) => {
	const error = {};
	if (username.trim() === ' ') {
		error.username = 'Username must not be empty';
	}
	if (email.trim() === ' ') {
		error.email = 'email must not be empty';
	} else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9aA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) {
			error.email = 'Email must be a valid email address';
		}
	}
	if (password === '') {
		error.password = 'Password must not be empty';
	} else if (password !== confirmPassword) {
		error.confirmPassword = 'Password must match';
	}
	return {
		error,
		valid: Object.keys(error).length < 1,
	};
};
