import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

interface IMessages {
  [key: string]: any;
}

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: IMessages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

// Create VueI18n instance with options
export default new VueI18n({
  locale: "nl", // set locale
  fallbackLocale: "en",
  messages: loadLocaleMessages() // set locale messages
});
