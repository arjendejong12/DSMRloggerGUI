<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ["options"],
  watch: {
    options(newValue) {
      this.$data._chart.options = {
        ...this.$data._chart.options,
        ...this.options
      };
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
