<template>
   <div class="projectList">
      <div id="pageName">
         <span>项目列表</span>
      </div>
      <myToolBar v-if="$store.getters.getUserInfo.departId !== 2">
         <myButton @click="addDialog = true" >新建配单项目</myButton>
      </myToolBar>
      <!-- pageTable -->
      <div class="pageTable">
         <myTable title="项目列表">
            <el-table border size="small" :data="tableListData" style="width: 100%" height="100%">
               <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
               <el-table-column prop="sId" label="项目编码" width="180"></el-table-column>
               <el-table-column prop="taskName" label="项目名称" width="180"></el-table-column>
               <el-table-column prop="createdTime" label="新建时间"></el-table-column>
               <el-table-column prop="validTime" label="有效期"></el-table-column>
               <el-table-column prop="state" label="状态">
                  <template v-slot="scope">
                     <span v-show="scope.row.state==0">未接单</span>
                     <span v-show="scope.row.state==1">已接单</span>
                     <span v-show="scope.row.state==2">已配单</span>
                     <span v-show="scope.row.state==90">已完成</span>
                  </template>
               </el-table-column>
               <el-table-column prop="taskDescription" label="描述"></el-table-column>
               <el-table-column prop="userName" label="申请人"></el-table-column>
               <el-table-column prop="isBid" label="是否投标">
                  <template v-slot="scope">
                     <span v-show="scope.row.isBid===0">是</span>
                     <span v-show="scope.row.isBid===1">否</span>
                  </template>
               </el-table-column>
               <el-table-column prop="name" label="操作" width="230" align="center" >
                  <template v-slot='scope'>
                     <el-button size="mini" @click="projectDetails(scope.row)">查看</el-button>
                     <el-button size="mini" @click="delProjectBtn(scope.row)" v-if="$store.getters.getUserInfo.departId !== 2">删除</el-button>
                     <el-button size="mini" 
                        @click="addTechnologyTask(scope.row)" 
                        :disabled="scope.row.state !== 0"
                        v-if="$store.getters.getUserInfo.departId !== 1"
                     >
                        {{scope.row.state === 0?'接单':'已接单'}}
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
            <template v-slot:footer>
               <el-pagination
                  background
                  :current-page.sync="searchForm.currentPage"
                  :page-size.sync="searchForm.pageSize"
                  :page-sizes="[5, 15, 20, 25, 30, 50]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
               ></el-pagination>
            </template>
         </myTable>
      </div>
      <!-- 新建配单弹窗 -->
      <el-dialog
         title="新建配单项目"
         :visible.sync="addDialog"
         width="550px"
         :before-close="beforeClose"
         @closed="revert"
      >
         <el-form ref="form" :model="dialogData" label-width="80px" size="small">
            <el-form-item label="项目名称：">
               <el-input v-model.trim="dialogData.taskName"></el-input>
            </el-form-item>
            <el-form-item label="有效期：">
               <el-date-picker
                  v-model="dialogData.validTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width:100%"
                  :picker-options="pickerOptions"
                  :editable="false"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
               ></el-date-picker>
            </el-form-item>
            <el-form-item label="描述：">
               <el-input v-model="dialogData.taskDescription" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="申请人：">
               <el-input v-model="$store.state.userInfo.uName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="是否投标：">
               <el-radio-group v-model.number="dialogData.isBid">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label style="margin:0;color:#999999">
               <span>请确认上传文件为压缩包格式</span>
            </el-form-item>
            <el-form-item label="详情附件：">
               <div class="fileUpload" @click="uploadFileBox">
                  <img v-show="!addDialogSelFile" src="../../assets/content/fileUpdate.png" alt />
                  <img v-show="addDialogSelFile" src="../../assets/content/fileUpdating.png" alt />
                  <span
                     class="fileName"
                     v-show="addDialogSelFile"
                  >{{addDialogSelFile==null?"":addDialogSelFile.name}}</span>
                  <div class="progressBar" v-show="addDialogSelFile">
                     <div class="bar">
                        <div
                           class="progress"
                           :style="{backgroundColor: uploadedState?'#0079fe':'red',width:`${uploadProgress}%`}"
                        ></div>
                     </div>
                  </div>
                  <i
                     class="el-icon-close closeUpload"
                     v-show="addDialogSelFile"
                     @click.stop="delSelFile"
                  ></i>
                  <input
                     type="file"
                     class="fileUploadTool"
                     ref="fileUploadTool"
                     name
                     @change="fileChange"
                  />
               </div>
            </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
            <myButton @click="addDialog = false">取消</myButton>
            <myButton @click="addSalesTask">确定</myButton>
         </span>
      </el-dialog>
      <!-- 取消上传 -->
      <el-dialog title="警告" :visible.sync="closePrompt" width="500px">
         <span class="delSpan">当前有文件正在上传，关闭可能会导致上传失败。</span>
         <br><br>
         <span class="delSpan">是否继续？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="cancelBtn">取消</myButton>
            <myButton @click="closeDialog">确定</myButton>
         </span>
      </el-dialog>
      <!-- 删除弹窗 -->
      <el-dialog title="警告" :visible.sync="delDialog" width="400px">
         <span class="delSpan">删除后无法恢复，确定要继续吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="delDialog = false">取消</myButton>
            <myButton @click="delProject">确定</myButton>
         </span>
      </el-dialog>
   </div>
</template>

<script>
import axios from "axios";
export default {
   name: "projectList",
   data() {
      return {
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() < Date.now();
            }
         },
         searchForm: {
            currentPage: 1,
            pageSize: 20
         },
         addDialog: false, // 新增框是否显示
         dialogData: {}, // 新增框数据
         addDialogSelFile: null, // 是否有文件
         isUploading: false, // 是否正在上传
         uploadProgress: 0, // 文件上传进度
         axiosSource: null, // axios的source
         tableListData: [], // table列表数据
         total: null, // 总文件数
         closePrompt: false,  // 关闭上传提示框
         delDialog: false,    // 删除弹窗是否显示
         uploadedState: true,    // true为成功， false为失败
      };
   },
   created() {
      this.getSalesTaskAll();
   },
   methods: {
      // 获取项目列表数据
      getSalesTaskAll() {
         this.$request.getSalesTaskAll(this.searchForm).then(res => {
            console.log(res);
            if (res.data.code == 200) {
               this.tableListData = res.data.resp.rows;
               this.total = res.data.resp.total;
            }
         });
      },

      // 新增项目--->点击文件选框进行文件选择
      uploadFileBox() {
         if (!this.isUploading) {
            document.getElementsByClassName("fileUploadTool")[0].click();
         }
      },

      // 新增项目--->文件选择发生变化
      fileChange() {
         this.addDialogSelFile = this.$refs.fileUploadTool.files[0] || null;
      },

      // 新增项目--->删除选择的文件
      delSelFile() {
         if (!this.isUploading) {
            // 如果未上传，清空input：file的值
            this.$refs.fileUploadTool.value = null;
            this.addDialogSelFile = null;
            console.log("删除文件");
         } else {
            // 如果正在上传文件，就要停止文件上传
            this.axiosSource.cancel("取消上传");
         }

         // 将进度调整为0，并且还原正常颜色
         this.uploadProgress = 0
         this.uploadedState = true
      },

      // 新建 项目功能
      addSalesTask() {
         let params = {
            sId: null,
            taskName: this.dialogData.taskName || "",
            validTime: this.dialogData.validTime || null,
            taskDescription: this.dialogData.taskDescription || "",
            isBid: this.dialogData.isBid === undefined? null: this.dialogData.isBid,
            adjunctFile: this.$refs.fileUploadTool.files[0] || null
         };
         console.log(params);

         // 数据校验
         if (params.taskName == "") {
            this.$myMessage.warningMessage("项目名称不能为空");
            return
         } else if (params.taskName.indexOf(" ") !== -1) {
            this.$myMessage.warningMessage("项目名称不能有空格");
            return
         } else if (params.validTime == null) {
            this.$myMessage.warningMessage("有效期不能为空");
            return
         } else if (params.taskDescription == "") {
            this.$myMessage.warningMessage("项目描述不能为空");
            return
         } else if (params.isBid == null) {
            this.$myMessage.warningMessage("请选择是否投标");
            return
         }

         // 数据存入 formData
         let formData = new FormData();
         // formData.append("sId", null);
         formData.append("taskName", params.taskName);
         formData.append("validTime", params.validTime);
         formData.append("taskDescription", params.taskDescription);
         formData.append("isBid", params.isBid);
         if(params.adjunctFile != null) {
            formData.append("adjunctFile", params.adjunctFile);
         }

         const CancelToken = axios.CancelToken;
         this.axiosSource = CancelToken.source();
         let config = {
            headers: { "Content-Type": "multipart/form-data" },
            cancelToken: this.axiosSource.token,
            onUploadProgress: e => {
               if (params.adjunctFile != null) {
                  this.uploadProgress = ((e.loaded / e.total) * 100) | 0;
               }
            }
         };

         // 发送formData
         this.isUploading = true;
         this.$request.addSalesTask(formData, config).then(res => {
               // console.log(res,'新增数据');
               if (res.data.code == 200) {
                  this.addDialog = false;
                  this.getSalesTaskAll();
                  this.$myMessage.successMessage("新建项目成功");
               } else {
                  this.isUploading = false;
                  this.uploadedState = false
                  this.$myMessage.errorMessage("新建项目失败");
               }
            })
            .catch(res => {
               this.isUploading = false;
               this.uploadedState = false
               this.$myMessage.errorMessage("新建项目失败");
            });
      },

      // 关闭弹窗前的回调
      beforeClose(done) {
         if(this.isUploading) {
            this.closePrompt = true
         } else {
            done()
         }
      },

      // 执行done(),关闭弹窗
      closeDialog() {
         if(this.isUploading && this.axiosSource != null) {
            this.axiosSource.cancel("取消上传");
         }
         this.closePrompt = false
         this.addDialog = false;
      },

      // 取消按钮无法触发beforeClose，需单独编写功能
      cancelBtn() {
         if(this.isUploading) {
            this.closePrompt = true
         } else {
            this.addDialog = false
         }
      },


      // 还原数据
      revert() {
         // 还原弹窗文件框数据
         this.$refs.fileUploadTool.value = null;
         this.addDialogSelFile = null;

         // 还原文件上传进度
         this.uploadProgress = 0;

         // 还原文件上传状态
         this.isUploading = false;

         // 还原是否成功状态
         this.uploadedState = true

         // 还原axios的source
         this.axiosSource = null;

         // 还原文件上传的其他参数
         this.dialogData = {};
      },

      // 删除按钮
      delProjectBtn(row) {
         this.delDialog = true
         this.currentRow = row
      },

      // 删除项目功能
      delProject() {
         this.$request.deleteSalesTask({sId: this.currentRow.sId}).then(res => {
            if(res.data.code == 200) {
               this.delDialog = false
               this.getSalesTaskAll();
               this.$myMessage.successMessage('删除项目成功')
            } else {
               this.$myMessage.errorMessage('删除项目失败')
            }
         })
      },

      // 点击接单按钮 ---> 技术人员接单
      addTechnologyTask(row) {
         this.$request.addTechnologyTask({sId: row.sId}).then(res => {
            if(res.data.code == 200) {
               this.getSalesTaskAll();
               this.$myMessage.successMessage('接单成功')
            } else {
               this.$myMessage.successMessage('接单失败')
            }
         })
      },

      // 点击详情按钮 ---> 技术or销售人员查看任务详情
      projectDetails(row) {
         this.$store.commit('changeProjectDetailsId', row.sId)
         this.$router.push("/index/project-details");
      },
     
   },
   watch: {
      searchForm: {
         handler: function() {
            this.getSalesTaskAll();
         },
         deep: true
      }
   }
};
</script>

<style lang="less">
.projectList {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
   .fileUpload {
      height: 86px;
      border: 1px dashed #c0c4cc;
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .fileName {
         line-height: 1;
         // position: absolute;
         // bottom: 5px;
         margin: 0 auto;
         color: #999999;
         margin-bottom: 4px;
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
            // background-color: #cccccc;
            height: inherit;
            .progress {
               height: inherit;
               transition: all .3s;
            }
         }
      }
      .closeUpload {
         display: inline-block;
         width: 40px;
         height: 30px;
         font-size: 16px;
         position: absolute;
         top: 0px;
         right: 0px;
         border-radius: 8px;
         line-height: 30px;
         text-align: center;
         transition: all 0.3s;
      }
      .closeUpload:hover {
         color: #0079fe;
         transform: rotate(180deg);
      }
      .fileUploadTool {
         display: none;
      }
   }
}
</style>
