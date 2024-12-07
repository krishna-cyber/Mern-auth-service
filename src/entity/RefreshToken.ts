import mongoose, { Document, ObjectId } from "mongoose";

interface RefreshTokenDocument extends Document {
  userId: ObjectId;
  expiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<RefreshTokenDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken, RefreshTokenDocument };
