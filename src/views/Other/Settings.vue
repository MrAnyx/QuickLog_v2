<template>
	<div>
		<v-toolbar flat light>
			<span class="headline">
				Settings
			</span>
			<v-btn color="primary" class="ml-auto" v-if="changes" @click.stop="applyChanges">Apply changes</v-btn>
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

				<h6 class="text-h6 mt-5">value</h6>
				<v-slider v-model="value" step="1" class="align-center" max="40" min="8" thumb-label hide-details>
					<template v-slot:thumb-label="{ value }">
						<v-icon color="white">{{ weakness[Math.floor((value * 3) / 40)] }}</v-icon>
					</template>
					<template v-slot:append>
						<v-text-field v-model="value" class="mt-0 pt-0" max="40" min="8" hide-details single-line type="number" style="width: 60px"></v-text-field>
					</template>
				</v-slider>

				<h6 class="text-h6 mt-5">Example</h6>
				<v-text-field v-model="example" readonly solo single-line></v-text-field>
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
const cryptoRandomString = require("crypto-random-string");
var shuffle = require("shuffle-array");

export default {
	name: "Settings",
	data() {
		return {
			value: 25,
			weakness: ["mdi-alert-circle-outline", "mdi-check", "mdi-arm-flex"],
			cases: ["lower", "upper", "numeric"],
			special: true,

			checkboxRules: [(v) => this.cases.length > 0 || "You must select at least one case type"],

			example: "",

			changes: false,

			stringlist: "",
		};
	},
	watch: {
		cases: "updateChanges",
		value: "updateChanges",
		special: "updateChanges",
	},
	mounted() {
		this.$electron.send("GET_OPTIONS");
		this.$electron.once("GET_OPTIONS_REPLY", (event, arg) => {
			this.length = arg.passwords.length;
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
		});
	},
	methods: {
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
		updateChanges() {
			this.changes = true;
			this.generateExample();
		},
		applyChanges() {
			this.changes = false;

			// finir la fonction ici
		},
	},
};
</script>
