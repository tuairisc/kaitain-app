app.factory( 'DataLoader', function( $http, $stateParams, $location, $rootScope ){

	return {

		// gets the app config data
		getAppData: function(location) {

			return $http({
			  url: location + '?cache=' + Date.now(),
			  method: 'GET'
			});

		},

		// the messiah of posts data
		getData: function( url, params ) {
			return $http.jsonp( url, { params: params } );
		},

		// loads language strings
		loadLanguage: function() {

			var lang = language.toLowerCase();
			
			var langData = $http.get('i18n/' + lang + '.json' );

			langData.success( function(  data, status, headers ){
				console.log('language file loaded');
				REACTOR_TEXT = data[0];
				$rootScope.ptrText = REACTOR_TEXT['ptr_text'];

			});

			langData.error( function(  data, status, headers ){
				console.error('requested language file not loaded');
				$http.get('i18n/en-us.json').success( function(  data, status, headers ){
					console.log('default language file loaded');
					REACTOR_TEXT = data[0];
					$rootScope.ptrText = REACTOR_TEXT['ptr_text'];
				});
			});
		},
		
		// loads custom js and css files
		loadCustomCode: function( filename, filetype ) {
		
			var file = $http.get('assets/' + filename );
		
		    if (filetype=='js'){ //if filename is a external JavaScript file
		        var fileref=document.createElement('script');
		        fileref.setAttribute('type','text/javascript');
		        fileref.setAttribute('src', 'assets/' + filename  + '?cache=' + Date.now() );
		    }
		    else if (filetype=="css"){ //if filename is an external CSS file
		        var fileref=document.createElement('link');
		        fileref.setAttribute('rel', 'stylesheet');
		        fileref.setAttribute('type', 'text/css');
		        fileref.setAttribute('href', 'assets/' + filename  + '?cache=' + Date.now() );
		    }
		    if (typeof fileref!='undefined') {
		        document.getElementsByTagName('head')[0].appendChild(fileref);
		    }
		
		}

	} ///return

});
