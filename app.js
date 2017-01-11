var locationList = [{
        title: 'Infosys Limited',
        address: 'No.350, Hebbal Electronics City',
        location: {
            lat: 12.3558825,
            lng: 76.59383
        }
    },
    {
        title: 'Lalitha Mahal',
        address: 'Lalith Mahal Quatras, Mysuru',
        location: {
            lat: 12.298,
            lng: 76.693
        }
    },
    {
        title: 'Mall of Mysore',
        address: 'No.C-1, M.G. Road',
        location: {
            lat: 12.297827,
            lng: 76.664432
        }
    },
    {
        title: 'Maharajas College',
        address: '292, K.G Koppal, Chamrajpura',
        location: {
            lat: 12.305352,
            lng: 76.640606
        }
    },
    {
        title: 'Palace',
        address: 'Agrahara, Chamrajpura',
        location: {
            lat: 12.303889,
            lng: 76.654444
        }
    },
    {
        title: 'Zoo',
        address: 'Zoo Road, Indira Nagar, Ittige Gudu, Near Mysuru Mall',
        location: {
            lat: 12.302357,
            lng: 76.665307
        }
    }
];

//Model
var map;
//create the blank array for all listing markers
var markers = [];
//initialize the map
function initMap() {
    //  use a constructor to create a new map JS object.the coordinates are 12.29581, 76.639381
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(12.29581, 76.639381),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 8
    });

    //Initialize the InfoWindow
    var largeInfoWindow = new google.maps.InfoWindow();
    //Applying bounds inorder to limit the display of mainLocations on the map
    var bounds = new google.maps.LatLngBounds();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    //to create an array of markers
    for (var i = 0; i < locationList.length; i++) {
        //Get the position of the location array.
        var position = locationList[i].location;
        var title = locationList[i].title;
        var address = locationList[i].address;
        createMarker(title, location, address);
    }

    function createMarker(title, location, address) {
        //create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: position,
            title: title,
            address: address,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });

        //push the marker to our array of markers.
        markers.push(marker);
        locationList[i].marker = marker;
        Location.marker = marker;
        //create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            var self = this;
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.setAnimation(null);
            }, 2500);
            populateInfoWindow(this, largeInfoWindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
    }

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });

            //third party API wikipedia ajax request.
            var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
            $.ajax({
                url: wikiURL,
                dataType: "jsonp"
            }).done(function(response) {
                var articleStr = response[1];
                var URL = 'http://en.wikipedia.org/wiki/' + articleStr;
                infowindow.setContent('<div>' + marker.title + '</div><br><a href ="' + URL + '">' + URL + '</a>');
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
                console.log(URL);
                // error handling for jsonp requests with fail method.
            }).fail(function(jqXHR, textStatus) {
                infowindow.setContent('<h5>wikipedia data is unavailable.</h5>');
                alert("failed to load wikipedia resources");
            });
        }
    }

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }
}

//Erro handling method
window.onerror = function(msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1) {
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};

//show all markers
function markervisible() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(map);
    }
}

var Location = function(data) {
    this.title = data.title;
    this.address = data.address;
    this.location = data.location;
    this.marker = data.marker;
};

//View Model
var ViewModel = function() {
    var self = this;
    self.places = ko.observableArray();
    self.locations = ko.observableArray(locationList);
    locationList.forEach(function(match) {
        self.places.push(new Location(match));
    });
    self.filter = ko.observable('');
    // function for filtering using knockout
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            markervisible();
            return self.locations();
        } else {
            return ko.utils.arrayFilter(locationList, function(item) {
                var match = item.title.toLowerCase().indexOf(filter) === 0;
                item.marker.setVisible(match);
                return match;
            });
        }
    }, self);
    
    // To click the sidebar List
    self.openInfo = function(match) {
        google.maps.event.trigger(match.marker, 'click');
    };
};
ko.applyBindings(new ViewModel());
