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

const props = defineProps({
  mode: {
    type: String,
    default: ''
  }
})

const { mode } = toRefs(props)

const description = computed(() => {
  if (mode.value === 'login') {
    return '其他登入方式'
  }
  if (mode.value === 'signup') {
    return '選擇其他註冊的方式'
  }
  return ''
})
</script>

<template>
  <div class="components-form-social-login">
    <div>{{description}}</div>
    <div>
      <template v-for="(social, indexOfSocial) in socials" :key="indexOfSocial">
        <button class="components-form-social-login-button" @click="clickSocial(social.name)" :disabled="social.disabled">
          <img :src="social.icon" :alt="social.name">
        </button>
      </template>
    </div>
  </div>
</template>

<style>
.components-form-social-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.components-form-social-login > :first-child {
  color: rgba(255, 255, 255, 1);
  margin-bottom: 30px;
}

.components-form-social-login > :last-child {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.components-form-social-login > :last-child :not(:last-child) {
  margin-right: 32px;
}

.components-form-social-login-button {
  outline: none;
  border-radius: 100%;
  border-width: 0;
  background-color: transparent;
  padding: 0;
}

.components-form-social-login-button img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  object-position: center;
}
</style>
