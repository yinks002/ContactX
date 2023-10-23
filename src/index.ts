// cannister code goes here
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, Principal, serviceQuery, serviceUpdate, CallResult, Service, int8 } from 'azle';
import { v4 as uuidv4 } from 'uuid';
import {Address} from 'azle/canisters/ledger';


import { User,Info,UserPayload,InfoPayload,Infostore,UserStore,ItemsSoldStore } from './types';


export class Token extends Service {
    @serviceUpdate
    initializeSupply: ( name: string, originalAddress: string, ticker: string,totalSupply: nat64) => CallResult<boolean>;

    @serviceUpdate
    transfer: (from: string, to: string, amount: nat64) => CallResult<boolean>;

    @serviceQuery
    balance: (id: string) => CallResult<nat64>;

    @serviceQuery
    ticker: () => CallResult<string>;

    @serviceQuery
    name: () => CallResult<string>;

    @serviceQuery
    totalSupply: () => CallResult<nat64>;
}

const icpCanister: Address = ic.caller().toString()
const tokenCanister = new Token(
    // input your token canister address
    Principal.fromText("")
);
//set up with wallet of local user
const owner : Principal= ic.caller();
let initialized: boolean;
let network: int8;

$update
export async function initializeToken(Network: int8):Promise<Result<string, string>>{
    if (initialized){
        ic.trap("canister already initialized")
    }
    //set up dummy token
    if(Network==0){
        network = 0;
        await tokenCanister.initializeSupply('ContactX', icpCanister,'CTX',1_000_000_000_000n).call()
        //mainet
    }else{
        network  = 1
    }
    initialized = true;
    return Result.Ok<string, string>("Initialized");
}





//to register a user
$update
export function RegisterUser(payload: UserPayload):Result<User, string>{
    //check if existing user is already registered
    const existingUser = UserStore.get(ic.caller().toString()).Some;

    if(existingUser?.Address){
        return Result.Err<User, string>(`user with address${existingUser.Address} does not exist`)
    }

    const user: User = {
        Address: ic.caller(),
        Gender: payload.Gender
    }
    UserStore.insert(ic.caller().toString(),user);
    return Result.Ok(user);
}

$update
export function AddInfo(payload:InfoPayload):Result<Info, string>{    
    const existingUser = UserStore.get(ic.caller().toString()).Some;
    if(!existingUser?.Address){
        return Result.Err<Info, string>("user doesnt exist")
    }

    const info: Info = {
        id: uuidv4(),
        Name : payload.Name,
        Age: payload.Age,
        DocumentIdNum: payload.DocumentIdNum,
        Notes: payload.Notes,
        email: payload.email,
        createdAt:ic.time(),
        owner: ic.caller(),
        Price: payload.Price,
        sold: false
    }
    Infostore.insert(ic.caller().toString(), info)
    return Result.Ok(info)
}

$query
export function getId():Principal{
    return ic.caller();
}
$update
export function UpdatePrice(id: string, Price:nat64):Result<Info, string>{
    return match(Infostore.get(id),{
        Some:(info) =>{
            if(info.owner.toString() !== ic.caller().toString()){
                return Result.Err<Info, string>("You are not the owner of this information")
            }
            const UpdatedPrice: Info={...info,Price}
            return Result.Ok<Info, string>(UpdatedPrice);
        },

        None: ()=> Result.Err<Info, string>(`coulnt find product id with an id of ${id}`)
    })
}

$update
export function buyProduct(id: string){

}
