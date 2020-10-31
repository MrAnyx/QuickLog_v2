<template>
	<v-container fluid id="image-login" fill-height>
		<v-row align="center" justify="center">
			<v-col sm="6" lg="4">
				<v-card class="py-6 px-8">
					<h4 class="text-center text-h4 mb-6">Login</h4>
					<v-text-field label="Username" prepend-icon="mdi-account-outline"></v-text-field>
					<v-text-field label="Password" prepend-icon="mdi-lock-outline"></v-text-field>

					<div class="mt-5">
						<v-btn color="primary" class="mr-5" :loading="loadingLogin" @click.stop="clickLogin()">Login</v-btn>
						<v-btn text to="/register">Register</v-btn>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Login",
	data() {
		return {
			loadingLogin: false
		}
	},
	methods: {
		clickLogin() {
			this.loadingLogin = true
			// ici faire la vérif du compte
			this.$router.push('passwords');
		}
	}
};
</script>
<style scoped>
#image-login {
	background-image: url("../../assets/login-background.jpeg");
	background-repeat: no-repeat;
	background-size: cover;
}

#image-login::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.8);
}
</style>
