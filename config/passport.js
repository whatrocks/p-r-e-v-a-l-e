var config = require('./default.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var r = require('../database/db.js')(true);

module.exports = function (passport) {

  // Used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Used to deserialize user
  passport.deserializeUser(function (id, done) {
    r
      .table('users')
      .get(id)
      .run(r.conn)
      .then(function (user) {
        done(null, user);
      });
  });

  var loginCallbackHandler = function (profileMap) {
    return function (accessToken, refreshToken, profile, done) {
      if (accessToken !== null) {
        r
          .table('users')
          .getAll(profile.id, {index: 'id'})
          .run(r.conn)
          .then(function (cursor) {
            return cursor.toArray()
              .then(function (users) {
                if (users.length > 0) {
                  return done(null, users[0]);
                } else {
                  return r.table('users')
                    .insert(profileMap(profile, accessToken), {returnChanges: true})
                    .run(r.conn)
                    .then(function (response) {
                      console.log('response: ', response.changes[0].new_val);
                      done(null, response.changes[0].new_val);
                    });
                }
              });
          })
          .catch(function (err) {
            console.log('Error getting user: ', err);
            done(err);
          });
      }
    };
  };

  var url = 'http://' + config.url + ':' + config.ports.local + '/auth/facebook/callback';

  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: url,
      enableProof: true
    },
    loginCallbackHandler(function (profile, token) {
      return {
        'id': profile.id,
        'facebook_token': token,
        'name': profile.displayName,
        'createdAt': r.now()
      };
    })
  ));
};
