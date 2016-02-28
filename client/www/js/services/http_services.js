angular.module('prevale.httpServices', [])
.factory('Waypoints', function($http) {

  var getWaypoints = function(cb) {
    // return $http({
    //   method: 'GET',
    //   url: 'http://localhost:5555/waypoints',
    //   processDate: false,
    //   headers: {'Content-Type':'application/JSON'}
    // })
    // .then(function(response){
    //   cb(response.data);
    // });
    cb("hi");
  };

  var sendWaypoints = function(waypoints, cb) {
    return $http({
      method: 'POST',
      url: '',
      processData: false,
      data: waypoints,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      cb(response);
    });
  };

  return {
    getWaypoints: getWaypoints,
    sendWaypoints: sendWaypoints
  };

})

.factory('Auth', function($http, $location, $window) {

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: 'http://localhost:3000/auth/', // ASK NATE
      data: user
    })
    .then(function (resp) {
      console.log("resp is :", resp);
      return resp.data;
    });
  };

  return {
    signin: signin
  };

});
