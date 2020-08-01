<template>
   <div class="projectDetails">
      <div id="pageName">
         <span>
            <i class="el-icon-back" @click="previousPage"></i>项目详情
         </span>
      </div>
      <!-- 项目信息 -->
      <el-scrollbar class="index-aside-scroll">
         <div class="projectInfo table">
            <div class="title">项目信息</div>
            <div class="content">
               <el-row :gutter="60">
                  <el-col :span="8" class="col">
                     <el-form :model="salesData" label-width="90px" size="small">
                        <el-form-item label="项目名称">
                           <el-input
                              v-model="salesData.taskName"
                              @change="editSalesTask($event,'taskName')"
                              :disabled="$store.getters.getUserInfo.departId == 2"
                           ></el-input>
                        </el-form-item>
                        <el-form-item label="申请人">
                           <el-input v-model="salesData.UName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="是否投标">
                           <el-select
                              v-model="salesData.isBid"
                              placeholder="请选择"
                              @change="editSalesTask($event,'isBid')"
                              style="width: 100%;"
                              :disabled="$store.getters.getUserInfo.departId == 2"
                           >
                              <el-option label="是" :value="0"></el-option>
                              <el-option label="否" :value="1"></el-option>
                           </el-select>
                        </el-form-item>
                        <el-form-item label="附件" v-if="downloadFileShow">
                           <img class="zipFile" src="../../assets/content/file.png" alt />
                        </el-form-item>
                     </el-form>
                  </el-col>
                  <el-col :span="10" class="col">
                     <el-form :model="salesData" label-width="90px" size="small">
                        <el-form-item label="有效期">
                           <el-date-picker
                              v-model="salesData.validTime"
                              :picker-options="pickerOptions"
                              type="datetime"
                              placeholder="选择日期时间"
                              style="width:100%"
                              :editable="false"
                              format="yyyy-MM-dd HH:mm"
                              value-format="yyyy-MM-dd HH:mm"
                              :clearable="false"
                              @change="editSalesTask($event,'validTime')"
                              :disabled="$store.getters.getUserInfo.departId == 2"
                           ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="描述">
                           <el-input
                              v-model="salesData.taskDescription"
                              type="textarea"
                              @change="editSalesTask($event,'taskDescription')"
                              :readonly="$store.getters.getUserInfo.departId == 2"
                           ></el-input>
                        </el-form-item>
                     </el-form>
                  </el-col>
               </el-row>
            </div>
            <div class="footer" v-if="downloadFileShow">
               <el-form label-width="90px" size="small">
                  <el-form-item label>
                     <myButton @click="downloadSalesFile(salesData.adjunctFile)">下载附件</myButton>
                  </el-form-item>
               </el-form>
            </div>
         </div>
         <!-- 技术反馈 -->
         <div class="technicalFeedback table" v-if="technicalColumnShow">
            <div class="title">技术反馈</div>
            <div class="content">
               <el-row :gutter="60">
                  <el-col :span="8" class="col">
                     <el-form
                        ref="technology"
                        :model="technologyData"
                        label-width="90px"
                        size="small"
                     >
                        <el-form-item label="受理人">
                           <el-input v-model="technologyData.UName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="进度">
                           <el-input v-model="countDown" :readonly="true" ref="countDownEle"></el-input>
                        </el-form-item>
                        <el-form-item label="附件" v-if="technologyData.taskState == 2">
                           <img class="zipFile" src="../../assets/content/excel.png" alt />
                        </el-form-item>
                     </el-form>
                  </el-col>
                  <el-col :span="10" class="col">
                     <el-form :model="technologyData" label-width="90px" size="small">
                        <el-form-item label="受理时间">
                           <el-input v-model="technologyData.createdTime" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="处理意见">
                           <el-input
                              v-model="technologyData.handlingSuggestion"
                              @change="updateTechnologyTask($event,'handlingSuggestion')"
                              type="textarea"
                              :readonly="$store.getters.getUserInfo.departId == 1"
                           ></el-input>
                        </el-form-item>
                     </el-form>
                  </el-col>
               </el-row>
            </div>
            <div class="footer">
               <el-form label-width="90px" size="small">
                  <el-form-item label>
                     <myButton @click="exportExcel" v-if="technologyData.taskState >= 2">导出Excel</myButton>
                     <myButton
                        @click="deployBtn(technologyData)"
                        v-if="$store.getters.getUserInfo.departId !== 1"
                     >开始配单</myButton>
                  </el-form-item>
               </el-form>
            </div>
         </div>
      </el-scrollbar>
   </div>
</template>

<script>
export default {
   name: "projectDetails",
   data() {
      return {
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() < Date.now();
            }
         },
         salesData: {}, // 销售栏数据
         technologyData: {}, // 技术栏数据
         countDown: null, // 技术配单倒计时
         downloadFileShow: false, // 销售栏下载附件
         technicalColumnShow: false, // 是否显示技术栏
         form: {},
         value1: null,
         endTime: null
      };
   },
   created() {
      this.getSalesTaskById();
   },
   methods: {
      // 返回上一页
      previousPage() {
         this.$router.push("/index/project-list");
      },

      // 通过Vuex中的projectDetailsId获取详情页数据
      getSalesTaskById() {
         this.$request
            .getSalesTaskById({ sId: this.$store.state.projectDetailsId })
            .then(res => {
               console.log(res, "文件详情");
               if (res.data.code == 200) {
                  if (res.data.resp.salesOrderDTO !== null) {
                     this.salesData = res.data.resp.salesOrderDTO;
                     if (this.salesData.adjunctFile != null) {
                        this.downloadFileShow = true;
                     }
                  }
                  if (res.data.resp.technologyTaskDTO !== null) {
                     this.technicalColumnShow = true;
                     this.technologyData = res.data.resp.technologyTaskDTO;
                     // let overTime = Math.floor((res.data.resp.technologyTaskDTO.countDown)/1000)
                     let overTime = Math.floor(
                        (new Date(this.salesData.validTime).getTime() -
                           new Date().getTime()) /
                           1000
                     );
                     if (overTime < 0) {
                        this.countDown = "已逾期";
                        return
                     }
                     // 定时器一秒之后执行，页面倒计时处等待时间过长，影响人机交互
                     this.timeConversion(overTime);
                     window.clearInterval(this.oTime);
                     this.oTime = setInterval(() => {
                        overTime--;
                        this.timeConversion(overTime);
                     }, 1000);
                  } else {
                     this.technicalColumnShow = false;
                  }
               }
            });
      },

      // 时间转换
      timeConversion(overTime) {
         let day = Math.floor(overTime / (60 * 60 * 24));
         let hh = Math.floor((overTime % (60 * 60 * 24)) / (60 * 60));
         let mm = Math.floor(((overTime % (60 * 60 * 24)) % (60 * 60)) / 60);
         let ss = Math.floor(((overTime % (60 * 60 * 24)) % (60 * 60)) % 60);
         this.countDown = day + "天" + hh + "时" + mm + "分" + ss + "秒";
      },

      // 下载销售附件
      downloadSalesFile(path) {
         let eleA = document.createElement("a");
         document.body.appendChild(eleA);
         eleA.style.display = "none";
         eleA.href = path;
         eleA.target = "_self";
         // 设置download属性值为空字符串即可使用默认名称下载
         eleA.download = "";
         eleA.click();
         document.body.removeChild(eleA);
      },

      // 技术栏 点击开始配单按钮
      deployBtn(val) {
         this.$router.push(`/index/deploy-terminal/${val.tId}`);

         // path 结合 query 路由传参  类似于 get 请求
         // this.$router.push({
         //    path:'/index/deploy-terminal',
         //    query:{
         //       tId:'10253'
         //    }
         // })

         // name 结合 params 路由传参 类似于 post 请求
         // this.$router.push({
         //    name:'deployTerminal',
         //    params:{
         //       tId:25555
         //    }
         // })
      },

      // 编辑 销售 任务
      editSalesTask(val, key) {
         if (val == null || val == "") {
            if (key == "taskName") {
               this.$myMessage.warningMessage("项目名称不能为空");
               return;
            } else if (key == "taskDescription") {
               this.$myMessage.warningMessage("描述不能为空");
               return;
            }
         }
         let formData = new FormData();
         formData.append("sId", this.$store.state.projectDetailsId);
         formData.append(key, val);
         this.$request.addSalesTask(formData).then(res => {
            if (res.data.code == 200) {
               this.getSalesTaskById();
               this.$myMessage.successMessage("更新项目信息成功");
            } else {
               this.$myMessage.errorMessage("更新项目信息失败");
            }
         });
      },

      // 导出技术配单的 Excel 表格
      exportExcel() {
         this.$request.exportExcel(this.technologyData.tId);
      },

      // 编辑  技术栏
      updateTechnologyTask(val, key) {
         let params = {
            tId: this.technologyData.tId
         };
         params["tId"] = this.technologyData.tId;
         params[key] = val;
         this.$request.updateTechnologyTask(params).then(res => {
            console.log(res, "技术编辑返回参数");
            if (res.data.code == 200) {
               this.$myMessage.successMessage("更新项目信息成功");
            } else {
               this.$myMessage.errorMessage("更新项目信息失败");
            }
         });
      }
   }
};
</script>

<style lang='less'>
.projectDetails {
   overflow: hidden;
   display: flex;
   flex-direction: column;
   /* 设置侧边栏滚动条 */
   .el-scrollbar {
      flex: 1;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
   }
   .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: scroll;
   }
   .el-scrollbar .is-horizontal {
      height: 0;
   }
   .table {
      border: 1px solid #ebeef5;
      margin-bottom: 20px;
      .title {
         line-height: 40px;
         font-size: 16px;
         padding: 0 20px;
         border-bottom: 1px solid #ebeef5;
      }
      .content {
         box-sizing: border-box;
         min-height: 30px;
         padding: 20px;
         .col {
            min-width: 510px;
         }
         .el-form-item:last-of-type {
            margin-bottom: 0;
         }
      }
      .footer {
         padding: 0 20px 20px;
         .el-form .el-form-item {
            margin-bottom: 0;
         }
      }
   }
   .el-icon-back {
      font-weight: 700;
      transition: all 0.3s;
   }
   .el-icon-back:hover {
      color: #5cb6ff;
   }
}
</style>