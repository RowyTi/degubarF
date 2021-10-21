<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :footer-props="{
      'items-per-page-options': [5, 10, 20, 30],
      'items-per-page-text': 'Filas por página'
    }"
    loading-text="Cargando...Espere por favor!"
    :loading="loading"
    class="elevation-1"
  >
   <!--  <template v-slot:[`item.acciones`]="{ item }">
      <v-btn color="primary" icon small @click="showItem(item)">
        <v-icon> mdi-eye </v-icon>
      </v-btn>
      <v-btn color="success" icon small @click="editItem(item)">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
export default {
    name: "BaseDataTable",
    props: {
        headers: {
          type: Array,
          default: () => [],
          required: true
        },
        items: {
          type: Object,
          default: () => {},
          required: true
        },
        loading: {
          type: Boolean,
          default: false
        }
    }
}
</script>

<style>

</style>