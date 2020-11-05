<template>
	<div>
		<v-toolbar flat light>
			<v-toolbar-title>Settings</v-toolbar-title>
		</v-toolbar>
		<v-divider></v-divider>
		<v-tabs vertical>
			<v-tab left>
				<v-icon left>mdi-account</v-icon>
				Configuration
			</v-tab>
			<v-tab>
				<v-icon left>mdi-lock</v-icon>
				Option 2
			</v-tab>

			<v-tab-item class="pa-5">
				<h6 class="text-h6">Characters & symbols</h6>
				<v-checkbox v-model="cases" label="Include lower case characters" value="lower" :rules="checkboxRules"></v-checkbox>
				<v-checkbox v-model="cases" label="Include upper case characters" value="upper" :rules="checkboxRules"></v-checkbox>
				<v-checkbox v-model="cases" label="Include numeric values" value="numeric" :rules="checkboxRules"></v-checkbox>
				<v-checkbox v-model="special" label="Include symbols"></v-checkbox>
				<v-slider v-model="value" step="1" class="align-center" max="40" min="8" thumb-label hide-details>
					<template v-slot:thumb-label="{ value }">
						<v-icon color="white">{{ weakness[Math.floor((value * 3) / 40)] }}</v-icon>
					</template>
					<template v-slot:append>
						<v-text-field v-model="value" class="mt-0 pt-0" max="40" min="8" hide-details single-line type="number" style="width: 60px"></v-text-field>
					</template>
				</v-slider>

				<v-text-field v-model="example" readonly solo></v-text-field>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.</p>
						<p class="mb-0">Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
const cryptoRandomString = require('crypto-random-string');
export default {
	name: "Settings",
	data() {
		return {
			value: 20,
			weakness: ["mdi-alert-circle-outline", "mdi-check", "mdi-arm-flex"],
			cases: ["lower", "upper", "numeric"],
			special: true,

			checkboxRules: [(v) => this.cases.length > 0 || "You must select at least one case type"],

			example: "bonjour",
		};
	},

	
};
</script>
