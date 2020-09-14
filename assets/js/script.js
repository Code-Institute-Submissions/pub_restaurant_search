const IRELAND_BOUNDS = {
    north: 55.33539361,
    south: 51.4266145,
    west: -10.58532715,
    east: -5.43273926
};

var infowindow;
var infowindowSwitch = false;
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
const MARKER_PATH =
    "https://developers.google.com/maps/documentation/javascript/images/marker_green";

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
    infowindow.close();
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
    console.log("Establishment")
    infowindow.close();
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

    if (geoLocation === void 0) {
        BOUNDS = {
            lat: countyList[0].Current_latitude,
            lng: countyList[0].Current_longitude
        };
        var geoLocation = new google.maps.LatLng(countyList[0].Current_latitude, countyList[0].Current_longitude);
    } else {
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
    }

    // Map bit
    map = new google.maps.Map(document.getElementById("map"), {
        center: geoLocation,
        zoom: 15,
    });

    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    var places = new google.maps.places.PlacesService(map);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    getEstablishmentKeyword = getEstablishment(select_establishment);

    var options = {
        bounds: BOUNDS,
        types: ["establishment"],
        strictBounds: true
    };

    if (!onUpdate) {
        infowindowAutoComplete = new google.maps.InfoWindow();
        infowindowContent = document.getElementById('infowindow-content');
        infowindowAutoComplete.setContent(infowindowContent);
    } else {
        console.log("Establishment info Window")
    }

    // Autocomplete bit
    autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(map, 'bounds_changed', function() {
        autocomplete.bindTo('bounds', map);
    });
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'opening_hours', 'place_id', 'rating', 'website', 'formatted_address', 'formatted_phone_number', 'photos', 'price_level', 'reviews', 'user_ratings_total', 'vicinity']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {

        infowindowAutoComplete.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();

        if (k != 1) {
            result = document.getElementById("infowindow-content");
            result.style.visibility = "visible";
            k++;
        }

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        type = [select_establishment]
        getEstablishmentKeyword = getEstablishment(select_establishment);
        if (place.geometry) {
            map.panTo(place.geometry.location);
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
        infowindowContent.children['place-address'].textContent = address;
        infowindowContent.children['place-vicinity'].textContent = place.vicinity;
        infowindowContent.children['place-phone'].textContent = place.formatted_phone_number;
        infowindowContent.children['place-website'].textContent = place.website;
        infowindowContent.children['place-rating'].textContent = place.rating;
        infowindowContent.children['place-user-rating-total'].textContent = place.user_ratings_total;
        infowindowContent.children['place-price-level'].textContent = place.price_level;
        infowindowAutoComplete.open(map, marker);
    });

    type = [select_establishment]
    getEstablishmentKeyword = getEstablishment(select_establishment);

    var request = {
        keyword: getEstablishmentKeyword,
        location: geoLocation,
        radius: 10000,
        types: type
    };

    places.nearbySearch(request, (results, status, pagination) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            if (infowindowSwitch == false) {
                infowindow = new google.maps.InfoWindow({
                    content: document.getElementById("info-content")
                });
                infowindowSwitch = true;
            }
            for (var i = 0; i < results.length; i++) {
                const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
                const markerIcon = MARKER_PATH + markerLetter + ".png";
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: markerIcon
                });

                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], "click", showInfoWindow);
                setTimeout(dropMarker(i), i * 100);
                addResult(results[i], i);
            }
        }
    });

    google.maps.event.trigger(input, 'blur');
    google.maps.event.clearInstanceListeners(input);
}



function getEstablishment(select_establishment) {
    if (select_establishment == searchTypesBar) {
        return searchTypesBar
    } else if (select_establishment == searchTypeCafe) {
        return searchTypeCafe
    } else {
        return searchTypeRestaurant
    }
}

function addMarker(location, map) {
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
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
    buildIWContent(place);
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

function addResult(result, i) {
    const results = document.getElementById("results");
    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
    const markerIcon = MARKER_PATH + markerLetter + ".png";
    const tr = document.createElement("tr");
    tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";

    tr.onclick = function() {
        google.maps.event.trigger(markers[i], "click");
    };
    const iconTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const icon = document.createElement("img");
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    const name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}

function showInfoWindow() {
    const marker = this;
    var places = new google.maps.places.PlacesService(map);
    places.getDetails({ placeId: marker.placeResult.place_id },
        (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            infowindow.open(map, marker);
            buildIWContent(place);
        }
    );
}

function dropMarker(i) {
    return function() {
        markers[i].setMap(map);
    };
}

function buildIWContent(place) {
    document.getElementById("iw-icon").innerHTML =
        '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
    document.getElementById("iw-url").innerHTML =
        '<b><a href="' + place.url + '">' + place.name + "</a></b>";
    document.getElementById("iw-address").textContent = place.vicinity;

    if (place.formatted_phone_number) {
        document.getElementById("iw-phone-row").style.display = "";
        document.getElementById("iw-phone").textContent =
            place.formatted_phone_number;
    } else {
        document.getElementById("iw-phone-row").style.display = "none";
    }
    if (place.rating) {
        let ratingHtml = "";

        for (let i = 0; i < 5; i++) {
            if (place.rating < i + 0.5) {
                ratingHtml += "&#10025;";
            } else {
                ratingHtml += "&#10029;";
            }
            document.getElementById("iw-rating-row").style.display = "";
            document.getElementById("iw-rating").innerHTML = ratingHtml;
        }
    } else {
        document.getElementById("iw-rating-row").style.display = "none";
    }
    if (place.website) {
        let website = place.website;
        document.getElementById("iw-website-row").style.display = "";
        document.getElementById("iw-website").textContent = website;
    } else {
        document.getElementById("iw-website-row").style.display = "none";
    }
}