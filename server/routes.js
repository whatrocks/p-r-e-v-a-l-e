var r = require('../database/db.js')(false);

module.exports = function (app, passport) {

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
  app.get('/logout', function (req, rest) {
    req.logout();
    res.redirect('/');
  });

};
