const rp = require('request-promise');
const url = require('url');

const baseUrl = 'https://api.themoviedb.org/3/';
const apiKey = process.env.THE_MOVIE_DB_API_KEY;

async function find (imdbId) {
  return rp({
    uri: url.resolve(baseUrl, `find/${imdbId}?api_key=${apiKey}&external_source=imdb_id`),
    json: true
  });
}

async function findTrailer (imdbId) {
  const findResult = await find(imdbId);
  if (!findResult || !findResult.movie_results || findResult.movie_results.length === 0) {
    return null;
  }

  const movieId = findResult.movie_results[0].id;
  const movieWithVideos = await rp({
    uri: url.resolve(baseUrl, `movie/${movieId}?api_key=${apiKey}&append_to_response=videos`),
    json: true
  });

  if (!movieWithVideos || !movieWithVideos.videos) {
    return null;
  }

  const videos = movieWithVideos.videos.results || [];
  return videos.find(video => video.site === 'YouTube' && video.type === 'Trailer');
}

module.exports = {
  findTrailer
};
