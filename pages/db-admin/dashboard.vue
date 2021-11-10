<template>
  <v-row>
    <v-col cols="6">
      <h1>Autocomplete</h1>

      <label>
        AutoComplete
        <gmap-autocomplete
          placeholder="This is a placeholder text"
          :options="{
            fields: ['geometry', 'formatted_address', 'address_components'],
          }"
          @place_changed="setPlace"
        >
        </gmap-autocomplete>
        <button @click="usePlace">Add</button>
      </label>
      <br />

      <Gmap-Map
        style="width: 100%; height: 300px"
        :zoom="15"
        :center="{ lat: LatLng.lat, lng: LatLng.lng }"
        :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: false,
        }"
      >
        <!-- :center="{ lat: -34.5838464, lng: -58.4357956 }" -->
        <Gmap-Marker
          v-for="(marker, index) in markers"
          :key="index"
          :position="marker.position"
        ></Gmap-Marker>
        <Gmap-Marker
          v-if="place"
          label="la marca"
          :position="{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }"
        ></Gmap-Marker>
      </Gmap-Map>
    </v-col>
    <v-col cols="6">
      {{ LatLng }}
      <pre>

      {{ place }}
     </pre
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    markers: [],
    place: null,
    position: {
      lat: null,
      lng: null,
    },
  }),
  computed: {
    LatLng: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.position.lat =
          this.place !== null ? this.place.geometry.location.lat() : -34.5838464
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.position.lng =
          this.place !== null ? this.place.geometry.location.lng() : -58.4357956
        return this.position
      },
      set(value) {
        this.position.lat = value
      },
    },
  },
  methods: {
    setDescription(description) {
      this.description = description
    },
    setPlace(place) {
      this.place = place
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          },
        })
        this.place = null
      }
    },
  },
}
</script>

<style>
</style>