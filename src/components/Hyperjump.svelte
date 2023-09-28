<script>
  import { value } from "@hyperjump/browser";
  import { generateLines } from "./Hyperjump-lib";
  import Fixed from "./Fixed.svelte";


  export let doc;
  export let indent;
  export let theme;

  $: lines = (async function () {
    const d = await doc;
    if (!d) {
      return [];
    }
    const docValue = value(d);
    return generateLines(d.baseUri, docValue);
  }());
</script>

<div class="hyperjump {theme}">
  {#await lines}
    ... Loading ...
  {:then lines}
    {#each lines as line}
      <div class="line">
        {#each line as token}
          {#if token[0] === "GROUPING"}
            <span class="grouping">{token[1]}</span>
          {:else if token[0] === "PROPERTY"}
            &quot;<span class="property"><a href="#{token[2]}">{token[1]}</a></span>&quot;:&nbsp;
          {:else if token[0] === "ARRAY_INDEX"}
            <Fixed><a href="#{token[2]}" class="array-index">{token[1]}</a></Fixed>
          {:else if token[0] === "STRING"}
            &quot;<span class="string">{token[1]}</span>&quot;
          {:else if token[0] === "NUMBER"}
            <span class="number">{token[1]}</span>
          {:else if token[0] === "ATOM"}
            <span class="atom">{token[1]}</span>
          {:else if token[0] === "HREF"}
            <a href="#{token[1]}">...</a>
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
    font-family: monospace;
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

  .grouping {
    color: var(--grouping-color);
  }

  .property {
    color: var(--property-color);
  }

  .string {
    color: var(--string-color);
  }

  .number {
    color: var(--number-color);
  }

  .atom {
    color: var(--boolean-color);
  }
</style>
