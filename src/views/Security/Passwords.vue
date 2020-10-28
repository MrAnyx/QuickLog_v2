<template>
	<div>
		<v-simple-table fixed-header height="100vh">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left">
							Name
						</th>
						<th class="text-left">
							Calories
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in desserts" :key="item.name">
						<td>{{ item.name }}</td>
						<td>{{ item.calories }}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>

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

		<v-container class="fill-height">
			<v-row align="center" justify="center">
				<v-btn color="pink" dark @click.stop="drawer = !drawer">
					Toggle
				</v-btn>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	name: "Passwords",
	data() {
		return {
			desserts: [],
			drawer: false,
			items: [
				{ title: "Home", icon: "mdi-view-dashboard" },
				{ title: "About", icon: "mdi-forum" },
			],
		};
	},

	mounted() {
		this.$electron.send("GET_TABLE");
		this.$electron.once("GET_TABLE_REPLY", (event, arg) => {
			this.desserts = arg;
		});
	},
};
</script>
