<script>
  import { onMount } from "svelte"
  import { get } from "@hyperjump/browser";
  import Footer from "../components/Footer.svelte";
  import Hyperjump from "../components/Hyperjump.svelte";
  import ThemeSelector from "../components/ThemeSelector.svelte";


  let url = "";

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

  $: document = (async function () {
    if (url === "") {
      return;
    }

    const scheme = new URL(url).protocol;
    location.protocol = scheme;

    const nextDoc = await get(url);
    let locationUrl = window.location.origin + "/#" + encodeURI(nextDoc.uri);
    window.location.replace(locationUrl);

    return nextDoc;
  }());
</script>

<svelte:window on:hashchange={onHashChange} />

<svelte:head>
  <title>Hyperjump - Explorer</title>
</svelte:head>

<ThemeSelector />

<div class="layout">
  <h1>Hyperjump - Explorer</h1>

  <main>
    <input class="url-bar"
           placeholder="https://"
           value={url}
           on:keyup={go}
           aria-label="URL Bar" />
    <Hyperjump {document} indent="2" />
  </main>

  <Footer />
</div>

<style>
  .layout {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: auto 1fr auto;
    grid-gap: .5em;
    height: 100%;
    padding: .5em;
  }

  main {
    display: flex;
    flex-direction: column;
    min-height: 200px;
    overflow-y: hidden;
  }

  h1 {
    margin: auto;
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
