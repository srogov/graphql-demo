<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        #
        <span class="font-weight-bold">FoundIt</span>OnAmazon
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-text-field
        v-model.lazy="input"
        v-on:keyup.enter="search=input"
        placeholder="Search"
        solo-inverted
        hide-details
        hide-no-data
        flat
        rounded
        dense
        dark
        class="mx-4"
        color="primary"
        prepend-inner-icon="search"
        style="max-width: 400px"
      ></v-text-field>
    </v-app-bar>

    <v-content>
      <Feed :search="search" />
    </v-content>
  </v-app>
</template>

<script>
import Feed from "@/components/Feed";

export default {
  name: "App",

  components: {
    Feed
  },

  data: () => ({
    input: "",
    search: "",
    // loading: true
  }),

  methods: {
    showLoading: function(event) {
      const vm = this
      setTimeout(()=> {
        vm.loading = event;
      },1000)
      // this.loading = event;
    }
  }
};
</script>
