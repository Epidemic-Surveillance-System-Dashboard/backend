import * as chai from 'chai';
import 'mocha';
chai.use(require('chai-http'));
chai.use(require('chai-json'));

const expect = chai.expect;
const base = 'http://localhost:9000'

describe('Users GET All users API Request', () => {
    it('Should return a json object with users', () => {
        //@ts-ignore
        return chai.request(base).get('/api/users/temp/allUsers')
            .then(res => {
                //@ts-ignore
                chai.expect(res.body).to.be.a.jsonObj();
                chai.expect(res.body[0]).to.have.any.keys("Email");
                chai.expect(res.body[0]).to.have.any.keys("Id");
                chai.expect(res.body[0]).to.have.any.keys("FirstName");
                chai.expect(res.body[0]).to.have.any.keys("LastName");
                chai.expect(res.body[0]).to.have.any.keys("Phone");
                chai.expect(res.body[0]).to.have.any.keys("UserType");
                chai.expect(res.body[0]).to.have.any.keys("DateCreated");
                chai.expect(res.body[0]).to.have.any.keys("DateUpdated");
        })
    })
})

describe('Users GET All users under another user ID API Request', () => {
    it('Should return a json object with users', () => {
        //@ts-ignore
        return chai.request(base).get('/api/users/getAllUsers/79')
            .then(res => {
                //@ts-ignore
                chai.expect(res.body).to.be.a.jsonObj();
                chai.expect(res.body.users[0]).to.have.any.keys("Email");
                chai.expect(res.body.users[0]).to.have.any.keys("Id");
                chai.expect(res.body.users[0]).to.have.any.keys("FirstName");
                chai.expect(res.body.users[0]).to.have.any.keys("LastName");
                chai.expect(res.body.users[0]).to.have.any.keys("Phone");
                chai.expect(res.body.users[0]).to.have.any.keys("UserType");
                chai.expect(res.body.users[0]).to.have.any.keys("DateCreated");
                chai.expect(res.body.users[0]).to.have.any.keys("DateUpdated");
                chai.expect(res.body.users[0]).to.have.any.keys("LocationType");
                chai.expect(res.body.users[0]).to.have.any.keys("LocationId");
        })
    })
})

describe('Users GET user info API Request', () => {
    it('Should return a json object with user info', () => {
        //@ts-ignore
        return chai.request(base).get('/api/users/79')
            .then(res => {
                //@ts-ignore
                chai.expect(res.body).to.be.a.jsonObj();
                chai.expect(res.body.user).to.have.any.keys("Email");
                chai.expect(res.body.user).to.have.any.keys("Id");
                chai.expect(res.body.user).to.have.any.keys("FirstName");
                chai.expect(res.body.user).to.have.any.keys("LastName");
                chai.expect(res.body.user).to.have.any.keys("Phone");
                chai.expect(res.body.user).to.have.any.keys("UserType");
                chai.expect(res.body.user).to.have.any.keys("DateCreated");
                chai.expect(res.body.user).to.have.any.keys("DateUpdated");
                chai.expect(res.body.user).to.have.any.keys("LocationType");
                chai.expect(res.body.user).to.have.any.keys("LocationId");
        })
    })
})

var testUserId = "";

describe('Dasboard POST register user API request', () => {
    it('Should return a status json object with result', () => {
      //@ts-ignore
      return chai.request(base).post('/api/users/register').send({
        "FirstName": "Test",
        "LastName": "Test",
        "Phone": "123 123-0123",
        "Email": "TestEmail@gmail.com",
        "UserType": "Test",
        "LocationId": "249",
        "LocationType": "LGA"
    }).then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              testUserId = res.body.Id;
              console.log("Test User Id: " + testUserId)              
              chai.expect(res.body).to.have.any.keys("Id");
              chai.expect(res.body).to.have.any.keys("LocationName");
          })
      })
})

describe('Dasboard POST login user API request', () => {
    it('Should return a status json object with result', () => {
      //@ts-ignore
      return chai.request(base).post('/api/users/login').send({        
        "Email": "TestEmail@gmail.com",
        "Password": "essd123"
    }).then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              chai.expect(res.body.success).to.be.equal(true);
              chai.expect(res.body.user.Id+"").to.be.equal(testUserId+"");
          })
      })
})

describe('Dasboard PUT update user API request', () => {
    it('Should return a status json object with result', () => {
      //@ts-ignore
      return chai.request(base).put('/api/users/updateUser').send({
        "FirstName": "Updated",
        "LastName": "Updated",
        "Phone": "333 333-3333",
        "Email": "TestEmail@gmail.com",
        "UserType": "Test",
        "LocationId": "300",
        "LocationType": "State",
	    "Id": testUserId
    }).then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();   
              chai.expect(res.body.result).to.be.equal("Update successful");
          })
      })
})

describe('Dasboard DELETE delete user API request', () => {
    it('Should return a status json object with result', () => {
      //@ts-ignore
      return chai.request(base).delete('/api/users/deleteUser/' + testUserId).then(res => {
              //@ts-ignore
              chai.expect(res.body).to.be.a.jsonObj();
              chai.expect(res.body.result).to.be.equal("delete success");
          })
      })
})