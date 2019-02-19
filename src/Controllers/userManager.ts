import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import { UserLocationDataAccess } from '../ApplicationDataAccess/userLocationDataAccess';
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
        var userLocationDataAccess = new UserLocationDataAccess(config.get('sqlConfig'));

        var userLocationResult = await userLocationDataAccess.getUserLocation(userId);
        var userLocation = userLocationResult.recordsets[0][0];
        console.log(userLocation);

        if(userLocation.LocationType.toLowerCase() === 'state'){
            console.log("here");
            var childLocationIdsResult = await userLocationDataAccess.getAllChildLocationIds(parseInt(userLocation.LocationId));
            var childLocationIds = this.parseChildLocationIds(childLocationIdsResult.recordsets[0]);
            var userIdsResult = await userLocationDataAccess.getUserIdsFromLocationIds(childLocationIds);
            var users = await userDataAccess.getUsersById(this.convertUserIdsToIntArray(userIdsResult.recordsets[0]));
            console.log(users);
            return users.recordsets[0];
        }

        var result = await userDataAccess.getAllUsers(userId);
        return result.recordsets[0];
    }

    public async addUser(email: string, firstName: string, lastName: string, phone: string, 
        userType: string, locationId: number, locationType: string){
        var userDataAccess = new UsersDataAccess(config.get('sqlConfig'));
        var userLocationDataAccess = new UserLocationDataAccess(config.get('sqlConfig'));
        var user = await userDataAccess.getUserByEmail(email);

        if(user.recordsets[0].length == 0){
            var result = await userDataAccess.insertUser(email, firstName, lastName, phone, userType);
            await userLocationDataAccess.insertUserLocation(email, locationId, locationType, result.recordsets[0][0].Id);
            return result.recordsets[0][0];
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

    private parseChildLocationIds(rawChildLocationIds){
        var lgaIds = [];
        var wardIds = [];
        var facilityIds = [];

        for(var i = 0; i < rawChildLocationIds.length; i++){
            var lgaId = parseInt(rawChildLocationIds[i].LGAId);
            var wardId = parseInt(rawChildLocationIds[i].WardId);
            var facilityId = parseInt(rawChildLocationIds[i].FacilityId);
            if(rawChildLocationIds[i].LGAId && !lgaIds.includes(lgaId)){
                lgaIds.push(lgaId);
            }
            if(rawChildLocationIds[i].WardId && !wardIds.includes(wardId)){
                wardIds.push(wardId);
            }
            if(rawChildLocationIds[i].FacilityId && !facilityIds.includes(facilityId)){
                facilityIds.push(facilityId);
            }
        }

        return  {
            lgaIds,
            wardIds,
            facilityIds
        };
    }

    private convertUserIdsToIntArray(userIds){
        var ids = [];
        for(var i = 0; i < userIds.length; i++){
            ids.push(parseInt(userIds[i].UserId));
        }
        return ids;
    }


}