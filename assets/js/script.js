// Adding code from Place Autocomplete Hotel Search
// It doesn't go into initMap
// var map, places, infoWindow;
// var markers = [];
// var autocomplete;
// var countryRestrict = { 'country': 'ie' };
// var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
// var hostnameRegexp = new RegExp('^https?://.+?/');

// var counties = {
//     'Dublin': {
//         center: { lat: 53.34, lng: -6.26 },
//         zoom: 10
//     },
//     'Cork': {
//         center: { lat: 51.89, lng: -8.47 },
//         zoom: 10
//     },
//     'Galway': {
//         center: { lat: 53.27, lng: -9.05 },
//         zoom: 10
//     }
// }


// function initMap() {
//     var map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 12,
//         center: {
//             lat: 53.6299294,
//             lng: -7.8969509
//         },
//         mapTypeControl: false,
//         panControl: false,
//         zoomControl: false,
//         streeViewControl: false
//     });

//     // Google Maps API Place Autocomplete Hotel Search

//     infoWindow = new google.maps.InfoWindow({
//         content: document.getElementById('info-content')
//     });

//     autocomplete = new google.maps.places.Autocomplete(
//         /** @type {!HTMLInputElement} */
//         (
//             document.getElementById('autocomplete')), {
//             types: ['establishment'],
//             componentRestrictions: countryRestrict
//         });
//     places = new google.maps.places.PlacesService(map);

//     autocomplete.addListener('place_changed', onPlaceChanged);

//     // Add a DOM event listener to react when the user selects a county.
//     document.getElementById('county').addEventListener(
//         'change', setAutocompletecounty);

//     function onPlaceChanged() {
//         var place = autocomplete.getPlace();
//         if (place.geometry) {
//             map.panTo(place.geometry.location);
//             map.setZoom(15);
//             search();
//         } else {
//             document.getElementById('autocomplete').placeholder = 'Enter a pub or a restaurant';
//         }
//     }

//     // Search for hotels in the selected city, within the viewport of the map.
//     function search() {
//         var search = {
//             bounds: map.getBounds(),
//             types: ['bar', 'restauraunt']
//         };

//         places.nearbySearch(search, function(results, status) {
//             if (status === google.maps.places.PlacesServiceStatus.OK) {
//                 clearResults();
//                 clearMarkers();
//                 // Create a marker for each hotel found, and
//                 // assign a letter of the alphabetic to each marker icon.
//                 for (var i = 0; i < results.length; i++) {
//                     var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
//                     var markerIcon = MARKER_PATH + markerLetter + '.png';
//                     // Use marker animation to drop the icons incrementally on the map.
//                     markers[i] = new google.maps.Marker({
//                         position: results[i].geometry.location,
//                         animation: google.maps.Animation.DROP,
//                         icon: markerIcon
//                     });
//                     // If the user clicks a hotel marker, show the details of that hotel
//                     // in an info window.
//                     markers[i].placeResult = results[i];
//                     google.maps.event.addListener(markers[i], 'click', showInfoWindow);
//                     setTimeout(dropMarker(i), i * 100);
//                     addResult(results[i], i);
//                 }
//             }
//         });
//     }

//     function clearMarkers() {
//         for (var i = 0; i < markers.length; i++) {
//             if (markers[i]) {
//                 markers[i].setMap(null);
//             }
//         }
//         markers = [];
//     }

//     // Set the county restriction based on user input.
//     // Also center and zoom the map on the given county.
//     function setAutocompletecounty() {
//         var county = document.getElementById('county').value;
//         if (county == 'all') {
//             autocomplete.setComponentRestrictions({ 'county': [] });
//             map.setCenter({ lat: 15, lng: 0 });
//             map.setZoom(2);
//         } else {
//             autocomplete.setComponentRestrictions({ 'county': county });
//             map.setCenter(counties[county].center);
//             map.setZoom(counties[county].zoom);
//         }
//         clearResults();
//         clearMarkers();
//     }

//     function dropMarker(i) {
//         return function() {
//             markers[i].setMap(map);
//         };
//     }

//     function addResult(result, i) {
//         var results = document.getElementById('results');
//         var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
//         var markerIcon = MARKER_PATH + markerLetter + '.png';

//         var tr = document.createElement('tr');
//         tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
//         tr.onclick = function() {
//             google.maps.event.trigger(markers[i], 'click');
//         };

//         var iconTd = document.createElement('td');
//         var nameTd = document.createElement('td');
//         var icon = document.createElement('img');
//         icon.src = markerIcon;
//         icon.setAttribute('class', 'placeIcon');
//         icon.setAttribute('className', 'placeIcon');
//         var name = document.createTextNode(result.name);
//         iconTd.appendChild(icon);
//         nameTd.appendChild(name);
//         tr.appendChild(iconTd);
//         tr.appendChild(nameTd);
//         results.appendChild(tr);
//     }

//     function clearResults() {
//         var results = document.getElementById('results');
//         while (results.childNodes[0]) {
//             results.removeChild(results.childNodes[0]);
//         }
//     }

//     // Get the place details for a hotel. Show the information in an info window,
//     // anchored on the marker for the hotel that the user selected.
//     function showInfoWindow() {
//         var marker = this;
//         places.getDetails({ placeId: marker.placeResult.place_id },
//             function(place, status) {
//                 if (status !== google.maps.places.PlacesServiceStatus.OK) {
//                     return;
//                 }
//                 infoWindow.open(map, marker);
//                 buildIWContent(place);
//             });
//     }

//     // Load the place information into the HTML elements used by the info window.
//     function buildIWContent(place) {
//         document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
//             'src="' + place.icon + '"/>';
//         document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
//             '">' + place.name + '</a></b>';
//         document.getElementById('iw-address').textContent = place.vicinity;

//         if (place.formatted_phone_number) {
//             document.getElementById('iw-phone-row').style.display = '';
//             document.getElementById('iw-phone').textContent =
//                 place.formatted_phone_number;
//         } else {
//             document.getElementById('iw-phone-row').style.display = 'none';
//         }

//         // Assign a five-star rating to the hotel, using a black star ('&#10029;')
//         // to indicate the rating the hotel has earned, and a white star ('&#10025;')
//         // for the rating points not achieved.
//         if (place.rating) {
//             var ratingHtml = '';
//             for (var i = 0; i < 5; i++) {
//                 if (place.rating < (i + 0.5)) {
//                     ratingHtml += '&#10025;';
//                 } else {
//                     ratingHtml += '&#10029;';
//                 }
//                 document.getElementById('iw-rating-row').style.display = '';
//                 document.getElementById('iw-rating').innerHTML = ratingHtml;
//             }
//         } else {
//             document.getElementById('iw-rating-row').style.display = 'none';
//         }

//         // The regexp isolates the first part of the URL (domain plus subdomain)
//         // to give a short URL for displaying in the info window.
//         if (place.website) {
//             var fullUrl = place.website;
//             var website = hostnameRegexp.exec(place.website);
//             if (website === null) {
//                 website = 'http://' + place.website + '/';
//                 fullUrl = website;
//             }
//             document.getElementById('iw-website-row').style.display = '';
//             document.getElementById('iw-website').textContent = website;
//         } else {
//             document.getElementById('iw-website-row').style.display = 'none';
//         }
//     }
// Google Maps API Places search code

// var card = document.getElementById('pac-card');
// var input = document.getElementById('pac-input');
// var types = document.getElementById('type-selector');
// var strictBounds = document.getElementById('strict-bounds-selector');

// // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
// map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

// var autocomplete = new google.maps.places.Autocomplete(input);

// autocomplete.bindTo('bounds', map);

// autocomplete.setFields(
//     ['address_components', 'geometry', 'icon', 'name']);

// var infowindow = new google.maps.InfoWindow();
// var infowindowContent = document.getElementById('infowindow-content');
// infowindow.setContent(infowindowContent);
// var marker = new google.maps.Marker({
//     map: map,
//     anchorPoint: new google.maps.Point(0, -29)
// });

// autocomplete.addListener('place_changed', function() {
//     infowindow.close();
//     marker.setVisible(false);
//     var place = autocomplete.getPlace();
//     if (!place.geometry) {
//         // User entered the name of a Place that was not suggested and
//         // pressed the Enter key, or the Place Details request failed.
//         window.alert("No details available for input: '" + place.name + "'");
//         return;
//     }

//     // If the place has a geometry, then present it on a map.
//     if (place.geometry.viewport) {
//         map.fitBounds(place.geometry.viewport);
//     } else {
//         map.setCenter(place.geometry.location);
//         map.setZoom(17); // Why 17? Because it looks good.
//     }
//     marker.setPosition(place.geometry.location);
//     marker.setVisible(true);

//     var address = '';
//     if (place.address_components) {
//         address = [
//             (place.address_components[0] && place.address_components[0].short_name || ''),
//             (place.address_components[1] && place.address_components[1].short_name || ''),
//             (place.address_components[2] && place.address_components[2].short_name || '')
//         ].join(' ');
//     }

//     infowindowContent.children['place-icon'].src = place.icon;
//     infowindowContent.children['place-name'].textContent = place.name;
//     infowindowContent.children['place-address'].textContent = address;
//     infowindow.open(map, marker);
// });

// // Sets a listener on a radio button to change the filter type on Places
// // Autocomplete.
// function setupClickListener(id, types) {
//     var radioButton = document.getElementById(id);
//     radioButton.addEventListener('click', function() {
//         autocomplete.setTypes(types);
//     });
// }

// setupClickListener('changetype-all', []);
// setupClickListener('changetype-address', ['address']);
// setupClickListener('changetype-establishment', ['establishment']);
// setupClickListener('changetype-geocode', ['geocode']);

// document.getElementById('use-strict-bounds')
//     .addEventListener('click', function() {
//         console.log('Checkbox clicked! New state=' + this.checked);
//         autocomplete.setOptions({ strictBounds: this.checked });
//     });

// End of Google Maps API Places search code


// var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// var locations = [
//     { lat: 40.785091, lng: -73.968285 },
//     { lat: 41.084045, lng: -73.874245 },
//     { lat: 40.754932, lng: -73.984016 }
// ];

// var markers = locations.map(function(location, i) {
//     return new google.maps.Marker({
//         position: location,
//         label: labels[i % labels.length]
//     });
// });

// var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
// }

// Google Maps API Autocomplete Only

const IRELAND_BOUNDS = {
    north: 55.33539361,
    south: 51.4266145,
    west: -10.58532715,
    east: -5.43273926
};

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 53.6299294, lng: -7.8969509 },
        zoom: 7,
        restriction: {
            latLngBounds: IRELAND_BOUNDS,
            strictBounds: true
        },
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    // options for bounds
    var options = {
        bounds: IRELAND_BOUNDS,
        types: ['establishment'],
        strictBounds: true
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
        .addEventListener('click', function() {
            console.log('Checkbox clicked! New state=' + this.checked);
            // autocomplete.setOptions({ strictBounds: this.checked });
            autocomplete.setOptions({ strictBounds: true });
        });
}

$(function() {
    $('.selectpicker').selectpicker();
});