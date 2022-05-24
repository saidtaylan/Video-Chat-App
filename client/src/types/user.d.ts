interface IUser {

    onlineId: string,
    name: string

    lastName: string

    email?: string

    profileImage: string

    role: string

    likes: Array<IUser | ITempUser>

    score?: {
        point: number
        date: Date
    }

    totalRoomScore?: number

    accessToken: string

    _id: string
}