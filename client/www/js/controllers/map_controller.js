angular.module('prevale.mapController', [])
.controller('MapController', function($scope, $window, RenderMap, Waypoints, CoordinateFilter, $interval, $ionicLoading, $compile){

  // console.log("My initial journey is: ", window.localStorage.getItem('initialJourney-id'));

  var positionOptions = { timeout: 1000, maximumAge: 60000, enableHighAccuracy: true};

  var waypoints;
  var initRender = true;
  $scope.currentPosition;
  RenderMap.mapInit();

  if ( window.localStorage.getItem('waypoints') ) {
    // console.log("local way: ", window.localStorage.getItem('waypoints'));
    if ( window.localStorage.getItem('waypoints') !== "[]" && window.localStorage.getItem('waypoints') !== "undefined" ) {
      // console.log("localStorage: ", window.localStorage);
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }
  }

  $interval(function() {
    // console.log("interval fires");
    // console.log("localStorage waypoints: ", window.localStorage.getItem('waypoints'));
    if ( window.localStorage.getItem('waypoints') !== "[]" && window.localStorage.getItem('waypoints') !== "undefined") {
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }
  }, 10000);

  var initialJourneyID = window.localStorage.getItem('initialJourney-id');

  // Get waypoints from server and save in local storage
  Waypoints.getWaypoints(initialJourneyID, function(data) {
    // var newData = [[40, -74.50],[40.1, -74.50],[40.2, -74.50]];

    // console.log("getWaypoints data: ", data);

    window.localStorage.waypoints = (JSON.stringify(data.coordinates));
    // window.localStorage.waypoints = (JSON.stringify(data.waypoints));

    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));

    navigator.geolocation.watchPosition(function(position) {
      $scope.currentPosition = [ position.coords.latitude, position.coords.longitude];
      // console.log("I'm in the navigator: ", position);

      if (initRender) {
        // console.log("init render in Watch Position");
        CoordinateFilter.handleCoordinate(position);
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        RenderMap.renderLayer(waypoints);
        RenderMap.centerView();
        initRender = false;
      } else {
        CoordinateFilter.handleCoordinate(position);
        // RenderMap.handleZoom();
        // RenderMap.centerView();
      }
    }, function(error) {
      // console.log("navigator didn't work");
      // console.log(error);
    }, positionOptions);

  });
  var hello = function() {
    alert('hello');
  }
  // var missionText = angular.element('<div class="mission"><button ng-click="hello()" class="mission-text">HEY HEY</button></div>');
  // angular.element(document.body).prepend(missionText);
  // $compile(missionText)($scope);
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
            var keyword = response.result.parameters.locations;
            var distance = response.result.parameters.distances;
            Waypoints.sendVoice($scope.currentPosition.join(','), keyword, distance, function(result) {

              var markers = [result.data.venue.location.lat, result.data.venue.location.lng];
              var payload = {
                destination: result,
                user: $window.localStorage.getItem('user-id'),
                coordinates: []
              }
              // alert(markers)
              RenderMap.displayGoal(markers);
              Waypoints.createJourney(payload).then(function(journey) {
                var lonlatOne = [$scope.currentPosition[1], $scope.currentPosition[0]];
                var lonlatTwo = [markers[1], markers[0]];
                Waypoints.getCheckpoints(lonlatOne.join(','), lonlatTwo.join(',')).then(function(response) {
                  // alert(JSON.stringify(response));
                  // alert(JSON.stringify(response));
                  RenderMap.displayMarkers(response.data);
                  $window.localStorage.setItem('journeyWaypoints', response.data);
                });
                $window.localStorage.setItem('initialJourney-id', journey.id);
              })
              // var missionChoice = false;
              // while(!missionChoice) {
              //   var missionText = '<div class="mission"><p class="mission-text">HEY HEY</p></div>';
              //   angular.element(document.body).prepend(missionText);

              //   missionChoice = true;
              // }


              $ionicLoading.hide();
            })
            // alert(JSON.stringify(response.result.metadata.html));
          if(response.result.metadata.html) {
            $scope.data = response.result.metadata.html;
            $scope.data = response.result.metadata.html;
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
