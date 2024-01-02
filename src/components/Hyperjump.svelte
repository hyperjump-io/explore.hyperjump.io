<script>
  import { afterUpdate } from "svelte";
  import { generateLines } from "../lib/jref-tokenizer.js";


  export let document;
  export let indent;

  let lines = [{ tokens: [] }];
  let container;
  let focusTarget;

  $: lineGenerator = (async function () {
    try {
      const doc = await document;
      lines = doc ? generateLines(doc.document.baseUri, doc.cursor, doc.document.root) : [{ tokens: [] }];
    } catch (error) {
      const errorLines = [{ tokens: [["ERROR", error.toString()]] }];
      if (error.cause) {
        errorLines.push({ tokens: [["ERROR", `Caused by: ${error.cause.toString()}`]] });
      }
      lines = errorLines;
    }
  }());

  afterUpdate(() => {
    if (focusTarget) {
      focusTarget.scrollIntoView({ behavior: "smooth" });
    } else {
      container.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  })
</script>

<div class="hyperjump" bind:this={container}>
  <div class="line-numbers">
  {#each lines as line, lineNumber}
    {#if line.highlight}
    <div bind:this={focusTarget}>{lineNumber + 1}</div>
    {:else}
    <div>{lineNumber + 1}</div>
    {/if}
  {/each}
  </div>
  <div class="highlighted">
  {#each lines as line}
    <div class="line" class:focused-line={line.highlight}>
    {#each line.tokens as token}
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
    {:else}
      {token[1]}
    {/if}
    {/each}
    </div>
  {/each}
  </div>
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

  .focused-line {
    background-color: var(--line-focus-background-color);
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
