import supertest from "supertest"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../server"
import {User} from "../../models/users"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("User Handler", () => {
  const user: User = {

    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }
  const newUserData: User = {
    firstname: 'Lorenz',
    lastname: 'Meier',
    password: 'pass123',
  };

  let token: string, userId: number = 1

  it("should require authorization on every endpoint", (done) => {
    request
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })
request.get(`/users/${userId}`).then((res) => {
  expect(res.status).toBe(401);
  done();
});

request
  .put(`/users/${userId}`)
  .send(user)
  .then((res) => {
    expect(res.status).toBe(401);
    done();
  });
    request
    .delete(`/users/${userId}`)
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })
  })

  it("gets the create endpoint", (done) => {
    request
    .post("/users")
    .send(user)
    .then((res) => {
      const {body, status} = res
      token = body.token
      userId = body.user_id

      expect(status).toBe(200)
      done()
    })
  })

  it("gets the index endpoint", (done) => {
    request
      .get('/users')
      .set('Authorization', `Bearer "${token}" ` )
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  })

 it('gets the read endpoint', (done) => {
   request
     .get(`/users/${userId}`)
     .set('Authorization', 'bearer ' + token)
     .then((res) => {
       expect(res.status).toBe(200);
       done();
     });
 });

 it('gets the update endpoint', (done) => {
   

   request
     .put(`/users/${userId}`)
     .send(newUserData)
     .set('Authorization', 'bearer ' + token)
     .then((res) => {
        const { body, status } = res;
        token = body.token;
       
       expect(status).toBe(200);

       done();
     });
 });

  

  it("gets the auth endpoint", (done) => {
    request
      .post('/users/authenticate')
      .send({
        firstname: 'Lorenz',
        lastname: 'Meier',
        password:   'pass123'
      })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  })

  it("gets the auth endpoint with wrong password", (done) => {
    request
      .post('/users/authenticate')
      .send({
        firstname: user.firstname,
        lastname: user.lastname,
        password: "wrong",
      })

      .then((res) => {
        expect(res.status).toBe(401);
        done();
      });
  })

  it("gets the delete endpoint", (done) => {
    request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer "${token}" `)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  })
})
