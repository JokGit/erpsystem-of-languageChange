<template>
   <div class="uploadImage" @click="selFile">
      <img :src="imgSrc" alt />
      <i class="el-icon-close closeUpload" @click.stop="delImg"></i>
      <input
         type="file"
         ref="fileUploadTool"
         class="fileUploadTool"
         @change="fileToolChange"
         accept=".png, .jpg, .jpeg"
      />
   </div>
</template>

<script>
import fileUpdate from '../../assets/content/fileUpdate.png'
export default {
   name: "uploadImage",
   props: {
      imgPath: {
         type: String,
         default: null
      },
      imgFile: null
   },
   data() {
      return {
         imgPathData: this.imgPath || null,
      };
   },

   methods: {
      selFile() {
         // 注意：不能使用原生js去选取对象，这样会出现组件数据耦合
         // document.getElementsByClassName('fileUploadTool')[0].click()
         this.$refs.fileUploadTool.click();
      },

      // input：file 选取的文件改变
      // 注意：在文件改变的时候，imput：file文件改变会触发change，但是清除文件不会
      // 注意：当文件选择框打开，但是没有选择任何文件，点击取消的时候input：file会为空
      // 注意：当有图片路径传递进来显示的时候，文件不仅过删除，直接替换本机图片时，要把图片的路劲置空
      //       $emit 是一个异步函数，要等到 $emit 执行完再执行后续代码，否则会出错
      async fileToolChange() {
         if(this.imgPath != null) {
            await this.$emit('update:imgPath',null)
         }
         window.URL.revokeObjectURL(this.imgPathData);
         let inputImgFile = this.$refs.fileUploadTool.files[0] || null
         if(inputImgFile != null) {
            this.imgPathData = URL.createObjectURL(inputImgFile);
         } else {
            this.imgPathData = null
         }
         this.$emit("update:imgFile", inputImgFile);
      },

      // 删除图片
      delImg() {
         this.$refs.fileUploadTool.value = null;
         this.imgPathData = null
         this.$emit('update:imgPath',null)
         this.$emit("update:imgFile",null);
         // 删除图片之后要释放 URL.createObjectURL，因为URL.createObjectURL产生的图片一直在内存中
         window.URL.revokeObjectURL(this.imgPathData);
      }
   },

   computed: {
      imgSrc: {
         get: function() {
            if(this.imgPathData == null){
               return fileUpdate
            } else {
               return this.imgPathData
            }
         },
         set: function(val) {
            this.imgPathData = val
         }
      },
   },

   watch: {
      imgPath: function(nVal,oVal) {
         this.imgPathData = nVal
      },
      imgFile: function(nVal,oVal) {
         if(nVal == null) {
            this.$refs.fileUploadTool.value = null;
         }
      }
   }

};
</script>

<style lang='less'>
.uploadImage {
   height: 70px;
   border: 1px dashed #c0c4cc;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 4px;
   position: relative;
   box-sizing: border-box;
   padding: 5px;
   img {
      max-height: 100%;
      max-width: 100%;
   }
   .progressBar {
      width: 100%;
      height: 3px;
      line-height: 1px;
      position: absolute;
      bottom: 0px;
      border-radius: 2px;
      overflow: hidden;
      .bar {
         background-color: #cccccc;
         height: inherit;
         .progress {
            height: inherit;
         }
      }
   }
   .fileUploadTool {
      display: none;
   }
   .closeUpload {
      display: inline-block;
      width: 26px;
      height: 26px;
      font-size: 16px;
      position: absolute;
      top: 0px;
      right: 0px;
      border-radius: 8px;
      line-height: 16px;
      text-align: center;
      transition: all 0.3s;
   }
   .closeUpload::before {
      line-height: 26px;
   }
   .closeUpload:hover {
      color: #0079fe;
      transform: rotate(180deg);
   }
}
</style>