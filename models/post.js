const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;



const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
        },
        comment: {
          type: String,
          required: true,
        },
        default: [],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);

module.exports = {
  postModel,
};
