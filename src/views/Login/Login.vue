<template>
	<v-container fluid id="image-register" fill-height>
		<v-row align="center" justify="center">
			<v-col sm="6" lg="4">
				<v-card class="py-6 px-8">
					<h4 class="text-center text-h4 mb-6">Login</h4>
					<v-form ref="form" v-model="valid">
						<v-alert border="left" class="mb-8" text :color="alertColor" v-if="alertShow">{{ alertMessage }}</v-alert>
						<v-text-field required label="Username" prepend-icon="mdi-account-outline" v-model="username" :rules="usernameRules"></v-text-field>
						<v-text-field required class="my-5" type="password" label="Password" prepend-icon="mdi-lock-outline" v-model="password" :rules="passwordRules"></v-text-field>
						<div class="mt-5">
							<v-btn color="primary" class="mr-5" @click="validate" :disabled="!valid" :loading="loading">Login</v-btn>
							<v-btn text to="/register">Register</v-btn>
						</div>
					</v-form>
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
			username: "",
			usernameRules: [(v) => !!v || "Username is required"],
			password: "",
			passwordRules: [(v) => !!v || "Password is required"],

			alertMessage: "",
			alertShow: false,
			alertColor: "red",

			valid: true,
			loading: false,
		};
	},
	methods: {
		validate() {
			this.$refs.form.validate();

			this.loading = true;

			this.$electron.send("POST_LOGIN", {
				username: this.username,
				password: this.password
			});

			this.$electron.once("POST_LOGIN_REPLY", (event, arg) => {
				this.alertShow = true;
				this.alertColor = arg.status === "success" ? "green" : "red";
				this.alertMessage = arg.message;

				if (arg.status === "success") {
					setTimeout(() => {
						this.loading = false;
						this.$router.push({ name: 'passwords' })
					}, 2000)
				} else {
					this.loading = false;
				}
			});
		}
	},
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
