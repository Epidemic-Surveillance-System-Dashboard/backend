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
            .input('dateUpdated', mssql.BigInt, dateUpdated)
            .query(`IF NOT EXISTS(SELECT * FROM UserCredentials WHERE Email = @userId)
            BEGIN
              INSERT INTO UserCredentials (Email, PasswordHash, DateUpdated) VALUES (@email, @passwordHas, @dateUpdated) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM UserCredentials WHERE Email = @email
            END`);
        });
    }

    public getUserCredential(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.BigInt, email)
            .query('SELECT * FROM UserCredentials WHERE Email = @email;');
        });
    }
}