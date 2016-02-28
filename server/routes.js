var r = require('../database/db.js')(false);
var config = require('../config/default.js');
var request = require('request');
var decompress = require('./utils.js');
var _ = require('lodash');

module.exports = function (app, passport) {

  // Create a new user
  app.post('/api/users/create', function (req, res) {
    var user = req.body;
    if (!user) {
      res.send(400);
    }
    user.createdAt = r.now();

    r
    .table('users')
    .getAll(user.username, {index: 'username'})
    .run(r.conn)
    .then(function (cursor) {
      return cursor.toArray()
      .then(function (users) {
        if (users.length > 0) {
          res.status(409).send('User already exists');
        } else {
          return r.table('users')
          .insert(user, {returnChanges: true})
          .run(r.conn)
          .then(function (response) {
            res.status(201).send(response.changes[0].new_val);
          });
        }
      });
    })
    .catch(function (err) {
      console.log('Error getting user: ', err);
      res.send(err);
    });
  });

  // Login route
  app.post('/api/users/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!(username && password)) {
      res.send(400);
    }
    r
    .table('users')
    .getAll(username, {index: 'username'})
    .run(r.conn)
    .then(function (cursor) {
      return cursor.toArray()
      .then(function (users) {
        if (users.length === 0) {
          res.status(404).send('User not found');
        } else {
          if (users[0].password === password) {
            res.json(users[0]);
          } else {
            res.status(400).send("Incorrect password");
          }
        }
      });
    })
    .catch(function (err) {
      console.log('Error getting user: ', err);
      res.send(err);
    });
  });

  // Create a journey
  app.post('/api/journeys/create', function (req, res) {
    var journey = req.body;
    if (!journey) {
      res.send(400);
    }
    journey.createdAt = r.now();
    journey.coordinates = [];

    r
      .table('journeys')
      .insert(journey)
      .run(r.conn)
      .then(function (response) {
        return r.table('journeys')
          .get(response.generated_keys[0])
          .run(r.conn);
      })
      .then(function (newJourney) {
        res.json(newJourney);
      })
      .catch(function (err) {
        console.log('Error creating journey: ', err);
        res.send(err);
      });
  });

  // Add coordinates to a pre-existing journey
  app.post('/api/journeys/addTo', function (req, res) {
    console.log('req.body: ', req.body);
    var id = req.body.id;
    var newCoords = req.body.coords;
    if (!(id && newCoords)) {
      res.send(400);
    }

    r
      .table('journeys')
      .get(id)('coordinates')
      .setUnion(newCoords)
      .run(r.conn)
      .then(function (union) {
        return r.table('journeys')
          .get(id)
          .update({coordinates: union})
          .run(r.conn);
      })
      .then(function (results) {
        if (results) {
          res.send(201)
        }
      })
      .catch(function (err) {
        console.log('Error updating journey', err);
        res.send(err);
      });
  });

  app.get('/api/journeys/:id', function (req, res) {
    var journeyId = req.params.id;
    if (!(journeyId)) {
      res.send(400);
    }

    r
      .table('journeys')
      .get(journeyId)
      .run(r.conn)
      .then(function (response) {
        if (response) {
          res.json(response);
        } else {
          res.status(404).send('A journey with that id was not found')
        }
      })
      .catch(function (err) {
        console.log('Error getting journey: ', err);
        res.send(err);
      });
  });

  app.get('/api/journeys/userHistory/:id', function (req, res) {
    var userId = req.params.id;
    if (!(userId)) {
      res.send(400);
    }

    r
      .table('journeys')
      // Find all journeys associated with a user id
      .getAll(userId, {index: 'user'})
      .run(r.conn)
      .then(function (cursor) {
        cursor.toArray()
        .then(function (results) {
          if (results.length > 0) {
            // Extract just the coordinates from each entry, flatten, and remove duplicates
            var allCoords = _
            .chain(results)
            .map(function (journey) {
              return journey.coordinates;
            })
            .flatten()
            .uniq();

            res.send(allCoords);
          } else {
            res.send([]);
          }
        });
      });

  });

  // Facebook authentication route
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_friends']}));

  // Facebook callback route
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/'
    }),
    // On success, send back the token
    function (req, res) {
      res.json(req.user);
    }
    // // On error, force auth again
    // function (err, req, res, next) {
    //   res.redirect('/auth/facebook');
    //   if (err) {
    //     res.status(400);
    //     res.render('error', {message: err.message});
    //   }
    // }
  );

  // Logout route
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // Route for finding a mission destination via Foursquare
  app.get('/api/destinationSearch', function (req, res) {
    var currentLocation = req.query.currentLocation;
    var keyword = req.query.keyword;
    // Convert miles to meters
    var distanceInMeters = req.query.distance * 1609;
    if (!(currentLocation && keyword && distanceInMeters)) {
      res.send(400);
    }
    request({
      method: 'GET',
      uri: 'https://api.foursquare.com/v2/venues/explore',
      json: true,
      qs: {
        client_id: config.foursquare.clientID,
        client_secret: config.foursquare.clientSecret,
        ll: currentLocation,
        query: keyword,
        v: '20160227',
        m: 'foursquare',
        limit: 50,
        radius: distanceInMeters + 200,
        openNow: 1
      }
    }, function (error, resp, body) {
      if (!error && resp.statusCode == 200) {
        // Filter - greater than half a mile, less than 3
        var lowerBound = distanceInMeters - 1600 < 0 ? 0 : distanceInMeters - 1600;
        console.log('lowerbound: ', lowerBound);
        var topResult = _.find(body.response.groups[0].items,
          function (item) {
            return item.venue.location.distance >= lowerBound;
          });
        res.send(topResult);
      }
    });
  });

  // ArcGIS route for directions and waypoint calculation
  app.get('/api/routeInfo', function (req, res) {

    function getToken(callback){
      request.post({
        url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
        json:true,
        form: {
          f: 'json',
          client_id: config.arcgis.clientID,
          client_secret: config.arcgis.clientSecret,
          grant_type: 'client_credentials',
          expiration: '1440'
        }
      }, function(error, response, body){
        callback(body.access_token);
      });
    }

    getToken(function(token){
      request.post({
        url: 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve',
        json:true,
        form: {
          f: 'json',
          token: token,
          stops: '-122.4079,37.78356;-122.404,37.782' //FIXME
        }
      }, function(error, response, body){
        var directions = body.directions[0].features;
        var decompressedPoints = directions.map(function (element) {
          return decompress(element.compressedGeometry);
        });
        console.log(decompressedPoints);
        res.send(decompressedPoints);
      });
    });
  });
};
