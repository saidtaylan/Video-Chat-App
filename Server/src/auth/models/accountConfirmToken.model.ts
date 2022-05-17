import {Document} from "mongoose"

export interface ConfirmToken extends Document {
    userId: string,
    token: string
}