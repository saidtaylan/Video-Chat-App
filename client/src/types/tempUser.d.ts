interface ITempUser {
    onlineId: string
    displayName: string;
    likes: Array<ITempUser | IUser>
}
