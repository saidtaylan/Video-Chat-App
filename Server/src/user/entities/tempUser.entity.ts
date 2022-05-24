import {Document} from 'mongoose';

export interface TempUser {
    onlineId: string
    displayName: string

    // hold what people who like onlineId
    likes: Array<{ room: string, userOnlineId: string, fromOnlineId: string }>
}