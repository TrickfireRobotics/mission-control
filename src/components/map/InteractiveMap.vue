<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px); // calculate height of the screen minus the heading
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts" setup>
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
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

onUnmounted(() => {
  map.value?.remove();
});

function addPin(lat: number, lng: number): void {
  if (map.value) {
    const timestamp = new Date().toISOString();
    const popupContent = `Latitude: ${lat}<br>Longitude: ${lng}<br>Timestamp: ${timestamp}`;

    const popup = new Popup().setHTML(popupContent);

    new Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map.value);
  }
}
</script>
