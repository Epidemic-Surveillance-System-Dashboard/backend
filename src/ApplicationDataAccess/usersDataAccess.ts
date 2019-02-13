import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
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
            .input('dateCreated', mssql.DateTime, new Date())
            .input('dateUpdated', mssql.DateTime, new Date())
            .query(`IF NOT EXISTS(SELECT * FROM Users WHERE Email = @email)
            BEGIN
              insert into Users (Email, FirstName, LastName, Phone, UserType, DateCreated, DateUpdated) VALUES (@email, @firstName, @lastName, @phone, @userType, @dateCreated, @dateUpdated) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM Users WHERE Email = @email
            END`);
        });
    }

    getUserByEmail(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email;');
        });
    }

    getUserById(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .query('SELECT * FROM Users WHERE Id = @userId;');
        });
    }

    //need to add filter logic later
    getAllUsers(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            //.input('userId', mssql.BigInt, userId)
            .query('SELECT * FROM Users');
        });
    }

    deleteUserByEmail(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .query('DELETE * FROM Users WHERE Email = @email;');
        });
    }

    deleteUserById(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .query('DELETE FROM Users WHERE Id = @userId;');
        });
    }

    updateUser(oldEmail: string, newEmail: string, firstName: string, lastName: string, phone: string, userType: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('oldEmail', mssql.NVarChar, oldEmail)
            .input('newEmail', mssql.NVarChar, newEmail)
            .input('firstName', mssql.NVarChar, firstName)
            .input('lastName', mssql.NVarChar, lastName)
            .input('phone', mssql.NVarChar, phone)
            .input('userType', mssql.NVarChar, userType)
            .input('dateUpdated', mssql.NVarChar, new Date())
            .query('UPDATE Users SET Email = @newEmail, FirstName = @firstName, LastName = @lastName, Phone = @phone, UserType = @userType, DateUpdated = @dateUpdated WHERE Email = @oldEmail;');
        });
    }
}