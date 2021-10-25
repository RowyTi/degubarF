<template>
  <v-card
    :color="colorCard"
    class="mx-auto"
    width="100%"
    :class="!dialog ? 'borderCard' : ''"
  >
    <v-toolbar v-if="dialog" :color="colorToolbar" dark>
      <v-toolbar-title
        class="font-weight-bold text-uppercase"
        v-text="titleToolbar"
      >
        <slot name="rightToolbar" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="leftToolbar" />
    </v-toolbar>

    <v-card-title v-else>
      <slot name="rightCardTitle"></slot>
      <v-spacer></v-spacer>
      <slot name="leftCardTitle"></slot>
    </v-card-title>
    <!-- slot default para cualquier otro componente -->
    <slot></slot>
    <v-card-text class="pa-0">
      <slot name="body"></slot>
    </v-card-text>
    <v-divider v-show="sectionActions" />
    <v-card-actions v-show="sectionActions">
      <v-spacer></v-spacer>
      <slot name="actions"> </slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true,
    },
    colorCard: {
      type: String,
      default: '',
      required: false,
    },
    colorToolbar: {
      type: String,
      default: 'primary',
      required: false,
    },
    titleToolbar: {
      type: String,
      default: 'title',
      required: false,
    },
    sectionActions: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  methods: {
    //
  },
}
</script>

<style scoped>
.borderCard {
  border-top: solid #f9a825 5px;
}
</style>
