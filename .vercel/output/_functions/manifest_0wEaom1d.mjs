import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_CI4GZn7w.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CldW2M_B.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/","cacheDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/node_modules/.astro/","outDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/dist/","srcDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/src/","publicDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/public/","buildClientDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/dist/client/","buildServerDir":"file:///Users/shainwaiyan/Vs%20code/Dr%20Nathan%20Website/dr-nathan%20website/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.RXmPHvt5.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_0wEaom1d.mjs","/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_RgMcuXX8.mjs","@components/home/FAQ":"_astro/FAQ.B9zfmYSz.js","@components/common/Navbar":"_astro/Navbar.DYfYGmH7.js","@astrojs/react/client.js":"_astro/client.nc8uITnr.js","/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.BTVwOcQ5.js","/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/AboutUs.astro?astro&type=script&index=0&lang.ts":"_astro/AboutUs.astro_astro_type_script_index_0_lang.CIyL_g7Q.js","/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/WhyUs.astro?astro&type=script&index=0&lang.ts":"_astro/WhyUs.astro_astro_type_script_index_0_lang.Bzjj3evy.js","/Users/shainwaiyan/Vs code/Dr Nathan Website/dr-nathan website/src/components/home/Service.astro?astro&type=script&index=0&lang.ts":"_astro/Service.astro_astro_type_script_index_0_lang.DwroltPi.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/1.aCn6NNc9.png","/_astro/3.C_sLqTxO.png","/_astro/2.BQtf8w9X.png","/_astro/7.TcHXbAcS.png","/_astro/5.DvoURZ6a.png","/_astro/4.UiCRuHX9.png","/_astro/8.8WCW8X2v.png","/_astro/9.ZtWVi5s-.png","/_astro/10.DG8sABXg.png","/_astro/6.DS6ivfaS.png","/_astro/12.CWsylbyi.png","/_astro/11.jRugKNU3.png","/_astro/index.RXmPHvt5.css","/_astro/AboutUs.astro_astro_type_script_index_0_lang.CIyL_g7Q.js","/_astro/FAQ.B9zfmYSz.js","/_astro/Hero.astro_astro_type_script_index_0_lang.BTVwOcQ5.js","/_astro/Navbar.DYfYGmH7.js","/_astro/Service.astro_astro_type_script_index_0_lang.DwroltPi.js","/_astro/WhyUs.astro_astro_type_script_index_0_lang.Bzjj3evy.js","/_astro/client.nc8uITnr.js","/_astro/index.CB87Sc6I.js","/_astro/index.DK-fsZOb.js","/_astro/jsx-runtime.ClP7wGfN.js","/_astro/scrollToElement.DnMLb56B.js","/assets/logo/logo.png","/assets/services/cm1.jpg","/assets/services/cm2.jpg","/assets/services/cm3.jpg","/assets/services/cm4.jpg","/assets/services/cm5.jpg","/assets/services/cm6.jpg","/assets/services/com1.jpg","/assets/services/ep1.jpg","/assets/services/ep2.jpg","/assets/services/ep3.jpg","/assets/services/ep4.jpg","/assets/services/mb1.png","/assets/services/sm1.jpg","/assets/services/tm1.jpg","/assets/services/tm2.jpg","/assets/services/tm3.jpg","/assets/services/tm4.jpg","/assets/services/vppp1.jpg","/assets/services/vppp2.jpg","/assets/services/vppp3.jpg","/assets/services/vppp4.jpg","/assets/services/wd1.jpg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"gFj7x+ol293rVcYOW3Gb2jSqZ+akDCy6hf7Y1K6CqIc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
