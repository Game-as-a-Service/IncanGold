<template>
	<img
		alt="Card Image"
		:src="card.path"
		:class="['card-img', { 'card-img__vertical': vertical }]" />
</template>

<script lang="ts" setup>
	import Card from '@/utils/Card'

	const props = defineProps({
		card: {
			type: Card,
			required: true,
		},
		vertical: {
			type: Boolean,
			default: false,
		},
	});

	const { card, vertical } = toRefs(props);
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
