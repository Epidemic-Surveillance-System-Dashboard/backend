import { DataByLocationAccess } from '../ApplicationDataAccess/dataByLocationAccess'
import * as config from 'config';

export class DataManager {

    constructor(){}

    public async getDataForSameYear(locationId: number, locationType: string, dataId: number, dataType: string, startDate: Date, endDate: Date, period: string, distribution: string){
        var dataByLocationAccess = new DataByLocationAccess(config.get('sqlConfig'));
        locationType = locationType.toLowerCase();
        dataType = dataType.toLowerCase();
        period = period.toLowerCase();

        var locationFieldObj;
        var dataFieldObj;
        var distributionBool = false;

        if(distribution == "total" || distribution == "none"){
            distributionBool = false;
        }
        else{
            distributionBool = true;
        }

        switch(locationType){
            case "state":
                locationFieldObj = {"fieldName": 'FacilityView.StateId', "dataType": dataType};
                break;
            case "lga":
                locationFieldObj = {"fieldName": 'FacilityView.LGAId', "dataType": dataType};
                break;
            case "ward":
                locationFieldObj = {"fieldName": 'FacilityView.WardId', "dataType": dataType};
                break;
            case "facility":
                locationFieldObj = {"fieldName": 'FacilityView.FacilityId', "dataType": dataType};
                break;
        }

        switch(dataType){
            case "group":
                dataFieldObj = {"fieldName": 'MetricView.GroupId', "dataType": dataType};
                break;
            case "set":
                dataFieldObj = {"fieldName": 'MetricView.SetId', "dataType": dataType};
                break;
            case "metric":
                dataFieldObj = {"fieldName": 'MetricView.MetricId', "dataType": dataType};
                break;
        }

        var result;

        if(locationType == "national"){
            if(period == "month")
                result = await dataByLocationAccess.getDataQueryForSameYearNational(dataId, dataFieldObj, startDate, endDate, distributionBool);
            else
                result = await dataByLocationAccess.getDataQueryNational(dataId, dataFieldObj, startDate, endDate, distributionBool);
        }
        else{
            if(period == "month")
                result = await dataByLocationAccess.getDataQueryForSameYear(locationId, locationFieldObj, dataId, dataFieldObj, startDate, endDate, distributionBool);
            else
                result = await dataByLocationAccess.getDataQuery(locationId, locationFieldObj, dataId, dataFieldObj, startDate, endDate, distributionBool);
        }
        
        return result.recordsets[0];
    }
}