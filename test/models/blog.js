var assert = require('assert');
var Blog = require('../../models/blog');
const expect = require('chai').expect;

describe('Blog', function () {
    let blog = new Blog({user:'asdf', text:'jjjjj'});
    let user = {name:'asdf', password:'kS7IA7LOSeSlQQaNSVq1cA=='}
    before(function() {
        // runs before all tests in this block
    });
    after(function() {
        // runs after all tests in this block
    });
    beforeEach(function() {
        // beforeEach hook
    });

    beforeEach(function namedFun() {
        // beforeEach:namedFun
    });

    beforeEach('some description', function() {
        // beforeEach:some description
    });

    /*    describe('#findByUser()', function () {
     it('findByUser respond with matching records ', function (done) {
     blog.findByUser('asdf')
     .then((result) =>  {
     console.dir(result)
     })
     .catch((err) => {
     console.dir(err)
     })
     done(); //make sure done is called for async test
     })
     });*/

    describe('#update()', function () {
        it('update respond with matching records ', function (done) {
            blog.update(user)
                .then((result) =>  {
                    console.dir(result)
                })
                .catch((err) => {
                    console.dir(err)
                })
            done(); //make sure done is called for async test
        })
    });

    /*    describe('#delete()', function () {
     it('delete respond with matching records ', function (done) {
     blog.delete(user)
     .then((result) =>  {
     console.dir(result)
     })
     .catch((err) => {
     console.dir(err)
     })
     done(); //make sure done is called for async test
     })
     });*/

})
