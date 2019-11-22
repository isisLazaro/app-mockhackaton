const getLocations = () => {
    fetch(
            "https://cors-anywhere.herokuapp.com/https://api-gas-stations-mex.herokuapp.com/gasstations"
        )
        .then(response => response.json())
        .then(locations => {
            let locationsInfo = [];

            locations.forEach(station => {
                let locationData = {
                    position: {
                        lat: Number(station.location.y),
                        lng: Number(station.location.x)
                    },
                    name: station.name
                };
                locationsInfo.push(locationData);
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
        zoom: 10,
        center: obj
    });

    let marker = new google.maps.Marker({
        position: obj,
        title: "Tu ubicacion"
    });
    marker.setMap(map);

    let markers = locationsInfo.map(place => {
        return new google.maps.Marker({
            position: place.position,
            map: map,
            title: place.name
        });
    })

};

window.addEventListener("load", getLocations);

function noGet() {
    alert("Porfavor habilita el permiso para compartir ubicación");
}