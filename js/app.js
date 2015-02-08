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
    // {
    //   title: 'Meramec Caverns',
    //   lat: 38.245292,
    //   lng: -91.090536
    // },
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
  var map, bounds;

  //Initialize map location, set as IIFE to kick off immediately
  var initMap = function() {
    //create map
    var mapOptions = {
      disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    bounds = new google.maps.LatLngBounds();

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
        title: markerList[x].title,
        animation: google.maps.Animation.DROP
      });

      var infowindow = new google.maps.InfoWindow({
        content: null
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title)
        infowindow.open(map, this);
      });

      bounds.extend(markPos);
      map.fitBounds(bounds);
      map.setCenter(bounds.getCenter());
    }
  }();

  //initMap();
};

ko.applyBindings(new viewModel());
