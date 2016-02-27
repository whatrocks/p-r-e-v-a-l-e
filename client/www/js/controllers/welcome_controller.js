angular.module('prevale.welcomeController', [])
.controller('WelcomeController', function($scope, $state, $window, $location){

  console.log("I'm WelcomeController");

  $scope.facebookSignin = function() {

    $state.go('app.map');

    console.log("HEY");

  };

  // $scope.facebookSignin();

});
