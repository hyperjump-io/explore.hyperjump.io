<style>
  .fixed {
    position: relative !important;
  }

  .fixed :global(*) {
    position: absolute !important;
  }
</style>

<span class="fixed">
  <slot />
</span>
