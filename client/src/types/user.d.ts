interface IUser {
    name: string

    lastName: string
  
    email: string
  
    profileImage: string
  
    age: number
  
    role: string
  
    score?: {
      point: number
      date: Date
    }

    _id: any
}