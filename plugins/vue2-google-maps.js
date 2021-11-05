import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDr4VUYyi0XVEmPrBjTzT35EvbL8XIasHU",
    libraries: "places"
  }
});
