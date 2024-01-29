<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

const router = useRouter();

const form = reactive({
  account: '',
  password: '',
});

const HOST = 'https://incan-gold.fly.dev';

const rules = {
  account: {
    required,
    $autoDirty: true,
  },
  password: { required, $autoDirty: true, minLengthValue: minLength(8) },
};

const v$ = useVuelidate(rules, form);
const getValidationInfo = (field) => {
  return {
    invalid: computed(() => v$.value[field].$invalid),
    dirty: computed(() => v$.value[field].$dirty),
  };
};

let accountInvalid = getValidationInfo('account').invalid;
const accountDirty = getValidationInfo('account').dirty;
const pwdInvalid = getValidationInfo('password').invalid;
const pwdDirty = getValidationInfo('password').dirty;
console.log(accountInvalid, '，', pwdInvalid);
const isValid = computed(() => accountInvalid.value || pwdInvalid.value);
console.log(isValid);

function submitForm() {
  const params = {
    username: form.account,
    password: form.password,
  };

  useFetch(`${HOST}/users/login`, {
    method: 'POST',
    body: params,
  })
    .then((res) => {
      console.log(res.data);

      alert(`登入成功`);
      router.push('/room-list');
    })
    .catch((err) => {
      console.log(err);
    });
}

function gotoSignup() {
  router.push('/signup');
}
</script>

<template>
  <loby-layout>
    <div class="pages-login__main">
      <div class="pages-login__form">
        <div class="pages-login__form-info">
          <form-input
            :class="[
              'pages-login__input',
              {
                'pages-login__is-valid': !accountInvalid && accountDirty,
                'pages-login__is-invalid': accountInvalid && accountDirty,
              },
            ]"
            label="帳號"
            v-model:value="form.account"
            @change="() => console.log('帳號', accountInvalid)"
          />
          <div
            :class="[
              'pages-login__warning',
              accountInvalid && accountDirty ? 'd-block' : 'd-none',
            ]"
          >
            請輸入帳號
          </div>
          <form-input
            :class="[
              'pages-login__input',
              {
                'pages-login__is-valid': !pwdInvalid && pwdDirty,
                'pages-login__is-invalid': pwdInvalid && pwdDirty,
              },
            ]"
            label="密碼"
            v-model:value="form.password"
            @change="() => console.log('密碼', pwdInvalid)"
          />
          <div
            :class="[
              'pages-login__warning',
              pwdInvalid && pwdDirty ? 'd-block' : 'd-none',
            ]"
          >
            密碼格式錯誤
          </div>
        </div>
        <div class="pages-login__form-action">
          <form-button text="登入" :disabled="isValid" @click="submitForm" />
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
  margin-bottom: 45px;
}

.pages-login__form-info {
  margin-bottom: 24px;
}

.pages-login__input:not(:first-child) {
  margin-top: 24px;
}

.pages-login__form-action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pages-login__form-action > button:not(:last-child) {
  margin-bottom: 16px;
}

.pages-login__is-valid :last-child {
  border: 2px solid #38c985;
}

.pages-login__is-invalid :last-child {
  border: 2px solid #c63737;
}

.pages-login__warning {
  margin-top: 12px;
  color: #c63737;
  font-size: 14px;
}

.d-none {
  display: none;
}
</style>
