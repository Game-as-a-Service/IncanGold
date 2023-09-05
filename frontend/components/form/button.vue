<template>
  <button
    class="components-form-login-button font-cubic"
    :type="type"
    :disabled="disabled"
    @click="emitClick"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    defualt: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const { text, type, disabled } = toRefs(props)

const emits = defineEmits(['click'])

function emitClick() {
  emits('click')
}
</script>

<style>
.components-form-login-button {
  color: rgba(0, 0, 0, 1);
  background-color: #FFD15C;
  border-radius: 10px;
  border-width: 0;
  outline: none;
  padding: 14.5px 72px;
  cursor: pointer;
}

.components-form-login-button:hover {
  opacity: 0.6;
}

.components-form-login-button:disabled {
  cursor: not-allowed;
}
</style>