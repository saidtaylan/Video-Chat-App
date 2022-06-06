type IParticipant = IUser & { streamId: string, socketId: string }
type ITempParticipant = ITempUser & { streamId: string, socketId: string }

interface IRoom {
    link: string;

    passcode: string;

    type: string;

    owner: IParticipant | ITempParticipant

    permanent: boolean;

    hosts: [IUser];

    participants: [IParticipant | ITempParticipant];

    _id: string;
}