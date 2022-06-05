import {Document, Types, LeanDocument} from 'mongoose';
import {User} from 'src/user/entities/user.entity';
import {TempUser} from "../../user/entities/tempUser.entity";
import type {Participant, TempParticipant} from "./participant.entity"

export interface Room extends Document {
    link: string

    passcode: string

    type: string

    owner: Participant | TempParticipant

    // for only online room
    participants: Array<Participant | TempParticipant>

    members: [User]

    deletedAt: Date

    image: string
}