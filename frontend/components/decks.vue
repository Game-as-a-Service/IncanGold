<template>
  <div class="decks">
    <IncanGoldCard
      v-for="index in 7"
      :key="index"
      class="decks__card"
      :style="{
        '--index': `${index * - 3}px`,
      }"
    />
  </div>
</template>

<style>
.decks {
  position: relative;
  margin-right: 28px;
  width: 144px;
  height: 100%;
}
.decks__card {
  position: absolute;
  top: 50%;
  left: 28px;
  width: 100%;
  transform: translate(calc(var(--index)), calc(-50% + 5px));
}
</style>
