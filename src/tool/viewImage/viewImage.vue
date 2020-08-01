<template>
   <transition name="fade">
      <div class="viewImage" ref="viewImage" v-if="boxShow" @keyup="escKey($event)" :tabindex="0">
         <div class="maskLayer" @click="closeBox">
            <img :src="imgPath" @click.stop="imgclick($event)"  alt />
         </div>
      </div>
   </transition>
</template>

<script>
export default {
   name: "viewImage",
   props: ["imgSrc", "visible"],
   data() {
      return {
         boxShow: false,
         imgPath: this.imgSrc
      };
   },
   mounted() {
       
   },
   methods: {
      closeBox() {
         if (this.boxShow == true) {
            this.boxShow = false;
            this.$emit("update:visible", false);
            this.$emit("update:imgSrc", '');
         }
      },

      imgclick(e) {
        // 阻止点击图片区域也会触发父级的关闭事件 （关闭事件冒泡行为）
      },
      
      // 需要添加esc按键退出功能  按键 keycode为27
      escKey(e) {
         if(e.keyCode == 27) {
            this.closeBox()
         }
      }
   },
   watch: {
      visible(nVal, oVal) {
         this.boxShow = nVal;
         if(nVal == true) {
            this.$nextTick(()=>{
               this.$refs.viewImage.focus()
            })
         }
      },
      imgSrc(nVal, oVal) {
          this.imgPath = nVal;
      }
   }
};
</script>

<style lang='less'>
.viewImage {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 10;
   div.maskLayer {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      & > img {
         width: auto;
         height: auto;
         position: absolute;
         max-width: 80%;
         max-height: 80%;
      }
   }
}
.fade-enter-active,
.fade-leave-active {
   transition: all 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
   opacity: 0;
   //   transform: translateY(-10px)
   transform: scale(1.1);
   //   transform: rotateY(90deg);
}
</style>