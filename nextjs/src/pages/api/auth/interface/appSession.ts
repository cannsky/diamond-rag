import { Session } from 'next-auth';
import { AppUser } from './appUser';

export interface AppSession extends Session {
    user: AppUser
}