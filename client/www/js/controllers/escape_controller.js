angular.module('prevale.escapeController', [])
.controller('EscapeController', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {

    $scope.status = 'Not yet connected';

    $scope.lyftAuth = function() {
        console.log("I want to auth with lyft");
        $scope.status = 'CONNECTED';
    };


});
