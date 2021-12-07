import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'

export default ({ app }) => {
  Vue.use(VuetifyConfirm, {
    // vuetify,
    buttonTrueText: 'Aceptar',
    buttonFalseText: 'Cancelar',
    color: 'accent',
    icon: 'mdi-alert-box-outline',
    title: 'Atención',
    width: 350,
    property: '$confirm',
    vuetify: app.vuetify
  })
}