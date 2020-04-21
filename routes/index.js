const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = params => {
  const { speakerService } = params;
  router.get('/', async (request, response, next) => {
    // if (!request.session.visitcount) {
    //   request.session.visitcount = 0;
    // }
    // request.session.visitcount += 1;

    // console.log(`Number of visits ${request.session.visitcount}`);

    // response.render('pages/index', { pageTitle: 'Welcome' });
    try {
      const topSpeakers = await speakerService.getList();
      console.log(topSpeakers);
      return response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};

// module.exports = router;
