<script setup>

const router = useRouter()

function chagneRoute(path) {
  if (!path) {
    return
  }
  router.push(path)
}
</script>

<template>
  <loby-layout>
    <template #frame>
      <div class="pages-main__actions">
        <form-button text="隨機加入" @click="chagneRoute('/')" />
        <form-button text="創建房間" @click="chagneRoute('/create-room')" />
        <form-button text="房間清單" @click="chagneRoute('/room-list')" />
        <form-button text="設定" @click="chagneRoute('')" />
      </div>
    </template>
  </loby-layout>
</template>

<style>
.pages-main__actions {
  width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pages-main__actions > button {
  width: 100%;
}

.pages-main__actions > button:not(:last-child) {
  margin-bottom: 26px;
}
</style>