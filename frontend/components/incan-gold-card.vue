<template>
	<div>
		{{ test }}
	</div>
</template>

<script lang="ts" setup>
const test = ref('gg')

class DisaplyCard {
	path: string = '';
	updatePath(url: string) {
		this.path = url
	}
}

const props = defineProps({
	// card: {
	// 	type: DisaplyCard,
	// 	required: true,
	// },
	vertical: {
		type: Boolean,
		default: false,
	},
});

// const { card, vertical } = toRefs(props)
const { vertical } = toRefs(props)
</script>

<style>
	.card-img {
		width: 80px;
		cursor: pointer;
		border-radius: 4px;
	}
	.card-img:hover {
		transform: translateX(50px);
	}
	.card-img__vertical {
		transform: rotate(90deg);
	}
</style>
