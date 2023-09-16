<script setup>
const router = useRouter();

const form = reactive({
  account: "",
  password: "",
});

function submitForm() {
  console.log("login");
}

function gotoSignup() {
  router.push("/signup");
}
</script>

<template>
  <loby-layout>
    <div class="pages-login__main">
      <div class="pages-login__form">
        <div class="pages-login__form-info">
          <form-input
            class="pages-login__form-input"
            label="帳號"
            v-model:value="form.account"
          />
          <form-input
            class="pages-login__form-input"
            label="密碼"
            v-model:value="form.password"
          />
        </div>
        <div class="pages-login__form-action">
          <form-button text="登入" @click="submitForm" />
          <form-button text="註冊" @click="gotoSignup" />
        </div>
      </div>
      <form-divide />
      <form-social mode="login" />
    </div>
  </loby-layout>
</template>

<style>
.pages-login__main {
  padding: 36px 98px 31px 98px;
}

.pages-login__form {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}

.pages-login__form-info {
  margin-bottom: 16px;
}

.pages-login__form-input:not(:last-child) {
  margin-bottom: 16px;
}

.pages-login__form-action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pages-login__form-action > button:not(:last-child) {
  margin-bottom: 16px;
}
</style>
