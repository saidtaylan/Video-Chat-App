interface IRoom {
  link: string;

  passcode: string;

  type: string;

  permanent: boolean;

  hosts: [IUser];

  participants: [IUser | ITempUser];
  _id: any;
}
