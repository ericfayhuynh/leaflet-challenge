// Creating map object
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(myMap);
  
  // Assemble API query URL
  var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Grab the data with d3
  d3.json(earthquakeUrl).then(function(data) {
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    L.geoJSON(data.features, {
      // Turn each feature into a circleMarker on the map
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      // Create popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place +
          "</h3><hr><p>Date & Time: " + new Date(feature.properties.time) +
          "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
          "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
      }
    }).addTo(myMap);
  
    // Set up the legend and the color function for the depth of the earthquakes
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [-10, 10, 30, 50, 70, 90];
      var colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];
      var labels = [];
    
      // Add min & max
      var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + " km</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + " km</div>" +
        "</div>";
    
      div.innerHTML = legendInfo;
    
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + ' km<br>' : '+ km');
      }
    
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  });
  
  // Define a markerSize function that will give each city a different radius based on its population
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  