var model = {
  currentMarker: null,
  markers: [
    {
      title: 'The Butterfly House',
      lat: 38.664657,
      lng: -90.542851,
      url: 'http://www.butterflyhouse.org',
      highlight: ko.observable(false)
    },
    {
      title: 'Missouri Botanical Garden',
      lat: 38.612775,
      lng: -90.259374,
      url: 'http://www.mobot.org',
      highlight: ko.observable(false)
    },
    {
      title: 'City Museum',
      lat: 38.633314,
      lng: -90.200536,
      url: 'http://www.citymuseum.org',
      highlight: ko.observable(false)
    },
    {
      title: 'Endangered Wolf Center',
      lat: 38.526445,
      lng: -90.560390,
      url: 'http://www.endangeredwolfcenter.org',
      highlight: ko.observable(false)
    },
    {
      title: 'The Gateway Arch',
      lat: 38.624683,
      lng: -90.184781,
      url: 'http://www.gatewayarch.com',
      highlight: ko.observable(false)
    },
    {
      title: 'The Magic House',
      lat: 38.573856,
      lng: -90.405283,
      url: 'http://www.magichouse.org',
      highlight: ko.observable(false)
    },
    {
      title: 'Missouri History Museum',
      lat: 38.645217,
      lng: -90.285807,
      url: 'http://www.mohistory.org',
      highlight: ko.observable(false)
    },
    {
      title: 'St Louis Science Center',
      lat: 38.628792,
      lng: -90.270615,
      url: 'http://www.slsc.org',
      highlight: ko.observable(false)
    },
    {
      title: 'St Louis Zoo',
      lat: 38.634994,
      lng: -90.290656,
      url: 'http://www.stlzoo.org',
      highlight: ko.observable(false)
    },
    {
      title: 'World Bird Sanctuary',
      lat: 38.536396,
      lng: -90.533813,
      url: 'http://www.worldbirdsanctuary.org',
      highlight: ko.observable(false)
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
    geocoder = new google.maps.Geocoder();
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

    var infowindow = new google.maps.InfoWindow({
      content: null
    });

    function clearMarkers() {
      for(var x = 0; x < self.markerArray().length; x++){
        self.markerArray()[x].setIcon(image);
        self.markerArray()[x].setShape(shape);
        self.markerArray()[x].highlight(false);
      }
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
        title: markerList[x].title,
        url: markerList[x].url,
        highlight: markerList[x].highlight
        //animation: google.maps.Animation.BOUNCE
      });

      google.maps.event.addListener(marker, 'click', function() {
        // var name = this.title;
        // var url = this.url;
        var that = this;
        geocoder.geocode({'latLng': that.position}, function(results, status) {
          if(status == google.maps.GeocoderStatus.OK) {
            if (results[0]){
              var address = results[0].formatted_address;
              var split = address.indexOf(',');
              infowindow.setContent("<span class='title'>" + that.title
                + "</span><br>" + address.slice(0,split) + "<br>"
                + (address.slice(split+1).replace(', USA',''))
                + "<br><a href=" + that.url + ">" + that.url + "</a>");
            }
          } else {
            infowindow.setContent("<span class='title'>" + that.title
              + "</span><br>" +  "Unable to pull address at this time");
          }
        });
        infowindow.open(map, that);
        clearMarkers();

        this.setIcon(image2);
        this.setShape(shape2);
        this.highlight(true);
      });

      google.maps.event.addListener(infowindow, 'closeclick', function () {
        clearMarkers();
      });

      bounds.extend(markPos);
      map.fitBounds(bounds);

      self.markerArray.push(marker);
    }
    map.setCenter(bounds.getCenter());
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

};

ko.applyBindings(new viewModel());
