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
let popup, Popup;
var k = 0;
var input;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var searchTypesBar = 'bar'
var searchTypeCafe = 'cafe'
var searchTypeRestaurant = 'restaurant'

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

function updateCounty() {
    var select_county_value = document.getElementById("select-county").value;
    if (select_county_value != "") {

        for (var i = 0; i < countyList.length; i++) {
            if (countyList[i].county == select_county_value) {

                current_radius = countyList[i].radius;
                geoLocation = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
                break;
            }
        }

        try {
            infowindowAutoComplete = new google.maps.InfoWindow();
            infowindowContent = document.getElementById('infowindow-content');
            infowindowAutoComplete.setContent(infowindowContent);
            onUpdate = true;
        } catch (err) {
            console.log("ERROR: " + err.message);
        }

        google.maps.event.addDomListener(window, 'load', initialize(geoLocation, infowindowContent, onUpdate));

    }
}

function updateEstablishment() {
    var select_establishment = document.getElementById("select-establishment").value;
    if (select_establishment != "") {
        var select_county_value = document.getElementById("select-county").value;
        for (var i = 0; i < countyList.length; i++) {
            if (countyList[i].county == select_county_value) {

                current_radius = countyList[i].radius;
                geoLocation = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
                break;
            }
        }

        try {
            infowindowAutoComplete = new google.maps.InfoWindow();
            infowindowContent = document.getElementById('infowindow-content');
            infowindowAutoComplete.setContent(infowindowContent);
            onUpdate = true;
        } catch (err) {
            console.log("ERROR: " + err.message);
        }

        google.maps.event.addDomListener(window, 'load', initialize(geoLocation, infowindowContent, onUpdate));

    }
}

function initialize(geoLocation, infowindowContent, onUpdate) {
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    if (k == 0) {
        document.getElementById("infowindow-content").style.visibility = "hidden";
    }

    var select_county_value = document.getElementById("select-county").value;
    var select_establishment = document.getElementById("select-establishment").value;

    for (var i = 0; i < countyList.length; i++) {
        if (countyList[i].county == select_county_value) {
            current_radius = countyList[i].radius;
            BOUNDS = {
                lat: countyList[i].Current_latitude,
                lng: countyList[i].Current_longitude
            };
            break;
        }
    }

    if (geoLocation === void 0) {
        var geoLocation = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
    }

    // Map bit
    map = new google.maps.Map(document.getElementById("map"), {
        center: geoLocation,
        zoom: 13,
    });

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    getEstablishmentKeyword = getEstablishment(select_establishment);

    var options = {
        bounds: BOUNDS,
        types: ['establishment'],
        strictBounds: true
    };

    if (!onUpdate) {
        infowindowAutoComplete = new google.maps.InfoWindow();
        infowindowContent = document.getElementById('infowindow-content');
        infowindowAutoComplete.setContent(infowindowContent);
    }

    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    // Autocomplete bit
    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'opening_hours', 'place_id', 'rating', 'website', 'formatted_address', 'formatted_phone_number', 'photos', 'price_level', 'reviews', 'user_ratings_total', 'vicinity']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {

        infowindowAutoComplete.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        var select_county_value = document.getElementById("select-county").value;

        if (k != 1) {
            result = document.getElementById("infowindow-content");
            result.style.visibility = "visible";
            k++;
        }

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setZoom(17);
        } else {
            map.setCenter(place.geometry.location);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(false);

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
        // infowindowContent.children['place-address'].textContent = address;
        // infowindowContent.children['place-vicinity'].textContent = place.vicinity;
        infowindowContent.children['place-phone'].textContent = place.formatted_phone_number;
        // infowindowContent.children['place-website'].textContent = place.website;
        // infowindowContent.children['place-rating'].textContent = place.rating;
        // infowindowContent.children['place-user-rating-total'].textContent = place.user_ratings_total;
        // infowindowContent.children['place-price-level'].textContent = place.price_level;
        infowindowAutoComplete.open(map, marker);
    });

    google.maps.event.trigger(input, 'blur');
    google.maps.event.clearInstanceListeners(input);

    type = [select_establishment]
    getEstablishmentKeyword = getEstablishment(select_establishment);

    var request = {
        keyword: getEstablishmentKeyword,
        location: geoLocation,
        radius: 10000,
        types: type
    };

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
    });

    addMarker(geoLocation, map);
}

function getEstablishment(select_establishment) {
    if (select_establishment == searchTypesBar) {
        console.log("We are searching for Pubs")
        return searchTypesBar
    } else if (select_establishment == searchTypeCafe) {
        console.log("We are searching for Cafes")
        return searchTypeCafe
    } else {
        console.log("We are searching for restaurnats")
        return searchTypeRestaurant
    }
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();

        for (var i = 0; i < results.length; i++) {
            if (results[i].name.indexOf("Hotel") != -1) {
                console.log("Marker Includes Hotel in its name: " + JSON.stringify(results[i].name));
            } else {
                createMarker(results[i]);
            }
        }
    }
}


function createMarker(place) {
    const bounds = new google.maps.LatLngBounds();
    var placeLoc = place.geometry.location;
    const image = {
        url: place.icon,
        size: new google.maps.Size(75, 75),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };
    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        icon: image,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
    });
    bounds.extend(place.geometry.location);

    marker.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function drop() {
    for (var i = 0; i < markerArray.length; i++) {
        setTimeout(function() {
            addMarkerMethod();
        }, i * 200);
    }
}

function clearResults() {
    const results = document.getElementById("results");

    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}