import { UserCredentialDataAccess } from '../ApplicationDataAccess/userCredentialDataAccess';
import { UserCredentialService } from './userCredentialService';
import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class UserCredentialManager {

    constructor(){

    }

    public async login(email: string, plaintextPassword: string){
        console.log("in login");
        var userCredentialDataAccess = new UserCredentialDataAccess(config.get('sqlConfig'));
        var userCredentials = await userCredentialDataAccess.getUserCredential(email);
        var userCredentialService = new UserCredentialService();
        var result = false;
        try{
            result = await userCredentialService.compare(plaintextPassword, userCredentials.recordsets[0][0].PasswordHash);
        }
        catch(e){
            console.log("error" + e);
        }
        
        if(result){
            var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
            var user = await userDataAccess.getUserByEmail(email);
            return {
                "success": result,
                "user": user.recordsets[0][0]
            };
        }
        return {"success": false};
    }
}