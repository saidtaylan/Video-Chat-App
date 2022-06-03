import {LeanDocument} from 'mongoose';
import {User} from 'src/user/entities/user.entity';
import {TempUser} from "../../user/entities/tempUser.entity";

export interface TempRoom {
    link: string

    passcode: string

    participants: Array<LeanDocument<User> | TempUser>

    owner: string

    type: string
}