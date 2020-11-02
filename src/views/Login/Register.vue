<template>
	<v-container fluid id="image-register" fill-height>
		<v-row align="center" justify="center">
			<v-col sm="6" lg="4">
				<v-card class="py-6 px-8">
					<h4 class="text-center text-h4 mb-6">Register</h4>
					<v-form ref="form" v-model="valid">
						<v-alert border="left" class="mb-8" text :color="alertColor" v-if="alertShow">{{ alertMessage }}</v-alert>
						<v-text-field required label="Username" prepend-icon="mdi-account-outline" v-model="username" :rules="usernameRules"></v-text-field>
						<v-text-field required class="my-5" type="password" label="Password" prepend-icon="mdi-lock-outline" v-model="password" :rules="passwordRules"></v-text-field>
						<v-text-field required label="Confirm password" type="password" prepend-icon="mdi-lock-outline" v-model="confPassword" :rules="confRules"></v-text-field>
						<div class="mt-5">
							<v-btn color="primary" class="mr-5" @click="validate" :disabled="!valid" :loading="loading">Register</v-btn>
							<v-btn text to="/login">Back to login</v-btn>
						</div>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Register",
	data() {
		return {
			username: "",
			usernameRules: [(v) => !!v || "Username is required", (v) => v.length <= 50 || "Username must be less than 50 characters"],
			password: "",
			passwordRules: [
				(v) => !!v || "Password is required",
				(v) => v.length > 20 || "Password must be more than 20 characters",
				(v) => this.containsUpperCaseChar(v) || "Password must contain at least 1 upper case character",
				(v) => this.containsSpecialChar(v) || "Password must contain at least 1 special character",
				(v) => this.containsInteger(v) || "Password must contain at least 1 special number",
			],
			confPassword: "",
			confRules: [(v) => !!v || "Password confirmation is required", (v) => v === this.password || "Confirmation password must be the same as your password"],

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

			this.$electron.send("POST_REGISTER", {
				username: this.username,
				password: this.password,
				confPassword: this.confPassword,
			});

			this.$electron.once("POST_REGISTER_REPLY", (event, arg) => {
				this.alertShow = true;
				this.alertColor = arg.status === "success" ? "green" : "red";
				this.alertMessage = arg.message;

				if (arg.status === "success") {
					setTimeout(() => {
						this.loading = false;
						this.$router.push("login")
					}, 2000)
				} else {
					this.loading = false;
				}
			});
		},
		containsSpecialChar(str) {
			return /[!@#$%^&*\(\)_+\-=\[\]\{\};\':\"\\|,.<>\/?]/.test(str);
		},
		containsUpperCaseChar(str) {
			return /[A-Z]/.test(str);
		},
		containsInteger(str) {
			return /[0-9]/.test(str);
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
