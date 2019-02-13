import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class UserManager {

    constructor(){

    }

    public getUserById(userId: number){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        return userDataAccess.getUserById(userId);
    }

    public async getAllUsers(userId: number){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var result = await userDataAccess.getAllUsers(userId);
        return result.recordsets[0];
    }

    public async addUser(email: string, firstName: string, lastName: string, phone: string, userType: string){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var user = await userDataAccess.getUserByEmail(email);
        
        if(user.recordsets[0].length == 0){
            var result = await userDataAccess.insertUser(email, firstName, lastName, phone, userType);
            return result.recordsets[0];
        }
        else{
            return {"error": "user already exists"};
        }
    }


}