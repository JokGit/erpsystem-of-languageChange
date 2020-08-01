<template>
   <div class="deployTerminal">
      <div id="pageName">
         <span>
            <i class="el-icon-back" @click="previousPage"></i>配单系统
         </span>
      </div>
      <myToolBar>
         <span>系统类型：</span>
         <el-select v-model="productsType" placeholder="请选择" size="small">
            <el-option label="所有类型" :value="null"></el-option>
            <el-option
               v-for="(item,index) in systemType"
               :key="index"
               :label="item.typeName"
               :value="item.typeId"
            ></el-option>
         </el-select>
         <el-autocomplete
            class="searchBar"
            ref="autocomplete"
            v-model="productsKeyword"
            :fetch-suggestions="searchProductsData"
            placeholder="搜索型号/名称"
            @select="productsSel"
            :trigger-on-focus="false"
            :debounce="1000"
            :popper-append-to-body="false"
            size="small"
            prefix-icon="el-icon-search"
         >
            <template v-slot="{ item }">
               <div class="productsList">
                  <span><i class="el-icon-search"></i></span>
                  <span :title="item.productName" v-html="item.productName.replace(productsKeyword,`<i style='color:#3597ff'>${productsKeyword}</i>`)"></span>
                  <span :title="item.productVersion" v-html="item.productVersion.replace(productsKeyword,`<i style='color:#3597ff'>${productsKeyword}</i>`)"></span>
                  <span :title="item.brand">{{item.brand}}</span>
                  <span :title="item.units">{{item.units}}</span>
                  <span :title="item.describeParameter">{{item.describeParameter}}</span>
                  <span @click="addSearchProductBtn(item)"></span>
               </div>
            </template>
         </el-autocomplete>
         <myButton @click="addProductBtn">新增产品</myButton>
         <myButton @click="accomplishBtn" :disabled='tableListData.length === 0'>完成配单</myButton>
      </myToolBar>
      <!-- pageTable -->
      <div class="pageTable">
         <myTable title="产品列表">
            <el-table border size="small" :data="tableListData" style="width: 100%" height="100%">
               <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
               <el-table-column prop="productName" label="名称" width="180"></el-table-column>
               <el-table-column prop="productVersion" label="型号" width="180"></el-table-column>
               <el-table-column prop="brand" label="品牌"></el-table-column>
               <el-table-column prop="number" label="数量">
                  <template v-slot="scope">
                     <el-input-number
                        v-model="scope.row.number"
                        @change="productNumChange($event,scope.row)"
                        :min="1"
                        :max="1000"
                        label="产品数量"
                        size="mini"
                     ></el-input-number>
                  </template>
               </el-table-column>
               <el-table-column prop="units" label="单位"></el-table-column>
               <el-table-column prop="unitPrice" label="单价"></el-table-column>
               <el-table-column prop="subtotal" label="小计"></el-table-column>
               <el-table-column prop label="图片" width="210">
                  <template v-slot='scope'>
                     <img v-for="(item,index) in scope.row.images" 
                        :key="index" 
                        style="height:34px;width:34px;marginRight:10px;border:1px solid #dcdfe6"
                        :src="item"
                        alt=""
                        @click="viewImage(item)"
                     >
                  </template>
               </el-table-column>
               <el-table-column prop="describeParameter" label="功能描述与技术参数"></el-table-column>
               <el-table-column prop="name" label="操作" width="200" align="center">
                  <template v-slot="scope">
                     <el-button size="mini" @click="delBtn(scope.row)">移除</el-button>
                  </template>
               </el-table-column>
            </el-table>
            <template v-slot:footer>
               <el-pagination
                  background
                  :current-page="searchForm.currentPage"
                  :page-size="searchForm.pageSize"
                  :page-sizes="[10, 15, 20, 25, 30, 50]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
               ></el-pagination>
            </template>
         </myTable>
      </div>
      <!-- 新增用户弹窗 -->
      <el-dialog title="新增产品" :visible.sync="addDialog" width="800px" @closed='clearData'>
         <el-row :gutter="30">
            <el-col :span="12">
               <el-form ref="form" :model="dialogData" label-width="90px" size="small">
                  <el-form-item label="产品名称" required>
                     <el-input v-model.trim="dialogData.productName"></el-input>
                  </el-form-item>
                  <el-form-item label="系统类型" class="systemType">
                     <el-select v-model="dialogData.productType" placeholder="请选择" size="small">
                        <el-option v-for="(item,index) in systemType" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
                     </el-select>
                     <!-- <div class="rightArrow" @click="systemTypeSelBtn">
                        <img src="../../assets/content/right_arrow.png" alt />
                     </div> -->
                  </el-form-item>
                  <el-form-item label="产品单价">
                     <el-input v-model.trim="dialogData.unitPrice"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="产品数量">
                     <el-input v-model.number="dialogData.number"></el-input>
                  </el-form-item> -->
               </el-form>
            </el-col>
            <el-col :span="12">
               <el-form ref="form" label-width="90px" size="small">
                  <el-form-item label="产品型号">
                     <el-input v-model.trim="dialogData.productVersion"></el-input>
                  </el-form-item>
                  <el-form-item label="产品品牌">
                     <el-input v-model.trim="dialogData.brand"></el-input>
                  </el-form-item>
                  <el-form-item label="产品单位">
                     <el-input v-model.trim="dialogData.units"></el-input>
                  </el-form-item>
               </el-form>
            </el-col>
         </el-row>
         <el-row>
            <el-form ref="form" :model="dialogData" label-width="90px" size="small">
               <el-form-item label="功能参数&技术参数">
                  <el-input v-model.trim="dialogData.describeParameter" type="textarea" :autosize="{minRows: 3}"></el-input>
               </el-form-item>
            </el-form>
         </el-row>
         <!-- 图片上传 -->
         <el-row>
            <el-form ref="form" :model="dialogData" label-width="90px" size="small">
               <el-form-item label="产品图片">
                  <div class="dialogImgList">
                     <div>
                        <myUploadImage :imgPath.sync='imgPaths.imgPath1' :imgFile.sync="imgFiles.imgFile1"></myUploadImage>
                     </div>
                     <div>
                        <myUploadImage :imgPath.sync='imgPaths.imgPath2' :imgFile.sync="imgFiles.imgFile2"></myUploadImage>
                     </div>
                     <div>
                        <myUploadImage :imgPath.sync='imgPaths.imgPath3' :imgFile.sync="imgFiles.imgFile3"></myUploadImage>
                     </div>
                     <div>
                        <myUploadImage :imgPath.sync='imgPaths.imgPath4' :imgFile.sync="imgFiles.imgFile4"></myUploadImage>
                     </div>
                  </div>
               </el-form-item>
            </el-form>
         </el-row>
         <span slot="footer" class="dialog-footer">
            <myButton @click="addDialog = false">取消</myButton>
            <myButton @click="addProduct">确定</myButton>
         </span>
      </el-dialog>

      <!-- 删除弹窗 -->
      <el-dialog title="警告" :visible.sync="delDialog" width="20%">
         <span class="delSpan">确定要删除吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="delDialog = false">取消</myButton>
            <myButton @click="delProduct">确定</myButton>
         </span>
      </el-dialog>

      <!-- 查看图片弹窗 -->
      <myViewImage :visible.sync='viewImageShow' :imgSrc='viewImagePath'></myViewImage>
   </div>
</template>

<script>
export default {
   name: "deployTerminal",
   data() {
      return {
         searchForm: {
            currentPage: 1,
            pageSize: 20
         },
         systemType: [],            // 所有系统类型
         total: null,               // 数据总条数
         tableListData: [],         // table 列表数据
         delDialog: false,          // 删除弹窗是否可见
         addDialog: false,          // 新增产品弹窗
         dialogData: {},            // 弹窗数据
         productsKeyword: "",       // 产品关键字
         productsType: null,        // 产品类型
         viewImageShow: false,      // 图片预览是否显示
         viewImagePath: '',         // 图片预览路径
         imgPaths: {
            imgPath1: null,        // 新增框图片1 路径
            imgPath2: null,        // 新增框图片2 路径
            imgPath3: null,        // 新增框图片3 路径
            imgPath4: null,        // 新增框图片4 路径
         },
         imgFiles: {
            imgFile1: null,     // img组件1 返回的图片数据
            imgFile2: null,     // img组件2 返回的图片数据
            imgFile3: null,     // img组件3 返回的图片数据
            imgFile4: null,     // img组件4 返回的图片数据
         },
      };
   },
   created() {
      // 获取所有类型
      this.getProductType();

      // 获取列表数据
      this.getMatchingOrder();
   },
   methods: {
      // 返回上一页
      previousPage() {
         this.$router.push("/index/project-details");
      },

      // 获取所有系统类型
      getProductType() {
         this.$request.queryProductType().then(res => {
            if (res.data.code == 200) {
               this.systemType = res.data.resp;
               this.innerSystemType = JSON.parse(
                  JSON.stringify(this.systemType)
               );
            } else {
               this.$myMessage.errorMessage("获取系统类型失败");
            }
         });
      },

      // 获取列表数据
      getMatchingOrder() {
         this.searchForm.tId = parseInt(this.$route.params.tId);
         this.$request.getMatchingOrder(this.searchForm).then(res => {
            console.log(res,'列表数据');
            if (res.data.code == 200) {
               this.tableListData = res.data.resp.rows;
               this.total = res.data.resp.total;
            } else {
               this.$myMessage.errorMessage("获取列表数据失败");
            }
         });
      },

      // 完成配单按钮
      accomplishBtn() {
         this.$request.finishOrder({tId:parseInt(this.$route.params.tId)}).then(res=>{
            if(res.data.code == 200) {
               this.$myMessage.successMessage('完成配单成功')
            } else {
               this.$myMessage.errorMessage('完成配单失败')
            }
         })
      },

      // 删除按钮
      delBtn(row) {
         this.delDialog = true;
         this.tempCurrentRow = row;
      },

      // 删除产品功能
      delProduct() {
         this.$request.delMatchingOrderById({ mId: this.tempCurrentRow.mId }).then(res => {
            if (res.data.code == 200) {
               this.delDialog = false;
               this.getMatchingOrder();
               this.$myMessage.successMessage("删除产品成功");
            } else {
               this.$myMessage.errorMessage("删除产品失败");
            }
         });
      },

      // 搜索框搜索产品数据
      searchProductsData(queryString,cb) {
         let params = {
            currentPage: 1,
            pageSizes: 10000,
            type: this.productsType,
            keyword: this.productsKeyword
         }
         if(params.keyword == "") {
            this.$myMessage.warningMessage('请输入型号或名称进行搜索')
            return
         }
         this.$request.getProductByNameOrVersion(params).then(res => {
            if(res.data.code == 200) {
               console.log(res.data.resp.rows,'参数');
               cb(res.data.resp.rows)
            } else {
               cb([])
            }
         })
      },

      // 搜索栏的添加按钮
      addSearchProductBtn(row) {
         let formData = new FormData()
         formData.append('productId', row.productId)
         formData.append('technologyId', parseInt(this.$route.params.tId))
         formData.append('number', 1)

         this.$request.addMatchingOrder(formData).then(res => {
            if(res.data.code == 200) {
               this.getMatchingOrder()
               this.$myMessage.successMessage('配单产品添加成功')
            } else if(res.data.code == 212) {
               this.$myMessage.warningMessage('产品库存不足，添加失败')
            } else {
               this.$myMessage.errorMessage('配单产品添加失败')
            }
         })
      },

      // 选择搜索出的产品
      productsSel() {
         this.$refs.autocomplete.focus()
      },

      // 产品数量改变
      productNumChange(num,row) {
         let formData = new FormData()
         formData.append('mId',row.mId)
         formData.append('productId',row.productId)
         formData.append('technologyId',parseInt(this.$route.params.tId))
         formData.append('number',num)

         this.$request.addMatchingOrder(formData).then(res => {
            if(res.data.code == 200) {
               this.$myMessage.successMessage('配单产品数量调整成功')
            } else if(res.data.code == 212) {
               this.$myMessage.errorMessage('当前商品库存不足')
            } else {
               this.$myMessage.errorMessage('配单产品数量调整失败')
            }
            this.getMatchingOrder()
         })
      },

      // 新增产品按钮
      addProductBtn() {
         this.addDialog = true
      },

      // 新增产品功能
      addProduct() {
         let params = {
            productName: this.dialogData.productName || "",
            productVersion: this.dialogData.productVersion || "",
            productType: this.dialogData.productType || null,
            brand: this.dialogData.brand || "",
            unitPrice: this.dialogData.unitPrice || "",
            units: this.dialogData.units || "",
            describeParameter: this.dialogData.describeParameter || "",
            images: []
         }
         for (const key in this.imgFiles) {
            if(this.imgFiles[key] != null) {
               params.images.push(this.imgFiles[key])
            }
         }
         // console.log(params,'参数');

         if(params.productName == "") {
            this.$myMessage.warningMessage('产品名称不能为空')
            return
         } else if(params.productName.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('产品名称不能有空格')
            return
         } else if(params.productType == null) {
            this.$myMessage.warningMessage('请选择产品类型')
            return
         } else if(params.brand == "") {
            this.$myMessage.warningMessage('品牌名称不能为空')
            return
         } else if(params.brand.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('品牌名称不能有空格')
            return
         } else if(params.unitPrice == "") {
            this.$myMessage.warningMessage('单价不能为空')
            return
         } else if(params.unitPrice.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('单价不能有空格')
            return
         } else if(params.units == "") {
            this.$myMessage.warningMessage('单位不能为空')
            return
         } else if(params.units.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('单位不能有空格')
            return
         } else if(params.describeParameter == "") {
            this.$myMessage.warningMessage('产品描述不能为空')
            return
         } else if(params.images.length < 3) {
            this.$myMessage.warningMessage('至少上传三张产品图片')
            return
         }
         
         let formData = new FormData();
         formData.append('productId', 0)
         formData.append('productName', params.productName)
         formData.append('productVersion', params.productVersion)
         formData.append('productType', params.productType)
         formData.append('brand', params.brand)
         formData.append('unitPrice', params.unitPrice)
         formData.append('units', params.units)
         formData.append('describeParameter', params.describeParameter)
         formData.append('existImages', "")
         for (const key in this.imgFiles) {
            if(this.imgFiles[key] != null) {
               formData.append('images', this.imgFiles[key])
            }
         }

         let config = {
            headers: {'Content-Type': 'multipart/form-data'},
         }

         this.$request.addProduct(formData,config).then(res => {
            if(res.data.code == 200) {
               this.addDialog = false
               this.$myMessage.successMessage('新增产品成功')
            } else {
               this.$myMessage.successMessage('新增产品失败')
            }
         })
      },


      // 清除数据
      clearData() {
         this.dialogData = {}
      },

      // 列表点击缩略图查看图片
      viewImage(path) {
         this.viewImageShow = true
         this.viewImagePath = path
      }
   },

   watch: {
      "searchForm.currentPage": function() {
         this.getMatchingOrder();
      },
      "searchForm.pageSize": function() {
         this.getMatchingOrder();
      }
   },

   filters: {
      searchProductName(val) {
         console.log(val,'过滤器内部');
      }
   }
};
</script>

<style lang='less'>
.deployTerminal {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
   // 搜索条
   .searchBar {
      .el-input {
         width: 600px;
      }
   }
   // 弹窗系统类型
   .systemType {
      .el-form-item__content {
         display: flex;
         .el-select {
            flex: 1;
         }
         .rightArrow {
            width: 46px;
            text-align: center;
            cursor: pointer;
            img {
               width: 32px;
            }
         }
      }
   }
   // 弹窗图片上传列表
   .dialogImgList {
      display: flex;
      & > div {
         flex: 1;
         margin-right: 20px;
      }
      & > div:last-child {
         margin-right: 0px;
      }
   }

   .el-icon-back {
      font-weight: 700;
      transition: all 0.3s;
   }
   .el-icon-back:hover {
      color: #5cb6ff;
   }

   // 产品列表
   .productsList {
      display: flex;
      span {
         padding: 0 10px;
         position: relative;
      }
      span::after {
         content: "";
         position: absolute;
         top: 50%;
         transform: translateY(-50%);
         right: 0;
         display: inline-block;
         width: 1px;
         height: 60%;
         background-color: #ccc;
      }
      span:nth-of-type(2) {
         max-width: 130px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      span:nth-last-of-type(2) {
         flex-grow: 1;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      span:nth-of-type(3) {
         max-width: 85px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      span:nth-of-type(4) {
         max-width: 80px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      span:nth-of-type(5) {
         max-width: 30px;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
      }
      span:last-of-type {
         flex-shrink: 0;
         padding: 0 8px;
         margin-left: 18px;
         width: 25px;
         background: url('../../assets/content/addProduct.png') center center no-repeat;
      }
      span:last-of-type::after {
         content: "";
         width: 0;
      }
      span:last-of-type:hover {
         background: url('../../assets/content/addProduct1.png') center center no-repeat;
      }
   }
}
</style>