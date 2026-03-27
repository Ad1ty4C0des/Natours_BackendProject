/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

const mapEl = document.getElementById('map');
mapboxgl.accessToken = mapEl.dataset.token;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/ad1c0des/cmn9c7w34003q01qs7ym7672i',
  // center: [-118.113965, 34.104044],
  // zoom: 9,
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //extend bounds to include current locations
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
