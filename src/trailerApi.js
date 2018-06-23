const tmdbApi = require('./tmdbApi');
const viaplayApi = require('./viaplayApi');

function toURL (key) {
  return `https://www.youtube.com/watch?v=${key}`;
}

async function findTrailerUrl (viaplayPublicPath) {
  const imdbId = await viaplayApi.findImdbId(viaplayPublicPath);
  if (!imdbId) {
    return null;
  }

  const trailer = await tmdbApi.findTrailer(imdbId);
  if (!trailer || !trailer.key) {
    return null;
  }

  return toURL(trailer.key);
}

module.exports = {
  findTrailerUrl
};
