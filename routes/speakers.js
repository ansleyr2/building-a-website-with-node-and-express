const express = require('express');

const router = express.Router();

module.exports = params => {
  const { speakerService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakerService.getList();
      const artworks = await speakerService.getAllArtwork();
      console.log(artworks);
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (request, response, next) => {
    try {
      const speaker = await speakerService.getSpeaker(request.params.shortname);
      const artworks = await speakerService.getArtworkForSpeaker(request.params.shortname);
      console.log(artworks);
      // return response.send(`Details page for ${request.params.shortname}`);
      return response.render('layout', {
        pageTitle: 'Speaker Detail',
        template: 'speaker-detail',
        speaker,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
