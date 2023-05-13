const { userModel } = require('../models/user');
const { postModel } = require('../models/post');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
	direct: true,
	host: 'smtp.mail.ru',
	port: 465,
	auth: {
		user: 'aarizona3@mail.ru',
		pass: '0bPD1xnaDfd52awVehKU',
	},
	secure: true,
});

const userController = {
	getAllUsers: async (req, res) => {
		try {
			const users = await userModel.find().exec();
			res.json(users);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to find users',
			});
		}
	},
	getUser: async (req, res) => {
		try {
			const user = await userModel.findById(req.params.id);
			if (!user) {
				return res.status(404).json({ message: 'user not found' });
			}
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server Error' });
		}
	},

	getAll: async (req, res) => {
		try {
			const user = await userModel.findOne({ email: req.body.email });
			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				});
			}

			const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

			if (!isValidPass) {
				return res.status(400).json({
					message: 'Wrong login or password',
				});
			}

			const token = jwt.sign(
				{
					_id: user._id,
				},
				'secret123',
				{
					expiresIn: '30d',
				}
			);

			const { passwordHash, ...userData } = user._doc;

			res.json({
				...userData,
				token,
			});
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to login',
			});
		}
	},
	getMe: async (req, res) => {
		try {
			const user = await userModel.findById(req.userId);

			if (!user) {
				return res.status(404).json({
					message: 'User not found',
				});
			}

			const { passwordHash, ...userData } = user._doc;

			res.json(userData);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'No access',
			});
		}
	},
	register: (register = async (req, res) => {
		try {
			const password = req.body.password;
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);

			let confirmCode = Math.floor(Math.random() * 999999);

			const doc = new userModel({
				email: req.body.email,
				fullName: req.body.fullName,
				avatarUrl: req.body.avatarUrl,
				passwordHash: hash,
				confirmCode,
			});

			doc.confirmCode = confirmCode;

			let mailOptions = {
				from: 'aarizona3@mail.ru',
				to: doc.email,
				subject: 'Login Confirm Code',
				text: 'Confirm Code: ' + confirmCode,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					return console.log(error);
				}
			});

			const user = await doc.save();

			const token = jwt.sign(
				{
					_id: user._id,
				},
				'secret123',
				{
					expiresIn: '30d',
				}
			);

			const { passwordHash, ...userData } = user._doc;

			res.json({
				...userData,
				token,
			});
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to register',
			});
		}
	}),
	login: async (req, res) => {
		try {
			const user = await userModel.findOne({ email: req.body.email });
			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				});
			}

			const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

			if (!isValidPass) {
				return res.status(400).json({
					message: 'Wrong login or password',
				});
			}

			const token = jwt.sign(
				{
					_id: user._id,
				},
				'secret123',
				{
					expiresIn: '30d',
				}
			);

			const { passwordHash, ...userData } = user._doc;

			res.json({
				...userData,
				token,
			});
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to login',
			});
		}
	},
	UpdateAvaratUrl: async (req, res) => {
		try {
			const user = await userModel.findById(req.params.id);

			if (!user) {
				return res.status(404).json({
					message: 'User not found',
				});
			}

			user.avatar = req.body.avatar;

			await user.save();

			const { passwordHash, ...userData } = user._doc;

			res.json(userData);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to update image URL',
			});
		}
	},
	savePost: async (req, res) => {
		const { userId, postId } = req.params;
		try {
			const user = await userModel.findById(userId);
			const post = await postModel.findById(postId);
			if (!user || !post) {
				return res.status(404).json({ message: 'User or post not found' });
			}

			const postIndex = user.savedPosts.indexOf(postId);
			if (postIndex === -1) {
				user.savedPosts.push(postId);
			} else {
				user.savedPosts.splice(postIndex, 1);
			}

			await user.save();

			res.json({ message: 'Post saved successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error' });
		}
	},
	add: (req, res) => {
		let newData = new userModel({
			name: req.body.name,
			description: req.body.description,
			date: req.body.date,
		});

		newUser.save(function (err, doc) {
			if (!err) {
				res.json(doc);
			} else {
				res.status(500).json(err);
			}
		});
	},
	getById: (req, res) => {
		let id = req.params.id;
		userModel.findById(id, (err, doc) => {
			if (!err) {
				res.json(doc);
			} else {
				res.status(500).json(err);
			}
		});
	},
	delete: (req, res) => {
		let id = req.params.id;
		userModel
			.findByIdAndDelete(id)
			.then((doc) => {
				res.json(doc);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	},
	update: async (req, res) => {
		try {
			const id = req.params.id;
			const newUserModel = new userModel({
				_id: id,
				fullName: req.body?.fullName,
				email: req.body?.email,
			});
			const updatedUser = await userModel.findByIdAndUpdate(id, newUserModel, { runValidators: true });
			res.json(updatedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	},
	likes: async (req, res) => {
		const { userId, postId } = req.params;
		try {
			const user = await userModel.findById(userId);
			const post = await postModel.findById(postId);
			if (!user || !post) {
				return res.status(404).json({ message: 'User or post not found' });
			}

			const postIndex = user.likes.indexOf(postId);
			if (postIndex === -1) {
				post.likes.push(userId);
				user.likes.push(postId);
			} else {
				post.likes.splice(userId);
				user.likes.splice(postIndex, 1);
			}

			await user.save();
			await post.save();

			res.json({ message: 'Post saved successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error' });
		}
	},
};

module.exports = {
	userController,
};
