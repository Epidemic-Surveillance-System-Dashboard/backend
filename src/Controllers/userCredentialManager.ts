import { UserCredentialDataAccess } from '../ApplicationDataAccess/userCredentialDataAccess';
import { UserCredentialService } from './userCredentialService';
import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class UserCredentialManager {

    constructor(){

    }

    public async login(email: string, plaintextPassword: string){
        var userCredentialDataAccess = new UserCredentialDataAccess(config.get('sqlConfig'));
        var userCredentials = await userCredentialDataAccess.getUserCredential(email);
        var userCredentialService = new UserCredentialService();

        if(userCredentials.rowsAffected[0] == 0){
            return { "success": false };
        }
        
        var result = await userCredentialService.compare(plaintextPassword, userCredentials.recordsets[0][0].PasswordHash);
        
        if(result){
            var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
            var user = await userDataAccess.getUserByEmail(email);
            return {
                "success": result,
                "user": user.recordsets[0][0]
            };
        }
        return { "success": false };
    }
}