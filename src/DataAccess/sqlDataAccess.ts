import * as mssql from 'mssql';

export class SqlDataAccess {

    public static sqlPool;

    constructor(config){
        if(SqlDataAccess.sqlPool == null || SqlDataAccess.sqlPool == undefined){
            SqlDataAccess.sqlPool = new mssql.ConnectionPool(JSON.parse(JSON.stringify(config))).connect();
        }
    }

    protected parameterizeInQuery(request, columnName, values, type, paramterNamePrefix){
        var parameterNames = [];
        parameterNames.push(-1);
        for (var i = 0; i < values.length; i++) {
            var parameterName = paramterNamePrefix + i;
            request.input(parameterName, type, values[i]);
            parameterNames.push(`@${parameterName}`);
        }
        return `${columnName} IN (${parameterNames.join(',')})`;
    }

    protected async retryQuery(fn){
        var maxRetries = 20;
        var delay = 500;
        var maxDelay = 10000;
        var delayRound = 1;
        var currentRetries = 0;
        while(currentRetries < maxRetries){
            try {
                return fn();
            }
            catch(e){
                currentRetries++;
                if(delay <= maxDelay){
                    delay = delay * delayRound;
                    delayRound++;
                }
                await this.sleep(delay);
            }
        }
    }

    private sleep(ms){
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}