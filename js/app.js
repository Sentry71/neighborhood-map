var model = function(data) {
  //
};

var viewModel = function() {
  var map;

  //Initialize map location, set as IIFE to kick off immediately
  var initMap = function() {
    var mapOptions = {
      center: { lat: 38.561821,
         lng: -89.898225},
      zoom: 12
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }();
};

ko.applyBindings(new viewModel());
