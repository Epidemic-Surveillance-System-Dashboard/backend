import * as chai from 'chai';
import 'mocha';
chai.use(require('chai-http'));
chai.use(require('chai-json'));

const expect = chai.expect;
const base = 'http://localhost:9000'

describe('Location Hierarchy API Request', () => {
  it('Should return a json object with locations hierarchy', () => {
    //@ts-ignore
    return chai.request(base).get('/api/locationshierarchy')
        .then(res => {
            //@ts-ignore
            chai.expect(res.body).to.be.a.jsonObj();
            chai.expect(res.body).to.have.any.keys("State");
            chai.expect(res.body).to.have.any.keys("LGA");
            chai.expect(res.body).to.have.any.keys("Ward");
            chai.expect(res.body).to.have.any.keys("Facility");
            chai.expect(res.body.State.length).to.be.above(0);
            chai.expect(res.body.LGA.length).to.be.above(0);
            chai.expect(res.body.Ward.length).to.be.above(0);
            chai.expect(res.body.Facility.length).to.be.above(0);
        })
    })
})

//http://localhost:9000/api/data/location?state=Zamfara&lga=Anka&ward=Bagega&facility=Kawaye ensary

describe('Location Data API Request', () => {
    it('Should return a json object with location data', () => {
        //@ts-ignore
        return chai.request(base).get('/api/data/location?state=Zamfara&lga=Anka&ward=Bagega&facility=Kawaye ensary')
          .then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              chai.expect(res.body).to.have.any.keys("Data");
              chai.expect(res.body.Data[0]).to.have.any.keys("Id");
              chai.expect(res.body.Data[0]).to.have.any.keys("MetricId");
              chai.expect(res.body.Data[0]).to.have.any.keys("FacilityId");
              chai.expect(res.body.Data[0]).to.have.any.keys("Value");
              chai.expect(res.body.Data[0]).to.have.any.keys("Time");
              chai.expect(res.body.Data.length).to.be.above(0);
        })
    })
})

describe('Data Hierarchy API Request', () => {
    it('Should return a json object with data hierarchy', () => {
        //@ts-ignore
        return chai.request(base).get('/api/data/hierarchy')
          .then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              chai.expect(res.body).to.have.any.keys("Groups");
              chai.expect(res.body).to.have.any.keys("Sets");
              chai.expect(res.body).to.have.any.keys("Metrics");
              chai.expect(res.body.Groups.length).to.be.above(0);
              chai.expect(res.body.Sets.length).to.be.above(0);
              chai.expect(res.body.Metrics.length).to.be.above(0);
        })
    })
})