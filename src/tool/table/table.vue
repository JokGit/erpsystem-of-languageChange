<template>
   <div class="diyTable">
      <div class="title">{{$attrs.title}}</div>
      <div class="table">
         <slot></slot>
      </div>
      <div class="footer" v-show="footer">
         <slot name="footer"></slot>
      </div>
   </div>
</template>

<script>
export default {
   name: "diyTable",
   inheritAttrs: false,
   props: {
      footer: {
         type: Boolean,
         default: true
      }
   }
};
</script>

<style lang='less'>
.diyTable {
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   border: 1px solid #ebeef5;
   border-radius: 4px 4px 0 0;
   box-sizing: border-box;
   overflow: hidden;
   .title {
      width: 100%;
      font-size: 16px;
      line-height: 40px;
      background-color: #f5f7fa;
      padding: 0 10px;
      box-sizing: border-box;
   }
   .table {
      flex: 1;
      margin: 0 -1px;
      overflow: hidden;
      .el-table {
         width: 100%;
         height: 100%;
      }
   }
   .footer {
      width: 100%;
      height: 48px;
      background-color: #f5f7fa;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
   }
   .footer::before {
      content: "";
      display: inline-block;
      width: 100%;
      height: 1px;
      background-color: #dddddd;
      position: absolute;
      top: -1px;
      z-index: 1;
   }
   @media screen and (max-device-width: 1366px) {
      .title {
         line-height: 36px;
         font-size: 14px;
      }
      .footer {
        height: 40px;
      }
   }
   @media screen and (min-device-width: 1367px) {
      .title {
         font-size: 16px;
         line-height: 40px;
      }
      .footer {
        height: 48px;
      }
   }
}
</style>