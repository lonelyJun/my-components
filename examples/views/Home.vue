<template>
  <div class="home">
    <mediaplayer-component
      :mediainfo="media"
      mediaType="audio"
      :keyValue="media.id"
      :autoPlayFlag="false"
    />
    <!-- <picture-resize-component /> -->
    <button @click="handleClick">123</button>
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
        id: 0,
        url: require("./che.mp3")
      },
      mediaList: [
        {
          id: 1,
          url: require("./luolei.mp3")
        },
        {
          id: 2,
          url: require("./luolei.mp3")
        }
      ],
      flag: false
    };
  },
  methods: {
    handleClick() {
      if (this.flag) {
        this.media = this.mediaList[0];
        this.flag = !this.flag;
      } else {
        this.media = this.mediaList[1];
        this.flag = !this.flag;
      }
    }
  }
};
</script>
