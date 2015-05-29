app.controller( 'PageCtrl', function( $scope, $sce, $http, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $templateCache, $stateParams, $timeout, TemplateLoader, DataLoader, $compile, $rootScope, $ionicHistory ) {

	var id = $stateParams.id;
	pageID = $stateParams.id;
	var page = $stateParams.page;
	var pageData;
	var viewStack = $ionicHistory.currentView();
	$scope.dataBase = [];
	$scope.posts = [];
	$scope.pageClass = $stateParams.page + '-class';
	$scope.spinner = false;
	$scope.loading = false;
	$scope.mapReady = false;
    $scope.noData = '';
    $rootScope.showComments = true;
    $scope.searchData = {};
    $scope.loader = '';
    
    if( viewStack.backViewId ){
	    console.log( $ionicHistory );
	    $scope.menuIcon = true;
    }

    console.log( $ionicHistory.currentView() );

	if( !page ) {
		$scope.isHome = true;
	}

	// this loads the proper component into page
	$scope.getPage = function() {
			return TemplateLoader.getThePage( page );
	}

	// this loads the proper component into page
	$scope.getHomePage = function() {
			if( !page && APPDATA ){
				page = APPDATA['menus']['items'][0]['page_data']['page_type'];
			}
			return TemplateLoader.getThePage( page );
	}


	$scope.loadPage = function() {

			for ( var i = 0; i < APPDATA['menus']['items'].length; i++ ) {

				if( APPDATA['menus']['items'][i]['page_id'] === id ){

					pageData = APPDATA['menus']['items'][i];

					if( APPDATA['menus']['items'][i]['page_data']['slider'] === 'on' ){
						$scope.getSlider = function() {
							return 'views/components/slider.html';
						}
					}

					var list_content = APPDATA['menus']['items'][i]['page_data']['list_content'];
					var component = APPDATA['menus']['items'][i]['page_data']['page_type'];

					switch( list_content ) {
						case 'cpt':
							var cpt = APPDATA['menus']['items'][i]['page_data']['post_type'];
                            var cat = APPDATA['menus']['items'][i]['page_data']['category'];
                            var tag = APPDATA['menus']['items'][i]['page_data']['tag'];
                            var taxCat = APPDATA['menus']['items'][i]['page_data']['taxonomy_category'];
                            var taxTag = APPDATA['menus']['items'][i]['page_data']['taxonomy_tag'];
						break;

						case 'posts':
							var cat = APPDATA['menus']['items'][i]['page_data']['category'];
                            var tag = APPDATA['menus']['items'][i]['page_data']['tag'];
						break;
					}

					$rootScope.viewClass = APPDATA['menus']['items'][i]['class'];

					loadComponent( component, i, cat, list_content, cpt, tag, taxCat, taxTag );

				}

			}

			if( $scope.isHome ){

					if( APPDATA['menus']['items'][0]['page_data']['slider'] === 'on' ){
						$scope.getSlider = function() {
							return 'views/components/slider.html';
						}
					}

					pageData = APPDATA['menus']['items'][0];
					pageID = null;

					var list_content = APPDATA['menus']['items'][0]['page_data']['list_content'];
					var component = APPDATA['menus']['items'][0]['page_data']['page_type'];

					var list_content = APPDATA['menus']['items'][0]['page_data']['list_content'];
					var component = APPDATA['menus']['items'][0]['page_data']['page_type'];

					switch( list_content ) {
						case 'cpt':
							var cpt = APPDATA['menus']['items'][0]['page_data']['post_type'];
                            var cat = APPDATA['menus']['items'][0]['page_data']['category'];
                            var tag = APPDATA['menus']['items'][0]['page_data']['tag'];
                            var taxCat = APPDATA['menus']['items'][0]['page_data']['taxonomy_category'];
                            var taxTag = APPDATA['menus']['items'][0]['page_data']['taxonomy_tag'];
						break;

						case 'posts':
							var cat = APPDATA['menus']['items'][0]['page_data']['category'];
                            var tag = APPDATA['menus']['items'][0]['page_data']['tag'];
						break;
					}

					$rootScope.viewClass = APPDATA['menus']['items'][0]['class'];

					loadComponent( component, 0, cat, list_content, cpt, tag, taxCat, taxTag );
			}




	}
	// timeout while template loads then fill with data
	setTimeout(function() {
		$scope.loadPage();
	}, 1000);


	// loads data into component
	var loadComponent = function( component, i, cat, list_content, cpt, tag, taxCat, taxTag ) {


			switch( component ) {

				case 'text':

					$scope.title = APPDATA['menus']['items'][i]['page_data']['title'];
					$scope.html = APPDATA['menus']['items'][i]['page_data']['text_html'];

					console.log('log', APPDATA['menus']['items'][i] );
					$scope.pagebg = 'img/' + APPDATA['menus']['items'][i]['page_data']['page_bg'];

				break;

				case 'search':

					apiParams = {
						'filter[category_name]': cat,
                        'filter[tag]': tag,
						'type': cpt
					};

					apiParams = {
                        'filter[product_cat]': cat,
                        'filter[product_tag]': tag,
						'type': cpt
					};

					if(taxCat || taxTag) {

						apiParams['filter[category_name]'] = null;
						apiParams['filter[tag]'] = null;

						var b = 'filter['+taxCat+']';
						var c = 'filter['+taxTag+']';

						apiParams[b] = cat;
						apiParams[c] = tag;

					}

					apiUrl = api + '/posts/'+ '?_jsonp=JSON_CALLBACK';

					$scope.title = APPDATA['menus']['items'][i]['page_data']['title'];
					$scope.html = APPDATA['menus']['items'][i]['page_data']['text_html'];
					$scope.placeholder = APPDATA['menus']['items'][i]['page_data']['placeholder'];
					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';
					$scope.pagebg = 'img/' + APPDATA['menus']['items'][i]['page_data']['page_bg'];

					console.log('log', APPDATA['menus']['items'][i] );

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

				break;

				case 'gravityform':

					var formID = APPDATA['menus']['items'][i]['page_data']['form_id'];

					$scope.src =  $sce.trustAsResourceUrl( url + '/?appp=gform&form_id=' + formID );

					window.addEventListener('message', function(event) {

						if( event.data.message === 'gform' ) {
							$ionicScrollDelegate.scrollTop(true);
						}

					}, false);

				break;

				case 'iframe':

					var iframeSRC = APPDATA['menus']['items'][i]['page_data']['iframe'];

					$scope.src =  $sce.trustAsResourceUrl( iframeSRC );

				break;

				case 'list':

					apiParams = {
						'filter[category_name]': cat,
                        'filter[tag]': tag,
						'type': cpt
					};

					if(taxCat || taxTag) {

						apiParams['filter[category_name]'] = null;
						apiParams['filter[tag]'] = null;

						var b = 'filter['+taxCat+']';
						var c = 'filter['+taxTag+']';

						apiParams[b] = cat;
						apiParams[c] = tag;

					}

					apiUrl = api + '/posts/'+ '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
						$scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});


					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';


					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}

				break;

				case 'cardlist':

					apiParams = {
						'filter[category_name]': cat,
                        'filter[tag]': tag,
						'type': cpt
					};

					if(taxCat || taxTag) {

						apiParams['filter[category_name]'] = null;
						apiParams['filter[tag]'] = null;

						var b = 'filter['+taxCat+']';
						var c = 'filter['+taxTag+']';

						apiParams[b] = cat;
						apiParams[c] = tag;

					}

					apiUrl = api + '/posts/' + '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
                        $scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});

					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}


				break;

				case 'medialist':

					apiParams = {
						'filter[category_name]': cat,
                        'filter[tag]': tag,
						'type': cpt
					};

					if(taxCat || taxTag) {

						apiParams['filter[category_name]'] = null;
						apiParams['filter[tag]'] = null;

						var b = 'filter['+taxCat+']';
						var c = 'filter['+taxTag+']';

						apiParams[b] = cat;
						apiParams[c] = tag;

					}

					apiUrl = api + '/posts/' + '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
                        $scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});

					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';
					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}



				break;

				case 'pinlist':

					apiParams = {
						'filter[category_name]': cat,
                        'filter[tag]': tag,
						'type': cpt
					};

					if(taxCat || taxTag) {

						apiParams['filter[category_name]'] = null;
						apiParams['filter[tag]'] = null;

						var b = 'filter['+taxCat+']';
						var c = 'filter['+taxTag+']';

						apiParams[b] = cat;
						apiParams[c] = tag;

					}

					apiUrl = api + '/posts/'+ '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
                        $scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});

					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';
					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}

				break;

				case 'productlist':

					apiParams = {
                        'filter[product_cat]': cat,
                        'filter[product_tag]': tag,
						'type': cpt
					};

					apiUrl = api + '/posts/'+ '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
                        $scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});

					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';
					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}


				break;

				case 'productlist2col':

					apiParams = {
                        'filter[product_cat]': cat,
                        'filter[product_tag]': tag,
						'type': cpt
					};

					apiUrl = api + '/posts/'+ '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.posts = data;
                        $scope.slides = data;
                        $scope.loading = true;
                        $ionicSlideBoxDelegate.update();
					});


					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';
					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['search'] ) {
						$scope.showSearchModal = true;
					}

				break;

				case 'pagesite':

					apiParams = {
					};

					apiUrl = api + '/pages/' + pageData.page_data.sitepage_id + '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
                        $scope.data = data;
						$scope.title = data['title'];
						$scope.content = data['content'];
						$scope.author = data['author']['first_name'];
						$scope.loading = true;
					});

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}


				break;

				case 'postsite':

					apiParams = {
					};

					apiUrl = api + '/posts/' + pageData.page_data.sitepost_id + '?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
                        $scope.data = data;
						$scope.title = data['title'];
						$scope.content = data['content'];
						$scope.author = data['author']['first_name'];
						$scope.loading = true;
					});

					if( 'on' === APPDATA['menus']['items'][i]['page_data']['comments'] ) {
						$rootScope.showComments = false;
					}

				break;

				case 'map':

					if ( typeof google !== 'undefined' ) $scope.mapReady = true;
 					
					// todo: remove global variable
					map_name = APPDATA['menus']['items'][i]['page_data']['map_name'];
					map_address = APPDATA['menus']['items'][i]['page_data']['map_address'];
					map_places = APPDATA['menus']['items'][i]['page_data']['map_places'];

				break;

				case 'imagegrid':

					var filter = APPDATA['menus']['items'][i]['page_data']['gallery_tag'] || 'default';

					apiParams = {
						filter: filter
					};

					apiUrl = api + '/reactor/media/?_jsonp=JSON_CALLBACK';

					DataLoader.getData( apiUrl, apiParams ).success(function(data) {
                        if(data.length <= 0 ){
                            $scope.noDataNotice();
                        }
						$scope.images = data;
						$scope.loading = true;
					});

					$scope.detail = APPDATA['menus']['items'][i]['page_data']['detail'] || 'default';


                    if( APPDATA['menus']['items'][i]['page_data']['sharing'] ){
                        $rootScope.imageShare = true;
                    }


					//var template = '<button class="button button-icon icon ion-camera" ng-click="takeImage()"></button>';
					//var linkFn = $compile(template);
					//var content = linkFn($scope);

					//$scope.rightButtons = '<div id="imagebutton"></div>';



				break;
			}

			// Google analytics page view tracking
			if( window.GAPlugin ) {

				GAPlugin.trackPage( function() { console.log('trackpage: ' + APPDATA['menus']['items'][i]['title'] ); }, function(e) { console.log('error: trackpage' + e); }, APPDATA['menus']['items'][i]['title'] );
			}

			$scope.$apply();

			//var e = angular.element( document.getElementById('imagebutton') );
			//e.append(content);

	}

    $scope.noDataNotice = function() {
        $scope.noData = REACTOR_TEXT['no_data'];
    }

	imageButton = function() {}

    $scope.takeImage = function() {
		DataLoader.postImage();
	};


	// image pop modal
	$ionicModal.fromTemplateUrl('views/templates/modal.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.modalClass = 'image-modal';
	});

	$scope.openModal = function(id) {
		$scope.modalImage = false;
		$scope.modal.show();

		apiParams = {
		};

		apiUrl = api + '/reactor/media/' + id  + '?_jsonp=JSON_CALLBACK';

		DataLoader.getData( apiUrl, apiParams ).success(function(data) {

			if (typeof data[0]['meta']['sizes']['thumbnail'] !== "undefined") {
				$scope.modalImage = data[0]['meta']['sizes']['thumbnail']['url'];
			}

			if (typeof data[0]['meta']['sizes']['medium'] !== "undefined") {
				$scope.modalImage = data[0]['meta']['sizes']['medium']['url'];
			}

			if (typeof data[0]['meta']['sizes']['large'] !== "undefined") {
				$scope.modalImage = data[0]['meta']['sizes']['large']['url'];
			}

			$scope.spinner = true;
		});

	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	$scope.$on('$destroy', function() {
		if($scope.modal)
			$scope.modal.remove();

	});

	window.Arnold = 'Get your ass to mars!';

	//never ending pasta bowl
	paged = 2;
	$scope.moreItems = true;
	
	$scope.loadMoreItems = function() {
	
		$scope.loadSpinner = 'spiral';

		if( !$scope.moreItems ) {
			return;
		}

		var pg = paged++;

		DataLoader.getData( apiUrl + '&page=' + pg, apiParams ).success(function(data) {

			angular.forEach( data, function( value, key ) {
				$scope.posts.push(value);
			});

			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicScrollDelegate.resize();

			if( data.length <= 0 ) {
				$scope.moreItems = false;
			}

		});

	}

	$scope.doRefresh = function() {

        $scope.noData = '';

		DataLoader.getData( apiUrl, apiParams ).success(function(data) {
            if( data.length <= 0 ){
                $scope.noDataNotice();
            }
			paged = 2;

			$scope.posts = [];
			$scope.posts = data;

			$scope.$broadcast('scroll.refreshComplete');
			$ionicScrollDelegate.resize();


		});

	}

    $scope.shareImage = function( title, link ) {

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

	// search modal
	$ionicModal.fromTemplateUrl('views/templates/searchmodal.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.searchmodal = modal;
	});

	$scope.openSearch = function( data ) {

		if( data && data.length > 0 ) {
			$scope.searchData = {value: data};
		}

		$scope.searchmodal.show();

	};
	$scope.closeSearchModal = function() {

		$scope.searchData = {value: null};

		$scope.searchResults = null;
		$scope.noSearchData = null;
		$scope.searchmodal.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.searchmodal.remove();

	});

	$scope.search = function( data ) {

		if( data.length <= 0 )
			return;

		$scope.searchResults = null;
		$scope.noSearchData = null;
		$scope.searchSpinner = true;

		DataLoader.getData( apiUrl + '&filter[s]=' + data + '&filter[posts_per_page]=-1', apiParams ).success(function(data) {
			$scope.searchSpinner = false;
			$scope.noSearchData = null

			$timeout(function() {
				$scope.searchResults = data;

				if( data.length <= 0 ){
	                $scope.noSearchData = REACTOR_TEXT['no_data'];
	                $scope.searchResults = null;
	            }

            }, 200);
		});
		console.log( data );
	}

	$scope.noSubmit = function( $event ) {
		$event.preventDefault();
	}


});
