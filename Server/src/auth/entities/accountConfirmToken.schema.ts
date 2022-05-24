import mongoose from 'mongoose';

export const AccountConfirmTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true
        },
        token: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
