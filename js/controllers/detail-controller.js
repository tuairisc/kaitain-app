app.controller('DetailCtrl', function( $sce, $scope, $rootScope, $stateParams, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate, $timeout, TemplateLoader, DataLoader ) {

 	var postID = $stateParams.postID;
 	var page = $stateParams.page;
 	$scope.pageClass = $stateParams.page + '-class';
 	var sharing = false;
 	$scope.product = false;
 	paged = 1;

	for (var i = 0; i < APPDATA['menus']['items'].length; i++) {

		if( APPDATA['menus']['items'][i]['page_id'] === pageID && APPDATA['menus']['items'][i]['page_data']['sharing'] === 'on' ) {
			sharing = true;
		}

		if( null === pageID && APPDATA['menus']['items'][0]['page_data']['sharing'] === 'on' ) {
			sharing = true;
		}

		if( APPDATA['menus']['items'][i]['page_id'] === pageID && APPDATA['menus']['items'][i]['page_data']['detail'] === 'product' ) {
			$scope.product = true;	
		}

		if( null === pageID && APPDATA['menus']['items'][0]['page_data']['detail'] === 'product' ) {
			$scope.product = true;
			
		}

	}

    DETAIL_CALLBACK = function( json ) {

		$scope.data = json;
		$ionicSlideBoxDelegate.update();
		$scope.title = json['title'];
		$scope.link = json['link'];
		$scope.date = json['date'];
		$scope.content = json['content'];
		$scope.author = json['author']['first_name'];
		$scope.cartURL = ( json['meta_fields'] ) ? json['meta_fields']['woo']['cart_url'] : '';

		$scope.product_iframe = $sce.trustAsResourceUrl( url + '/?appp=woo&product_id=' + json['ID'] );

		if( json['no_featured_image'] !== true ) {

			if ( !isMobile.matches ) {

				if( !json['featured_image'] ) return;

				var img = (json['featured_image']['attachment_meta']['sizes']['large']) ? json['featured_image']['attachment_meta']['sizes']['large']['url'] : json['featured_image']['attachment_meta']['sizes']['medium']['url'];

	        	$scope.featured = img;

	    	} else {

		    	$scope.featured = (json['featured_image']) ? json['featured_image']['attachment_meta']['sizes']['medium']['url'] : '';

	    	}

			$scope.socialsharing = sharing;

    	}



		$scope.showThis = true;

		setTimeout(function(){
			$scope.audioPlayer = true;
		}, 500);

		// Google analytics page view tracking
		if( window.GAPlugin ) {

			GAPlugin.trackPage( function() { console.log('trackpage: ' + $scope.title ); }, function(e) { console.log('error trackpage: ' + e); }, $scope.title );
		}


	};

	$scope.getPage = function() {
		return TemplateLoader.getThePage( page );
	}

	$timeout( function(){

		var params = {
		};

		apiUrl = api + '/posts/' + postID + '?_jsonp=JSON_CALLBACK', { params: params };

		DataLoader.getData( apiUrl ).success(function(data) {
			DETAIL_CALLBACK(data);
		});

	}, 500);


	$scope.shareThis = function( title, link ) {

		window.plugins.socialsharing.share( title, null, null, link).then(function(result) {
		      console.log('Share success ' + result);
		  }, function(err) {

				var alertPopup = $ionicPopup.alert({
				 	title: REACTOR_TEXT['share_error_header'],
				 	template: REACTOR_TEXT['share_error_body']
				});

				alertPopup.then(function(res) {
				});
		});

	}

	$scope.openBrowser = function(link) {
		window.open(link, '_blank');
	}

	$scope.downloadFile = function(file) {

		// Access the local file system to get download path
		window.requestFileSystem(LocalFileSystem.PERSISTENT,
			0,

			function ( fileURL ) {
				// success, download file
				var fileTransfer = new FileTransfer();
				var uri = encodeURI(file);

				fileTransfer.download(
				    uri,
				    fileURL,
				    function(entry) {
				        alert("download complete: " + entry.toURL());
				    },
				    function(error) {
				        alert("Download error " + error.source);
				    }
			    );

			},

			function (error) {
				alert('FS error ' + error );
			}

		);

	}


});
