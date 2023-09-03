<script setup>
const form = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  email: ''
})

function submitForm() {
  console.log('signup')
}
</script>

<template>
  <loby-layout>
    <div class="pages-signup__main">
      <div class="pages-signup__form">
        <div class="pages-signup__form-info">
          <form-input class="pages-signup__input" label="帳號" v-model:value="form.account" />
          <form-input class="pages-signup__input" label="密碼" v-model:value="form.password" />
          <form-input class="pages-signup__input" label="確認答案" v-model:value="form.confirmPassword" />
          <form-input class="pages-signup__input" label="E-mail" v-model:value="form.email" />
        </div>
        <div class="pages-signup__form-action">
          <form-button text="註冊" @click="submitForm" />
          <div class="pages-signup__go-to-login">已有帳號? <router-link to="/login">點此登入</router-link></div>
        </div>
      </div>
      <form-divide />
      <form-social mode="signup" />
    </div>
  </loby-layout>
</template>

<style>
.pages-signup__main {
  width: 587px;
  padding: 36px 98px 31px 98px;
}

.pages-signup__form {
  margin-bottom: 45px;
}

.pages-signup__form-info {
  margin-bottom: 21px;
}

.pages-signup__input:not(:last-child) {
  margin-bottom: 16px;
}

.pages-signup__form-action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pages-signup__go-to-login {
  margin-top: 21px;
  color: white;
}

.pages-signup__go-to-login a {
  color: white;
}

.pages-signup__go-to-login a:active,
.pages-signup__go-to-login a:focus {
  color: #FFC700;
}
</style>
