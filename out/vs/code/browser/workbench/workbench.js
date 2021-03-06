/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/(function(){var R=["vs/code/browser/workbench/workbench","require","exports","vs/base/browser/browser","vs/base/common/buffer","vs/base/common/cancellation","vs/base/common/event","vs/base/common/lifecycle","vs/base/common/network","vs/base/common/resources","vs/base/common/uri","vs/base/common/uuid","vs/base/parts/request/browser/request","vs/nls!vs/code/browser/workbench/workbench","vs/platform/product/common/product","vs/platform/windows/common/windows","vs/workbench/workbench.web.api"],$=function(w){for(var c=[],d=0,U=w.length;d<U;d++)c[d]=R[w[d]];return c};define(R[0],$([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),function(w,c,d,U,b,v,N,E,T,p,P,A,y,O,s,C){"use strict";Object.defineProperty(c,"__esModule",{value:!0}),c.encodePath=void 0;function g(l,t){let e;if(t){let r=0;t.forEach((o,i)=>{e||(e=""),e+=`${r++==0?"":"&"}${i}=${encodeURIComponent(o)}`})}return p.URI.parse(window.location.href).with({path:l,query:e})}const D=l=>l.split("/").map(t=>encodeURIComponent(t)).join("/");c.encodePath=D;class f{constructor(){let t;const e=document.getElementById("vscode-workbench-auth-session"),r=e?e.getAttribute("data-settings"):void 0;if(r)try{t=JSON.parse(r)}catch(o){}t&&(this.setPassword(`${O.default.urlProtocol}.login`,"account",JSON.stringify(t)),this.authService=`${O.default.urlProtocol}-${t.providerId}.login`,this.setPassword(this.authService,"account",JSON.stringify(t.scopes.map(o=>({id:t.id,scopes:o,accessToken:t.accessToken})))))}get credentials(){if(!this._credentials){try{const t=window.localStorage.getItem(f.CREDENTIALS_OPENED_KEY);t&&(this._credentials=JSON.parse(t))}catch(t){}Array.isArray(this._credentials)||(this._credentials=[])}return this._credentials}save(){window.localStorage.setItem(f.CREDENTIALS_OPENED_KEY,JSON.stringify(this.credentials))}async getPassword(t,e){return this.doGetPassword(t,e)}async doGetPassword(t,e){for(const r of this.credentials)if(r.service===t&&(typeof e!="string"||e===r.account))return r.password;return null}async setPassword(t,e,r){this.doDeletePassword(t,e),this.credentials.push({service:t,account:e,password:r}),this.save();try{if(r&&t===this.authService){const o=JSON.parse(r);Array.isArray(o)&&o.length===0&&await this.logout(t)}}catch(o){console.log(o)}}async deletePassword(t,e){const r=await this.doDeletePassword(t,e);if(r&&t===this.authService)try{await this.logout(t)}catch(o){console.log(o)}return r}async doDeletePassword(t,e){let r=!1;return this._credentials=this.credentials.filter(o=>o.service===t&&o.account===e?(r=!0,!1):!0),r&&this.save(),r}async findPassword(t){return this.doGetPassword(t)}async findCredentials(t){return this.credentials.filter(e=>e.service===t).map(({account:e,password:r})=>({account:e,password:r}))}async logout(t){const e=new Map;e.set("logout",String(!0)),e.set("service",t),await(0,A.request)({url:g("/auth/logout",e).toString(!0)},b.CancellationToken.None)}}f.CREDENTIALS_OPENED_KEY="credentials.provider";class n extends N.Disposable{constructor(){super(...arguments);this._onCallback=this._register(new v.Emitter),this.onCallback=this._onCallback.event}create(t){const e=new Map,r=(0,P.generateUuid)();e.set(n.QUERY_KEYS.REQUEST_ID,r);const{scheme:o,authority:i,path:u,query:h,fragment:m}=t||{scheme:void 0,authority:void 0,path:void 0,query:void 0,fragment:void 0};return o&&e.set(n.QUERY_KEYS.SCHEME,o),i&&e.set(n.QUERY_KEYS.AUTHORITY,i),u&&e.set(n.QUERY_KEYS.PATH,u),h&&e.set(n.QUERY_KEYS.QUERY,h),m&&e.set(n.QUERY_KEYS.FRAGMENT,m),this.periodicFetchCallback(r,Date.now()),g("/callback",e)}async periodicFetchCallback(t,e){const r=new Map;r.set(n.QUERY_KEYS.REQUEST_ID,t);const o=await(0,A.request)({url:g("/fetch-callback",r).toString(!0)},b.CancellationToken.None),i=await(0,U.streamToBuffer)(o.stream);if(i.byteLength>0){try{this._onCallback.fire(p.URI.revive(JSON.parse(i.toString())))}catch(u){console.error(u)}return}Date.now()-e<n.FETCH_TIMEOUT&&setTimeout(()=>this.periodicFetchCallback(t,e),n.FETCH_INTERVAL)}}n.FETCH_INTERVAL=500,n.FETCH_TIMEOUT=5*60*1e3,n.QUERY_KEYS={REQUEST_ID:"vscode-requestId",SCHEME:"vscode-scheme",AUTHORITY:"vscode-authority",PATH:"vscode-path",QUERY:"vscode-query",FRAGMENT:"vscode-fragment"};class a{constructor(t,e){this.workspace=t,this.payload=e,this.trusted=!0}async open(t,e){if(e?.reuse&&!e.payload&&this.isSame(this.workspace,t))return!0;const r=this.createTargetUrl(t,e);if(r){if(e?.reuse)return window.location.href=r,!0;{let o;return d.isStandalone?o=window.open(r,"_blank","toolbar=no"):o=window.open(r),!!o}}return!1}createTargetUrl(t,e){let r;if(!t)r=`${document.location.origin}${document.location.pathname}?${a.QUERY_PARAM_EMPTY_WINDOW}=true`;else if((0,s.isFolderToOpen)(t)){const o=t.folderUri.scheme===E.Schemas.vscodeRemote?(0,c.encodePath)(t.folderUri.path):encodeURIComponent(t.folderUri.toString());r=`${document.location.origin}${document.location.pathname}?${a.QUERY_PARAM_FOLDER}=${o}`}else if((0,s.isWorkspaceToOpen)(t)){const o=t.workspaceUri.scheme===E.Schemas.vscodeRemote?(0,c.encodePath)(t.workspaceUri.path):encodeURIComponent(t.workspaceUri.toString());r=`${document.location.origin}${document.location.pathname}?${a.QUERY_PARAM_WORKSPACE}=${o}`}return e?.payload&&(r+=`&${a.QUERY_PARAM_PAYLOAD}=${encodeURIComponent(JSON.stringify(e.payload))}`),r}isSame(t,e){return!t||!e?t===e:(0,s.isFolderToOpen)(t)&&(0,s.isFolderToOpen)(e)?(0,T.isEqual)(t.folderUri,e.folderUri):(0,s.isWorkspaceToOpen)(t)&&(0,s.isWorkspaceToOpen)(e)?(0,T.isEqual)(t.workspaceUri,e.workspaceUri):!1}hasRemote(){if(this.workspace){if((0,s.isFolderToOpen)(this.workspace))return this.workspace.folderUri.scheme===E.Schemas.vscodeRemote;if((0,s.isWorkspaceToOpen)(this.workspace))return this.workspace.workspaceUri.scheme===E.Schemas.vscodeRemote}return!0}}a.QUERY_PARAM_EMPTY_WINDOW="ew",a.QUERY_PARAM_FOLDER="folder",a.QUERY_PARAM_WORKSPACE="workspace",a.QUERY_PARAM_PAYLOAD="payload";class M{constructor(t){this.onDidChange=v.Event.None;let e,r;if(t){let o;(0,s.isFolderToOpen)(t)?o=t.folderUri:(0,s.isWorkspaceToOpen)(t)&&(o=t.workspaceUri),(o?.scheme==="github"||o?.scheme==="codespace")&&([e,r]=o.authority.split("+"))}r&&e?(this.label=(0,y.localize)(0,null,e,r),this.tooltip=(0,y.localize)(1,null,e,r)):(this.label=(0,y.localize)(2,null),this.tooltip=(0,y.localize)(3,null))}}(function(){const l=document.getElementById("vscode-workbench-web-configuration"),t=l?l.getAttribute("data-settings"):void 0;if(!l||!t)throw new Error("Missing web configuration element");const e={webviewEndpoint:`${window.location.origin}${window.location.pathname.replace(/\/+$/,"")}/webview`,...JSON.parse(t)},r=S=>S.replace(/^https?:\/\//,"");e.remoteAuthority&&(e.remoteAuthority=r(e.remoteAuthority)),e.workspaceUri&&e.workspaceUri.authority&&(e.workspaceUri.authority=r(e.workspaceUri.authority)),e.folderUri&&e.folderUri.authority&&(e.folderUri.authority=r(e.folderUri.authority));let o=!1,i,u=e.workspaceProvider?.payload||Object.create(null);o||(e.folderUri?i={folderUri:p.URI.revive(e.folderUri)}:e.workspaceUri?i={workspaceUri:p.URI.revive(e.workspaceUri)}:i=void 0);const h=new a(i,u);let m;h.hasRemote()||(m=new M(i));const Q=S=>{let Y=`quality=${S}`;new URL(document.location.href).searchParams.forEach((_,I)=>{I!=="quality"&&(Y+=`&${I}=${_}`)}),window.location.href=`${window.location.origin}?${Y}`},q=e.settingsSyncOptions?{enabled:e.settingsSyncOptions.enabled}:void 0;(0,C.create)(document.body,{...e,settingsSyncOptions:q,windowIndicator:m,productQualityChangeHandler:Q,workspaceProvider:h,urlCallbackProvider:new n,credentialsProvider:new f})})()})}).call(this);

//# sourceMappingURL=workbench.js.map
