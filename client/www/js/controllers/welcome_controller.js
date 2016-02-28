angular.module('prevale.welcomeController', [])
.controller('WelcomeController', function($scope, $state, $http, $window, $location, Auth, Waypoints){

  $scope.user = {};

  $scope.signin = function() {
 
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('username', data.username);
        $window.localStorage.setItem('user-id', data.id);

        var initialJourney = {
          user: $window.localStorage.getItem('user-id'),
          destination: {} 
        };

        Waypoints.createJourney(initialJourney)
        .then(function (data) {

          console.log("data from create journey: ", data);

          $window.localStorage.setItem('initialJourney-id', data.id);

          $state.go('app.map');

        })
        .catch(function(error) {
          console.error(error);  
        });

      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
