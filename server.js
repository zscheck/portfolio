const express = require('express');  // 565.6k (gzipped 165.2k)
const morgan = require('morgan');  // 38.3k (gzipped: 12.6k)
const bodyParser = require('body-parser');  // 747.5k (gzipped: 256.1k)
const profile = require('./profile');
const Mailchimp = require('mailchimp-v3');
const env = require('dotenv').config();
Mailchimp.setApiKey(process.env.MailChimpAPIKey);

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/profile', profile);

// Here we're setting the views directory to be ./views
// thereby letting the app know where to find the template files
app.set('views', './views');

// Here we're setting the default engine to be ejs
// note we don't need to require it, express will do that for us
app.set('view engine', 'ejs');


// Now instead of using res.send we can use
// res.render to send the output of the template by filename
app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Zach ',
            lastName: 'Scheck',
        }
    }

    res.render('index', data);
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// app.post('/thanks', (req, res) => {
//     const api_key = 'dd8cfce84d01d5f92576ac99fa8583f5-us17';
//     const list_id = '160e75843d';

// const mailchimp = new Mailchimp(api_key);

//     mailchimp.post('lists/' + list_id, {
//         members: [{
//             email_address: req.body.email,
//             first_name: req.body.firstName,
//             last_name: req.body.lastName,
//             // message: req.body.message,
//             status: 'subscribed'
//         }]})
//         .then(result => {
//             res.render('thanks', data);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

// var batches = [
//   {
//     body: {
//       status        : 'subscribed',
//       email_address : 'req.body.email',
//       first_name: req.body.firstName,
//       last_name: req.body.lastName
//     }
//   }
// ];
app.post('/thanks', (req, res) => {
    console.log('request obj: \n' + req);
    console.log('request obj: \n' + res);
    const list_id = '160e75843d';
    const batch = Mailchimp.createBatch('lists/'+list_id+'/members', 'POST');
    batch
    //   .add(batches)
    .add({
        body: {
            status        : 'subscribed',
            email_address : req.body.email,
            first_name : req.body.firstName,
            last_name : req.body.lastName,
            message : req.body.message
        }
    })
    .send()
    .then(function(result){
        console.log(result.status);
    })
    .then(function(success){
        res.render('thanks', { contact: req.body });
    })
    .catch(function(error){
        console.log(error);
    });
});

app.set("port", (process.env.PORT || 8080));

app.listen(app.get("port"), () => {
console.log("listening at http://localhost:" + app.get("port"));
});
