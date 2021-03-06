import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class WardDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertWard(name: string, lgaId: number){
        return this.retryQuery(() => {
            return SqlDataAccess.sqlPool.then(pool => {
                return pool.request()
                .input('ward', mssql.NVarChar, name)
                .input('lgaId', mssql.BigInt, lgaId)
                .query(`
                SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
                BEGIN TRAN
                IF NOT EXISTS(SELECT * FROM ward WHERE Name = @ward)
                BEGIN
                    INSERT INTO Ward (Name, LGAId) VALUES (@ward, @lgaId) SELECT SCOPE_IDENTITY() as Id
                END
                ELSE
                BEGIN
                  SELECT Id FROM ward WHERE Name = @ward
                END
                COMMIT TRAN`);
            });
        }); 
    }

    getWardId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('ward', mssql.NVarChar, name)
            .query('SELECT Id FROM Ward WHERE Name = @ward');
        });
    }
}