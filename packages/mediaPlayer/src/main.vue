<template>
  <div class="container">
    <div class="con-btn">
      <a href="javascript:;" class="player-btn btn-prev" title="上一首"></a>
      <a href="javascript:;" class="player-btn btn-play" title="暂停/继续"></a>
      <a href="javascript:;" class="player-btn btn-next" title="下一首"></a>
      <a href="javascript:;" class="player-btn btn-order" title="循环控制"></a>
    </div>

    <div class="progress">
      <div class="progress-box">
        <div class="mkpgb-bar"></div>
        <div class="mkpgb-cur" style="width: 0%;"></div>
        <div class="mkpgb-dot" style="left: 0%;"></div>
      </div>
    </div>

    <div class="vol">
      <div class="quiet">
        <a href="javascript:;" class="player-btn btn-quiet" title="静音"></a>
      </div>
      <div class="volume">
        <div class="volume-box">
          <div class="mkpgb-bar"></div>
          <div class="mkpgb-cur" style="width: 60%;"></div>
          <div class="mkpgb-dot" style="left: 60%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaplayerComponent",
  data() {
    return {};
  },

  components: {},

  computed: {},

  methods: {}
};
</script>
<style lang='scss' scoped>
.container {
  .player-btn {
    background-image: url(./images/player.png);
    opacity: 0.8;
    filter: alpha(opacity=80);
    &:hover {
      opacity: 1;
    }
  }
  position: relative;
  width: 100%;
  height: 100px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  .con-btn {
    width: 130px;
    height: 100%;
    position: relative;
    margin: 0 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .btn-prev {
      background-position: 0 -30px;
      width: 19px;
      height: 20px;
    }
    .btn-play {
      width: 19px;
      height: 29px;
      &.btn-state-paused {
        background-position: -30px 0;
      }
    }
    .btn-next {
      background-position: 0 -52px;
      width: 19px;
      height: 20px;
    }
    .btn-order {
      background-position: 0 -173px;
      background-size: 450%;
      width: 25px;
      height: 25px;
      &.btn-order-random {
        background-position: 0 -62px;
        height: 18px;
      }
      &.btn-order-single {
        background-position: 0 -196px;
      }
    }
  }

  .progress {
    flex: auto;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;
    .progress-box {
      width: 100%;
      height: 20px;
      position: relative;
      cursor: pointer;
      .mkpgb-bar {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        margin-top: -1px;
        border-radius: 2px;
        background-color: #808284;
        overflow: hidden;
      }
      .mkpgb-cur {
        position: absolute;
        background-color: #d8d8d8;
        width: 0;
        height: 2px;
        top: 50%;
        margin-top: -1px;
        border-radius: 2px;
        transition: all 0.25s ease;
        -webkit-transition: all 0.25s ease;
        -moz-transition: all 0.25s ease;
        -o-transition: all 0.25s ease;
        -ms-transition: all 0.25s ease;
      }
      .mkpgb-dot {
        width: 10px;
        height: 10px;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        position: absolute;
        left: 0px;
        margin-left: -5px;
        top: 50%;
        margin-top: -5px;
        transition: all 0.25s ease;
        -webkit-transition: all 0.25s ease;
        -moz-transition: all 0.25s ease;
        -o-transition: all 0.25s ease;
        -ms-transition: all 0.25s ease;
      }
    }
  }

  .vol {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    .quiet {
      width: 60px;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn-quiet {
        width: 26px;
        height: 21px;
        background-position: 0 -144px;
        &.btn-state-quiet {
          background-position: 0 -182px;
        }
      }
    }
    .volume {
      flex: auto;
      height: 100%;
      overflow: hidden;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .volume-box {
        width: 100%;
        height: 20px;
        cursor: pointer;
        position: relative;

        .mkpgb-bar {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          margin-top: -1px;
          border-radius: 2px;
          background-color: #808284;
          overflow: hidden;
        }
        .mkpgb-cur {
          position: absolute;
          background-color: #d8d8d8;
          width: 0;
          height: 2px;
          top: 50%;
          margin-top: -1px;
          border-radius: 2px;
          transition: all 0.25s ease;
          -webkit-transition: all 0.25s ease;
          -moz-transition: all 0.25s ease;
          -o-transition: all 0.25s ease;
          -ms-transition: all 0.25s ease;
        }
        .mkpgb-dot {
          width: 10px;
          height: 10px;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          position: absolute;
          left: 0px;
          margin-left: -5px;
          top: 50%;
          margin-top: -5px;
          transition: all 0.25s ease;
          -webkit-transition: all 0.25s ease;
          -moz-transition: all 0.25s ease;
          -o-transition: all 0.25s ease;
          -ms-transition: all 0.25s ease;
        }
      }
    }
  }
}
</style>