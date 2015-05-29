var DETAIL_CALLBACK;
var APPDATA;
var REACTOR_TEXT;
var apiUrl;
var apiParams;
var paged = 2;
var map_name;
var map_address;
var pageID = null;
var isMenuTap = false;
var language = window.navigator.userLanguage || window.navigator.language;
var isMobile = window.matchMedia("only screen and (max-width: 760px)");


var app = angular.module('app', [
	'ionic',
	'ngSanitize',
	'com.2fdevs.videogular',
	'com.2fdevs.videogular.plugins.controls',
	'com.2fdevs.videogular.plugins.overlayplay',
	'com.2fdevs.videogular.plugins.poster',
	'com.2fdevs.videogular.plugins.buffering'
])

.run(function( $ionicPlatform, $http ) {

	$ionicPlatform.ready(function() {

		// Hide the accessory bar by default
		//(remove this to show the accessory bar above the keyboard for form inputs)
		if( window.Keyboard ) {
		  	window.Keyboard .hideKeyboardAccessoryBar(true);
		}

	});

})

.config(function( $stateProvider, $urlRouterProvider, $ionicConfigProvider ) {

	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.swipeBackEnabled(false);
	
	$stateProvider

	.state('app', {
	  url: "/app",
	  abstract: true,
	  templateUrl: "views/templates/menu.html",
	  controller: 'AppCtrl'
	})

	.state('app.home', {
	  url: "/",
	  views: {
	    'mainContent' :{
	      templateUrl: "views/templates/page.html",
	      controller: 'PageCtrl'
	    }
	  }
	})

	.state('app.page', {
	  url: "/page/:page/:id",
	  views: {
	    'mainContent' :{
	      templateUrl: "views/templates/page.html",
	      controller: 'PageCtrl'
	    }
	  }
	})

	.state('app.detail', {
	  url: "/:page/:postID",
	  views: {
	    'mainContent' :{
	      templateUrl: "views/templates/detail.html",
	      controller: 'DetailCtrl'
	    }
	  }
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/');

});
