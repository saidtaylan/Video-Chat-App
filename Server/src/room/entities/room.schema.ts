import mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema(
    {
        link: String,

        passcode: String,

        type: {
            type: String,
            default: 'normal',
            enum: ['edu', 'normal']
        },

        owner: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },

        image: {
            type: String,
            default: 'src/room/images/default.png'
        },


        members: [{type: mongoose.Types.ObjectId, ref: 'user'}],

        deleted_at: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
