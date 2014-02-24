'use strict';

/****
TODO:
- Loading animation
- parsing "Marias" report http://www.rmlsweb.com/v2/public/report.asp?type=CR&CRPT2=BgUFB2ddDnZfXVJZRVVZWAzDzDxBr3JEPeRPXg1lEBE88sCQzDzDdgh
- storing shareService object in local storage???
***/

// Build app
var rmlsmapsApp = angular.module('rmlsmapsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/temp', {
        templateUrl: 'views/temp.html'//,
        //controller: 'MapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// Shared scope resources
rmlsmapsApp.factory('sharedService', function($rootScope) {
    
    var sharedService = {};
    
    sharedService.listings = [];
    sharedService.isLoading = true;
    
    // Testing Object
    /*
    sharedService.listings = [{
          address: '2732 NE 51st Ave',
          city: 'Portland',
          zip: '97213',
          price: '$999,999',
          gAddress: '2732+NE+51st+Ave,+Portland,+97213',
          lat: 45.542483,
          lng: -122.61037599999997,
          bb: '3/2',
          sqft: 2000,
          built: 1928,
          imageList: [
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-7.jpg',
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-8.jpg',
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-9.jpg'
          ]
      }, {
          address: '3106 NE 31st Ave',
          city: 'Portland',
          zip: '97212',
          price: '$699,999',
          gAddress: '3106+NE+31st+Ave,+Portland,+97212',
          lat: 45.5454681,
          lng: -122.6337034,
          bb: '2/1',
          sqft: 2000,
          built: 1922,
          imageList: [
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-4.jpg',
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-5.jpg',
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-6.jpg'
          ]
      }];
      */
      
    

    /*
    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    */

    return sharedService;
});
