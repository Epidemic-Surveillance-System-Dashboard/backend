import * as chai from 'chai';
import 'mocha';
chai.use(require('chai-http'));
chai.use(require('chai-json'));

const expect = chai.expect;
const base = 'http://localhost:9000'

describe('Dasboard PUT API Update Request', () => {
    it('Should return a  status json object with result', () => {
      //@ts-ignore
      return chai.request(base).put('/api/dashboard/updateDashboard').send({"UserId": 79,
      "DashboardJson": "{\"dashboards\":[{\"Id\":0,\"Title\":\"All Facility Attendance \",\"Locations\":{\"Facility-1215\":{\"Id\":\"1215\",\"Name\":\"Bagega Primary Health Centre\",\"Type\":\"Facility\"}},\"Dates\":{\"StartDate\":\"2015-01-01T00:00:00.000Z\",\"EndDate\":\"2019-01-01T00:00:00.000Z\"},\"Data\":{\"Type\":\"Group\",\"Id\":\"1191\",\"Name\":\"All Facility Attendance (Distribution)\",\"TotalOrDistribution\":\"distribution\",\"GroupValue\":\"1191|Facility Attendance|Group\",\"SetValue\":\"-3-1191|All Facility Attendance (Distribution)|Group\"},\"RawData\":[{\"Total\":\"9073\",\"Metric\":\"Facility Attendance Female\",\"Value\":9073},{\"Total\":\"4069\",\"Metric\":\"Facility Attendance Male\",\"Value\":4069},{\"Total\":\"7261\",\"Metric\":\"Facility Attendance Outpatient\",\"Value\":7261}]}]}"
      }).then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              chai.expect(res.body.success).to.be.equal(true);
              chai.expect(res.body.result).to.be.equal("update success");
          })
      })
  })

describe('Dasboard GET data API Request', () => {
    it('Should return a json object with user dashboard data', () => {
        //@ts-ignore
        return chai.request(base).get('/api/dashboard/83')
            .then(res => {
                //@ts-ignore
                chai.expect(res.body).to.be.a.jsonObj();
                chai.expect(res.body).to.have.any.keys("dashboard");
                chai.expect(res.body.dashboard.Id).to.be.equal("6");
                chai.expect(res.body.dashboard.UserId).to.be.equal("83");
                chai.expect(res.body.dashboard.Email).to.be.equal("emmawatson@gmail.com");
                chai.expect(res.body.dashboard).to.have.any.keys("DashboardJson");
        })
    })
})

describe('Dasboard POST API Add Request', () => {
    it('Should return a status json object with result', () => {
      //@ts-ignore
        return chai.request(base).post('/api/dashboard/addDashboard').send({
        "Email": "bradpitt@gmail.com",
        "UserId": 79,
        "DashboardJson": "{\"dashboards\":[{\"Id\":0,\"Title\":\"All Facility Attendance \",\"Locations\":{\"Facility-1215\":{\"Id\":\"1215\",\"Name\":\"Bagega Primary Health Centre\",\"Type\":\"Facility\"}},\"Dates\":{\"StartDate\":\"2015-01-01T00:00:00.000Z\",\"EndDate\":\"2019-01-01T00:00:00.000Z\"},\"Data\":{\"Type\":\"Group\",\"Id\":\"1191\",\"Name\":\"All Facility Attendance (Distribution)\",\"TotalOrDistribution\":\"distribution\",\"GroupValue\":\"1191|Facility Attendance|Group\",\"SetValue\":\"-3-1191|All Facility Attendance (Distribution)|Group\"},\"RawData\":[{\"Total\":\"9073\",\"Metric\":\"Facility Attendance Female\",\"Value\":9073},{\"Total\":\"4069\",\"Metric\":\"Facility Attendance Male\",\"Value\":4069},{\"Total\":\"7261\",\"Metric\":\"Facility Attendance Outpatient\",\"Value\":7261}]}]}"
        }).then(res => {
            //@ts-ignore
            chai.expect(res.body).to.be.a.jsonObj();
            chai.expect(res.body.Id).to.be.equal("4");
        })
    })
})