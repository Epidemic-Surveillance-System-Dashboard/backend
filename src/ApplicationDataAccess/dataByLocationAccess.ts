import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class DataByLocationAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getDataByLocation(state: string, lga: string, ward: string, facility: string) {
        
        if (state != null && lga == null && ward == null && facility == null) {
            return this.getDataByState(state);
        } 
        else if (state != null && lga != null && ward == null && facility == null) {
            return this.getDataByLga(state, lga);
        } 
        else if (state != null && lga != null && ward != null && facility == null) {
            return this.getDataByWard(state, lga, ward);
        } 
        else if (state != null && lga != null && ward != null && facility != null) {
            return this.getDataByFacility(state, lga, ward, facility);
        } 
        else {
            return Promise.resolve(null);
        }
    }

    getDataByState(state: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select Id, MetricId, FacilityId, Value, NewTime as Time FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}');`
            );            
        });
    }

    getDataByLga(state: string, lga: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select Id, MetricId, FacilityId, Value, NewTime as Time FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}');`
            );            
        });
    }

    getDataByWard(state: string, lga: string, ward: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select Id, MetricId, FacilityId, Value, NewTime as Time FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}');`
            );            
        });
    }

    getDataByFacility(state: string, lga: string, ward: string, facility: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select Id, MetricId, FacilityId, Value, NewTime as Time FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}' AND FacilityName = '${facility}');`
            );            
        });
    }

    getDataQueryForSameYearNational(dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){
        
        var distributionSqlTextObj = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(`Select Sum(Data.Value) as Total, Datepart(month, data.NewTime) as Month ${distributionSqlTextObj.distributionSqlSelectText} from Data
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${dataFieldObj.fieldName} = @dataId
            and data.NewTime >= @startDate 
            and data.NewTime <= @endDate
            group by Datepart(month, data.NewTime) ${distributionSqlTextObj.distributionSqlGroupByText}
            Order by Datepart(month, data.NewTime)`
            );            
        });
    }

    getDataQueryNational(dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){
       
        var distributionSqlTextObj = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(`Select Sum(Data.Value) as Total, DatePart(year, data.NewTime) as Yr ${distributionSqlTextObj.distributionSqlSelectText} from Data 
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${dataFieldObj.fieldName} = @dataId
            and data.NewTime >= @startDate
            and data.NewTime <= @endDate
            group by DatePart(year, data.NewTime) ${distributionSqlTextObj.distributionSqlGroupByText}
             Order by Datepart(year, data.NewTime)`
            );            
        });
    }

    getDataQueryForSameYear(locationId: number, locationObj: any, dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){

        var distributionSqlTextObj = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('locationId', mssql.BigInt, locationId)
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(`Select Sum(Data.Value) as Total, Datepart(month, data.NewTime) as Month ${distributionSqlTextObj.distributionSqlSelectText} from Data
            Join FacilityView on Data.FacilityId = FacilityView.FacilityId
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${locationObj.fieldName} = @locationId
            and ${dataFieldObj.fieldName} = @dataId
            and data.NewTime >= @startDate 
            and data.NewTime <= @endDate
            group by Datepart(month, data.NewTime) ${distributionSqlTextObj.distributionSqlGroupByText}
            order by Datepart(month, data.NewTime)`
            );            
        });
    }

    getDataQuery(locationId: number, locationFieldObj: any, dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){
        
        var distributionSqlTextObj = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution);
        
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('locationId', mssql.BigInt, locationId)
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(`Select Sum(Data.Value) as Total, DatePart(year, data.NewTime) as Yr ${distributionSqlTextObj.distributionSqlSelectText} from Data 
            Join FacilityView on Data.FacilityId = FacilityView.FacilityId
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${locationFieldObj.fieldName} = @locationId
            and ${dataFieldObj.fieldName} = @dataId
            and data.NewTime >= @startDate
            and data.NewTime <= @endDate
            group by DatePart(year, data.NewTime) ${distributionSqlTextObj.distributionSqlGroupByText}
            order by DatePart(year, data.NewTime)`
            );            
        });
    }

    private getDistributionSqlText(dataType: string, isDistribution: boolean){
        var sqlTextObj  = {
            "distributionSqlSelectText": '',
            "distributionSqlGroupByText": ''
        };
        if(isDistribution){
            switch(dataType){
                case "set":
                    sqlTextObj.distributionSqlSelectText = ', MetricView.MetricName';
                    sqlTextObj.distributionSqlGroupByText = ', MetricView.MetricName';
                    break;
                case "group":
                    sqlTextObj.distributionSqlSelectText = ', MetricView.SetName';
                    sqlTextObj.distributionSqlGroupByText = ', MetricView.SetName';
                    break;
            }
        }

        return sqlTextObj;
    }
}