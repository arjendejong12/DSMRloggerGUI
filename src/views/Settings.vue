<template>
  <div class="settings">
    <v-container>
      <v-row text-center wrap justify="center">
        <v-col cols="12" sm="12" md="6">
          <v-row>
            <v-col cols="12" sm="12" class="d-flex justify-space-between">
              <h1>Instellingen</h1>
              <refresh-button dispatch="getSettings"></refresh-button>
            </v-col>
            <v-col cols="12" sm="12">
              <v-card class="mb-4" elevation="4" :loading="isLoading">
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-for="(value, name) in settings"
                      :key="name"
                      v-model="settings[name].value"
                      :label="settings[name].name"
                      :rules="settings[name].rules || []"
                      :type="settings[name].type || 'text'"
                      filled
                      required
                      :loading="isLoading"
                    ></v-text-field>
                    <v-btn
                      class="ma-2"
                      :disabled="isLoading || !valid"
                      @click="saveSettings"
                    >
                      Opslaan
                      <v-icon right>mdi-content-save</v-icon>
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RefreshButton from "@/components/RefreshButton.vue";
import mixin from "@/mixin";

const pattern = /^\d{1,2}(\.\d{1,2})?$/;
const max = 99.99;

export default {
  name: "settings",
  components: { RefreshButton },
  mixins: [mixin],
  data: () => ({
    valid: true,
    settingsData: {
      "ed_tariff1": {
        label: "Prijs per verbruikte kWh (tarief 1)",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "ed_tariff2": {
        label: "Prijs per verbruikte kWh (tarief 2)",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "er_tariff1": {
        label: "Prijs per teruggeleverde kWh (tarief 1)",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "er_tariff2": {
        label: "Prijs per teruggeleverde kWh (tarief 2)",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "gd_tariff": {
        label: "Prijs per verbruikte m3 gas",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "electr_netw_costs": {
        label: "Electra vaste kosten per maand",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      "gas_netw_costs": {
        label: "Gas vaste kosten per maand",
        value: null,
        rules: [
          v => pattern.test(v) || "Verkeerd formaat!",
          v => v < max || "Getal te groot!"
        ],
        type: "number"
      },
      BgColor: {
        label: "Achtergrondkleur",
        value: null
      },
      FontColor: {
        label: "Tekstkleur",
        value: null
      },
      "tlgrm_interval": {
        label: "Telegram verwerkingsinterval (sec.)",
        value: null,
        type: "number"
      },
      SleepTime: {
        label: "OLED slaapstand (min.) (0 = oneindig)",
        value: null,
        type: "number"
      },
      "mqtt_broker": {
        label: "MQTT Broker URL/IP",
        value: null
      },
      "mqtt_broker_port": {
        label: "MQTT Broker Port",
        value: null
      },
      "mqtt_user": {
        label: "MQTT gebruikersnaam",
        value: null
      },
      "mqtt_passwd": {
        label: "MQTT wachtwoord",
        value: null
      },
      "mqtt_topTopic": {
        label: "MQTT hoofdonderwerp",
        value: null
      },
      "mqtt_interval": {
        label: "MQTT interval (sec.)",
        value: null,
        type: "number"
      }
    }
  }),
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      settings: state => state.settings
    })
  },
  watch: {
    settings(newValue) {
      Object.keys(newValue).forEach(function(key) {
        console.log(key); // key
        console.log(newValue[key]); // value
        // Add rules and labels for each object
      });

      this.settings = newValue;

      // // A message consists of data split by a comma, for example:
      // // msgType=PerHoursHeaders,R=25,DH=(31) 00,H=(31) 00:00 - 00:59,ED=381,ER=0,GD=0.27,COSTS=0.27
      // const singlePairs = newValue.split(",");
      // const msgType = singlePairs[0].split("=")[1];
      // if (msgType == "settings") {
      //   for (var i = 1; i < singlePairs.length; i++) {
      //     const onePair = singlePairs[i].split("=");
      //     const label = onePair[0].trim();
      //     const value = onePair[1].trim();

      //     if (
      //       label == "DT1" ||
      //       label == "DT2" ||
      //       label == "RT1" ||
      //       label == "RT2" ||
      //       label == "GAST" ||
      //       label == "ENBK" ||
      //       label == "GNBK" ||
      //       label == "Interval" ||
      //       label == "SleepTime"
      //     ) {
      //       this.settings[label].value = value * 1;
      //     } else {
      //       this.settings[label].value = value;
      //     }
      //   }
      //   this.isLoading = false;
      // }
    }
  },
  created() {
    if (!this.$store.state.settings.length) {
      this.$store.dispatch("getSettings");
    }
  },
  methods: {
    saveSettings() {
      // const data = Object.entries(this.settings).reduce(
      //   (accumulator, currentValue, currentIndex, array) => {
      //     return (accumulator +=
      //       "," + currentValue[0] + "=" + currentValue[1].value);
      //   },
      //   "saveSettings"
      // );
      // this.isLoading = true;
      // this.$store.dispatch("sendMessage", data);
      // this.$store.dispatch("sendMessage", "getDevInfo");
      // this.$store.dispatch("sendMessage", "sendSettings");
    }
  }
};
</script>
