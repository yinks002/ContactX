import {
    
    nat64,
    StableBTreeMap,
    Record,  int8, Principal,
    Vec
} from 'azle';
import { group } from 'console';


export type User = Record<{
    Address: Principal;
    Gender: string;
}>
export type Info = Record<{
    id: string;
    Name: string;
    Age: string;
    DocumentIdNum: string;
    Notes: string;
    email: string;
    createdAt: nat64;
    owner: Principal;
    Price: nat64;
    sold: boolean;
}>
export type UserPayload = Record<{
    Gender: string;
}>
export type InfoPayload = Record<{
    Name: string;
    Age: string;
    DocumentIdNum: string;
    Notes: string;
    email: string;
    Price: nat64;
}>
export const ItemsSoldStore  = new StableBTreeMap<string,Info>(2,10,45);
export const UserStore = new StableBTreeMap<string, User>(0,10,50);
export const Infostore = new StableBTreeMap<string, Info>(1,70,150);
