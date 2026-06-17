<!-- Download Button: Untouched-->

<script lang="ts">
    import Button from '$lib/components/Button.svelte';
</script>

<Button class="primary sm">
    My button 
</Button>

<Button class="danger lg" on:click={() => alert("Button clicked!")}>
    My button
</Button>