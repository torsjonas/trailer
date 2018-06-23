/* eslint-env mocha */

const nock = require('nock');
const tmdbApi = require('../src/tmdbApi');
const assert = require('chai').assert;
const apiKey = process.env.THE_MOVIE_DB_API_KEY;

describe('tmdbApi', () => {
  before(() => {
    nock.disableNetConnect();
  });

  after(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('findTrailer', () => {
    it('should call expected endpoint', async () => {
      const imdbId = 'tt0062622';
      const movieId = 62;

      nock('https://api.themoviedb.org')
        .get(`/3/find/${imdbId}`)
        .query({
          api_key: apiKey,
          external_source: 'imdb_id'
        })
        .reply(200, {
          movie_results: [
            {
              id: 62
            }
          ]
        });

      nock('https://api.themoviedb.org')
        .get(`/3/movie/${movieId}`)
        .query({
          api_key: apiKey,
          append_to_response: 'videos'
        })
        .reply(200, {
          videos: {
            results: [
              {
                site: 'YouTube',
                type: 'Trailer',
                key: 'zXixzCdApuc'
              }
            ]
          }
        });

      const trailer = await tmdbApi.findTrailer(imdbId);
      assert.strictEqual(trailer.site, 'YouTube');
      assert.strictEqual(trailer.type, 'Trailer');
      assert.strictEqual(trailer.key, 'zXixzCdApuc');
    });
  });
});
