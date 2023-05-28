<template>
	<!-- <img
		alt="Card Image"
		:src="card.path"
		:class="['card-img', { 'card-img__vertical': vertical }]" /> -->
	<div>
		{{ test }}
	</div>
</template>

<script lang="ts" setup>
import { Card } from 'incan-gold-core'

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

onMounted(() => {
	console.log('GG')
	console.log(Card)
})
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
