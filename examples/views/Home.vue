<template>
  <div class="home">
    <mediaplayer-component :media="media" />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      media: {
        mediaType: "audio",
        mediaUrl: require("./che.mp3")
      }
    };
  }
};
</script>
