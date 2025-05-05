<template>
	<header class="header">
		<div class="header__container">
			<h1 class="header__title">News Portal</h1>
		</div>
	</header>
</template>

<script setup>
import { onUpdated } from 'vue';

const props = defineProps(['authToken']);

onUpdated(() => {
	console.log('TOKEN (onUpdated):', props.authToken);
});
</script>