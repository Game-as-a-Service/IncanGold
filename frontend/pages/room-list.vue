<script setup>
const router = useRouter()

const roomList = ref([
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  },
  {
    name: '房間名稱',
    playerLimit: 8,
    playerCount: 4,
    hostName: 'player name'
  }
])

function goBack() {
  router.back()
}
</script>

<template>
  <loby-layout>
    <div class="pages-room-list__main">
      <div class="pages-room-list__back-arrow">
        <img src="/go_back_arrow.png" alt="go back" @click="goBack">
      </div>
      <div class="pages-room-list__room-list">
        <room-card v-for="(room, indexOfRoom) in roomList" :key="indexOfRoom" :info="room" />
      </div>
    </div>
  </loby-layout>
</template>

<style>
.pages-room-list__main {
  position: relative;
  width: 1231px;
  padding: 56px 45px 45px 56px;
}

.pages-room-list__back-arrow {
  position: absolute;
  top: 24px;
  left: 23px;
}

.pages-room-list__back-arrow img {
  width: 32px;
  height: 32px;
  object-fit: center;
  object-position: center;
  cursor: pointer;
}

.pages-room-list__room-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>