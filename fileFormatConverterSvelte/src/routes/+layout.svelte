<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Background from '$lib/components/Background.svelte';

	let { children } = $props();
</script>

<svelte:head>

<!-- Favicon -->
<link rel="icon" href={favicon} />

<!-- Google Analytics -->
<script src="https://google.com" async defer>

</script>
</svelte:head>

<Background />
{@render children()}


