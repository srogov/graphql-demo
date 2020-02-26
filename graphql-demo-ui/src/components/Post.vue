<template>
  <v-card max-width="380" min-width="380" class="mx-auto" outlined>
    <v-img
      :src="post.photo"
      lazy-src="https://via.placeholder.com/300x300.png?text=FoundItOnAmazon"
      height="380"
      @click="showModal=true"
      style="cursor: pointer;"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-actions class="actions">
      <v-btn icon @click="like">
        <v-icon v-if="post.likeId" color="error">favorite</v-icon>
        <v-icon v-else>favorite</v-icon>
      </v-btn>
      <span v-if="post.likes" class="red--text text--accent-2">{{post.likes}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="bookmark">
        <v-icon v-if="post.bookmarkId" color="green">bookmark</v-icon>
        <v-icon v-else>bookmark</v-icon>
      </v-btn>
      <v-btn icon @click="share">
        <v-icon>share</v-icon>
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="snackbar.show"
      :timeout="2000"
      :left="true"
      :bottom="true"
      :color="snackbar.color"
    >
      <v-icon color="white">{{snackbar.icon}}</v-icon>
      {{ snackbar.text }}
    </v-snackbar>
    <post-modal :post="post" :show="showModal" @close="showModal=false" @like="like" @bookmark="bookmark" @share="share"></post-modal>
  </v-card>
</template>
 
<script>
import gql from "graphql-tag";
import PostModal from "./PostModal";

export default {
  name: "post",
  components: {
    PostModal
  },
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
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
      showModal: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  methods: {
    bookmark() {
      if (this.post.bookmarkId) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: String!) {
                deleteBookmark(id: $id) {
                  id
                }
              }
            `,
            // Parameters
            variables: {
              id: this.post.bookmarkId
            }
          })
          .then(() => {
            this.post.bookmarkId = null;
            this.snackbar = {
              show: true,
              text: "UnSaved",
              icon: "bookmark",
              color: "info"
            };
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($visitor: String!, $post: String!) {
                addBookmark(visitor: $visitor, post: $post) {
                  id
                }
              }
            `,
            // Parameters
            variables: {
              visitor: this.visitorId,
              post: this.post.id
            }
          })
          .then(data => {
            this.post.bookmarkId = data.data.addBookmark.id;
            this.snackbar = {
              show: true,
              text: "Saved",
              icon: "bookmark",
              color: "success"
            };
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      }
    },
    like() {
      if (this.post.likeId) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: String!) {
                deleteLike(id: $id) {
                  id
                }
              }
            `,
            // Parameters
            variables: {
              id: this.post.likeId
            }
          })
          .then(() => {
            this.post.likeId = null;
            this.post.likes--;
            this.snackbar = {
              show: true,
              text: "UnLiked",
              icon: "favorite",
              color: "info"
            };
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($visitor: String!, $post: String!) {
                addLike(visitor: $visitor, post: $post) {
                  id
                }
              }
            `,
            // Parameters
            variables: {
              visitor: this.visitorId,
              post: this.post.id
            }
          })
          .then(data => {
            this.post.likeId = data.data.addLike.id;
            this.post.likes++;
            this.snackbar = {
              show: true,
              text: "Liked",
              icon: "favorite",
              color: "error"
            };
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      }
    },
    share() {
      // eslint-disable-next-line no-console
      console.log(`Share ${this.post.id}`);
    }
  },
  computed: {}
};
</script>
 
<style scoped lang="scss">
.actions {
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 100%;
  background: rgba($color: #ffffff, $alpha: 0.8);
}
</style>