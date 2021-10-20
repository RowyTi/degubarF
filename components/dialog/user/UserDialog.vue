<template>
    <v-dialog
        v-bind="$attrs"
        max-width="800"
        persistent
        scrollable
        v-on="$listeners"
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
            <v-form>
                 <v-container fluid class="mt-0 pt-0">
            <v-row>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field
                  v-model="formu.name"
                  outlined
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field
                  v-model="formu.email"
                  outlined
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
            </v-form>
            <user-form-dialog />
            {{formu}}
            {{editedIndex}}
            {{showMode}}
            
        </template>
        </base-card>
    </v-dialog>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import UserFormDialog from './form/UserFormDialog.vue';
import BaseCard from '~/components/ui/BaseCard.vue';
export default {
    name: 'UserDialog',
    components: { BaseCard, UserFormDialog },
    props: {
        form: {
            type: Object,
            default: () => {},
            required: true
        },
        editedIndex: {
            type: Number,
            default: -1,
            required: false
        },
        showMode: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data: () => ({
    }),
    validations: {
        data: {
            name: {
                required
            },
        email: {
            required,
            email
        },
        }
    },
    computed: {
        formu:{
          get(){
              return this.form
          },
        }
    },
    methods: {
        close() {
            this.$v.$reset();
            this.$emit("closeDialog");
        },
    }
}
</script>

<style>

</style>