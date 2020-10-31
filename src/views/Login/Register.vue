<template>
	<v-container fluid id="image-register" fill-height>
		<v-row align="center" justify="center">
			<v-col sm="6" lg="4">
				<v-card class="py-6 px-8">
					<h4 class="text-center text-h4 mb-6">Register</h4>
					<v-text-field label="Username" prepend-icon="mdi-account-outline"></v-text-field>
					<v-text-field label="Password" prepend-icon="mdi-lock-outline"></v-text-field>
					<v-text-field label="Confirm password" prepend-icon="mdi-lock-outline"></v-text-field>

					<div class="mt-5">
						<v-btn color="primary" class="mr-5">Register</v-btn>
						<v-btn text to="/login">Back to login</v-btn>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Register",
};
</script>

<style scoped>
#image-register {
	background-image: url("../../assets/login-background.jpeg");
	background-repeat: no-repeat;
	background-size: cover;
}

#image-register::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(255, 255, 255, 0.8);
}
</style>
