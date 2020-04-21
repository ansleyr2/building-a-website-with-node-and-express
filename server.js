const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

const routes = require('./routes');

const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const app = express();

const port = 3000;

// makes express to trust cookies passed via a reverse proxy , help from failing cookies on prod
app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['bxjhaGVxgabasas', 'dsbdsobdgsdvsbdy'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // folder where the views reside

app.locals.siteName = 'ROUX Meetups';

// express.static is a middleware used to serve static files like html,css, images etc to the app
app.use(express.static(path.join(__dirname, './static')));

app.get('/throw', (request, response, next) => {
  setTimeout(() => {
    // throw new Error('Something did throw');
    return next(new Error('Something did throw'));
  }, 5000);
});

app.use(async (request, response, next) => {
  /* response.locals.someVariable = 'hello';
  return next(); */
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    console.log(response.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});

/* app.get('/', (request, response) => {
  // response.send('Hello Express :)');
  // response.sendFile(path.join(__dirname, './static/index.html'));
  response.render('pages/index', { pageTitle: 'Welcome' });
});

app.get('/speakers', (request, response) => {
  // response.send('Hello Express :)');
  response.sendFile(path.join(__dirname, './static/speakers.html'));
}); */

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

// page not found ...
app.use((request, response, next) => {
  return next(createError(404, 'File Not Found'));
});

// Error handling middleware, express std, 4 arguments
app.use((err, request, response) => {
  console.error(err);
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
