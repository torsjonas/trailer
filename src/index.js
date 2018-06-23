const bunyan = require('bunyan');
const createServer = require('./server');
const log = bunyan.createLogger({name: 'trailer'});
const port = 8080;

if (!process.env.THE_MOVIE_DB_API_KEY) {
  throw new Error('No API key configured');
}

const app = createServer();
app.listen(port, () => {
  log.info({
    event: 'server-start',
    port: port
  });
});
