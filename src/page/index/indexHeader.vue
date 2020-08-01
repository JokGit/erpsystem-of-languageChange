<template>
   <div class="indexHeader">
      <!-- log区域 -->
      <div class="imgLog" :style="{width: logWidth}">
         <img src="../../assets/indexHeader/logIcon.png" alt />
      </div>
      <div class="content" :style="{paddingLeft: $attrs.spacing,paddingRight: $attrs.spacing}">
         <span
            v-show="$store.state.userInfo.departId!=4"
         >欢迎您！{{departName[$store.state.userInfo.departId]}}代表—{{$store.state.userInfo.uName}}</span>
         <span v-show="$store.state.userInfo.departId==4">欢迎您！总经理—{{$store.state.userInfo.uName}}</span>
         <!-- <div class="weather">
            <span class="city">广州</span>
            <img src="../../assets/weather/duoyun.png" alt />
            <img src="../../assets/weather/qin.png" alt />
            <span>22℃ / 25℃</span>
         </div> -->
         <div class="kongbai"></div>
         <!-- <div class="help">
            <img src="../../assets/indexHeader/helpIcon.png" alt />
            <span>帮助</span>
         </div> -->
         <div class="user">
            <div class="userContent">
               <img src="../../assets/indexHeader/userIcon.png" alt />
               <span>{{$store.state.userInfo.uName}}</span>
               <img src="../../assets/indexHeader/xiala1.png" alt />
            </div>
            <div class="popUps">
               <div class="userInfo">
                  <p>{{$store.state.userInfo.uName}}</p>
               </div>
               <div class="userFeatures">
                  <div class="changePassword" @click="changePwdVisible = true">
                     <img src="../../assets/indexHeader/changePwd.png" alt />
                     <span>修改密码</span>
                  </div>
                  <div class="signOut" @click="signOutDialogVisible = true">
                     <img src="../../assets/indexHeader/exit.png" alt />
                     <span>退出登录</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 退出登录弹窗 -->
      <el-dialog title="提示" :visible.sync="signOutDialogVisible" width="400px" center>
         <span>确定要退出登录吗？</span>
         <span slot="footer" class="dialog-footer">
            <myButton @click="signOutDialogVisible = false">取 消</myButton>
            <myButton type="primary" @click="doLogout">确 定</myButton>
         </span>
      </el-dialog>
      <!-- 修改密码弹窗 -->
      <el-dialog
         title="修改密码"
         :visible.sync="changePwdVisible"
         width="400px"
         @closed="clearData"
      >
         <el-form :model="dialogData" label-width="90px" size="small">
            <el-form-item label="原密码：" required>
               <el-input :clearable="true" type="password" v-model.trim="dialogData.oldPassword" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" required>
               <el-input :clearable="true" type="password" v-model.trim="dialogData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" required>
               <el-input
                  :clearable="true"
                  type="password"
                  v-model.trim="dialogData.confirmPassword"
                  @keyup.enter="changePwd"
               ></el-input>
            </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
            <myButton @click="changePwdVisible = false">取 消</myButton>
            <myButton type="primary" @click="changePwd">确 定</myButton>
         </span>
      </el-dialog>
   </div>
</template>

<script>
export default {
   name: "indexHeader",
   props: ["logWidth"],
   inheritAttrs: false,
   data() {
      return {
         departName: {
            1: "销售",
            2: "技术",
            3: "产品",
            4: "总经理"
         },
         signOutDialogVisible: false,     // 登出提示弹框是否可见
         changePwdVisible: false,         // 密码修改弹框是否可见
         dialogData: {}                   // 弹窗数据
      };
   },
   methods: {
      // 退出登录
      doLogout() {
         this.$request.doLogout().then(res => {
            if (res.data.code == 200) {
               this.$router.push("/login");
               this.$store.commit('loginOut')
               this.$myMessage.successMessage("安全退出");
            } else {
               this.$myMessage.errorMessage("退出失败");
            }
         });
      },

      // 修改密码功能
      changePwd() {
         let temp = {
	         oldPassword: this.dialogData.oldPassword || "",
	         newPassword: this.dialogData.newPassword || "",
	         confirmPassword: this.dialogData.confirmPassword || ""
         }
         console.log(temp);
         if (!/^[0-9a-zA-Z]{6,15}$/.test(temp.oldPassword)) {
            this.$myMessage.warningMessage('原密码只能是由6~15位字母和数字组成，不能包含空格和特殊字符')
            return
         } else if (!/^[0-9a-zA-Z]{6,15}$/.test(temp.newPassword)) {
            this.$myMessage.warningMessage('新密码只能是由6~15位字母和数字组成，不能包含空格和特殊字符')
            return
         } else if (!/^[0-9a-zA-Z]{6,15}$/.test(temp.confirmPassword)) {
            this.$myMessage.warningMessage('新密码只能是由6~15位字母和数字组成，不能包含空格和特殊字符')
            return
         }

         let params = {
            uId: this.$store.state.userInfo.uId,
            oldPassword: this.$Base64.encode(this.dialogData.oldPassword),
	         newPassword: this.$Base64.encode(this.dialogData.newPassword),
	         confirmPassword: this.$Base64.encode(this.dialogData.confirmPassword)
         }

         this.$request.doChangePassword(params).then(res => {
            if(res.data.code == 200) {
               this.$router.push("/login");
               this.$store.commit('loginOut')
               this.$myMessage.successMessage("修改密码成功，请重新登录");
            } else {
               this.$myMessage.errorMessage('修改密码失败')
            }
         })
        
      },
     

      // 密码修改框清除数据
      clearData() {
         this.dialogData = {}
      }
   }
};
</script>

<style lang='less'>
.indexHeader {
   width: 100%;
   height: 100%;
   display: flex;
   color: #333333;
   .imgLog {
      height: inherit;
      img {
         width: inherit;
         height: inherit;
      }
   }
   & > .content {
      flex: 1;
      border-bottom: 1px solid #dddddd;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .weather {
         padding: 0 50px;
         span,
         img {
            padding: 0 4px;
         }
         span {
            vertical-align: middle;
            font-size: 14px;
         }
         img {
            width: 24px;
            height: 24px;
         }
      }
      .kongbai {
         flex: 1;
      }
      .help,
      .user {
         height: 100%;
         padding: 0 15px;
      }
      .help {
         display: flex;
         flex-direction: column;
         justify-content: center;
         cursor: pointer;
         img {
            width: 20px;
            display: block;
            margin: 0 auto;
         }
      }
      .user {
         position: relative;
         .userContent {
            height: 100%;
            display: flex;
            align-items: center;
            span {
               padding: 0 5px;
            }
         }
         .popUps {
            position: absolute;
            width: 120px;
            right: 0;
            border: 1px solid #2f4050;
            border-radius: 4px;
            overflow: hidden;
            display: none;
            z-index: 1;
            .userInfo {
               padding: 10px;
               font-size: 12px;
               background-color: black;
               color: #ffffff;
               line-height: 22px;
               p:first-of-type {
                  font-size: 14px;
               }
            }
            .userFeatures {
               & > div {
                  text-align: center;
                  padding: 0 10px;
                  border-bottom: 1px solid #2f4050;
                  cursor: pointer;
                  background-color: #ffffff;
               }
               & > div:last-of-type {
                  border-bottom: none;
               }
               & > div:hover {
                  background-color: #f5f7fa;
               }
               & > div span {
                  margin-left: 10px;
                  line-height: 35px;
                  vertical-align: middle;
               }
            }
         }
      }
      .user:hover {
         background-color: #f5f7fa;
         .popUps {
            display: block;
         }
      }
   }
}
</style>