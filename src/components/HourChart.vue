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
  name: "hour-chart",
  components: { BarChart },
  mixins: [mixin],
  data: () => ({
    intervalTab: null,
    Labels: [],
    Delivered: [],
    Returned: [],
    Gas: [],
    data: [],
  }),
  computed: {
    dynamicChartData() {
      const chartdata = {
        labels: this.Labels,
        datasets: [
          {
            label: this.$t("returned"),
            stack: "ENERGY",
            data: this.Returned,
            fill: false,
            borderColor: "green",
            backgroundColor: "green",
            borderWidth: 2,
          },
          {
            label: this.$t("delivered"),
            stack: "ENERGY",
            data: this.Delivered,
            fill: false,
            borderColor: "red",
            backgroundColor: "red",
            borderWidth: 2,
          },
        ],
      };

      return chartdata;
    },
    dynamicChartOptions() {
      const labelString = this.$t("watt/hour");
      const textColor = this.$vuetify.theme.dark
        ? colors.grey.lighten4
        : colors.grey.darken4;
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
        tooltips: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: textColor,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: textColor,
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                fontColor: textColor,
                labelString: labelString,
              },
            },
          ],
        },
      };

      return options;
    },
    ...mapState({
      isLoading: (state) => state.isLoading,
      hours: (state) => state.hours,
    }),
  },
  watch: {
    hours(newValue) {
      const hours = this.hours
        .map((currentHour, index, array) => {
          let energy_delivered;
          let energy_returned;
          let gas_delivered;
          const prevHour = array[index + 1];

          if (index < array.length - 1) {
            energy_delivered = (
              (currentHour.edt1 +
                currentHour.edt2 -
                (prevHour.edt1 + prevHour.edt2)) *
              1000
            ).toFixed(0);
            energy_returned = (
              (currentHour.ert1 +
                currentHour.ert2 -
                (prevHour.ert1 + prevHour.ert2)) *
              1000
            ).toFixed(0);
            gas_delivered = (currentHour.gdt - prevHour.gdt).toFixed(3);
          } else {
            energy_delivered = (currentHour.edt1 + currentHour.edt2).toFixed(3);
            energy_returned = (currentHour.ert1 + currentHour.ert2).toFixed(3);
            gas_delivered = currentHour.gdt.toFixed(3);
          }

          if (this.Labels.length === 50) {
            this.data.shift();
            this.Labels.shift();
            this.Returned.shift();
            this.Delivered.shift();
          }

          if (
            this.Labels.indexOf(this.formatDate("hours", currentHour.recid)) ===
            -1
          ) {
            this.data.push(currentHour);
            this.Labels.push(this.formatDate("hours", currentHour.recid));
            this.Returned.push(-energy_returned);
            this.Delivered.push(energy_delivered);
          }

          return {
            hour: this.formatDate("hours", currentHour.recid),
            energy_delivered: energy_delivered,
            energy_returned: energy_returned,
            gas_delivered: gas_delivered,
          };
        })
        .slice(0, -1);
    },
  },
  created() {
    if (!this.$store.state.hours.length) {
      this.$store.dispatch("getHours");

      this.setAPIInterval();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setAPIInterval();
    });
  },
  beforeDestroy: function () {
    clearInterval(this.intervalTab);
  },
  methods: {
    setAPIInterval() {
      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getHours", true);
      }, 9900);
    },
    refresh: function () {
      this.clearVariables(this);
    },
    clearVariables(instance) {
      console.log("clearing...");
      instance.data = [];
      instance.Labels = [];
      instance.Delivered = [];
      instance.Returned = [];
      instance.Gas = [];
    },
  },
};
</script>
