const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique });

const FriendRequest = model("FriendRequest", friendRequestSchema);
module.exports = FriendRequest;
