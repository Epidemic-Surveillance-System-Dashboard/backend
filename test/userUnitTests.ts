import { UsersDataAccess } from '../src/ApplicationDataAccess/usersDataAccess';
import { UserCredentialDataAccess } from '../src/ApplicationDataAccess/userCredentialDataAccess';
import { UserCredentialService } from '../src/Controllers/userCredentialService';
import { UserLocationDataAccess } from '../src/ApplicationDataAccess/userLocationDataAccess';
import { FacilityViewDataAccess } from '../src/DataAccess/facilityViewDataAccess';
import { UserManager } from '../src/Controllers/userManager';
import * as chai from 'chai';
import * as sinon from 'sinon';

describe('getUserById', () => {
    var getUserByIdStub;

    var tests = [
        {
            testMsg: "should return user if user exists",
            getUserByIdValue: {rowsAffected: [1], recordsets: [[{}]]},
            verifyFn: (result) => {chai.should().exist(result.user)}
        },
        {
            testMsg: "should return an error if user does not exist",
            getUserByIdValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.should().exist(result.error)}
        },
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            getUserByIdStub.returns(oneTest.getUserByIdValue); 
            var result = await new UserManager().getUserById(1);
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        getUserByIdStub = sinon.stub(UsersDataAccess.prototype, "getUserById");
    });
    afterEach(function() {
        sinon.restore();
    });

  });

  describe('obtainAllUsers', () => {
    var getUserByIdStub;

    var tests = [
        {
            testMsg: "should return object of all users",
            getUserByIdValue: {recordsets: [{}]},
            verifyFn: (result) => {chai.should().exist(result)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            getUserByIdStub.returns(oneTest.getUserByIdValue); 
            var result = await new UserManager().obtainAllUsers();
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        getUserByIdStub = sinon.stub(UsersDataAccess.prototype, "getAllUsers");
    });
    afterEach(function() {
        sinon.restore();
    });

  });

  describe('addUser', () => {
    var getUserByEmailStub;
    var insertUserStub;
    var encryptStub;
    var insertUserCredentialStub;
    var getLocationNameStub;
    var insertUserLocationStub;

    var tests = [
        {
            testMsg: "should return Id of user if user was successfully created",
            getUserByEmailValue: {recordsets: [{length: 0}]},
            insertUserValue: {recordsets: [[{Id: 2}]]},
            encryptValue: "encryptedPassword",
            getLocationNameValue: {recordsets: [[{StateName: "hello world"}]]},
            verifyFn: (result) => {chai.should().exist(result.Id)}
        },
        {
            testMsg: "should return an error if user already exists",
            getUserByEmailValue: {recordsets: [{length: 1}]},
            insertUserValue: {recordsets: [[{Id: 2}]]},
            encryptValue: "encryptedPassword",
            getLocationNameValue: {recordsets: [[{StateName: "hello world"}]]},
            verifyFn: (result) => {chai.should().exist(result.error)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            getUserByEmailStub.returns(oneTest.getUserByEmailValue); 
            insertUserStub.returns(oneTest.insertUserValue);
            encryptStub.returns(oneTest.encryptValue);
            insertUserCredentialStub.returns();
            getLocationNameStub.returns(oneTest.getLocationNameValue);
            insertUserLocationStub.returns();
            var result = await new UserManager().addUser("", "", "", "" ,"" ,2 ,"State");
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        getUserByEmailStub = sinon.stub(UsersDataAccess.prototype, "getUserByEmail");
        insertUserStub = sinon.stub(UsersDataAccess.prototype, "insertUser");
        encryptStub = sinon.stub(UserCredentialService.prototype, "encrypt");
        insertUserCredentialStub = sinon.stub(UserCredentialDataAccess.prototype, "insertUserCredential");
        getLocationNameStub = sinon.stub(FacilityViewDataAccess.prototype, "getLocationName");
        insertUserLocationStub = sinon.stub(UserLocationDataAccess.prototype, "insertUserLocation");
    });
    afterEach(function() {
        sinon.restore();
    });

  });