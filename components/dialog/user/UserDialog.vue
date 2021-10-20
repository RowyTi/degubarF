<template>
    <v-dialog
        v-bind="$attrs"
        v-on="$listeners"
        max-width="800"
        persistent
        scrollable
    >
        <base-card
            :dialog="true"
        > 
        <template #rightToolbar />
        <template #leftToolbar>
            <v-btn icon color="white" @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
        <template #body>
            <user-form-dialog />
        </template>
        </base-card>
    </v-dialog>
</template>

<script>
import UserFormDialog from './form/UserFormDialog.vue';
import BaseCard from '~/components/ui/BaseCard.vue';
export default {
  components: { BaseCard, UserFormDialog },
    name: 'UserDialog',
    methods: {
        close() {
            // this.$v.$reset();
            this.$emit("closeDialog");
        },
    }
}
</script>

<style>

</style>