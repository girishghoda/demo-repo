// Switch or get environment; no optional chaining.
const q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
const env = q.env;

const envs = {
  qa:    { name: "QA",           apiUrl: "https://ccpservices-qa.ulta.lcl",    dbPath: "/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite", catalogPath: "/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv" },
  prod:  { name: "Production",   apiUrl: "https://ccpservices.ulta.lcl",       dbPath: "/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_prod.sqlite", catalogPath: "/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv" },
  dev:   { name: "Development",  apiUrl: "https://ccpservices-dev.ulta.lcl",   dbPath: "/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_dev.sqlite", catalogPath: "/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv" },
  stress:{ name: "Stress Test",  apiUrl: "https://ccpservices-stress.ulta.lcl",dbPath: "/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_stress.sqlite", catalogPath: "/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv" },
  proxy: { name: "Local Proxy",  apiUrl: "http://127.0.0.1:1880",              dbPath: "/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_proxy.sqlite", catalogPath: "/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv" }
};

if (env && envs[env]) {
  global.set("currentEnvironment", env);
  global.set("environmentConfig", envs[env]);
  msg.payload = { success: true, environment: env, config: envs[env], message: "Environment switched to " + envs[env].name };
} else {
  const curr = global.get("currentEnvironment") || "qa";
  msg.payload = { success: true, currentEnvironment: curr, config: envs[curr], availableEnvironments: envs };
}
node.warn(msg);
return msg;