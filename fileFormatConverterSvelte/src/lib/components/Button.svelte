<script lang="ts">
  interface Props {
    label?: string;
    onclick?: () => void;
  }
  
  
  let { label = 'Button', onclick }: Props = $props();
</script>

<button {onclick}>{label}</button>

<style>
button:hover {
  background-color: black;
}
</style>
