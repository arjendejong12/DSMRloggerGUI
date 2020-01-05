<template>
  <div class="per-day">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("days") }}</h1>
          <refresh-button dispatch="getDays"></refresh-button>
        </v-col>
        <v-col cols="12" sm="12">
          <v-data-table
            hide-default-footer
            :loading="isLoading"
            :loading-text="$t('loading_please_wait')"
            :items-per-page="-1"
            :headers="headers"
            :items="tableData"
            item-key="day"
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
  name: "per-day",
  components: { RefreshButton },
  mixins: [mixin],
  data: () => ({}),
  computed: {
    headers: function() {
      return [
        { text: this.$t("date_day"), value: "day" },
        { text: this.$t("energy_delivered_watt"), value: "energy_delivered" },
        { text: this.$t("energy_returned_watt"), value: "energy_returned" },
        { text: this.$t("gas_delivered_m3"), value: "gas_delivered" },
        { text: this.$t("costs_€"), value: "costs" }
      ];
    },
    tableData: function() {
      try {
        return this.days
          .map((currentDay, index, array) => {
            let energy_delivered;
            let energy_returned;
            let gas_delivered;
            let costs;
            const prevDay = array[index + 1];
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
              electr_netw_costs:
                this.settings.find(
                  setting => setting.name === "electr_netw_costs"
                ).value / this.daysInThisMonth(),
              gas_netw_costs:
                this.settings.find(setting => setting.name === "gas_netw_costs")
                  .value / this.daysInThisMonth()
            };

            if (index < array.length - 1) {
              energy_delivered = (
                (currentDay.edt1 +
                  currentDay.edt2 -
                  (prevDay.edt1 + prevDay.edt2)) *
                1000
              ).toFixed(0);
              energy_returned = (
                (currentDay.ert1 +
                  currentDay.ert2 -
                  (prevDay.ert1 + prevDay.ert2)) *
                1000
              ).toFixed(0);
              gas_delivered = (currentDay.gdt - prevDay.gdt).toFixed(3);

              costs = (currentDay.edt1 - prevDay.edt1) * settings.ed_tariff1;
              costs += (currentDay.edt2 - prevDay.edt2) * settings.ed_tariff2;
              costs -= (currentDay.ert1 - prevDay.ert1) * settings.er_tariff1;
              costs -= (currentDay.ert2 - prevDay.ert2) * settings.er_tariff2;
              costs += (currentDay.gdt - prevDay.gdt) * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            } else {
              energy_delivered = (currentDay.edt1 + currentDay.edt2).toFixed(3);
              energy_returned = (currentDay.ert1 + currentDay.ert2).toFixed(3);
              gas_delivered = currentDay.gdt.toFixed(3);

              costs = currentDay.edt1 * settings.ed_tariff1;
              costs += currentDay.edt2 * settings.ed_tariff2;
              costs -= currentDay.ert1 * settings.er_tariff1;
              costs -= currentDay.ert2 * settings.er_tariff2;
              costs += currentDay.gdt * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            }

            return {
              day: this.formatDate("days", currentDay.recid),
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
      days: state => state.days,
      settings: state => state.settings
    })
  },
  watch: {},
  created() {
    if (!this.$store.state.days.length) {
      this.$store.dispatch("getDays");

      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getDays");
      }, 20000);
    }
  },
  methods: {
    daysInThisMonth: function() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }
  }
};
</script>
