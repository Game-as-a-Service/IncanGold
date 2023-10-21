<script setup>
console.clear();

const form = reactive({
  account: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const HOST = "https://incan-gold.fly.dev";

const accountIsValid = computed(() => {
  return form.account !== "";
});

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/;
const pwdIsValid = computed(() => {
  return pwdRegex.test(form.password);
});

const checkPwdIsValid = computed(() => {
  return form.password === form.confirmPassword && form.confirmPassword != "";
});

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const checkEmailIsValid = computed(() => {
  return emailRegex.test(form.email);
});

function submitForm() {
  const params = {
    username: form.account,
    password: form.password,
    email: form.email,
  };

  useFetch(`${HOST}/users/register`, {
    method: "POST",
    body: params,
  }).then((res) => {
    if (res.data._value.message == "Username already exists") {
      alert("帳號已存在");
    } else {
      alert("註冊成功");
    }
  });
}
</script>

<template>
  <loby-layout>
    <div class="pages-signup__main">
      <div class="pages-signup__form">
        <div class="pages-signup__form-info">
          <form-input :class="['pages-signup__input', {'pages-signup__is-valid': accountIsValid, 'pages-signup__is-invalid':!accountIsValid}]"  label="帳號" v-model:value="form.account" />
          <div :class="['pages-signup__warning',{'d-none': accountIsValid}]">請輸入帳號</div>
          <form-input :class="['pages-signup__input', {'pages-signup__is-valid': pwdIsValid, 'pages-signup__is-invalid':!pwdIsValid}]" label="密碼" v-model:value="form.password"/>
          <div :class="['pages-signup__warning',{'d-none': pwdIsValid}]">密碼格式錯誤</div>
          <form-input :class="['pages-signup__input', {'pages-signup__is-valid': checkPwdIsValid, 'pages-signup__is-invalid':!checkPwdIsValid}]" label="確認密碼" v-model:value="form.confirmPassword"/>
          <div :class="['pages-signup__warning',{'d-none': checkPwdIsValid}]">密碼與確認密碼不符</div>
          <form-input :class="['pages-signup__input', {'pages-signup__is-valid': checkEmailIsValid, 'pages-signup__is-invalid':!checkEmailIsValid}]" label="E-mail" v-model:value="form.email"/>
          <div :class="['pages-signup__warning',{'d-none': checkEmailIsValid}]">Email 格式錯誤</div>
        </div>
        <div class="pages-signup__form-action">
          <form-button text="註冊" @click="submitForm" />
          <div class="pages-signup__go-to-login">
            已有帳號? <router-link to="/login">點此登入</router-link>
          </div>
        </div>
      </div>
      <form-divide />
      <form-social mode="signup" />
    </div>
  </loby-layout>
</template>

<style>
.pages-signup__main {
  padding: 36px 98px 31px 98px;
}

.pages-signup__form {
  margin-bottom: 45px;
}

.pages-signup__form-info {
  margin-bottom: 24px;
}

.pages-signup__input:not(:first-child) {
  margin-top: 24px;
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
  color: #ffc700;
}

.pages-signup__is-valid :last-child {
  border: 2px solid #38c985;
}

.pages-signup__is-invalid :last-child {
  border: 2px solid #c63737;
}

.pages-signup__warning {
  margin-top: 12px;
  color: #c63737;
  font-size: 14px;
}

.d-none {
  display: none;
}
</style>