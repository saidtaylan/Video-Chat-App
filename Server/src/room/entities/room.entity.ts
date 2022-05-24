import {Document, Types, LeanDocument} from 'mongoose';
import {User} from 'src/user/entities/user.entity';
import {TempUser} from "../../user/entities/tempUser.entity";

export interface Room extends Document {
    link: string

    passcode: string

    type: string

    owner: Types.ObjectId

    // for only online permanent room
    participants: Array<LeanDocument<User> | TempUser>

    members: [User]

    deletedAt: Date

    image: string
}