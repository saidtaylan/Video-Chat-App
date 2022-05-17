import mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema(
  {
    name: String,

    lastName: String,

    email: String,

    password: String,

    profileImage: {
      type: String,
      default: 'images/profile/default.png'
    },

    age: Number,

    role: String,

    score: {
      point: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now()
      }
    },
    status: {
      type: String,
      enum: ['Active', 'Pending'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
