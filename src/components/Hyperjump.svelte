<script>
  import { value } from "@hyperjump/browser";
  import { generateLines } from "../lib/jref-tokenizer.js";


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
  {#if lines.length}
  <div class="line-numbers">
  {#each [...Array(lines.length)] as _, lineNumber}
    <div>{lineNumber + 1}</div>
  {/each}
  </div>
  <div class="highlighted">
  {#each lines as line}
    <div class="line">
    {#each line as token}
    {#if token[0] === "GROUPING"}
      <span class="accent3">{token[1]}</span>
    {:else if token[0] === "PROPERTY"}
      &quot;<span class="accent1"><a href="#{token[2]}">{token[1]}</a></span>&quot;:&nbsp;
    {:else if token[0] === "ARRAY_INDEX"}
      <a href="#{token[2]}" class="array-index">{token[1]}</a>
    {:else if token[0] === "STRING"}
      &quot;<span class="accent7">{token[1]}</span>&quot;
    {:else if token[0] === "NUMBER"}
      <span class="accent7">{token[1]}</span>
    {:else if token[0] === "ATOM"}
      <span class="accent7">{token[1]}</span>
    {:else if token[0] === "HREF"}
      <a href="#{token[2]}" class="accent6">&lt;{token[1].href}&gt;</a>
    {:else if token[0] === "COMMA"}
      ,
    {:else if token[0] === "INDENT"}
      {@html "&nbsp;".repeat(indent)}
    {/if}
    {/each}
    </div>
  {/each}
  </div>
  {/if}
  {:catch error}
  <div class="hyperjump-error">
    {error.toString()}
    {#if error.cause}
    <br />
    Caused By: {error.cause.toString()}
    {/if}
  </div>
  {/await}
</div>

<style>
  .hyperjump {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;
    grid-gap: 0;
    height: 100%;
    font-family: monospace;
    border: thin solid var(--text-color);
    overflow: scroll;
  }

  .hyperjump-error {
    padding: .5em;
  }

  .line-numbers {
    position: sticky;
    left: 0;
    background: var(--background-color);
    border-right: thin solid var(--text-color);
    padding: .5em;
    text-align: right;
  }

  .highlighted {
    padding: .5em;
  }

  a {
    color: inherit;
  }

  a:hover {
    font-weight: bold;
    filter: brightness(125%);
  }

  .array-index {
    padding-right: .5em;
  }

  .line {
    white-space: nowrap;
  }

  .line:hover {
    background-color: var(--line-focus-background-color);
  }

  .line:hover .array-index {
    filter: brightness(150%);
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
