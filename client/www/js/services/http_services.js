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

  var getWaypoints = function(journeyId, cb) {
    return $http({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/journeys/' + journeyId,
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

  var sendVoice = function(currentLocation, keyword, distance, cb) {
     console.log('keyword', keyword);
     console.log('currentLocation', currentLocation);
     return $http({
       method: 'GET',
       url: 'http:/127.0.0.1:3000/api/destinationSearch?currentLocation=' + currentLocation + '&keyword=' + keyword + '&distance=' + distance
     })
     .then(function(response) {
        cb(response);
     });
   };

  var getCheckpoints = function(start, destination) {
    return $http({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/routeInfo?start=' + start + '&destination=' + destination,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      return response;
    });
  }

  return {
    createJourney: createJourney,
    getWaypoints: getWaypoints,
    sendWaypoints: sendWaypoints,
    sendVoice: sendVoice,
    getCheckpoints: getCheckpoints
  };

})

.factory('Auth', function($http, $location, $window) {

  var signin = function (user) {

    console.log("about to hit create user endpoint with user: ", user);

    return $http({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/users/create',
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
