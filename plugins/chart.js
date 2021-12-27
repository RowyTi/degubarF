import Vue from 'vue'
import { Bar } from 'vue-chartjs'

Vue.component('MyChart', {
	extends: Bar,
	// eslint-disable-next-line vue/require-prop-types
	props: ['data', 'options'],
	mounted() {
		this.renderChart(this.data, this.options)
	}
})