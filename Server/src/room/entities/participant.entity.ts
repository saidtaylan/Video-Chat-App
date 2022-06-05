import {LeanDocument} from "mongoose";
import {TempUser} from "src/user/entities/tempUser.entity";
import {User} from "../../user/entities/user.entity";

export type TempParticipant = LeanDocument<User> & { streamId: string, socketId: string };
export type Participant = TempUser & { streamId: string, socketId: string }