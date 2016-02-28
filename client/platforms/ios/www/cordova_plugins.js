cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
        "id": "cordova-plugin-geolocation.Coordinates",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Position.js",
        "id": "cordova-plugin-geolocation.Position",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-apiai/www/lib/q.js",
        "id": "cordova-plugin-apiai.Q",
        "pluginId": "cordova-plugin-apiai",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-apiai/www/ApiAIPlugin.js",
        "id": "cordova-plugin-apiai.ApiAIPlugin",
        "pluginId": "cordova-plugin-apiai",
        "clobbers": [
            "window.ApiAIPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-apiai/www/ApiAIPromises.js",
        "id": "cordova-plugin-apiai.ApiAIPromises",
        "pluginId": "cordova-plugin-apiai",
        "clobbers": [
            "window.ApiAIPromises"
        ]
    },
    {
        "file": "plugins/cordova-plugin-tts/www/tts.js",
        "id": "cordova-plugin-tts.tts",
        "pluginId": "cordova-plugin-tts",
        "clobbers": [
            "TTS"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{}
// BOTTOM OF METADATA
});