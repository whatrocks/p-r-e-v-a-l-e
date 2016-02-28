angular.module('prevale.mapController', [])
.controller('MapController', function($scope, $window, RenderMap, Waypoints, CoordinateFilter, $interval){

  console.log("My initial journey is: ", window.localStorage.getItem('initialJourney-id'));

  var positionOptions = { timeout: 1000, maximumAge: 60000, enableHighAccuracy: true};

  var waypoints;
  var initRender = true;

  RenderMap.mapInit();

  if ( window.localStorage.getItem('waypoints') ) {
    console.log("local way: ", window.localStorage.getItem('waypoints'));
    if ( window.localStorage.getItem('waypoints') !== "[]" && window.localStorage.getItem('waypoints') !== "undefined" ) {
      console.log("localStorage: ", window.localStorage);
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }
  }

  $interval(function() {
    console.log("interval fires");
    console.log("localStorage waypoints: ", window.localStorage.getItem('waypoints'));
    if ( window.localStorage.getItem('waypoints') !== "[]" && window.localStorage.getItem('waypoints') !== "undefined") {
      waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
      RenderMap.renderLayer(waypoints);
    }
  }, 5000);

  var initialJourneyID = window.localStorage.getItem('initialJourney-id');

  // Get waypoints from server and save in local storage
  Waypoints.getWaypoints(initialJourneyID, function(data) {
    // var newData = [[40, -74.50],[40.1, -74.50],[40.2, -74.50]];

    console.log("getWaypoints data: ", data);
    
    window.localStorage.waypoints = (JSON.stringify(data.coordinates));
    // window.localStorage.waypoints = (JSON.stringify(data.waypoints));

    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    
    navigator.geolocation.watchPosition(function(position) {   
      
      console.log("I'm in the navigator: ", position);   
      
      if (initRender) {
        console.log("init render in Watch Position");
        CoordinateFilter.handleCoordinate(position);
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        RenderMap.renderLayer(waypoints);
        RenderMap.centerView();
        initRender = false;
      } else {
        CoordinateFilter.handleCoordinate(position);
        RenderMap.centerView();
      }
    }, function(error) {
      console.log("navigator didn't work");
      console.log(error);
    }, positionOptions);

  });

});
