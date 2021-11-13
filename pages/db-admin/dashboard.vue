<template>
  <v-row>
    <v-col cols="6">
      <!-- <vuetify-google-autocomplete
        id="map"
        ref="address"
        prepend-icon="mdi-map-marker"
        clearable
        label="Dirección"
        classname="form-control"
        hint="Seleccionar la dirección cuando aparezca"
        country="ar"
        @placechanged="getAddressData"
      /> -->

      <!-- 
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
      </Gmap-Map> -->
    </v-col>
    <v-col cols="6">
      <!-- {{ address }} -->
    </v-col>
  </v-row>
</template>

<script>
export default {
  // :center="{ lat: -34.5838464, lng: -58.4357956 }"
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    //
  }),

  methods: {
    //
  },
}
</script>