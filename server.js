const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// app.use is how we register middleware.
app.use((req, res, next) => {
    let now = new Date().toString();

    let log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });

    // if next() is not called then the rest of the application will fail to run (users can not navigate from page to page).
    next()
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// routes a GET request to the specified path (in this instance to the root of the app).
// the callback function contains arguments for the request and the response.
// in the response the home.hbs page is rendered, and an object is passed in with data needed within the page.
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Welcome to the home page.'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Bad Request',
        statusCode: 400
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
