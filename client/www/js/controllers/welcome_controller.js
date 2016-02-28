angular.module('prevale.welcomeController', [])
.controller('WelcomeController', function($scope, $state, $http, $window, $location, Auth){

  $scope.user = {};

  $scope.signin = function() {
    console.log("$scope.user is: ", $scope.user);
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('username', data.username);
        // $window.localStorage.setItem('com.bracketmt', data.token);
        $state.go('app.map');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
