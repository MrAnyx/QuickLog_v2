<template>
	<div>
		<v-form ref="form" v-model="valid">
			<v-toolbar flat light>
				<span class="headline">
					Settings
				</span>
				<v-btn color="primary" class="ml-auto" v-if="changes" @click.stop="applyChanges" :disabled="!valid">Apply changes</v-btn>
			</v-toolbar>
			<v-divider></v-divider>
			<v-tabs vertical>
				<v-tab left>
					<v-icon left>mdi-cog</v-icon>
					Configuration
				</v-tab>
				<v-tab left>
					<v-icon left>mdi-account</v-icon>
					Account
					<v-spacer></v-spacer>
				</v-tab>

				<v-tab-item class="pa-5">
					<h6 class="text-h6">Characters & symbols</h6>
					<v-checkbox v-model="cases" label="Include lower case characters" value="lower" :rules="checkboxRules"></v-checkbox>
					<v-checkbox v-model="cases" label="Include upper case characters" value="upper" :rules="checkboxRules"></v-checkbox>
					<v-checkbox v-model="cases" label="Include numeric values" value="numeric" :rules="checkboxRules"></v-checkbox>
					<v-checkbox v-model="special" label="Include symbols"></v-checkbox>

					<h6 class="text-h6 mt-5">Length</h6>
					<v-slider v-model="value" step="1" class="align-center" max="40" min="8" thumb-label hide-details>
						<template v-slot:thumb-label="{ value }">
							<v-icon color="white">{{ weakness[Math.floor((value * 3) / 41)] }}</v-icon>
						</template>
						<template v-slot:append>
							<v-text-field v-model="value" class="mt-0 pt-0" max="40" min="8" hide-details single-line type="number" style="width: 60px"></v-text-field>
						</template>
					</v-slider>

					<h6 class="text-h6 mt-5">Example</h6>
					<v-text-field v-model="example" readonly solo single-line></v-text-field>
				</v-tab-item>
				<v-tab-item class="pa-5">
					<h6 class="text-h6">Credentials</h6>
					<v-form ref="form" v-model="validUsername">
						<v-text-field required type="text" label="New username" prepend-icon="mdi-account-outline" v-model="username" :rules="usernameRules">
							<template v-slot:append-outer>
								<v-btn text color="primary" @click="updateUsername()">
									Update
								</v-btn>
							</template>
						</v-text-field>
					</v-form>
				</v-tab-item>
			</v-tabs>

			<v-snackbar v-model="snackbar" text :color="snackbarStatus">
				{{ snackbarMessage }}
				<template v-slot:action="{ attrs }">
					<v-btn text v-bind="attrs" @click="snackbar = false">
						Close
					</v-btn>
				</template>
			</v-snackbar>
		</v-form>
	</div>
</template>

<script>
const cryptoRandomString = require("crypto-random-string");
var shuffle = require("shuffle-array");

export default {
	name: "Settings",
	data() {
		return {
			valid: true,
			weakness: ["mdi-alert-circle-outline", "mdi-check", "mdi-arm-flex"],
			value: 8,
			cases: [],
			special: true,

			checkboxRules: [(v) => this.cases.length > 0 || "You must select at least one case type"],

			example: "",

			changes: false,

			stringlist: "",

			snackbar: false,
			snackbarStatus: "",
			snackbarMessage: "",

			// --------- Account -------------

			validUsername: true,
			username: "",
			usernameRules: [(v) => !!v || "Username is required", (v) => v.length <= 50 || "Username must be less than 50 characters"],
		};
	},
	mounted() {
		this.$electron.send("GET_OPTIONS");
		this.$electron.once("GET_OPTIONS_REPLY", (event, arg) => {
			this.value = arg.passwords["length"];
			if (arg.passwords.upper) {
				this.cases.push("upper");
			}
			if (arg.passwords.lower) {
				this.cases.push("lower");
			}
			if (arg.passwords.numeric) {
				this.cases.push("numeric");
			}
			this.special = arg.passwords.special;
			this.generateExample();
			this.enableWatcher();
		});
	},
	methods: {
		updateUsername() {
			/* update password here
			
			TODO: Mettre à jour le fichier auth / options
			TODO: Modifier le fichier data
			TODO: Modifier l'attribut 'uuid' et 'owner.username' dans le fichier data
			TODO: Modifier le localStorage avec les nouvelles infos
			
			*/
		},
		enableWatcher() {
			this.$watch("value", function(oldVal, newVal) {
				this.changes = true;
				this.generateExample();
			});
			this.$watch("cases", function(oldVal, newVal) {
				this.changes = true;
				this.generateExample();
			});
			this.$watch("special", function(oldVal, newVal) {
				this.changes = true;
				this.generateExample();
			});
		},
		generateExample() {
			this.stringlist = "";
			if (this.cases.includes("lower")) {
				this.stringlist += "abcdefghijklmnopqrstuvwxyz";
			}
			if (this.cases.includes("upper")) {
				this.stringlist += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			}
			if (this.cases.includes("numeric")) {
				this.stringlist += "0123456789";
			}
			if (this.special) {
				this.stringlist += "!#$%&()*+,-./:;<=>?@[]^_{|}~";
			}
			this.example = cryptoRandomString({ length: this.value, characters: shuffle(this.stringlist.split("")).join("") });
		},
		applyChanges() {
			this.$refs.form.validate();
			this.$electron.send("POST_CHANGES", {
				cases: this.cases,
				length: this.value,
				special: this.special,
			});
			this.$electron.once("POST_CHANGES_REPLY", (event, arg) => {
				if (arg.status === "error") {
					this.snackbarStatus = arg.status;
					this.snackbar = true;
					this.snackbarMessage = arg.message;
				} else {
					this.snackbarStatus = arg.status;
					this.snackbar = true;
					this.snackbarMessage = arg.message;
					this.changes = false;
				}
			});
		},
	},
};
</script>
