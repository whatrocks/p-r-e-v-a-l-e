angular.module('prevale.mapServices', [])
.factory('CoordinateFilter', function($rootScope, Waypoints) {

    var handleCoordinate = function () {

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
        .setView([40, -74.50], 9);

        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
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

