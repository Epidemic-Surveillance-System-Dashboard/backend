import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class UsersDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    insertUser(email: string, firstName: string, lastName: string, phone: string, userType: string){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .input('firstName', mssql.NVarChar, firstName)
            .input('lastName', mssql.NVarChar, lastName)
            .input('phone', mssql.NVarChar, phone)
            .input('userType', mssql.NVarChar, userType)
            .query(`IF NOT EXISTS(SELECT * FROM Users WHERE Name = @email)
            BEGIN
              insert into Users (Email, FirstName, LastName, Phone, UserType) VALUES (@email, @firstName, @lastName, @phone, @userType) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM Users WHERE Email = @email
            END`);
        });
    }

    getUser(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email;');
        });
    }
}