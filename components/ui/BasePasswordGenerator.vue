<template>
  <div>
    <v-text-field
      outlined
      label="Contraseña"
      :rules="rules"
      :error-messages="errorMessages"
      append-icon="mdi-reload"
      :auto-generate="autoGenerate"
      :value="value"
      @input="updateValue($event)"
      @click:append="generate"
    />
  </div>
</template>

<script>
export default {
  name: 'BasePasswordGenerator',
  props: {
    value: {
      required: true,
    },
    size: {
      type: String,
      default: '32',
      required: true,
    },
    characters: {
      type: String,
      default: 'a-z,A-Z,0-9,#',
      required: false,
    },
    rules: {
      type: Array,
      default: () => [],
      required: false,
    },
    errorMessages: {
      type: Array,
      default: () => [],
      required: false,
    },
    autoGenerate: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data: () => ({
    //
  }),

  created() {
    if (this.autoGenerate === true) {
      this.generate()
    }
  },
  methods: {
    generate() {
      const charactersArray = this.characters.split(',')
      let CharacterSet = ''
      let password = ''

      if (charactersArray.includes('a-z') >= 0) {
        CharacterSet += 'abcdefghijklmnopqrstuvwxyz'
      }
      if (charactersArray.includes('A-Z') >= 0) {
        CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      }
      if (charactersArray.includes('0-9') >= 0) {
        CharacterSet += '0123456789'
      }
      if (charactersArray.includes('#') >= 0) {
        CharacterSet += '!%$#@|'
      }

      for (let i = 0; i < this.size; i++) {
        password += CharacterSet.charAt(
          Math.floor(Math.random() * CharacterSet.length)
        )
      }
      this.password = password
      this.$emit('input', password)
    },
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>
