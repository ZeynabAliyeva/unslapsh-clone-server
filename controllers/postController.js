const { postModel } = require('../models/post');
const postController = {
	getAll: async (req, res) => {
		try {
			const posts = await postModel.find().populate('user').exec();
			res.json(posts);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to find posts',
			});
		}
	},

	getOne: async (req, res) => {
		try {
			const postId = req.params.id;
			postModel
				.findById(
					{
						_id: postId,
					},
					{
						returnDocument: 'after',
					},
					(err, doc) => {
						if (err) {
							console.log(err);

							return res.status(500).json({
								message: 'Failed to find posts',
							});
						}

						if (!doc) {
							return res.status(404).json({
								message: 'Failed to find posts',
							});
						}
						res.json(doc);
					}
				)
				.exec();
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to find posts',
			});
		}
	},

	getPost: async (req, res) => {
		try {
			const post = await postModel.findById(req.params.id);
			if (!post) {
				return res.status(404).json({ message: 'post not found' });
			}
			res.json(post);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server Error' });
		}
	},

	create: async (req, res) => {
		try {
			const doc = new postModel({
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.body.user,
			});

			const post = await doc.save();

			res.json(post);
		} catch (err) {
			console.log(err);
			res.status(500).json({
				message: 'Failed to create post',
			});
		}
	},
	remove: async (req, res) => {
		try {
			const postId = req.params.id;
			const deletedPost = await postModel.findOneAndDelete({ _id: postId }).exec();

			if (!deletedPost) {
				return res.status(404).json({
					message: 'Post not found',
				});
			}

			res.json(deletedPost);
		} catch (err) {
			console.error(err);

			res.status(500).json({
				message: 'Failed to delete post',
			});
		}
	},
	commentsAdd: async (req, res) => {
		try {
			const { comment, postId, avatar } = req.body;
			const comments = {
				user: req.body.userId,
				username: req.body.username,
				comment,
				avatar,
			};
			const post = await postModel.findById(postId);
			if (!post) {
				return res.status(404).json({ message: 'Post not found' });
			}
			post.comments.push(comments);
			await post.save();
			res.status(200).json(post);
		} catch (err) {
			res.status(500).json({
				message: 'Failed to create post',
			});
		}
	},
};

module.exports = {
	postController,
};
