angular.module('prevale.mapServices', [])
.factory('CoordinateFilter', function($rootScope, Waypoints) {

    var waypointsToBeSent = {waypoints: []};

    var handleCoordinate = function (position) {
        var coordinateTuple = [];
        coordinateTuple[0] = position.coords.latitude;
        coordinateTuple[1] = position.coords.longitude;
        if (shouldStoreCoordinate(coordinateTuple)) {
            storeCoordinate(coordinateTuple);
        }
    };

    var storeCoordinate = function(coordinate) {
        console.log("Im in storeCoordinate");
        var temp = window.localStorage.getItem('waypoints');
        temp = (temp === null) ? [] : JSON.parse(temp);
        temp.push(cooordinate);
        window.localStorage.setItem('waypoints', JSON.stringify(temp));

        waypointsToBeSent.waypoints.push(coordinate);

        var journeyWaypoints = {
            id: window.localStorage.getItem('initialJourney-id'),
            newCoords: waypointsToBeSent.waypoints
        };

        if (waypointsToBeSent.waypoints.length > 2) {
            Waypoints.sendWaypoints(journeyWaypoints, function(response) {
                if (response) {
                    console.log(" successs posting waypoints!!!!");
                } else {
                    console.error("error on store Coord");
                }
                waypointsToBeSent.waypoints = [];
            });
        }
    };

    var shouldStoreCoordinate = function(coordinate) {
        for ( var i = 0; i < waypointsToBeSent.waypoints.length; i++ ) {
            if (calcDistance(coordinate, waypointsToBeSent.waypoints[i]) < 0.005) {
                return false;
            }
        }
        return true;
    };

    if ( typeof(Number.prototype.toRad) === "undefined" ) {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        };
    }

    var calcDistance = function(pt1, pt2) {
      var R = 6371; // Earth radius, in km.
      var lat1 = pt1[0];
      var lon1 = pt1[1];
      var lat2 = pt2[0];
      var lon2 = pt2[1];

      var dLat = (lat2 - lat1).toRad();
      var dLon = (lon2 - lon1).toRad();
      lat1 = lat1.toRad();
      lat2 = lat2.toRad();

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var distance = R * c * 0.621371; // convert distance from km to miles
      return distance;
    };

    return {
        handleCoordinate: handleCoordinate
    };

})
.factory('RenderMap', function($rootScope) {

    var zoom;
    var currentPosition;
    var map;
    var layer;
    L.mapbox.accessToken = mapboxAccessToken;    
    
    var mapInit = function() {
        zoom = 12;
        // TODO: style our maps
        layer = L.TileLayer
        .maskCanvas({
            radius: 1000,              
            useAbsoluteRadius: true,
            color: '#0D0019',     
            opacity: 1,          
            noMask: false,         
            lineColor: '#A00'
        });
        map = L.mapbox.map('map', 'mapbox.streets', {
            zoomControl: false
        })
        // .setView([40, -74.50], 9);

        // map.touchZoom.disable();
        // map.doubleClickZoom.disable();
        // map.scrollWheelZoom.disable();
    };

    var renderLayer = function(journeyPoints) {
        map.removeLayer(layer);
        layer.setData(journeyPoints);
        map.addLayer(layer);
        currentPosition = journeyPoints[journeyPoints.length - 1];
    };

    var centerView = function() {
        map.setView(currentPosition, zoom);
    };

    return {
        mapInit: mapInit,
        renderLayer: renderLayer,
        centerView: centerView
    };  
});

