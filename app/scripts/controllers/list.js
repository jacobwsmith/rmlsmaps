/*
*
*/
angular.module('rmlsmapsApp').controller('ListCtrl', function($scope, $location, sharedService) {

    // Listings count
    $scope.count = 0;

    // Listings object
    $scope.listings = sharedService.listings;

    // ==================================================
    // Page loaded
    // ==================================================
    $scope.init = function() {
        //console.log('list.init');
        sharedService.isLoading = false;
    };

    // ==================================================
    // Show loading animation
    // ==================================================
    $scope.showLoading = function(){
        return sharedService.isLoading;
    };

    // ===================================================
    // Submit Button Clicked
    // ===================================================
    $scope.submit = function() {
        sharedService.isLoading = true;
        //console.log('submit');
        if(sharedService.listings.length < 1){
            $location.path('/');
        }else{
            $scope.getLatLng();
        }
    };

    // ===================================================
    //  Geo code
    // ===================================================
    $scope.getLatLng = function(){
        //console.log('ListCtrl.getLatLng');
        var geocoder = new google.maps.Geocoder();
        // Effing geocodeer sometimes not working
        if(typeof geocoder.geocode === 'function'){
            geocoder.geocode({
                'address': sharedService.listings[$scope.count].gAddress
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // Hit the callback
                    $scope.callback(results[0]);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                    $scope.callback({});
                }
            });
        }else{
            alert('Google geocoder not working');
        }
    };

    // ===================================================
    //  Callback
    // ===================================================
    $scope.callback = function(obj){
        // Set the objects
        sharedService.listings[$scope.count].geocode = obj;
        sharedService.listings[$scope.count].lat = obj.geometry.location.lat();
        sharedService.listings[$scope.count].lng = obj.geometry.location.lng();
        $scope.count++;
        if($scope.count === sharedService.listings.length){
            // We are done
            $scope.$apply(function() {
                $location.path('/map');
            });
        }else{
            // Make another call 
            $scope.getLatLng();
        }
    };

    // ===================================================
    //  Cancel Button Clicked
    // ===================================================
    $scope.cancel = function() {
        $location.path('/');
    };

});