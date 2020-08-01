<template>
  <div class="toolBar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "toolBar"
};
</script>

<style lang='less'>
.toolBar {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .el-input {
    width: 180px;
  }

  & > div {
    margin-right: 5px;
  }

  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }
}
</style>