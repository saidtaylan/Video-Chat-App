import {Document} from 'mongoose';

export interface User extends Document {
    name: string

    onlineId: string

    lastName: string

    email: string

    password: string

    // this is not exist in db. Exist in only memory
    // hold what people who like onlineId
    likes: Array<{ room: string, userOnlineId: string, fromOnlineId: string }>

    profileImage: string

    role: string

    score: {
        points: [{
            room: string,
            point: number
            date?: Date
        }], total: number
    }

    deleted_at?: Date
}