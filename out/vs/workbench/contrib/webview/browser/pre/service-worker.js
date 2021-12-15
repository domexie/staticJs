const sw=self,VERSION=2,resourceCacheName=`vscode-resource-cache-${VERSION}`,rootPath=sw.location.pathname.replace(/\/service-worker.js$/,""),searchParams=new URL(location.toString()).searchParams,resourceBaseAuthority=searchParams.get("vscode-resource-base-authority"),resolveTimeout=3e4;class RequestStore{constructor(){this.map=new Map,this.requestPool=0}get(e){const o=this.map.get(e);return o&&o.promise}create(){const e=++this.requestPool;let o;const s=new Promise(a=>o=a),r={resolve:o,promise:s};this.map.set(e,r);const i=setTimeout(()=>{if(clearTimeout(i),this.map.get(e)===r)return this.map.delete(e)},resolveTimeout);return{requestId:e,promise:s}}resolve(e,o){const s=this.map.get(e);return s?(s.resolve(o),this.map.delete(e),!0):!1}}const resourceRequestStore=new RequestStore,localhostRequestStore=new RequestStore,notFound=()=>new Response("Not Found",{status:404}),methodNotAllowed=()=>new Response("Method Not Allowed",{status:405});sw.addEventListener("message",async t=>{switch(t.data.channel){case"version":{const e=t.source;sw.clients.get(e.id).then(o=>{o&&o.postMessage({channel:"version",version:VERSION})});return}case"did-load-resource":{let e;const o=t.data.data;switch(o.status){case 200:{e={type:"response",body:o.data,mime:o.mime,etag:o.etag,mtime:o.mtime};break}case 304:{e={type:"not-modified",mime:o.mime,mtime:o.mtime};break}}resourceRequestStore.resolve(o.id,e)||console.log("Could not resolve unknown resource",o.path);return}case"did-load-localhost":{const e=t.data.data;localhostRequestStore.resolve(e.id,e.location)||console.log("Could not resolve unknown localhost",e.origin);return}}console.log("Unknown message")}),sw.addEventListener("fetch",t=>{const e=new URL(t.request.url);if(e.protocol==="https:"&&e.hostname.endsWith("."+resourceBaseAuthority))switch(t.request.method){case"GET":case"HEAD":return t.respondWith(processResourceRequest(t,e));default:return t.respondWith(methodNotAllowed())}if(e.origin!==sw.origin&&e.host.match(/^(localhost|127.0.0.1|0.0.0.0):(\d+)$/))return t.respondWith(processLocalhostRequest(t,e))}),sw.addEventListener("install",t=>{t.waitUntil(sw.skipWaiting())}),sw.addEventListener("activate",t=>{t.waitUntil(sw.clients.claim())});async function processResourceRequest(t,e){const o=await sw.clients.get(t.clientId);if(!o)return console.error("Could not find inner client for request"),notFound();const s=getWebviewIdForClient(o);if(!s)return console.error("Could not resolve webview id"),notFound();const r=t.request.method==="GET";async function l(n,p){if(!n)return notFound();if(n.type==="not-modified"){if(p)return p.clone();throw new Error("No cache found")}const d={"Content-Type":n.mime,"Content-Length":n.body.byteLength.toString(),"Access-Control-Allow-Origin":"*"};n.etag&&(d.ETag=n.etag,d["Cache-Control"]="no-cache"),n.mtime&&(d["Last-Modified"]=new Date(n.mtime).toUTCString());const g=new Response(n.body,{status:200,headers:d});return r&&n.etag&&caches.open(resourceCacheName).then(w=>w.put(t.request,g)),g.clone()}const i=await getOuterIframeClient(s);if(!i.length)return console.log("Could not find parent client for request"),notFound();let a;r&&(a=await(await caches.open(resourceCacheName)).match(t.request));const{requestId:h,promise:c}=resourceRequestStore.create(),u=e.hostname.slice(0,e.hostname.length-(resourceBaseAuthority.length+1)),m=u.split("+",1)[0],f=u.slice(m.length+1);for(const n of i)n.postMessage({channel:"load-resource",id:h,path:e.pathname,scheme:m,authority:f,query:e.search.replace(/^\?/,""),ifNoneMatch:a?.headers.get("ETag")});return c.then(n=>l(n,a))}async function processLocalhostRequest(t,e){const o=await sw.clients.get(t.clientId);if(!o)return fetch(t.request);const s=getWebviewIdForClient(o);if(!s)return console.error("Could not resolve webview id"),fetch(t.request);const r=e.origin,l=async c=>{if(!c)return fetch(t.request);const u=t.request.url.replace(new RegExp(`^${e.origin}(/|$)`),`${c}$1`);return new Response(null,{status:302,headers:{Location:u}})},i=await getOuterIframeClient(s);if(!i.length)return console.log("Could not find parent client for request"),notFound();const{requestId:a,promise:h}=localhostRequestStore.create();for(const c of i)c.postMessage({channel:"load-localhost",origin:r,id:a});return h.then(l)}function getWebviewIdForClient(t){return new URL(t.url).searchParams.get("id")}async function getOuterIframeClient(t){return(await sw.clients.matchAll({includeUncontrolled:!0})).filter(o=>{const s=new URL(o.url);return(s.pathname===`${rootPath}/`||s.pathname===`${rootPath}/index.html`)&&s.searchParams.get("id")===t})}

//# sourceMappingURL=service-worker.js.map
