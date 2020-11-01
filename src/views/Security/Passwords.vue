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
				<tr v-for="item in desserts" :key="item.uuid" @click.stop="displayInfo(item)">
					<td>{{ item.name }}</td>
					<td>{{ item.calories }}</td>
					<td>{{ item.uuid }}</td>
				</tr>
			</tbody>
		</v-simple-table>

		<!-- sidebar right with info -->
		<v-navigation-drawer v-model="drawer" absolute temporary right width="500px">
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>John Leider</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-divider></v-divider>

			<v-list dense>
				<v-list-item v-for="item in items" :key="item.title" link>
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

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
					<v-row align="center">
						<v-checkbox v-model="userEnabled" hide-details class="shrink mr-2 mt-0"></v-checkbox>
						<v-text-field :disabled="!userEnabled" label="Username" prepend-icon="mdi-account-outline" v-model="username"></v-text-field>
					</v-row>
					<v-row align="center">
						<v-checkbox v-model="emailEnabled" hide-details class="shrink mr-2 mt-0"></v-checkbox>
						<v-text-field :disabled="!emailEnabled" label="Email" prepend-icon="mdi-account-outline" v-model="email"></v-text-field>
					</v-row>
					<v-text-field required type="password" label="Password" prepend-icon="mdi-lock-outline" v-model="password"></v-text-field>

					<h6 class="text-h6 mt-5">Options</h6>
					<v-combobox v-model="select" :items="items" label="Category" clearable multiple small-chips prepend-icon="mdi-shape-outline"></v-combobox>
					<v-text-field required type="text" label="Custom category" v-model="custom" v-if="displayCustomCategory"></v-text-field>

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
			desserts: [],

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
			userEnabled: false,
			username: "",
			emailEnabled: false,
			email: "",
			password: "",
			items: ["Social", "Entrainement", "Professional", "Custom"],
			select: [],
			displayCustomCategory: false,
			custom: ""
		};
	},

	watch: {
		select: "displayCustomCategoryFunction",
	},

	mounted() {
		this.$electron.send("GET_TABLE");
		this.$electron.once("GET_TABLE_REPLY", (event, arg) => {
			this.desserts = arg;
		});
	},
	methods: {
		displayInfo(element) {
			this.drawer = !this.drawer;
		},
		displayCustomCategoryFunction() {
			if(this.select.includes("Custom")){
				this.displayCustomCategory = true;
			} else {
				this.displayCustomCategory = false;
			}
		},
		validate() {
			this.$refs.form.validate();

			this.loading = true;
			this.valid = !this.valid;
		},
		cancelModal() {
			this.dialog = false;
			this.loading = false;
			this.valid = true;
		}
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
