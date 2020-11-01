<template>
	<div id="passwords">
		<!-- tableau -->
		<v-simple-table fixed-header height="100vh">
			<thead>
				<tr>
					<th class="text-left">
						Name
					</th>
					<th class="text-left">
						Calories
					</th>
					<th class="text-left">
						uuid
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in []" :key="item.uuid" @click.stop="displayInfo(item)">
					<td>{{ item.name }}</td>
					<td>{{ item.calories }}</td>
					<td>{{ item.uuid }}</td>
				</tr>
			</tbody>
		</v-simple-table>

		<!-- sidebar right with info -->
		<v-navigation-drawer v-model="drawer" absolute temporary right width="350px"></v-navigation-drawer>

		<!-- modal pour ajouter un nouveau mdp -->
		<v-dialog v-model="dialog" persistent max-width="50%">
			<!-- Button bottom right -->
			<template v-slot:activator="{ on, attrs }">
				<v-speed-dial v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction" :open-on-hover="hover" :transition="transition">
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
					<v-btn fab dark small color="green" v-bind="attrs" v-on="on">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</v-speed-dial>
			</template>

			<v-card class="py-6 px-8">
				<h4 class="text-center text-h4 mb-6">New account</h4>
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
					<v-text-field required type="password" label="Password" prepend-icon="mdi-lock-outline" v-model="password" :rules="passwordRules"></v-text-field>

					<h6 class="text-h6 mt-5">Options</h6>
					<v-combobox v-model="select" :items="items" label="Category" clearable multiple small-chips prepend-icon="mdi-shape-outline"></v-combobox>
					<v-text-field required type="text" label="Custom category" v-model="custom" v-if="displayCustomCategory" :rules="customRules"></v-text-field>

					<div class="mt-5">
						<v-btn class="mr-3" color="primary" @click="validate" :disabled="!valid" :loading="loading">Add</v-btn>
						<v-btn text color="secondary" @click="cancelModal()">Cancel</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
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

			dialog: false,

			valid: true,
			loading: false,
			plateform: "",
			username: "",
			email: "",
			password: "",
			custom: "",
			select: [],

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
				this.customRules = [(v) => !!v || "Custom category is required"];
			} else {
				this.custom = "";
				this.customRules = [];
				this.displayCustomCategory = false;
			}
		},
		validate() {
			this.$refs.form.validate();

			this.loading = true;
			this.valid = !this.valid;
		},
		cancelModal() {
			this.$refs.form.reset();
			this.dialog = false;
			this.loading = false;
			this.valid = true;
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
</style>
