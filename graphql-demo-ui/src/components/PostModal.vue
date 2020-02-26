<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent overlay-opacity="0.8" transition="dialog-bottom-transition">
      <v-card color="grey lighten-4" style="border-radius:0px">
        <v-toolbar color class="elevation-0" absolute id="post-modal-toolbar">
          <v-btn icon @click="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-avatar size="32px" item>
            <v-img :src="post.postedBy.photo" />
          </v-avatar>
          <v-toolbar-title class="ml-3">{{post.postedBy.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="follow">
              <v-icon v-if="followId" left color="success">check</v-icon>
              <span v-if="followId">Following</span>
              <span v-else>Follow</span>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-img :src="post.photo" min-height="65vh" max-height="85vh"></v-img>
        <v-card-actions class="actions">
          <v-btn icon @click="$emit('like')">
            <v-icon v-if="post.likeId" color="error">favorite</v-icon>
            <v-icon v-else>favorite</v-icon>
          </v-btn>
          <span v-if="post.likes" class="red--text text--accent-2">{{post.likes}}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('bookmark')">
            <v-icon v-if="post.bookmarkId" color="green">bookmark</v-icon>
            <v-icon v-else>bookmark</v-icon>
          </v-btn>
          <v-btn icon @click="$emit('share')">
            <v-icon>share</v-icon>
          </v-btn>
        </v-card-actions>
        <v-alert
          v-if="post.text"
          class="mx-3"
          text
          dense
          color="teal"
          icon="format_quote"
          border="left"
        >{{post.text}}</v-alert>
        <v-subheader>Products in this photo</v-subheader>
        <v-container class="grey lighten-4 pa-0">
          <v-row no-gutters>
            <template v-for="n in 4">
              <v-col :key="n">
                <!-- <v-card class="pa-2" outlined tile>Column</v-card> -->
                <v-skeleton-loader class="pa-2" max-width="300" type="card"></v-skeleton-loader>
              </v-col>
              <v-responsive v-if="n === 2" :key="`width-${n}`" width="100%"></v-responsive>
            </template>
          </v-row>
        </v-container>
        <div class="d-flex flex-row"></div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import gql from "graphql-tag";

module.exports = {
  name: "PostModal",
  props: {
    post: {
      type: Object,
      default: () => ({})
    },
    show: Boolean
  },
  data() {
    return {
      visitorId: localStorage.getItem("visitorId"),
      loading: true,
      snackbarShow: false,
      snackbar: {
        show: false,
        text: "",
        icon: "",
        color: "success"
      },
      followId: null
    };
  },
  methods: {
    follow() {
      // eslint-disable-next-line no-console
      console.log(`follow ${this.post.id}`);
      if (this.followId) {
        this.followId = null;
      } else {
        this.followId = "test";
      }
      // eslint-disable-next-line no-console
      console.log(this.followId)
    }
  }
};
</script>

<style>
.v-dialog {
  position: absolute;
  border-radius: 0;
  margin: 0;
  height: 100%;
  position: fixed;
  overflow-y: auto;
  top: 0;
  left: 0;
  max-height: unset !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
.v-dialog::-webkit-scrollbar {
  display: none;
}
@media (min-width: 960px) {
  .v-dialog {
    width: 450px !important;
    right: 0 !important;
    left: unset !important;
  }
}
#post-modal-toolbar {
  position: fixed;
  width: 100%;
  top: 0
}
</style>
