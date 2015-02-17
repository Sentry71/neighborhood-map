var model = {
  currentMarker: ko.observable(null),
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
  //var map, geocoder, bounds, markerArray;

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
      model.currentMarker(null);
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
                + "<br><a href=" + that.url + ">" + that.url + "</a><br>"
                //+ "<span class='right'><img src='https://s.yimg.com/pw/images/goodies/white-flickr.png'/>"
                );
            }
          } else {
            infowindow.setContent("<span class='title'>" + that.title
              + "</span><br>" +  "Unable to pull address at this time"
              + "<br><a href=" + that.url + ">" + that.url + "</a><br>");
          }
        });
        infowindow.open(map, that);
        clearMarkers();

        that.setIcon(image2);
        that.setShape(shape2);
        that.highlight(true);

        map.panTo(that.position);
        model.currentMarker(that);
      });

      google.maps.event.addListener(infowindow, 'closeclick', function() {
        clearMarkers();
        //reset map view
        map.fitBounds(bounds);
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

  //toggle showing marker list
  self.showList = ko.observable(true);
  self.toggleList = function() {
    self.showList(!self.showList());
  };

  //get Flickr photos to match location
  self.currentPhotos = ko.observableArray();
  self.lightboxVisible = ko.observable(false);
  self.nextArrowVisible = ko.observable(true);
  self.prevArrowVisible = ko.observable(true);
  self.lightboxUrl = ko.observable();
  self.getPictures = function() {
    var marker = model.currentMarker();
    if(marker !== null) {
      var textSearch = marker.title.replace(' ','+');
      //create search url
      var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=13406652d1a1ae4996e57aa9b96cc051&text='
        + textSearch + '&license=1%2C2%2C3%2C4%2C5%2C6%2C7&content_type=1&lat=' + marker.position.lat()
        + '&lon=' + marker.position.lng() + '&radius=1&radius_units=km&per_page=10&page=1&format=json&nojsoncallback=1';

      //console.log(searchUrl);
      $.getJSON(searchUrl)
        .done(function(data) {
          parseSearchResults(data);
          self.lightboxUrl(self.currentPhotos()[0]);
          self.lightboxVisible(true);
        })
        .fail(function(jqxhr, textStatus, error) {
          console.log(textStatus + ' ' + error);
        });

      //console.log(model.currentMarker());
      //console.log("get pics " + searchUrl);
    } else {
      console.log("no location chosen");
    }
  };

  function parseSearchResults(data) {
    ko.utils.arrayForEach(data.photos.photo, function(photo) {
      var photoLink = 'https://farm' + photo.farm + '.staticflickr.com/'
        + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
      self.currentPhotos.push(photoLink);
    });
    //console.log(self.currentPhotos());
  };

  self.closeLightbox = function() {
    //console.log("index:", self.currentPhotos.indexOf(self.lightboxUrl()));
    self.currentPhotos.removeAll();
    self.lightboxVisible(false);
    self.lightboxUrl('');
  };

  self.nextPhoto = function() {
    var i = self.currentPhotos.indexOf(self.lightboxUrl());
    //console.log(i);
    if(i !== self.currentPhotos().length-1){
      self.lightboxUrl(self.currentPhotos()[i+1]);
    }else{
      self.lightboxUrl(self.currentPhotos()[0]);
    }
  };

  self.prevPhoto = function() {
    var i = self.currentPhotos.indexOf(self.lightboxUrl());
    //console.log(i);
    if(i !== 0) {
      self.lightboxUrl(self.currentPhotos()[i-1]);
    }else{
      self.lightboxUrl(self.currentPhotos()[self.currentPhotos().length-1]);
    }
  };
};

ko.applyBindings(new viewModel());
