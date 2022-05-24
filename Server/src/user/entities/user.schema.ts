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

        role: {
            type: String,
            enum: ['teacher', 'student', 'normal'],
            default: 'NORMAL'
        },

        score: {
            points: [
                {
                    room: {
                        type: mongoose.Types.ObjectId,
                        ref: 'room'
                    },
                    point: {
                        type: Number,
                        default: 0,
                    },
                    date: {
                        type: Date,
                        default: Date.now()
                    }
                }
            ],
            total: Number
        },
        status: {
            type: String,
            enum: ['active', 'pending'],
            default: 'pending'
        },
        deletedAt: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
