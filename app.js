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
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: obj,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true
  });
  let input = document.getElementById("pac-input");
  let searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener("bounds_changed", function() {
    searchBox.setBounds(map.getBounds());
  });
  let markersSB = [];
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    markersSB.forEach(function(marker) {
      marker.setMap(null);
    });
    markersSB = [];
    const bounds = new google.maps.LatLngBounds();
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

      markersSB.push(
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
  // console.log(locationsInfo);

  // let nameStation = locationsInfo.map(station => {
  //     return station.price
  // })
  let contentString =
    '<div id="content">' +
    '<h1 id="firstHeading" class="firstHeading">' +
    "ggg" +
    "</h1>" +
    '<div id="bodyContent">' +
    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    "</p>" +
    "</div>" +
    "</div>";

  let infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  // let infowindow = new google.maps.InfoWindow({
  //     content: contentString
  // });
  const icon = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  const iconGas = {
    url: "./icons/fuel(1).png",
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  let mymarker = new google.maps.Marker({
    position: obj,
    title: "Tu ubicacion",
    icon: icon
  });
  mymarker.setMap(map);

  // console.log(locationsInfo)
  let markers = locationsInfo.map(place => {
    let marker = new google.maps.Marker({
      position: place.position,
      map: map,
      icon: iconGas,
      title:
        place.price != undefined
          ? place.name + " $ " + place.price
          : place.name + " Sin precio"
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
  });
};

window.addEventListener("load", getLocations);

function noGet() {
  alert("Porfavor habilita el permiso para compartir ubicación");
}

const mapSection = document.getElementById("map-section");
const listSection = document.getElementById("list-section");
const buttonChangeSection = document.getElementById("button-change");
const mapImage = document.getElementById("map-image");
const listImage = document.getElementById("list-image");
const changeSection = () => {
  mapSection.classList.add("hidde-section");
  listSection.classList.remove("hidde-section");
  listImage.classList.add("hidde-section");
  mapImage.classList.remove("hidde-section");
};
buttonChangeSection.addEventListener("click", changeSection);
