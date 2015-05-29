app.directive('map', function() {
	return {
		restrict: 'E',
		scope: {
		  onCreate: '&'
		},
		link: function ( $scope, $element, $attr ) {
		
			if ( typeof google === 'undefined' ) return;
		
			function initialize() {
			
				if(navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(pos) {
						window.myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
						window.reactorMap.setCenter(myLatlng);

						var marker = new google.maps.Marker({
						    map: window.reactorMap,
						    position: window.myLatlng,
						    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
						    //animation: google.maps.Animation.DROP,
						  });

			        }, function(error) {
			          alert('Unable to get location: ' + error);
			        });

				} else {
					console.log('No navigator.geolocation');
				}
			
				var mapOptions = {
					zoom: 13,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				
				window.reactorMap = new google.maps.Map( $element[0], mapOptions );
				
				// need to hide and show to redraw. webkit bug
				document.getElementById('map').style.display = 'none';
				
				setTimeout(function(){
					document.getElementById('map').style.display = 'block';
					google.maps.event.trigger(window.reactorMap, 'resize');
				}, 500);

				setTimeout(function(){
					// If user added a store name or address, do stuff
					if ( map_name ) {
						findPlace(map_name);
					} else if ( map_places ) {
						findAddress(map_places);
					} else if ( map_address ) {
						findAddress(map_address);
					}

				}, 1000);
				
				google.maps.event.trigger(window.reactorMap, 'resize');
				
			}

			var infowindow = new google.maps.InfoWindow();
			var geocoder = new google.maps.Geocoder();

		    
		    // find multiple address and place pins
		    function findAddress(address){
		    
		     	var addresses = ( typeof addresses != 'undefined' && x instanceof Array ) ? address.split('|') : address;
			    var marker, i;
			 
			    for (i = 0; i < addresses.length; i++) {
			    
			    
			    	if( map_places ) {
			        	var newaddress = addresses[i]['single_address'];
			        	
			        	var detail = 
			        		'<div class="gm-iw gm-sm">' +
			        			'<div class="gm-title">' + addresses[i]['single_title'] + '</div>' +
								'<div class="gm-basicinfo">' + addresses[i]['single_address_details'] + '</div>' +
							'</div>' 
			        	
			        	;
			        	
		        	} else {
			        	var newaddress = addresses[i];
		        	}
			    
					geocodeAddress( newaddress, detail );
			    }
		    
			    
		    }

			// geocode address or locations
			function geocodeAddress( newaddress, detail ) {
			
			  geocoder.geocode( { 'address': newaddress }, function(results, status) {
			  //alert(status);
			    if ( status == google.maps.GeocoderStatus.OK ) {
			    
	                var latitude = results[0].geometry.location.lat();
	                var longitude = results[0].geometry.location.lng();
	                var posLatlng = new google.maps.LatLng(latitude, longitude);
	                window.reactorMap.setCenter(posLatlng);			    

			      createMarkers( posLatlng, detail );
			    }
			    else
			    {
			      alert("some problem in geocode" + status);
			    }
			  }); 
			}
			
			// put pins on map
			function createMarkers( latlng, html ){
				var marker = new google.maps.Marker({
					position: latlng,
					title: html,
					map: window.reactorMap,
					animation: google.maps.Animation.DROP
				}); 
				
				google.maps.event.addListener( marker, 'click', function() { 
					infowindow.setContent( marker.title );
					infowindow.open( window.reactorMap, marker );
				});
					
			}


		    // Find a store using Places API
		    function findPlace(placeName) {

				var request = {
					location: window.myLatlng,
					radius: '10000',
					keyword: placeName
					//types: ['store']
				};

				service = new google.maps.places.PlacesService(window.reactorMap);
				service.nearbySearch(request, placesCallback);

		    }

		    // Loop through store locations
		    function placesCallback(results, status) {

			  if (status == google.maps.places.PlacesServiceStatus.OK) {
			    for (var i = 0; i < results.length; i++) {
			      var place = results[i];
			      createMarker(results[i]);
			    }
			  }
			}

			// Add a marker to the map
			function createMarker(place) {

			  var marker = new google.maps.Marker({
			    map: window.reactorMap,
			    position: place.geometry.location,
			    //animation: google.maps.Animation.DROP,
			  });
			  
			  google.maps.event.addListener(marker, 'click', function() {
				var infowindow = new google.maps.InfoWindow();

			    infowindow.setContent('<p>' + place.name + '</p><p>' + place.vicinity + '</p>');
			    infowindow.open(window.reactorMap, this);
			    setTimeout( function () { infowindow.close(); }, 3500);
			  });
			}

			// center map on current user location
			window.centerOnMe = function() {
				window.reactorMap.setCenter(window.myLatlng);
			}
				
			if (document.readyState === 'complete') {
				initialize();
			} else {
				google.maps.event.addDomListener( window, 'load', initialize );
			}
		  
		}
	}
});
