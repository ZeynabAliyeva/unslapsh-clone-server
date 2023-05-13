const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: { type: String, required: true },
		passwordHash: { type: String, required: true },
		fullName: { type: String, required: true },
		avatar: { type: String, default: '' },
		socketId: String,
		confirmCode: String,
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'post',
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const userModel = mongoose.model('user', userSchema);

module.exports = {
	userModel,
};
