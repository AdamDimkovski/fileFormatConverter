<script lang="ts">
	import bg1 from '$lib/assets/background-img1.jpg';
	import bg2 from '$lib/assets/background-img2.jpg';
	import bg3 from '$lib/assets/background-img3.jpg';
</script>

<main>
<div class="container">
	<img src={bg1} alt="background_1" class="bg-img">
	<img src={bg2} alt="background_2" class="bg-img">
	<img src={bg3} alt="background_3" class="bg-img">
	<div class="overlay"></div>
</div>
</main>
<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.container {
        overflow: hidden;
		width: 100%;
        max-width: 100%;
        height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
	:global(html, body) {
		overflow-x: hidden;
	}
	.overlay {
		background-color: rgba(0,0,0,0.5);
		width: 100%;
        max-width: 100%;
        height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
	.bg-img {
        aspect-ratio: auto;
		width: 100%;
        max-width: 100%;
        height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		object-fit: cover;
		animation: fade 15s ease-in-out infinite alternate;
		z-index: 1;
	}
	.bg-img:nth-child(1) {
		animation-delay: 0s;
	}
	.bg-img:nth-child(2) {
		animation-delay: 5s;
	}
	.bg-img:nth-child(3) {
		animation-delay: 10s;
	}
	@keyframes fade {
		0% {
			opacity: 1;
		}
		33% {
			opacity: 0;
		}
		67% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

</style>