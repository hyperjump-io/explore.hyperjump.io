<script>
  import { value } from "@hyperjump/browser";
  import { generateLines } from "../lib/jref-tokenizer.js";
  import Fixed from "./Fixed.svelte";


  export let doc;
  export let indent;

  $: lines = (async function () {
    const d = await doc;
    if (!d) {
      return [];
    }
    const docValue = value(d);
    return generateLines(d.baseUri, docValue);
  }());
</script>

<div class="hyperjump">
  {#await lines}
    ... Loading ...
  {:then lines}
    {#each lines as line}
      <div class="line">
        {#each line as token}
          {#if token[0] === "GROUPING"}
            <span class="accent3">{token[1]}</span>
          {:else if token[0] === "PROPERTY"}
            &quot;<span class="accent1"><a href="#{token[2]}">{token[1]}</a></span>&quot;:&nbsp;
          {:else if token[0] === "ARRAY_INDEX"}
            <Fixed><a href="#{token[2]}" class="array-index">{token[1]}</a></Fixed>
          {:else if token[0] === "STRING"}
            &quot;<span class="accent7">{token[1]}</span>&quot;
          {:else if token[0] === "NUMBER"}
            <span class="accent7">{token[1]}</span>
          {:else if token[0] === "ATOM"}
            <span class="accent7">{token[1]}</span>
          {:else if token[0] === "HREF"}
            <a href="#{token[2]}">{token[1].href}</a>
          {:else if token[0] === "COMMA"}
            ,
          {:else if token[0] === "INDENT"}
            {@html "&nbsp;".repeat(indent)}
          {/if}
        {/each}
      </div>
    {/each}
  {:catch error}
    {error.toString()}
    {#if error.cause}
      <br />
      Caused By: {error.cause.toString()}
    {/if}
  {/await}
</div>

<style>
  .hyperjump {
    display: block;
    height: 100%;
    font-family: monospace;
    border: thin solid var(--text-color);
    overflow: scroll;
    padding: .5em;
  }

  a {
    color: inherit;
  }

  a:hover {
    font-weight: bold;
    filter: brightness(150%);
  }

  .array-index {
    right: .125em;
    filter: brightness(50%);
  }

  .line {
    white-space: nowrap;
  }

  .line:hover {
    background-color: var(--line-focus-background-color);
  }

  .line:hover .array-index {
    filter: brightness(100%);
  }

  .comment {
    color: var(--comment-color);
  }

  .accent1 {
    color: var(--accent1-color);
  }

  .accent2 {
    color: var(--accent2-color);
  }

  .accent3 {
    color: var(--accent3-color);
  }

  .accent4 {
    color: var(--accent4-color);
  }

  .accent5 {
    color: var(--accent5-color);
  }

  .accent6 {
    color: var(--accent6-color);
  }

  .accent7 {
    color: var(--accent7-color);
  }

  .accent8 {
    color: var(--accent8-color);
  }
</style>
