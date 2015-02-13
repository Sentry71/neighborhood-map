var model = {
  currentMarker: null,
  markers: [
    {
      title: 'The Butterfly House',
      lat: 38.664640,
      lng: -90.542808
    },
    {
      title: 'Missouri Botanical Garden',
      lat: 38.612784,
      lng: -90.259364
    },
    {
      title: 'City Museum',
      lat: 38.633330,
      lng: -90.200525
    },
    {
      title: 'Endangered Wolf Center',
      lat: 38.526428,
      lng: -90.560422
    },
    {
      title: 'The Magic House',
      lat: 38.573845,
      lng: -90.405244
    },
    {
      title: 'Missouri History Museum',
      lat: 38.645254,
      lng: -90.285770
    },
    {
      title: 'St Louis Science Center',
      lat: 38.628936,
      lng: -90.270626
    },
    {
      title: 'St Louis Zoo',
      lat: 38.635024,
      lng: -90.290711
    },
    {
      title: 'World Bird Sanctuary',
      lat: 38.536997,
      lng: -90.533453
    }
  ]
};

var viewModel = function() {
  var map, bounds, markerArray;

  var self = this;

  //Initialize map location, set as IIFE to kick off immediately
  var initMap = function() {
    //create map
    var mapOptions = {
      disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    bounds = new google.maps.LatLngBounds();

    self.markerArray = ko.observableArray();

    //custom marker
    var image = {
      url: 'img/marker-50.png',
      size: new google.maps.Size(14, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(6, 28)
    };
    var shape = {
      coords: [1,1,13,1,13,29,1,29],
      type: 'poly'
    };

    var image2 = {
      url: 'img/mike-miriam-marker-50.png',
      size: new google.maps.Size(87, 43),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(41, 39)
    };
    var shape2 = {
      coords: [1,1,86,1,86,42,1,42],
      type: 'poly'
    };

    //add markers
    var markerList = model.markers;
    for(var x = 0; x < markerList.length; x++) {
      var markPos = new google.maps.LatLng(
        markerList[x].lat,
        markerList[x].lng
      );

      var marker = new google.maps.Marker({
        position: markPos,
        map: map,
        icon: image,
        shape: shape,
        title: markerList[x].title
        //animation: google.maps.Animation.BOUNCE
      });

      var infowindow = new google.maps.InfoWindow({
        content: null
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        infowindow.open(map, this);
        for(var x = 0; x < self.markerArray().length; x++){
          self.markerArray()[x].setIcon(image);
          self.markerArray()[x].setShape(shape);
        }
        this.setIcon(image2);
        this.setShape(shape2);
      });

      bounds.extend(markPos);
      map.fitBounds(bounds);
      map.setCenter(bounds.getCenter());

      self.markerArray.push(marker);
    }
    //console.log(self.markerArray());
  }();

  // search filter
  self.query = ko.observable('');

  self.filteredArray = ko.computed(function() {
    return ko.utils.arrayFilter(self.markerArray(), function(marker) {
      return marker.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
    });
  }, self);

  //add or remove markers when search returns
  self.filteredArray.subscribe(function() {
    var diffArray = ko.utils.compareArrays(self.markerArray(), self.filteredArray());
    ko.utils.arrayForEach(diffArray, function(marker) {
      if (marker.status === 'deleted') {
        marker.value.setMap(null);
      } else {
        marker.value.setMap(map);
      }
    });
  });



  //highlight marker if list item clicked
  self.selectItem = function(listItem) {
    google.maps.event.trigger(listItem, 'click');
  };

  //TODO: highlight list item when marker clicked


};

ko.applyBindings(new viewModel());
