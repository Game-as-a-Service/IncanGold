<script setup>

const socials = [
  {
    name: 'Google',
    icon: '/google.png',
    disabled: true
  },
  {
    name: 'Facebook',
    icon: '/facebook.png',
    disabled: true
  },
  {
    name: 'X',
    icon: '/x.png',
    disabled: true
  },
  {
    name: 'Discord',
    icon: '/discord.png',
    disabled: true
  }
]

function clickSocial(name) {
  console.log(`${name} is clicked`)
}
</script>

<template>
  <loby-layout>
    <div>login</div>
  </loby-layout>
  <!-- <div class="pages-login">
    <div class="pages-login__title">
      <p class="font-cubic">印加寶藏</p>
      <p class="font-cubic">INCAN GOLD</p>
    </div>
    <div class="pages-login__main">
      <div class="pages-login__form">
        <div class="pages-login__input">
          <div>帳號</div>
          <input />
        </div>
        <div class="pages-login__input">
          <div>密碼</div>
          <input />
        </div>
        <div class="pages-login__input">
          <div>確認密碼</div>
          <input />
        </div>
        <div class="pages-login__input">
          <div>E-mail</div>
          <input />
        </div>
        <button class="pages-login__register">註冊</button>
      </div>
      <div class="pages-login__divide" />
      <div class="pages-login__other-login">
        <div>其他登入方式</div>
        <div>
          <template v-for="(social, indexOfSocial) in socials" :key="indexOfSocial">
            <button class="pages-login__other-login-button" @click="clickSocial(social.name)" :disabled="social.disabled">
              <img :src="social.icon" :alt="social.name">
            </button>
          </template>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style>
.pages-login {
  background-color: #0E0A31;
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: 57px;
  padding-bottom: 57px;
}

.pages-login__title {
  width: 883px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 80px;
}

.pages-login__title p {
  color: white;
  margin: 0;
}

.pages-login__title p:first-child {
  font-size: 128px;
  font-weight: 400;
  line-height: 128px;
  letter-spacing: 0.27em;
  text-align: left;
}

.pages-login__title p:last-child {
  font-size: 90px;
  font-weight: 400;
  line-height: 90px;
  letter-spacing: 0;
  text-align: left;
  text-align: right;
}

.pages-login__main {
  width: 587px;
  padding: 55px 98px 37px 98px;
  box-sizing: border-box;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
  border: 4px solid rgba(147, 147, 147, 1);
  background: linear-gradient(0deg, rgba(132, 132, 132, 0.2), rgba(132, 132, 132, 0.2));
}

.pages-login__form {
  display: flex;
  flex-direction: column;
  margin-bottom: 48px;
}

.pages-login__input {
  display: flex;
  flex-direction: column;
  height: 67px;
}


.pages-login__input :first-child {
  color: rgba(255, 255, 255, 1);
  margin-bottom: 6px;
}

.pages-login__input :last-child {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  border-width: 0;
  outline: none;
  background-color: rgba(186, 186, 186, 0.47);
}

.pages-login__input:not(:last-child) {
  margin-bottom: 16px;
}

.pages-login__register {
  color: rgba(0, 0, 0, 1);
  background-color: #FFD15C;
  border-radius: 10px;
  border-width: 0;
  outline: none;
  padding: 14.5px 72px;
  align-self: center;
}

.pages-login__other-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pages-login__divide {
  width: 100%;
  height: 1px;
  background: rgba(147, 147, 147, 1);
  margin-bottom: 18px;
}

.pages-login__other-login > :first-child {
  color: rgba(255, 255, 255, 1);
  margin-bottom: 30px;
}

.pages-login__other-login > :last-child {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.pages-login__other-login > :last-child :not(:last-child) {
  margin-right: 30px;
}

.pages-login__other-login-button {
  outline: none;
  border-radius: 100%;
  border-width: 0;
  background-color: transparent;
}

.pages-login__other-login-button img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  object-position: center;
}
</style>
