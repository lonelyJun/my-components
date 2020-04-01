<template>
  <div>
    <div
      class="container"
      @mouseup.stop="handleMouseup"
      @mousemove.stop="handleMousemove($event)"
      @mousedown.stop="handleContainerClick"
    >
      <div
        class="imgArea"
        @dblclick.stop="
          () => {
            adjustObj = 'picture';
            adjustFlag = true;
          }
        "
      >
        <div class="cover"></div>
        <div class="leftBlock" ref="leftBlock"></div>
        <div class="imgProcessBlock" ref="imgProcessBlock">
          <div
            :class="{
              imgStoreBlock: true,
              dash: !(adjustFlag && adjustObj == 'picture')
            }"
            ref="imgStoreBlock"
            @mousedown.stop="handleMousedown($event, 'middleMiddle', 'picture')"
          >
            <div class="coverLay"></div>
            <!-- 边框区域 -->
            <div
              v-if="!singlePictureFlag"
              class="borderProcessBlock"
              ref="borderProcessBlock"
              @dblclick.stop="
                () => {
                  adjustObj = 'border';
                  adjustFlag = true;
                }
              "
            >
              <div
                :class="{
                  borderStoreBlock: true,
                  dash: !(adjustFlag && adjustObj == 'border')
                }"
                ref="borderStoreBlock"
                @mousedown.stop="
                  handleMousedown($event, 'middleMiddle', 'border')
                "
              >
                <div v-if="adjustFlag && adjustObj == 'border'">
                  <div
                    v-show="adjustFlag"
                    v-for="p in controlPoint"
                    :class="setClass(p)"
                    :key="p"
                    @mousedown.stop="handleMousedown($event, p, 'border')"
                  ></div>
                  <div v-show="adjustFlag" class="xAxis"></div>
                  <div v-show="adjustFlag" class="yAxis"></div>
                  <div class="mention border" v-if="mentionFlag">
                    调整图片尺寸
                  </div>
                  <div
                    class="mention border"
                    v-if="moveFlag && adjustObj == 'border'"
                  >
                    宽:{{ rtbWidth }}
                    <br />
                    高:{{ rtbHeight }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 边框区域 -->
            <!-- 调整区域 -->
            <div v-if="adjustFlag && adjustObj == 'picture'">
              <div
                v-for="p in controlPoint"
                :class="setClass(p)"
                :key="p"
                @mousedown.stop="handleMousedown($event, p, 'picture')"
              ></div>
              <div class="xAxis"></div>
              <div class="yAxis"></div>
              <div class="mention" v-if="mentionFlag">调整边框尺寸</div>
              <div class="mention" v-if="moveFlag && adjustObj == 'picture'">
                宽:{{ rtpWidth }}
                <br />
                高:{{ rtpHeight }}
              </div>
            </div>
            <!-- 调整区域 -->
          </div>
        </div>
        <div class="rightBlock" ref="rightBlock"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PictureResizeComponent",
  data() {
    return {
      adjustFlag: true, //标识位，用于控制被调整中的以及调整后的样式
      mentionFlag: true, //标识位，提示窗口显示
      moveFlag: false, //标识位，是否移动状态
      singlePictureFlag: false, //状态判断 是否是单图缩放（即只有底图）/（有底图和边框图）

      maxWidth: 0, //最外侧最大宽度

      initPictureWidth: 0, //数据传入时的初始图片宽度
      initPictureHeight: 0, //数据传入时的初始图片高度
      initBorderWidth: 0, //数据传入时的初始边框宽度
      initBorderHeight: 0, //数据传入时的初始边框高度

      rtpWidth: 0, //底图实时宽度
      rtpHeight: 0, //底图实时高度
      rtbWidth: 0, //边框实时宽度
      rtbHeight: 0, //边框实时高度

      oriX: 0, //按下鼠标初始的X坐标
      oriY: 0, //按下鼠标图片初始的Y坐标

      oriLeft: 0, //图片初始的左边宽度
      oriRight: 0, //图片初始的右边宽度
      oriWidth: 0, //图片初始宽度
      oriHeight: 0, //图片初始高度
      oriPaddingTop: 0, // 图片初始距离顶部距离
      oriOutsideHeight: 0, //底图父Dom高度

      oriBorderLeft: 0, //边框初始距离左侧距离
      oriBorderTop: 0, //边框初始距离顶部距离
      oriBorderWidth: 0, //边框初始宽度
      oriBorderHeight: 0, //边框初始高度

      adjustObj: "", //当前调整中的对象，border为边框，picture为图片
      currentMoveType: "", //记录移动模式，移动模式见controlPoint
      controlPoint: [
        //移动模式选择器
        "leftTop",
        "middleTop",
        "rightTop",
        "leftMiddle",
        "middleMiddle",
        "rightMiddle",
        "leftBottom",
        "middleBottom",
        "rightBottom"
      ]
    };
  },

  mounted() {
    //此处赋值图片的路径,可作为属性传参
    let picUrl = require("./images/testPic.png");
    let borderUrl = require("./images/testBorder.png");

    // 底图处理
    //此处直接设置了图片的宽高,实际为传参
    this.initPictureWidth = 800;
    this.initPictureHeight = 450;
    let pictureRadio = this.initPictureWidth / this.initPictureHeight; //底图宽高比

    //初始状态下，应该重置图片宽高
    //实际为传参;
    //此处默认居中
    this.$refs.leftBlock.style.width =
      (this.maxWidth - this.initPictureWidth) / 2 + "px";
    this.$refs.rightBlock.style.width =
      (this.maxWidth - this.initPictureWidth) / 2 + "px";
    this.$refs.imgStoreBlock.style.height = this.initPictureHeight + "px";
    this.$refs.imgStoreBlock.style.backgroundImage = "url(" + picUrl + ")";
    //用于初始化底图的实时宽高值
    this.rtpWidth = this.initPictureWidth;
    this.rtpHeight = this.initPictureHeight;

    if (!this.singlePictureFlag) {
      //如果有边框图

      //边框图处理
      this.initBorderWidth = 1390;
      this.initBorderHeight = 341;
      let borderRadio = this.initBorderWidth / this.initBorderHeight; //边框图宽高比
      //控制border图案的位置，大小，border图案不应该超出底图
      if (pictureRadio <= borderRadio) {
        //图片宽高比小于边框宽高比（分子相同，分母小的值大，所以同等宽度下底图高大，可以涵盖住边框图）
        this.$refs.borderProcessBlock.style.width = "100%";
        this.$refs.borderProcessBlock.style.height =
          (this.initBorderHeight * this.initPictureWidth) /
            this.initBorderWidth +
          "px";
      } else {
        //反之，如果同样大小，边框高度会超过地图，此时设置高度相同，则边框图能完全在地图内部
        this.$refs.borderProcessBlock.style.height =
          this.initPictureHeight + "px";
        this.$refs.borderProcessBlock.style.width =
          (this.initBorderWidth * this.initPictureHeight) /
            this.initBorderHeight +
          "px";
      }

      this.$refs.borderStoreBlock.style.backgroundImage =
        "url(" + borderUrl + ")";
      //用于初始化边框图的实时宽高值
      this.rtbWidth = this.$refs.borderProcessBlock.offsetWidth;
      this.rtbHeight = this.$refs.borderProcessBlock.offsetHeight;
    }
  },

  methods: {
    setClass(v) {
      let obj = {};
      obj[v] = true;
      obj["point"] = true;
      return obj;
    },
    handleContainerClick() {
      this.adjustFlag = false;
    },
    handleMousedown(e, p, obj) {
      // this.adjustObj = obj;
      this.moveFlag = true; //当点击可移动的对象时，将移动标识符设置为同意，执行mousemove中的计算函数
      this.currentMoveType = p; //当前的移动方式
      this.oriX = e.screenX; //记录点击时的X坐标，用于计算mousemove时的偏移量
      this.oriY = e.screenY; //记录点击时的Y坐标，用于计算mousemove时的偏移量
      this.mentionFlag = false; //开始移动时，提示框消失

      if (obj == "picture") {
        //当移动对象为底图时需要计算的初始值
        this.oriLeft = this.$refs.leftBlock.offsetWidth; //底图左侧余量
        this.oriRight = this.$refs.rightBlock.offsetWidth; //底图右侧余量
        this.oriWidth = this.$refs.imgStoreBlock.offsetWidth; //底图宽度
        this.oriHeight = this.$refs.imgStoreBlock.offsetHeight; //底图高度
        this.oriOutsideHeight = this.$refs.imgProcessBlock.offsetHeight; //底图的外部区域高度
        this.oriPaddingTop = this.$refs.imgStoreBlock.offsetTop; //底图距离顶部高度
        if (!this.singlePictureFlag) {
          this.oriBorderTop = this.$refs.borderProcessBlock.offsetTop; //边框距离顶部高度
          this.oriBorderLeft = this.$refs.borderProcessBlock.offsetLeft; //边框距离左侧高度
        }
      } else if (obj == "border") {
        //当移动对象时边框时需要计算的初始值
        this.oriBorderLeft = this.$refs.borderProcessBlock.offsetLeft; //边框距离左侧的距离
        this.oriBorderTop = this.$refs.borderProcessBlock.offsetTop; //边框距离顶部的距离
        this.oriBorderWidth = this.$refs.borderProcessBlock.offsetWidth; //边框宽度
        this.oriBorderHeight = this.$refs.borderProcessBlock.offsetHeight; //边框高度
      } else {
        return;
      }
    },
    handleMouseup() {
      this.moveFlag = false; //鼠标弹起时，取消mousemove计算事件。这个最好加到最外层，用bus监听传值
      this.$refs.imgProcessBlock.style.paddingTop = 0; //弹起时，去掉冗余的顶部空白
    },
    handleMousemove(e) {
      if (this.moveFlag && this.adjustObj == "picture") {
        //移动对象是图片时
        //坐标偏移量
        let x = e.screenX - this.oriX;
        let y = e.screenY - this.oriY;

        //记录图片实时宽高
        this.rtpWidth = this.$refs.imgStoreBlock.offsetWidth;
        this.rtpHeight = this.$refs.imgStoreBlock.offsetHeight;

        let bWidth, bHeight, bTop, bLeft, maxBorderLeft, maxBorderTop;

        if (!this.singlePictureFlag) {
          //如果考虑计算边框图位置不超标
          bWidth = this.$refs.borderProcessBlock.offsetWidth; //边框宽度
          bHeight = this.$refs.borderProcessBlock.offsetHeight; //边框高度
          bTop = this.$refs.borderProcessBlock.offsetTop; //边框上边距
          bLeft = this.$refs.borderProcessBlock.offsetLeft; //边框左边距

          maxBorderTop = this.oriHeight - bHeight; //边框上下最大余量
          maxBorderLeft = this.oriWidth - bWidth; //边框左右最大余量
        } else {
          bWidth = 0; //边框宽度
          bHeight = 0; //边框高度
          bTop = 0; //边框上边距
          bLeft = 0; //边框左边距

          maxBorderTop = 0; //边框上下最大余量
          maxBorderLeft = 0; //边框左右最大余量
        }

        //设置上下左右的极限值
        //左侧移动时，底图宽度的限制值
        let limit = {
          left:
            this.oriLeft + x < 0
              ? 0
              : this.oriLeft + x > this.maxWidth - this.oriRight
              ? this.maxWidth - this.oriRight
              : this.oriLeft + x,
          top: this.oriHeight - y < bHeight ? bHeight : this.oriHeight - y,
          right:
            this.oriRight - x < 0
              ? 0
              : this.oriRight - x > 800 - this.oriLeft
              ? 800 - this.oriLeft
              : this.oriRight - x,
          bottom: this.oriHeight + y < bHeight ? bHeight : this.oriHeight + y
        };

        switch (this.currentMoveType) {
          case "leftTop":
            this.$refs.leftBlock.style.width = limit.left + "px";
            this.$refs.imgStoreBlock.style.height = limit.top + "px";
            this.$refs.imgProcessBlock.style.paddingTop =
              (this.oriPaddingTop + y > this.oriHeight - bHeight
                ? this.oriHeight - bHeight
                : this.oriPaddingTop + y) + "px";
            if (!this.singlePictureFlag) {
              //边框左侧控制
              if (bWidth + bLeft > this.oriWidth - x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft - x + "px";
              }
              //边框上侧控制
              if (bHeight + bTop > this.oriHeight - y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop - y + "px";
              }
            }

            break;
          case "leftMiddle":
            this.$refs.leftBlock.style.width = limit.left + "px";
            if (!this.singlePictureFlag) {
              // 边框左侧控制
              if (bWidth + bLeft > this.oriWidth - x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft - x + "px";
              }
            }

            break;
          case "leftBottom":
            this.$refs.leftBlock.style.width = limit.left + "px";
            this.$refs.imgStoreBlock.style.height = limit.bottom + "px";
            if (!this.singlePictureFlag) {
              //边框左侧控制
              if (bWidth + bLeft > this.oriWidth - x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft - x + "px";
              }
              // 边框下侧控制
              if (bHeight + bTop > this.oriHeight + y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop + y + "px";
              }
            }

            break;
          case "middleTop":
            this.$refs.imgStoreBlock.style.height = limit.top + "px";
            this.$refs.imgProcessBlock.style.paddingTop =
              (this.oriPaddingTop + y > this.oriHeight - bHeight
                ? this.oriHeight - bHeight
                : this.oriPaddingTop + y) + "px";
            if (!this.singlePictureFlag) {
              //边框上侧控制
              if (bHeight + bTop > this.oriHeight - y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop - y + "px";
              }
            }

            break;
          case "middleMiddle":
            this.$refs.leftBlock.style.width =
              (this.oriLeft + x < 0
                ? 0
                : this.oriLeft + x > 800 - this.oriWidth
                ? 800 - this.oriWidth
                : this.oriLeft + x) + "px";
            this.$refs.rightBlock.style.width =
              (this.oriRight - x < 0
                ? 0
                : this.oriRight - x > 800 - this.oriWidth
                ? 800 - this.oriWidth
                : this.oriRight - x) + "px";
            this.$refs.imgProcessBlock.style.paddingTop =
              this.oriPaddingTop + y + "px";
            // this.$refs.borderProcessBlock.style.top =
            //   (this.oriBorderTop - y < 0 ? 0 : this.oriBorderTop - y) + "px";

            break;
          case "middleBottom":
            this.$refs.imgStoreBlock.style.height = limit.bottom + "px";
            if (!this.singlePictureFlag) {
              //边框下侧控制
              if (bHeight + bTop > this.oriHeight + y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop + y + "px";
              }
            }

            break;
          case "rightTop":
            this.$refs.rightBlock.style.width = limit.right + "px";
            this.$refs.imgStoreBlock.style.height = limit.top + "px";
            this.$refs.imgProcessBlock.style.paddingTop =
              (this.oriPaddingTop + y > this.oriHeight - bHeight
                ? this.oriHeight - bHeight
                : this.oriPaddingTop + y) + "px";
            if (!this.singlePictureFlag) {
              //边框右侧控制
              if (bWidth + bLeft > this.oriWidth + x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft + x + "px";
              }
              //边框上侧控制
              if (bHeight + bTop > this.oriHeight - y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop - y + "px";
              }
            }
            break;
          case "rightMiddle":
            this.$refs.rightBlock.style.width = limit.right + "px";
            if (!this.singlePictureFlag) {
              //图片右侧控制
              if (bWidth + bLeft > this.oriWidth + x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft + x + "px";
              }
            }
            break;
          case "rightBottom":
            this.$refs.rightBlock.style.width = limit.right + "px";
            this.$refs.imgStoreBlock.style.height = limit.bottom + "px";
            if (!this.singlePictureFlag) {
              //图片右侧控制
              if (bWidth + bLeft > this.oriWidth + x) {
                this.$refs.borderProcessBlock.style.left =
                  maxBorderLeft + x + "px";
              }
              //图片下侧控制
              if (bHeight + bTop > this.oriHeight + y) {
                this.$refs.borderProcessBlock.style.top =
                  maxBorderTop + y + "px";
              }
            }
            break;
          default:
            return;
        }
        if (!this.singlePictureFlag) {
          //防止边框图片溢出
          if (this.$refs.borderProcessBlock.offsetLeft < 0) {
            //防止图片左溢出
            this.$refs.borderProcessBlock.style.left = "0";
          }
          if (this.$refs.borderProcessBlock.offsetTop < 0) {
            //防止图片上溢出
            this.$refs.borderProcessBlock.style.top = "0";
          }
        }
      } else if (this.moveFlag && this.adjustObj == "border") {
        //处理border缩放
        let x = e.screenX - this.oriX;
        let y = e.screenY - this.oriY;
        let maxX = this.$refs.imgProcessBlock.offsetWidth;
        let maxY = this.$refs.imgProcessBlock.offsetHeight;
        let h, v;

        this.rtbWidth = this.$refs.borderProcessBlock.offsetWidth;
        this.rtbHeight = this.$refs.borderProcessBlock.offsetHeight;

        let limit = {
          leftLimit: {
            left:
              this.oriBorderLeft + x < 0
                ? 0
                : this.oriBorderLeft + x >
                  this.oriBorderWidth + this.oriBorderLeft
                ? this.oriBorderWidth + this.oriBorderLeft
                : this.oriBorderLeft + x,
            width:
              this.oriBorderWidth - x < 0
                ? 0
                : this.oriBorderWidth - x >
                  this.oriBorderWidth + this.oriBorderLeft
                ? this.oriBorderWidth + this.oriBorderLeft
                : this.oriBorderWidth - x
          },
          topLimit: {
            top:
              this.oriBorderTop + y < 0
                ? 0
                : this.oriBorderTop + y >
                  this.oriBorderHeight + this.oriBorderTop
                ? this.oriBorderHeight + this.oriBorderTop
                : this.oriBorderTop + y,
            height:
              this.oriBorderHeight - y < 0
                ? 0
                : this.oriBorderHeight - y >
                  this.oriBorderHeight + this.oriBorderTop
                ? this.oriBorderHeight + this.oriBorderTop
                : this.oriBorderHeight - y
          },
          rightLimit: {
            right:
              maxX - this.oriBorderLeft - this.oriBorderWidth - x < 0
                ? 0
                : this.oriBorderWidth + x < 0
                ? maxX - this.oriBorderLeft
                : maxX - this.oriBorderLeft - this.oriBorderWidth - x,
            width:
              this.oriBorderWidth + x < 0
                ? 0
                : this.oriBorderWidth + x > maxX - this.oriBorderLeft
                ? maxX - this.oriBorderLeft
                : this.oriBorderWidth + x
          },
          bottomLimit: {
            bottom:
              maxY - this.oriBorderTop - this.oriBorderHeight - y < 0
                ? 0
                : this.oriBorderHeight + y < 0
                ? maxY - this.oriBorderTop
                : +maxY - this.oriBorderTop - this.oriBorderHeight - y,
            height:
              this.oriBorderHeight + y < 0
                ? 0
                : this.oriBorderHeight + y > maxY - this.oriBorderTop
                ? maxY - this.oriBorderTop
                : this.oriBorderHeight + y
          }
        };

        switch (this.currentMoveType) {
          case "leftTop":
            this.$refs.borderProcessBlock.style.left =
              limit.leftLimit.left + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.leftLimit.width + "px";
            this.$refs.borderProcessBlock.style.height =
              limit.topLimit.height + "px";
            this.$refs.borderProcessBlock.style.top = limit.topLimit.top + "px";
            break;
          case "leftMiddle":
            this.$refs.borderProcessBlock.style.left =
              limit.leftLimit.left + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.leftLimit.width + "px";
            break;
          case "leftBottom":
            this.$refs.borderProcessBlock.style.left =
              limit.leftLimit.left + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.leftLimit.width + "px";
            this.$refs.borderProcessBlock.style.height =
              limit.bottomLimit.height + "px";
            this.$refs.borderProcessBlock.style.bottom =
              limit.bottomLimit.bottom + "px";

            break;
          case "middleTop":
            this.$refs.borderProcessBlock.style.height =
              limit.topLimit.height + "px";
            this.$refs.borderProcessBlock.style.top = limit.topLimit.top + "px";
            break;
          case "middleMiddle":
            h =
              this.oriBorderLeft + x < 0
                ? 0
                : this.oriBorderLeft + x > maxX - this.oriBorderWidth
                ? maxX - this.oriBorderWidth
                : this.oriBorderLeft + x;
            v =
              this.oriBorderTop + y < 0
                ? 0
                : this.oriBorderTop + y > maxY - this.oriBorderHeight
                ? maxY - this.oriBorderHeight
                : this.oriBorderTop + y;
            this.$refs.borderProcessBlock.style.left = h + "px";
            this.$refs.borderProcessBlock.style.top = v + "px";
            break;
          case "middleBottom":
            this.$refs.borderProcessBlock.style.height =
              limit.bottomLimit.height + "px";
            this.$refs.borderProcessBlock.style.bottom =
              limit.bottomLimit.bottom + "px";
            break;
          case "rightTop":
            this.$refs.borderProcessBlock.right = limit.rightLimit.right + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.rightLimit.width + "px";
            this.$refs.borderProcessBlock.style.height =
              limit.topLimit.height + "px";
            this.$refs.borderProcessBlock.style.top = limit.topLimit.top + "px";
            break;
          case "rightMiddle":
            this.$refs.borderProcessBlock.right = limit.rightLimit.right + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.rightLimit.width + "px";
            break;
          case "rightBottom":
            this.$refs.borderProcessBlock.right = limit.rightLimit.right + "px";
            this.$refs.borderProcessBlock.style.width =
              limit.rightLimit.width + "px";
            this.$refs.borderProcessBlock.style.height =
              limit.bottomLimit.height + "px";
            this.$refs.borderProcessBlock.style.bottom =
              limit.bottomLimit.bottom + "px";
            break;
          default:
            return;
        }
      } else {
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 920px;
  background-color: #ccc;
  border-radius: 6px;
  box-shadow: 5px 5px 2px #999;
  padding: 22px 60px 38px 60px;
  box-sizing: border-box;
  user-select: none;
  .imgArea {
    width: 800px;
    height: auto;
    display: flex;
    .leftBlock {
      width: 0;
      height: 100%;
    }
    .rightBlock {
      width: 0;
      height: 100%;
    }

    .imgProcessBlock {
      flex: auto;
      position: relative;
      height: auto;
      .imgStoreBlock {
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border: 2px dashed #aad1d6;
        // box-sizing: border-box;
        &.dash {
          border: none;
        }
        .borderProcessBlock {
          width: 100%;
          max-width: 100%;
          position: absolute;
          z-index: 8;
          bottom: 0;
          left: 0;
          .borderStoreBlock {
            width: 100%;
            height: 100%;
            position: relative;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border: 2px dashed #aad1d6;
            box-sizing: border-box;
            &.dash {
              border: none;
            }
          }
        }
        .xAxis {
          width: 100%;
          height: 0;
          border-top: 2px dashed #aad1d6;
          position: absolute;
          z-index: 10;
          top: 50%;
          left: 0;
          transform: translateY(-1px);
        }
        .yAxis {
          width: 0;
          height: 100%;
          border-left: 2px dashed #aad1d6;
          position: absolute;
          z-index: 10;
          top: 0;
          left: 50%;
          transform: translateX(-1px);
        }
        .coverLay {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          position: absolute;
          z-index: 4;
          top: 0;
          left: 0;
        }
        .mention {
          background-color: rgba(255, 255, 255, 0.7);
          padding: 4px 6px;
          color: #000;
          font-size: 12px;
          z-index: 7;
          position: absolute;
          right: 10px;
          top: 10px;
          &.border {
            right: 10px;
            top: -30px;
          }
        }
        .point {
          width: 8px;
          height: 8px;
          background-color: #ffe329;
          position: absolute;
          z-index: 10;
          &.leftTop {
            left: 0;
            top: 0;
            transform: translate(-4px, -4px);
            cursor: se-resize;
          }
          &.leftMiddle {
            left: 0;
            top: 50%;
            transform: translate(-4px, -4px);
            cursor: e-resize;
          }
          &.leftBottom {
            left: 0;
            bottom: 0;
            transform: translate(-4px, 4px);
            cursor: ne-resize;
          }
          &.middleTop {
            left: 50%;
            top: 0;
            transform: translate(-4px, -4px);
            cursor: s-resize;
          }
          &.middleMiddle {
            left: 50%;
            top: 50%;
            transform: translate(-4px, -4px);
            cursor: move;
          }
          &.middleBottom {
            left: 50%;
            bottom: 0;
            transform: translate(-4px, 4px);
            cursor: n-resize;
          }
          &.rightTop {
            right: 0;
            top: 0;
            transform: translate(4px, -4px);
            cursor: sw-resize;
          }
          &.rightMiddle {
            right: 0;
            top: 50%;
            transform: translate(4px, -4px);
            cursor: w-resize;
          }
          &.rightBottom {
            right: 0;
            bottom: 0;
            transform: translate(4px, 4px);
            cursor: nw-resize;
          }
        }
      }
    }
  }
}
</style>
