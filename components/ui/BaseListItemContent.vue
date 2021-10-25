<template>
  <!-- <v-list two-line subheader> -->
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="text-overline" v-text="title" />
      <v-list-item-subtitle class="text-capitalize" v-text="subtitle" />
    </v-list-item-content>
    <v-list-item-avatar v-show="avatar">
      <v-img :alt="alt" :src="avatarLink"></v-img>
    </v-list-item-avatar>
  </v-list-item>
  <!-- </v-list> -->
</template>

<script>
export default {
  name: 'BaseListItemContent',
  props: {
    title: {
      type: String,
      default: 'titulo',
      require: true,
    },
    subtitle: {
      type: String,
      default: 'subtitulo',
      require: true,
    },
    avatar: {
      type: Boolean,
      default: false,
      require: false,
    },
    avatarLink: {
      type: String,
      default: 'imagen',
      require: false,
    },
    alt: {
      type: String,
      default: 'alt imagen',
      require: false,
    },
  },
}
</script>

<style>
</style>