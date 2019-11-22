const getLocations = () => {
  fetch(
    "https://cors-anywhere.herokuapp.com/https://api-gas-stations-mex.herokuapp.com/gasstations"
  )
    .then(response => response.json())
    .then(locations => {
      let locationsInfo = [];
      // console.log(locations)
      locations.forEach(station => {
        // console.log('antes del if', station);
        if (station.gas_price) {
          let locationData = {
            position: {
              lat: Number(station.location.y),
              lng: Number(station.location.x)
            },
            name: station.name,
            price: station.gas_price.$t,
            type: station.gas_price.type
          };
          locationsInfo.push(locationData);
        } else {
          let locationData = {
            position: {
              lat: Number(station.location.y),
              lng: Number(station.location.x)
            },
            name: station.name
          };
          locationsInfo.push(locationData);
        }
        // console.log('despues del if', station);
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(data => {
          let currentPosition = {
            lat: data.coords.latitude,
            lng: data.coords.longitude
          };
          initMap(currentPosition, locationsInfo);
        });
      }
    });
};

const initMap = (obj, locationsInfo) => {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: obj,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true
  });
  console.log(locationsInfo);
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener("bounds_changed", function() {
    searchBox.setBounds(map.getBounds());
  });
  let markersAC = [];
  searchBox.addListener("places_changed", function() {
    let places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach(function(markerAC) {
      marker.setMap(null);
    });
    markersAC = [];
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  // let nameStation = locationsInfo.map(station => {
  //     return station.name
  // })
  // let contentString = '<div id="content">' +
  //     '<h1 id="firstHeading" class="firstHeading">' +
  //     nameStation +
  //     '</h1>' +
  //     '<div id="bodyContent">' +
  //     '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  //     '</p>' +
  //     '</div>' +
  //     '</div>';

  // let infowindow = new google.maps.InfoWindow({
  //     content: contentString
  // });
  let icon = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  let marker = new google.maps.Marker({
    position: obj,
    title: "Tu ubicacion",
    icon: icon
  });
  marker.setMap(map);

  let markers = locationsInfo.map(place => {
    return new google.maps.Marker({
      position: place.position,
      map: map,
      title: place.name
    });
  });
  // markers.addListener('click', function() {
  //     infowindow.open(map, markers);
  // });
};

const initAutocomplete = map => {
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener("bounds_changed", function() {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  searchBox.addListener("places_changed", function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
};

window.addEventListener("load", getLocations);

function noGet() {
  alert("Porfavor habilita el permiso para compartir ubicación");
}
