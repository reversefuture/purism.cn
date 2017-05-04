const user = require('../../middlewares/user')
const expect = require('chai').expect
const app = require('express')();

describe('user',function () {
    describe('#findone()', function () {
        it('routes: find', function (done) {
            app.get('/api/v1/users/:name', user.getOne)
            app.get('/api/v1/users', user.getAll)
            done();
        })

    })
})