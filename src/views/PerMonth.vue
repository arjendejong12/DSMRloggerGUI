<template>
  <div class="per-month">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("months") }}</h1>
          <refresh-button dispatch="getMonths"></refresh-button>
        </v-col>
        <v-col cols="12" sm="12">
          <v-tabs v-model="tab" color="orange">
            <v-tab>{{ $t("table") }}</v-tab>
            <v-tab>{{ $t("chart") }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
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
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>Chart</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
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
  data: () => ({
    tab: null
  }),
  computed: {
    headers: function() {
      return [
        { text: this.$t("month"), value: "month" },
        { text: this.$t("year"), value: "yearCurrent" },
        { text: this.$t("energy_delivered_watt"), value: "edCurrent" },
        { text: this.$t("energy_returned_watt"), value: "erCurrent" },
        { text: this.$t("gas_delivered_m3"), value: "gdCurrent" },
        { text: this.$t("costs_€"), value: "costsCurrent" },
        { text: this.$t("year"), value: "yearPrevious" },
        { text: this.$t("energy_delivered_watt"), value: "edPrevious" },
        { text: this.$t("energy_returned_watt"), value: "erPrevious" },
        { text: this.$t("gas_delivered_m3"), value: "gdPrevious" },
        { text: this.$t("costs_€"), value: "costsPrevious" }
      ];
    },
    tableData: function() {
      try {
        return this.processData(this.months);
      } catch (error) {
        return [];
      }
    },
    settingsTariffs() {
      return {
        ed_tariff1: this.settings.find(setting => setting.name === "ed_tariff1")
          .value,
        ed_tariff2: this.settings.find(setting => setting.name === "ed_tariff2")
          .value,
        er_tariff1: this.settings.find(setting => setting.name === "er_tariff1")
          .value,
        er_tariff2: this.settings.find(setting => setting.name === "er_tariff2")
          .value,
        gd_tariff: this.settings.find(setting => setting.name === "gd_tariff")
          .value,
        electr_netw_costs: this.settings.find(
          setting => setting.name === "electr_netw_costs"
        ).value,
        gas_netw_costs: this.settings.find(
          setting => setting.name === "gas_netw_costs"
        ).value
      };
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
    }

    if (!this.$store.state.settings.length) {
      this.$store.dispatch("getSettings");
    }
  },
  methods: {
    processData(data) {
      const monthNames = [
        this.$t("january"),
        this.$t("february"),
        this.$t("march"),
        this.$t("april"),
        this.$t("may"),
        this.$t("june"),
        this.$t("july"),
        this.$t("august"),
        this.$t("september"),
        this.$t("october"),
        this.$t("november"),
        this.$t("december")
      ];

      for (let i = 0; i < data.length; i++) {
        data[i].p_ed = {};
        data[i].p_er = {};
        data[i].p_gd = {};
        data[i].p_costs = {};

        if (i < data.length - 1) {
          const edAMonth = (
            (data[i].edt1 +
              data[i].edt2 -
              (data[i + 1].edt1 + data[i + 1].edt2)) *
            1000
          ).toFixed(0);
          const edCostsAMonth =
            data[i].edt1 * this.settingsTariffs.ed_tariff1 +
            data[i].edt2 * this.settingsTariffs.ed_tariff2 -
            (data[i + 1].edt1 * this.settingsTariffs.ed_tariff1 +
              data[i + 1].edt2 * this.settingsTariffs.ed_tariff2);
          const erAMonth = (
            (data[i].ert1 +
              data[i].ert2 -
              (data[i + 1].ert1 + data[i + 1].ert2)) *
            1000
          ).toFixed(0);
          const erCostsAMonth =
            data[i].ert1 * this.settingsTariffs.er_tariff1 +
            data[i].ert2 * this.settingsTariffs.er_tariff2 -
            (data[i + 1].ert1 * this.settingsTariffs.er_tariff1 +
              data[i + 1].ert2 * this.settingsTariffs.er_tariff2);
          const gdAMonth = (data[i].gdt - data[i + 1].gdt).toFixed(3);
          const gdCostsAMonth =
            data[i].gdt * this.settingsTariffs.gd_tariff -
            data[i + 1].gdt * this.settingsTariffs.gd_tariff;

          data[i].p_ed = edAMonth;
          data[i].p_er = erAMonth;
          data[i].p_gd = gdAMonth;
          data[i].p_costs = (
            edCostsAMonth -
            erCostsAMonth +
            gdCostsAMonth
          ).toFixed(2);
        } else {
          const edAMonth = (data[i].edt1 + data[i].edt2).toFixed(0);
          const edCostsAMonth =
            data[i].edt1 * this.settingsTariffs.ed_tariff1 +
            data[i].edt2 * this.settingsTariffs.ed_tariff2;
          const erAMonth = (data[i].ert1 + data[i].ert2).toFixed(0);
          const erCostsAMonth =
            data[i].ert1 * this.settingsTariffs.er_tariff1 +
            data[i].ert2 * this.settingsTariffs.er_tariff2;
          const gdAMonth = data[i].gdt.toFixed(3);
          const gdCostsAMonth = data[i].gdt * this.settingsTariffs.gd_tariff;

          data[i].p_ed = edAMonth;
          data[i].p_er = erAMonth;
          data[i].p_gd = gdAMonth;
          data[i].p_costs = (
            edCostsAMonth -
            erCostsAMonth +
            gdCostsAMonth
          ).toFixed(2);
        }
      }

      const amountOfRows = data.length > 24 ? 12 : data.length / 2;
      const tableData = [];
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
          yearCurrent:
            "20" + data[i].recid.substring(0, 2) === "2000"
              ? "-"
              : "20" + data[i].recid.substring(0, 2),
          yearPrevious:
            "20" + data[i + 12].recid.substring(0, 2) === "2000"
              ? "-"
              : "20" + data[i + 12].recid.substring(0, 2),
          edCurrent: data[i].p_ed,
          edPrevious: data[i + 12].p_ed,
          erCurrent: data[i].p_er,
          erPrevious: data[i + 12].p_er,
          gdCurrent: data[i].p_gd,
          gdPrevious: data[i + 12].p_gd,
          costsCurrent: data[i].p_costs,
          costsPrevious: data[i + 12].p_costs
        };
        tableData.push(obj);
      }

      return tableData;
    }
  }
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .theme--light {
    .per-month {
      tr {
        th,
        td {
          &:first-child,
          &:nth-child(6) {
            border-right: thin solid rgba(0, 0, 0, 0.12);
          }
        }
      }
    }
  }

  .theme--dark {
    .per-month {
      tr {
        th,
        td {
          &:first-child,
          &:nth-child(6) {
            border-right: thin solid rgba(255, 255, 255, 0.12);
          }
        }
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .theme--light {
    .per-month {
      tr {
        th,
        td {
          &:first-child,
          &:nth-child(6) {
            border-bottom: thin solid rgba(0, 0, 0, 0.12);
          }
        }
      }
    }
  }

  .theme--dark {
    .per-month {
      tr {
        th,
        td {
          &:first-child,
          &:nth-child(6) {
            border-bottom: thin solid rgba(255, 255, 255, 0.12);
          }
        }
      }
    }
  }
}
</style>
