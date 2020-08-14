<template>
   <div class="login">
      <div class="loginBox" id="loginBox">
         <div class="longinIcon">
            <img src="../assets/login/logo_icon.png" alt />
         </div>
         <div class="pointText">
            <span v-show="signIn">账号密码登录</span>
            <span v-show="!signIn">注册信息</span>
         </div>
         <div class="loginContent">
            <!-- 登录 -->
            <div class="signIn" v-show="signIn">
               <div class="info">
                  <li>
                     <!-- <span>{{$store.getters.getLanguageText.LOGIN_user}}</span> -->
                     <span v-myText="'LOGIN_user'"></span>
                     <input type="text" v-model="login.uCode" @input="uCodeChange" placeholder="请输入账号" />
                  </li>
                  <li>
                     <!-- <span >{{$store.getters.getLanguageText.LOGIN_pwd}}</span> -->
                     <span v-myText="'LOGIN_pwd'"></span>
                     <input type="password" v-model="login.uPassword" @input="uPasswordChange" placeholder="请输入密码" />
                  </li>
                  <li>
                     <span>验证码</span>
                     <div class="checkCode">
                        <input type="text" v-model="login.imageCode" @input="imageCodeChange" placeholder="请输入验证码" />
                        <!-- <img src="../assets/login/captcha.png" alt=""> -->
                        <img :src="imgUrl" alt @click='getImageCode' />
                     </div>
                  </li>
               </div>
               <div class="loginBtn">
                  <myButton height="40px" @click="signInBtn">登录</myButton>
                  <myButton height="40px" @click="changeCh">中文</myButton>
                  <myButton height="40px" @click="changeEn">english</myButton>
               </div>
               <div class="registeredText">
                  <span @click="signIn = false">
                     <i>®</i> 还没有账号，现在注册
                  </span>
               </div>
            </div>
            <!-- 注册 -->
            <div class="registered" v-show="!signIn">
               <div class="info">
                  <li>
                     <span>账号</span>
                     <input type="text" v-model.trim="registeredData.uCode" placeholder="请输入登录账号" />
                  </li>
                  <li>
                     <span>密码</span>
                     <input type="password" v-model.trim="registeredData.uPassword" placeholder="请输入登录密码" />
                  </li>
                  <li>
                     <span>姓名</span>
                     <input type="text" v-model.trim="registeredData.uName" placeholder="请输入注册人姓名" />
                  </li>
                  <li>
                     <span>手机</span>
                     <input type="text" v-model.trim="registeredData.uPhone" placeholder="请输入注册人手机" />
                  </li>
                  <li>
                     <span>职位</span>
                     <el-radio-group v-model="registeredData.departId" class="position">
                        <el-radio :label="1">销售</el-radio>
                        <el-radio :label="2">技术</el-radio>
                        <el-radio :label="3">产品</el-radio>
                     </el-radio-group>
                  </li>
               </div>
               <div class="loginBtn">
                  <myButton height="40px" @click="registeredUser">注册</myButton>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: "login",
   data() {
      return {
         kkkk: this.$language,
         signIn: true,           // 是否为登录
         imgUrl: null,           // 后端获取的图片路径
         registeredData: {},     // 用户注册数据
         login: {
            uCode: "",
            uPassword: "",
            imageCode: ""
         }
      };
   },
   created() {
      this.getImageCode()
   },
   methods: {
      changeCh() {
         this.$store.commit('changeLanguage','ch')
      },

      changeEn() {
         this.$store.commit('changeLanguage','en')
      },
      
      // 获取验证码
      getImageCode() {
         this.$request.getImageCode().then(res => {
            this.imgUrl = URL.createObjectURL(res.data);
         }).catch(res => {
            this.$myMessage.errorMessage('获取验证码失败')
         });
      },

      // 登录
      signInBtn() {
         var params = Object.assign({}, this.login);
         params.uPassword = this.$Base64.encode(params.uPassword);
         this.$request.doLogin(params).then(res => {
            console.log(res,'用户信息');
            if(res.data.code == 200) {
               // 储存用户信息
               this.$store.commit('changeUserInfo',res.data.resp.user)
               this.$store.commit('changeToken',res.data.resp.token)
               this.$router.replace('/index')
            } else if(res.data.code == 203) {
               this.$myMessage.errorMessage('验证码错误，请重新输入')
               this.getImageCode()
            } else if(res.data.code == 205) {
               this.$myMessage.errorMessage('密码错误，请重新输入')
               this.getImageCode()
            }
         });
      },

      // 注册用户
      registeredUser() {
         let params = {
            uCode: this.registeredData.uCode || "",
            uPassword: this.registeredData.uPassword || "",
            uName: this.registeredData.uName || "",
            uPhone: this.registeredData.uPhone || "",
            departId: this.registeredData.departId || null,
         }
         if (!/^[0-9a-zA-Z]{4,20}$/.test(params.uPassword)) {
            this.$myMessage.warningMessage('账号只能是由4~20位字母和数字组成，不能包含空格和特殊字符')
            return
         } else if (!/^[0-9a-zA-Z]{6,15}$/.test(params.uPassword)) {
            this.$myMessage.warningMessage('密码只能是由6~15位字母和数字组成，不能包含空格和特殊字符')
            return
         } else if (params.uName == "") {
            this.$myMessage.warningMessage('用户名不能为空')
            return
         } else if (params.uName.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('用户名不能有空格')
            return
         } else if (params.uPhone == "") {
            this.$myMessage.warningMessage('手机号不能为空')
            return
         } else if (params.uPhone.indexOf(' ') !== -1) {
            this.$myMessage.warningMessage('手机号不能有空格')
            return
         } else if (!(/^1[3456789]\d{9}$/.test(params.uPhone))) {
            this.$myMessage.warningMessage('手机号格式有误')
            return
         } else if (params.departId == null) {
            this.$myMessage.warningMessage('请选择所在部门')
            return
         }

         params.uPassword = this.$Base64.encode(params.uPassword)

         // 需要添加手机号码格式验证和部门验证
         this.$request.setUser(params).then(res => {
            if(res.data.code == 200) {
               this.$myMessage.successMessage('注册用户成功')
            } else {
               this.$myMessage.errorMessage('注册用户失败')
            }
         })
      },

      // 账号,密码改变
      uCodeChange() {
         this.login.uCode = this.login.uCode.trim()
         if(this.login.uCode.indexOf(' ') != -1) {
            this.login.uCode = this.login.uCode.replace(/\s+/g,'')
         }
      },
      uPasswordChange() {
         this.login.uPassword = this.login.uPassword.trim()
         if(this.login.uPassword.indexOf(' ') != -1) {
            this.login.uPassword = this.login.uPassword.replace(/\s+/g,'')
         }
      },
      imageCodeChange() {
         this.login.imageCode = this.login.imageCode.trim()
         if(this.login.imageCode.indexOf(' ') != -1) {
            this.login.imageCode = this.login.imageCode.replace(/\s+/g,'')
         }
      }
   }
};
</script>

<style lang='less'>
.login {
   width: 100%;
   height: 100%;
   min-height: 600px;
   overflow: hidden;
   background: url("../assets/login/login_background.png") center center
      no-repeat;
   background-size: cover;
   position: relative;
   .loginBox {
      position: absolute;
      width: 28%;
      // height: 65%;
      max-width: 400px;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 5px;
      background: url("../assets/login/login_box.png") center center repeat;
      box-sizing: border-box;
      padding: 20px 20px 50px 20px;
   }

   .longinIcon {
      padding: 30px 0;
      height: 20%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
         width: 50%;
      }
   }
   .pointText {
      box-sizing: border-box;
      text-align: center;
      font-size: 16px;
      border-bottom: 2px solid #8a8987;
      color: #ffffff;
      span {
         display: inline-block;
         padding: 0 40px;
         line-height: 40px;
         border-bottom: 2px solid #0079fe;
         margin-bottom: -2px;
      }
   }
   .loginContent {
      .signIn,
      .registered {
         box-sizing: border-box;
         padding: 0 10%;
         div.info {
            padding: 5% 0;
         }
         li {
            box-sizing: border-box;
            border-bottom: 1px solid #8a8987;
         }
         li > span {
            display: inline-block;
            width: 35%;
            text-align: justify;
            line-height: 0;
            padding: 0 8%;
            box-sizing: border-box;
            font-size: 14px;
            color: #ffffff;
         }
         li > span::after {
            display: inline-block;
            content: "";
            overflow: hidden;
            width: 100%;
            height: 0;
            visibility: hidden;
         }
         li input {
            width: 65%;
            height: 60px;
            padding-right: 10px;
            box-sizing: border-box;
            background-color: transparent;
            color: #ffffff;
            font-size: 14px;
         }
         li div.position {
            width: 65%;
            height: 60px;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 10px;
            .el-radio {
               margin-right: 0;
               .el-radio__label {
                  padding-left: 5px;
               }
            }
         }
         li > .checkCode {
            display: inline-block;
            width: 65%;
            input {
               width: 60%;
            }
            img {
               width: 40%;
               height: 30px;
            }
         }
         .loginBtn {
            margin-top: 20px;
            button {
               width: 100%;
            }
         }
         .registeredText {
            padding: 30px;
            color: #0079fe;
            span {
               cursor: pointer;
            }
            i {
               font-size: 16px;
            }
         }
      }
   }

   @media screen and (max-device-width: 1366px) {
      .longinIcon {
         padding: 20px 0;
      }
      .loginContent {
         .signIn,
         .registered {
            li input {
               height: 60px;
            }
         }
      }
   }
   @media screen and (min-device-width: 1367px) {
      .longinIcon {
         padding: 30px 0;
      }
      .loginContent {
         .signIn,
         .registered {
            li input {
               height: 70px;
            }
         }
      }
   }
}
</style>