<template>
   <div class="index">
      <!-- 头部 -->
      <div class="header">
         <indexHeader :logWidth="aside" :spacing="spacing"></indexHeader>
      </div>
      <!-- 底部 -->
      <div class="below">
         <!-- 侧边栏 -->
         <div class="aside" :style="{width: aside}">
            <indexAside></indexAside>
         </div>
         <!-- 子页面内容 -->
         <div class="content">
            <indexContent :spacing="spacing"></indexContent>
         </div>
      </div>
   </div>
</template>

<script>
// 导入主页 indexHeader
import indexHeader from "../page/index/indexHeader.vue";
// 导入主页 indexAside
import indexAside from "../page/index/indexAside.vue";
// 导入主页 indexContent
import indexContent from "../page/index/indexContent.vue";

export default {
   name: "index",
   components: {
      indexHeader,
      indexAside,
      indexContent
   },
   data() {
      return {
         aside: "180px", // 侧边栏的宽度
         spacing: "27px" // 间距大小
      };
   }
};
</script>

<style lang='less'>
.index {
   width: 100%;
   height: 100%;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   & > .header {
      width: 100%;
      height: 48px;
      background: #ffffff;
   }
   & > .below {
      flex: 1;
      overflow: hidden;
      display: flex;
      & > .aside {
         // width: 200px;
         flex-shrink: 0;
         background: #000000;
      }
      & > .content {
         flex: 1;
         background: #f3f3f3;
         overflow: hidden;
      }
   }

   @media screen and (max-device-width: 1366px) {
      .header {
          height: 40px;
      }
   }
   @media screen and (min-device-width: 1367px) {
     .header {
          height: 48px;
      }
   }
}
</style>