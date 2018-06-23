const rp = require('request-promise');
const bunyan = require('bunyan');
const url = require('url');
const log = bunyan.createLogger({name: 'trailer'});

const baseUrl = 'https://content.viaplay.se/';

function getImdbId (film) {
  try {
    return film._embedded['viaplay:blocks'][0]._embedded['viaplay:product'].content.imdb.id;
  } catch (err) {
    log.error({
      event: 'imdbId-not-found',
      err: err
    });
  }
}

async function find (publicPath) {
  return rp({
    uri: url.resolve(baseUrl, `pc-se/film/${publicPath}`),
    json: true,
    simple: false
  });
}

async function findImdbId (publicPath) {
  const film = await find(publicPath);
  return getImdbId(film) || null;
}

module.exports = {
  findImdbId
};
