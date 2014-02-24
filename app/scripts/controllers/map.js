/*
*
*/
angular.module('rmlsmapsApp').controller('MapCtrl', function($scope, $location, sharedService) {

	$scope.isMax = 'display:none;';
	$scope.isMin = 'display:block;';
	$scope.panelWidth = '';
	$scope.panelHeight = '';
	$scope.mapMargin = '';
    $scope.listings = sharedService.listings;

    // default listing
    $scope.activeListing = {
        bb: 'bb',
        address: 'address',
        zip: 'zip',
        city: 'city',
        sqft: 'sqft',
        built: 'built',
        price: 'price',
        imageList: [
            'http://www.rmlsweb.com/WEBPHOTOS/14300000/80000/5000/14385576-1.jpg'
        ]
    };

    // ===================================================================
    // Page loaded
    // ===================================================================
    $scope.init = function() {
        //console.log('map.init');
        $scope.buildMap();
        window.scrollTo(0,0);
    };

    // ===================================================================
    // Show loading animation
    // ===================================================================
    $scope.showLoading = function(){
        return sharedService.isLoading;
    };

	// ===================================================
    //  Build Map ng-init
    // ===================================================
	$scope.buildMap = function(){
        //console.log('buildMap');

        var map,
            mapOptions,
            markers,
            i;

        if(sharedService.listings.length< 1){
            $('#map').html('No Records Found. Try re-submiting your request.');
            sharedService.isLoading = false;
        }else{
            mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            };
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            markers = [];

            // Add a marker to the map and push to the array.
            for(i = 0; i < sharedService.listings.length; i++){
                //markers.push();
                //console.log(i);
                addMarker(sharedService.listings[i]);
            }
            centerMap();
            sharedService.isLoading = false;
        }

        // ------------------------------------------
        // Create the markers ad infowindows
        // ------------------------------------------
        function addMarker(data) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.lat, data.lng),
                map: map,
                title: data.address
            });
            markers.push(data);
            
            // Create the infowindow with two DIV placeholders
            // One for a text string, the other for the StreetView panorama.
            var content = document.createElement("div");
            
            // Just the first image and the data
            // we'll hot link the to a modal with the details
            var row;
            row = $('<div>').addClass('row').append(
                $('<div>').addClass('col-xs-6').append(
                    $('<span>').addClass('pointer').attr('data-toggle', 'modal').attr('data-target', '.bs-example-modal-lg').click(function(){
                        
                        // Set the data and images
                        $scope.activeListing = data;
                        // Manually trigger the update cuz we are in jquery...?
                        $scope.$apply();

                        // Set the street view
                        //console.log(marker);
                        document.getElementById('streetView').innerHTML = 'Loading...';
                        setTimeout(function(){
                            var streetview = document.getElementById('streetView');
                            var panorama = new google.maps.StreetViewPanorama(streetview, {
                                navigationControl: true,
                                enableCloseButton: false,
                                addressControl: false,
                                linksControl: false,
                                visible: true,
                                position: marker.getPosition()
                            });
                        }, 250);
                        

                    }).html(
                        '<img src="'+data.imageList[0]+'" width="100"><br>View Details'
                    )
                ),
                $('<div>').addClass('col-xs-6').append(
                    data.address + '<br>Price: ' + data.price + '<br>Beds/Bths: ' + data.bb  + '<br>Sqft: ' + data.sqft  + '<br>Built: ' + data.built
                )
            );
            $(content).append(row);
            
            /*
            var streetview = document.createElement("DIV");
            streetview.style.width = "320px";
            streetview.style.height = "200px";
            content.appendChild(streetview);
            */

            var infowindow = new google.maps.InfoWindow({
                content: content
            });
        
            // Open the infowindow on marker click
            google.maps.event.addListener(marker, "click", function() {
                infowindow.open(map, marker);
            });
            
            // Handle the DOM ready event to create the StreetView panorama
            // as it can only be created once the DIV inside the infowindow is loaded in the DOM.
            google.maps.event.addListenerOnce(infowindow, "domready", function() {
                
                //$('.carousel').carousel();

                /*
                var panorama = new google.maps.StreetViewPanorama(streetview, {
                    navigationControl: true,
                    enableCloseButton: false,
                    addressControl: false,
                    linksControl: false,
                    visible: true,
                    position: marker.getPosition()
                }); 
                */

            });
        }

        // ------------------------------------------
        // Zoom and center the map to fit the markers 
        // This logic could be conbined with the marker creation.
        // Just keeping it separate for code clarity.
        // ------------------------------------------
        function centerMap(){
            try{
                var bounds = new google.maps.LatLngBounds();
                for (var index in markers) {
                    var data = markers[index];
                    if(data.lat!=0  && data.lng!=0){
                        //console.log(data.lat + ", " + data.lng)
                        bounds.extend(new google.maps.LatLng(data.lat, data.lng));
                    }
                }
                map.fitBounds(bounds);
            }catch(e){
                console.log(e.message);
            }
        }
	};

	// ===================================================
    //  Click event to show the left panel
    // ===================================================
    $scope.showLeftPanel = function(){
		$scope.isMax = '';
		$scope.isMin = 'display:none;';
		$scope.panelWidth = 'width:300px;';
		$scope.panelHeight = 'height:100%;';
		$scope.mapMargin = 'margin-left:300px;';
    };

    // ===================================================
    //  Click event to hide the left panel
    // ===================================================
    $scope.hideLeftPanel = function(){
    	$scope.isMax = 'display:none;';
    	$scope.isMin = '';
    	$scope.panelWidth = '';
    	$scope.panelHeight = '';
    	$scope.mapMargin = '';
    };

});