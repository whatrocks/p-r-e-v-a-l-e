angular.module('prevale.mapController', [])
.controller('MapController', function($scope, $window, RenderMap, Waypoints, CoordinateFilter, $interval){

  console.log("I'm in map controller");
  console.log("My initial journey is: ", window.localStorage.getItem('initialJourney-id'));

  var positionOptions = { timeout: 1000, maximumAge: 60000, enableHighAccuracy: true};

  var waypoints;
  var initRender = true;

  RenderMap.mapInit();

  if ( window.localStorage.getItem('waypoints')) {
    console.log("localStorage: ", window.localStorage);
    // waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    // RenderMap.renderLayer(waypoints);
  }

  $interval(function() {
    console.log("interval fires");
    console.log("localStorage waypoints: ", window.localStorage.getItem('waypoints'));
    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    RenderMap.renderLayer(waypoints);
  }, 30000);

  var initialJourneyID = window.localStorage.getItem('initialJourney-id');

  // Get waypoints from server and save in local storage
  Waypoints.getWaypoints(initialJourneyID, function(data) {
    // var newData = [[40, -74.50],[40.1, -74.50],[40.2, -74.50]];

    console.log("getWaypoints data: ", data);
    
    window.localStorage.waypoints = (JSON.stringify(data.coordinates));
    // window.localStorage.waypoints = (JSON.stringify(data.waypoints));

    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    
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
        // RenderMap.centerView();
      }
    }, function(error) {
      console.log(error)
    }, positionOptions);

  });

});
