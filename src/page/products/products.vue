<template>
   <div class="products">
      <div id="pageName">
         <span>产品中心</span>
      </div>
      <myToolBar>
         <span>系统类型：</span>
         <el-select v-model="searchForm.type" placeholder="请选择" size="small">
            <el-option label="所有类型" :value="null"></el-option>
            <el-option v-for="(item,index) in systemType" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
         </el-select>
         <el-input v-model="searchForm.keyword" placeholder="型号/名称" size="small" clearable @change="searchTextChange"></el-input>
         <myButton @click="addProductBtn">新增产品</myButton>
      </myToolBar>
      <!-- pageTable -->
      <div class="pageTable">
         <myTable title="产品列表">
            <el-table border size="small" :data="tableListData" style="width: 100%" height="100%">
               <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
               <el-table-column prop="productName" label="名称" width="180"></el-table-column>
               <el-table-column prop="productVersion" label="型号" width="180"></el-table-column>
               <el-table-column prop="brand" label="品牌"></el-table-column>
               <el-table-column prop="number" label="数量"></el-table-column>
               <el-table-column prop="units" label="单位"></el-table-column>
               <el-table-column prop="unitPrice" label="单价"></el-table-column>
               <el-table-column prop="subtotal" label="小计"></el-table-column>
               <el-table-column prop="name" label="图片" width="300">
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
               <el-table-column prop="describeParameter" label="功能描述与技术参数" min-width="150"></el-table-column>
               <el-table-column label="操作" width="200" align="center">
                  <template v-slot="scope">
                     <el-button size="mini" @click="productDetails(scope.row)">查看</el-button>
                     <el-button size="mini" @click="delProductBtn(scope.row)">删除</el-button>
                  </template>
               </el-table-column>
            </el-table>
            <template v-slot:footer>
               <el-pagination
                  background
                  :current-page.sync="searchForm.currentPage"
                  :page-size.sync="searchForm.pageSizes"
                  :page-sizes="[10, 15, 20, 25, 30, 50]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
               ></el-pagination>
            </template>
         </myTable>
      </div>
      <!-- 新增产品弹窗 -->
      <el-dialog :title="isEdit?'编辑产品':'新增产品'" :visible.sync="addDialog" width="800px" @closed='clearData'>
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
                     <div class="rightArrow" @click="systemTypeSelBtn">
                        <img src="../../assets/content/right_arrow.png" alt />
                     </div>
                  </el-form-item>
                  <el-form-item label="产品单价">
                     <el-input v-model.trim.number="dialogData.unitPrice"></el-input>
                  </el-form-item>
                  <el-form-item label="产品数量">
                     <el-input v-model.number="dialogData.number"></el-input>
                  </el-form-item>
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

         <!-- 嵌套弹窗 -->
         <el-dialog width="30%" title="系统类型" :visible.sync="innerVisible" append-to-body @closed='clearInnerDialogData'>
            <el-row :gutter="50">
               <el-col :span="12" v-for="(item,index) in innerSystemType" :key="index">
                  <el-form label-width="50px" size="small">
                     <el-form-item :label="`${(index+1).toString()}`">
                        <el-input v-model.trim="item.typeName" @change="systemTypeValChange(item)"></el-input>
                     </el-form-item>
                  </el-form>
               </el-col>
               <el-col :span="12" v-show="addsystemTypeInput">
                  <el-form label-width="50px" size="small">
                     <el-form-item :label="`${(innerSystemType.length+1).toString()}`">
                        <el-input ref="addsystemTypeInput" v-model="addsystemTypeVal" @blur="addTypeFeatures" placeholder="请输入类型名称"></el-input>
                     </el-form-item>
                  </el-form>
               </el-col>
            </el-row>
            <el-form ref="form" label-width="50px" size="small">
               <el-form-item label="添加">
                  <div
                     @click="addSystemType"
                     style="border:1px dashed #DCDFE6; borderRadius:4px; height:32px; textAlign:center"
                  >
                     <img style="width: 24px;" src="../../assets/content/ten.png" alt />
                  </div>
               </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <myButton @click="innerVisible = false">取消</myButton>
               <myButton>确定</myButton>
            </span>
         </el-dialog>
      </el-dialog>

      <!-- 删除弹窗 -->
      <el-dialog title="警告" :visible="delDialog" width="20%">
         <span class="delSpan">删除后无法恢复，确定要继续吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="delDialog = false">取消</myButton>
            <myButton @click="delProduct">确定</myButton>
         </span>
      </el-dialog>

      <!-- 空名称系统类型删除弹窗 -->
      <el-dialog title="警告" :visible.sync="delSysTypeDialog" width="20%">
         <span class="delSpan">确定要删除吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="cancelDelSysTypeBtn">取消</myButton>
            <myButton @click="delSysTypeBtn">确定</myButton>
         </span>
      </el-dialog>

      <!-- 查看图片 -->
      <myViewImage :visible.sync='viewImageShow' :imgSrc='viewImagePath'></myViewImage>
   </div>
</template>

<script>
export default {
   name: "products",
   data() {
      return {
         searchForm: {
            type: null,
            keyword: "",
            currentPage: 1,
            pageSizes: 20
         },
         tableListData: [],         // table列表数据
         total: null,               // 列表数据总条数
         systemType: [],            // 获取所有系统类型
         innerSystemType: [],       // 嵌套弹窗所有系统类型
         dialogData: {},            // 新增\编辑 弹窗数据
         addDialog: false,          // 新增弹窗是否可见
         addsystemTypeInput: false, // 新增类型输入框是否可见
         addsystemTypeVal: "",      // 新增类型输入框的值
         delSysTypeDialog: false,   // 空名称系统类型删除提示框
         delDialog: false,          // 删除产品弹窗
         uploadProgress: 0,         // 新增产品图片上传进度
         isEdit: false,             // 编辑或新增   false 为新增    true为编辑
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
         num: null,
         innerVisible: false,
         viewImageShow: false,         // 查看缩略图片
         viewImagePath: "",            // 缩略图路径
      };
   },
   created() {
      this.searchListData()
      this.getProductType()
   },
   methods: {
      // 文本搜索条件改变
      searchTextChange() {
         this.searchListData()
      },

      // 获取所有系统类型
      getProductType() {
         this.$request.queryProductType().then(res => {
            if(res.data.code == 200) {
               this.systemType = res.data.resp
               this.innerSystemType = JSON.parse(JSON.stringify(this.systemType))
            } else {
               this.$myMessage.errorMessage('获取系统类型失败')
            }
         })
      },

      // 获取产品列表数据
      searchListData() {
         this.$request.getProductByNameOrVersion(this.searchForm).then(res => {
            console.log(res,'列表返回值');
            if(res.data.code == 200) {
               this.tableListData = res.data.resp.rows
               this.total = res.data.resp.total
            } else {
               this.$myMessage.errorMessage('获取产品数据失败')
            }
         })
      },

      // 删除产品
      delProductBtn(row) {
         this.delDialog = true
         this.delTempData = row
      },

      // 删除产品功能
      delProduct() {
         this.$request.delateProductCenter({productId: this.delTempData.productId}).then(res => {
            if(res.data.code == 200) {
               this.delDialog = false
               this.searchListData()
               this.$myMessage.successMessage('删除产品成功')
            } else {
               this.$myMessage.errorMessage('删除产品失败')
            }
         })
      },

      // 查看产品详情
      productDetails(row) {
         // console.log(row,'单条数据');
         this.addDialog = true
         this.isEdit = true
         this.dialogData = JSON.parse(JSON.stringify(row))

         let imgArr = Object.keys(this.imgPaths)
         this.dialogData.images.forEach((v,index) => {
            this.imgPaths[imgArr[index]] = v
         })
      },

      // 新增产品按钮
      addProductBtn() {
         this.addDialog = true
         this.isEdit = false
      },

      // 新增产品
      addProduct() {
         let params = {
            productId: this.dialogData.productId || 0,
            productName: this.dialogData.productName || "",
            productVersion: this.dialogData.productVersion || "",
            productType: this.dialogData.productType || null,
            brand: this.dialogData.brand || "",
            unitPrice: this.dialogData.unitPrice.toString() || "",
            units: this.dialogData.units || "",
            number: this.dialogData.number || null,
            describeParameter: this.dialogData.describeParameter || "",
            existImages: "",
            images: []
         }
         // 循环组件选择的图片文件，复制给参数images
         for (const key in this.imgFiles) {
            if(this.imgFiles[key] != null) {
               params.images.push(this.imgFiles[key])
            }
         }
         // 循环旧的图片地址，赋值给 existImages
         let items = []
         for (const item in this.imgPaths) {
            if(this.imgPaths[item] != null) {
               items.push(this.imgPaths[item])
            }
         }
         params.existImages = items.join('|')

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
         } else if((params.images.length+items.length) < 3) {
            this.$myMessage.warningMessage('至少上传三张产品图片')
            return
         }
         
         let formData = new FormData();
         formData.append('productId', params.productId)
         formData.append('productName', params.productName)
         formData.append('productVersion', params.productVersion)
         formData.append('productType', params.productType)
         formData.append('brand', params.brand)
         formData.append('unitPrice', params.unitPrice)
         formData.append('units', params.units)
         formData.append('number', params.number)
         formData.append('describeParameter', params.describeParameter)
         formData.append('existImages', params.existImages)
         for (const key in this.imgFiles) {
            if(this.imgFiles[key] != null) {
               formData.append('images', this.imgFiles[key])
            }
         }

         let config = {
            headers: {'Content-Type': 'multipart/form-data'},
            // 图片上传过快，无法坚挺到图片的上传
            // progress: e => {
            //    console.log(e,'触发上传事件');
            //    this.uploadProgress = ((e.load / e.total) * 100) | 0
            //    console.log(this.uploadProgress,'上传进度');
            //    console.log((e.load / e.total) * 100 == 100);
            // }
         }

         this.$request.addProduct(formData,config).then(res => {
            if(res.data.code == 200) {
               this.addDialog = false
               this.searchListData()
               if(this.isEdit) {
                  this.$myMessage.successMessage('编辑产品成功')
               } else {
                  this.$myMessage.successMessage('新增产品成功')
               }
            } else {
               if(this.isEdit) {
                  this.$myMessage.errorMessage('编辑产品失败')
               } else {
                  this.$myMessage.errorMessage('新增产品失败')
               }
            }
         })
      },

      // 清除新增弹窗数据
      clearData() {
         this.dialogData = {}

         this.imgPaths.imgPath1 = null
         this.imgPaths.imgPath2 = null
         this.imgPaths.imgPath3 = null
         this.imgPaths.imgPath4 = null
         
         this.imgFiles.imgFile1 = null
         this.imgFiles.imgFile2 = null
         this.imgFiles.imgFile3 = null
         this.imgFiles.imgFile4 = null
         
      },




      // --------------------------------------------------------------------------------------
      // 弹窗系统类型箭头 --> 选择按钮
      systemTypeSelBtn() {
         this.innerVisible = true
      },
      

      // 新增系统类型,显示出预留的隐藏input框
      addSystemType() {
         this.addsystemTypeInput = true
         this.$nextTick(() => {
            this.$refs.addsystemTypeInput.focus()
         })
      },

      // 新增系统类型功能
      // 预留input失去焦点时，获取预留input框的值，调用新增接口，将值传输到后端，id为null，让后端自动添加id值
      // 添加成功后关闭预留弹窗即可
      addTypeFeatures() {
         if(this.addsystemTypeVal == "") {
            this.addsystemTypeInput = false
         } else {
            let params = {
               typeId: null,
               typeName: this.addsystemTypeVal
            }
            this.$request.addProductType(params).then(res => {
               // console.log(res,'新增系统类型');
               if(res.data.code == 200) {
                  this.addsystemTypeVal = ""
                  this.addsystemTypeInput = false
                  this.getProductType()
                  this.$myMessage.successMessage('新增类型成功')
               } else {
                  this.$myMessage.errorMessage('新增类型失败')
               }
            })
         }
      },

      // 修改系统类型功能
      // 系统类型 嵌套框的值改变 --> 当值为空时删除类型，当有值是修改类型
      systemTypeValChange(item) {
         // console.log(item,'值改变');
         if (item.typeName != "") {
            let params = {
               typeId: item.typeId,
               typeName: item.typeName
            }
            this.$request.addProductType(params).then(res => {
               if(res.data.code == 200) {
                  this.getProductType()
                  this.$myMessage.successMessage('系统类型更新成功')
               } else {
                  this.$myMessage.errorMessage('系统类型更新失败')
               }
            })
         } else if (item.typeName == "") {
            this.delSysTypeDialog = true
            this.tempSysTypeData = item
         }
      },

      // 删除系统类型功能
      delSysTypeBtn() {
         this.$request.deleteProductType({typeId: this.tempSysTypeData.typeId}).then(res => {
            if(res.data.code == 200) {
               this.delSysTypeDialog = false
               this.getProductType()
               this.$myMessage.successMessage('空白名称类型删除成功')
            } else {
               this.$myMessage.errorMessage('空白名称类型删除失败')
            }
         })
      },

      // 取消系统类型删除功能
      cancelDelSysTypeBtn() {
         this.innerSystemType = JSON.parse(JSON.stringify(this.systemType))
         this.delSysTypeDialog = false
      },

      // 类型编辑框清除数据
      clearInnerDialogData() {
         this.innerSystemType = []
      },

      // 点击列表缩略图查看图片
      viewImage(path) {
         this.viewImageShow = true
         this.viewImagePath = path
      }

   },

   watch: {
      'searchForm.type': function() {
         this.searchListData()
      },

      'searchForm.currentPage': function() {
         this.searchListData()
      },

      'searchForm.pageSize': function() {
         this.searchListData()
      },

      // imgFileData: function(a,b) {
      //    console.log(a,b,'图片组件改变了');
      // }
   },
};
</script>

<style lang='less'>
.products {
   display: flex;
   flex-direction: column;
   .pageTable {
      flex: 1;
   }
   // 搜索条
   .searchBar {
      .el-input {
         width: 400px;
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
}
</style>