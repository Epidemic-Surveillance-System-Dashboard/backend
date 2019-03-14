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
        
        var query = this.getDistributionSqlTextNational(dataFieldObj.dataType, isDistribution, dataFieldObj.dataFieldName);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(query);            
        });
    }

    getDataQueryNational(dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){
       
        var query = this.getDistributionSqlTextNational(dataFieldObj.dataType, isDistribution, dataFieldObj.dataFieldName);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(query);            
        });
    }

    getDataQueryForSameYear(locationId: number, locationObj: any, dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){

        var query = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution, locationObj.fieldName, dataFieldObj.fieldName);

        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('locationId', mssql.BigInt, locationId)
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(query);            
        });
    }

    getDataQuery(locationId: number, locationFieldObj: any, dataId: number, dataFieldObj: any, startDate: Date, endDate: Date, isDistribution: boolean){
        
        var distributionSqlTextObj = this.getDistributionSqlText(dataFieldObj.dataType, isDistribution, locationFieldObj.fieldName, dataFieldObj.fieldName);
        
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('locationId', mssql.BigInt, locationId)
            .input('dataId', mssql.BigInt, dataId)
            .input('startDate', mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .query(distributionSqlTextObj
            );            
        });
    }

    private getDistributionSqlText(dataType: string, isDistribution: boolean, locationFieldName: string, dataFieldName: string ){
        let query = ""
                //Sum(Data.Value) as Total
        if(isDistribution){
            switch(dataType){
                
                case "set":
                    //Group By Metric Name and Sort by Relative Order
                    query = `
                    Select Sum(Data.Value) as Total, MetricView.MetricName as Metric, MetricView.RelativeOrder from Data 
                    Join FacilityView on Data.FacilityId = FacilityView.FacilityId
                    Join MetricView on Data.MetricId = MetricView.MetricId
                    where ${locationFieldName} = @locationId
                    and ${dataFieldName} = @dataId
                    and data.NewTime >= @startDate
                    and data.NewTime <= @endDate
                    group by MetricView.MetricName, MetricView.RelativeOrder
                    order by MetricView.RelativeOrder`
                    break;
                case "group":
                    //Group by Set Name
                    query = `Select Sum(Data.Value) as Total, MetricView.SetName as Metric, from Data 
                    Join FacilityView on Data.FacilityId = FacilityView.FacilityId
                    Join MetricView on Data.MetricId = MetricView.MetricId
                    where ${locationFieldName} = @locationId
                    and ${dataFieldName} = @dataId
                    and data.NewTime >= @startDate
                    and data.NewTime <= @endDate
                    group by MetricView.SetName`
                    break;
            }
        }
        else{
            query = `Select Sum(Data.Value) as Total, DatePart(year, data.newTime) as Yr from Data 
            Join FacilityView on Data.FacilityId = FacilityView.FacilityId
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${locationFieldName} = @locationId
            and ${dataFieldName} = @dataId
            and data.NewTime >= @startDate
            and data.NewTime <= @endDate
            group by DatePart(year, data.NewTime)`
        }

        return query;
    }

    private getDistributionSqlTextNational(dataType: string, isDistribution: boolean, dataFieldName: string ){
        let query = ""
        if(isDistribution){
            switch(dataType){
                
                case "set":
                    query = `
                    Select Sum(Data.Value) as Total, MetricView.MetricName, MetricView.RelativeOrder from Data 
                    Join FacilityView on Data.FacilityId = FacilityView.FacilityId
                    Join MetricView on Data.MetricId = MetricView.MetricId
                    where ${dataFieldName} = @dataId
                    and data.NewTime >= @startDate
                    and data.NewTime <= @endDate
                    group by MetricView.MetricName, MetricView.RelativeOrder`
                    break;
                case "group":
                    query = `Select Sum(Data.Value) as Total, MetricView.SetName from Data 
                    Join FacilityView on Data.FacilityId = FacilityView.FacilityId
                    Join MetricView on Data.MetricId = MetricView.MetricId
                    where ${dataFieldName} = @dataId
                    and data.NewTime >= @startDate
                    and data.NewTime <= @endDate
                    group by MetricView.SetName`
                    break;
            }
        }
        else{
            query = `
            Select Sum(Data.Value) as Total, DatePart(year, data.newTime) from Data 
            Join FacilityView on Data.FacilityId = FacilityView.FacilityId
            Join MetricView on Data.MetricId = MetricView.MetricId
            where ${dataFieldName} = @dataId
            and data.NewTime >= @startDate
            and data.NewTime <= @endDate
            group by DatePart(year, data.NewTime)`
        }

        return query;
    }
}