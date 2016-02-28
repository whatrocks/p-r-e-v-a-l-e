var r = require('rethinkdb');
require('rethinkdb-init')(r);
var config = require('../config/default.js');

module.exports = function (init) {
  // Keep track of open connections
  r.connections = [];
  r.getNewConnection = function () {
    return r.connect(config.rdb).then(function (conn) {
      // Set db so you don't have to specify in the future
      conn.use(config.rdb.db);
      r.connections.push(conn);
      return conn;
    });
  };
  if (init) {
    // Setup table schema
    r.init(config.rdb, [
      {
        name: 'users',
        indexes: ['createdAt', 'username']
      },
      {
        name: 'journeys',
        indexes: ['createdAt', 'user', 'coordinates']
      }
    ]).then(function (conn) {
      console.log('Database and tables init success');
      r.conn = conn;
      r.connections.push(conn);
      r.conn.use(config.rdb.db);
    });
  }
  return r;
};


//OLD VERSION USING MIDDLEWARE MODEL FOR TABLE CREATION AND CONNECTIONS
// // Connect to rethink and create the tables
// r.connect(rdb, function (err, conn) {
//   if (err) {
//     console.log(err.message);
//     process.exit(1);
//   }
//   // Check if users table exists
//   r.table('users').indexWait().run(conn).then(function (err, result) {
//     console.log('User table available');
//
//     // Now check the journeys table
//     r.table('journeys').indexWait().run(conn).then(function (err, result) {
//       console.log('Journeys table available');
//     })
//   //
//   }).error(function (err) {
//     // The db/table/index not found, so create them
//     r.dbCreate('prevale').run(conn).finally(function () {
//       return r.tableCreate('users', {primaryKey: 'id'}).run(conn);
//     }).finally(function () {
//       r.table('users').indexCreate('createdAt').run(conn);
//     }).then(function (result) {
//       console.log('Users table created');
//       // Create the journeys table
//       return r.tableCreate('journeys').run(conn);
//     }).finally(function () {
//       r.table('journeys').indexCreate('startedAt').run(conn);
//     }).then(function (result) {
//       console.log('Journeys table created');
//       // conn.close();
//     }).error(function (err) {
//       if (err) {
//         console.log('Unable to create tables');
//         console.log(err);
//         process.exit(1);
//       }
//       console.log("Table and index available");
//       conn.close();
//     });
//   });
// });

// function createConnection (req, res, next, passport) {
//   r.connect(rdb).then(function (conn) {
//     //save the connection on req
//     req._rdbConn = conn;
//     require('../config/passport.js')(passport);
//     next();
//   }).error(handleError(res));
// };
//
// function closeConnection (req, res, next) {
//   req._rdbConn.close();
//   next();
// };

// function createUser (user) {
//   // var user = {name: 'nate'};
//   //req.body;
//   user.createdAt = r.now();
//
//   r.connect(rdb).then(function (conn) {
//     r.table('users').insert(user, {returnChanges: true}).run(conn).then(function (result) {
//       if (result.inserted !== 1) {
//         handleError(res, next)(new Error('Document was not inserted.'));
//       } else {
//         res.json(result.changes[0].new_val);
//       }
//     }).error(handleError(res))
//     .finally(next);
//   })
// };
//
// function findUser (id) {
//   r.table('users').getAll('')
// };
//
// function createJourney (req, res, next) {
//   var journey = req.body;
//   journey.user = req._currUser;
//   r.table('journeys').insert(journey, {returnChanges: true}).run(req._rdbConn).then(function (result) {
//     if (result.inserted !== 1) {
//       handleError(res, next)(new Error('Document was not inserted'));
//     } else {
//       res.json(result.changes[0].new_val)
//     }
//   }).error(handleError(res))
//   .finally(next);
// }
//
// function handleError (res) {
//   return function (error) {
//     res.send(500, {error: error.message});
//   };
// };
