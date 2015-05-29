app.factory( 'TemplateLoader', function( $http, $stateParams, $location ){
		
	return {
	
		getThePage: function( pageName ) {
          	var pageURL = 'views/components/'+ pageName +'.html';
			return pageURL;
		}	  
	} ///return
	
});
