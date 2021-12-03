<template>
  <div id="printMe" class="d-none">
    <div class="flex flex-row flex-wrap justify-center">
      <div v-for="table in qr" :key="table.id" class="m-2">
        <div class="w-48 border-double border-4 pa-1 rounded overflow-hidden">
          <img
            class="object-contain h-48 w-full"
            :src="imgUrl + table.qr"
            :alt="table.name"
          />
          <!-- <div class="px-6 py-4">
            <div class="font-bold text-2xl mb-2">{{ table.name }}</div>
          </div> -->
        </div>
        <p class="font-bold text-xs">{{ table.name }}</p>
        <p class="font-thin text-xs">Recortá la imagen sobre el borde</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePrint',
  props: {
    qr: {
      type: Array,
      default: () => [],
      require: true,
    },
  },
  computed: {
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
  },
  methods: {
    print() {
      this.$emit('print')
    },
  },
}
</script>

<style>
</style>