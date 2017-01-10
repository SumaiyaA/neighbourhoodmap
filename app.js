//Model
var locationList = [{
        title: 'Infosys Limited',
        address: 'No.350, Hebbal Electronics City',
        location: {
            lat: 12.3558825,
            lng: 76.59383
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
    },
    {
        title: 'City Bus Stand',
        address: '1201, New kantharaj Urs Rd, Siddhartha Nagar, Chamarajpuram Mohalla, Lakshmipuram',
        location: {
            lat: 12.29581,
            lng: 76.639381
        }
    },
    {
        title: 'Sand Sculpture Museum',
        address: 'Mysore, KC layout',
        location: {
            lat: 12.295005,
            lng: 76.682179
        }
    },
    {
        title: 'Tipu Sultan Park',
        address: '2nd Stage, Rajiv Nagar, Mysuru',
        location: {
            lat: 12.339654,
            lng: 76.683029
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
            animation: google.maps.Animation.BOUNCE,
            id: i
        });

        //push the marker to our array of markers.
        markers.push(marker);
        locationList[i].marker = marker;
        Location.marker = marker;
        //create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
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

    }
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.marker = marker;
            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    }

    //This function will loop through the markers array and display them all.
    function showListings() {
        // //Applying bounds inorder to limit the display of mainLocations on the map
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            //extend the boundaries of the map for each marker.
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function hideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
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

//show all markers
function markervisible() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(map);
    }
}

var Location = function(data) {
    this.title = ko.observable(data.title);
    this.address = ko.observable(data.address);
    this.location = ko.observable(data.location);
    this.marker = ko.observable(data.marker);
};

//View Model
var ViewModel = function() {
    var self = this;
    this.filter = ko.observable('');
    self.locations = ko.observableArray([]);
    locationList.forEach(function(location) {
        self.locations.push(new Location(location));
    });
    // function for filtering using knockout
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            markervisible();
            return self.locations();
        } else {
            return ko.utils.arrayFilter(locationList, function(item) {
                if (item.title.toLowerCase().indexOf(filter) === 0) {
                    item.marker.setVisible(true);
                    return true;
                } else {
                    item.marker.setVisible(false);
                    return false;
                }
            });
        }
    });

    self.openInfo = function(locationList) {
          google.maps.event.trigger(Location.marker, 'click');
        };


    self.articleList = ko.observableArray([]);

    function article(content, url) {
        var self = this;
        self.content = content;
        self.url = url;
    }
    wikiFill = function(wikiTitle) {
        self.articleList([]);
        wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
        var wikiRequestTimeout = setTimeout(function() {
            alert("failed to get Wikipedia resources");
        }, 8000);

        $.ajax({
            url: wikiURL,
            dataType: "jsonp",
            success: function(response) {
                self.articleList('');
                var articleList = response[1];
                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    self.articleList.push(new article(articleStr, url));
                }
                clearTimeout(wikiRequestTimeout);
            }
        });
    };
};
ko.applyBindings(new ViewModel());
