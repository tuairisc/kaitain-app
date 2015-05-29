app.filter('formatDate', function(){
    return function( date ) {
    	stringDate = new Date( date );
        return stringDate.toDateString();
    };
});


app.filter('trusted', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=no,enableViewportScale=yes')\"");
        return $sce.trustAsHtml(newString);
    }
});

app.filter('allow_html', function ($sce) {
    return function (text) {

		var htmlObject = document.createElement('div');
		htmlObject.innerHTML = text;

		var navItem = htmlObject.getElementsByTagName('a');
		var iframeItem = htmlObject.getElementsByTagName('iframe');

		for (var i = 0; i < navItem.length; i++) {

		    var page = navItem[i].getAttribute('applink');
		    var link = navItem[i].getAttribute('href');

		    if(page) {
			    var pagelink = get_page_route( page );
			    navItem[i].href = pagelink;
		    } else {
			    navItem[i].removeAttribute('href');
			    navItem[i].setAttribute('onclick', 'window.open("'+ link +'", "_blank", "location=no,enableViewportScale=yes")');
		    }

		}

		for (var i = 0; i < iframeItem.length; i++) {

		    var src = iframeItem[i].getAttribute('src');

		    if( src.substr(0, 6) == "https:" ||  src.substr(0, 5) == "http:" ) {

			} else {
				var prefix = 'http:';

				if ( src.substr(0, prefix.length) !== prefix ) {
				    src = prefix + src;
				    iframeItem[i].setAttribute('src', src);
				}
			}

		}

        return $sce.trustAsHtml(htmlObject.outerHTML);
    }
});


app.filter('trust', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
});

app.filter('striptags', function($sce, $sanitize){
    return function(text) {
    	var StrippedString = $sanitize(text).replace(/<\/?[^>]+(>|$)/g, "");
        return $sce.trustAsHtml(StrippedString);
    };
});


app.filter('hasFeatured', function() {

   return function( items ) {

    var filtered = [];

    angular.forEach(items, function(item) {
       if( condition === item.featured_image.attachment_meta.sizes.medium.url ||  item.condition === '' ){
         filtered.push(item);
       }
    });

    return filtered;
  };
});


app.filter('i18n', function($sce){
		function filterFn(text) {
			var rText = ( typeof REACTOR_TEXT !== 'undefined' ) ? REACTOR_TEXT[text] : '';
			return $sce.trustAsHtml(rText);
		    
		}
	
	    filterFn.$stateful = true;
	
	    return filterFn;
});

app.filter('spinnerFilter', function() {

	var spinner = ( APPDATA['meta']['design']['spinner'] ) ? APPDATA['meta']['design']['spinner'] : '';

	return function() {
        return spinner;
    };	
});


function get_page_route( pagetitle ){

	for ( var i = 0; i < APPDATA['menus']['items'].length; i++ ) {

		if( APPDATA['menus']['items'][i]['title'] === pagetitle ){

			return '#/app/' + APPDATA['menus']['items'][i]['page_data']['route'] + '/' + APPDATA['menus']['items'][i]['page_id'] ;

		}

	}

	return '#';

}
