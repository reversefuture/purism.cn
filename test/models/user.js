const User = require('../../models/user')

var user = new User('Luo', 'Zheng', 'Admin');

/*
user.save()
    .then((result) => {
        console.dir(result)
    })
    .catch((err) => {
        console.dir(err)
    })
*/

// user.remove()
user.findOne()
    .then((result) => {
        console.dir(result)
    })
/*
user.findAll()
 .then((result) => {
 console.dir(result)
 })
*/
/*
 user.updateRole('Client')
 .then((result) => {
 console.dir(result)
 })
*/




