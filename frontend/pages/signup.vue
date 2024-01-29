<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
const router = useRouter();
const HOST = "https://incan-gold.fly.dev";

const form = reactive({
  account: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const password = computed(() => form.password);

const rules = {
  account: {
    required,
    $autoDirty: true,
  },
  password: { required, $autoDirty: true, minLengthValue: minLength(8) },
  confirmPassword: {
    required,
    $autoDirty: true,
    sameAsPassword: sameAs(password),
  },
  email: { required, $autoDirty: true, email },
};

const v$ = useVuelidate(rules, form);
const getValidationInfo = (field) => {
  return {
    invalid: computed(() => v$.value[field].$invalid),
    dirty: computed(() => v$.value[field].$dirty),
  };
};

let accountInvalid = getValidationInfo("account").invalid;
const accountDirty = getValidationInfo("account").dirty;
const pwdInvalid = getValidationInfo("password").invalid;
const pwdDirty = getValidationInfo("password").dirty;
const checkPwdInvalid = getValidationInfo("confirmPassword").invalid;
const checkPwdDirty = getValidationInfo("confirmPassword").dirty;
const emailInvalid = getValidationInfo("email").invalid;
const emailDirty = getValidationInfo("email").dirty;

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
      router.push("/login");
    }
  });
}
</script>

<template>
  <loby-layout>
    <div class="pages-signup__main">
      <div class="pages-signup__form">
        <div class="pages-signup__form-info">
          <form-input
            :class="[
              'pages-signup__input',
              {
                'pages-signup__is-valid': !accountInvalid && accountDirty,
                'pages-signup__is-invalid': accountInvalid && accountDirty,
              },
            ]"
            label="帳號"
            v-model:value="form.account"
          />
          <div
            :class="[
              'pages-signup__warning',
              accountInvalid && accountDirty ? 'd-block' : 'd-none',
            ]"
          >
            請輸入帳號
          </div>
          <form-input
            :class="[
              'pages-signup__input',
              {
                'pages-signup__is-valid': !pwdInvalid && pwdDirty,
                'pages-signup__is-invalid': pwdInvalid && pwdDirty,
              },
            ]"
            label="密碼"
            v-model:value="form.password"
          />
          <div
            :class="[
              'pages-signup__warning',
              pwdInvalid && pwdDirty ? 'd-block' : 'd-none',
            ]"
          >
            密碼格式錯誤
          </div>
          <form-input
            :class="[
              'pages-signup__input',
              {
                'pages-signup__is-valid': !checkPwdInvalid && checkPwdDirty,
                'pages-signup__is-invalid': checkPwdInvalid && checkPwdDirty,
              },
            ]"
            label="確認密碼"
            v-model:value="form.confirmPassword"
          />
          <div
            :class="[
              'pages-signup__warning',
              checkPwdInvalid && checkPwdDirty ? 'd-block' : 'd-none',
            ]"
          >
            密碼與確認密碼不符
          </div>
          <form-input
            :class="[
              'pages-signup__input',
              {
                'pages-signup__is-valid': !emailInvalid && emailDirty,
                'pages-signup__is-invalid': emailInvalid && emailDirty,
              },
            ]"
            label="E-mail"
            v-model:value="form.email"
          />
          <div
            :class="[
              'pages-signup__warning',
              emailInvalid && emailDirty ? 'd-block' : 'd-none',
            ]"
          >
            Email 格式錯誤
          </div>
        </div>
        <div class="pages-signup__form-action">
          <form-button
            text="註冊"
            @click="submitForm"
            :disabled="
              accountInvalid || pwdInvalid || checkPwdInvalid || emailInvalid
            "
          />
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
