import { DashboardManager } from '../src/Controllers/dashboardManager';
import { DashboardDataAccess } from '../src/ApplicationDataAccess/dashboardDataAccess';
import { UsersDataAccess } from '../src/ApplicationDataAccess/usersDataAccess';
import * as chai from 'chai';
import * as sinon from 'sinon';

describe('getDashboardConfig', () => {
    var dashboardDataAccessStub;
    var tests = [];

    tests.push({
        "test": "dashboard info when there is dashboard info",
        verifyFn: (result) => {chai.should().exist(result)},
        recordsets: [[{
        "dashboard": {
            "Id": "4",
            "Email": "bradpitt@gmail.com",
            "UserId": "79",
            "DashboardJson": "{}"
        }
    }]]});

    tests.push({
        "test": "no dashboard info when there is no dashboard info", 
        verifyFn: (result) => {chai.should().exist(result.error)},
        recordsets: [[]]
    });

    tests.forEach((oneTest) => {
        it(`should return ${oneTest.test}`, async () => {   
            dashboardDataAccessStub.returns(oneTest); 
            var result = await new DashboardManager().getDashboardConfig(1);
            oneTest.verifyFn(result);
        });
    });

    beforeEach(function() {
        dashboardDataAccessStub = sinon.stub(DashboardDataAccess.prototype, "getDashboardConfig");
    });
    afterEach(function() {
        sinon.restore();
    });

  });

  describe('updateDashboardConfig', () => {
    var dashboardDataAccessInsertConfigStub;
    var userDataAccessGetUserByIdStub;
    var dashboardDataAccessUpdateDashboardConfigStub;
    var tests = [
        {
            testMsg: "should return true if update is successful",
            getUserIdValue: {recordsets: [{length: 1}]},
            insertDashboardConfigValue: {rowsAffected: [1]},
            updateDashboardConfigValue: {rowsAffected: [1]},
            verifyFn: (result) => {chai.assert.equal(result.success, true)}
        },
        {
            testMsg: "should return error if user does not exist",
            getUserIdValue: {rowsAffected: [0]},
            insertDashboardConfigValue: {rowsAffected: [1]},
            updateDashboardConfigValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.success, false)}
        },
        {
            testMsg: "should return error if user does not exist",
            getUserIdValue: {rowsAffected: [1], recordsets: [[{Email: ""}]]},
            insertDashboardConfigValue: {rowsAffected: [1]},
            updateDashboardConfigValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.success, true)}
        },
        {
            testMsg: "should return error if user does not exist",
            getUserIdValue: {rowsAffected: [1], recordsets: [[{Email: ""}]]},
            insertDashboardConfigValue: {rowsAffected: [0]},
            updateDashboardConfigValue: {rowsAffected: [0]},
            verifyFn: (result) => {chai.assert.equal(result.success, false)}
        }
    ];

    beforeEach(function() {
        dashboardDataAccessInsertConfigStub = sinon.stub(DashboardDataAccess.prototype, "insertDashboardConfig");
        userDataAccessGetUserByIdStub = sinon.stub(UsersDataAccess.prototype, "getUserById");
        dashboardDataAccessUpdateDashboardConfigStub = sinon.stub(DashboardDataAccess.prototype, "updateDashboardConfig");
    });

    afterEach(function() {
        sinon.restore();
    });

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            dashboardDataAccessInsertConfigStub.returns(oneTest.insertDashboardConfigValue);
            userDataAccessGetUserByIdStub.returns(oneTest.getUserIdValue);
            dashboardDataAccessUpdateDashboardConfigStub.returns(oneTest.updateDashboardConfigValue); 
            var result = await new DashboardManager().updateDashboardConfig(1, "");
            oneTest.verifyFn(result);
        });
    });
  });

describe('addDashboardConfig', () => {
    var dashboardDataAccessGetConfigStub;
    var userDataAccessGetUserByIdStub;
    var dashboardDataAccessInsertDashboardConfigStub;
    var tests = [
        {
            testMsg: "should return dashboard config info if successfully added dashboard config",
            getUserIdValue: {recordsets: [{length: 1}]},
            getDashboardConfigValue: {recordsets: [{length: 1}]},
            insertDashboardConfigValue: {recordsets: [[{
                "dashboard": {
                    "Id": "4",
                    "Email": "bradpitt@gmail.com",
                    "UserId": "79",
                    "DashboardJson": "{}"
                }}]]
            },
            verifyFn: (result) => {chai.should().exist(result)}
        },
        {
            testMsg: "should return error if user does not exist",
            getUserIdValue: {recordsets: [{length: 0}]},
            getDashboardConfigValue: {recordsets: [{length: 1}]},
            insertDashboardConfigValue: {},
            verifyFn: (result) => {chai.should().exist(result.error)}
        },
        {
            testMsg: "should return error if dashboard config already exists for the user",
            getUserIdValue: {recordsets: [{length: 1}]},
            getDashboardConfigValue: {recordsets: [{length: 0}]},
            insertDashboardConfigValue: {},
            verifyFn: (result) => {chai.should().exist(result.error)}
        }
    ];

    beforeEach(function() {
        dashboardDataAccessGetConfigStub = sinon.stub(DashboardDataAccess.prototype, "getDashboardConfig");
        userDataAccessGetUserByIdStub = sinon.stub(UsersDataAccess.prototype, "getUserById");
        dashboardDataAccessInsertDashboardConfigStub = sinon.stub(DashboardDataAccess.prototype, "insertDashboardConfig");
    });
    afterEach(function() {
        sinon.restore();
    });

    tests.forEach((oneTest) => {
        it(oneTest.testMsg, async () => {   
            dashboardDataAccessGetConfigStub.returns(oneTest.getDashboardConfigValue);
            userDataAccessGetUserByIdStub.returns(oneTest.getUserIdValue);
            dashboardDataAccessInsertDashboardConfigStub.returns(oneTest.insertDashboardConfigValue); 
            var result = await new DashboardManager().addDashboardConfig("", 3, "");
            oneTest.verifyFn(result);
        });
    });
  });

  