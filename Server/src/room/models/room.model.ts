import { Document } from 'mongoose';
import { User } from 'src/user/models/user.model';
import {TempUser} from "src/user/models/tempUser.model"

export interface Room extends Document {
    link: string

    passcode: string

    type: string

    permanent: boolean

    hosts: [User]

    participants: [User | TempUser]
}