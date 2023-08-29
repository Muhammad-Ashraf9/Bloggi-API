const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    posts: { type: [Schema.Types.ObjectId], ref: "Post" },
    token: String,
  },
  { timestamps: true }
);
module.exports = model("User", userSchema);
