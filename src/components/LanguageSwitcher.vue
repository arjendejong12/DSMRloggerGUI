<template>
  <!-- <v-select
    :value="$i18n.locale"
    :items="$i18n.availableLocales"
    item-text="label"
    item-value="code"
    :label="$t('language')"
    return-object
    @change="onChangeLocale"
  /> -->
  <v-menu offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...tooltip, ...menu }">
            <img :src="currentLanguageIcon" v-if="currentLanguageIcon" />
            <v-icon v-else>mdi-earth</v-icon>
          </v-btn>
        </template>
        <span>Switch Language</span>
      </v-tooltip>
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
        <v-list-item-title>{{ language.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
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
      return this.$props.languages.filter(x => x.id === this.currentLanguage)[0]
        .flagSrc;
    }
  },
  methods: {
    changeLanguage(id: string) {
      this.$i18n.locale = id;
    }
  }
};
</script>
