/* eslint-env mocha */

const sinon = require('sinon');
const tmdbApi = require('../src/tmdbApi');
const trailerApi = require('../src/trailerApi');
const viaplayApi = require('../src/viaplayApi');
const assert = require('chai').assert;

describe('trailerApi', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe('findTrailerUrl', () => {
    it('should resolve expected url', async () => {
      const tmdbKey = 'zXixzCdApuc';

      sandbox.stub(viaplayApi, 'findImdbId').resolves('tt3501632');
      sandbox.stub(tmdbApi, 'findTrailer').resolves({
        site: 'YouTube',
        type: 'Trailer',
        key: tmdbKey
      });

      const url = await trailerApi.findTrailerUrl('thor-ragnarok-2017');
      assert.strictEqual(url, `https://www.youtube.com/watch?v=${tmdbKey}`);
    });

    it('should resolve null when viaplay api responds with null', async () => {
      const findImdbIdStub = sandbox.stub(viaplayApi, 'findImdbId').resolves(null);
      const findTrailerStub = sandbox.stub(tmdbApi, 'findTrailer').resolves({});

      const url = await trailerApi.findTrailerUrl('asdfasdfasdf');
      assert.strictEqual(url, null);
      assert.strictEqual(findImdbIdStub.called, true);
      assert.strictEqual(findTrailerStub.called, false);
    });

    it('should resolve null when themoviedb api responds with null trailer', async () => {
      const findImdbIdStub = sandbox.stub(viaplayApi, 'findImdbId').resolves('zXixzCdApuc');
      const findTrailerStub = sandbox.stub(tmdbApi, 'findTrailer').resolves(null);

      const url = await trailerApi.findTrailerUrl('thor-ragnarok-2017');
      assert.strictEqual(url, null);
      assert.strictEqual(findImdbIdStub.called, true);
      assert.strictEqual(findTrailerStub.called, true);
    });
  });
});
