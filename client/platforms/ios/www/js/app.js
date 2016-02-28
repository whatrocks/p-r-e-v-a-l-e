angular.module('starter',
  [
  'ionic',
  'ngCordova',
  'ngStorage',
  'starter.controllers',
  'prevale.mapServices',
  'prevale.httpServices',
  'prevale.welcomeController',
  'prevale.mapController'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  ionic.Platform.ready(function(){
    window.ApiAIPlugin.init(
      {
        subscriptionKey: "b9278114-95c6-47a2-ad1e-0aea37b93a48 ", // insert your subscription key here
        clientAccessToken: "8ff31d1639384d6c9d9332926322b2bf", // insert your client access key here
        lang: "en" // set lang tag from list of supported languages
      },
      function(result) { console.log('API.AI: initialition OK') },
      function(error) { /* error processing */ }
    );
    window.ApiAIPlugin.setListeningFinishCallback(
      function(){
        $ionicLoading.hide();
      }
    );

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeController'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'WelcomeController'
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller: 'MapController'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
