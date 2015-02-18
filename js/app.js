/** Data model
  * Includes ten data points for the map, and two custom
  * images for the map markers.
  */
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
  ],
  image: {
    url: 'img/marker-50.png',
    size: new google.maps.Size(14, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(6, 28)
  },
  shape: {
    coords: [1,1,13,1,13,29,1,29],
    type: 'poly'
  },
  image2: {
    url: 'img/mike-miriam-marker-50.png',
    size: new google.maps.Size(87, 43),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(41, 39)
  },
  shape2: {
    coords: [1,1,86,1,86,42,1,42],
    type: 'poly'
  }
};

var viewModel = function() {
  var map, geocoder, bounds, infowindow;
  var self = this;

  /** Initialize map.
    * Function is set as IIFE to kick off immediately.
    */
  var initMap = function() {
    //create map
    var mapOptions = {
      disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow({
      content: null
    });

    /** Add markers to map from the data model.
      */
    self.markerArray = ko.observableArray();
    var markerList = model.markers;
    for(var x = 0; x < markerList.length; x++) {
      var markPos = new google.maps.LatLng(
        markerList[x].lat,
        markerList[x].lng
      );

      // Create marker objects
      var marker = new google.maps.Marker({
        position: markPos,
        map: map,
        icon: model.image,
        shape: model.shape,
        title: markerList[x].title,
        url: markerList[x].url,
        highlight: markerList[x].highlight
      });

      /** Add click event listener to create infowindow for each marker object.
        * Use Google geocoder to pull physical address from lat/lng position data.
        * If valid data returned, set infowindow with formatted address. If not,
        * use default "unable to pull address" message.
        */
      google.maps.event.addListener(marker, 'click', function() {
        var that = this;
        geocoder.geocode({'latLng': that.position}, function(results, status) {
          if(status == google.maps.GeocoderStatus.OK) {
            if (results[0]){
              var address = results[0].formatted_address;
              var split = address.indexOf(',');
              infowindow.setContent("<span class='title'>" + that.title +
                "</span><br>" + address.slice(0,split) + "<br>" +
                (address.slice(split+1).replace(', USA','')) +
                "<br><a href=" + that.url + ">" + that.url + "</a><br>");
            }
          } else {
            infowindow.setContent("<span class='title'>" + that.title +
              "</span><br><<Unable to pull address at this time>><br><a href=" +
              that.url + ">" + that.url + "</a><br>");
          }
        });
        infowindow.open(map, that);
        clearMarkers();

        // Modify marker (and list) to show selected status.
        that.setIcon(model.image2);
        that.setShape(model.shape2);
        that.highlight(true);

        // Move map viewport to center selected item
        map.panTo(that.position);
        model.currentMarker(that);
      });

      /** Add click event for closing infowindow with X in top right of box.
        * This function will clear any selected markers, and reset the map to
        * show all markers on the map.
        */
      google.maps.event.addListener(infowindow, 'closeclick', function() {
        clearMarkers();
        map.fitBounds(bounds);
      });

      // Modify map viewport to include new map marker
      bounds.extend(markPos);

      //Add marker to array
      self.markerArray.push(marker);
    }
    //Resize map to fit all markers, then center map
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
  }();

  /** Function used to reset all markers to default image, clears color
    * highlight from the list of locations, and resets the currentMarker variable.
    */
  function clearMarkers() {
    for(var x = 0; x < self.markerArray().length; x++){
      self.markerArray()[x].setIcon(model.image);
      self.markerArray()[x].setShape(model.shape);
      self.markerArray()[x].highlight(false);
    }
    model.currentMarker(null);
  }

  /** Knockout computed observable will filter and return items that match
    * the query string input by the user. This list will be used to update the
    * list of locations shown.
    */
  self.query = ko.observable('');
  self.filteredArray = ko.computed(function() {
    return ko.utils.arrayFilter(self.markerArray(), function(marker) {
      return marker.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
    });
  }, self);

  /** Subscribing to the filteredArray changes will allow for showing or hiding
    * the associated markers on the map itself.
    */
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

  //Highlight map marker if list item is clicked.
  self.selectItem = function(listItem) {
    google.maps.event.trigger(listItem, 'click');
  };

  //Toggle showing marker list when up/down arrow above list is clicked.
  self.showList = ko.observable(true);
  self.toggleList = function() {
    self.showList(!self.showList());
  };

  //Set lightbox parameters
  self.currentPhotos = ko.observableArray();
  self.lightboxVisible = ko.observable(false);
  self.nextArrowVisible = ko.observable(true);
  self.prevArrowVisible = ko.observable(true);
  self.lightboxUrl = ko.observable();

  // Get Flickr photos to match location of selected marker.
  self.getPictures = function() {
    var marker = model.currentMarker();
    if(marker !== null) {
      var textSearch = marker.title.replace(' ','+');

      /** Create search URL using marker title as text search, and marker position
        * for lat/lng geolocation match of photos within 1 km of position. Returns
        * up to 15 photos that match criteria.
        */
      var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
        '&api_key=13406652d1a1ae4996e57aa9b96cc051&text=' + textSearch +
        '&license=1%2C2%2C3%2C4%2C5%2C6%2C7&content_type=1&lat=' + marker.position.lat() +
        '&lon=' + marker.position.lng() + '&radius=1&radius_units=km&per_page=15&page=1' +
        '&format=json&nojsoncallback=1';

      /** Use async call to get flickr photo data in JSON format. If successful, call
        * function to parse results, then display first photo. If failed, alert user.
        */
      $.getJSON(searchUrl)
        .done(function(data) {
          parseSearchResults(data);
          self.lightboxUrl(self.currentPhotos()[0]);
          self.lightboxVisible(true);
        })
        .fail(function(jqxhr, textStatus, error) {
          alert("Unable to get photos from Flickr at this time.");
        });
    } else {
      // If no marker chosen when trying to retrieve photos, alert user.
      alert("Choose a location before trying to view photos.");
    }
  };

  /** Take data from flickr JSON call, and form valid JPG links to show photos
    * when the user clicks on the flickr button at the bottom of the web page.
    */
  function parseSearchResults(data) {
    ko.utils.arrayForEach(data.photos.photo, function(photo) {
      var photoLink = 'https://farm' + photo.farm + '.staticflickr.com/'
        + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
      self.currentPhotos.push(photoLink);
    });
  }

  /** Close the lightbox and clear the currentPhotos array when the 'x' above
    * the photo is clicked.
    */
  self.closeLightbox = function() {
    self.currentPhotos.removeAll();
    self.lightboxVisible(false);
    self.lightboxUrl('');
  };

  /** Choose the next photo in the currentPhotos array to be displayed when the
    * right arrow is clicked. If at the end of the currentPhotos array, the
    * following photo will loop to the start of the array
    */
  self.nextPhoto = function() {
    var i = self.currentPhotos.indexOf(self.lightboxUrl());
    if(i !== self.currentPhotos().length-1){
      self.lightboxUrl(self.currentPhotos()[i+1]);
    }else{
      self.lightboxUrl(self.currentPhotos()[0]);
    }
  };

  /** Choose the previous photo in the currentPhotos array, to be displayed when
    * the left arrow is clicked. If at the beginning of the currentPhotos array,
    * the new photo will loop to the end of the array
    */
  self.prevPhoto = function() {
    var i = self.currentPhotos.indexOf(self.lightboxUrl());
    if(i !== 0) {
      self.lightboxUrl(self.currentPhotos()[i-1]);
    }else{
      self.lightboxUrl(self.currentPhotos()[self.currentPhotos().length-1]);
    }
  };
};

ko.applyBindings(new viewModel());
