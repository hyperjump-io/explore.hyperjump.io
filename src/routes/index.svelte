<script>
  import { onMount } from "svelte"
  import Hyperjump from "@hyperjump/browser";
  import HyperjumpCode from "../components/Hyperjump.svelte"


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
      return Hyperjump.nil;
    }

    const schemelessUrl = location.href.match(/.+?:(.+)/)[1];
    const scheme = url.split(":", 1)[0];
    window.location.replace(`${scheme}:${schemelessUrl}`);

    const nextDoc = await Hyperjump.get(url, doc || Hyperjump.nil);
    window.location.replace(window.location.origin + "/#" + encodeURI(nextDoc.url));

    return nextDoc;
  }());
</script>

<svelte:window on:hashchange={onHashChange} />

<svelte:head>
	<title>Hyperjump</title>
</svelte:head>

<main>
  <h1>Hyperjump</h1>

  <input class="url-bar {theme}"
         placeholder="https://"
         value={url}
         on:keyup={go}
         aria-label="URL Bar" />
  <HyperjumpCode {doc} indent="2" {theme} />
</main>

<style>
  .url-bar {
    width: 100%;
    box-sizing: border-box;
    padding: .5em;
    border: none;
    margin-bottom: .5em;
    font-family: monospace;
  }

  .url-bar:focus {
    background-color: var(--line-focus-background-color);
  }

  :global(.hyperjump) {
    height: 100%;
    line-height: 1.5em;
    overflow-y: scroll;
    padding: .5em;
    margin-bottom: 1em;
  }
</style>
