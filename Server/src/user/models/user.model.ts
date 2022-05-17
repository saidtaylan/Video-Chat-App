import { Document } from 'mongoose';

export interface User extends Document {
    name: string

    lastName: string
  
    email: string
  
    password: string
  
    profileImage: string
  
    age: number
  
    role: string
  
    score: {
      point: number
      date: Date
    }
}