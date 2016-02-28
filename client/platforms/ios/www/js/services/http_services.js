angular.module('prevale.httpServices', [])
.factory('Waypoints', function($http) {

  var createJourney = function(journeyDetails) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/journeys/create',
      data: journeyDetails,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      return response.data;
    });
  };

  var getWaypoints = function(cb) {
    return $http({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/waypoints',
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      cb(response.data);
    });
  };

  var sendWaypoints = function(waypoints, cb) {
    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/journeys/addTo',
      processData: false,
      data: waypoints,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      cb(response);
    });
  };

  return {
    createJourney: createJourney,
    getWaypoints: getWaypoints,
    sendWaypoints: sendWaypoints
  };

})

.factory('Auth', function($http, $location, $window) {

  var signin = function (user) {

    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/users/create', // ASK NATE
      data: JSON.stringify(user),
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function (resp) {
      console.log("resp is :", resp);
      return resp.data;
    });
  };

  return {
    signin: signin,
  };

});
