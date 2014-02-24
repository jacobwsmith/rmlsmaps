'use strict';

// Main Controller
angular.module('rmlsmapsApp').controller('MainCtrl', function($scope, $location, sharedService) {

	$scope.name = '';

    // ===================================================================
    // Page loaded
    // ===================================================================
    $scope.init = function() {
        //console.log('init');
        sharedService.isLoading = false;
    };

    $scope.example = function(){
        console.log('click');
        //$scope.name = 'http://www.rmlsweb.com/v2/public/report.asp?type=AE&CRPT2=BgUFB2ddDnZfXVBcR1FdXAzDzDbzC62nng76WVHhDlrf1nzGzCAzDzDdgh';
        $scope.name = 'http://www.jacobwsmith.com/rmlsmaps/example.html';
        $scope.onButtonClick();
    }

    // ===================================================================
    // Show loading animation
    // ===================================================================
    $scope.showLoading = function(){
        return sharedService.isLoading;
    };

    // ===================================================================
    // Button clicked
    // ===================================================================
    $scope.onButtonClick = function() {
        //console.log('Button Clicked');
        // Show loading animation
        sharedService.isLoading = true;
        // Do ajax call
        // Note we are overwriting the ajax method to use YUI proxy 
        // see bottom of page
        $.ajax({
            url: $scope.name,
            type: 'get',
            dataType: '',
            success: function(data) {
                var str,
                    start,
                    end;
                //console.log('=== success ===');
                str = data.responseText;
                $scope.setListings(str);
            },
            error: function(status) {
                alert('An Error has occured');
                sharedService.isLoading = false;
                console.log('=== error ===');
                console.log(status);
            }
        });
    };

    // ===================================================================
    // Parse the data
    // Ry's Report
    // ===================================================================
    $scope.setListings = function(data){
    	try{
            // Replaces ' ' with '+', used for google geocode string
            var gThis = function(str){
                return str.replace(/ /g, '+');
            };
            sharedService.listings = [];
            // Read the report data as html
            $.each($(data).find('.V2_REPORT_SUBREPORT > table'), function(index, item) {
            	var _index = index;
                sharedService.listings.push({});
                // ------------------------------------------------------------
                // Set the Images
                // // Image location
                // example 1: http://www.rmlsweb.com/WEBPHOTOS/13200000/00000/8000/13208469-1.jpg?t=20140209084717
                // example 2: http://www.rmlsweb.com/webphotos/14500000/20000/1000/14521296-7.jpg?t=69598166
                // ------------------------------------------------------------
                // Get only the first image
                // using src to determine path below
                /*
                <img class="PHOTO" alt="MLS#13208469" id="PHOTO_13208469" src="/webphotos/13200000/00000/8000/13208469-6.jpg?t=69598166">
                */
                var src = $(this).find('.PHOTO').attr('src');
                src = src.slice(0, src.lastIndexOf('/')+1);
                // console.log(src);
                // Loop through and adds all images
                sharedService.listings[_index].imageList = [];
                $(this).find('[id^="PHOTONAV"]').each(function( index ) {
                    var img = $(this).context.id;
                    img = img.replace('_', ''); //  removes first '_'
                    img = img.replace('_', '-'); // replaces '_' with '-'
                    //console.log(img);
                    img = img.slice(img.indexOf('PHOTONAV_')+9);
                    // Add the path and the src from above
                    img = 'http://www.rmlsweb.com' + src + img + '.jpg';
                    sharedService.listings[_index].imageList.push(img);

                });
                // ------------------------------------------------------------
                // Set the Data
                // ------------------------------------------------------------
    		    $(this).find('.V2_REPORT_ROW').each(function( index ) {
        	    	if(index === 0){
                        // MLS
                        sharedService.listings[_index].mls = $(this).find('td:eq(1) p').html().trim();
                        // Status
                        sharedService.listings[_index].status = $(this).find('td:eq(5) p').html().trim();
                        // Price
                        sharedService.listings[_index].price = $(this).find('td:last p').html().trim();
                    }else if(index === 1){
                        // Address
                        sharedService.listings[_index].address = $(this).find('td:eq(1) p').html().trim();
                        var aPos = sharedService.listings[_index].address.indexOf('<a');
                        if(aPos !== -1){
                            sharedService.listings[_index].address = sharedService.listings[_index].address.slice(0, aPos).trim();
                        }
                        // City
                        sharedService.listings[_index].city = $(this).find('td:eq(3) > a').html().trim();
                        // Zip
                        sharedService.listings[_index].zip = $(this).find('td:eq(5) p').html().trim();
                    }else if(index === 3){
                        // Beds/Baths
                        sharedService.listings[_index].bb = $(this).find('td:eq(1) p').html().trim();
                        // Square feet
                        sharedService.listings[_index].sqft = $(this).find('td:eq(3) p').html().trim();
                        // Built
                        sharedService.listings[_index].built = $(this).find('td:eq(5) p').html().trim();
                    }
    		    });
                // Set the google address string
                sharedService.listings[_index].gAddress = gThis(sharedService.listings[_index].address + ', ' + sharedService.listings[_index].city + ', ' + sharedService.listings[_index].zip);
            });
    		//console.log(sharedService.listings);
    		if(sharedService.listings.length > 0){
                // Goto list page
                $scope.$apply(function() {
                    $location.path('/list');
                });
    		}else{
                //  No records found
                alert('No records found');
    		}
        }catch(e){
            // Try setListings2 (maria's report format);
            $scope.setListings2(data);
        }
    }

    // ===================================================================
    // Parse the data
    // Maria's Report
    // ===================================================================
    $scope.setListings2 = function(data){
        try{
            console.log('setListings2');
            // Replaces ' ' with '+', used for google geocode string
            var gThis = function(str){
                return str.replace(/ /g, '+');
            };
            sharedService.listings = [];
            // Read the report data as html
            $.each($(data).find('.V2_REPORT_PHOTOTABLE'), function(index, item) {
                console.log('.V2_REPORT_PHOTOTABLE: ' + index);
                var _index = index;
                sharedService.listings.push({});
                // ------------------------------------------------------------
                // Set the Images
                // // Image location
                // example 1: http://www.rmlsweb.com/WEBPHOTOS/13200000/00000/8000/13208469-1.jpg?t=20140209084717
                // example 2: http://www.rmlsweb.com/webphotos/14500000/20000/1000/14521296-7.jpg?t=69598166
                // ------------------------------------------------------------
                // Get only the first image
                // using src to determine path below
                /*
                <img class="PHOTO" alt="MLS#13208469" id="PHOTO_13208469" src="/webphotos/13200000/00000/8000/13208469-6.jpg?t=69598166">
                */
                var src = $(this).find('.PHOTO').attr('src');
                src = src.slice(0, src.lastIndexOf('/')+1);
                // console.log(src);
                // Loop through and adds all images
                sharedService.listings[_index].imageList = [];
                $(this).find('[id^="PHOTONAV"]').each(function( index ) {
                    var img = $(this).context.id;
                    img = img.replace('_', ''); //  removes first '_'
                    img = img.replace('_', '-'); // replaces '_' with '-'
                    //console.log(img);
                    img = img.slice(img.indexOf('PHOTONAV_')+9);
                    // Add the path and the src from above
                    img = 'http://www.rmlsweb.com' + src + img + '.jpg';
                    sharedService.listings[_index].imageList.push(img);

                });
                // ------------------------------------------------------------
                // Set the Data
                // ------------------------------------------------------------
                $(this).find('.V2_REPORT_ROW').each(function( index ) {
                    if(index === 3){
                        // Status
                        sharedService.listings[_index].status = $(this).find('td:eq(2)').text().trim();
                    }else if(index === 4){
                        // MLS
                        sharedService.listings[_index].mls = $(this).find('td:eq(1)').text().trim();
                        // Price
                        sharedService.listings[_index].price = $(this).find('td:eq(5)').text().trim();
                    }else if(index === 5){
                        // Address
                        sharedService.listings[_index].address = $(this).find('td:eq(1)').text().trim();
                        var aPos = sharedService.listings[_index].address.indexOf('<a');
                        if(aPos !== -1){
                            sharedService.listings[_index].address = sharedService.listings[_index].address.slice(0, aPos).trim();
                        }
                    }else if(index === 6){
                        // City
                        sharedService.listings[_index].city = $(this).find('td:eq(1) > a').text().trim();
                        // Zip
                        sharedService.listings[_index].zip = $(this).find('td:eq(3)').text().trim();
                    }
                });

                // Beds
                ///console.log($('.REPORT_STDBOX:eq(0)').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(0)').find('td:eq(5)').text().trim());
                sharedService.listings[_index].beds = $(data).find('.REPORT_STDBOX:eq('+_index+')').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(0)').find('td:eq(5)').text().trim();
                
                // Baths
                //console.log($('.REPORT_STDBOX:eq(0)').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(0)').find('td:eq(7)').text().trim());
                sharedService.listings[_index].baths = $(data).find('.REPORT_STDBOX:eq('+_index+')').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(0)').find('td:eq(7)').text().trim();

                // Beds/Baths
                sharedService.listings[_index].bb = sharedService.listings[_index].beds.replace('/', '.') + '/' + sharedService.listings[_index].baths.replace('/', '.');

                // Square feet
                sharedService.listings[_index].sqft = $(data).find('.REPORT_STDBOX:eq('+_index+')').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(3)').find('td:eq(1)').text().trim()

                // Built
                sharedService.listings[_index].built = $(data).find('.REPORT_STDBOX:eq('+_index+')').find('.V2_REPORT_SUBREPORT:eq(2)').find('.V2_REPORT_ROW:eq(0)').find('td:eq(11)').text().trim();
                var bPos = sharedService.listings[_index].built.indexOf('/');
                if(bPos !== -1){
                    sharedService.listings[_index].built = sharedService.listings[_index].built.slice(0, bPos).trim();
                }

                // Set the google address string
                sharedService.listings[_index].gAddress = gThis(sharedService.listings[_index].address + ', ' + sharedService.listings[_index].city + ', ' + sharedService.listings[_index].zip);
            });
            if(sharedService.listings.length > 0){
                // Goto list page
                $scope.$apply(function() {
                    $location.path('/list');
                });
            }else{
                //  No records found
                alert('No records found');
            }
        }catch(e){
            
            alert('Sorry, the system is unable to parse your report. Please contact the admin with the report url.');
            console.log(e.message);
            sharedService.isLoading = false;
            // TODO: setListings2 (maria's report format);
        }
    }


});

/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */
// http://jsfiddle.net/Paulpro/fDN7t/
// This is annoying
// Could use php proxy
// http://69.195.77.178/php-simple-proxy/ba-simple-proxy.php
// Instead using the 
// Or
// We move to a node server
jQuery.ajax = (function(_ajax){
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    return function(o) {
        var url = o.url;
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            // Manipulate options so that JSONP-x request is made to YQL
            o.url = YQL;
            o.dataType = 'json';
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            o.success = (function(_success){
                return function(data) {
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                };
            })(o.success);
        }
        return _ajax.apply(this, arguments);
    };
})(jQuery.ajax);

