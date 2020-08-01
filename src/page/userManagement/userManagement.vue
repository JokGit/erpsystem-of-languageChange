<template>
   <div class="userManagement">
      <div id="pageName">
         <span>用户管理</span>
      </div>
      <myToolBar>
         <el-select v-model="searchForm.departId" placeholder="请选择" size="small">
            <el-option label="所有部门" :value="null"></el-option>
            <el-option
               v-for="(item,index) in departmentList"
               :key="index"
               :label="item.departmentName+'部'"
               :value="item.departmentId"
            ></el-option>
         </el-select>
         <el-input v-model="searchForm.keyWord" placeholder="序列号/名称" size="small" width="120px"></el-input>
         <myButton @click="searchBtn">
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
               ref="table"
               size="small"
               :data="tableListData"
               style="width: 100%"
               height="100%"
               @row-click="rowClick"
               @selection-change="selectChange"
            >
               <el-table-column type="selection"></el-table-column>
               <el-table-column type="index" label="序号"></el-table-column>
               <el-table-column prop="uName" label="姓名"></el-table-column>
               <el-table-column prop="uPhone" label="电话"></el-table-column>
               <el-table-column prop="uCode" label="账号"></el-table-column>
               <!-- <el-table-column prop="uPassword" label="密码"></el-table-column> -->
               <el-table-column prop="departId" label="部门">
                  <template v-slot="scope">
                     <span
                        v-show="scope.row.departId == item.departmentId"
                        v-for="(item,index) in departmentList"
                        :key="index"
                     >{{item.departmentName+'部'}}</span>
                  </template>
               </el-table-column>
               <el-table-column prop="uGender" label="性别">
                  <template v-slot="scope">
                     <span v-show="scope.row.uGender===0">女</span>
                     <span v-show="scope.row.uGender===1">男</span>
                  </template>
               </el-table-column>
               <el-table-column prop="uEmail" label="邮箱"></el-table-column>
               <el-table-column prop="name" label="操作" width="200" align="center" column-key="edit">
                  <template v-slot="scope">
                     <el-button size="mini" @click="editBtn(scope.row)">编辑</el-button>
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
      <!-- 新增用户弹窗 -->
      <el-dialog
         :title="isEdit?'编辑用户':'新建用户'"
         :visible.sync="addDialog"
         width="400px"
         @closed="closeDialog"
      >
         <el-form ref="form" :model="addDialogData" label-width="60px" size="small">
            <el-form-item label="姓名" required>
               <el-input v-model.trim="addDialogData.uName"></el-input>
            </el-form-item>
            <el-form-item label="电话" required>
               <el-input v-model.trim="addDialogData.uPhone"></el-input>
            </el-form-item>
            <el-form-item label="账号" required>
               <el-input v-model.trim="addDialogData.uCode"></el-input>
            </el-form-item>
            <el-form-item label="密码" required>
               <el-input :disabled="isEdit" v-model.trim="addDialogData.uPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="部门" required>
               <el-select v-model="addDialogData.departId" placeholder="请选择" size="small">
                  <el-option
                     v-for="(item,index) in departmentList"
                     :key="index"
                     :label="item.departmentName+'部'"
                     :value="item.departmentId"
                  ></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="性别" required>
               <el-select v-model="addDialogData.uGender" placeholder="请选择" size="small">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="0"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="邮箱" required>
               <el-input v-model.trim="addDialogData.uEmail"></el-input>
            </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
            <myButton @click="addDialog = false">取消</myButton>
            <myButton @click="setUser">确定</myButton>
         </span>
      </el-dialog>

      <!-- 删除弹窗 -->
      <el-dialog title="警告" :visible="delDialog" width="20%">
         <span class="delSpan">删除后无法恢复，确定要继续吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="delDialog = false">取消</myButton>
            <myButton @click="delUser">确定</myButton>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: "userManagement",
   data() {
      return {
         searchForm: {
            departId: null,
            keyWord: "",
            currentPage: 1,
            pageSize: 20
         },
         total: null, // 数据总条数
         departmentList: [], // 所有部门
         tableListData: [], // table列表数据
         addDialogData: {}, // 新增/编辑弹窗数据
         isEdit: false, // true为编辑  false为新增
         selTableData: [], // 选中的table数据
         addDialog: false, // 新增弹窗
         delDialog: false // 删除弹窗
      };
   },
   async created() {
      await this.getDepartmentList();
      this.getUserList();
   },
   methods: {
      // 获取所有部门
      getDepartmentList() {
         this.$request.getDepartmentList().then(res => {
            if (res.data.code == 200) {
               this.departmentList = res.data.resp.filter(val => {
                  return val.departmentId != 4;
               });
               console.log(this.departmentList, "所有部门");
            }
         });
      },

      // 获取列表数据
      getUserList() {
         this.$request.getUserList(this.searchForm).then(res => {
            if (res.data.code == 200) {
               console.log(res);
               this.tableListData = res.data.resp.rows;
               this.total = res.data.resp.total;
            }
         });
      },

      // 搜索按钮
      searchBtn() {
         this.getUserList();
      },

      // 编辑按钮
      editBtn(row) {
         this.isEdit = true;
         this.addDialogData = Object.assign({}, row);
         this.addDialog = true;
      },

      // 新建用户
      addBtn() {
         this.isEdit = false;
         this.addDialog = true;
      },

      // 关闭弹窗
      closeDialog() {
         this.addDialogData = {};
      },

      // 新建/编辑用户
      setUser() {
         let params = {
            uId: this.addDialogData.uId || null,
            uName: this.addDialogData.uName || "",
            uPhone: this.addDialogData.uPhone || "",
            uCode: this.addDialogData.uCode || "",
            uPassword: this.addDialogData.uPassword || "",
            departId:this.addDialogData.departId === undefined? null: this.addDialogData.departId,
            uGender:this.addDialogData.uGender === undefined? null: this.addDialogData.uGender,
            uEmail: this.addDialogData.uEmail || ""
         };
         const emailCheck = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
         // 数据校验
         if (params.uName === "") {
            this.$myMessage.warningMessage("姓名不能为空");
            return;
         } else if (params.uName.indexOf(" ") !== -1) {
            this.$myMessage.warningMessage("姓名不能有空格");
            return;
         } else if (params.uPhone === "") {
            this.$myMessage.warningMessage("电话不能为空");
            return;
         } else if (params.uPhone.indexOf(" ") !== -1) {
            this.$myMessage.warningMessage("电话不能有空格");
            return;
         } else if (!/^1[3456789]\d{9}$/.test(params.uPhone)) {
            this.$myMessage.warningMessage("电话号码格式错误");
            return;
         } else if (params.uCode === "") {
            this.$myMessage.warningMessage("账号不能为空");
            return;
         } else if (params.uCode.indexOf(" ") !== -1) {
            this.$myMessage.warningMessage("账号不能有空格");
            return;
         } else if ((!this.isEdit)&&params.uPassword === "") {
            this.$myMessage.warningMessage("密码不能为空");
            return;
         } else if (params.uPassword.indexOf(" ") !== -1) {
            this.$myMessage.warningMessage("密码不能有空格");
            return;
         } else if ((!this.isEdit)&&!/[a-z0-9]{6,15}/.test(params.uPassword)) {
            this.$myMessage.warningMessage("密码由6~15位字母和数字组成");
            return;
         } else if (params.departId == null) {
            this.$myMessage.warningMessage("请选择部门");
            return;
         } else if (params.uGender == null) {
            this.$myMessage.warningMessage("请选择性别");
            return;
         } else if (params.uEmail == "") {
            this.$myMessage.warningMessage("邮箱不能为空");
            return;
         } else if (!emailCheck.test(params.uEmail)) {
            this.$myMessage.warningMessage("邮箱格式错误");
            return;
         }
         if(!this.isEdit) {
           params.uPassword = this.$Base64.encode(params.uPassword)
         }
         this.$request.setUser(params).then(res => {
            console.log(res);
            if (res.data.code == 200) {
               if (this.isEdit) {
                  this.$myMessage.successMessage("编辑成功");
               } else {
                  this.$myMessage.successMessage("新增成功");
               }
               this.getUserList();
               this.addDialog = false;
            } else {
               if (this.isEdit) {
                  this.$myMessage.errorMessage("编辑失败");
               } else {
                  this.$myMessage.errorMessage("新增失败");
               }
            }
         });
      },

      // 行单击事件
      rowClick(row, column, event) {
         if (column.columnKey !== "edit") {
            this.$refs.table.toggleRowSelection(row);
         }
      },

      // 行选中改变
      selectChange(arr) {
         this.selTableData = arr;
      },

      // 删除按钮
      delBtn() {
         if (this.selTableData.length == 0) {
            this.$myMessage.warningMessage("请先勾选要删除的用户");
         } else {
            this.delDialog = true;
         }
      },

      // 删除用户
      delUser() {
         let uId = this.selTableData
            .map(val => {
               return val.uId;
            })
            .join(",");
         this.$request.delUser({ uId }).then(res => {
            if (res.data.code == 200) {
               this.delDialog = false;
               this.getUserList();
               this.$myMessage.successMessage("删除成功");
            } else {
               this.$myMessage.errorMessage("删除失败");
            }
         });
      }
   },
   watch: {
      "searchForm.departId": function() {
         this.getUserList();
      },
      "searchForm.currentPage": function() {
         this.getUserList();
      },
      "searchForm.pageSize": function() {
         this.getUserList();
      }
   }
};
</script>

<style lang='less'>
.userManagement {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
}
</style>