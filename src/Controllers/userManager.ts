import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class UserManager {

    constructor(){

    }

    public async getUserById(userId: number){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var result = await userDataAccess.getUserById(userId);
        if(result.rowsAffected > 0){
            return {"user": result.recordsets[0][0]};
        }
        else {
            return {"error": "user does not exist"};
        }
    }

    public async getAllUsers(userId: number){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var result = await userDataAccess.getAllUsers(userId);
        return result.recordsets[0];
    }

    public async addUser(email: string, firstName: string, lastName: string, phone: string, userType: string){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var user = await userDataAccess.getUserByEmail(email);
        console.log("here");
        if(user.recordsets[0].length == 0){
            var result = await userDataAccess.insertUser(email, firstName, lastName, phone, userType);
            return result.recordsets[0];
        }
        else{
            return {"error": "user already exists"};
        }
    }

    public async deleteUserById(userId: number){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var result = await userDataAccess.deleteUserById(userId);
        if(result.rowsAffected[0] > 0){
            return {"result": "delete success"};
        }
        else {
            return {"result": "user does not exist"};
        }
    }

    public async updateUser(id: number, email: string, firstName: string, lastName: string, phone: string, userType: string){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var result = await userDataAccess.updateUser(id, email, firstName, lastName, phone, userType);
        if(result.rowsAffected[0] > 0){
            return {"result": "update success"};
        }
        else {
            return {"result": "user does not exist"};
        }
    }


}