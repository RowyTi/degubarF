<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="10">
      <v-expansion-panels v-model="panel" focusable>
        <my-store-branch />
        <my-store-location :address="address" />
        <my-store-category />
        <my-store-payment />
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import MyStoreBranch from '~/components/forms/MyStoreBranch.vue'
import MyStoreCategory from '~/components/forms/MyStoreCategory.vue'
import MyStoreLocation from '~/components/forms/MyStoreLocation.vue'
import MyStorePayment from '~/components/forms/MyStorePayment.vue'
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
  computed: {
    ...mapState('administracion/myStore', ['paymentKey', 'address']),
  },
  mounted() {
    this.getPaymentKey()
    this.getAddress()
  },
  methods: {
    async getPaymentKey() {
      try {
        await this.$store.dispatch(
          'administracion/myStore/getPaymentKeys',
          this.$auth.user.branch.id
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al cargar el método de pago')
          this.$toast.error('Ocurrio un problema al cargar el método de pago')
        }
      }
    },
    async getAddress() {
      try {
        await this.$store.dispatch(
          'administracion/myStore/getAddress',
          this.$auth.user.branch.id
        )
      } catch (error) {
        if (error.response.status === 403) this.$toast.global.e403()
        this.$toast.global.e500()
      }
    },
  },
}
</script>

