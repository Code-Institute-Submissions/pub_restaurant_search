// I am getting two autocomplete options, one from default (Dublin) and the second one (the one which I switch to via county or establishment switcher)
// Need to figure out why is that? When I get the result from county, it works, however if I select from the second option (the defualt Dublin one)
// then it gives me an error for children geometry and other shit errors
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
    console.log("Number 1");
    var select_county_value = document.getElementById("select-county").value;
    var select_establishment = document.getElementById("select-establishment").value;
    if ((select_county_value != "") && (select_establishment != "")) {
        // var pyrmont = new google.maps.LatLng(countyList[0].Current_latitude, countyList[0].Current_longitude);
        var key = select_county_value.replace("value", "");
        var current_radius = countyList[0].radius;

        for (var i = 0; i < countyList.length; i++) {
            if (countyList[i].county == select_county_value) {

                current_radius = countyList[i].radius;
                pyrmont = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
                break;
            }
        }
        try {
            infowindowAutoComplete = new google.maps.InfoWindow();
            infowindowContent = document.getElementById('infowindow-content');
            infowindowAutoComplete.setContent(infowindowContent);
            console.log("OnUpdate: " + infowindowContent);
            onUpdate = true;
        } catch (err) {
            infowindowContent = document.getElementById('infowindow-content') = err.message;
        }

        google.maps.event.addDomListener(window, 'load', initialize(pyrmont, infowindowContent, onUpdate));

    }
}

function initialize(pyrmont, infowindowContent, onUpdate) {
    console.log("Number 2");
    console.log("k = " + k);
    if (k == 0) {
        // console.log("We are setting the inforwindow content style to hidden")
        document.getElementById("infowindow-content").style.visibility = "hidden";
    }
    // else {
    //     console.log("Hello again sexy");
    // }
    var select_county_value = document.getElementById("select-county").value;
    var select_establishment = document.getElementById("select-establishment").value;

    for (var i = 0; i < countyList.length; i++) {
        if (countyList[i].county == select_county_value) {
            console.log("We are in the if statement")
            current_radius = countyList[i].radius;
            BOUNDS = {
                lat: countyList[i].Current_latitude,
                lng: countyList[i].Current_longitude
            };
            console.log("Bounds: " + JSON.stringify(BOUNDS));
            break;
        }
    }

    if (pyrmont === void 0) {
        console.log("Pyrmont in initialize is empty. We are setting one based on country value: " + countyList[i])
        var pyrmont = new google.maps.LatLng(countyList[i].Current_latitude, countyList[i].Current_longitude);
    } else {
        console.log("Pyrmont is set. We can continue without setting one in initialize")
        console.log("Pyrmont: " + pyrmont)
    }
    console.log("County: " + select_county_value)

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    // Map bit
    map = new google.maps.Map(document.getElementById("map"), {
        center: pyrmont,
        zoom: 13,
    });

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var options = {
        bounds: BOUNDS,
        types: ['establishment'],
        strictBounds: true
    };

    // Autocomplete bit
    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'opening_hours', 'place_id', 'rating', 'website', 'formatted_address', 'formatted_phone_number', 'photos', 'price_level', 'reviews', 'user_ratings_total', 'vicinity']);
    autocomplete.addListener('place_changed', function() {
        console.log("Number 3");
        // InforWindow Bit
        if (onUpdate) {
            console.log("We are using infoWindow from onUpdate function: " + infowindowContent)
        } else {
            infowindowAutoComplete = new google.maps.InfoWindow();
            infowindowContent = document.getElementById('infowindow-content');
            infowindowAutoComplete.setContent(infowindowContent);
            console.log("We are using new infoWindow: " + infowindowContent);
        }

        if (k === 1) {
            console.log("Hello sexy");
            console.log("result: " + infowindowContent);
            // infowindowContent.style.visibility = "visible";
        } else {
            result = document.getElementById("infowindow-content");
            result.style.visibility = "visible";
            k++;
        }
        var place = autocomplete.getPlace();
        // console.log("Place: " + JSON.stringify(place));
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        // console.log("Place: " + JSON.stringify(place));
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });


        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
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

        console.log("Name: " + place.name);
        // console.log("Address: " + place.address);
        console.log("Vicinity: " + place.vicinity);
        // console.log("Phone: " + place.formatted_phone_number);
        // console.log("Website: " + place.website);
        // console.log("Rating: " + place.rating);
        // console.log("Ratings: " + place.user_ratings_total);
        // console.log("Price: " + place.price_level);

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        infowindowContent.children['place-vicinity'].textContent = place.vicinity;
        infowindowContent.children['place-phone'].textContent = place.formatted_phone_number;
        infowindowContent.children['place-website'].textContent = place.website;
        infowindowContent.children['place-rating'].textContent = place.rating;
        infowindowContent.children['place-user-rating-total'].textContent = place.user_ratings_total;
        infowindowContent.children['place-price-level'].textContent = place.price_level;
        infowindowAutoComplete.open(map, marker);
    });

    var request = {
        location: pyrmont,
        radius: 5000,
        types: ["establishment"]
    };

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