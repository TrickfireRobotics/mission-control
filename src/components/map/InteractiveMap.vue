<script lang="ts" setup>
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import { shallowRef, onMounted, markRaw } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const mapContainer = shallowRef<HTMLElement | null>(null);
const map = shallowRef<Map | null>(null);
onMounted(() => {
  config.apiKey = 'Q7DDIQDDZYYErXyqd3qb';

  // Set initial coordinates to a point in the Utah Desert
  const initialState = { lng: -111.950684, lat: 39.41922, zoom: 14 };

  map.value = markRaw(
    new Map({
      container: mapContainer.value as HTMLElement,
      style: MapStyle.SATELLITE,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    }),
  );
});

/**
 * Adds a pin to the map at the specified coordinates.
 *
 * @param lat - The latitude of the pin location.
 * @param lng - The longitude of the pin location.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addPin(lat: number, lng: number): void {
  if (map.value) {
    const timestamp = new Date().toISOString();
    const popupContent = `Latitude: ${lat}<br>Longitude: ${lng}<br>Timestamp: ${timestamp}`;

    const popup = new Popup().setHTML(popupContent);

    new Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map.value);
  }
}
</script>

<template>
  <div id="map" ref="mapContainer"></div>
</template>
