<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="10">
      <v-expansion-panels v-model="panel" focusable>
        <my-store-branch />
        <my-store-location />
        <my-store-category />
        <my-store-payment />
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import MyStoreBranch from '~/components/myStore/MyStoreBranch.vue'
import MyStoreCategory from '~/components/myStore/MyStoreCategory.vue'
import MyStoreLocation from '~/components/myStore/MyStoreLocation.vue'
import MyStorePayment from '~/components/myStore/MyStorePayment.vue'
export default {
  name: 'AdministracionMiNegocio',
  components: {
    MyStoreBranch,
    MyStoreLocation,
    MyStoreCategory,
    MyStorePayment,
  },
  layout: 'admin',
  data: () => ({
    panel: 0,
  }),
  computed: {},
  mounted() {},
  methods: {},
}
</script>

