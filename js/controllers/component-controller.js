app.controller('MapCtrl', function( $scope, $ionicLoading, $compile, $sce ) {

	$scope.setStyle = {
		height: document.getElementById('map').clientHeight + 'px',
		width: document.getElementById('map').clientWidth + 'px',
		display: 'block'
	}
	
	$scope.noMap = $sce.trustAsHtml( 'qqqqqqqq' );

});

app.controller('CommentsCtrl', function( $scope, $stateParams, DataLoader, $ionicScrollDelegate ) {

	$scope.getComments = function() {
		return 'views/components/comments.html';
	}

	var apiUrl = api + '/posts/'+ $stateParams.postID + '/comments?_jsonp=JSON_CALLBACK';

	var apiParams = {
		'number': 10
	};

	DataLoader.getData( apiUrl, apiParams ).success(function(data) {

		$scope.comments = data;
        $scope.spinner = true;
	});

	$scope.moreComments = true;
	var commentOffset = 10;
	var commentPaged = 1;

	$scope.loadMoreComments = function(){

		commentPaged++;

		pg = Math.round( commentPaged * commentOffset );

		console.log(pg);

		var apiUrl = api + '/posts/'+ $stateParams.postID + '/comments?_jsonp=JSON_CALLBACK' + '&offset=' + pg;

		var apiParams = {
			'number': 10
		};

		DataLoader.getData( apiUrl, apiParams ).success(function(data) {

	        if(data.length <= 0 ){
	            $scope.moreComments = false;
	        }

	        angular.forEach( data, function( value, key ) {
				$scope.comments.push(value);
			});

			$scope.$broadcast('scroll.infiniteScrollComplete');
			$ionicScrollDelegate.resize();
		});

	}


});

app.controller('audioButtonCtrl', function( $sce, $scope, $rootScope ) {

		this.config = {
			url: $sce.trustAsResourceUrl($scope.file),
			playButtonClass: $scope.class,
			playButtonTitle: $scope.title
		};

		$scope.playAudio = function(file) {
			$rootScope.play2Audio(file);
			$rootScope.fileTitle = $scope.filetitle;

		}

});


app.controller('audioCtrl', function( $sce, $scope, $rootScope ) {

		var controller = this;
		controller.API = null;

		controller.onPlayerReady = function(API) {
			controller.API = API;
		};


		$rootScope.play2Audio = function(file) {

			$scope.showPlayer = true;

			console.log(file);

			controller.config = {
				sources: [
	              {src: $sce.trustAsResourceUrl(file), type: "audio/mpeg"}
				 ],
				theme: {
					url: "../lib/videogular/videogular.css"
				}
			};

		}

		$scope.ClosePlayer = function() {
			$scope.showPlayer = false;
		}

});


app.controller('videoCtrl', function( $sce, $scope, $rootScope ) {

		console.log( $scope.file );

		this.config = {
			sources: [
				{src: $sce.trustAsResourceUrl($scope.file), type: "video/mp4"},
				{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
				{src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
			],
			tracks: [
				{
					src: "",
					kind: "subtitles",
					srclang: "en",
					label: "English",
					default: ""
				}
			],
			theme: "../lib/videogular/videogular.css"
		};

});
