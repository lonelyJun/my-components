// 导入组件，组件必须声明 name
import PictureResize from './src/main.vue'

// 为组件添加 install 方法，用于按需引入
PictureResize.install = function (Vue) {
  Vue.component(PictureResize.name, PictureResize)
}

export default PictureResize