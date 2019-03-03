import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class UserCredentialDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    public insertUserCredential(email: string, passwordHash, dateUpdated: Date){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .input('passwordHash', mssql.NVarChar, passwordHash)
            .input('dateUpdated', mssql.DateTime, dateUpdated)
            .query(`IF NOT EXISTS(SELECT * FROM UserCredentials WHERE Email = @email)
            BEGIN
              INSERT INTO UserCredentials (Email, PasswordHash, DateUpdated) VALUES (@email, @passwordHash, @dateUpdated) select SCOPE_IDENTITY() as Id
            END`);
        });
    }

    public getUserCredential(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT * FROM UserCredentials WHERE Email = @email;');
        });
    }
}