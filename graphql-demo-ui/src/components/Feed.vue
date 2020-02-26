<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="feed">
        <v-row align="start" justify="center" class="grey lighten-5" style="height: 300px;">
          <post v-for="post in feed.docs" :key="post.id" :post="post" class="ma-2"></post>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay :value="loading" color="white" opacity="0.7">
      <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import Post from "@/components/Post";
import gql from "graphql-tag";

export default {
  name: "feed",

  components: {
    Post
  },
  props: {
    search: String
  },
  computed: {},

  data: () => ({
    loading: false,
    feed: {},
    visitorId: localStorage.getItem("visitorId")
  }),

  apollo: {
    feed: {
      query: gql`
        query feed($visitorId: String, $search: String) {
          feed(visitorId: $visitorId, search: $search, limit: 200) {
            totalDocs
            limit
            hasPrevPage
            hasNextPage
            page
            totalPages
            prevPage
            nextPage
            docs {
              id
              createdAt
              photo
              text
              tags
              bookmarkId
              likeId
              likes
              postedBy {
                id
                name
                photo
              }
              products {
                id
                name
                description
                photo
                price
              }
            }
          }
        }
      `,
      variables() {
        return {
          visitorId: this.visitorId,
          search: this.search
        };
      },
      fetchPolicy: "cache-and-network",
      //   result({ data, loading }) {
      //     if (!loading) {
      //       this.feed = data.feed;
      //       this.$emit("update:loading", false);
      //     }
      //   },
      watchLoading(isLoading) {
        // this.$emit("loading", isLoading);
        this.loading = isLoading;
      }
    }
  }
};
</script>
 
<style scoped lang="scss">

</style>