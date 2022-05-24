interface IError {
    type: string,
    message: string
}

interface IUser {
    name: string
    lastName: string
    roomScore?: number
    profileImage?: string,
    role?: string
}

interface ITempUser {
    displayName: string
}