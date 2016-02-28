var r = require('../database/db.js')(false);
var config = require('../config/default.js');
var request = require('request');

module.exports = function (app, passport) {

  // Create a new user
  app.post('/api/users/create', function (req, res) {
    console.log('body: ', req.body);
    var username = req.body.username;
    var password = req.body.password;

    r
    .table('users')
    .getAll(username, {index: 'username'})
    .run(r.conn)
    .then(function (cursor) {
      return cursor.toArray()
      .then(function (users) {
        if (users.length > 0) {
          res.status(409).send('User already exists');
        } else {
          return r.table('users')
          .insert({username: username, password: password}, {returnChanges: true})
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
            res.send(200);
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
    journey.user = 'name';
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
      });
  });

  // Add coordinates to a pre-existing journey
  app.post('/api/journeys/addTo', function (req, res) {
    var id = req.body.id;
    var newCoords = req.body.coords;

    r
      .table('journeys')
      .get(id)
      .update({coordinates: r.row('coordinates').append(newCoords)})
      .run(r.conn)
      .then(function (response) {
        return r.table('journeys')
          .get(response.generated_keys[0])
          .run(r.conn);
      })
      .then(function (changes) {
        res.json(changes)
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
  app.get('/destinationSearch', function (req, res) {
    var currentLoc = '40.7,-74'; //req.body.currentLoc;
    var keywords = ['sushi']; //req.body.keywords;

    var baseUrl = 'https://api.foursquare.com/v2/venues/explore?client_id=' + config.foursquare.clientID  + '&client_secret=' + config.foursquare.clientSecret;
    var fullQuery = baseUrl + '&ll=' + currentLoc + '&query=' + keywords[0] + '&v=20160227&m=foursquare';

    request({
      method: 'GET',
      uri: fullQuery,
      json: true
    }, function (error, resp, body) {
      if (!error && resp.statusCode == 200) {
        var topResult = body.response.groups[0].items[0].venue;
        res.send(topResult);
      }
    });
  });
};
