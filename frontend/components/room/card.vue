<script setup>
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const { info } = toRefs(props)
</script>

<template>
  <div class="components-room-card font-cubic">
    <div class="components-room-card__info">
      <div class="components-room-card__info-name">{{ info.name }}</div>
      <div class="components-room-card__info-text">
        <div>人數：</div>
        <div>{{ info.playerCount }} / {{ info.playerLimit }}</div>
      </div>
      <div class="components-room-card__info-text">
        <div>房主：</div>
        <div>{{ info.hostName }}</div>
      </div>
    </div>
    <div class="components-room-card__join">加入</div>
  </div>
</template>

<style>
.components-room-card {
  width: calc((100% - 22px) / 2);
  height: 141px;
  box-sizing: border-box;
  padding: 24px 22px 24px 24px;
  background-color: #84848433;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 11px;
  margin-bottom: 11px;
  border-radius: 20px;
}

.components-room-card__info > div:not(:last-child) {
  margin-bottom: 12px;
}

.components-room-card__info-name {
  color: #FFD15C;
}

.components-room-card__info-text {
  display: flex;
  flex-direction: row;
  color: white;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
}

.components-room-card__join {
  width: 93px;
  height: 93px;
  line-height: 93px;
  text-align: center;
  background-color: #FFD15C;
  border-radius: 100%;
}
</style>
