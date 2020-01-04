<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-btn icon v-on="{ ...menu }">
        <img :src="currentLanguageIcon" v-if="currentLanguageIcon" />
        <v-icon v-else>mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="language in languages"
        :key="language.id"
        @click="changeLanguage(language.id)"
      >
        <v-list-item-avatar tile size="24">
          <v-img :src="language.flagSrc"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>{{ $t(language.title) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    languages: {
      type: Array,
      required: true
    },
    currentLanguage: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    currentLanguageIcon() {
      if (!this.currentLanguage || !this.currentLanguage) {
        return null;
      }
      return this.languages.filter(x => x.id === this.currentLanguage)[0]
        .flagSrc;
    }
  },
  methods: {
    changeLanguage(id) {
      this.$i18n.locale = id;
      localStorage.setItem("dsmrloggergui-language", id);
    }
  },
  created() {
    // Set localStorage if it does not exist.
    if (!localStorage.getItem("dsmrloggergui-language")) {
      this.$i18n.locale = "nl";
      localStorage.setItem("dsmrloggergui-language", "nl");
    } else {
      this.$i18n.locale = localStorage.getItem("dsmrloggergui-language");
    }
  }
};
</script>
