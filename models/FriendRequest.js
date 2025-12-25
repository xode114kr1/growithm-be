const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = Schema(
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
    state: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    pairKey: { type: String, required: true, unique: true },
  },

  { timestamps: true }
);

// friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

friendRequestSchema.pre("validate", function () {
  const [a, b] = [this.from.toString(), this.to.toString()].sort();
  if (a == b) throw new Error("cannot request to me");
  this.pairKey = `${a}:${b}`;
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
module.exports = FriendRequest;
