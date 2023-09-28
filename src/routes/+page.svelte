<script>
  import { onMount } from "svelte"
  import { get } from "@hyperjump/browser";
  import ThemeSelector from "../components/ThemeSelector.svelte";
  import HyperjumpCode from "../components/Hyperjump.svelte";


  let url = "";
  const theme = "solarized-dark";

  onMount(() => {
    if (window.location.href.slice(window.location.origin.length) === window.location.pathname) {
      window.location.replace("/#");
    }

    onHashChange();
  });

  const onHashChange = () => {
    url = decodeURI(window.location.hash.substring(1));
  };

  const go = (event) => {
    if (event.keyCode === 13) {
      window.location.hash = encodeURI(event.target.value);
      url = event.target.value;
    }
  }

  $: doc = (async function () {
    if (url === "") {
      return;
    }

    const scheme = new URL(url).protocol;
    location.protocol = scheme;

    const nextDoc = await get(url);
    let locationUrl = window.location.origin + "/#" + encodeURI(nextDoc.baseUri);
    if (nextDoc.cursor) {
      locationUrl += "#" + nextDoc.cursor;
    }
    window.location.replace(locationUrl);

    return nextDoc;
  }());
</script>

<svelte:window on:hashchange={onHashChange} />

<svelte:head>
  <title>Hyperjump - Browser</title>
</svelte:head>

<ThemeSelector />

<main>
  <h1>Hyperjump - Browser</h1>

  <input class="url-bar"
         placeholder="https://"
         value={url}
         on:keyup={go}
         aria-label="URL Bar" />
  <HyperjumpCode {doc} indent="2" />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: .5em;
    height: 100%;
  }

  h1 {
    margin: auto;
    padding-bottom: .5em;
  }

  .url-bar {
    width: 100%;
    box-sizing: border-box;
    padding: .5em;
    border: thin solid var(--text-color);
    margin-bottom: .5em;
    font-family: monospace;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  .url-bar:focus {
    background-color: var(--line-focus-background-color);
  }
</style>
