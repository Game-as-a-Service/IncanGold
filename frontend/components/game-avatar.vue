<template>
  <div :class="['game-avatar', { 'game-avatar__empty': emptyPlayer }]">
    <img :src="playerAvatar" alt="avatar">
    <p>{{ playerName }}</p>
    <div v-if="!playerIsHost && !emptyPlayer" :class="['game-avatar__status', { 'game-avatar__status--ready': playerIsReady }]" />
  </div>
</template>

<script setup>
import { compose, defaultTo, isEmpty, isNil, path } from 'ramda'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const { user } = toRefs(props)

const emptyPlayer = computed(() => {
  return isNil(user.value) || isEmpty(user.value)
})

const playerIsHost = computed(() => {
  return path(['host'], user.value)
})

const playerName = computed(() => {
  return path(['name'], user.value)
})

const playerAvatar = computed(() => {
  return compose(defaultTo('./player.png'), path(['avatar']))(user.value) 
})

const playerIsReady = computed(() => {
  return path(['avatar'], user.value) === 'ready'
})
</script>

<style>
.game-avatar {
  width: 158px;
  height: 183px;
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(228, 228, 228, 0.3);
  border-radius: 20px;
  position: relative;
  box-sizing: border-box;
}

.game-avatar__empty {
  background-color: transparent;
}

.game-avatar img {
  width: 120px;
  height: 120px;
  background-color: transparent;
  border: 1px solid #939393;
  border-radius: 50%;
}

.game-avatar p {
  font-size: 16px;
  width: 100%;
  margin: 0px;
  font-size: 18px;
  color: #fff;
  line-height: 22px;
  text-align: center;
}

.game-avatar__status {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 17px;
  background-color: #BEBDBD;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.game-avatar__status--ready {

}
</style>