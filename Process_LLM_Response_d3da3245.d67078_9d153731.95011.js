// Older Node-RED compatible parser for model output -> JSON analysis.
// - No optional chaining, no arrow funcs, no let/const, no lookbehind.
// - Tries strict JSON, then extracts first {...} with quote-aware scan.
// - Normalizes fields and accumulates results like your original.
node.warn(msg);
function strictParseJSON(text) {
  try {
    var t = String(text == null ? "" : text).trim();
    if (!t) return null;
    return JSON.parse(t);
  } catch (e) {
    return null;
  }
}

function extractFirstJSONObject(text) {
  if (!text) return null;
  var s = String(text);

  // Try fenced code blocks first
  var fenceRe = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  var m;
  while ((m = fenceRe.exec(s)) !== null) {
    var cand = (m[1] || "").trim();
    var obj = strictParseJSON(cand);
    if (obj && typeof obj === "object") return obj;
  }

  // Quote-aware brace scan
  var depth = 0;
  var inStr = false;
  var esc = false;
  var start = -1;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);

    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === "\\") {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }

    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      if (depth > 0) depth--;
      if (depth === 0 && start !== -1) {
        var cand2 = s.slice(start, i + 1);
        try {
          return JSON.parse(cand2);
        } catch (e2) {
          start = -1; // keep scanning
        }
      }
    }
  }

  return null;
}

function stripUnpairedSurrogates(s) {
  // Keep valid surrogate pairs; drop isolated halves
  var out = "";
  for (var i = 0; i < s.length; i++) {
    var code = s.charCodeAt(i);
    if (code >= 0xD800 && code <= 0xDBFF) {
      // high surrogate
      if (i + 1 < s.length) {
        var next = s.charCodeAt(i + 1);
        if (next >= 0xDC00 && next <= 0xDFFF) {
          out += s.charAt(i) + s.charAt(i + 1);
          i++; // consumed pair
          continue;
        } else {
          // drop lone high
          continue;
        }
      } else {
        // trailing lone high
        continue;
      }
    } else if (code >= 0xDC00 && code <= 0xDFFF) {
      // lone low surrogate, drop
      continue;
    } else {
      out += s.charAt(i);
    }
  }
  return out;
}

function normalizeUnicode(s) {
  s = String(s == null ? "" : s);
  s = s.replace(/\r\n?/g, "\n"); // CRLF -> LF
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " "); // control chars
  s = s.replace(/[\u2028\u2029]/g, " "); // JS line/para sep
  s = s.replace(/[\u201C\u201D]/g, '"'); // curly double
  s = s.replace(/[\u2018\u2019]/g, "'"); // curly single
  s = stripUnpairedSurrogates(s);
  return s;
}

function coerceAnalysis(obj, msg) {
  var fb = "";
  if (msg.currentConv && msg.currentConv.feedback) {
    fb = String(msg.currentConv.feedback).toLowerCase();
  }
  var fallbackScore = fb === "positive" ? 0.6 : (fb === "negative" ? -0.6 : 0);

  var out = {
    reason: "",
    priority: "medium",
    recommendations: [],
    sentiment_score: fallbackScore,
    category: "general"
  };

  if (obj && typeof obj === "object") {
    if (typeof obj.reason === "string") out.reason = obj.reason;
    if (typeof obj.priority === "string") out.priority = obj.priority;
    if (typeof obj.category === "string") out.category = obj.category;

    if (typeof obj.sentiment_score === "number" && isFinite(obj.sentiment_score)) {
      if (obj.sentiment_score > 1) obj.sentiment_score = 1;
      if (obj.sentiment_score < -1) obj.sentiment_score = -1;
      out.sentiment_score = obj.sentiment_score;
    }

    if (Object.prototype.toString.call(obj.recommendations) === "[object Array]") {
      var arr = [];
      for (var i = 0; i < obj.recommendations.length && arr.length < 8; i++) {
        var v = obj.recommendations[i];
        if (v != null) {
          var str = String(v).trim();
          if (str) arr.push(str);
        }
      }
      out.recommendations = arr;
    } else if (typeof obj.recommendations === "string") {
      var parts = obj.recommendations.split(/[;\n]+/);
      var arr2 = [];
      for (var j = 0; j < parts.length && arr2.length < 8; j++) {
        var p = String(parts[j]).trim();
        if (p) arr2.push(p);
      }
      out.recommendations = arr2;
    }
  }

  out.reason = String(out.reason || "").slice(0, 500);
  out.priority = String(out.priority || "medium");
  out.category = String(out.category || "general");
  return out;
}

var analysis = {
  reason: "Unable to parse JSON from model output",
  priority: "low",
  recommendations: [],
  sentiment_score: 0,
  category: "unknown"
};

try {
  if (msg.payload && msg.payload.choices && msg.payload.choices[0]) {
    var choice0 = msg.payload.choices[0];
    var raw = "";
    if (choice0.message && typeof choice0.message.content === "string") {
      raw = choice0.message.content;
    } else if (typeof choice0.text === "string") {
      raw = choice0.text;
    }

    var cleaned = normalizeUnicode(raw);

    // 1) strict parse
    var obj = strictParseJSON(cleaned);

    // 2) fallback extraction
    if (!obj) obj = extractFirstJSONObject(cleaned);

    if (obj && typeof obj === "object") {
      analysis = coerceAnalysis(obj, msg);
    } else {
      if (msg.payload && msg.payload.error) {
        var e = msg.payload.error.message || JSON.stringify(msg.payload.error);
        node.warn("LLM error: " + e);
      } else {
        node.warn("LLM parse warning: could not extract JSON from model output.");
      }
      analysis = coerceAnalysis(null, msg);
    }
  } else if (msg.payload && msg.payload.error) {
    var ee = msg.payload.error.message || JSON.stringify(msg.payload.error);
    node.warn("LLM error: " + ee);
    analysis = coerceAnalysis(null, msg);
  } else {
    node.warn("LLM response missing choices array");
    analysis = coerceAnalysis(null, msg);
  }
} catch (e) {
  node.warn("Failed to parse LLM response: " + e.message);
  analysis = coerceAnalysis(null, msg);
}

// Accumulate results
if (!Array.isArray(msg.analysisResults)) msg.analysisResults = [];
msg.analysisResults.push({
  id: msg.currentConv ? msg.currentConv.id : undefined,
  date: msg.currentConv ? msg.currentConv.date : undefined,
  feedback: msg.currentConv ? msg.currentConv.feedback : undefined,
  used_skus: (msg.currentConv && msg.currentConv.used_skus) ? msg.currentConv.used_skus : [],
  analysis: analysis
});

// Next conversation
msg.currentIndex = (typeof msg.currentIndex === "number" ? msg.currentIndex : 0) + 1;

return msg;
