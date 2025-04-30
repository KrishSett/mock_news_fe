<template>
	<header class="header">
		<div class="header__container">
			
			<h1 class="header__title">News Portal</h1>
		</div>
	</header>
</template>

<script>
import ApiService from '@/common/api.service.js';

export default {
	name: 'AppHeader',
	data() {
		return {
			baseURL: process.env.VUE_APP_API_URL
		}
	},
	async beforeMount(){
		const api = new ApiService(this.baseURL);
		const response = await api.get('/categories');

		console.log(response);
	}
}
</script>