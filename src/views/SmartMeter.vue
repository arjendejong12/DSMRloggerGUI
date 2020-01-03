<template>
  <div class="smart-meter">
    <v-container>
      <v-row text-center wrap>
        <v-col cols="12" sm="12" class="d-flex justify-space-between">
          <h1>{{ $t("smart_meter") }}</h1>
          <v-btn
            color="orange"
            class="ma-2 white--text"
            :disabled="isLoading"
            @click="refresh"
          >
            {{ $t("refresh") }}
            <v-icon right>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-row>
            <v-col cols="12" sm="12">
              <!-- <h2>Overzicht</h2> -->
              <v-card class="mb-4" elevation="4" :loading="isLoading">
                <v-card-title>
                  <h4>{{ $t("actual") }}</h4>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item v-for="field in actual" :key="field.name">
                    <v-list-item-content style="font-weight: bold;"
                      >{{ $t(field.name) }}:</v-list-item-content
                    >
                    <v-list-item-content class="align-end"
                      >{{
                        field.name === "timestamp"
                          ? buildDateTimeString(field.value)
                          : field.value
                      }}{{
                        field.unit ? " " + field.unit : ""
                      }}</v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-row>
            <v-col cols="12" sm="12">
              <!-- <h2>Fasen</h2> -->
              <!-- <v-card
                class="mb-4"
                elevation="4"
                :loading="isLoading"
                v-for="(blocks, index) in phases"
                :key="index"
              >
                <v-card-title>
                  <h4>{{ getHeaderTitle(index) }}</h4>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item v-for="(block, index) in blocks" :key="index">
                    <v-list-item-content style="font-weight: bold;"
                      >{{ block.title }}:</v-list-item-content
                    >
                    <v-list-item-content class="align-end">{{
                      block.value
                    }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "smart-meter",
  data: () => ({
    intervalTab: null
  }),
  computed: {
    actual: function() {
      try {
        return this.smartMeter.fields.filter(field => {
          return [
            "timestamp",
            "energy_delivered_tariff1",
            "energy_delivered_tariff2",
            "energy_returned_tariff1",
            "energy_returned_tariff2",
            "power_delivered",
            "power_returned",
            "voltage_l1",
            "voltage_l2",
            "voltage_l3",
            "current_l1",
            "current_l2",
            "current_l3",
            "power_delivered_l1",
            "power_delivered_l2",
            "power_delivered_l3",
            "power_returned_l1",
            "power_returned_l2",
            "power_returned_l3"
          ].includes(field.name);
        });
      } catch (error) {
        return [];
      }
    },
    ...mapState({
      isLoading: state => state.isLoading,
      smartMeter: state => state.smartMeter
    })
  },
  watch: {},
  created() {
    if (!this.$store.state.smartMeter.length) {
      this.$store.dispatch("getSmartMeter");

      this.intervalTab = setInterval(() => {
        this.$store.dispatch("getSmartMeter");
      }, 20000);
    }
  },
  beforeRouteLeave(to, from, next) {
    next(vm => {
      clearInterval(vm.data.intervalTab);
    });
  },
  methods: {
    refresh: function() {
      this.$store.dispatch("getSmartMeter");
    },
    buildDateTimeString(timeStamp) {
      let dateTime = "";
      dateTime = timeStamp.substr(4, 2);
      dateTime += "-" + timeStamp.substr(2, 2);
      dateTime += "-20" + timeStamp.substr(0, 2);
      dateTime += " " + timeStamp.substr(6, 2);
      dateTime += ":" + timeStamp.substr(8, 2);
      dateTime += ":" + timeStamp.substr(10, 2);
      return dateTime;
    }
  }
};
</script>
