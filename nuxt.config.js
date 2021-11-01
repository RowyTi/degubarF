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

  router: {
    middleware: ["auth"]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuelidate' },
    { src: "~/plugins/mask" },
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
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseUrl: "http://bdegubar.test/v1/",
    baseUrl: "http://localhost:8000/v1/",
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
          maxAge: 1800,
          global: true,
          required: true,
          type: "Bearer"
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
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
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.yellow.darken3,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
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
    maxChunkSize: 1000
  }
}
