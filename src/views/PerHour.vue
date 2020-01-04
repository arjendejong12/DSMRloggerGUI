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
        { text: "#", value: "id" },
        { text: "Slot", value: "slot" },
        { text: this.$t("date_hour"), value: "hour" },
        { text: this.$t("energy_delivered_watt"), value: "energy_delivered" },
        { text: this.$t("energy_returned_watt"), value: "energy_returned" },
        { text: this.$t("gas_delivered_m3"), value: "gas_delivered" },
        { text: this.$t("costs_€"), value: "costs" }
      ];
    },
    tableData: function() {
      try {
        return this.hours.map((hour, index, array) => {
          let energy_delivered;
          let energy_returned;
          let gas_delivered;

          if (index < array.length - 1) {
            energy_delivered = (
              (hour.edt1 +
                hour.edt2 -
                (array[index + 1].edt1 + array[index + 1].edt2)) *
              1000
            ).toFixed(0);
            energy_returned = (
              (hour.ert1 +
                hour.ert2 -
                (array[index + 1].ert1 + array[index + 1].ert2)) *
              1000
            ).toFixed(0);
            gas_delivered = (hour.gdt - array[index + 1].gdt).toFixed(3);
          } else {
            energy_delivered = (hour.edt1 + hour.edt2).toFixed(3);
            energy_returned = (hour.ert1 + hour.ert2).toFixed(3);
            gas_delivered = hour.gdt.toFixed(3);
          }

          return {
            id: hour.recnr,
            slot: hour.slot,
            hour: this.formatDate("hours", hour.recid),
            energy_delivered: energy_delivered,
            energy_returned: energy_returned,
            gas_delivered: gas_delivered,
            costs: "-"
          };
        });
      } catch (error) {
        return [];
      }
    },
    ...mapState({
      isLoading: state => state.isLoading,
      hours: state => state.hours
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
  methods: {}
};
</script>
