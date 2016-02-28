angular.module('starter',
  [
  'ionic',
  'ionic-material',
  'ngCordova',
  'ngStorage',
  'starter.controllers',
  'prevale.mapServices',
  'prevale.httpServices',
  'prevale.welcomeController',
  'prevale.mapController',
  'prevale.missionsController',
  'prevale.missionDetailsController',
  'prevale.escapeController',
  'prevale.appController',
  ])

.run(function($ionicPlatform, $ionicLoading, $state) {
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

    // if ( window.localStorage.username ) {
    //   $state.go('app.map');
    // }

  });
  ionic.Platform.ready(function(){
    window.ApiAIPlugin.init(
      {
        subscriptionKey: "b9278114-95c6-47a2-ad1e-0aea37b93a48 ", // insert your subscription key here
        clientAccessToken: "8ff31d1639384d6c9d9332926322b2bf", // insert your client access key here
        lang: "en" // set lang tag from list of supported languages
      },
      function(result) {
        $ionicLoading.hide();
      },
      function(error) {
        $ionicLoading.hide();
      }
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
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('app.missions', {
    url: '/missions',
    views: {
      'menuContent': {
        templateUrl: 'templates/missions.html',
        controller: 'MissionsController'
      }
    }
  })

  .state('app.mission', {
    url: '/mission',
    views: {
      'menuContent': {
        templateUrl: 'templates/mission-details.html',
        controller: 'MissionDetailsController'
      }
    }
  })

  .state('app.escape', {
    url: '/escape',
    views: {
      'menuContent': {
        templateUrl: 'templates/escape.html',
        controller: 'EscapeController'
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
        templateUrl: 'templates/about.html',
        controller: 'MapController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
