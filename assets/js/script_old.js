const IRELAND_BOUNDS = {
    north: 55.33539361,
    south: 51.4266145,
    west: -10.58532715,
    east: -5.43273926
};

var infowindow;
var markers = [];
var map;
var google;

var BOUNDS = {
    lat: 1,
    lng: 1
}

var countyList = [{
        "county": "Dublin",
        "Current_latitude": 53.3498,
        "Current_longitude": -6.2603,
        "radius": 2000
    },

    {
        "county": "Mayo",
        "Current_latitude": 54.0153,
        "Current_longitude": -9.4289,
        "radius": 2000
    },

    {
        "county": "Donegal",
        "Current_latitude": 54.6538,
        "Current_longitude": -8.1096,
        "radius": 2000
    },
    {
        "county": "Sligo",
        "Current_latitude": 54.2766,
        "Current_longitude": -8.4761,
        "radius": 2000
    },

    {
        "county": "Galway",
        "Current_latitude": 53.2707,
        "Current_longitude": -9.0568,
        "radius": 2000
    }
];

function update() {
    var select_county_value = document.getElementById("select-county").value;
    var select_establishment = document.getElementById("select-establishment").value;
    console.log("County: " + select_county_value);
    console.log("Establishment: " + select_establishment);

    if ((select_county_value != "") && (select_establishment != "")) {
        var pyrmont = new google.maps.LatLng(countyList[0].Current_latitude, countyList[0].Current_longitude);
        console.log("Pyrmont: " + pyrmont);
        var key = select_county_value.replace("value", "");
        console.log("Key: " + key);
        var current_radius = countyList[0].radius;
        // var current_radius = 0;

        // for (var i = 0; i < countyList.length; i++) {
        //     if (countyList[i].county.toLowerCase().indexOf(key) != "") {
        //         current_radius = countyList[i].radius;
        //         pyrmont = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
        //     }
        // }
        console.log("Radius: " + current_radius);
        var request = {
            location: pyrmont,
            radius: current_radius,
            types: [select_establishment.replace("value", "")]
        };
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        // map = new google.maps.Map(document.getElementById("map"), {
        //     center: pyrmont,
        //     zoom: 13
        // });

        // var card = document.getElementById('pac-card');
        // var input = document.getElementById('pac-input');
        // var types = document.getElementById('type-selector');
        // var strictBounds = document.getElementById('strict-bounds-selector');

        // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

        // var request = {
        //     location: pyrmont,
        //     radius: countyList[0].radius,
        //     types: ['restaurant']
        // };

        // var autocomplete = new google.maps.places.Autocomplete(input, request);

        // autocomplete.bindTo('bounds', map);
        // autocomplete.setFields(
        //     ['address_components', 'geometry', 'icon', 'name']);

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
    }
}

function initialize() {
    // console.log("county: " + countyList)
    // console.log("county: " + countyList[0].Current_latitude)
    // console.log("county: " + countyList[0].Current_longitude)
    // console.log("county: " + countyList[0].county)
    var pyrmont = new google.maps.LatLng(countyList[0].Current_latitude, countyList[0].Current_longitude);
    map = new google.maps.Map(document.getElementById("map"), {
        center: pyrmont,
        zoom: 13
    });

    // var request = {
    //     location: pyrmont,
    //     radius: countyList[0].radius,
    //     types: ['restaurant']
    // };

    // var options = {
    //     bounds: pyrmont,
    //     types: ['restaurant'],
    //     strictBounds: true
    // };
    // console.log("Options: " + JSON.stringify(options));

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize());
// google.maps.event.addDomListener(window, 'bounds_changed', initialize);

// function initialize() {
//     getBounds = GetSelectedValue()
//     var map = new google.maps.Map(document.getElementById('map'), {
//         // center: { lat: 53.6299294, lng: -7.8969509 },
//         center: getBounds,
//         zoom: 12,
//         restriction: {
//             latLngBounds: getBounds,
//             strictBounds: true
//         },
//     });
//     var card = document.getElementById('pac-card');
//     var input = document.getElementById('pac-input');
//     var types = document.getElementById('type-selector');
//     var strictBounds = document.getElementById('strict-bounds-selector');

//     map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

//     console.log("Ireland Bounds:" + IRELAND_BOUNDS)

//     // options for bounds
//     var options = {
//         bounds: getBounds,
//         types: ['establishment'],
//         strictBounds: true
//     };
//     // var options = {
//     //     bounds: BOUNDS,
//     //     types: ['establishment'],
//     //     strictBounds: true
//     // };

//     var autocomplete = new google.maps.places.Autocomplete(input, options);

//     // Bind the map's bounds (viewport) property to the autocomplete object,
//     // so that the autocomplete requests use the current map bounds for the
//     // bounds option in the request.
//     autocomplete.bindTo('bounds', map);

//     // Set the data fields to return when the user selects a place.
//     autocomplete.setFields(
//         ['address_components', 'geometry', 'icon', 'name']);

//     var infowindow = new google.maps.InfoWindow();
//     var infowindowContent = document.getElementById('infowindow-content');
//     infowindow.setContent(infowindowContent);
//     var marker = new google.maps.Marker({
//         map: map,
//         anchorPoint: new google.maps.Point(0, -29)
//     });

//     autocomplete.addListener('place_changed', function() {
//         infowindow.close();
//         marker.setVisible(false);
//         var place = autocomplete.getPlace();
//         if (!place.geometry) {
//             // User entered the name of a Place that was not suggested and
//             // pressed the Enter key, or the Place Details request failed.
//             window.alert("No details available for input: '" + place.name + "'");
//             return;
//         }

//         // If the place has a geometry, then present it on a map.
//         if (place.geometry.viewport) {
//             map.fitBounds(place.geometry.viewport);
//         } else {
//             map.setCenter(place.geometry.location);
//             map.setZoom(17); // Why 17? Because it looks good.
//         }
//         marker.setPosition(place.geometry.location);
//         marker.setVisible(true);

//         var address = '';
//         if (place.address_components) {
//             address = [
//                 (place.address_components[0] && place.address_components[0].short_name || ''),
//                 (place.address_components[1] && place.address_components[1].short_name || ''),
//                 (place.address_components[2] && place.address_components[2].short_name || '')
//             ].join(' ');
//         }

//         infowindowContent.children['place-icon'].src = place.icon;
//         infowindowContent.children['place-name'].textContent = place.name;
//         infowindowContent.children['place-address'].textContent = address;
//         infowindow.open(map, marker);
//     });

//     // Sets a listener on a radio button to change the filter type on Places
//     // Autocomplete.
//     function setupClickListener(id, types) {
//         var radioButton = document.getElementById(id);
//         radioButton.addEventListener('click', function() {
//             autocomplete.setTypes(types);
//         });
//     }

//     setupClickListener('changetype-all', []);
//     setupClickListener('changetype-address', ['address']);
//     setupClickListener('changetype-establishment', ['establishment']);
//     setupClickListener('changetype-geocode', ['geocode']);

//     document.getElementById('use-strict-bounds')
//         .addEventListener('click', function() {
//             console.log('Checkbox clicked! New state=' + this.checked);
//             // autocomplete.setOptions({ strictBounds: this.checked });
//             autocomplete.setOptions({ strictBounds: true });
//         });
// }

function GetSelectedValue() {
    var e = document.getElementById("select-county");
    var result = e.options[e.selectedIndex].value;

    if (result == "Dublin") {
        BOUNDS = {
            lat: 53.3498,
            lng: -6.2603
        };
    } else if (result == "Mayo") {
        BOUNDS = {
            lat: 54.0153,
            lng: -9.4289
        };
    } else {
        BOUNDS = {
            lat: 54.6538,
            lng: -8.1096
        }
    }
    return BOUNDS;
}

function GetSelectedText() {
    var e = document.getElementById("select-county");
    var result = e.options[e.selectedIndex].text;

    document.getElementById("result").innerHTML = result;
}

// $(function() {
//     $('.selectpicker').selectpicker();
// });