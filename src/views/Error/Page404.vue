<template>
	<v-container fill-height fluid id="Page404">
		<v-row align="center" justify="center">
			<v-col>
				<v-overlay justify="center">
					<h2 class="text-h2 font-weight-medium text-center">Content not found</h2>
					<h6 class="text-h6 text-center mt-3">The content you're looking for doesn't exist.</h6>
					<div class="text-center mt-12">
						<v-btn color="blue-grey-4" class="white--text" to="/">
							Go back
							<v-icon right dark>
								mdi-subdirectory-arrow-left
							</v-icon>
						</v-btn>
					</div>
				</v-overlay>
				<v-img max-width="100vw" max-height="80vh" contain src="../../assets/404-image.png"> </v-img>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Page404",
};
</script>
