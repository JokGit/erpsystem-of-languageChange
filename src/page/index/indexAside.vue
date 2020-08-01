<template>
   <div class="indexAside">
      <ul class="options">
         <li
            v-for="(item,index) in userDepart"
            :key="index"
            :class="{'active':$store.getters.getCurrentPagePath == item.path}"
            @click="clickAddClassName($event,item)"
         >
            <img :src="item.imgSrc" alt />
            <span>{{item.name}}</span>
         </li>
      </ul>
   </div>
</template>

<script>
export default {
   name: "indexAside",
   data() {
      return {
         userDepart:[],
         liList: [
            {
               name: "项目管理",
               imgSrc: require("../../assets/aside/projectIcon.png"),
               path: "/index/project-management",
               departId:'4'
            },
            {
               name: "注册管理",
               imgSrc: require("../../assets/aside/projectIcon.png"),
               path: "/index/reg-management",
               departId:'4'
            },
            {
               name: "用户管理",
               imgSrc: require("../../assets/aside/projectIcon.png"),
               path: "/index/user-management",
               departId:'4'
            },
            {
               name: "项目列表",
               imgSrc: require("../../assets/aside/projectIcon.png"),
               path: "/index/project-list",
               departId:'4,1,2'
            },
            {
               name: "产品中心",
               imgSrc: require("../../assets/aside/projectIcon.png"),
               path: "/index/products",
               departId:'4,3'
            }
         ]
      };
   },

   // 不同职位id对应不同职位
   // 1：销售
   // 2：技术
   // 3：产品
   // 4：总经理
   
   created() {
      this.userDepart = this.liList.filter(v=> {
         return v.departId.indexOf(this.$store.getters.getUserInfo.departId.toString()) != -1
      })
      
      // 根据不同的权限，跳转到权限的第一个页面
      if(this.$store.state.currentPagePath == "") {
         this.$router.replace(this.userDepart[0].path)
         this.$store.commit("changeCurrentPagePath", this.userDepart[0].path);
      }
   },

   methods: {
      clickAddClassName(e, item) {
         //  console.log(this.$store.state.currentPagePath,item.path);
         if (this.$store.state.currentPagePath != item.path) {
            // 修改当前页路径（防止刷新还原）
            this.$store.commit("changeCurrentPagePath", item.path);
            this.$router.push(item.path);
         }
      }
   }
};
</script>

<style lang='less'>
.indexAside {
   color: #ffffff;
   font-size: 16px;
   line-height: 50px;
   .options {
      li {
         color: #787878;
         text-align: center;
         background-color: #2d2d2d;
         border-bottom: 1px solid #434343;
         display: flex;
         justify-content: center;
         align-items: center;
         transition: all 0.3s;
         position: relative;
         cursor: pointer;
         overflow: hidden;
         span {
            padding: 0 10px;
         }
      }
      li:hover {
         color: #ffffff;
      }
      li.active {
         color: #ffffff;
      }
      li.active::after {
         content: "";
         display: inline-block;
         width: 15px;
         height: 15px;
         background-color: #fff;
         position: absolute;
         right: -8px;
         transform: rotate(45deg);
      }
   }
}
</style>