/* eslint-env mocha */

const createServer = require('../src/server');
const trailerApi = require('../src/trailerApi');
const sinon = require('sinon');
const supertest = require('supertest');

describe('server', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe('GET /pc-se/:publicPath', () => {
    it('should respond 200 with found url', async () => {
      const url = 'https://www.youtube.com/watch?v=zXixzCdApuc';
      sandbox.stub(trailerApi, 'findTrailerUrl').resolves(url);

      const app = createServer();
      return supertest(app)
        .get('/pc-se/thor-ragnarok-2017')
        .expect(200, {
          url
        });
    });

    it('should respond 404 when url not found', async () => {
      sandbox.stub(trailerApi, 'findTrailerUrl').resolves(null);

      const app = createServer();
      return supertest(app)
        .get('/pc-se/thor-ragnarok-2017')
        .expect(404, {
          error: {
            statusCode: 404,
            message: 'Trailer not found'
          }
        });
    });
  });
});
