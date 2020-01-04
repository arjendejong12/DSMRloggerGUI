<template>
  <div class="per-hour">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("hours") }}</h1>
          <refresh-button dispatch="getHours"></refresh-button>
        </v-col>
        <v-col cols="12" sm="12">
          <v-data-table
            hide-default-footer
            :loading="isLoading"
            :loading-text="$t('loading_please_wait')"
            :items-per-page="-1"
            :headers="headers"
            :items="tableData"
            item-key="hour"
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
  name: "per-hour",
  components: { RefreshButton },
  mixins: [mixin],
  data: () => ({}),
  computed: {
    headers: function() {
      return [
        { text: this.$t("date_hour"), value: "hour" },
        { text: this.$t("energy_delivered_watt"), value: "energy_delivered" },
        { text: this.$t("energy_returned_watt"), value: "energy_returned" },
        { text: this.$t("gas_delivered_m3"), value: "gas_delivered" },
        { text: this.$t("costs_€"), value: "costs" }
      ];
    },
    tableData: function() {
      try {
        return this.hours
          .map((currentHour, index, array) => {
            let energy_delivered;
            let energy_returned;
            let gas_delivered;
            let costs;
            const prevHour = array[index + 1];
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
                ).value /
                this.daysInThisMonth() /
                24, // Hours.
              gas_netw_costs:
                this.settings.find(setting => setting.name === "gas_netw_costs")
                  .value /
                this.daysInThisMonth() /
                24 // Hours.
            };

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

              costs = (currentHour.edt1 - prevHour.edt1) * settings.ed_tariff1;
              costs += (currentHour.edt2 - prevHour.edt2) * settings.ed_tariff2;
              costs -= (currentHour.ert1 - prevHour.ert1) * settings.er_tariff1;
              costs -= (currentHour.ert2 - prevHour.ert2) * settings.er_tariff2;
              costs += (currentHour.gdt - prevHour.gdt) * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            } else {
              energy_delivered = (currentHour.edt1 + currentHour.edt2).toFixed(
                3
              );
              energy_returned = (currentHour.ert1 + currentHour.ert2).toFixed(
                3
              );
              gas_delivered = currentHour.gdt.toFixed(3);

              costs = currentHour.edt1 * settings.ed_tariff1;
              costs += currentHour.edt2 * settings.ed_tariff2;
              costs -= currentHour.ert1 * settings.er_tariff1;
              costs -= currentHour.ert2 * settings.er_tariff2;
              costs += currentHour.gdt * settings.gd_tariff;
              costs += settings.electr_netw_costs;
              costs += settings.gas_netw_costs;
            }

            return {
              hour: this.formatDate("hours", currentHour.recid),
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
      hours: state => state.hours,
      settings: state => state.settings
    })
  },
  watch: {},
  created() {
    if (!this.$store.state.hours.length) {
      this.$store.dispatch("getHours");

      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getHours");
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
