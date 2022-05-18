import { Document } from 'mongoose';
import { User } from 'src/user/entities/user.interface';
import {TempUser} from "src/user/entities/tempUser.interface"

export interface Room extends Document {
    link: string

    passcode: string

    type: string

    permanent: boolean

    hosts: [User]

    participants: [User | TempUser]

    deletedAt ?: Date
}