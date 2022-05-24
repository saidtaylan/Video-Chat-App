interface IRoom {
    link: string;

    passcode: string;

    type: string;

    owner: IUser | ITempUser

    permanent: boolean;

    hosts: [IUser];

    participants: [IUser | ITempUser];

    _id: string;
}
