<template>
	<header class="header">
		<div class="header__container">

			<h1 class="header__title">News Portal {{authToken}}</h1>
		</div>
	</header>
</template>

<script>
export default {
	name: "AppHeader",
	props: {
		authToken: {
			type: String,
			default: "News Portal"
		}
	}
}
</script>