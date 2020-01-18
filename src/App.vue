<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          link
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item key="FSexplorer" href="/FSexplorer">
          <v-list-item-action>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>FSExplorer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>DSMRloggerGUI</v-toolbar-title>
      <v-spacer></v-spacer>
      <language-switcher :languages="languages"></language-switcher>
      <v-btn icon @click="isDark = !isDark">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <Modal />
    </v-content>

    <v-footer app>
      <span
        >&copy; 2020 - Arjen de Jong ({{ $t("compiled_on") }}
        {{ buildTime }})</span
      >
    </v-footer>
  </v-app>
</template>

<script>
import preval from "preval.macro";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "App",

  components: {
    LanguageSwitcher,
    Modal
  },

  data: () => ({
    drawer: null,
    languages: [
      {
        id: "en",
        title: "english",
        flagSrc: "https://cdn.vuetifyjs.com/images/flags/us.png"
      },
      {
        id: "nl",
        title: "dutch",
        flagSrc: "https://cdn.vuetifyjs.com/images/flags/nl.png"
      }
    ],
    isDark: true,
    buildTime: preval`module.exports = new Date().toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });`
  }),

  computed: {
    menuItems: function() {
      return [
        { icon: "mdi-clock-outline", title: this.$t("smart_meter"), link: "/" },
        { icon: "mdi-history", title: this.$t("per_hour"), link: "/per-hour" },
        {
          icon: "mdi-calendar-today",
          title: this.$t("per_day"),
          link: "/per-day"
        },
        {
          icon: "mdi-calendar-month",
          title: this.$t("per_month"),
          link: "/per-month"
        },
        { icon: "mdi-chart-bar", title: this.$t("charts"), link: "/charts" },
        {
          icon: "mdi-settings-outline",
          title: this.$t("settings"),
          link: "/settings"
        },
        {
          icon: "mdi-information-outline",
          title: this.$t("system_info"),
          link: "/system-info"
        }
      ];
    }
  },

  watch: {
    isDark(status) {
      this.$vuetify.theme.dark = status;
      localStorage.setItem("dsmrloggergui-darkmode", status);
    }
  },

  created() {
    if (!this.$store.state.settings.length) {
      this.$store.dispatch("getSettings");
    }

    // Set localStorage if it does not exist.
    if (!localStorage.getItem("dsmrloggergui-darkmode")) {
      this.$vuetify.theme.dark = this.isDark;
      localStorage.setItem("dsmrloggergui-darkmode", this.isDark);
    } else {
      this.$vuetify.theme.dark =
        localStorage.getItem("dsmrloggergui-darkmode") == "true";

      // If it should be light mode, also set 'isDark' to false.
      if (localStorage.getItem("dsmrloggergui-darkmode") == "false") {
        this.isDark = false;
      }
    }
  }
};
</script>
