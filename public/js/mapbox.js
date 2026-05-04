/* eslint-disable */

export const displayMap = (locations) => {
  const LIGHT_STYLE = 'mapbox://styles/ad1c0des/cmn9c7w34003q01qs7ym7672i';
  const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';

  const isDark = () => document.documentElement.classList.contains('dark');

  const map = new mapboxgl.Map({
    container: 'map',
    style: isDark() ? DARK_STYLE : LIGHT_STYLE,
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  const markers = [];

  function addMarkers() {
    // Clear existing markers
    markers.forEach((m) => m.remove());
    markers.length = 0;

    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'marker';

      const popup = new mapboxgl.Popup({
        offset: 36,
        closeButton: false,
        closeOnClick: false,
        className: 'natours-popup',
      }).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('mouseenter', () => {
        if (!marker.getPopup().isOpen()) marker.togglePopup();
      });
      el.addEventListener('mouseleave', () => {
        if (marker.getPopup().isOpen()) marker.togglePopup();
      });

      markers.push(marker);
      bounds.extend(loc.coordinates);
    });
  }

  // Initial markers
  map.on('load', () => {
    addMarkers();
    map.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 100, right: 100 },
    });
  });

  // Watch for dark mode toggle and swap map style
  const observer = new MutationObserver(() => {
    const newStyle = isDark() ? DARK_STYLE : LIGHT_STYLE;
    map.setStyle(newStyle);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Re-add markers after style swap (setStyle removes all layers)
  map.on('style.load', () => {
    addMarkers();
  });
};
