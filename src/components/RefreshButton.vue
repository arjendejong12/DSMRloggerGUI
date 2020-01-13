<template>
  <v-btn
    color="orange"
    class="ma-2 white--text"
    :disabled="isLoading"
    @click="refresh"
  >
    {{ $t("refresh") }}
    <v-icon right>mdi-refresh</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    dispatch: {
      type: String,
      required: true
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading
  }),
  methods: {
    refresh: function() {
      this.$emit("execute");
      this.$store.dispatch(this.dispatch);
    }
  }
};
</script>
