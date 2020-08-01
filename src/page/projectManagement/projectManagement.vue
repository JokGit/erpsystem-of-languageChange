<template>
   <div class="projectManagement">
      <div id="pageName">
         <span>项目管理</span>
      </div>
      <myToolBar>
         <el-select v-model="searchForm.registrationCodeType" placeholder="请选择" size="small">
            <el-option label="全部类型" :value="null"></el-option>
            <el-option label="永久" :value="0"></el-option>
            <el-option label="30天" :value="1"></el-option>
            <el-option label="60天" :value="2"></el-option>
            <el-option label="90天" :value="3"></el-option>
            <el-option label="120天" :value="4"></el-option>
            <el-option label="180天" :value="5"></el-option>
         </el-select>
         <el-select v-model="searchForm.hostState" placeholder="请选择" size="small">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="在线" :value="0"></el-option>
            <el-option label="离线" :value="1"></el-option>
         </el-select>
         <el-input v-model="searchForm.keyWord" placeholder="序列号/名称" size="small" clearable></el-input>
         <myButton>
            <i class="el-icon-search"></i> 搜索
         </myButton>
         <myButton @click="addBtn">新建</myButton>
         <myButton @click="delBtn">删除</myButton>
      </myToolBar>
      <!-- pageTable -->
      <div class="pageTable">
         <myTable title="项目列表">
            <el-table
               border
               size="small"
               ref="table"
               :data="tableListData"
               style="width: 100%"
               height="100%"
               @row-click="rowClick"
               @selection-change="selectChange"
            >
               <el-table-column type="selection" width="50" align="center"></el-table-column>
               <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
               <el-table-column prop="projectName" label="项目名称" width="150"></el-table-column>
               <el-table-column prop="serialNumber" label="序列号" width="150"></el-table-column>
               <el-table-column prop="useCompany" label="单位" width="100"></el-table-column>
               <el-table-column prop="carryOutCompany" label="公司"></el-table-column>
               <el-table-column prop="region" label="区域"></el-table-column>
               <el-table-column prop="maintainerMember" label="维护员/电话" width="170">
                  <template v-slot="scope">
                     <span>{{scope.row.maintainerMember}} / {{scope.row.maintainerPhone}}</span>
                  </template>
               </el-table-column>
               <el-table-column prop="adminMember" label="管理员/电话" width="170">
                  <template v-slot="scope">
                     <span>{{scope.row.adminMember}} / {{scope.row.adminPhone}}</span>
                  </template>
               </el-table-column>
               <el-table-column prop="adminAccount" label="账号/密码" width="170">
                  <template v-slot="scope">
                     <span>{{scope.row.adminAccount}} / {{scope.row.password}}</span>
                  </template>
               </el-table-column>
               <el-table-column prop="publicNetworkIp" label="外网IP/端口" width="170">
                  <template v-slot="scope">
                     <span>{{scope.row.publicNetworkIp}} / {{scope.row.port}}</span>
                  </template>
               </el-table-column>
               <el-table-column prop="registrationCodeType" label="类型" width="80">
                  <template v-slot="scope">
                     <span v-show="scope.row.registrationCodeType==null"></span>
                     <span v-show="scope.row.registrationCodeType==0">永久</span>
                     <span v-show="scope.row.registrationCodeType==1">30天</span>
                     <span v-show="scope.row.registrationCodeType==2">60天</span>
                     <span v-show="scope.row.registrationCodeType==3">90天</span>
                     <span v-show="scope.row.registrationCodeType==4">120天</span>
                     <span v-show="scope.row.registrationCodeType==5">180天</span>
                  </template>
               </el-table-column>
               <el-table-column prop="hostState" label="状态" width="80" align="center">
                  <template v-slot="scope">
                     <span v-show="scope.row.hostState==null"></span>
                     <span v-show="scope.row.hostState===0">在线</span>
                     <span v-show="scope.row.hostState===1">离线</span>
                  </template>
               </el-table-column>
               <el-table-column prop="name" label="操作" width="200" align="center" column-key="edit" fixed="right">
                  <template v-slot="scope">
                     <el-button size="mini" @click="editBtn(scope.row)">编辑</el-button>
                     <el-button size="mini" @click="doGRCBtn(scope.row)">生成注册码</el-button>
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

      <!-- 新增弹窗 -->
      <el-dialog :title="isEdit?'编辑项目':'新建项目'" :visible.sync="addDialog" width="800px" @closed="clearData">
         <el-row :gutter="30">
            <el-col :span="12">
               <el-form ref="form" :model="addDialogData" label-width="90px" size="small">
                  <el-form-item label="活动名称" required>
                     <el-input v-model.trim="addDialogData.projectName"></el-input>
                  </el-form-item>
                  <el-form-item label="实施名称">
                     <el-input v-model.trim="addDialogData.carryOutCompany"></el-input>
                  </el-form-item>
                  <el-form-item label="维护员">
                     <el-input v-model.trim="addDialogData.maintainerMember"></el-input>
                  </el-form-item>
                  <el-form-item label="管理员">
                     <el-input v-model.trim="addDialogData.adminMember"></el-input>
                  </el-form-item>

                  <el-form-item label="账号" required>
                     <el-input v-model.trim="addDialogData.adminAccount"></el-input>
                  </el-form-item>
                  <el-form-item label="公网IP" required>
                     <el-input v-model.trim="addDialogData.publicNetworkIp"></el-input>
                  </el-form-item>
               </el-form>
            </el-col>
            <el-col :span="12">
               <el-form ref="form" :model="addDialogData" label-width="90px" size="small">
                  <el-form-item label="使用单位">
                     <el-input v-model.trim="addDialogData.useCompany"></el-input>
                  </el-form-item>
                  <el-form-item label="所在区域">
                     <el-input v-model.trim="addDialogData.region"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式">
                     <el-input v-model.trim="addDialogData.maintainerPhone"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式">
                     <el-input v-model.trim="addDialogData.adminPhone"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" required>
                     <el-input v-model.trim="addDialogData.password" maxlength="15"></el-input>
                  </el-form-item>
                  <el-form-item label="端口" required>
                     <el-input v-model.trim="addDialogData.port"></el-input>
                  </el-form-item>
               </el-form>
            </el-col>
         </el-row>
         <el-row>
            <el-form ref="form" :model="addDialogData" label-width="90px" size="small">
               <el-form-item label="序列号">
                  <el-input v-model.trim="addDialogData.serialNumber" :readonly="true"></el-input>
               </el-form-item>
            </el-form>
         </el-row>
         <el-row>
            <el-form ref="form" :model="addDialogData" label-width="90px" size="small">
               <el-form-item label="注册码">
                  <el-input
                     v-model.trim="addDialogData.registrationCode"
                     type="textarea"
                     :readonly="true"
                     resize='none'
                     :autosize="{minRows: 3}"
                  ></el-input>
               </el-form-item>
            </el-form>
         </el-row>
         <span slot="footer" class="dialog-footer">
            <myButton @click="addDialog = false">取消</myButton>
            <myButton @click="setProject">确定</myButton>
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

      <!-- 生成注册码弹窗 -->
      <el-dialog title="生成注册码" :visible.sync="generateCodeDialog" width="500px" @closed="clearGenerateDialogData">
         <el-form ref="form" :model="generateDialogData" label-width="65px" size="small">
            <el-form-item label="有效期">
               <el-select
                  v-model="generateDialogData.registrationCodeType"
                  placeholder="请选择"
                  size="small"
               >
                  <el-option label="永久" :value="0"></el-option>
                  <el-option label="30天" :value="1"></el-option>
                  <el-option label="60天" :value="2"></el-option>
                  <el-option label="90天" :value="3"></el-option>
                  <el-option label="120天" :value="4"></el-option>
                  <el-option label="180天" :value="5"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="序列号">
               <el-input v-model="generateDialogData.serialNumber" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="注册码">
               <el-input
                  ref="registrationCode"
                  class="registrationCode"
                  v-model="generateDialogData.registrationCode"
                  type="textarea"
                  :autosize="{minRows: 4}"
                  :readonly="true"
                  resize='none'
                  @copy.native='copyInput'
               ></el-input>
            </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
            <myButton @click="doGenRegisterCode">生成</myButton>
            <myButton @click="copyBtn">复制</myButton>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: "projectManagement",
   data() {
      return {
         searchForm: {
            registrationCodeType: null,
            hostState: null,
            keyWord: "",
            currentPage: 1,
            pageSize: 20
         },
         total: null, // 数据总条数
         tableListData: [], // 项目管理列表数据
         addDialog: false, // 新增弹窗显示
         delDialog: false, // 删除弹窗显示
         generateCodeDialog: false, // 生成注册码弹窗显示
         addDialogData: {}, // 弹窗数据
         generateDialogData: {}, // 注册弹窗数据
         isEdit: false, // false为新增  true为编辑
         selTableData: [], // 选中的table数据
      };
   },
   created() {
      this.getProjectList();
   },
   methods: {
      // 获取列表数据
      getProjectList() {
         this.$request.getProjectList(this.searchForm).then(res => {
            console.log(res, "重新获取数据");
            if (res.data.code == 200) {
               this.tableListData = res.data.resp.rows;
               this.total = res.data.resp.total;
               this.$refs.table.clearSelection();
            }
         });
      },

      // 行单击事件(点击行切换当前行的选中状态)
      rowClick(row, column, event) {
         if (column.columnKey !== "edit") {
            this.$refs.table.toggleRowSelection(row);
         }
      },

      // 编辑按钮
      editBtn(row) {
         this.isEdit = true;
         this.addDialog = true;
         this.addDialogData = JSON.parse(JSON.stringify(row));
      },

      // 新增项目
      addBtn() {
         this.isEdit = false;
         this.addDialog = true;
      },

      // 清理 新建/设置 弹窗数据
      clearData() {
         this.addDialogData = {}
      },

      // 新建/设置  项目
      setProject() {
         const params = {
            projectId: this.addDialogData.projectId || null,
            projectName: this.addDialogData.projectName || "",
            serialNumber: this.addDialogData.serialNumber || "",
            useCompany: this.addDialogData.useCompany || "",
            carryOutCompany: this.addDialogData.carryOutCompany || "",
            region: this.addDialogData.region || "",
            maintainerMember: this.addDialogData.maintainerMember || "",
            maintainerPhone: this.addDialogData.maintainerPhone || "",
            adminMember: this.addDialogData.adminMember || "",
            adminPhone: this.addDialogData.adminPhone || "",
            adminAccount: this.addDialogData.adminAccount || "",
            password: this.addDialogData.password || "",
            publicNetworkIp: this.addDialogData.publicNetworkIp || "",
            port: this.addDialogData.port || null
         };
         if (!params.projectName.indexOf(" ") == -1) {
            this.$myMessage.warningMessage("项目名称不能有空格");
            return;
         } else if (params.projectName == "") {
            this.$myMessage.warningMessage("项目名称不能为空");
            return;
         } else if (!params.adminAccount.indexOf(" ") == -1) {
            this.$myMessage.warningMessage("管理员账户不能有空格");
            return;
         } else if (params.adminAccount == "") {
            this.$myMessage.warningMessage("管理员账户不能为空");
            return;
         } else if (!params.password.indexOf(" ") == -1) {
            this.$myMessage.warningMessage("管理员密码不能有空格");
            return;
         } else if (params.password == "") {
            this.$myMessage.warningMessage("管理员密码不能为空");
            return;
         } else if (params.password.length < 6 || params.password.length > 15) {
            this.$myMessage.warningMessage("密码长度为6~15位");
            return;
         } else if (!params.publicNetworkIp.indexOf(" ") == -1) {
            this.$myMessage.warningMessage("公网IP不能有空格");
            return;
         } else if (params.publicNetworkIp == "") {
            this.$myMessage.warningMessage("公网IP不能为空");
            return;
         } else if (params.port == null) {
            this.$myMessage.warningMessage("端口号不能为空");
            return;
         }
         this.$request.setProject(params).then(res => {
            if (res.data.code == 200) {
               if (this.isEdit) {
                  this.$myMessage.successMessage("编辑成功");
               } else {
                  this.$myMessage.successMessage("新增成功");
               }
               this.addDialog = false;
               this.getProjectList();
            } else {
               if (this.isEdit) {
                  this.$myMessage.errorMessage("编辑失败");
               } else {
                  this.$myMessage.errorMessage("新增失败");
               }
            }
         });
      },

      // 选中的数据改变
      selectChange(rows) {
         this.selTableData = rows;
      },

      // 删除按钮
      delBtn() {
         if (this.selTableData.length == 0) {
            this.$myMessage.warningMessage("请先勾选要删除的项目");
         } else {
            this.delDialog = true;
         }
      },

      // 删除项目projectId
      delProject() {
         let projectId = this.selTableData.map(val => {
               return val.projectId;
         }).join(",");
         this.$request.delProject({ projectId }).then(res => {
            if (res.data.code == 200) {
               this.delDialog = false;
               this.getProjectList();
               this.$myMessage.successMessage("删除成功");
            } else {
               this.$myMessage.errorMessage("删除失败");
            }
         });
      },

      // 生成注册码按钮
      doGRCBtn(row) {
         this.generateCodeDialog = true;
         this.currentProjectId = row.projectId;
      },

      // 生成注册码
      doGenRegisterCode() {
         let params = {
            projectId: this.currentProjectId,
            registrationCodeType: this.generateDialogData.registrationCodeType || null
         };
         if(params.registrationCodeType == null) {
            this.$myMessage.warningMessage("请选择有效期");
            return
         }
         this.$request.doGenRegisterCode(params).then(res => {
            if (res.data.code == 200) {
               this.generateDialogData.serialNumber =
                  res.data.resp.serialNumber;
               this.generateDialogData.registrationCode =
                  res.data.resp.registrationCode;
               this.getProjectList();
               this.$myMessage.successMessage("生成注册码成功");
            } else {
               this.$myMessage.errorMessage("生成注册码失败");
            }
         });
      },

      // 复制注册码
      copyBtn() {
         if(this.generateDialogData.registrationCode != null) {
            this.$refs.registrationCode.select()
            document.execCommand('Copy')
         } else {
            this.$myMessage.warningMessage('请先生成注册码')
         }
      },

      // 触发文本域的赋值事件
      copyInput() {
         this.$myMessage.successMessage('复制成功')
      },

      // 清除 生成注册码 弹窗数据
      clearGenerateDialogData() {
         this.generateDialogData = {}
      }

   },

   watch: {
      "searchForm.registrationCodeType": function() {
         this.getProjectList();
      },
      "searchForm.hostState": function() {
         this.getProjectList();
      },
      "searchForm.currentPage": function() {
         this.getProjectList();
      },
      "searchForm.pageSize": function() {
         this.getProjectList();
      }
   }
};
</script>

<style lang='less'>
.projectManagement {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
}
</style>