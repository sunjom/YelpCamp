mapboxgl.accessToken =mapToken;

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: campgroundLoc.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

var marker = new mapboxgl.Marker()
    .setLngLat(campgroundLoc.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({offset:25})
		.setHTML(
			`<h3>${campgroundLoc.title}</h3><p>${campgroundLoc.location}</p>`
		)
	)
    .addTo(map);