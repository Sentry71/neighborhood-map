var model = function(data) {
  var mapOptions = {
    center: { lat: ko.observable(data.lat),
       lng: ko.observable(data.lng)},
    zoom: ko.observable(data.zoom)
  };
};

var viewModel = function() {
  this.currentMarker = ko.observable(new model({
      lat: 38.561821,
      lng: -89.898225,
      zoom: 12
    })
  )
};

var view = {
  init : function() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), model.mapOptions);

    google.maps.event.addDomListener(window, 'load', initialize);
  };
};

ko.applyBindings(view.init());
