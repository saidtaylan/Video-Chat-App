export interface TempUser {
    displayName: string
    onlineId: string
    // hold what people who like onlineId
    likes: Array<{ room: string, userOnlineId: string, fromOnlineId: string }>
}