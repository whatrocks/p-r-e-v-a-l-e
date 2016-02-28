angular.module('prevale.welcomeController', ['ngOpenFB'])
.controller('WelcomeController', function($scope, $state, $http, $window, $location, Auth, $cordovaOauth, $localStorage, ngFB){

  $scope.facebookSignin = function() {
      


    //ATTEMPT THREE
    ngFB.login({scope: 'email'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
                $state.go('app.map');
            } else {
                alert('Facebook login failed');
            }
        });



     // ATTEMPT TWO
     // $cordovaOauth.facebook("1018406694864765", ["email"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
        
     //    alert("Access token: ", result.access_token);
     //    $localStorage.accessToken = result.access_token;

     //    $http.get("https://graph.facebook.com/v2.2/me",{ params: { access_token: $localStorage.accessToken, fields: "id,name,picture", format: "json" }})
     //    .then(function(result) {
     //        $scope.profileData = result.data;
     //        $state.go('app.map');
     //     }, function(error) {
     //        alert("There was a problem getting your profile.  Check the logs for details.");
     //        console.log(error);
     //    });

     // }, function(error) {
     //     alert("There was a problem signing in!  See the console for logs");
     //     console.log(error);
     // });







    // console.log("trying to sign in");
    // // $window.location.href = 'http://www.google.com';
    // // $window.location.href = 'http://127.0.0.1:3000/auth/facebook';
    // Auth.signin()
    //   .then(function(data) { 

    //     console.log("Facebook data is: ", data);

    //     // potentially store the token in localstaorage
    //   })
    //   .catch(function (error){
    //     console.log("ERROR");
    //     console.error(error);
    //     // $state.go('app.map');
    //   });
  };
});
