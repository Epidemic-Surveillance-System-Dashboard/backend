import { UserCredentialDataAccess } from '../src/ApplicationDataAccess/userCredentialDataAccess';
import { UserCredentialService } from '../src/Controllers/userCredentialService';
import { UsersDataAccess } from '../src/ApplicationDataAccess/usersDataAccess';
import { UserCredentialManager } from '../src/Controllers/userCredentialManager';
import * as chai from 'chai';
import * as sinon from 'sinon';

describe('login', () => {
    var getUserCredentialStub;
    var compareStub;
    var getUserByEmailStub;

    var tests = [
        {
            testMsg: "should return false if user does not exist",
            userCredentialValue: {rowsAffected: [0]},
            compareValue: true,
            userByEmailValue: {recordsets: [[{email: "email"}]]},
            verifyFn: (result) => {chai.assert.equal(result.success, false)}
        },
        {
            testMsg: "should return true if successfully authenticated user",
            userCredentialValue: {rowsAffected: [1], recordsets: [[{PasswordHash: "email"}]]},
            compareValue: true,
            userByEmailValue: {recordsets: [[{email: "email"}]]},
            verifyFn: (result) => {chai.assert.equal(result.success, true)}
        },
        {
            testMsg: "should return false authentication is unsuccessful",
            userCredentialValue: {rowsAffected: [1], recordsets: [[{PasswordHash: "email"}]]},
            compareValue: false,
            userByEmailValue: {recordsets: [[{email: "email"}]]},
            verifyFn: (result) => {chai.assert.equal(result.success, false)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            getUserCredentialStub.returns(oneTest.userCredentialValue); 
            compareStub.returns(oneTest.compareValue);
            getUserByEmailStub.returns(oneTest.userByEmailValue);
            var result = await new UserCredentialManager().login("","");
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        getUserCredentialStub = sinon.stub(UserCredentialDataAccess.prototype, "getUserCredential");
        compareStub = sinon.stub(UserCredentialService.prototype, "compare");
        getUserByEmailStub = sinon.stub(UsersDataAccess.prototype, "getUserByEmail");
    });
    afterEach(function() {
        sinon.restore();
    });

  });

  describe('encrypt', () => {
    var tests = [
        {
            testMsg: "should successfully encrypt password",
            password: "helloworld",
            verifyFn: (result) => {chai.should().exist(result)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            var result = await new UserCredentialService().encrypt(oneTest.password)
            oneTest.verifyFn(result);
        });
    });
  });

  describe('compare', () => {
    var password = "helloworld";
    var tests = [
        {
            testMsg: "should return true if its the same password",
            password: "helloworld",
            verifyFn: (result) => {chai.assert.equal(result, true)}
        },
        {
            testMsg: "should return false if its the passwords are not the same",
            password: "helloworld123",
            verifyFn: (result) => {chai.assert.equal(result, false)}
        }
    ];

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            var encryptedPassword = await new UserCredentialService().encrypt(password);
            var result = await new UserCredentialService().compare(oneTest.password, encryptedPassword);
            oneTest.verifyFn(result);
        });
    });
  });