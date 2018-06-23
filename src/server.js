const bunyan = require('bunyan');
const express = require('express');
const trailerApi = require('./trailerApi');
const log = bunyan.createLogger({name: 'trailer'});

function createServer () {
  const app = express();

  app.get('/healthcheck', (req, res) => {
    res.sendStatus(200);
  });

  app.get('/pc-se/:publicPath', async (req, res, next) => {
    try {
      const url = await trailerApi.findTrailerUrl(req.params.publicPath);
      if (!url) {
        return res.status(404).json({
          error: {
            statusCode: 404,
            message: 'Trailer not found'
          }
        });
      }

      res.json({
        url
      });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    log.error({
      event: 'server-error',
      err: err
    });

    res.sendStatus(500);
  });

  return app;
}

module.exports = createServer;
