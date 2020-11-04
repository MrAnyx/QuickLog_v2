<template>
	<div>
		<v-toolbar flat light>
			<v-toolbar-title>Settings</v-toolbar-title>
			
		</v-toolbar>
		<v-divider></v-divider>
		<v-tabs vertical>
			<v-tab>
				<v-icon left>mdi-account</v-icon>
				Option 1
			</v-tab>
			<v-tab>
				<v-icon left>mdi-lock</v-icon>
				Option 2
			</v-tab>

			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>Sed aliquam ultrices mauris. Donec posuere vulputate arcu. Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.</p>
						<p>Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</p>
						<p class="mb-0">Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Phasellus blandit leo ut odio.</p>
					</v-card-text>
				</v-card>
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
export default {
	name: "Settings",
};
</script>
