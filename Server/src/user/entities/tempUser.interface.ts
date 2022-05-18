import { Document } from 'mongoose';

export interface TempUser extends Document {
    displayName: string
}