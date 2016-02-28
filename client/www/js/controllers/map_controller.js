angular.module('prevale.mapController', [])
.controller('MapController', function($scope, $window, RenderMap, Waypoints, CoordinateFilter, $interval, $ionicLoading){

  console.log("I'm in map controller");
  console.log("My initial journey is: ", window.localStorage.getItem('initialJourney-id'));

  var positionOptions = { timeout: 1000, maximumAge: 60000, enableHighAccuracy: true};

  var waypoints;
  var initRender = true;

  RenderMap.mapInit();

  if ( window.localStorage.getItem('waypoints')) {
    console.log("localStorage.waypoints: ", window.localStorage.getItem('waypoints'));
    // waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    // RenderMap.renderLayer(waypoints);
  }

  $interval(function() {
    console.log("interval fires");
    // console.log("localStorage.waypoints: ", window.localStorage.getItem('waypoints'));
    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    RenderMap.renderLayer(waypoints);
  }, 5000);

  // Get waypoints from server and save in local storage
  Waypoints.getWaypoints(function(data) {
    var newData = [[40, -74.50],[40.1, -74.50],[40.2, -74.50]];

    window.localStorage.waypoints = (JSON.stringify(newData));
    // window.localStorage.waypoints = (JSON.stringify(data.waypoints));

    waypoints = JSON.parse(window.localStorage.waypoints);

    navigator.geolocation.watchPosition(function(position) {
      if (initRender) {
        console.log("init render");
        CoordinateFilter.handleCoordinate(position);
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        RenderMap.renderLayer(waypoints);
        RenderMap.centerView();
        initRender = false;
      } else {
        console.log("ELSE");
        CoordinateFilter.handleCoordinate(position);
      }
    }, function(error) {
      console.log(error)
    }, positionOptions);

  });

  $scope.data = [];
  $scope.voiceCommand = function (){
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner><br>You can speak to me ! ...'
    });
    ionic.Platform.ready(function(){
      try {
        window.ApiAIPlugin.requestVoice(
          {}, // empty for simple requests, some optional parameters can be here
          function (response) {
            // place your result processing here
            // alert(JSON.stringify(response));
            TTS
              .speak({
                  text: response.result.speech,
                  locale: 'en-GB',
                  rate: 1.7
              }, function () { alert("success");
            },

            function (reason) {
            });
              alert(JSON.stringify(response.result));
              var currentLocation = [123, 456];
              var keyword = response.result.parameters.locations;
              Waypoints.sendVoice(currentLocation, keyword, function(result) {
                alert(result);
              })
              // alert(JSON.stringify(response.result.metadata));
              // alert(JSON.stringify(response.result.metadata.html));
            if(response.result.metadata.html) {
              $scope.data = response.result.metadata.html;
              $scope.data = response.result.metadata.html;
              alert($scope.data, "data 123123123");
              alert(typeof $scope.data, "data typeof");
            }
            $ionicLoading.hide();
          },
          function (error) {
            // place your error processing here
            alert("THERE'S AN ERROR" + error);
            $ionicLoading.hide();
          });
        } catch (e) {
          alert(e);
        }

      });
    };

});
