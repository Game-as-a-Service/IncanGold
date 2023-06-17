<template>
	<div class="card">
		<img class="card__back" src="card-back.png" alt="card back">
	</div>
</template>

<script lang="ts" setup>
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
	.card {
		position: relative;
		width: 100%;
		aspect-ratio: 17 / 21;
	}
	.card__back {
		position: absolute;
		inset: 0;
		width: 100%;
	}
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
