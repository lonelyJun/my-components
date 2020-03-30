// packages/textarea/index.js

// 导入组件，组件必须声明 name
import MediaPlayer from './src/main.vue'

// 为组件添加 install 方法，用于按需引入
MediaPlayer.install = function (Vue) {
  Vue.component(MediaPlayer.name, MediaPlayer)
}

export default MediaPlayer