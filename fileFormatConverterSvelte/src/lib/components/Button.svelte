<script lang="ts">
  interface Props {
    label?: string;
    onclick?: () => void;
  }
  
  
  let { label = 'Button', onclick }: Props = $props();
</script>

<button {onclick}>{label}</button>

<style>
button {
  transition: color 0.3s ease;
  max-width: 960px;
  margin: 40px auto;
  display: flex;
}

button:hover {
  color: springgreen;
}
</style>
