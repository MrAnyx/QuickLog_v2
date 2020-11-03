<template>
	<v-app>
		<v-navigation-drawer app permanent color="blue-grey lighten-5" v-if="displaySideBarVariable">
			<v-layout justify-center class="mt-10 mb-6">
				<v-img src="./assets/logo_sm.png" max-width="150px"></v-img>
			</v-layout>

			<v-list>
				<div v-for="(section, i) in sidebar" :key="section.name">
					<v-subheader :class="{ 'mt-8': i > 0 }">{{ section.name }}</v-subheader>
					<v-list-item v-for="[icon, text, link] in section.links" :key="icon" class="mx-3 my-2" :to="link">
						<v-list-item-icon>
							<v-icon>{{ icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ text }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</div>
			</v-list>

			<template v-slot:append>
				<v-row class="px-3">
					<v-col>
						<v-btn text color="red">
							Logout
						</v-btn>
					</v-col>
					<v-spacer></v-spacer>
					<v-col>
						<v-btn text to="/settings">
							<v-icon>
								mdi-cog-outline
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</template>
		</v-navigation-drawer>

		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
	data: () => ({
		sidebar: [
			{
				name: "SECURITY",
				links: [
					["mdi-account-lock-outline", "Passwords", "/passwords"],
					["mdi-credit-card-outline", "Payment", "/payment"],
					["mdi-note-multiple-outline", "Secure notes", "/notes"],
				],
			},
			{
				name: "MANAGER",
				links: [["mdi-view-dashboard-outline", "Dashboard", "/dashboard"]],
			},
		],
		displaySideBarVariable: false,
	}),
	watch: {
		$route: function() {
			if (this.$route.path !== "/login" && this.$route.path !== "/register" && this.$route.path !== "/" && this.$route.name !== "404") {
				this.displaySideBarVariable = true;
			}
		},
	},
	mounted() {
		if (this.$route.path !== "/login" && this.$route.path !== "/register" && this.$route.path !== "/" && this.$route.name !== "404") {
			this.displaySideBarVariable = true;
		}
	},
};
</script>

<style>
/* reset style */
html,
body {
	box-sizing: border-box;
	margin: 0px;
	padding: 0px;
}

/* disable useless scrollbar */
body::-webkit-scrollbar {
	display: none;
}

/* width */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
	background: rgba(141, 141, 141, 0.144);
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: rgba(141, 141, 141, 0.596);
	border-radius: 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: rgba(141, 141, 141, 0.767);
}
</style>
