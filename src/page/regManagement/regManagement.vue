<template>
   <div class="regManage">
      <div id="pageName">
         <span>注册管理</span>
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
         <el-date-picker
            v-model="searchTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
         ></el-date-picker>
         <el-input
            v-model="searchForm.keyWord"
            placeholder="名称/序列号"
            size="small"
            width="120px"
            clearable
         ></el-input>
         <myButton @click="getHistoryRegisterList">
            <i class="el-icon-search"></i> 搜索
         </myButton>
      </myToolBar>
      <!-- pageTable -->
      <div class="pageTable">
         <myTable title="项目列表">
            <el-table border size="small" :data="tableListData" style="width: 100%" height="100%">
               <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
               <el-table-column prop="projectName" label="项目名称" width="180"></el-table-column>
               <el-table-column prop="serialNumber" label="序列号" width="180"></el-table-column>
               <el-table-column prop="registrationCode" label="注册码" :show-overflow-tooltip="true"></el-table-column>
               <el-table-column prop="uname" label="生成人"></el-table-column>
               <el-table-column prop="registrationCodeType" label="类型">
                  <template v-slot="scope">
                     <span v-show="scope.row.registrationCodeType==0">永久</span>
                     <span v-show="scope.row.registrationCodeType==1">30天</span>
                     <span v-show="scope.row.registrationCodeType==2">60天</span>
                     <span v-show="scope.row.registrationCodeType==3">90天</span>
                     <span v-show="scope.row.registrationCodeType==4">120天</span>
                     <span v-show="scope.row.registrationCodeType==5">180天</span>
                  </template>
               </el-table-column>
               <el-table-column prop="createTime" label="日期"></el-table-column>
               <el-table-column prop="useCompany" label="单位"></el-table-column>
               <el-table-column prop="carryOutCompany" label="公司"></el-table-column>
               <el-table-column prop="region" label="区域"></el-table-column>
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
   </div>
</template>

<script>
export default {
   name: "regManage",
   data() {
      return {
         pickerOptions: {
            disabledDate(time) {
               return time.getTime() > Date.now();
            }
         },
         searchForm: {
            registrationCodeType: null,
            startDate: "",
            endDate: "",
            keyWord: "",
            currentPage: 1,
            pageSize: 20
         },
         total: null, // 数据总条数
         searchTime: null, // 搜索时间条件
         tableListData: [] // 项目管理列表数据
      };
   },
   created() {
      this.defaultTime();
      this.getHistoryRegisterList();
   },
   methods: {
      // 设置默认时间
      defaultTime() {
         let endDate = new Date();
         let start = endDate.getTime() - 3600 * 1000 * 24 * 30;
         let startDate = new Date(start);
         this.searchTime = [
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
         ];
      },

      // 获取注册列表数据
      getHistoryRegisterList() {
         this.$request.getHistoryRegisterList(this.searchForm).then(res => {
            console.log(res, "获取数据");
            if (res.data.code == 200) {
               this.total = res.data.resp.total;
               this.tableListData = res.data.resp.rows;
            }
         });
      },
   },
   watch: {
      searchTime() {
         if (this.searchTime != null) {
            this.searchForm.startDate = this.searchTime[0];
            this.searchForm.endDate = this.searchTime[1];
            this.getHistoryRegisterList();
         }
      },
      "searchForm.registrationCodeType": function() {
         this.getHistoryRegisterList();
      },
      "searchForm.currentPage": function() {
         this.getHistoryRegisterList();
      },
      "searchForm.pageSize": function() {
         this.getHistoryRegisterList();
      }
   }
};
</script>

<style lang='less'>
.regManage {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
}
</style>