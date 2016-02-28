angular.module('prevale.httpServices', [])
.factory('Waypoints', function($http) {

  var createJourney = function(journeyDetails) {
    return $http({
      method: 'POST',
      url: 'http://9840a13e.ngrok.io/api/journeys/create',
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
      url: 'http://9840a13e.ngrok.io/api/journeys/' + journeyId,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      cb(response.data);
    });
  };

  var sendWaypoints = function(waypoints, cb) {
    return $http({
      method: 'POST',
      url: 'http://9840a13e.ngrok.io/api/journeys/addTo',
      processData: false,
      data: waypoints,
      headers: {'Content-Type':'application/JSON'}
    })
    .then(function(response){
      cb(response);
    });
  };

  var sendVoice = function(currentLocation, keyword, cb) {
     return $http({
       method: 'GET',
       url: 'http:/127.0.0.1:3000/api/destinationSearch?currentLocation=' + currentLocation + '&keyword=' + keyword
     })
     .then(function(response) {
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

    console.log("about to hit create user endpoint with user: ", user);

    return $http({
      method: 'POST',
      url: 'http://9840a13e.ngrok.io/api/users/create',
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
