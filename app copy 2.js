const getLocations = () => {
    fetch(
            "https://cors-anywhere.herokuapp.com/https://api-gas-stations-mex.herokuapp.com/gasstations"
        )
        .then(response => response.json())
        .then(locations => {
            let locationsInfo = [];
            console.log(locations)
            locations.forEach(station => {
                let locationData = {
                    position: {
                        lat: Number(station.location.y),
                        lng: Number(station.location.x)
                    },
                    name: station.name
                        // type: station.gas_price.type,
                        // price: station.gas_price.$t
                };
                locationsInfo.push(locationData);
            });
            // setTimeout(console.log(locationData), 3000)

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
        center: obj
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
        })
        // markers.addListener('click', function() {
        //     infowindow.open(map, markers);
        // });

};

window.addEventListener("load", getLocations);

function noGet() {
    alert("Porfavor habilita el permiso para compartir ubicación");
}