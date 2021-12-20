
<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options)
  },
}
</script>

<style>
</style>