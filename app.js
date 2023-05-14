// set up express server
const express = require('express');
const keys =require('.config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//initialize application
const app = express();

//middleware for handlebars
app.engine('handlebars' ,exphbs.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//middleware for bodyparser
app.use (bodyParser.json ());
app.use(bodyParser.urlencoded({extended:false}));

//set static folder for images and styling
app.use(express.static(`${__dirname}/public`));

//Index route to render template 
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

//charge route
app.post('/charge', (req, res) => {
    const amount = 3500;

    stripe.customers.create({
        email: req.body.stripeMail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'Guide to all Pokemon',
        currency:'usd',
        customer:customer.id

    }))
    .then(charge => res.render('success'));
});

//deploying to heroku and it chooses port or 5000 if local
const port = process.env.PORT || 5000;

// start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});