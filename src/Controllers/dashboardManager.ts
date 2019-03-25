import { DashboardDataAccess } from '../ApplicationDataAccess/dashboardDataAccess';
import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class DashboardManager {

    constructor(){}

    public async getDashboardConfig(userId: number){
        var dashboardDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var dashboardConfigResult = await dashboardDataAccess.getDashboardConfig(userId);
        if(dashboardConfigResult.recordsets[0].length == 0){
            return {"error": "user does not have a dashboard"};
        }
        return dashboardConfigResult.recordsets[0][0];
    }

    public async addDashboardConfig(email: string, userId: number, dashboardJson: string){
        var dashboardDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var usersDataAccess = new UsersDataAccess(config.get('sqlConfig'));

        var userResult = await usersDataAccess.getUserById(userId);
        if(userResult.recordsets[0].length == 0){
            return {"error": "user does not exist"};
        }
        var dashboardResult = await dashboardDataAccess.getDashboardConfig(userId);
        if(dashboardResult.recordsets[0].length == 0){
            return {"error": "A dashboard for this user already exists."};
        }
        var result = await dashboardDataAccess.insertDashboardConfig(email, dashboardJson, userId);
        return result.recordsets[0][0];
    }

    public async updateDashboardConfig(userId: number, dashboardJson: string){
        var dashboardDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var usersDataAccess = new UsersDataAccess(config.get('sqlConfig'));

        var result = await dashboardDataAccess.updateDashboardConfig(userId, dashboardJson);

        if(result.rowsAffected[0] > 0){
            return {
                "success": true,
                "result": "update success"
            };
        }
        else {

            var userResult = await usersDataAccess.getUserById(userId);
            if(userResult.rowsAffected[0] == 0){
                return {
                    "success": false,
                    "result": "User does not exist"
                };
            }
            
            var insertResult = await dashboardDataAccess.insertDashboardConfig(userResult.recordsets[0][0].Email, dashboardJson, userId);
            if(insertResult.rowsAffected[0] > 0){
                return {
                    "success": true,
                    "result": "User did not have a dashbaord. New dashboard was created"
                };
            }
            else{
                return {
                    "success": false,
                    "result": "Something went wrong"
                };
            }
            
        }
    }
}