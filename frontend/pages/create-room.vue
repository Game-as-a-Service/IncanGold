<script setup>
const router = useRouter()

const form = reactive({
  room: '',
  password: ''
})

function goBack() {
  router.back()
}

function createRoom() {
  console.log('createRoom')
}
</script>

<template>
  <loby-layout>
    <div class="pages-create-room__main">
      <div class="pages-create-room__back-arrow">
        <img src="/go_back_arrow.png" alt="go back" @click="goBack">
      </div>
      <div class="pages-create-room__form">
        <div class="pages-create-room__form-info">
          <form-input class="pages-create-room__form-input" label="房間名稱" v-model:value="form.room"/>
          <form-input class="pages-create-room__form-input" label="密碼(選填)" v-model:value="form.password"/>
        </div>
        <div class="pages-create-room__form-actions">
          <form-button text="創建房間" @click="createRoom"/>
        </div>
      </div>
    </div>
  </loby-layout>
</template>

<style>
.pages-create-room__main {
  width: 588px;
  position: relative;
  padding: 56px 56px 96px 56px;
  box-sizing: border-box;
}

.pages-create-room__back-arrow {
  position: absolute; 
  top: 24px;
  left: 23px;
}

.pages-create-room__back-arrow img {
  width: 32px;
  height: 32px;
  object-fit: center;
  object-position: center;
  cursor: pointer;
}

.pages-create-room__form {
  padding-top: 48px;
}

.pages-create-room__form-info {
  margin-bottom: 100px;
}

.pages-create-room__form-input:not(:last-child) {
  margin-bottom: 48px;
}

.pages-create-room__form-actions {
  display: flex;
  justify-content: center;
}
</style>