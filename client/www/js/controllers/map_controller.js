angular.module('prevale.mapController', [])
.controller('MapController', function($scope, RenderMap, Waypoints, CoordinateFilter, $interval){

  var positionOptions = { timeout: 1000, maximumAge: 60000, enableHighAccuracy: true};

  var waypoints;
  var initRender = true;

  RenderMap.mapInit();

  var wp = window.localStorage.getItem('waypoints');

  if ( wp ) {
    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    RenderMap.renderLayer(waypoints);
  }

  $interval(function() {
    waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
    RenderMap.renderLayer(waypoints);
  }, 10000);

  // Get waypoints from server and save in local storage
  Waypoints.getWaypoints(function(data) {
    var newData = [[40, -74.50],[40.1, -74.50],[40.2, -74.50]];
    window.localStorage.waypoints = JSON.stringify(newData);
    
    navigator.geolocation.watchPosition(function(position) {      
      if (initRender) {
        console.log("init render");
        // CoordinateFilter.handleCoordinate(position);
        waypoints = JSON.parse(window.localStorage.getItem('waypoints'));
        RenderMap.renderLayer(waypoints);
        RenderMap.centerView();
        initRender = false;
      } else {
        console.log("ELSE");
        // CoordinateFilter.handleCoordinate(position);
      }
    }, function(error) {
      console.log(error)
    }, positionOptions);

  });

  // console.log("I'm done");

});
