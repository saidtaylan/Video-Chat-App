import mongoose from 'mongoose';
export const TempUserSchema = new mongoose.Schema(
  {
    displayName: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
