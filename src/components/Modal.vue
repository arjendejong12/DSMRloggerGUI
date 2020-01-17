<template>
  <v-dialog v-model="showModal" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">{{ $t("error_title") }}</v-card-title>
      <v-card-text>{{ $t("error_message") }}</v-card-text>
      <v-card-text v-html="errorMessage"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="darken-1" text @click="reloadPage">
          {{ $t("reload") }}
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    isClosed: false
  }),
  computed: mapState({
    showModal: state => state.showModal,
    errorMessage: state => state.errorMessage
  }),
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
};
</script>
