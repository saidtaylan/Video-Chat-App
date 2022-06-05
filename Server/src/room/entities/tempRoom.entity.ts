import {LeanDocument} from 'mongoose';
import {User} from 'src/user/entities/user.entity';
import {TempUser} from "../../user/entities/tempUser.entity";
import {Participant, TempParticipant} from './participant.entity';

export interface TempRoom {
    link: string

    passcode: string

    participants: Array<TempParticipant | Participant>

    owner: TempParticipant | Participant

    type: string
}