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
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <v-btn
        key="theme-light-dark-toggle"
        :color="isDark ? 'yellow darken-3' : 'dark-gray'"
        fab
        large
        dark
        bottom
        right
        fixed
        class="v-btn--example"
        @click="isDark = !isDark"
      >
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-content>

    <v-footer app>
      <span>&copy; 2020 - Arjen de Jong</span>
    </v-footer>
  </v-app>
</template>

<script>
import Vue from "vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

export default Vue.extend({
  name: "App",

  components: {
    LanguageSwitcher
  },

  data: () => ({
    drawer: null,
    menuItems: [
      { icon: "mdi-clock-outline", title: "Actueel", link: "/" },
      { icon: "mdi-history", title: "Per uur", link: "/per-hour" },
      { icon: "mdi-calendar-today", title: "Per dag", link: "/per-day" },
      { icon: "mdi-calendar-month", title: "Per maand", link: "/per-month" },
      { icon: "mdi-chart-bar", title: "Grafieken", link: "/charts" },
      {
        icon: "mdi-settings-outline",
        title: "Instellingen",
        link: "/settings"
      },
      {
        icon: "mdi-information-outline",
        title: "Systeeminfo",
        link: "/system-info"
      }
    ],
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
    isDark: true
  }),

  watch: {
    isDark(status) {
      this.$vuetify.theme.dark = status;
    }
  },

  created() {
    this.$vuetify.theme.dark = this.isDark;
  }
});
</script>
