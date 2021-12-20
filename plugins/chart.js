import Vue from 'vue'
import { Line } from 'vue-chartjs'

Vue.component('LineChart', {
	extends: Line,
	// eslint-disable-next-line vue/require-prop-types
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	}
})