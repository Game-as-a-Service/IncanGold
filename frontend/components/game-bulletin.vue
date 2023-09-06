<template>
  <div class="game-bulletin">
    <div ref="wrapper" class="game-bulletin__wrapper">
      <div
        v-for="data in bulletin"
        :key="data.id"
        :class="['game-bulletin__message', `is-${data.mode}-bulletin`]"
      >
        <div>
          <span v-if="data.title" class="game-bulletin__message__title">
            {{ data.title }}
          </span>
          <span class="game-bulletin__message__content">
            {{ data.message }}
          </span>
        </div>
        <time class="game-bulletin__message__time">{{ data.time }}</time>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const createEvent = (mode: string, message: string, title?: string) => ({
  id: window.crypto.randomUUID(),
  mode,
  message,
  title,
  time: new Date().toLocaleString("zh-TW", { timeStyle: "short" }).slice(2),
});
const bulletin = ref<ReturnType<typeof createEvent>[]>([]);
const wrapper = ref<HTMLElement>();

onMounted(() => {
  // mock data
  bulletin.value = [
    createEvent("player", "已進入房間。", "player 1"),
    createEvent("player", "已進入房間。", "player 2"),
    createEvent("player", "已進入房間。", "player 3"),
    createEvent("player", "已準備就緒。", "player 1"),
    createEvent("player", "已準備就緒。", "player 2"),
    createEvent("player", "已準備就緒。", "player 3"),
    createEvent("game", "第一回合開始。"),
    createEvent("card", "出現了！！", "寶石卡 12"),
    createEvent("card", "平均分給 5 位探險者。", "寶石卡 12"),
    createEvent("player", "你獲得了 2 分。"),
    createEvent("player", "剩餘 2 顆寶石留在通道內。"),
  ];
  nextTick(() => {
    wrapper.value?.scrollTo({ top: wrapper.value.scrollHeight });
  });
});
</script>

<style scoped>
.game-bulletin {
  box-sizing: border-box;
  padding: 10px;
  padding-left: 20px;
  width: 421px;
  height: 276px;
  background-color: rgba(132, 132, 132, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 20px;
  line-height: 26px;
}

.game-bulletin__wrapper {
  overflow-y: scroll;
  height: 100%;
  padding-right: 5px;
  scrollbar-width: thin;
	scrollbar-color: rgba(4, 4, 4, 0.35)  rgba(132, 132, 132, 0.2);
}
.game-bulletin__wrapper::-webkit-scrollbar {
  width: 16px;
}

.game-bulletin__wrapper::-webkit-scrollbar-track{
	background-color: rgba(132, 132, 132, 0.2);
	border-radius: 10px;
}

.game-bulletin__wrapper::-webkit-scrollbar-thumb {
  background: rgba(4, 4, 4, 0.35);
  border-radius: 10px;
}

.game-bulletin__message {
  padding-right: 6px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  vertical-align: middle;
}
.game-bulletin__message + .game-bulletin__message {
  margin-top: 5px;
}

.is-game-bulletin.game-bulletin__message {
  color: #ff0000;
  background: rgba(0, 0, 0, 0.42);
}
.game-bulletin__message__title::before {
  content: "[ ";
  color: #fff;
}
.game-bulletin__message__title::after {
  content: " ]";
  color: #fff;
}
.is-card-bulletin .game-bulletin__message__title {
  color: rgba(33, 255, 0, 0.65);
}
.game-bulletin__message__time {
  font-size: 15px;
  color: #7b7b7b;
}
</style>
