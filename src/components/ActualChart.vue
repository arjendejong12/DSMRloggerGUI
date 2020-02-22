<template>
  <bar-chart
    v-if="!isLoading && dynamicChartData.datasets.length"
    :chartData="dynamicChartData"
    :options="dynamicChartOptions"
    ref="barChart"
  />
</template>

<script>
import { mapState } from "vuex";
import BarChart from "@/components/BarChart.vue";
import colors from "vuetify/lib/util/colors";
import mixin from "@/mixin";

export default {
  name: "actual-chart",
  components: { BarChart },
  mixins: [mixin],
  data: () => ({
    intervalTab: null,
    Labels: [],
    Delivered: [],
    Returned: [],
    Gas: [],
    Delivered2: [],
    Returned2: [],
    Gas2: [],
    DeliveredL1: [],
    DeliveredL2: [],
    DeliveredL3: [],
    data: []
  }),
  computed: {
    dynamicChartData() {
      let settingBackEDC = "red";
      let settingLineEDC = "red";
      let settingBackERC = "green";
      let settingLineERC = "green";
      let settingBackGDC = "blue";
      let settingLineGDC = "blue";
      let settingBackED2C = "tomato";
      let settingLineED2C = "tomato";
      let settingBackER2C = "lightgreen";
      let settingLineER2C = "lightgreen";
      let settingBackGD2C = "lightblue";
      let settingLineGD2C = "lightblue";
      let settingBackPR123C = "green";
      let settingLinePR123C = "black";
      let settingBackPD1C = "yellow";
      let settingLinePD1C = "black";
      let settingBackPD2C = "lightgreen";
      let settingLinePD2C = "black";
      let settingBackPD3C = "lime";
      let settingLinePD3C = "black";

      const chartdata = {
        labels: this.Labels,
        datasets: [
          {
            label: this.$t("returned_(l1_l2_l3)"),
            stack: "L123",
            data: this.Returned,
            fill: false,
            borderColor: settingLinePR123C,
            backgroundColor: settingBackPR123C,
            borderWidth: 2
          },
          {
            label: this.$t("delivered_l1"),
            stack: "L123",
            data: this.DeliveredL1,
            fill: false,
            borderColor: settingLinePD1C,
            backgroundColor: settingBackPD1C,
            borderWidth: 2
          },
          {
            label: this.$t("delivered_l2"),
            stack: "L123",
            data: this.DeliveredL2,
            fill: false,
            borderColor: settingLinePD2C,
            backgroundColor: settingBackPD2C,
            borderWidth: 2
          },
          {
            label: this.$t("delivered_l3"),
            stack: "L123",
            data: this.DeliveredL3,
            fill: false,
            borderColor: settingLinePD3C,
            backgroundColor: settingBackPD3C,
            borderWidth: 2
          }
        ]
      };

      return chartdata;
    },
    dynamicChartOptions() {
      const labelString = this.$t("kw");
      const textColor = this.$vuetify.theme.dark
        ? colors.grey.lighten4
        : colors.grey.darken4;
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: textColor
          }
        },
        tooltips: {
          mode: "index"
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: textColor
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                fontColor: textColor
              },
              scaleLabel: {
                display: true,
                fontColor: textColor,
                labelString: labelString
              }
            }
          ]
        }
      };

      return options;
    },
    ...mapState({
      isLoading: state => state.isLoading,
      actual: state => state.actual
    })
  },
  watch: {
    actual(newValue) {
      // Check if array is empty, or if previous array object is not the same as current.
      if (
        this.data.length === 0 ||
        this.data[this.data.length - 1][0].value !== newValue[0].value
      ) {
        // Remove first array item if the array contains 50 items.
        if (this.data.length === 50) {
          this.data.shift();
          this.Labels.shift();
          this.Returned.shift();
          this.DeliveredL1.shift();
          this.DeliveredL2.shift();
          this.DeliveredL3.shift();
        }

        // Process new API data.
        const labels = this.formatDate(
          "time",
          newValue.find(field => field.name === "timestamp").value
        );
        const returned = (
          newValue.find(field => field.name === "power_returned_l1").value +
          newValue.find(field => field.name === "power_returned_l2").value +
          newValue.find(field => field.name === "power_returned_l3").value
        ).toFixed(3);
        const deliveredL1 = newValue.find(
          field => field.name === "power_delivered_l1"
        ).value;
        const deliveredL2 = newValue.find(
          field => field.name === "power_delivered_l2"
        ).value;
        const deliveredL3 = newValue.find(
          field => field.name === "power_delivered_l3"
        ).value;

        // Push processed data to their respective variables.
        this.data.push(newValue);
        this.Labels.push(labels);
        this.Returned.push(-returned);
        this.DeliveredL1.push(deliveredL1);
        this.DeliveredL2.push(deliveredL2);
        this.DeliveredL3.push(deliveredL3);
      }
    }
  },
  created() {
    if (!this.$store.state.actual.length) {
      this.$store.dispatch("getActual");

      this.setAPIInterval();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setAPIInterval();
    });
  },
  beforeDestroy: function() {
    clearInterval(this.intervalTab);
  },
  methods: {
    setAPIInterval() {
      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getActual", true);
      }, 9900);
    },
    refresh: function() {
      this.clearVariables(this);
    },
    clearVariables(instance) {
      console.log("clearing...");
      instance.data = [];
      instance.Labels = [];
      instance.Delivered = [];
      instance.Returned = [];
      instance.Gas = [];
      instance.Delivered2 = [];
      instance.Returned2 = [];
      instance.Gas2 = [];
      instance.DeliveredL1 = [];
      instance.DeliveredL2 = [];
      instance.DeliveredL3 = [];
    }
  }
};
</script>
