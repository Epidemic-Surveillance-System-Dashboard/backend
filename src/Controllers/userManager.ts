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


}