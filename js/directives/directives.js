app.directive('audioplayer', function( $rootScope, $compile ) {

	var linkFunction = function( scope, element, attributes ) {
	};

	return {
	    restrict: "E",
	    scope: {
		    file: '@',
		    class: '@',
		    title: '@',
		    filetitle: '@'
	    },
	    controller: 'audioButtonCtrl',
	    templateUrl: 'views/components/audiobutton.html',
	    link: linkFunction
	};

});

app.directive('videoplayer', function( $sce, $rootScope ) {

	var linkFunction = function( scope, element, attributes ) {
	};

	return {
	    restrict: "E",
	    scope: {
		    file: '@'
	    },
	    controller: 'videoCtrl',
		templateUrl: 'views/components/videoplayer.html',
	    link: linkFunction
	};

});


app.directive('compileTemplate', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
});

app.directive('loginbutton', function( $sce, $rootScope ) {

	var linkFunction = function( scope, element, attributes ) {
	};

	return {
	    restrict: "E",
	    controller: 'AppCtrl',
		template: '<button ng-if="!isUserLoggedIn" class="button button-block button-small button-reactor" ng-click="loginModal()">{{ \'login_button\' | i18n }}</button><button ng-if="isUserLoggedIn" class="button button-block button-small button-reactor" ng-click="logUserOut()">{{ \'logout_button\' | i18n }}</button>',
	    link: linkFunction
	};

});
