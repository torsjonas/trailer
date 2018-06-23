/* eslint-env mocha */

const nock = require('nock');
const viaplayApi = require('../src/viaplayApi');
const assert = require('chai').assert;

describe('viaplayApi', () => {
  before(() => {
    nock.disableNetConnect();
  });

  after(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('findImdbId', () => {
    it('should call expected endpoint', async () => {
      const publicPath = 'thor-ragnarok-2017';
      const expected = 'tt3501632';

      nock('https://content.viaplay.se/')
        .get(`/pc-se/film/${publicPath}`)
        .reply(200, {
          _embedded: {
            'viaplay:blocks': [
              {
                _embedded: {
                  'viaplay:product': {
                    content: {
                      imdb: {
                        id: expected
                      }
                    }
                  }
                }
              }
            ]
          }
        });

      const imdbId = await viaplayApi.findImdbId(publicPath);
      assert.strictEqual(imdbId, expected);
    });

    it('should resolve null when viaplay api does not respond with imdb id', async () => {
      const publicPath = 'thor-ragnarok-2017';

      nock('https://content.viaplay.se/')
        .get(`/pc-se/film/${publicPath}`)
        .reply(200, {
          _embedded: {
            'viaplay:blocks': [
              {
                _embedded: {
                  'viaplay:product': {
                  }
                }
              }
            ]
          }
        });

      const imdbId = await viaplayApi.findImdbId(publicPath);
      assert.strictEqual(imdbId, null);
    });

    it('should resolve null when viaplay api responds with 404', async () => {
      const publicPath = 'thor-ragnarok-2017';

      nock('https://content.viaplay.se/')
        .get(`/pc-se/film/${publicPath}`)
        .reply(404);

      const imdbId = await viaplayApi.findImdbId(publicPath);
      assert.strictEqual(imdbId, null);
    });
  });
});
