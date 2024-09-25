import { User } from 'next-auth';

export interface AppUser extends User {
    id: string,
    name: string,
    admin: number
}