import { SqlDataAccess } from './sqlDataAccess';
import * as config from 'config';
import * as mssql from 'mssql';

export class StateDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertState(name: string){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('state', mssql.NVarChar, name)
            .query('INSERT INTO State (Name) VALUES (@state);');
        });
    }

    getStateId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('state', mssql.NVarChar, name)
            .query('SELECT Id FROM State WHERE Name = @state;');
        });
    }
}

var test = new StateDataAccess(config.get('sqlConfig'));
test.insertState('stater1234');