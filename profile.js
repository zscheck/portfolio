var express = require('express')
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', (req, res) => {
    res.render('profile');
})

// A Possible way to chain the .get.post...
// router.route('/')
//   .get(function (req, res) {
//     res.send('My home page')
//   })
//   .post(function (req, res) {
//     // code to handle ...
//     res.send('A project was added')
//   })
//   .put(function (req, res) {
//     // code to handle ...
//     res.send('A project was added')
//   })
//   .delete(function (req, res) {
//     // code to handle ...
//     res.send('A project was deleted')
//   })

// define the about route

module.exports = router;