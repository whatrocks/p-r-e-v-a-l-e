angular.module('prevale.welcomeController', [])
.controller('WelcomeController', function($scope, $state, $window, $location, Auth){

  $scope.facebookSignin = function() {
    console.log("trying to sign in");
    // $window.location.href = 'http://www.google.com';
    // $window.location.href = 'http://127.0.0.1:3000/auth/facebook';
    Auth.signin()
      .then(function(data) { 

        console.log("Facebook data is: ", data);
        // potentially store the token in localstaorage
        $state.go('app.map');
      })
      .catch(function (error){
        console.log("ERROR");
        console.error(error);
        $state.go('app.map');
      });
  };
});
