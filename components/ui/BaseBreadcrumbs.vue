<template>
  <v-sheet color="grey lighten-3 py-1 d-flex justify-end pr-9">
    <ol class="pt-1">
      <li>
        <NLink to="/db-admin/dashboard">
          <v-icon class="mb-2" color="primary">mdi-home</v-icon>
          <span class="font-weight-bold secondary--text">Dashboard</span>
        </NLink>
      </li>
      <li v-for="(crumb, index) in crumbs" :key="index">
        <NLink v-if="crumb.title !== 'dashboard'" :to="crumb.path">
          <span class="font-weight-light text-capitalize">{{
            $route.fullPath === crumb.path && title !== null
              ? title
              : crumb.title
          }}</span>
        </NLink>
      </li>
    </ol>
  </v-sheet>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  computed: {
    crumbs() {
      const fullPath = this.$route.fullPath
      const params = fullPath.startsWith('/')
        ? fullPath.substring(1).split('/')
        : fullPath.split('/')
      const crumbs = []
      let path = ''
      params.forEach((param, index) => {
        path = `${path}/${param}`
        const match = this.$router.match(path)
        // console.log(match);
        if (match.name !== null) {
          crumbs.push({
            title: param.replace(/-/g, ' '),
            ...match,
          })
        }
      })
      // console.log(crumbs);
      return crumbs
    },
  },
}
</script>
<style lang="scss" scoped>
ol {
  list-style: none;
}
li {
  display: inline;
}
li:after {
  content: ' / ';
  display: inline;
  font-size: 0.9em;
  color: #aaa;
  padding: 0 0.0725em 0 0.15em;
}
li:last-child:after {
  content: '';
}
li a {
  text-decoration: none;
}
li a.nuxt-link-exact-active.nuxt-link-active {
  color: grey;
  cursor: default;
}
</style>
