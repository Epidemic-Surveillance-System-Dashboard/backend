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

  describe('deleteUserById', () => {
    var deleteUserByIdStub;

    var tests = [
        {
            testMsg: "should return delete success when user is successfully deleted from database",
            deleteUserById: {rowsAffected: [1]},
            verifyFn: (result) => {chai.assert.equal(result.result, "delete success")}
        },
        {
            testMsg: "should return user does not exist if user is not in the database",
            deleteUserById: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.result, "user does not exist")}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            deleteUserByIdStub.returns(oneTest.deleteUserById); 
            var result = await new UserManager().deleteUserById(1);
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        deleteUserByIdStub = sinon.stub(UsersDataAccess.prototype, "deleteUserById");
    });
    afterEach(function() {
        sinon.restore();
    });

  });

  describe('updateUser', () => {
    var updateUserStub;
    var updateUserLocationStub;
    var getLocationNameStub;
    var insertUserLocationStub;

    var tests = [
        {
            testMsg: "should return user does not exist if user is not in the database",
            updateUserValue: {rowsAffected: [0]},
            updateUserLocationValue: {rowsAffected: [0]},
            getLocationNameValue: "",
            insertUserLocationValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.result, "User does not exist")}
        },
        {
            testMsg: "should return Failed to update user location if user location could not be updated",
            updateUserValue: {rowsAffected: [1]},
            updateUserLocationValue: {rowsAffected: [0]},
            getLocationNameValue: "",
            insertUserLocationValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.result, "Failed to update user location")}
        },
        {
            testMsg: "should return update successful if the user has been updated",
            updateUserValue: {rowsAffected: [1]},
            updateUserLocationValue: {rowsAffected: [1]},
            getLocationNameValue: "",
            insertUserLocationValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.result, "Update successful")}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            updateUserStub.returns(oneTest.updateUserValue); 
            updateUserLocationStub.returns(oneTest.updateUserLocationValue);
            getLocationNameStub.returns(oneTest.getLocationNameValue);
            insertUserLocationStub.returns(oneTest.insertUserLocationValue);
            var result = await new UserManager().updateUser(1,"","","","","",2,"");
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        updateUserStub = sinon.stub(UsersDataAccess.prototype, "updateUser");
        updateUserLocationStub = sinon.stub(UserLocationDataAccess.prototype, "updateUserLocation");
        getLocationNameStub = sinon.stub(FacilityViewDataAccess.prototype, "getLocationName");
        insertUserLocationStub = sinon.stub(UserLocationDataAccess.prototype, "insertUserLocation");
    });
    afterEach(function() {
        sinon.restore();
    });

  });


  describe('parseChildLocationIds', () => {

    var tests = [
        {
            testMsg: "should return array of child location IDs",
            rawObject: [
                { LGAId: 5, WardId: 5, FacilityId: 5 },
                { LGAId: 6, WardId: 5, FacilityId: 9 },
                { LGAId: 3, WardId: 4, FacilityId: 0 },
                { LGAId: 1, WardId: 3, FacilityId: 6 }
            ],
            verifyFn: (result) => {chai.should().exist(result)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            var result = await new UserManager().parseChildLocationIds(oneTest.rawObject);
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
    });
    afterEach(function() {
    });

  });

  describe('convertUserIdToIntArray', () => {

    var tests = [
        {
            testMsg: "should return an array of ints",
            rawObject: [
                { UserId: 5 },
                { UserId: 5 },
                { UserId: 6 },
                { UserId: 4 },
                { UserId: 8 }
            ],
            verifyFn: (result) => {chai.should().exist(result)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            var result = await new UserManager().convertUserIdsToIntArray(oneTest.rawObject);
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
    });
    afterEach(function() {
    });

  });