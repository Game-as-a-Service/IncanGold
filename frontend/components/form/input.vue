<template>
  <div class="components-form-login-input">
    <div>{{ label }}</div>
    <input v-model="inputValue" />
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:value'])

const { value, label } = toRefs(props)

const inputValue = computed({
  get() {
    return value.value
  },
  set(event) {
    emits('update:value', event)
  }
})
</script>

<style>
.components-form-login-input {
  display: flex;
  flex-direction: column;
  height: 67px;
}

.components-form-login-input :first-child {
  color: rgba(255, 255, 255, 1);
  margin-bottom: 6px;
}

.components-form-login-input :last-child {
  width: 390px;
  height: 42px;
  border-radius: 10px;
  border-width: 0;
  outline: none;
  background-color: rgba(186, 186, 186, 0.47);
  padding: 12px;
  color: #fff;
}
</style>
