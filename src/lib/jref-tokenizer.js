import { append } from "@hyperjump/json-pointer";
import { Reference } from "@hyperjump/browser/jref";


const jsonTypeOf = (value) => {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (value instanceof Reference) {
    return "href";
  }

  return typeof value;
};

const stepUrl = (propertyName, url) => {
  const uriFragment = url.split("#", 2)[1] || "";
  const pointer = decodeURIComponent(uriFragment);
  const ptr = append(propertyName, pointer);
  const fragment = "#" + encodeURI(ptr).replace(/#/g, "%23");
  return new URL(fragment, url).toString();
};

const newLine = (lines) => lines.push({ tokens: [], highlight: false });

const pushToken = (lines, ...tokens) => {
  lines[lines.length - 1].tokens.push(...tokens);
};

const highlightLine = (lines) => {
  lines[lines.length - 1].highlight = true;
};

const times = (n, subject) => {
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push(subject);
  }

  return items;
};

export const generateLines = (url, focus, json, lines = [{ tokens: [] }], cursor = "", depth = 0) => {
  if (focus && cursor === focus) {
    highlightLine(lines);
  }

  const jsonType = jsonTypeOf(json);

  if (jsonType === "object") {
    pushToken(lines, ["GROUPING", "{"]);
    newLine(lines);
    const entries = Object.entries(json);
    for (let ndx = 0; ndx < entries.length; ndx++) {
      const [propertyName, propertyValue] = entries[ndx];

      const propertyUrl = stepUrl(propertyName, url);
      pushToken(lines, ...times(depth + 1, ["INDENT"]), ["PROPERTY", propertyName, propertyUrl]);
      generateLines(propertyUrl, focus, propertyValue, lines, append(propertyName, cursor), depth + 1);
      ndx < entries.length - 1 && pushToken(lines, ["COMMA"]);
      newLine(lines);
    }
    pushToken(lines, ...times(depth, ["INDENT"]), ["GROUPING", "}"]);
  } else if (jsonType === "array") {
    pushToken(lines, ["GROUPING", "["]);
    newLine(lines);
    for (let ndx = 0; ndx < json.length; ndx++) {
      const propertyUrl = stepUrl(ndx, url);
      pushToken(lines, ...times(depth + 1, ["INDENT"]), ["ARRAY_INDEX", ndx, propertyUrl]);
      generateLines(propertyUrl, focus, json[ndx], lines, append(`${ndx}`, cursor), depth + 1);
      ndx < json.length - 1 && pushToken(lines, ["COMMA"]);
      newLine(lines);
    }
    pushToken(lines, ...times(depth, ["INDENT"]), ["GROUPING", "]"]);
  } else if (jsonType === "string") {
    pushToken(lines, ["STRING", json]);
  } else if (jsonType === "number") {
    pushToken(lines, ["NUMBER", json]);
  } else if (jsonType === "boolean") {
    pushToken(lines, ["ATOM", json ? "true": "false"]);
  } else if (jsonType === "null") {
    pushToken(lines, ["ATOM", "null"]);
  } else if (jsonType === "href") {
    pushToken(lines, ["HREF", json, new URL(json.href, url).toString()]);
  }

  return lines;
};
