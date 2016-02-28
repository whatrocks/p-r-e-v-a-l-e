angular.module('prevale.mapServices', [])
.factory('CoordinateFilter', function($rootScope, Waypoints) {

    var waypointsToBeSent = {waypoints: []};

    var handleCoordinate = function (position) {
        console.log("HANDLE COORDINATE");
        console.log("position is: ", position);
        var coordinateTuple = [];
        coordinateTuple.push(position.coords.latitude);
        coordinateTuple.push(position.coords.longitude);
        if (shouldStoreCoordinate(coordinateTuple)) {
            console.log("I should store coordinate");
            storeCoordinate(coordinateTuple);
        }
    };

    var storeCoordinate = function(coordinate) {
        console.log("Im in storeCoordinate");
        var temp = window.localStorage.getItem('waypoints');
        console.log("temp is: ", temp);
        temp = (temp === null) ? [] : JSON.parse(temp);

        // If it's unique, then add it
        // var lastItem = temp[temp.length - 1];
        // console.log("lastItem: ", lastItem[0]);
        // console.log("coordinate:", coordinate[0]);
        
        // if ( temp === [] || lastItem[0] !== coordinate[0] || lastItem[1] !== coordinate[1] ) {
            console.log("new coordinate found!!");
            temp.push(coordinate);
            window.localStorage.setItem('waypoints', JSON.stringify(temp));

            waypointsToBeSent.waypoints.push(coordinate);

            var journeyWaypoints = {
                id: window.localStorage.getItem('initialJourney-id'),
                coords: waypointsToBeSent.waypoints
            };

            console.log("journeyWaypoints to be sent: ", journeyWaypoints);

            // if (waypointsToBeSent.waypoints.length > 2) {
                Waypoints.sendWaypoints(journeyWaypoints, function(response) {
                    if (response) {
                        console.log(" successs posting waypoints!!!!");
                    } else {
                        console.log("error on store Coord");
                       }
                    waypointsToBeSent.waypoints = [];
                });
            // }            
        // }
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
        zoom = 16;
        // TODO: style our maps
        layer = L.TileLayer
        .maskCanvas({
            radius: 100,
            useAbsoluteRadius: true,
            color: '#0D0019',
            opacity: 0.85,
            noMask: false,
            lineColor: '#0D0019'
        });
        layer2 = L.TileLayer
        .maskCanvas({
            radius: 35,              
            useAbsoluteRadius: true,
            color: '#0D0019',     
            opacity: 0.85,          
            noMask: false,         
            lineColor: '#A00'
        });
        map = L.mapbox.map('map', 'mapbox.streets', {
            zoomControl: false
        });
        // .setView([40, -74.50], 9);

        // map.touchZoom.disable();
        // map.doubleClickZoom.disable();
        // map.scrollWheelZoom.disable();
    };

    var renderLayer = function(journeyPoints) {
        map.removeLayer(layer);
        map.removeLayer(layer2);
        layer.setData(journeyPoints);
        layer2.setData(journeyPoints);
        map.addLayer(layer2);
        map.addLayer(layer);
        currentPosition = journeyPoints[journeyPoints.length - 1];
    };

    var centerView = function() {
        console.log("Center View!!");
        console.log("currentPos:", currentPosition);
        map.setView(currentPosition, 16);
    };

    return {
        mapInit: mapInit,
        renderLayer: renderLayer,
        centerView: centerView
    };  
});

