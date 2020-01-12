<template>
  <div class="charts">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("charts") }}</h1>
          <refresh-button dispatch="getActual"></refresh-button>
        </v-col>
        <v-col cols="12" sm="12">
          <v-card class="mb-4" elevation="4" :loading="isLoading">
            <v-card-text>
              <v-row wrap>
                <v-col cols="12" sm="12" lg="6" class="py-2">
                  <p>{{ $t("data") }}</p>
                  <v-btn-toggle
                    v-model="chart"
                    mandatory
                    class="flex-column flex-sm-row"
                  >
                    <v-btn value="actual">
                      {{ $t("actual") }}
                      <v-icon small right>mdi-clock-outline</v-icon>
                    </v-btn>
                    <v-btn value="financial">
                      {{ $t("financial") }}
                      <v-icon small right>mdi-currency-eur</v-icon>
                    </v-btn>
                    <v-btn value="day">
                      {{ $t("day") }}
                      <v-icon small right>mdi-calendar-today</v-icon>
                    </v-btn>
                    <v-btn value="week">
                      {{ $t("week") }}
                      <v-icon small right>mdi-calendar-month</v-icon>
                    </v-btn>
                    <v-btn value="year">
                      {{ $t("year") }}
                      <v-icon small right>mdi-calendar-multiple</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="12" lg="6" class="py-2">
                  <p>{{ $t("type") }}</p>
                  <v-btn-toggle v-model="chartType" mandatory>
                    <v-btn value="bar">
                      {{ $t("bar") }}
                      <v-icon small right>mdi-chart-bar</v-icon>
                    </v-btn>
                    <v-btn value="line">
                      {{ $t("line") }}
                      <v-icon small right>mdi-chart-line</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col cols="12" sm="12" class="py-2">
                  <line-chart
                    v-if="
                      !isLoading &&
                        chartType === 'line' &&
                        dynamicChartData.datasets.length
                    "
                    :chartData="dynamicChartData"
                    :options="dynamicChartOptions"
                    ref="lineChart"
                  />
                  <bar-chart
                    v-if="
                      !isLoading &&
                        chartType === 'bar' &&
                        dynamicChartData.datasets.length
                    "
                    :chartData="dynamicChartData"
                    :options="dynamicChartOptions"
                    ref="barChart"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RefreshButton from "@/components/RefreshButton.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";
import colors from "vuetify/lib/util/colors";
import mixin from "@/mixin";

export default {
  name: "charts",
  components: { BarChart, LineChart, RefreshButton },
  mixins: [mixin],
  data: () => ({
    chart: "actual",
    chartType: "bar",
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

      let chartdata = {
        labels: [],
        datasets: []
      };
      if (this.chart === "actual") {
        chartdata = {
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
      } else if (this.chart === "financial") {
        chartdata = {
          labels: this.Labels,
          datasets: [
            {
              label: "Verbruik deze periode",
              stack: "ThisYear",
              data: this.Delivered,
              fill: false,
              backgroundColor: settingBackEDC,
              borderColor: settingLineEDC,
              borderWidth: 2
            },
            {
              label: "Teruglevering deze periode",
              stack: "ThisYear",
              data: this.Returned,
              fill: false,
              backgroundColor: settingBackERC,
              borderColor: settingLineERC,
              borderWidth: 2
            },
            {
              label: "Gasverbruik deze periode",
              stack: "ThisYear",
              data: this.Gas,
              fill: false,
              backgroundColor: settingBackGDC,
              borderColor: settingLineGDC,
              borderWidth: 2
            },
            {
              label: "Verbruik vorige periode",
              stack: "LastYear",
              data: this.Delivered2,
              fill: false,
              backgroundColor: settingBackED2C,
              borderColor: settingLineED2C,
              borderWidth: 2
            },
            {
              label: "Teruglevering vorige periode",
              stack: "LastYear",
              data: this.Returned2,
              fill: false,
              backgroundColor: settingBackER2C,
              borderColor: settingLineER2C,
              borderWidth: 2
            },
            {
              label: "Gasverbruik vorige periode",
              stack: "LastYear",
              data: this.Gas2,
              fill: false,
              backgroundColor: settingBackGD2C,
              borderColor: settingLineGD2C,
              borderWidth: 2
            }
          ]
        };
      } else if (this.chart === "day" || this.chart === "week") {
        chartdata = {
          labels: this.Labels,
          datasets: [
            {
              label: "Verbruik",
              stack: "Electricity",
              data: this.Delivered,
              fill: false,
              backgroundColor: settingBackEDC,
              borderColor: settingLineEDC,
              borderWidth: 2
            },
            {
              label: "Teruglevering",
              stack: "Electricity",
              data: this.Returned,
              fill: false,
              backgroundColor: settingBackERC,
              borderColor: settingLineERC,
              borderWidth: 2
            }
          ]
        };
      } else if (this.chart === "year") {
        chartdata = {
          labels: this.Labels,
          datasets: [
            {
              label: "Verbruik deze periode",
              stack: "thisYear",
              data: this.Delivered,
              fill: false,
              borderColor: settingLineEDC,
              backgroundColor: settingBackEDC,
              borderWidth: 2
            },
            {
              label: "Teruglevering deze periode",
              stack: "thisYear",
              data: this.Returned,
              fill: false,
              borderColor: settingLineERC,
              backgroundColor: settingBackERC,
              borderWidth: 2
            },
            {
              label: "Verbruik vorige periode",
              stack: "lastYear",
              data: this.Delivered2,
              fill: false,
              borderColor: settingLineED2C,
              backgroundColor: settingBackED2C,
              borderWidth: 2
            },
            {
              label: "Teruglevering vorige periode",
              stack: "lastYear",
              data: this.Returned2,
              fill: false,
              borderColor: settingLineER2C,
              backgroundColor: settingBackER2C,
              borderWidth: 2
            }
          ]
        };
      }
      return chartdata;
    },
    dynamicChartOptions() {
      let labelString = this.$t("kw");
      switch (this.chart) {
        case "day":
          labelString = "Watt/uur";
          break;
        case "week":
          labelString = "kWh";
          break;
        case "year":
          labelString = "kWh";
          break;
        case "financial":
          labelString = "in Euro's";
          break;
      }

      const textColor = this.$vuetify.theme.dark
        ? colors.grey.lighten4
        : colors.grey.darken4;

      let options = {
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

      if (this.chart === "financial") {
        return {
          ...options,
          tooltips: {
            mode: "index",
            callbacks: {
              // Use the footer callback to display the sum of the items showing in the tooltip
              footer: function(tooltipItems, data) {
                var sumTy = 0;
                var sumPy = 0;
                tooltipItems.forEach(function(tooltipItem) {
                  //console.log(tooltipItem.datasetIndex);
                  if (
                    tooltipItem.datasetIndex == 0 ||
                    tooltipItem.datasetIndex == 1 ||
                    tooltipItem.datasetIndex == 2
                  ) {
                    sumTy += parseFloat(
                      data.datasets[tooltipItem.datasetIndex].data[
                        tooltipItem.index
                      ]
                    );
                  } else {
                    sumPy += parseFloat(
                      data.datasets[tooltipItem.datasetIndex].data[
                        tooltipItem.index
                      ]
                    );
                  }
                });
                return (
                  "Dit jaar € " +
                  parseFloat(sumTy).toFixed(2) +
                  ", vorig jaar € " +
                  parseFloat(sumPy).toFixed(2)
                );
              }
            },
            footerFontStyle: "normal"
          }
        };
      }

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
        this.Returned.push(returned);
        this.DeliveredL1.push(deliveredL1);
        this.DeliveredL2.push(deliveredL2);
        this.DeliveredL3.push(deliveredL3);
      }
    },
    chart() {
      clearInterval(this.intervalTab);
      this.clearVariables(this);
      this.graphStart(this.chart);
    },
    chartType() {},
    dynamicChartOptions() {
      this.$refs[
        this.chartType === "line" ? "lineChart" : "barChart"
      ]?.$data._chart.update();
    }
  },
  created() {
    if (!this.$store.state.actual.length) {
      this.$store.dispatch("getActual");

      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getActual");
      }, 9900);
    }
  },
  beforeRouteLeave(to, from, next) {
    next(vm => {
      clearInterval(vm.data.intervalTab);
    });
  },
  methods: {
    refresh: function() {
      clearInterval(this.intervalTab);
      this.clearVariables(this);
      this.graphStart(this.chart);
    },
    graphStart(graphType) {
      if (graphType == "year") {
        console.error("graphStart: graphYearRow,r=1");
        this.intervalTab = setInterval(() => {
          console.error("year interval");
        }, 120000);
      } else if (graphType == "week") {
        console.error("graphStart: graphWeekRow,r=1");
        this.intervalTab = setInterval(() => {
          console.error("week interval");
        }, 120000);
      } else if (graphType == "day") {
        console.error("graphStart: graphDayRow,r=1");
        this.intervalTab = setInterval(() => {
          console.error("day interval");
        }, 120000);
      } else if (graphType == "actual") {
        console.error("graphStart: graphActualNext");
        this.$store.dispatch("getActual");
        this.intervalTab = setInterval(() => {
          console.error("actual interval");
          this.$store.dispatch("getActual");
        }, 9900);
      } else if (graphType == "financial") {
        console.error("graphStart: graphFinancialRow");
        this.intervalTab = setInterval(() => {
          console.error("financial interval");
        }, 120000);
      }
    },
    clearVariables(instance) {
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
