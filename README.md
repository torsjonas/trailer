# trailer

Find a movie trailer for a given Viaplay Content API film.

Requirements:
Node 7.10.1

A TMDb api key, get it here: https://www.themoviedb.org/documentation/api

To run the server, clone this repository and do:
```
npm install

env THE_MOVIE_DB_API_KEY=[API_KEY] npm start
```

To run the tests:
```
npm run test
```

Note that the trailer API follows the URL structure of Viaplay Content API https://content.viaplay.se but with a local base path. To find a trailer for a given Viaplay Content API film, for example 

```
https://content.viaplay.se/pc-se/lm/thor-ragnarok-2017
```

you would use the same URL path on your local machine:

```
http://localhost:8080/pc-se/lm/thor-ragnarok-2017
```

The server responds with the following JSON data (or a 404 if no trailer could be found):

```
{
  "url": "https://www.youtube.com/watch?v=ue80QwXMRHg"
}
```

Restrictions:
- No UI yet.
- Only YouTube trailers are currently supported.
- Since the TMDb API is rate limited, the trailer API could be improved to handle heavy load by caching the requests using something like `memcache`, and/or applying rate-limiting per client IP when used from a web page.
