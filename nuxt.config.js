import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Degubar Panel',
    title: 'Administracion',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Plataforma administrativa Degubar' },
      { name: 'format-detection', content: 'telephone=no' }
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // env: {
  //   BASE_URL: 'https://api.degubar.com.ar/v1/',
  //   BASE_IMG_URL: 'https://api.degubar.com.ar/storage/'
  // },
  env: {
    BASE_URL: process.env.BASE_URL || 'https://api.degubar.com.ar/v1/',
    BASE_IMG_URL: process.env.BASE_IMG_URL || 'https://api.degubar.com.ar/storage/'
  },
  router: {
    middleware: ["auth"]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuelidate' },
    { src: '~/plugins/confirm' },
    { src: "~/plugins/mask" },
    { src: "~/plugins/vue2-google-maps" },
    { src: "~/plugins/print" },
    { src: '~/plugins/notifications-client', ssr: false }
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/shakee93/vue-toasted
    '@nuxtjs/toast',
  ],
  toast: {
    position: 'top-right',
    duration: 5000,
    action: {
      icon: 'mdi-close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      },
    },
    iconPack: 'mdi',
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseUrl: 'https://api.degubar.com.ar/v1/',
    baseUrl: process.env.BASE_URL,
    credentials: false,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    },
  },
  auth: {
    scopeKey: 'scope',
    cookie: false,
    watchLoggedIn: true,
    redirect: {
      login: "/login",
      home: false,
      logout: "/login",
      callback: false
    },
    strategies: {
      local: {
        token: {
          property: "token",
          maxAge: 60 * 60,
          global: true,
          required: true,
          type: "Bearer"
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          // maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: "/login/staff",
            method: "post",
            propertyName: "data.token",
            headers: {
              'Accept': 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json'
            },
          },
          logout: {
            url: "/logout",
            method: "post"
          },
          user: {
            url: "/user",
            method: "get"
          },
          refresh: {
            url: "/refresh/staff",
            method: "get"
          },
          scope: true,
        }
      }
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'es'
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.amber.darken1,
          accent: colors.grey.darken3,
          secondary: colors.grey.darken2,
          info: colors.lightBlue.darken2,
          warning: colors.amber.darken2,
          error: colors.red.darken2,
          success: colors.green.darken2
        }
      }
    }
  },
  pageTransition: {
    name: "page",
    mode: "out-in"
  },
  loading: {
    name: "chasing-dots",
    color: "#00C853",
    background: "white",
    height: "4px"
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    maxChunkSize: 1000,
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
