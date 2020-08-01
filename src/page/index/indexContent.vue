<template>
    <div class="indexContent" :style="{paddingLeft: $attrs.spacing,paddingRight: $attrs.spacing}">
        <!-- <div class="pageName">
            <span>{{$store.getters.getCurrentPageName}}</span>
        </div> -->
        <div class="routerView">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'indexContent',
    inheritAttrs: false,
}
</script>

<style lang='less'>
.indexContent {
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    #pageName {
        width: 100%;
        height: 50px;
        font-size: 26px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }
    .routerView {
        flex: 1;
        box-sizing: border-box;
        overflow: hidden;
        &>div {
            width: 100%;
            height: 100%;
            .pageTable {
                overflow: hidden;
            }
        }
    }

    @media screen and (max-device-width: 1366px) {
      #pageName {
          height: 40px;
          font-size: 22px;
      }
    }
    @media screen and (min-device-width: 1367px) {
      #pageName {
          height: 50px;
          font-size: 26px;
      }
    }
}

</style>