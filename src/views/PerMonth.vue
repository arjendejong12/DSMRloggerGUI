<template>
  <div class="per-month">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("months") }}</h1>
          <refresh-button dispatch="getMonths"></refresh-button>
        </v-col>
        <v-col cols="12" sm="12">
          <v-data-table
            hide-default-footer
            :loading="isLoading"
            :loading-text="$t('loading_please_wait')"
            :items-per-page="-1"
            :headers="headers"
            :items="tableData"
            item-key="month"
            class="elevation-1"
          ></v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import RefreshButton from "@/components/RefreshButton.vue";
import mixin from "@/mixin";
import { mapState } from "vuex";

export default {
  name: "per-month",
  components: { RefreshButton },
  mixins: [mixin],
  data: () => ({}),
  computed: {
    headers: function() {
      return [
        { text: this.$t("date_month"), value: "month" },
        { text: this.$t("energy_delivered_watt"), value: "energy_delivered" },
        { text: this.$t("energy_returned_watt"), value: "energy_returned" },
        { text: this.$t("gas_delivered_m3"), value: "gas_delivered" },
        { text: this.$t("costs_€"), value: "costs" }
      ];
    },
    tableData: function() {
      try {
        this.processData(this.months);
        return this.months
          .map((currentMonth, index, array) => {
            let energy_delivered;
            let energy_returned;
            let gas_delivered;
            let costs;
            const prevMonth = array[index + 1];
            const settings = {
              ed_tariff1: this.settings.find(
                setting => setting.name === "ed_tariff1"
              ).value,
              ed_tariff2: this.settings.find(
                setting => setting.name === "ed_tariff2"
              ).value,
              er_tariff1: this.settings.find(
                setting => setting.name === "er_tariff1"
              ).value,
              er_tariff2: this.settings.find(
                setting => setting.name === "er_tariff2"
              ).value,
              gd_tariff: this.settings.find(
                setting => setting.name === "gd_tariff"
              ).value,
              electr_netw_costs: this.settings.find(
                setting => setting.name === "electr_netw_costs"
              ).value,
              gas_netw_costs: this.settings.find(
                setting => setting.name === "gas_netw_costs"
              ).value
            };

            if (index < array.length - 1) {
              energy_delivered = (
                (currentMonth.edt1 +
                  currentMonth.edt2 -
                  (prevMonth.edt1 + prevMonth.edt2)) *
                1000
              ).toFixed(0);
              energy_returned = (
                (currentMonth.ert1 +
                  currentMonth.ert2 -
                  (prevMonth.ert1 + prevMonth.ert2)) *
                1000
              ).toFixed(0);
              gas_delivered = (currentMonth.gdt - prevMonth.gdt).toFixed(3);

              costs =
                (currentMonth.edt1 - prevMonth.edt1) * settings.ed_tariff1;
              costs +=
                (currentMonth.edt2 - prevMonth.edt2) * settings.ed_tariff2;
              costs -=
                (currentMonth.ert1 - prevMonth.ert1) * settings.er_tariff1;
              costs -=
                (currentMonth.ert2 - prevMonth.ert2) * settings.er_tariff2;
              costs += (currentMonth.gdt - prevMonth.gdt) * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            } else {
              energy_delivered = (
                currentMonth.edt1 + currentMonth.edt2
              ).toFixed(3);
              energy_returned = (currentMonth.ert1 + currentMonth.ert2).toFixed(
                3
              );
              gas_delivered = currentMonth.gdt.toFixed(3);

              costs = currentMonth.edt1 * settings.ed_tariff1;
              costs += currentMonth.edt2 * settings.ed_tariff2;
              costs -= currentMonth.ert1 * settings.er_tariff1;
              costs -= currentMonth.ert2 * settings.er_tariff2;
              costs += currentMonth.gdt * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            }

            return {
              month: this.formatDate("months", currentMonth.recid),
              energy_delivered: energy_delivered,
              energy_returned: energy_returned,
              gas_delivered: gas_delivered,
              costs: +costs.toFixed(4)
            };
          })
          .slice(0, -1);
      } catch (error) {
        return [];
      }
    },
    ...mapState({
      isLoading: state => state.isLoading,
      months: state => state.months,
      settings: state => state.settings
    })
  },
  watch: {},
  created() {
    if (!this.$store.state.months.length) {
      this.$store.dispatch("getMonths");

      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getMonths");
      }, 20000);
    }
  },
  methods: {
    processData(data) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      const amountOfRows = data.length > 24 ? 12 : data.length / 2;
      for (let i = 0; i < amountOfRows; i++) {
        const month = parseInt(data[i].recid.substring(2, 4), 10) - 1;
        const ed1 = (data[i].edt1 + data[i].edt2).toFixed(3);
        const ed2 = (data[i + 12].edt1 + data[i + 12].edt2).toFixed(3);
        const er1 = (data[i].ert1 + data[i].ert2).toFixed(3);
        const er2 = (data[i + 12].ert1 + data[i + 12].ert2).toFixed(3);
        const gd1 = data[i].gdt.toFixed(3);
        const gd2 = data[i + 12].gdt.toFixed(3);

        const obj = {
          month: monthNames[month],
          year1:
            "20" + data[i].recid.substring(0, 2) === "2000"
              ? "-"
              : "20" + data[i].recid.substring(0, 2),
          year2:
            "20" + data[i + 12].recid.substring(0, 2) === "2000"
              ? "-"
              : "20" + data[i + 12].recid.substring(0, 2),
          ed1: ed1,
          ed2: ed2,
          er1: er1,
          er2: er2,
          gd1: gd1,
          gd2: gd2
        };
        console.log(obj);
      }
    }
  }
};
</script>
