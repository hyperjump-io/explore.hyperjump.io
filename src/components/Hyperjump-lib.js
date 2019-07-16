import JsonPointer from "@hyperjump/json-pointer";
import resolveUrl from "url-resolve-browser";


const jsonTypeOf = (value) => {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }

  const type = typeof value;
  return type === "object" && "$href" in value ? "href" : type;
};

const uriFragment = (url) => url.split("#", 2)[1] || "";
const pointer = (url) => decodeURIComponent(uriFragment(url));
const stepUrl = (propertyName, url) => {
  const ptr = JsonPointer.append(propertyName, pointer(url));
  const fragment = "#" + encodeURI(ptr).replace(/#/g, "%23");
  return resolveUrl(url, fragment);
};

const newLine = (lines) => lines.push([]);

const pushToken = (lines, ...tokens) => {
  lines[lines.length - 1].push(...tokens);
};

const times = (n, subject) => {
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push(subject);
  }

  return items;
};

export const generateLines = (url, json, lines = [[]], depth = 0) => {
  const jsonType = jsonTypeOf(json);

  if (jsonType === "object") {
    pushToken(lines, ["GROUPING", "{"]);
    newLine(lines);
    const entries = Object.entries(json);
    for (let ndx = 0; ndx < entries.length; ndx++) {
      const [propertyName, propertyValue] = entries[ndx];

      const propertyUrl = stepUrl(propertyName, url);
      pushToken(lines, ...times(depth + 1, ["INDENT"]), ["PROPERTY", propertyName, propertyUrl]);
      generateLines(propertyUrl, propertyValue, lines, depth + 1);
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
      generateLines(propertyUrl, json[ndx], lines, depth + 1);
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
    pushToken(lines, ["HREF", resolveUrl(url, json["$href"])]);
  }

  return lines;
};
