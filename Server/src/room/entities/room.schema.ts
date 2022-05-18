import mongoose from 'mongoose';
export const RoomSchema = new mongoose.Schema(
  {
    //name: String,

    link: String,

    passcode: String,

    // edu or normal
    type: {
      type: String,
      default: 'NORMAL',
      enum: ['EDU', 'NORMAL']
    },

    //image: String,

    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'user'
    },

    // temporary or permanent room
    permanent: Boolean,

    hosts: [{type: mongoose.Types.ObjectId, ref: 'temp-user'}],

    // if participants is empty, room is temporary
    participants: [{type: mongoose.Types.ObjectId, ref:'temp-user'}, { type: mongoose.Types.ObjectId, ref: 'user'}],

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
