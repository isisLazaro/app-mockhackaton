let root = document.getElementById("map");
//Crear funcion y promesa que obtenga la geolocalizacion del usuario por medio de Api Geolocation y
//  la muestre en un mapa dinamico de Google Maps por medio de Api MapsJAvascript

navigator.geolocation.getCurrentPosition(getMap, noGet);

function noGet() {
    alert('Porfavor habilita el permiso para compartir ubicación')
}

function getMap(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let latLng = new google.maps.LatLng(latitude, longitude);
    let objConfig = {
        zoom: 19,
        center: latLng
    }
    let map = new google.maps.Map(root, objConfig);
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Estás Aquí',
        // animation: google.maps.Animation.BOUNCE
    });

};