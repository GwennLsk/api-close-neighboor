let mocha = require('mocha');
let request = require('supertest');
let expect = require('chai').expect;
let services = require('../src/routes/services');
let axios = require('axios/index');
const app = require('../src/app');
const {ObjectID} = require('mongodb')


let users = [
    {
        _id: new ObjectID(),
        name: "Test",
        firstname: "Jean Michel",
        address: {
            number: 38,
            rue: "Avenue Jean Jaurès",
            codePostal: "93500",
            ville: "Pantin",
            complement: {
                etage: 6
            }
        },
        email: "jm.test@email.com",
        password: '12345678',
    },
    {
        _id: new ObjectID(),
        name: "LaVoisine",
        firstname: "Gertrude",
        address: {
            number: 34,
            rue: "Avenue Jean Jaurès",
            codePostal: "93500",
            ville: "Pantin",
            complement: {
                etage: 6
            }
        },
        email: "lavoisine@email.com",
        password: '23456789',
    },
    {
        name: "De la Chenellière",
        firstname: "Louis-Henri",
        address: {
            number: 32,
            rue: "Avenue Jean Jaurès",
            codePostal: "93500",
            ville: "Pantin",
            complement: {
                etage: 6,
                divers: "Diantre, Sauvez moi de ce ghetto"
            }
        },
        email: "lh.dlc@email.com",
        password: 'AuteuilNeuillyPassy',
    }
]


beforeEach((done) =>{
    new Promise((resolve1, reject1) => {
        axios.get(services['users'].url).then(resp => {
            // console.log(resp.data)
            let deleteUser = new Promise((resolve, reject) => {
                resp.data.users.forEach((data, index, array) => {
                    // console.log(data)
                    axios.delete(services['users'].url +'/' + data._id).then(result => {
                        if (index === array.length - 1) resolve()
                    }).catch(err => reject(err))
                })
            })
            deleteUser.then(() => {
                users.forEach(user => {
                    axios.post(services["users"].url , user).then( result2 => {
                        axios.get(services['users'].url).then(resp3 => {
                            resp3.data.users.forEach((user2, index, array) => {
                                users.forEach(user3 => {
                                    if (user2.email === user3.email) {
                                        user3._id = user2._id
                                    }
                                })
                                resolve1()
                            })
                        })
                    }).catch(err => reject1(err))
                })
            }).catch(err => console.error(err))
        }).catch(err => console.error(err))
    }).then( cleared => done()).catch(err => console.log(err))
})

describe('-----------USER--------------', () => {
    describe('/POST users', () => {
        it('should create a user', function (done) {
            let user = {
                name: "Nonyme",
                firstname: "Albert",
                email: "a.nonyme@email.com",
                password: "abcdefgh",
                address: {
                    number: 21,
                    rue: "Avenue Jean Jaurès",
                    codePostal: "93500",
                    ville: "Pantin",
                    complement: {
                        etage: 6
                    }
                }
            }
            request(app)
                .post('/users')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.firstname).to.equal(user.firstname);
                    expect(res.body.email).to.equal(user.email);
                    expect(res.body.password).to.equal(user.password)
                })
                .end(done)
        });

        it('should not create if missing non-optional properties', function (done) {
            let user = {
                name: "Nonyme",
                firstname: "Albert",
                email: "a.nonyme@email.com",
                address: {
                    number: 21,
                    rue: "Avenue Jean Jaurès",
                    codePostal: "93500",
                    ville: "Pantin",
                    complement: {
                        etage: 6
                    }
                }
            }
            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .end(done)
        });
    });

    describe('/GET users', function () {
        it('should return 3 users', function (done) {
            request(app)
                .get('/users')
                .expect(200)
                .expect( res => {
                    expect(res.body.users).to.have.lengthOf(3)
                })
                .end(done)
        });
    });

    describe('/GET users/id', function () {
        it('should return a user', function (done) {
            request(app)
                .get(`/users/${users[0]._id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.user.name).to.equal(users[0].name)
                    expect(res.body.user.firstname).to.equal(users[0].firstname)
                    expect(res.body.user.email).to.equal(users[0].email)
                })
                .end(done)
        });
        it('should not return a user', function (done) {
            request(app)
                .get(`/users/${new ObjectID()}`)
                .expect(404)
                .end(done)
        });
    })

})
