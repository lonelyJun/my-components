

<template>
  <div class="container">
    <video v-if="mediaType=='video'" ref="mediaDom">您的浏览器不支持 video 标签。</video>
    <audio v-else ref="mediaDom"></audio>
    <div class="controller">
      <div class="con-btn">
        <a href="javascript:;" class="player-btn btn-prev" title="上一首" @click="()=>{$emit('prev')}"></a>
        <a
          href="javascript:;"
          :class="{'player-btn':true, 'btn-play':true,'btn-state-paused':currentStatus=='playing'}"
          title="暂停/继续"
          @click="handlePlayEvent"
        ></a>
        <a href="javascript:;" class="player-btn btn-next" title="下一首" @click="()=>{$emit('next')}"></a>
        <a
          v-if="mediaType!='video'"
          href="javascript:;"
          :class="{'player-btn':true, 'btn-order':true,'btn-order-random':playModel=='random','btn-order-single':playModel=='single'}"
          title="循环控制"
          @click="handlePlayModelEvent"
        ></a>
      </div>

      <div class="progress">
        <div class="progress-box" @click="handleProgressEvent($event,'media')">
          <div class="mkpgb-bar"></div>
          <div class="mkpgb-cur" ref="progressCur"></div>
          <div class="mkpgb-dot" ref="progressDot"></div>
        </div>
        <div class="time-box">{{secondToTimeStr(currentTime)}}/{{secondToTimeStr(duration)}}</div>
      </div>

      <div class="vol">
        <div class="quiet">
          <a
            href="javascript:;"
            :class="{'player-btn':true, 'btn-quiet':true,'btn-state-quiet':currentVolumeStatus == 'muted'}"
            title="静音"
            @click="handleVolumeEvent"
          ></a>
        </div>
        <div class="volume">
          <div class="volume-box" @click="handleProgressEvent($event,'volume')">
            <div class="mkpgb-bar"></div>
            <div class="mkpgb-cur" ref="volumeProgressCur"></div>
            <div class="mkpgb-dot" ref="volumeProgressDot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 外部输入参数
 * @param mType 媒体类型，'video'为视频，其他为音频
 * @param mUrl  媒体路径
 */
export default {
  name: "MediaplayerComponent",
  props: ["media"],
  data() {
    return {
      //控制状态
      currentStatus: "pause", //当前播放状态，playing/pause
      currentVolumeStatus: "normal", //当前音量状态，normal/muted
      playModelList: ["normal", "random", "single"], //播放模式列表
      playModelIndex: 0, //当前播放模式的index,

      //控制数据
      currentTime: 0, //当前时间
      duration: 0, //总时长
      volume: 0, //音量大小
      tempVolume: 1 //音量为0以外的值，用于静音后恢复
    };
  },

  components: {},

  computed: {
    mediaUrl() {
      return this.media.mediaUrl;
    },
    mediaType() {
      return this.media.mediaType;
    },
    playModel() {
      return this.playModelList[this.playModelIndex];
    }
  },

  watch: {
    volume(v) {
      if (this.$refs.mediaDom) {
        this.$refs.mediaDom.muted = v == 0 ? true : false;
      }
      if (v != 0) {
        //用来保存非静音前的最后一个数值
        this.tempVolume = v;
      }
      //当前音量改变时，设置进度条
      this.setProgress(v * 100, "volume");
    },
    currentTime(v) {
      //当前值改变时，设置进度条
      this.setProgress((v / this.duration) * 100, "media");
    }
  },

  mounted() {
    let mDom = this.$refs.mediaDom;
    if (this.mediaUrl) {
      mDom.src = this.mediaUrl;
      mDom.play();
    }
    this.addMediaEventListener();
  },

  methods: {
    //处理播放模式
    handlePlayModelEvent() {
      this.playModelIndex = ++this.playModelIndex % 3;
    },
    //处理播放事件
    handlePlayEvent() {
      let mDom = this.$refs.mediaDom;
      if (this.currentStatus == "pause") {
        mDom.play();
      } else {
        mDom.pause();
      }
    },
    //处理音量按键点击事件
    handleVolumeEvent() {
      let mDom = this.$refs.mediaDom;
      if (this.currentVolumeStatus == "normal") {
        mDom.volume = 0;
      } else {
        mDom.volume = this.tempVolume;
      }
    },
    //处理进度条点击事件
    handleProgressEvent(e, obj) {
      let mDom = this.$refs.mediaDom;
      //计算位置
      let width = e.target.offsetWidth;
      let offset = e.offsetX;
      let percent = (offset / width) * 100;
      //设置数据
      if (obj == "media") {
        mDom.currentTime = (percent * this.duration) / 100;
      } else if (obj == "volume") {
        mDom.volume = (percent * 1) / 100;
      } else {
        return;
      }
    },
    //初始化选项
    init() {},
    //将second转为XX:XX:XX模式
    secondToTimeStr(t) {
      let h = Math.floor(t / 3600);
      let m = Math.floor((t % 3600) / 60);
      let s = Math.floor(t % 60);
      return (
        (h > 9 ? h : "0" + h) +
        ":" +
        (m > 9 ? m : "0" + m) +
        ":" +
        (s > 9 ? s : "0" + s)
      );
    },
    //设置进度条
    setProgress(percent, obj = "media") {
      if (obj == "media") {
        this.$refs.progressCur.style.width = percent + "%";
        this.$refs.progressDot.style.left = percent + "%";
      } else if (obj == "volume") {
        this.$refs.volumeProgressCur.style.width = percent + "%";
        this.$refs.volumeProgressDot.style.left = percent + "%";
      } else {
        return;
      }
    },
    //媒体事件监听挂载
    addMediaEventListener() {
      if (this.$refs.mediaDom) {
        let mDom = this.$refs.mediaDom;
        //结束之后的处理
        mDom.addEventListener("ended", () => {
          if (this.mediaType == "audio") {
            //音频处理
            this.$emit("next", this.playModel);
          }
        });
        //加载完成事件
        mDom.addEventListener("loadedmetadata", () => {
          this.duration = mDom.duration;
          this.volume = mDom.volume;
        });
        mDom.addEventListener("play", () => {
          this.currentStatus = "playing";
        });
        mDom.addEventListener("pause", () => {
          this.currentStatus = "pause";
        });
        //实时刷新事件
        mDom.addEventListener("timeupdate", () => {
          this.currentTime = mDom.currentTime; //赋值当前时间
          //进度条处理
        });
        //音量改变事件
        mDom.addEventListener("volumechange", () => {
          this.volume = mDom.volume;
          this.currentVolumeStatus = this.volume < 0.01 ? "muted" : "normal"; //由于手动很难点到0，所以设置阈值
        });
      } else {
        return new Error("媒体未加载");
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.controller {
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
    .time-box {
      position: absolute;
      font-size: 14px;
      color: #fff;
      bottom: 22px;
      left: 2px;
    }
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