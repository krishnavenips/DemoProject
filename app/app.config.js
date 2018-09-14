'use strict';

var app=angular.module('myapp');
app.constant('base',
  { URL: 'http://10.4.6.88:5000' });
  app.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
     
      $routeProvider.
        when('/login', {
          template: '<login></login>'
        }).
        when('/signup', {
          template: '<signup></signup>'
        }).
        when('/home', {
          template: '<home></home>'
        }).
        when('/login/signup/home', {
          template: '<home></home>'
        }).

        otherwise({ redirectTo: '/login' });
      $locationProvider.html5Mode(true);

    }

  ]);

