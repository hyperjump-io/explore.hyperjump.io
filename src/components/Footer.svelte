<script>
  import GitHubLink from "./GitHubLink.svelte";
  import NpmLink from "./NpmLink.svelte";
</script>

<footer>
  <ul>
    <li>
      <GitHubLink href="https://github.com/hyperjump-io/explore.hyperjump.io">
        hyperjump-io/explore.hyperjump.io
      </GitHubLink>
    </li>
    <li>
      <GitHubLink href="https://github.com/hyperjump-io/browser">
        hyperjump-io/browser
      </GitHubLink>
    </li>
    <li>
      <NpmLink href="https://www.npmjs.com/package/@hyperjump/browser">
        @hyperjump/browser
      </NpmLink>
    </li>
  </ul>
</footer>

<style>
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li:not(:first-child) {
    margin-left: 1em;
  }
</style>
