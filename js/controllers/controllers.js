app.controller('AppCtrl', function( $scope, $sce, $ionicModal, $ionicPopup, $timeout, $location, TemplateLoader, DataLoader, $templateCache, $rootScope, $stateParams, $state ) {

	// fetch the language file to load string string variables i18n
	DataLoader.loadLanguage();
	// fetch custom css and js files from assets
	DataLoader.loadCustomCode( 'custom.css', 'css');
	DataLoader.loadCustomCode( 'custom.js', 'js');
		
	// login check *******************
	$scope.loginMenu = false;
	$scope.isUserLoggedIn = false;

	var userData = JSON.parse( localStorage.getItem('reactorUser') );

	if( userData && userData.loggedin ) {
		$scope.isUserLoggedIn = true;
	}

	// reloads app and busts cache
	$scope.reloadApp = function() {
		if ( window.cache ) {
			window.cache.clear( success, error );
		}
		window.location.reload();
	}

	// cache busting
	var success = function(status) {
        console.log('Message: ' + decodeURI(status) );
    }

    var error = function(status) {
        console.error('Error: ' + decodeURI(status) );
    }

	setTimeout( function() {

		if( isOffline ) {

			var alertPopup = $ionicPopup.alert({
		     	title: REACTOR_TEXT['offline_header'],
			 	template: REACTOR_TEXT['offline_body']
			});

		   alertPopup.then(function(res) {
		   });

		}

	}, 1000);

	// resume event listener
	document.addEventListener( 'resume', onResume, false );

	// check app api on resume
	function onResume() {

		var data = DataLoader.getAppData(api2);
		var localdata = JSON.parse( localStorage.getItem('localData') );

	    data.success( function( data, status, headers, config ) {
	    
	    	console.log( data );
	    	console.log( localdata );

		    if( data['meta']['app_update_version'] === null ) return;
		    
			if( data['meta']['app_update_version'] !== localdata['meta']['app_update_version'] ) {
				localStorage.setItem( 'localData', JSON.stringify( data ) );
				APPDATA = data;
				pushData(data);
			}

	    });

	    data.error( function( data, status, headers, config ) {
	        console.error('update failed!');
	    });
	}

	// gets app-data.js file
	$scope.loadAppData = function() {

		if( localStorage.getItem('localData') ) {
			var data = JSON.parse( localStorage.getItem('localData') );
			APPDATA = data;
		    pushData(data);
		    onResume();
		} else {
			var data = DataLoader.getAppData(app_data);
			data.success( function( data, status, headers, config ) {
		    	APPDATA = data;
		        pushData(data);
		    });

		    data.error( function( data, status, headers, config ) {
		        console.error('Loading data failed!');
		    });
		}

    }

	// pushes app-data.js file data to app
	var pushData = function( json ) {

		var menudata = angular.copy(json);
		
		// add icon class and check if we need login
		for(var i = menudata.menus.items.length - 1; i >= 0; i--){
		
			if( menudata.menus.items[i].icon ){
			 	$scope.menuItemClass = 'item-icon-left';
			}
			
			if( menudata.menus.items[i].capability === 'loggedin' ) {
				$scope.loginMenu = true;
			}
			
		}
		
		
		//  hide or show menu items based on app data
		for( var i = menudata.menus.items.length - 1; i >= 0; i-- ){
					
			if( !$scope.isUserLoggedIn && menudata.menus.items[i].capability !== null && menudata.menus.items[i].capability === 'loggedin' ) {
			   	menudata.menus.items.splice(i, 1);
			}
			
		}
		
		// hide or show menu items based on app data
		for( var i = menudata.menus.items.length - 1; i >= 0; i-- ){
							
			if( null !== menudata.menus.items[i].hidden && menudata.menus.items[i].hidden == 'on' ){
				menudata.menus.items.splice(i,1);
			}
	
		}		
		

		$scope.menus = menudata;

		var apptheme = json['meta']['design']['app_theme'];
		if( 'default' !== apptheme ) {
			$rootScope.theme = 'css/'+ apptheme +'.css' ;
		}

		// load css into head
		var background = json['meta']['design']['toolbar_background'];
		var color = json['meta']['design']['toolbar_color'];
		
		var toolbar = '.bar-reactor { background-color:' + background + ' !important; border-bottom:' + background + ' !important; } .bar-reactor .title, .bar-reactor .button { color: ' + color + '; } .post-category { color: ' + background + '; } ';


		var view_background = 'body, .menu, .pane, .view, .cardlist-class, .card-class, .pinlist-class { background-color: '+json['meta']['design']['view_background']+'; color: '+json['meta']['design']['text_color']+'; } ';
		var list_background = '.item-complex .item-content, .pin, .card, .item  { background-color: '+json['meta']['design']['list_background']+'; border-color: '+json['meta']['design']['border_color']+';} ';
		var text_color = '.item, .item p, h1, h2, h3, h4, h5, h6, h7, h8, h9, a, .pin-category, .post-category { color: '+json['meta']['design']['text_color']+'} ';
		var border_color = '.pin .pin-header, .pin .pin-footer, .comment-header, .res-col-item:last-child, .product-slider { border-color: '+json['meta']['design']['border_color']+'; } ';
		var button = '.button.button-positive, .button.button-positive.activated, .button.button-reactor, .button.button-reactor.activated { background-color: '+json['meta']['design']['button_background']+'; color: '+json['meta']['design']['button_color']+';   } ';

		var customCSS = json['meta']['design']['custom_css'];

		$rootScope.styles = toolbar + view_background + list_background + text_color + border_color + button + customCSS ;
		$scope.apptitle = json['meta']['name'];

		// iad display
		if( 'on' === json['meta']['iad'] ) {

			setTimeout(function() {

			    if ( window.plugins && window.plugins.iAd ) {
			        window.plugins.iAd.createBannerView({
			            'bannerAtTop': false,
			            'overlap': false,
			            'offsetTopBar' : false
			                }, function() {
			                    window.plugins.iAd.showAd( true );
			                }, function(){
			                    console.log( "failed to create ad view" );
			                });
			    } else {
			        console.error('iAd plugin not available/ready.');
			    }

		    }, 2000);

		}
		// admob display
		if( null !== json['meta']['admob'] ) {

			setTimeout(function() {

				if(AdMob && admobid) {
					AdMob.createBanner( {
					    adId: admobid.banner,
					    position: AdMob.AD_POSITION.BOTTOM_CENTER,
					    autoShow: true
					} );
				} else {
					console.error('Admob plugin not available/ready.');
				}

		    }, 2000);

		}

	}

	// gets menu id on tap
	$scope.menuID = function(id) {
		pageID = id;
		isMenuTap = true;
		console.log(pageID);
	}


	// image pop modal
	$ionicModal.fromTemplateUrl('views/templates/imagemodal.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.imagemodal = modal;
	});
	$scope.openImageModal = function(url) {
		$scope.modalImage = false;
		$scope.imagemodal.show();
		$scope.modalImage = url;
		$scope.spinner = true;
	};
	$scope.closeImageModal = function() {
		$scope.imagemodal.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.imagemodal.remove();
	});


	// login pop modal
	$ionicModal.fromTemplateUrl('views/templates/loginmodal.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.loginmodal = modal;
		$scope.src = $sce.trustAsResourceUrl( url + '/?appp=login' );
	});
	$scope.loginModal = function() {
		$scope.loginmodal.show();
		$scope.spinner = false;
	};
	$scope.closeLoginModal = function() {
		$scope.loginmodal.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.loginmodal.remove();
	});


	// login stuff *********************
	$scope.logUserIn = function( username, password ) {

		$scope.spinner = true;
		$scope.loginMessage = null;

		targetFrame = window.frames['login-iframe'];
		targetFrame.postMessage( {
			message: 'login',
			username: username,
			password: password

		}, '*');

	}

	window.addEventListener('message', function(event) {

	    if( event.data.loggedin === true ) {
	    	$scope.spinner = false;
		    console.log(event.data);
		    $scope.loggedin();
		    $scope.closeLoginModal();
		    localStorage.setItem('reactorUser', JSON.stringify( event.data ) );
		}

		if( event.data.loggedin === false )  {
			$scope.spinner = false;
			console.log(event.data.message);
			$scope.loginMessage = event.data.message;
			$scope.$apply();
		}

	});

	$scope.loggedin = function() {
			$scope.isUserLoggedIn = true;
			pushData(APPDATA);
	}

	$scope.logUserOut = function() {
		$rootScope.$broadcast('logout');
		$state.go('app.home', { location: 'replace' });
	}

	$scope.$on('logout', function(event, msg) {
		localStorage.removeItem('reactorUser');
		$scope.isUserLoggedIn = false;
		pushData(APPDATA);
		$scope.closeLoginModal();
	});

});
