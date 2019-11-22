let root = document.getElementById("map");
let gasData = []
const urlApi =
    "https://cors-anywhere.herokuapp.com/https://api-gas-stations-mex.herokuapp.com/gasstations";

navigator.geolocation.getCurrentPosition(getMap, noGet);

const fetchApi = async urlApi => {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        // console.log('data original', data);
        gasData.push(data)
        getLocation(gasData[0])
        return data;
    } catch (error) {
        return error;
    };
}
fetchApi(urlApi);

// console.log('antes de tratar', gasData)

let locationsInfo = []
const getLocation = (gasData) => {
    // alert('listo, entre')
    // console.log('despues de empujar a variable', gasData)
    gasData.forEach(station => {
        // console.log(station)
        let locationData = {
                name: station.name,
                position: {
                    lat: parseFloat(station.location.x),
                    lng: parseFloat(station.location.y)
                }
            }
            // console.log(locationData)
        locationsInfo.push(locationData)
    })
}


function noGet() {
    alert('Porfavor habilita el permiso para compartir ubicación')
}

function getMap(position) {
    // console.log('ya para mapa', locationsInfo)
    // console.log('dentro de getmap', locationsInfo)
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let latLng = new google.maps.LatLng(latitude, longitude);
    let objConfig = {
        zoom: 15,
        center: latLng
    }
    let map = new google.maps.Map(root, objConfig);
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        // animation: google.maps.Animation.BOUNCE
    });
    console.log(locationsInfo)
    markers = locationsInfo.map((location) => {
        // console.log(location.position)
        return new google.maps.Marker({
            position: location.position,
            label: location.name,
            map: map
        })
    });
};