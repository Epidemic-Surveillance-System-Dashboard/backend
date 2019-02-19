import { DashboardDataAccess } from '../ApplicationDataAccess/dashboardDataAccess';
import { UsersDataAccess } from '../ApplicationDataAccess/usersDataAccess';
import * as config from 'config';

export class DashboardManager {

    constructor(){

    }

    public async getDashboardConfig(userId: number){
        var dashbaordDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var dashboardConfigResult = await dashbaordDataAccess.getDashboardConfig(userId);
        if(dashboardConfigResult.recordsets[0].length == 0){
            return {"error": "user does not have a dashboard"};
        }
        return dashboardConfigResult.recordsets[0][0];
    }

    public async addDashboardConfig(email: string, userId: number, dashboardJson: string){
        var dashbaordDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var usersDataAccess = new UsersDataAccess(config.get('sqlConfig'));

        var userResult = await usersDataAccess.getUserById(userId);
        if(userResult.recordsets[0].length == 0){
            return {"error": "user does not exist"};
        }

        var dashboardResult = await dashbaordDataAccess.getDashboardConfig(userId);
        if(dashboardResult.recordsets[0].length == 0){
            return {"error": "A dashboard for this user already exists."};
        }

        var result = await dashbaordDataAccess.insertDashboardConfig(email, dashboardJson, userId);
        return result.recordsets[0][0];
    }

    public async updateDashboardConfig(userId: number, dashboardJson: string){
        var dashbaordDataAccess = new DashboardDataAccess(config.get('sqlConfig'));
        var result = await dashbaordDataAccess.updateDashboardConfig(userId, dashboardJson);

        if(result.rowsAffected[0] > 0){
            return {"result": "update success"};
        }
        else {
            return {"result": "user does not exist"};
        }
    }

}