<template>
  <div class="system-info">
    <v-container>
      <v-row text-center wrap justify="center">
        <v-col cols="12" sm="12" md="6">
          <v-row>
            <v-col cols="12" sm="12" class="d-flex justify-space-between">
              <h1>{{ $t("system_info") }}</h1>
              <refresh-button dispatch="getSystemInfo"></refresh-button>
            </v-col>
            <v-col cols="12" sm="12">
              <v-card class="mb-4" elevation="4" :loading="isLoading">
                <v-card-title>
                  <h4>{{ $t("information") }}</h4>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item
                    v-for="field in updatedSystemInfo"
                    :key="field.name"
                  >
                    <v-list-item-content style="font-weight: bold;"
                      >{{ $t(field.name) }}:</v-list-item-content
                    >
                    <v-list-item-content class="align-end"
                      >{{
                        field.name === "timestamp"
                          ? formatDate("timestamp", field.value)
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
import preval from "preval.macro";
import RefreshButton from "@/components/RefreshButton.vue";
import mixin from "@/mixin";
import { mapState } from "vuex";

export default {
  name: "system-info",
  components: { RefreshButton },
  mixins: [mixin],
  data: () => ({
    intervalTab: null,
    buildDateTime: preval`module.exports = new Date().toLocaleString('nl-NL', { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });`
  }),
  computed: {
    updatedSystemInfo: function() {
      try {
        return this.systemInfo.concat([
          {
            name: this.$t("author_gui"),
            value: "Arjen de Jong"
          },
          {
            name: this.$t("compiled"),
            value: this.buildDateTime
          }
        ]);
      } catch (error) {
        return [];
      }
    },
    ...mapState({
      isLoading: state => state.isLoading,
      systemInfo: state => state.systemInfo
    })
  },
  watch: {},
  created() {
    if (!this.$store.state.systemInfo.length) {
      this.$store.dispatch("getSystemInfo");

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
        this.$store.dispatch("getSystemInfo");
      }, 20000);
    }
  }
};
</script>
