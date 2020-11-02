<template>
	<div id="passwords">
		<!-- tableau -->
		<v-simple-table fixed-header height="100vh">
			<thead>
				<tr>
					<th class="text-left">
						Plateform
					</th>
					<th class="text-left">
						Email
					</th>
					<th class="text-left">
						Categories
					</th>
					<th class="text-left" id="options">
						Options
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in data" :key="item.uuid" @click.stop="displayInfo(item)">
					<td>{{ item.plateform }}</td>
					<td>{{ item.email }}</td>
					<td>
						<v-chip-group>
							<v-chip v-for="category in item.categories" :key="category" small color="primary">
								{{ category }}
							</v-chip>
							<v-chip v-for="(category, index) in item.custom" :key="category" small v-show="index < 2">
								{{ category }}
							</v-chip>
						</v-chip-group>
					</td>
					<td>
						<v-btn x-small outlined color="error" class="mr-3" @click.stop="">
							<v-icon small>mdi-trash-can-outline</v-icon>
						</v-btn>
						<v-btn x-small text color="success" @click.stop="">
							<v-icon small>mdi-pencil-outline</v-icon>
						</v-btn>
					</td>
				</tr>
			</tbody>
		</v-simple-table>

		<!-- sidebar right with info -->
		<v-navigation-drawer v-model="drawer" absolute temporary right width="350px"></v-navigation-drawer>

		<!-- modal pour ajouter un nouveau mdp -->
		<v-dialog v-model="dialog" persistent max-width="50%">
			<!-- Button bottom right -->
			<template v-slot:activator="{ on: dialog, attrs }">
				<v-speed-dial v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction" :transition="transition">
					<template v-slot:activator>
						<v-btn v-model="fab" color="blue darken-2" dark fab>
							<v-icon v-if="fab">
								mdi-close
							</v-icon>
							<v-icon v-else>
								mdi-menu
							</v-icon>
						</v-btn>
					</template>

					<v-tooltip left>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn fab dark small color="green" v-bind="attrs" v-on="{ ...tooltip, ...dialog }">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</template>
						<span>Add an account</span>
					</v-tooltip>

					<v-tooltip left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn fab dark small color="blue" :loading="loadingRefresh" @click="refresh()" v-bind="attrs" v-on="on">
								<v-icon>mdi-refresh</v-icon>
							</v-btn>
						</template>
						<span>Refresh</span>
					</v-tooltip>
				</v-speed-dial>
			</template>

			<v-card class="py-6 px-8">
				<h4 class="text-center text-h4 mb-6">New account</h4>
				<v-alert border="left" text type="error" v-if="alert">{{ alertMessage }}</v-alert>
				<v-form ref="form" v-model="valid">
					<h6 class="text-h6">Essential informations</h6>
					<v-text-field required type="text" label="Plateform" prepend-icon="mdi-search-web" v-model="plateform" :rules="plateformRules"></v-text-field>

					<v-row align="center">
						<v-checkbox v-model="userEnabled" hide-details class="shrink mr-2 mt-0" @click="usernameCheck()" :rules="checkboxRules"></v-checkbox>
						<v-text-field :disabled="!userEnabled" label="Username" prepend-icon="mdi-account-outline" v-model="username" :rules="usernameRules"></v-text-field>
					</v-row>
					<v-row align="center">
						<v-checkbox v-model="emailEnabled" hide-details class="shrink mr-2 mt-0" @click="emailCheck()" :rules="checkboxRules"></v-checkbox>
						<v-text-field :disabled="!emailEnabled" label="Email" prepend-icon="mdi-at" v-model="email" :rules="emailRules"></v-text-field>
					</v-row>
					<v-text-field required type="password" label="Password" prepend-icon="mdi-lock-outline" v-model="password" :rules="passwordRules">
						<template v-slot:append-outer>
							<v-btn text @click="autoGeneratePass()">
								<v-icon left>
									mdi-creation
								</v-icon>
								Auto-generate
							</v-btn>
						</template>
					</v-text-field>

					<h6 class="text-h6 mt-5">Options</h6>
					<v-combobox v-model="select" :items="items" label="Category" clearable multiple small-chips prepend-icon="mdi-shape-outline"></v-combobox>
					<v-text-field type="text" label="Custom category" hint="You can add multiple custom category by separating them with a space" v-model="custom" @keyup="createCustomChips()" v-if="displayCustomCategory" :rules="customRules"></v-text-field>
					<v-chip-group v-if="custom">
						<v-chip v-for="chip in customChips" :key="chip">
							{{ chip }}
						</v-chip>
					</v-chip-group>

					<div class="mt-5">
						<v-btn class="mr-3" color="primary" @click="validate" :disabled="!valid" :loading="loading">Add</v-btn>
						<v-btn text color="secondary" @click="cancelModal()">Cancel</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-dialog>

		<v-snackbar v-model="snackbar">
			{{ snackbarMessage }}
			<template v-slot:action="{ attrs }">
				<v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script>
const cryptoRandomString = require("crypto-random-string");

export default {
	name: "Passwords",
	data() {
		return {
			data: [],
			drawer: false,

			direction: "top",
			fab: false,
			fling: false,
			hover: false,
			tabs: null,
			right: true,
			top: false,
			left: false,
			bottom: true,
			transition: "slide-y-reverse-transition",
			loadingRefresh: false,

			dialog: false,

			valid: true,
			loading: false,

			plateform: "",
			username: "",
			email: "",
			password: "",
			select: [],
			custom: "",
			customChips: [],

			userEnabled: false,
			emailEnabled: false,

			plateformRules: [(v) => !!v || "Plateform is required"],
			passwordRules: [(v) => !!v || "Password is required"],
			checkboxRules: [false || "Is required"],
			usernameRules: [],
			emailRules: [],
			customRules: [],

			items: ["Social", "Entrainement", "Professional", "Custom"],
			displayCustomCategory: false,

			snackbar: false,
			snackbarMessage: "",
			alert: false,
			alertMessage: "",
		};
	},

	watch: {
		select: "displayCustomCategoryFunction",
		userEnabled: "checkboxUpdateValid",
		emailEnabled: "checkboxUpdateValid",
	},

	mounted() {
		this.$electron.send("GET_TABLE");
		this.$electron.once("GET_TABLE_REPLY", (event, arg) => {
			this.data = arg;
		});
	},
	methods: {
		refresh() {
			this.loadingRefresh = true;
			this.$electron.send("GET_TABLE");
			this.$electron.once("GET_TABLE_REPLY", (event, arg) => {
				this.data = arg;
				this.loadingRefresh = false;
			});
		},
		autoGeneratePass() {
			this.password = cryptoRandomString({ length: 25, type: "ascii-printable" });
		},
		checkboxUpdateValid() {
			if ([this.userEnabled, this.emailEnabled].filter((s) => s === true).length > 0) {
				this.checkboxRules = [true || "Is required"];
			} else {
				this.checkboxRules = [false || "Is required"];
			}
		},
		displayInfo(element) {
			this.drawer = !this.drawer;
		},
		displayCustomCategoryFunction() {
			if (this.select.includes("Custom")) {
				this.displayCustomCategory = true;
				this.customRules = [(v) => !!v || "Custom category is required", (v) => this.customChips.filter((c) => c.length > 15).length === 0 || "Custom categories must be less then 20 charateres"];
			} else {
				this.custom = "";
				this.customRules = [];
				this.displayCustomCategory = false;
				this.customChips = [];
			}
		},
		createCustomChips() {
			this.customChips = this.custom.trim().split(" ");
		},
		validate() {
			this.$refs.form.validate();

			this.loading = true;

			this.$electron.send("POST_NEW_ACCOUNT", {
				plateform: this.plateform,
				username: this.username,
				email: this.email,
				password: this.password,
				category: this.select,
				custom: this.customChips,
			});

			this.$electron.once("POST_NEW_ACCOUNT_REPLY", (event, arg) => {
				if (arg.status === "error") {
					this.alert = true;
					this.alertMessage = arg.message;
					this.loading = false;
				} else {
					this.loading = false;
					this.snackbar = true;
					this.dialog = false;
					this.$refs.form.reset();
					this.snackbarMessage = arg.message;
					this.$electron.send("GET_TABLE");
					this.$electron.once("GET_TABLE_REPLY", (event, arg) => {
						this.data = arg;
					});
				}
			});
		},
		cancelModal() {
			this.$refs.form.reset();
			this.dialog = false;
			this.loading = false;
			this.alert = false;
			this.alertMessage = "";
		},
		usernameCheck() {
			if (!this.userEnabled) {
				this.username = "";
				this.usernameRules = [];
			} else {
				this.usernameRules = [(v) => !!v || "Username is required"];
			}
		},
		emailCheck() {
			if (!this.emailEnabled) {
				this.email = "";
				this.emailRules = [];
			} else {
				this.emailRules = [(v) => !!v || "Email is required"];
			}
		},
	},
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
#passwords .v-speed-dial {
	position: absolute;
}

#passwords .v-btn--floating {
	position: relative;
}

#options {
	min-width: 150px;
}
</style>
