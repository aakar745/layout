const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Profile-BEo3OeuS.js","assets/vendor-pdf-Cn0rG44s.js","assets/vendor-antd-B8jUXf3i.js","assets/vendor-redux-rS0pI56E.js","assets/vendor-antd-icons-BoTJB7uA.js","assets/vendor-react-DW9h-haf.js","assets/vendor-http-t--hEgTQ.js","assets/vendor-ui-BmMA_ojr.js","assets/vendor-canvas-DrFPvyt4.js","assets/Settings-BAzlOeee.js","assets/index-bX3gGnZ8.js","assets/reduxHooks-BvSvK4-5.js","assets/index-9hUyCWoI.js","assets/index-DTewkI6S.js","assets/index-D8wA3CMj.js","assets/index-CxAs-dm8.js","assets/ExhibitionForm-BevSuYHi.js","assets/vendor-editor-CDayDKFN.js","assets/index-CWz5JEEp.js","assets/edit-D4Il21Q1.js","assets/index-BuK1-zHv.js","assets/index-DZZVylEq.js","assets/index-D5w1i-3l.js","assets/index-wAFSmpZO.js","assets/index-DbI_wMfq.js","assets/index-CGU2E7cZ.js","assets/index-C3sk--vM.js","assets/index-D99TAtqO.js","assets/FileSaver.min-D2Up8sHb.js","assets/index-83dVlJAR.js","assets/index-DvGp6Qnr.js","assets/index-f_XpeFrr.css","assets/index-IqWDsv8O.js","assets/index-Hi2As_aE.js","assets/index-BehD1d6K.js","assets/index-XVcQs4cz.css"])))=>i.map(i=>d[i]);
var fa=Object.defineProperty;var ma=(s,t,n)=>t in s?fa(s,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[t]=n;var ni=(s,t,n)=>ma(s,typeof t!="symbol"?t+"":t,n);import{j as e,_ as Se}from"./vendor-pdf-Cn0rG44s.js";import{b as ga,c as xa,g as ya,d as $e,T as ke,L as vt,e as St,S as ae,f as ne,B as kt,A as Bt,h as H,i as Zt,j as ba,k as mt,r as g,l as to,m as zt,n as et,E as Ce,D as Be,o as ln,p as ve,M as ks,q as xs,s as ja,t as se,F as Q,C as va,u as wa,v as qe,P as so,w as te,x as Sa,y as ge,z as G,G as ie,a as Ae,H as Nt,J as wt,K as tt,N as Es,O as ka,Q as ft,U as Ea,V as ys,W as ot,X as Ia,Y as Ca,Z as it,$ as Na,a0 as Aa,a1 as Ra,a2 as ri,a3 as Ta,a4 as Dr,a5 as _a,a6 as ye,a7 as He,a8 as Pa,a9 as no,aa as Da,ab as $a,ac as La,ad as Ba,ae as Ma}from"./vendor-antd-B8jUXf3i.js";import{c as de,a as Ve,u as Me,b as xt,w as ii,n as ro,f as io,i as bs,e as Fa,d as ns,g as oo,p as $r,h as as,j as Zs,k as Lr,l as Mt,m as oi,o as za,S as ao,q as gn,r as Br,s as lo,t as Oa,v as co,x as qa,y as ai,z as Ua,A as Va,B as Qa,C as Wa,D as ms,E as Ha,P as Ya}from"./vendor-redux-rS0pI56E.js";import{u as st,a as Mr,L as Ge,b as cn,B as Ga,R as Ka,c as le,N as Fr}from"./vendor-react-DW9h-haf.js";import{a as Ye}from"./vendor-http-t--hEgTQ.js";import{R as uo,a as Ne,b as xr,c as ho,d as yr,e as js,f as po,g as fo,h as en,i as tn,j as mo,k as Ze,l as Qe,m as Xa,n as zr,o as Ja,p as Kt,q as Ot,r as br,s as sn,t as go,u as es,v as Or,w as qr,x as Za,y as li,z as el,A as tl,B as sl,C as nl,D as ts,E as rl,F as jr,G as il,H as ci,I as Ur,J as Vr,K as ol,L as al,M as ll,N as xo,O as di,P as cl,Q as yo,S as dl,T as ul}from"./vendor-antd-icons-BoTJB7uA.js";import{n as W,k as Tt}from"./vendor-ui-BmMA_ojr.js";import{L as nn,G as ss,R as dn,T as vs,u as hl,a as pl,I as fl,C as ml,b as gl,c as xl,K as xn,S as yl,F as bl,d as jl}from"./vendor-canvas-DrFPvyt4.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();var vr={},ui=ga;vr.createRoot=ui.createRoot,vr.hydrateRoot=ui.hydrateRoot;const un="/api",K=Ye.create({baseURL:un,headers:{"Content-Type":"application/json",Accept:"application/json"}}),ut=Ye.create({baseURL:un,headers:{"Content-Type":"application/json",Accept:"application/json"}}),Lt=Ye.create({baseURL:un,headers:{"Content-Type":"application/json",Accept:"application/json"}});K.interceptors.request.use(s=>{var o,l,x,v,p,I,j,f,w;const t=localStorage.getItem("token"),n=localStorage.getItem("exhibitor_token"),r=((o=s.url)==null?void 0:o.startsWith("/bookings/"))&&s.method==="patch"||((l=s.url)==null?void 0:l.includes("/exhibition/"))||((x=s.url)==null?void 0:x.includes("/stalls/"))||((v=s.url)==null?void 0:v.includes("/halls/"))||((p=s.url)==null?void 0:p.includes("/users/"))||((I=s.url)==null?void 0:I.includes("/roles/")),i=((j=s.url)==null?void 0:j.includes("/test-booking"))||((f=s.url)==null?void 0:f.includes("/exhibitor-bookings"))||((w=s.url)==null?void 0:w.startsWith("/exhibitors/"));return r?t?s.headers.Authorization=`Bearer ${t}`:console.warn("Admin token required but not found for:",s.url):i&&n?s.headers.Authorization=`Bearer ${n}`:t?s.headers.Authorization=`Bearer ${t}`:n&&(s.headers.Authorization=`Bearer ${n}`),s},s=>Promise.reject(s));Lt.interceptors.request.use(s=>{const t=localStorage.getItem("exhibitor_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));K.interceptors.response.use(s=>s,s=>{var n,r,i;((n=s.response)==null?void 0:n.status)===401&&localStorage.removeItem("token");const t=((i=(r=s.response)==null?void 0:r.data)==null?void 0:i.message)||s.message;return Promise.reject(new Error(t))});Lt.interceptors.response.use(s=>s,s=>{var n,r,i;((n=s.response)==null?void 0:n.status)===401&&localStorage.removeItem("exhibitor_token");const t=((i=(r=s.response)==null?void 0:r.data)==null?void 0:i.message)||s.message;return Promise.reject(new Error(t))});const Xp=async(s,t=!1,n)=>{const r=t?localStorage.getItem("exhibitor_token"):localStorage.getItem("token");return Ye.get(`${un}${s}`,{responseType:"blob",headers:{Authorization:`Bearer ${r}`},onDownloadProgress:n})},bo={login:async s=>await K.post("/auth/login",s),getProfile:async()=>await K.get("/auth/me"),changePassword:async s=>await K.post("/auth/change-password",s)},hi=localStorage.getItem("token"),yn=localStorage.getItem("user");let jo=null;try{jo=yn&&yn!=="undefined"?JSON.parse(yn):null}catch(s){console.error("Failed to parse user data from localStorage",s),localStorage.removeItem("user")}const vl={isAuthenticated:!!hi,user:jo,token:hi,loading:!1,error:null},Us=de("auth/refreshUser",async(s,{rejectWithValue:t})=>{var n,r;try{return(await bo.getProfile()).data}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to refresh user data")}}),vo=Ve({name:"auth",initialState:vl,reducers:{setCredentials:(s,t)=>{s.user=t.payload.user,s.token=t.payload.token,s.isAuthenticated=!0,localStorage.setItem("token",t.payload.token),localStorage.setItem("user",JSON.stringify(t.payload.user))},logout:s=>{s.user=null,s.token=null,s.isAuthenticated=!1,localStorage.removeItem("token"),localStorage.removeItem("user")}},extraReducers:s=>{s.addCase(Us.pending,t=>{t.loading=!0,t.error=null}).addCase(Us.fulfilled,(t,n)=>{t.loading=!1,t.user=n.payload,localStorage.setItem("user",JSON.stringify(n.payload))}).addCase(Us.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),{setCredentials:wl,logout:pi}=vo.actions,Sl=vo.reducer,gt=Object.create(null);gt.open="0";gt.close="1";gt.ping="2";gt.pong="3";gt.message="4";gt.upgrade="5";gt.noop="6";const Vs=Object.create(null);Object.keys(gt).forEach(s=>{Vs[gt[s]]=s});const wr={type:"error",data:"parser error"},wo=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",So=typeof ArrayBuffer=="function",ko=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,Qr=({type:s,data:t},n,r)=>wo&&t instanceof Blob?n?r(t):fi(t,r):So&&(t instanceof ArrayBuffer||ko(t))?n?r(t):fi(new Blob([t]),r):r(gt[s]+(t||"")),fi=(s,t)=>{const n=new FileReader;return n.onload=function(){const r=n.result.split(",")[1];t("b"+(r||""))},n.readAsDataURL(s)};function mi(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let bn;function kl(s,t){if(wo&&s.data instanceof Blob)return s.data.arrayBuffer().then(mi).then(t);if(So&&(s.data instanceof ArrayBuffer||ko(s.data)))return t(mi(s.data));Qr(s,!1,n=>{bn||(bn=new TextEncoder),t(bn.encode(n))})}const gi="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fs=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<gi.length;s++)fs[gi.charCodeAt(s)]=s;const El=s=>{let t=s.length*.75,n=s.length,r,i=0,o,l,x,v;s[s.length-1]==="="&&(t--,s[s.length-2]==="="&&t--);const p=new ArrayBuffer(t),I=new Uint8Array(p);for(r=0;r<n;r+=4)o=fs[s.charCodeAt(r)],l=fs[s.charCodeAt(r+1)],x=fs[s.charCodeAt(r+2)],v=fs[s.charCodeAt(r+3)],I[i++]=o<<2|l>>4,I[i++]=(l&15)<<4|x>>2,I[i++]=(x&3)<<6|v&63;return p},Il=typeof ArrayBuffer=="function",Wr=(s,t)=>{if(typeof s!="string")return{type:"message",data:Eo(s,t)};const n=s.charAt(0);return n==="b"?{type:"message",data:Cl(s.substring(1),t)}:Vs[n]?s.length>1?{type:Vs[n],data:s.substring(1)}:{type:Vs[n]}:wr},Cl=(s,t)=>{if(Il){const n=El(s);return Eo(n,t)}else return{base64:!0,data:s}},Eo=(s,t)=>{switch(t){case"blob":return s instanceof Blob?s:new Blob([s]);case"arraybuffer":default:return s instanceof ArrayBuffer?s:s.buffer}},Io="",Nl=(s,t)=>{const n=s.length,r=new Array(n);let i=0;s.forEach((o,l)=>{Qr(o,!1,x=>{r[l]=x,++i===n&&t(r.join(Io))})})},Al=(s,t)=>{const n=s.split(Io),r=[];for(let i=0;i<n.length;i++){const o=Wr(n[i],t);if(r.push(o),o.type==="error")break}return r};function Rl(){return new TransformStream({transform(s,t){kl(s,n=>{const r=n.length;let i;if(r<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,r);else if(r<65536){i=new Uint8Array(3);const o=new DataView(i.buffer);o.setUint8(0,126),o.setUint16(1,r)}else{i=new Uint8Array(9);const o=new DataView(i.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(r))}s.data&&typeof s.data!="string"&&(i[0]|=128),t.enqueue(i),t.enqueue(n)})}})}let jn;function Cs(s){return s.reduce((t,n)=>t+n.length,0)}function Ns(s,t){if(s[0].length===t)return s.shift();const n=new Uint8Array(t);let r=0;for(let i=0;i<t;i++)n[i]=s[0][r++],r===s[0].length&&(s.shift(),r=0);return s.length&&r<s[0].length&&(s[0]=s[0].slice(r)),n}function Tl(s,t){jn||(jn=new TextDecoder);const n=[];let r=0,i=-1,o=!1;return new TransformStream({transform(l,x){for(n.push(l);;){if(r===0){if(Cs(n)<1)break;const v=Ns(n,1);o=(v[0]&128)===128,i=v[0]&127,i<126?r=3:i===126?r=1:r=2}else if(r===1){if(Cs(n)<2)break;const v=Ns(n,2);i=new DataView(v.buffer,v.byteOffset,v.length).getUint16(0),r=3}else if(r===2){if(Cs(n)<8)break;const v=Ns(n,8),p=new DataView(v.buffer,v.byteOffset,v.length),I=p.getUint32(0);if(I>Math.pow(2,21)-1){x.enqueue(wr);break}i=I*Math.pow(2,32)+p.getUint32(4),r=3}else{if(Cs(n)<i)break;const v=Ns(n,i);x.enqueue(Wr(o?v:jn.decode(v),t)),r=0}if(i===0||i>s){x.enqueue(wr);break}}}})}const Co=4;function Re(s){if(s)return _l(s)}function _l(s){for(var t in Re.prototype)s[t]=Re.prototype[t];return s}Re.prototype.on=Re.prototype.addEventListener=function(s,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(t),this};Re.prototype.once=function(s,t){function n(){this.off(s,n),t.apply(this,arguments)}return n.fn=t,this.on(s,n),this};Re.prototype.off=Re.prototype.removeListener=Re.prototype.removeAllListeners=Re.prototype.removeEventListener=function(s,t){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+s];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var r,i=0;i<n.length;i++)if(r=n[i],r===t||r.fn===t){n.splice(i,1);break}return n.length===0&&delete this._callbacks["$"+s],this};Re.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),n=this._callbacks["$"+s],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(n){n=n.slice(0);for(var r=0,i=n.length;r<i;++r)n[r].apply(this,t)}return this};Re.prototype.emitReserved=Re.prototype.emit;Re.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};Re.prototype.hasListeners=function(s){return!!this.listeners(s).length};const hn=typeof Promise=="function"&&typeof Promise.resolve=="function"?t=>Promise.resolve().then(t):(t,n)=>n(t,0),Je=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Pl="arraybuffer";function No(s,...t){return t.reduce((n,r)=>(s.hasOwnProperty(r)&&(n[r]=s[r]),n),{})}const Dl=Je.setTimeout,$l=Je.clearTimeout;function pn(s,t){t.useNativeTimers?(s.setTimeoutFn=Dl.bind(Je),s.clearTimeoutFn=$l.bind(Je)):(s.setTimeoutFn=Je.setTimeout.bind(Je),s.clearTimeoutFn=Je.clearTimeout.bind(Je))}const Ll=1.33;function Bl(s){return typeof s=="string"?Ml(s):Math.ceil((s.byteLength||s.size)*Ll)}function Ml(s){let t=0,n=0;for(let r=0,i=s.length;r<i;r++)t=s.charCodeAt(r),t<128?n+=1:t<2048?n+=2:t<55296||t>=57344?n+=3:(r++,n+=4);return n}function Ao(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Fl(s){let t="";for(let n in s)s.hasOwnProperty(n)&&(t.length&&(t+="&"),t+=encodeURIComponent(n)+"="+encodeURIComponent(s[n]));return t}function zl(s){let t={},n=s.split("&");for(let r=0,i=n.length;r<i;r++){let o=n[r].split("=");t[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return t}class Ol extends Error{constructor(t,n,r){super(t),this.description=n,this.context=r,this.type="TransportError"}}class Hr extends Re{constructor(t){super(),this.writable=!1,pn(this,t),this.opts=t,this.query=t.query,this.socket=t.socket,this.supportsBinary=!t.forceBase64}onError(t,n,r){return super.emitReserved("error",new Ol(t,n,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(t){this.readyState==="open"&&this.write(t)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(t){const n=Wr(t,this.socket.binaryType);this.onPacket(n)}onPacket(t){super.emitReserved("packet",t)}onClose(t){this.readyState="closed",super.emitReserved("close",t)}pause(t){}createUri(t,n={}){return t+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const t=this.opts.hostname;return t.indexOf(":")===-1?t:"["+t+"]"}_port(){return this.opts.port&&(this.opts.secure&&+(this.opts.port!==443)||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(t){const n=Fl(t);return n.length?"?"+n:""}}class ql extends Hr{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(t){this.readyState="pausing";const n=()=>{this.readyState="paused",t()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||n()})),this.writable||(r++,this.once("drain",function(){--r||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(t){const n=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Al(t,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const t=()=>{this.write([{type:"close"}])};this.readyState==="open"?t():this.once("open",t)}write(t){this.writable=!1,Nl(t,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const t=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=Ao()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(t,n)}}let Ro=!1;try{Ro=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Ul=Ro;function Vl(){}class Ql extends ql{constructor(t){if(super(t),typeof location<"u"){const n=location.protocol==="https:";let r=location.port;r||(r=n?"443":"80"),this.xd=typeof location<"u"&&t.hostname!==location.hostname||r!==t.port}}doWrite(t,n){const r=this.request({method:"POST",data:t});r.on("success",n),r.on("error",(i,o)=>{this.onError("xhr post error",i,o)})}doPoll(){const t=this.request();t.on("data",this.onData.bind(this)),t.on("error",(n,r)=>{this.onError("xhr poll error",n,r)}),this.pollXhr=t}}let Xt=class Qs extends Re{constructor(t,n,r){super(),this.createRequest=t,pn(this,r),this._opts=r,this._method=r.method||"GET",this._uri=n,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var t;const n=No(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(n);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&r.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(t=this._opts.cookieJar)===null||t===void 0||t.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var i;r.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=Qs.requestsCount++,Qs.requests[this._index]=this)}_onError(t){this.emitReserved("error",t,this._xhr),this._cleanup(!0)}_cleanup(t){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Vl,t)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Qs.requests[this._index],this._xhr=null}}_onLoad(){const t=this._xhr.responseText;t!==null&&(this.emitReserved("data",t),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}};Xt.requestsCount=0;Xt.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",xi);else if(typeof addEventListener=="function"){const s="onpagehide"in Je?"pagehide":"unload";addEventListener(s,xi,!1)}}function xi(){for(let s in Xt.requests)Xt.requests.hasOwnProperty(s)&&Xt.requests[s].abort()}const Wl=function(){const s=To({xdomain:!1});return s&&s.responseType!==null}();class Hl extends Ql{constructor(t){super(t);const n=t&&t.forceBase64;this.supportsBinary=Wl&&!n}request(t={}){return Object.assign(t,{xd:this.xd},this.opts),new Xt(To,this.uri(),t)}}function To(s){const t=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!t||Ul))return new XMLHttpRequest}catch{}if(!t)try{return new Je[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const _o=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Yl extends Hr{get name(){return"websocket"}doOpen(){const t=this.uri(),n=this.opts.protocols,r=_o?{}:No(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(t,n,r)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=t=>this.onClose({description:"websocket connection closed",context:t}),this.ws.onmessage=t=>this.onData(t.data),this.ws.onerror=t=>this.onError("websocket error",t)}write(t){this.writable=!1;for(let n=0;n<t.length;n++){const r=t[n],i=n===t.length-1;Qr(r,this.supportsBinary,o=>{try{this.doWrite(r,o)}catch{}i&&hn(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const t=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=Ao()),this.supportsBinary||(n.b64=1),this.createUri(t,n)}}const vn=Je.WebSocket||Je.MozWebSocket;class Gl extends Yl{createSocket(t,n,r){return _o?new vn(t,n,r):n?new vn(t,n):new vn(t)}doWrite(t,n){this.ws.send(n)}}class Kl extends Hr{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(t){return this.emitReserved("error",t)}this._transport.closed.then(()=>{this.onClose()}).catch(t=>{this.onError("webtransport error",t)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(t=>{const n=Tl(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=t.readable.pipeThrough(n).getReader(),i=Rl();i.readable.pipeTo(t.writable),this._writer=i.writable.getWriter();const o=()=>{r.read().then(({done:x,value:v})=>{x||(this.onPacket(v),o())}).catch(x=>{})};o();const l={type:"open"};this.query.sid&&(l.data=`{"sid":"${this.query.sid}"}`),this._writer.write(l).then(()=>this.onOpen())})})}write(t){this.writable=!1;for(let n=0;n<t.length;n++){const r=t[n],i=n===t.length-1;this._writer.write(r).then(()=>{i&&hn(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var t;(t=this._transport)===null||t===void 0||t.close()}}const Xl={websocket:Gl,webtransport:Kl,polling:Hl},Jl=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Zl=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Sr(s){if(s.length>8e3)throw"URI too long";const t=s,n=s.indexOf("["),r=s.indexOf("]");n!=-1&&r!=-1&&(s=s.substring(0,n)+s.substring(n,r).replace(/:/g,";")+s.substring(r,s.length));let i=Jl.exec(s||""),o={},l=14;for(;l--;)o[Zl[l]]=i[l]||"";return n!=-1&&r!=-1&&(o.source=t,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=ec(o,o.path),o.queryKey=tc(o,o.query),o}function ec(s,t){const n=/\/{2,9}/g,r=t.replace(n,"/").split("/");return(t.slice(0,1)=="/"||t.length===0)&&r.splice(0,1),t.slice(-1)=="/"&&r.splice(r.length-1,1),r}function tc(s,t){const n={};return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,i,o){i&&(n[i]=o)}),n}const kr=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ws=[];kr&&addEventListener("offline",()=>{Ws.forEach(s=>s())},!1);class Rt extends Re{constructor(t,n){if(super(),this.binaryType=Pl,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,t&&typeof t=="object"&&(n=t,t=null),t){const r=Sr(t);n.hostname=r.host,n.secure=r.protocol==="https"||r.protocol==="wss",n.port=r.port,r.query&&(n.query=r.query)}else n.host&&(n.hostname=Sr(n.host).host);pn(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},n.transports.forEach(r=>{const i=r.prototype.name;this.transports.push(i),this._transportsByName[i]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=zl(this.opts.query)),kr&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ws.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(t){const n=Object.assign({},this.opts.query);n.EIO=Co,n.transport=t,this.id&&(n.sid=this.id);const r=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[t]);return new this._transportsByName[t](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const t=this.opts.rememberUpgrade&&Rt.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(t);n.open(),this.setTransport(n)}setTransport(t){this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}onOpen(){this.readyState="open",Rt.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",t),this.emitReserved("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=t.data,this._onError(n);break;case"message":this.emitReserved("data",t.data),this.emitReserved("message",t.data);break}}onHandshake(t){this.emitReserved("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this._pingInterval=t.pingInterval,this._pingTimeout=t.pingTimeout,this._maxPayload=t.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const t=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+t,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},t),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const t=this._getWritablePackets();this.transport.send(t),this._prevBufferLen=t.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let r=0;r<this.writeBuffer.length;r++){const i=this.writeBuffer[r].data;if(i&&(n+=Bl(i)),r>0&&n>this._maxPayload)return this.writeBuffer.slice(0,r);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const t=Date.now()>this._pingTimeoutTime;return t&&(this._pingTimeoutTime=0,hn(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),t}write(t,n,r){return this._sendPacket("message",t,n,r),this}send(t,n,r){return this._sendPacket("message",t,n,r),this}_sendPacket(t,n,r,i){if(typeof n=="function"&&(i=n,n=void 0),typeof r=="function"&&(i=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const o={type:t,data:n,options:r};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),i&&this.once("flush",i),this.flush()}close(){const t=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),t()},r=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():t()}):this.upgrading?r():t()),this}_onError(t){if(Rt.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",t),this._onClose("transport error",t)}_onClose(t,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),kr&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Ws.indexOf(this._offlineEventListener);r!==-1&&Ws.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",t,n),this.writeBuffer=[],this._prevBufferLen=0}}}Rt.protocol=Co;class sc extends Rt{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let t=0;t<this._upgrades.length;t++)this._probe(this._upgrades[t])}_probe(t){let n=this.createTransport(t),r=!1;Rt.priorWebsocketSuccess=!1;const i=()=>{r||(n.send([{type:"ping",data:"probe"}]),n.once("packet",j=>{if(!r)if(j.type==="pong"&&j.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;Rt.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(I(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const f=new Error("probe error");f.transport=n.name,this.emitReserved("upgradeError",f)}}))};function o(){r||(r=!0,I(),n.close(),n=null)}const l=j=>{const f=new Error("probe error: "+j);f.transport=n.name,o(),this.emitReserved("upgradeError",f)};function x(){l("transport closed")}function v(){l("socket closed")}function p(j){n&&j.name!==n.name&&o()}const I=()=>{n.removeListener("open",i),n.removeListener("error",l),n.removeListener("close",x),this.off("close",v),this.off("upgrading",p)};n.once("open",i),n.once("error",l),n.once("close",x),this.once("close",v),this.once("upgrading",p),this._upgrades.indexOf("webtransport")!==-1&&t!=="webtransport"?this.setTimeoutFn(()=>{r||n.open()},200):n.open()}onHandshake(t){this._upgrades=this._filterUpgrades(t.upgrades),super.onHandshake(t)}_filterUpgrades(t){const n=[];for(let r=0;r<t.length;r++)~this.transports.indexOf(t[r])&&n.push(t[r]);return n}}let nc=class extends sc{constructor(t,n={}){const r=typeof t=="object"?t:n;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(i=>Xl[i]).filter(i=>!!i)),super(t,r)}};function rc(s,t="",n){let r=s;n=n||typeof location<"u"&&location,s==null&&(s=n.protocol+"//"+n.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=n.protocol+s:s=n.host+s),/^(https?|wss?):\/\//.test(s)||(typeof n<"u"?s=n.protocol+"//"+s:s="https://"+s),r=Sr(s)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const o=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+o+":"+r.port+t,r.href=r.protocol+"://"+o+(n&&n.port===r.port?"":":"+r.port),r}const ic=typeof ArrayBuffer=="function",oc=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,Po=Object.prototype.toString,ac=typeof Blob=="function"||typeof Blob<"u"&&Po.call(Blob)==="[object BlobConstructor]",lc=typeof File=="function"||typeof File<"u"&&Po.call(File)==="[object FileConstructor]";function Yr(s){return ic&&(s instanceof ArrayBuffer||oc(s))||ac&&s instanceof Blob||lc&&s instanceof File}function Hs(s,t){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let n=0,r=s.length;n<r;n++)if(Hs(s[n]))return!0;return!1}if(Yr(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return Hs(s.toJSON(),!0);for(const n in s)if(Object.prototype.hasOwnProperty.call(s,n)&&Hs(s[n]))return!0;return!1}function cc(s){const t=[],n=s.data,r=s;return r.data=Er(n,t),r.attachments=t.length,{packet:r,buffers:t}}function Er(s,t){if(!s)return s;if(Yr(s)){const n={_placeholder:!0,num:t.length};return t.push(s),n}else if(Array.isArray(s)){const n=new Array(s.length);for(let r=0;r<s.length;r++)n[r]=Er(s[r],t);return n}else if(typeof s=="object"&&!(s instanceof Date)){const n={};for(const r in s)Object.prototype.hasOwnProperty.call(s,r)&&(n[r]=Er(s[r],t));return n}return s}function dc(s,t){return s.data=Ir(s.data,t),delete s.attachments,s}function Ir(s,t){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<t.length)return t[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let n=0;n<s.length;n++)s[n]=Ir(s[n],t);else if(typeof s=="object")for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&(s[n]=Ir(s[n],t));return s}const uc=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],hc=5;var ce;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(ce||(ce={}));class pc{constructor(t){this.replacer=t}encode(t){return(t.type===ce.EVENT||t.type===ce.ACK)&&Hs(t)?this.encodeAsBinary({type:t.type===ce.EVENT?ce.BINARY_EVENT:ce.BINARY_ACK,nsp:t.nsp,data:t.data,id:t.id}):[this.encodeAsString(t)]}encodeAsString(t){let n=""+t.type;return(t.type===ce.BINARY_EVENT||t.type===ce.BINARY_ACK)&&(n+=t.attachments+"-"),t.nsp&&t.nsp!=="/"&&(n+=t.nsp+","),t.id!=null&&(n+=t.id),t.data!=null&&(n+=JSON.stringify(t.data,this.replacer)),n}encodeAsBinary(t){const n=cc(t),r=this.encodeAsString(n.packet),i=n.buffers;return i.unshift(r),i}}function yi(s){return Object.prototype.toString.call(s)==="[object Object]"}class Gr extends Re{constructor(t){super(),this.reviver=t}add(t){let n;if(typeof t=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(t);const r=n.type===ce.BINARY_EVENT;r||n.type===ce.BINARY_ACK?(n.type=r?ce.EVENT:ce.ACK,this.reconstructor=new fc(n),n.attachments===0&&super.emitReserved("decoded",n)):super.emitReserved("decoded",n)}else if(Yr(t)||t.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(t),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+t)}decodeString(t){let n=0;const r={type:Number(t.charAt(0))};if(ce[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===ce.BINARY_EVENT||r.type===ce.BINARY_ACK){const o=n+1;for(;t.charAt(++n)!=="-"&&n!=t.length;);const l=t.substring(o,n);if(l!=Number(l)||t.charAt(n)!=="-")throw new Error("Illegal attachments");r.attachments=Number(l)}if(t.charAt(n+1)==="/"){const o=n+1;for(;++n&&!(t.charAt(n)===","||n===t.length););r.nsp=t.substring(o,n)}else r.nsp="/";const i=t.charAt(n+1);if(i!==""&&Number(i)==i){const o=n+1;for(;++n;){const l=t.charAt(n);if(l==null||Number(l)!=l){--n;break}if(n===t.length)break}r.id=Number(t.substring(o,n+1))}if(t.charAt(++n)){const o=this.tryParse(t.substr(n));if(Gr.isPayloadValid(r.type,o))r.data=o;else throw new Error("invalid payload")}return r}tryParse(t){try{return JSON.parse(t,this.reviver)}catch{return!1}}static isPayloadValid(t,n){switch(t){case ce.CONNECT:return yi(n);case ce.DISCONNECT:return n===void 0;case ce.CONNECT_ERROR:return typeof n=="string"||yi(n);case ce.EVENT:case ce.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&uc.indexOf(n[0])===-1);case ce.ACK:case ce.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class fc{constructor(t){this.packet=t,this.buffers=[],this.reconPack=t}takeBinaryData(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){const n=dc(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const mc=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Gr,Encoder:pc,get PacketType(){return ce},protocol:hc},Symbol.toStringTag,{value:"Module"}));function rt(s,t,n){return s.on(t,n),function(){s.off(t,n)}}const gc=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Do extends Re{constructor(t,n,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=t,this.nsp=n,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const t=this.io;this.subs=[rt(t,"open",this.onopen.bind(this)),rt(t,"packet",this.onpacket.bind(this)),rt(t,"error",this.onerror.bind(this)),rt(t,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...t){return t.unshift("message"),this.emit.apply(this,t),this}emit(t,...n){var r,i,o;if(gc.hasOwnProperty(t))throw new Error('"'+t.toString()+'" is a reserved event name');if(n.unshift(t),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const l={type:ce.EVENT,data:n};if(l.options={},l.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const I=this.ids++,j=n.pop();this._registerAckCallback(I,j),l.id=I}const x=(i=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||i===void 0?void 0:i.writable,v=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!x||(v?(this.notifyOutgoingListeners(l),this.packet(l)):this.sendBuffer.push(l)),this.flags={},this}_registerAckCallback(t,n){var r;const i=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(i===void 0){this.acks[t]=n;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[t];for(let x=0;x<this.sendBuffer.length;x++)this.sendBuffer[x].id===t&&this.sendBuffer.splice(x,1);n.call(this,new Error("operation has timed out"))},i),l=(...x)=>{this.io.clearTimeoutFn(o),n.apply(this,x)};l.withError=!0,this.acks[t]=l}emitWithAck(t,...n){return new Promise((r,i)=>{const o=(l,x)=>l?i(l):r(x);o.withError=!0,n.push(o),this.emit(t,...n)})}_addToQueue(t){let n;typeof t[t.length-1]=="function"&&(n=t.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:t,flags:Object.assign({fromQueue:!0},this.flags)};t.push((i,...o)=>r!==this._queue[0]?void 0:(i!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(i)):(this._queue.shift(),n&&n(null,...o)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(t=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!t||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(t){t.nsp=this.nsp,this.io._packet(t)}onopen(){typeof this.auth=="function"?this.auth(t=>{this._sendConnectPacket(t)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(t){this.packet({type:ce.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},t):t})}onerror(t){this.connected||this.emitReserved("connect_error",t)}onclose(t,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",t,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(t=>{if(!this.sendBuffer.some(r=>String(r.id)===t)){const r=this.acks[t];delete this.acks[t],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(t){if(t.nsp===this.nsp)switch(t.type){case ce.CONNECT:t.data&&t.data.sid?this.onconnect(t.data.sid,t.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case ce.EVENT:case ce.BINARY_EVENT:this.onevent(t);break;case ce.ACK:case ce.BINARY_ACK:this.onack(t);break;case ce.DISCONNECT:this.ondisconnect();break;case ce.CONNECT_ERROR:this.destroy();const r=new Error(t.data.message);r.data=t.data.data,this.emitReserved("connect_error",r);break}}onevent(t){const n=t.data||[];t.id!=null&&n.push(this.ack(t.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(t){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const r of n)r.apply(this,t)}super.emit.apply(this,t),this._pid&&t.length&&typeof t[t.length-1]=="string"&&(this._lastOffset=t[t.length-1])}ack(t){const n=this;let r=!1;return function(...i){r||(r=!0,n.packet({type:ce.ACK,id:t,data:i}))}}onack(t){const n=this.acks[t.id];typeof n=="function"&&(delete this.acks[t.id],n.withError&&t.data.unshift(null),n.apply(this,t.data))}onconnect(t,n){this.id=t,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach(t=>this.emitEvent(t)),this.receiveBuffer=[],this.sendBuffer.forEach(t=>{this.notifyOutgoingListeners(t),this.packet(t)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(t=>t()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:ce.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(t){return this.flags.compress=t,this}get volatile(){return this.flags.volatile=!0,this}timeout(t){return this.flags.timeout=t,this}onAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(t),this}prependAny(t){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(t),this}offAny(t){if(!this._anyListeners)return this;if(t){const n=this._anyListeners;for(let r=0;r<n.length;r++)if(t===n[r])return n.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(t),this}prependAnyOutgoing(t){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(t),this}offAnyOutgoing(t){if(!this._anyOutgoingListeners)return this;if(t){const n=this._anyOutgoingListeners;for(let r=0;r<n.length;r++)if(t===n[r])return n.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(t){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const r of n)r.apply(this,t.data)}}}function rs(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}rs.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var t=Math.random(),n=Math.floor(t*this.jitter*s);s=Math.floor(t*10)&1?s+n:s-n}return Math.min(s,this.max)|0};rs.prototype.reset=function(){this.attempts=0};rs.prototype.setMin=function(s){this.ms=s};rs.prototype.setMax=function(s){this.max=s};rs.prototype.setJitter=function(s){this.jitter=s};class Cr extends Re{constructor(t,n){var r;super(),this.nsps={},this.subs=[],t&&typeof t=="object"&&(n=t,t=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,pn(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((r=n.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new rs({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=t;const i=n.parser||mc;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(t){return arguments.length?(this._reconnection=!!t,t||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(t){return t===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=t,this)}reconnectionDelay(t){var n;return t===void 0?this._reconnectionDelay:(this._reconnectionDelay=t,(n=this.backoff)===null||n===void 0||n.setMin(t),this)}randomizationFactor(t){var n;return t===void 0?this._randomizationFactor:(this._randomizationFactor=t,(n=this.backoff)===null||n===void 0||n.setJitter(t),this)}reconnectionDelayMax(t){var n;return t===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=t,(n=this.backoff)===null||n===void 0||n.setMax(t),this)}timeout(t){return arguments.length?(this._timeout=t,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(t){if(~this._readyState.indexOf("open"))return this;this.engine=new nc(this.uri,this.opts);const n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const i=rt(n,"open",function(){r.onopen(),t&&t()}),o=x=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",x),t?t(x):this.maybeReconnectOnOpen()},l=rt(n,"error",o);if(this._timeout!==!1){const x=this._timeout,v=this.setTimeoutFn(()=>{i(),o(new Error("timeout")),n.close()},x);this.opts.autoUnref&&v.unref(),this.subs.push(()=>{this.clearTimeoutFn(v)})}return this.subs.push(i),this.subs.push(l),this}connect(t){return this.open(t)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const t=this.engine;this.subs.push(rt(t,"ping",this.onping.bind(this)),rt(t,"data",this.ondata.bind(this)),rt(t,"error",this.onerror.bind(this)),rt(t,"close",this.onclose.bind(this)),rt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(t){try{this.decoder.add(t)}catch(n){this.onclose("parse error",n)}}ondecoded(t){hn(()=>{this.emitReserved("packet",t)},this.setTimeoutFn)}onerror(t){this.emitReserved("error",t)}socket(t,n){let r=this.nsps[t];return r?this._autoConnect&&!r.active&&r.connect():(r=new Do(this,t,n),this.nsps[t]=r),r}_destroy(t){const n=Object.keys(this.nsps);for(const r of n)if(this.nsps[r].active)return;this._close()}_packet(t){const n=this.encoder.encode(t);for(let r=0;r<n.length;r++)this.engine.write(n[r],t.options)}cleanup(){this.subs.forEach(t=>t()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(t,n){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",t,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{t.skipReconnect||(this.emitReserved("reconnect_attempt",t.backoff.attempts),!t.skipReconnect&&t.open(i=>{i?(t._reconnecting=!1,t.reconnect(),this.emitReserved("reconnect_error",i)):t.onreconnect()}))},n);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const t=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",t)}}const ls={};function Ys(s,t){typeof s=="object"&&(t=s,s=void 0),t=t||{};const n=rc(s,t.path||"/socket.io"),r=n.source,i=n.id,o=n.path,l=ls[i]&&o in ls[i].nsps,x=t.forceNew||t["force new connection"]||t.multiplex===!1||l;let v;return x?v=new Cr(r,t):(ls[i]||(ls[i]=new Cr(r,t)),v=ls[i]),n.query&&!t.query&&(t.query=n.queryKey),v.socket(n.path,t)}Object.assign(Ys,{Manager:Cr,Socket:Do,io:Ys,connect:Ys});const xc=window.location.hostname!=="localhost"&&window.location.hostname!=="127.0.0.1",ht=xc?"https://aakardata.in/api":"http://localhost:5000/api",Zp="ma7o6bmjpok2nhnhq6jgcwrlg446a2hnyxqih70ni695pvm5";class yc{constructor(){this.socket=null,this.subscribedToNotifications=!1,this.reconnectTimer=null,this.listeners={},this.unreadCount=0,this.isExhibitor=!1,this.lastToken="",this.handleConnect=()=>{setTimeout(()=>{this.subscribedToNotifications&&this.socket&&this.socket.emit("subscribe_notifications"),this.fetchUnreadCount(),this.triggerEvent("connected",!0)},500)},this.handleDisconnect=t=>{this.triggerEvent("disconnected",t),t!=="io client disconnect"&&t!=="transport close"&&this.scheduleReconnect()},this.handleConnectError=t=>{console.error("Notification socket connection error:",t),this.scheduleReconnect()},this.handleError=t=>{console.error("Notification socket error:",t),this.scheduleReconnect()},this.scheduleReconnect=()=>{this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.refreshAndReconnect(),this.reconnectTimer=null},5e3))},this.refreshAndReconnect=async()=>{try{const t=this.isExhibitor?"exhibitor_token":"token",n=localStorage.getItem(t);n?this.init(n,this.isExhibitor):console.error(`No ${this.isExhibitor?"exhibitor":"admin"} token found for reconnection`)}catch(t){console.error("Error refreshing token for socket reconnection:",t)}},this.handleNewNotification=t=>{this.unreadCount=t.unreadCount,this.triggerEvent("notification",t.notification),this.triggerEvent("unreadCount",this.unreadCount)},this.handleNotificationUpdate=t=>{this.unreadCount=t.unreadCount,this.triggerEvent("unreadCount",this.unreadCount),t.newNotifications&&t.newNotifications.length>0&&t.newNotifications.forEach(n=>{this.triggerEvent("notification",n)})}}init(t,n=!1){var r;if(!((r=this.socket)!=null&&r.connected&&this.lastToken===t&&this.isExhibitor===n)){this.isExhibitor=n,this.lastToken=t,this.socket&&(this.socket.disconnect(),this.socket=null),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null);try{if(!t||typeof t!="string")throw new Error("Invalid token provided for socket connection");const i=ht.replace("/api",""),o=t.startsWith("Bearer ")?t.substring(7):t;this.socket=Ys(i,{auth:{token:o,type:n?"exhibitor":"admin"},forceNew:!0,reconnection:!0,reconnectionAttempts:5,reconnectionDelay:3e3,timeout:2e4,autoConnect:!0,transports:["polling","websocket"]}),this.socket.on("connect",this.handleConnect),this.socket.on("disconnect",this.handleDisconnect),this.socket.on("connect_error",this.handleConnectError),this.socket.on("error",this.handleError),this.socket.on("new_notification",this.handleNewNotification),this.socket.on("notification_update",this.handleNotificationUpdate)}catch(i){console.error("Error initializing notification socket:",i),this.scheduleReconnect()}}}subscribeToNotifications(){this.subscribedToNotifications=!0,this.socket&&this.socket.connected&&this.socket.emit("subscribe_notifications")}unsubscribeFromNotifications(){this.subscribedToNotifications=!1,this.socket&&this.socket.connected&&this.socket.emit("unsubscribe_notifications")}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.unreadCount=0,this.subscribedToNotifications=!1}addEventListener(t,n){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(n)}removeEventListener(t,n){this.listeners[t]&&(this.listeners[t]=this.listeners[t].filter(r=>r!==n))}triggerEvent(t,n){this.listeners[t]&&this.listeners[t].forEach(r=>{try{r(n)}catch(i){console.error(`Error in notification ${t} listener:`,i)}})}getUnreadCount(){return this.unreadCount}async fetchUnreadCount(){try{const t=this.isExhibitor?"notifications/exhibitor":"notifications/admin",n={limit:1,page:1,unreadOnly:!0},r=this.isExhibitor?"exhibitor_token":"token",i=localStorage.getItem(r);if(!i)return console.error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`),0;const o=await Ye.get(t,{baseURL:ht,params:n,headers:{Authorization:`Bearer ${i}`}});return o.data&&o.data.success?(this.unreadCount=o.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount),this.unreadCount):0}catch(t){return console.error("Error fetching unread count:",t),0}}async getNotifications(t=1,n=10,r=!1){try{const i=this.isExhibitor?"notifications/exhibitor":"notifications/admin",o={page:t,limit:n,unreadOnly:r},l=this.isExhibitor?"exhibitor_token":"token",x=localStorage.getItem(l);if(!x)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);return(await Ye.get(i,{baseURL:ht,params:o,headers:{Authorization:`Bearer ${x}`}})).data}catch(i){return console.error("Error fetching notifications:",i),{success:!1,data:{notifications:[],pagination:{total:0,page:1,limit:10,pages:0},unreadCount:0}}}}async markAsRead(t){try{const n=this.isExhibitor?`notifications/exhibitor/mark-read/${t}`:`notifications/admin/mark-read/${t}`,r=this.isExhibitor?"exhibitor_token":"token",i=localStorage.getItem(r);if(!i)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);const o=await Ye.put(n,{},{baseURL:ht,headers:{Authorization:`Bearer ${i}`}});return o.data&&o.data.success&&(this.unreadCount=o.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount)),o.data}catch(n){throw console.error("Error marking notification as read:",n),n}}async markAllAsRead(){try{const t=this.isExhibitor?"notifications/exhibitor/mark-all-read":"notifications/admin/mark-all-read",n=this.isExhibitor?"exhibitor_token":"token",r=localStorage.getItem(n);if(!r)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);const i=await Ye.put(t,{},{baseURL:ht,headers:{Authorization:`Bearer ${r}`}});return i.data&&i.data.success&&(this.unreadCount=0,this.triggerEvent("unreadCount",this.unreadCount)),i.data}catch(t){throw console.error("Error marking all notifications as read:",t),t}}async deleteNotification(t){try{const n=this.isExhibitor?`notifications/exhibitor/${t}`:`notifications/admin/${t}`,r=await Ye.delete(n,{baseURL:ht,headers:{Authorization:`Bearer ${localStorage.getItem(this.isExhibitor?"exhibitor_token":"token")}`}});if(r.data.success)return r.data.data.unreadCount!==void 0&&(this.unreadCount=r.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount)),r.data;throw new Error("Failed to delete notification")}catch(n){throw console.error("Error deleting notification:",n),n}}async deleteAllNotifications(){try{const t=this.isExhibitor?"notifications/exhibitor/delete-all":"notifications/admin/delete-all",n=await Ye.delete(t,{baseURL:ht,headers:{Authorization:`Bearer ${localStorage.getItem(this.isExhibitor?"exhibitor_token":"token")}`}});if(n.data.success)return this.unreadCount=0,this.triggerEvent("unreadCount",this.unreadCount),n.data;throw new Error("Failed to delete all notifications")}catch(t){throw console.error("Error deleting all notifications:",t),t}}}const ze=new yc;var pt=(s=>(s.NEW_LEAD="New Lead",s.FOLLOWUP_DUE="Follow-up Due",s.STATUS_CHANGE="Status Changed",s.ASSIGNMENT="Lead Assigned",s.NEW_BOOKING="NEW_BOOKING",s.BOOKING_CONFIRMED="BOOKING_CONFIRMED",s.BOOKING_CANCELLED="BOOKING_CANCELLED",s.PAYMENT_RECEIVED="PAYMENT_RECEIVED",s.INVOICE_GENERATED="INVOICE_GENERATED",s.EXHIBITION_UPDATE="EXHIBITION_UPDATE",s.SYSTEM_MESSAGE="SYSTEM_MESSAGE",s.EXHIBITOR_MESSAGE="EXHIBITOR_MESSAGE",s.EXHIBITOR_REGISTERED="EXHIBITOR_REGISTERED",s))(pt||{}),At=(s=>(s.HIGH="HIGH",s.MEDIUM="MEDIUM",s.LOW="LOW",s))(At||{}),Nr=(s=>(s.READ="Read",s.UNREAD="Unread",s))(Nr||{}),$o={exports:{}};(function(s,t){(function(n,r){s.exports=r()})(xa,function(){return function(n,r,i){n=n||{};var o=r.prototype,l={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function x(p,I,j,f){return o.fromToBase(p,I,j,f)}i.en.relativeTime=l,o.fromToBase=function(p,I,j,f,w){for(var T,R,P,S=j.$locale().relativeTime||l,_=n.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],N=_.length,a=0;a<N;a+=1){var c=_[a];c.d&&(T=f?i(p).diff(j,c.d,!0):j.diff(p,c.d,!0));var h=(n.rounding||Math.round)(Math.abs(T));if(P=T>0,h<=c.r||!c.r){h<=1&&a>0&&(c=_[a-1]);var k=S[c.l];w&&(h=w(""+h)),R=typeof k=="string"?k.replace("%d",h):k(h,I,c.l,P);break}}if(I)return R;var m=P?S.future:S.past;return typeof m=="function"?m(R):m.replace("%s",R)},o.to=function(p,I){return x(p,I,this,!0)},o.from=function(p,I){return x(p,I,this)};var v=function(p){return p.$u?i.utc():i()};o.toNow=function(p){return this.to(v(this),p)},o.fromNow=function(p){return this.from(v(this),p)}}})})($o);var bc=$o.exports;const jc=ya(bc);$e.extend(jc);const bi=s=>{switch(s){case At.HIGH:return"#f5222d";case At.MEDIUM:return"#faad14";case At.LOW:return"#52c41a";default:return"#1677ff"}},vc=s=>$e(s).fromNow(),wc=s=>$e(s).format("YYYY-MM-DD HH:mm"),ef=s=>s.filter(t=>t.isRead===!1).length,tf=s=>{if(!s.entityId||!s.entityType)return"/notifications";switch(s.entityType){case"lead":return`/leads/${s.entityId}`;case"followup":return`/followups/${s.entityId}`;case"Booking":return"/bookings";case"Invoice":return`/invoice/${s.entityId}`;case"Exhibition":return`/exhibition/${s.entityId}`;case"Exhibitor":return`/exhibitors?id=${s.entityId}`;default:return"/notifications"}},{Text:ji,Paragraph:Sc}=ke,kc=({notification:s,onView:t,onMarkAsRead:n,onDelete:r})=>{const i=()=>{switch(s.type){case pt.NEW_LEAD:return e.jsx(xr,{style:{color:"#1677ff"}});case pt.FOLLOWUP_DUE:return e.jsx(mt,{style:{color:"#faad14"}});case pt.STATUS_CHANGE:return e.jsx(ba,{style:{color:"#722ed1"}});case pt.ASSIGNMENT:return e.jsx(Ne,{style:{color:"#52c41a"}});default:return e.jsx(uo,{style:{color:"#1677ff"}})}},o=()=>{s.isRead||n(s),t(s)},l=x=>{x.stopPropagation(),r(s)};return e.jsx(vt.Item,{onClick:o,className:s.isRead?"":"notification-unread",style:{cursor:"pointer",backgroundColor:s.isRead?"transparent":"#f0f5ff",padding:"16px",borderRadius:"4px",transition:"background-color 0.3s"},actions:[e.jsx(St,{title:"Delete notification",children:e.jsx(H,{type:"text",danger:!0,icon:e.jsx(Zt,{}),onClick:l,"aria-label":"Delete notification"})})],children:e.jsx(vt.Item.Meta,{avatar:e.jsx(kt,{dot:!s.isRead,color:bi(s.priority),children:e.jsx(Bt,{icon:i(),size:"large",style:{backgroundColor:"white",border:`1px solid ${bi(s.priority)}`}})}),title:e.jsxs(ae,{children:[e.jsx(ji,{strong:!0,children:s.title}),!s.isRead&&e.jsx(ne,{color:"blue",children:"New"})]}),description:e.jsxs("div",{children:[e.jsx(Sc,{ellipsis:{rows:2},style:{marginBottom:4},children:s.message}),e.jsx(St,{title:wc(s.createdAt),children:e.jsx(ji,{type:"secondary",style:{fontSize:12},children:vc(s.createdAt)})})]})})})},{Title:Ec,Text:sf}=ke,Ic=s=>{switch(s){case"NEW_BOOKING":return pt.NEW_LEAD;case"BOOKING_CONFIRMED":case"INVOICE_GENERATED":case"PAYMENT_RECEIVED":return pt.STATUS_CHANGE;case"EXHIBITOR_MESSAGE":return pt.FOLLOWUP_DUE;case"EXHIBITOR_REGISTERED":return pt.NEW_LEAD;default:return pt.STATUS_CHANGE}},Cc=s=>{switch(s){case"HIGH":return At.HIGH;case"MEDIUM":return At.MEDIUM;case"LOW":return At.LOW;default:return At.MEDIUM}},Nc=({isExhibitor:s=!1})=>{const t=st(),[n,r]=g.useState([]),[i,o]=g.useState(!1),[l,x]=g.useState(!1),[v,p]=g.useState(0),[I,j]=g.useState(!1),[f,w]=g.useState("all"),T=g.useRef(null),{isAuthenticated:R,user:P}=Me(A=>A.auth),{isAuthenticated:S}=Me(A=>A.exhibitorAuth||{isAuthenticated:!1}),_=s?S:R,[N,a]=g.useState(!1);g.useEffect(()=>{if(_){const A=s?"exhibitor_token":"token",$=localStorage.getItem(A);if($){ze.init($,s),ze.subscribeToNotifications();const F=U=>{p(U),U>0&&!l&&(j(!0),setTimeout(()=>{j(!1)},2e3))},q=U=>{r(V=>[U,...V])},D=()=>{a(!0),c()},M=()=>{a(!1)};return ze.addEventListener("unreadCount",F),ze.addEventListener("notification",q),ze.addEventListener("connected",D),ze.addEventListener("disconnected",M),c(),()=>{ze.removeEventListener("unreadCount",F),ze.removeEventListener("notification",q),ze.removeEventListener("connected",D),ze.removeEventListener("disconnected",M),ze.unsubscribeFromNotifications()}}else console.error(`No ${s?"exhibitor":"admin"} token found in localStorage`)}},[_,s]);const c=async()=>{if(_){o(!0);try{const A=await ze.getNotifications(1,10);A.success&&(r(A.data.notifications),p(A.data.unreadCount))}catch(A){console.error("Error fetching notifications:",A)}finally{o(!1)}}},h=A=>{x(A),A&&(T.current&&T.current.classList.remove("bell-animate"),c())},k=async A=>{if(A.isRead||await m(A),x(!1),A.entityId&&A.entityType){let $="";switch(A.entityType){case"Booking":$=s?`/exhibitor/bookings/${A.entityId}`:"/bookings";break;case"Invoice":$=s?`/exhibitor/invoice/${A.entityId}`:`/invoice/${A.entityId}`;break;case"Exhibition":$=`/exhibition/${A.entityId}`;break;case"Exhibitor":$=`/exhibitors?id=${A.entityId}`;break;default:$=""}t($||"/notifications")}else t("/notifications")},m=async A=>{try{await ze.markAsRead(A._id),r(n.map($=>$._id===A._id?{...$,isRead:!0}:$))}catch($){console.error("Error marking notification as read:",$)}},C=async A=>{try{await ze.deleteNotification(A._id),r(n.filter($=>$._id!==A._id)),A.isRead||p($=>Math.max(0,$-1))}catch($){console.error("Error deleting notification:",$)}},d=()=>{x(!1),t("/notifications")},u=async()=>{try{await ze.markAllAsRead(),r(n.map(A=>({...A,isRead:!0}))),p(0)}catch(A){console.error("Error marking all notifications as read:",A)}},y=async()=>{try{await ze.deleteAllNotifications(),r([]),p(0)}catch(A){console.error("Error deleting all notifications:",A)}},b=()=>f==="unread"?n.filter(A=>!A.isRead):n.slice(0,10),E=A=>{w(A)},B=A=>{var $;return{_id:A._id,recipient:A.recipient,recipientType:A.recipientType||"admin",title:A.title,message:A.message,type:Ic(A.type),priority:Cc(A.priority),isRead:A.isRead,readAt:A.readAt,entityId:A.entityId,entityType:A.entityType,data:A.data,createdAt:A.createdAt,updatedAt:A.updatedAt||A.createdAt,id:A._id,userId:A.recipient,source:($=A.data)==null?void 0:$.source,status:A.isRead?Nr.READ:Nr.UNREAD}},L=e.jsxs("div",{className:"notification-dropdown",children:[e.jsxs("div",{className:"notification-header",children:[e.jsx(Ec,{level:5,style:{margin:0},children:"Notifications"}),e.jsxs(ae,{children:[e.jsx(H,{type:"text",size:"small",icon:e.jsx(ho,{}),onClick:c,loading:i,className:"header-btn",title:"Refresh notifications"}),e.jsx(H,{type:"text",size:"small",icon:e.jsx(to,{}),onClick:u,disabled:v===0,className:"header-btn",title:"Mark all as read"}),e.jsx(H,{type:"text",size:"small",danger:!0,icon:e.jsx(Zt,{}),onClick:y,disabled:n.length===0,className:"header-btn",title:"Clear all notifications"}),e.jsx(H,{type:"text",size:"small",icon:e.jsx(yr,{}),onClick:()=>t("/notifications"),className:"header-btn",title:"Notification Settings"}),e.jsx(H,{type:"text",size:"small",icon:e.jsx(js,{}),onClick:()=>x(!1),className:"header-btn",title:"Close"})]})]}),e.jsx(zt,{activeKey:f,onChange:E,size:"small",className:"notification-tabs",items:[{key:"all",label:e.jsx("span",{children:"All"})},{key:"unread",label:e.jsxs("span",{className:"tab-label",children:["Unread",e.jsx(kt,{count:v,size:"small",offset:[5,-3],style:{backgroundColor:"#1677ff"}})]})}]}),e.jsx("div",{className:"notification-list",children:e.jsx(et,{spinning:i,children:b().length===0?e.jsx(Ce,{image:Ce.PRESENTED_IMAGE_SIMPLE,description:f==="unread"?"No unread notifications":"No notifications",style:{padding:"20px 0"}}):e.jsx(vt,{dataSource:b(),renderItem:A=>e.jsx(kc,{notification:B(A),onView:()=>k(A),onMarkAsRead:()=>m(A),onDelete:C})})})}),e.jsx(Be,{style:{margin:"0"}}),e.jsx("div",{className:"notification-footer",children:e.jsx(H,{type:"link",onClick:d,children:"View All Notifications"})})]});return e.jsx("div",{ref:T,className:`bell-container ${I?"bell-animate":""}`,children:e.jsx(ln,{overlay:L,trigger:["click"],open:l,onOpenChange:h,placement:"bottomRight",getPopupContainer:A=>A.parentNode,overlayClassName:"notification-dropdown-overlay",children:e.jsx("div",{className:"bell-trigger",children:e.jsx(kt,{count:v,className:"notification-badge",size:"default",overflowCount:99,children:e.jsx(uo,{className:"notification-bell-icon"})})})})})};class Ac{async getSettings(){return(await K.get("/settings")).data}async updateSettings(t){return(await K.put("/settings",t)).data}async uploadLogo(t){const n=new FormData;return n.append("file",t),(await K.post("/settings/upload/logo",n,{headers:{"Content-Type":"multipart/form-data"}})).data}}const Kr=new Ac,Rc={settings:null,loading:!1,error:null},Gs=de("settings/fetchSettings",async(s,{rejectWithValue:t})=>{var n,r;try{return await Kr.getSettings()}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch settings")}}),Ks=de("settings/updateSettings",async(s,{rejectWithValue:t})=>{var n,r;try{return await Kr.updateSettings(s)}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update settings")}}),wn=de("settings/uploadLogo",async(s,{dispatch:t,rejectWithValue:n})=>{var r,i;try{const o=await Kr.uploadLogo(s);return o.path&&await t(Ks({logo:o.path})),o}catch(o){return n(((i=(r=o.response)==null?void 0:r.data)==null?void 0:i.message)||"Failed to upload logo")}}),Tc=Ve({name:"settings",initialState:Rc,reducers:{},extraReducers:s=>{s.addCase(Gs.pending,t=>{t.loading=!0,t.error=null}).addCase(Gs.fulfilled,(t,n)=>{t.settings=n.payload,t.loading=!1}).addCase(Gs.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Ks.pending,t=>{t.loading=!0,t.error=null}).addCase(Ks.fulfilled,(t,n)=>{t.settings=n.payload,t.loading=!1}).addCase(Ks.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(wn.pending,t=>{t.loading=!0,t.error=null}).addCase(wn.fulfilled,t=>{t.loading=!1}).addCase(wn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),_c=Tc.reducer,Pc=()=>{const{user:s}=Me(n=>n.auth),t=n=>{if(!s||!s.role||!s.role.permissions)return!1;const r=s.role.permissions;if(r.includes(n)||r.includes("*")||r.includes("all")||r.includes("admin")||r.includes("superadmin")||r.includes("full_access")||r.includes("manage_all"))return!0;const i=n.split("_");if(i.length===2){const o=i[0],l=i[1],x=[`${o}.*`,`*.${l}`,`view_${o}`,`${o}_view`,`${o}s_${l}`,`${l}_${o}`,`${o}`,`${l}`,o.endsWith("s")?`${o.slice(0,-1)}_${l}`:`${o}s_${l}`,`${o}_${l==="view"?"read":l}`,`${l==="view"?"read":l}_${o}`];for(const v of x)if(r.includes(v))return!0}return!1};return{hasPermission:t,hasAnyPermission:n=>n.some(r=>t(r)),hasAllPermissions:n=>n.every(r=>t(r))}},{Header:Dc,Sider:$c,Content:Lc}=ve,Bc=W.div`
  height: 65px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #E5E7EB;
  transition: all 0.3s;
`,Mc=W.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
`,Fc=W.img`
  height: auto;
  width: 100%;
  max-width: 150px;
  max-height: auto;
  object-fit: contain;
`;W.span`
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  transition: opacity 0.3s, margin-left 0.3s;
`;const be=({children:s})=>{const[t,n]=g.useState(!1),r=st(),i=xt(),o=Mr(),l=Me(c=>c.auth.user),{settings:x}=Me(c=>c.settings),[v,p]=g.useState("/logo.png"),[I,j]=g.useState(!1),{hasPermission:f}=Pc(),w=g.useCallback(async()=>{try{j(!0),await i(Us()).unwrap()}catch{}finally{j(!1)}},[i]);g.useEffect(()=>{const c=setInterval(()=>{w()},3e5);return()=>clearInterval(c)},[w]),g.useEffect(()=>{w()},[o.pathname,w]),g.useEffect(()=>{},[l,f]),g.useEffect(()=>{i(Gs())},[i]);const T=[{key:"dashboard",icon:e.jsx(tn,{}),label:"Dashboard",requiredPermission:"dashboard_view",onClick:()=>r("/dashboard")},{key:"exhibition",icon:e.jsx(mo,{}),label:"Exhibitions",requiredPermission:"exhibitions_view",onClick:()=>r("/exhibition")},{key:"stalls",icon:e.jsx(Ze,{}),label:"Stalls",requiredPermission:"view_stalls",children:[{key:"stall/list",label:"Stall List",requiredPermission:"view_stalls",onClick:()=>r("/stall/list")},{key:"stall-types",label:"Stall Types",requiredPermission:"view_stall_types",onClick:()=>r("/stall-types")}]},{key:"bookings",icon:e.jsx(Qe,{}),label:"Stall Bookings",requiredPermission:"view_bookings",onClick:()=>r("/bookings")},{key:"amenities",icon:e.jsx(Xa,{}),label:"Amenities",requiredPermission:"view_amenities",onClick:()=>r("/amenities")},{key:"invoices",icon:e.jsx(xs,{}),label:"Invoices",requiredPermission:"view_invoices",onClick:()=>r("/invoices")},{key:"exhibitors",icon:e.jsx(zr,{}),label:"Exhibitors",requiredPermission:"view_exhibitors",onClick:()=>r("/exhibitors")},{key:"index",icon:e.jsx(Ne,{}),label:"Users",requiredPermission:"users_view",onClick:()=>r("/index")},{key:"roles",icon:e.jsx(Ja,{}),label:"Roles",requiredPermission:"roles_view",onClick:()=>r("/roles")},{key:"settings",icon:e.jsx(yr,{}),label:"Settings",requiredPermission:"settings_view",onClick:()=>r("/settings")}],R=c=>c.filter(h=>{if(h.requiredPermission&&!f(h.requiredPermission))return!1;if(h.children){const k=R(h.children);if(k.length===0)return!1;h.children=k}return!0}),P=R(T),S=c=>c.map(h=>{const{requiredPermission:k,...m}=h;return m.children&&(m.children=S(m.children)),m}),_=S(P);g.useEffect(()=>{const c={dashboard:"dashboard_view",exhibition:"exhibitions_view","stall/list":"view_stalls","stall-types":"view_stall_types",bookings:"view_bookings",amenities:"view_amenities",invoices:"view_invoices",exhibitors:"view_exhibitors",index:"users_view",roles:"roles_view",settings:"settings_view"},h=o.pathname.substring(1)||"dashboard",k=c[h];if(k&&!f(k)){const m=P.length>0?P[0]:null;m?r(`/${m.key}`):(i(pi()),r("/login"))}},[o.pathname,f,P,r,i]),g.useEffect(()=>{const c=localStorage.getItem("cachedLogoUrl"),h=localStorage.getItem("logoTimestamp"),k=new Date().getTime();if(c&&h&&k-parseInt(h)<36e5)p(c);else if(x!=null&&x.logo){const m=`${K.defaults.baseURL}/public/logo`;p(m),localStorage.setItem("cachedLogoUrl",m),localStorage.setItem("logoTimestamp",k.toString());const C=new Image;C.src=m}},[x]);const N=[{key:"profile",label:"Profile",icon:e.jsx(Ne,{}),onClick:()=>r("/account")},{key:"settings",label:"Settings",icon:e.jsx(yr,{}),onClick:()=>r("/settings")},{key:"divider",type:"divider"},{key:"logout",label:"Logout",icon:e.jsx(en,{}),onClick:()=>{i(pi()),r("/login")}}],a=()=>{const c=o.pathname.substring(1);return c.charAt(0).toUpperCase()+c.slice(1)};return e.jsxs(ve,{style:{minHeight:"100vh"},children:[e.jsxs($c,{trigger:null,collapsible:!0,collapsed:t,style:{background:"#fff",borderRight:"1px solid #E5E7EB",boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1)",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflow:"hidden"},width:256,collapsedWidth:80,children:[e.jsx(Bc,{children:e.jsx(Mc,{children:e.jsx(Fc,{src:v,alt:"Logo",onError:()=>p("/logo.png")})})}),e.jsx(ks,{mode:"inline",selectedKeys:[o.pathname.substring(1)||"dashboard"],items:_,style:{border:"none",padding:"16px 0",background:"transparent"},className:"main-nav-menu",inlineCollapsed:t})]}),e.jsxs(ve,{style:{marginLeft:t?80:256,transition:"all 0.2s"},children:[e.jsxs(Dc,{style:{padding:"0 24px",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 0 0 rgb(0 0 0 / 0.05)",zIndex:99},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(H,{type:"text",icon:t?e.jsx(po,{}):e.jsx(fo,{}),onClick:()=>n(!t),style:{fontSize:16}}),e.jsx("span",{style:{marginLeft:24,fontSize:20,fontWeight:600,color:"#111827"},children:a()})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("div",{style:{marginRight:20},children:e.jsx(Nc,{isExhibitor:!1})}),e.jsx(ln,{menu:{items:N},placement:"bottomRight",children:e.jsxs(ae,{align:"center",style:{cursor:"pointer"},children:[e.jsx(Bt,{size:"small",icon:e.jsx(Ne,{}),style:{backgroundColor:"#5046e5"}}),e.jsx("span",{style:{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:(l==null?void 0:l.username)||"User"})]})})]})]}),e.jsx(Lc,{style:{margin:"24px 16px",padding:24,minHeight:280,background:"#fff",borderRadius:8,boxShadow:"0 1px 2px 0 rgb(0 0 0 / 0.05)"},children:s})]})]})},vi=localStorage.getItem("exhibitor_token"),zc=localStorage.getItem("exhibitor")?JSON.parse(localStorage.getItem("exhibitor")):null,Oc={isAuthenticated:!!vi,exhibitor:zc,token:vi,showLoginModal:!1,showForgotPasswordModal:!1,loginContext:null},Lo=Ve({name:"exhibitorAuth",initialState:Oc,reducers:{setExhibitorCredentials:(s,t)=>{s.exhibitor=t.payload.exhibitor,s.token=t.payload.token,s.isAuthenticated=!0,localStorage.setItem("exhibitor_token",t.payload.token),localStorage.setItem("exhibitor",JSON.stringify(t.payload.exhibitor))},exhibitorLogout:s=>{s.exhibitor=null,s.token=null,s.isAuthenticated=!1,localStorage.removeItem("exhibitor_token"),localStorage.removeItem("exhibitor")},showLoginModal:(s,t)=>{s.showLoginModal=!0,s.showForgotPasswordModal=!1,s.loginContext=t.payload||null},hideLoginModal:s=>{s.showLoginModal=!1,s.loginContext=null},showForgotPasswordModal:s=>{s.showForgotPasswordModal=!0,s.showLoginModal=!1},hideForgotPasswordModal:s=>{s.showForgotPasswordModal=!1}}}),{setExhibitorCredentials:Ar,exhibitorLogout:Bo,showLoginModal:Ft,hideLoginModal:As,showForgotPasswordModal:qc,hideForgotPasswordModal:Sn}=Lo.actions,Uc=Lo.reducer,{Header:Vc,Sider:Qc,Content:Wc}=ve,Ut=({children:s})=>{var j;const[t,n]=g.useState(!1),r=st(),i=xt(),o=Mr(),l=Me(f=>f.exhibitorAuth.exhibitor),x=()=>{const f=o.pathname;return f.includes("/exhibitor/dashboard")?"dashboard":f.includes("/exhibitor/bookings")?"bookings":f.includes("/exhibitor/profile")?"profile":f.includes("/exhibitions")?"exhibitions":f.includes("/exhibitor/support")?"help":"dashboard"},v=[{key:"dashboard",icon:e.jsx(tn,{}),label:"Dashboard",onClick:()=>r("/exhibitor/dashboard")},{key:"bookings",icon:e.jsx(Ze,{}),label:"My Bookings",onClick:()=>r("/exhibitor/bookings")},{key:"profile",icon:e.jsx(Ne,{}),label:"My Profile",onClick:()=>r("/exhibitor/profile")},{key:"exhibitions",icon:e.jsx(xs,{}),label:"Exhibitions",onClick:()=>r("/exhibitions")},{key:"help",icon:e.jsx(ja,{}),label:"Help & Support",onClick:()=>r("/exhibitor/support")}],p=[{key:"profile",label:"My Profile",icon:e.jsx(Ne,{}),onClick:()=>r("/exhibitor/profile")},{key:"bookings",label:"My Bookings",icon:e.jsx(Ze,{}),onClick:()=>r("/exhibitor/bookings")},{key:"divider",type:"divider"},{key:"logout",label:"Logout",icon:e.jsx(en,{}),onClick:()=>{i(Bo()),r("/")}}],I=()=>{const f=o.pathname.replace("/exhibitor/","");return f==="dashboard"?"Dashboard":f.startsWith("bookings")?f.includes("/")?"Booking Details":"My Bookings":f==="profile"?"My Profile":f==="support"?"Help & Support":f.charAt(0).toUpperCase()+f.slice(1)};return e.jsxs(ve,{style:{minHeight:"100vh"},children:[e.jsxs(Qc,{trigger:null,collapsible:!0,collapsed:t,style:{background:"#fff",borderRight:"1px solid #E5E7EB",boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1)",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflow:"hidden"},width:256,collapsedWidth:80,children:[e.jsxs("div",{style:{height:65,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:t?"center":"flex-start",borderBottom:"1px solid #E5E7EB"},children:[e.jsx("img",{src:"/logo.svg",alt:"Logo",style:{height:32,width:"auto"}}),!t&&e.jsx("span",{style:{marginLeft:12,fontSize:18,fontWeight:600,color:"#1890ff",whiteSpace:"nowrap"},children:"Exhibitor Portal"})]}),e.jsx(ks,{mode:"inline",selectedKeys:[x()],items:v,style:{border:"none",padding:t?"16px 0":"16px 8px",background:"transparent"},className:"main-nav-menu",inlineCollapsed:t})]}),e.jsxs(ve,{style:{marginLeft:t?80:256,transition:"all 0.2s"},children:[e.jsxs(Vc,{style:{padding:"0 24px",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 0 0 rgb(0 0 0 / 0.05)",zIndex:99},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(H,{type:"text",icon:t?e.jsx(po,{}):e.jsx(fo,{}),onClick:()=>n(!t),style:{fontSize:16}}),e.jsx("span",{style:{marginLeft:24,fontSize:20,fontWeight:600,color:"#111827"},children:I()})]}),e.jsx(ln,{menu:{items:p},placement:"bottomRight",children:e.jsxs(ae,{align:"center",style:{cursor:"pointer"},children:[e.jsx(Bt,{size:"small",style:{backgroundColor:"#5046e5"},children:((j=l==null?void 0:l.companyName)==null?void 0:j.charAt(0).toUpperCase())||"E"}),e.jsx("span",{style:{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:(l==null?void 0:l.companyName)||"Exhibitor"})]})})]}),e.jsx(Wc,{style:{margin:"24px 16px",padding:24,minHeight:280,background:"#fff",borderRadius:8,boxShadow:"0 1px 2px 0 rgb(0 0 0 / 0.05)"},children:s})]})]})},{Title:Mo,Text:cs,Paragraph:Hc}=ke,Is=Tt`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`,Yc=Tt`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`,Gc=Tt`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`,Xr=Tt`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`,Fo=Tt`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`,Kc=Tt`
  0% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(25deg) translateY(-260px) scaleY(1.2); opacity: 0; }
`,Xc=Tt`
  0% { transform: rotate(-25deg) translateY(260px) scaleY(1.2); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
`,Jc=Tt`
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
`,Zc=W.div`
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,ed=W.div`
  flex: 1;
  background-image: linear-gradient(135deg, rgba(35, 92, 169, 0.85), rgba(13, 71, 161, 0.9)), url('/exhibition-background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${Yc} 0.8s ease-out forwards;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`,td=W.div`
  position: absolute;
  width: 2px;
  height: 600px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, ${s=>.1+s.index%3*.05}), transparent);
  left: ${s=>20+s.index*10}%;
  top: 0;
  z-index: 1;
  opacity: 0;
  transform-origin: top;
  animation: ${s=>s.isHovered?Kc:Xc} ${s=>1.5+s.index*.2}s ease-out;
  animation-delay: ${s=>s.index*.1}s;
  animation-fill-mode: forwards;
`,sd=W.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
  animation: ${Gc} 0.8s ease-out forwards;
`,nd=W.div`
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`,rd=W.svg`
  width: 40px;
  height: 40px;
  
  .path {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    animation: ${Jc} 2s linear infinite;
  }
  
  .dot {
    fill: #1890ff;
    animation: ${Xr} 2s ease-in-out infinite;
  }
`,id=W.span`
  margin-left: 10px;
  animation: ${Is} 0.5s ease-out;
`,od=W.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`,ad=W.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`,ld=W.div`
  position: absolute;
  top: 25px;
  left: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  animation: ${Is} 0.8s ease-out forwards;
`,cd=W.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`,dd=W.img`
  width: 140px;
  height: auto;
  animation: ${Fo} 6s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
`;W.div({fontSize:"1.25rem",fontWeight:600,marginLeft:"14px",color:"#1a3e72",letterSpacing:"0.5px"});const ud=W.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${Is} 0.8s ease-out forwards;
`,hd=W.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  color: #ffffff;
  letter-spacing: 1px;
`,pd=W(Mo)`
  color: #ffffff !important;
  font-weight: 400 !important;
  text-align: center;
  margin-top: 0 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`,fd=W(Hc)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 500px;
  margin: 1.5rem auto 0;
`,md=W.div`
  width: 100%;
  max-width: 400px;
  animation: ${Is} 0.6s ease-out;
`,gd=W(se)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background-color: #f8f8f8;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background-color: white;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    transform: translateY(-2px);
  }
`,xd=W(se.Password)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background-color: #f8f8f8;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background-color: white;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    transform: translateY(-2px);
  }
`,yd=W(H)`
  height: 50px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.success {
    animation: ${Xr} 0.5s ease-in-out;
  }
`,bd=W.div`
  margin-bottom: 2rem;
  text-align: center;
`,Rs=W(Q.Item)`
  margin-bottom: 24px;
`,jd=W.div`
  margin-top: 8px;
`,vd=W.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`,wd=W(va)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }
  
  .ant-checkbox-inner:hover {
    border-color: #1890ff;
  }
  
  .ant-checkbox-wrapper:hover .ant-checkbox-inner {
    border-color: #1890ff;
  }
`,Sd=W.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(82, 196, 26, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: ${Is} 0.3s ease-out;
  
  svg {
    font-size: 80px;
    color: #52c41a;
    animation: ${Xr} 0.5s ease-in-out;
  }
`,wi=()=>e.jsxs(nd,{children:[e.jsxs(rd,{viewBox:"0 0 50 50",children:[e.jsx("path",{className:"path",d:"M10,10 L40,10 L40,40 L10,40 L10,10 Z M10,25 L40,25 M20,10 L20,40 M30,10 L30,40"}),e.jsx("circle",{className:"dot",cx:"15",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"25",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"35",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"15",cy:"35",r:"2"}),e.jsx("circle",{className:"dot",cx:"25",cy:"35",r:"2"}),e.jsx("circle",{className:"dot",cx:"35",cy:"35",r:"2"})]}),e.jsx(id,{children:"Signing in..."})]}),kd=W.div`
  position: absolute;
  width: ${s=>s.size}px;
  height: ${s=>s.size}px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  animation: ${Fo} ${s=>s.duration}s ease-in-out infinite;
  animation-delay: ${s=>s.delay}s;
  top: ${s=>s.top}%;
  left: ${s=>s.left}%;
  z-index: 1;
`,Ed=s=>{if(!s)return 0;const t=s.length>=8,n=/[A-Z]/.test(s),r=/[a-z]/.test(s),i=/\d/.test(s),o=/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s),l=[t,n,r,i,o];return l.filter(v=>v).length/l.length*100},Id=s=>s<30?"#ff4d4f":s<60?"#faad14":s<80?"#1890ff":"#52c41a",Cd=s=>s<30?"Weak":s<60?"Fair":s<80?"Good":"Strong",Nd=["At least 8 characters long","Contains uppercase letters","Contains lowercase letters","Contains numbers","Contains special characters"],Ad=()=>{const s=st(),t=xt(),[n,r]=g.useState(null),[i,o]=g.useState(!1),[l,x]=g.useState(!1),[v,p]=g.useState(""),[I,j]=g.useState(!1),f=Me(A=>A.auth.isAuthenticated),w=g.useRef(null),[T,R]=g.useState({x:0,y:0}),[P,S]=g.useState(!1),[_,N]=g.useState(!1),[a]=Q.useForm(),[c,h]=g.useState("/logo.png"),[k,m]=g.useState("EXHIBITION MANAGER");g.useEffect(()=>{const A=localStorage.getItem("cachedLogoUrl"),$=localStorage.getItem("logoTimestamp"),F=new Date().getTime();if(A&&$&&F-parseInt($)<36e5)h(A);else{const q=`${K.defaults.baseURL}/public/logo`;h(q),localStorage.setItem("cachedLogoUrl",q),localStorage.setItem("logoTimestamp",F.toString());const D=new Image;D.src=q}fetch(`${K.defaults.baseURL}/public/site-info`).then(q=>q.json()).then(q=>{q.siteName&&m(q.siteName)}).catch(q=>{console.error("Error fetching site info:",q)})},[]),g.useEffect(()=>{const A=localStorage.getItem("rememberedUser");if(A)try{const $=JSON.parse(A);a.setFieldsValue({username:$.username,password:$.password,remember:!0})}catch{localStorage.removeItem("rememberedUser")}},[a]),g.useEffect(()=>{const A=setTimeout(()=>{S(!0)},100);return()=>clearTimeout(A)},[]),g.useEffect(()=>{f&&s("/dashboard")},[f,s]),g.useEffect(()=>{const A=$=>{if(w.current){const F=w.current.getBoundingClientRect(),q=$.clientX-F.left,D=$.clientY-F.top;q>=0&&q<=F.width&&D>=0&&D<=F.height&&R({x:q,y:D})}};return window.addEventListener("mousemove",A),()=>{window.removeEventListener("mousemove",A)}},[]);const C=async A=>{var $;try{r(null),o(!0);const F=await bo.login({username:A.username,password:A.password}),{user:q,token:D}=F.data;if(!q||!D)throw new Error("Invalid response from server");A.remember?(localStorage.setItem("rememberedUser",JSON.stringify({username:A.username,password:A.password})),localStorage.setItem("rememberUser","true")):(localStorage.removeItem("rememberedUser"),localStorage.removeItem("rememberUser")),x(!0),setTimeout(()=>{t(wl({user:q,token:D})),te.success("Login successful!"),s("/dashboard")},1200)}catch(F){console.error("Login Error:",F),console.error("Response Data:",($=F.response)==null?void 0:$.data);let q="Authentication Error",D="Invalid username or password.";if(F.response&&typeof F.response=="object"){const{status:M,data:U}=F.response;M===401?(q="Invalid Credentials",D="The username or password you entered is incorrect."):M===403?(q="Access Denied",D="You do not have permission to access this resource."):M===400?(q="Invalid Request",D="Please check your input and try again."):M===500&&(q="Server Error",D="A server error occurred. Please try again later."),U&&typeof U=="object"&&U.message&&(D=U.message)}else F.request?(q="Connection Error",D="Unable to connect to the server. Please check your internet connection."):F.message&&(D=F.message);r({title:q,message:D})}finally{o(!1)}},d=Ed(v),u=Id(d),y=Cd(d),b=localStorage.getItem("rememberUser")==="true";if(f)return e.jsxs("div",{style:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",background:"#f0f5ff"},children:[e.jsx(wi,{}),e.jsx(cs,{style:{marginTop:16},children:"Redirecting to dashboard..."})]});const E=A=>{const $=[];for(let F=0;F<A;F++){const q=Math.random()*20+8,D=Math.random()*3,M=Math.random()*10+6,U=Math.random()*100,V=Math.random()*100;$.push(e.jsx(kd,{size:q,delay:D,duration:M,top:U,left:V,style:{transform:`translate(${T.x/50*(F%5-2)}px, ${T.y/50*(F%5-2)}px)`,opacity:_?0:1,transition:"opacity 0.5s ease-out",backgroundColor:"rgba(255, 255, 255, 0.07)"}},F))}return $},B=A=>{const $=[];for(let F=0;F<A;F++)$.push(e.jsx(td,{index:F,isHovered:_},F));return $},L=A=>{N(A)};return e.jsxs(Zc,{style:{opacity:P?1:0,transition:"opacity 0.3s ease-out"},children:[l&&e.jsx(Sd,{children:e.jsx(wa,{})}),e.jsxs(ed,{onMouseEnter:()=>L(!0),onMouseLeave:()=>L(!1),children:[e.jsx(ld,{children:e.jsx(cd,{children:e.jsx(dd,{src:c,alt:"Exhibition Manager Logo",onError:()=>h("/logo.png")})})}),e.jsxs(od,{ref:w,children:[E(12),B(8)]}),e.jsxs(ad,{children:[e.jsx(ud,{children:e.jsx(hd,{children:k})}),e.jsx(pd,{level:4,children:"Your complete solution for managing exhibitions, stalls, and exhibitors"}),e.jsx(fd,{children:"Create floor plans, manage exhibitors, handle bookings, and generate invoices - all in one platform."})]})]}),e.jsx(sd,{children:e.jsxs(md,{children:[e.jsxs(bd,{children:[e.jsx(Mo,{level:2,style:{marginBottom:"0.5rem"},children:"Admin Login"}),e.jsx(cs,{type:"secondary",children:"Enter your credentials to access the admin dashboard"})]}),n&&e.jsx(qe,{message:n.title,description:n.message,type:"error",showIcon:!0,style:{marginBottom:24,borderRadius:8,boxShadow:"0 2px 8px rgba(0, 0, 0, 0.05)"},action:e.jsx(H,{size:"small",type:"text",onClick:()=>r(null),children:"Dismiss"})}),e.jsxs(Q,{form:a,name:"login",initialValues:{remember:b},onFinish:C,layout:"vertical",children:[e.jsx(Rs,{name:"username",rules:[{required:!0,message:"Please input your username!"}],label:"Username",children:e.jsx(gd,{prefix:e.jsx(Ne,{style:{color:"#bfbfbf"}}),placeholder:"Enter your username",disabled:i,autoComplete:"username"})}),e.jsx(Rs,{name:"password",rules:[{required:!0,message:"Please input your password!"}],label:"Password",help:I&&e.jsxs(jd,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"},children:[e.jsx(cs,{type:"secondary",children:"Password Strength:"}),e.jsx(cs,{strong:!0,style:{color:u},children:y})]}),e.jsx(so,{percent:d,showInfo:!1,strokeColor:u,size:"small"}),e.jsx("div",{style:{marginTop:"8px"},children:e.jsx(St,{title:e.jsx("ul",{style:{paddingLeft:"20px",margin:"0"},children:Nd.map((A,$)=>e.jsx("li",{children:A},$))}),children:e.jsxs(cs,{type:"secondary",style:{display:"flex",alignItems:"center",cursor:"pointer"},children:[e.jsx(Ot,{style:{marginRight:"4px"}}),"Password requirements"]})})})]}),children:e.jsx(xd,{prefix:e.jsx(Kt,{style:{color:"#bfbfbf"}}),placeholder:"Enter your password",disabled:i,autoComplete:"current-password",onChange:A=>p(A.target.value),onFocus:()=>j(!0),onBlur:()=>j(!1)})}),e.jsx(vd,{children:e.jsx(Rs,{name:"remember",valuePropName:"checked",noStyle:!0,children:e.jsx(wd,{children:"Remember me"})})}),e.jsx(Rs,{children:i?e.jsx(wi,{}):e.jsx(yd,{type:"primary",htmlType:"submit",block:!0,className:l?"success":"",children:"Sign in"})})]})]})})]})},zo={getDashboardStats:async()=>{var s;try{const n=(await K.get("/users")).data||[],r=await K.get("/bookings"),i=((s=r.data)==null?void 0:s.data)||r.data||[],l=(await K.get("/exhibitions")).data||[],x=i.filter(I=>I.status==="confirmed"||I.status==="approved").reduce((I,j)=>I+(j.amount||0),0),v=[...i].sort((I,j)=>new Date(j.createdAt).getTime()-new Date(I.createdAt).getTime()).slice(0,5),p=[...n].sort((I,j)=>new Date(j.createdAt||0).getTime()-new Date(I.createdAt||0).getTime()).slice(0,5);return{userCount:n.length,bookingCount:i.length,totalRevenue:x,exhibitionCount:l.length,recentBookings:v,recentUsers:p}}catch(t){return console.error("Error fetching dashboard stats:",t),{userCount:0,bookingCount:0,totalRevenue:0,exhibitionCount:0,recentBookings:[],recentUsers:[]}}},getRecentActivity:async()=>{try{const{recentBookings:s,recentUsers:t}=await zo.getDashboardStats();return[...s.map(r=>({id:r._id,type:"booking",title:`New booking ${r._id.substring(0,8)}`,timestamp:r.createdAt,data:r})),...t.map(r=>({id:r._id,type:"user",title:`User ${r.username||"unknown"}`,timestamp:r.createdAt,data:r}))].sort((r,i)=>new Date(i.timestamp).getTime()-new Date(r.timestamp).getTime())}catch(s){return console.error("Error fetching recent activities:",s),[]}}},{Title:Rd,Text:Oe}=ke,Td=({title:s,value:t,icon:n,color:r,gradient:i,loading:o})=>e.jsxs(ie,{className:"stat-card",styles:{body:{padding:"24px"}},style:{background:i,border:"none",overflow:"hidden",position:"relative"},children:[e.jsx("div",{className:"stat-card-background"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",position:"relative",zIndex:1},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1},children:[e.jsx(Oe,{style:{fontSize:"14px",color:"rgba(255, 255, 255, 0.85)",marginBottom:"8px"},children:s}),e.jsx(Oe,{style:{fontSize:"28px",fontWeight:600,color:"#FFFFFF",marginBottom:"0"},children:o?e.jsx(et,{size:"small"}):t})]}),e.jsx("div",{className:"stat-card-icon",style:{color:"white"},children:n})]})]}),_d=()=>{const[s,t]=g.useState(!0),[n,r]=g.useState(0),[i,o]=g.useState(0),[l,x]=g.useState(0),[v,p]=g.useState(0),[I,j]=g.useState([]),[f,w]=g.useState({server:"Online",database:"Connected",lastBackup:"2 hours ago",systemLoad:"Normal"});g.useEffect(()=>{(async()=>{t(!0);try{const P=await zo.getDashboardStats();r(P.userCount),o(P.bookingCount),x(P.totalRevenue),p(P.exhibitionCount);const S=[];P.recentBookings.slice(0,3).forEach(_=>{S.push({id:_._id,icon:e.jsx(br,{}),color:"#2563EB",text:e.jsxs(Oe,{children:["New booking ",e.jsxs(Oe,{strong:!0,children:["#",_._id.substring(0,8)]})," received"]}),timestamp:new Date(_.createdAt).toLocaleString()})}),P.recentUsers.slice(0,2).forEach(_=>{S.push({id:_._id,icon:e.jsx(Ne,{}),color:"#7C3AED",text:e.jsxs(Oe,{children:["User ",e.jsxs(Oe,{strong:!0,children:["'",_.username,"'"]})," ",_.createdAt?"registered":"active"]}),timestamp:_.createdAt?new Date(_.createdAt).toLocaleString():"Recently"})}),S.sort((_,N)=>new Date(N.timestamp).getTime()-new Date(_.timestamp).getTime()),j(S)}catch(P){console.error("Error fetching dashboard data:",P)}finally{t(!1)}})()},[]);const T=[{title:"Total Users",value:n,icon:e.jsx(Ne,{}),color:"#7C3AED",gradient:"linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)"},{title:"Total Orders",value:i,icon:e.jsx(br,{}),color:"#2563EB",gradient:"linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"},{title:"Revenue",value:`₹${l.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`,icon:e.jsx(sn,{}),color:"#059669",gradient:"linear-gradient(135deg, #059669 0%, #047857 100%)"},{title:"Exhibitions",value:v,icon:e.jsx(Sa,{}),color:"#DC2626",gradient:"linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)"}];return e.jsxs("div",{className:"dashboard-container",children:[e.jsx(Rd,{level:4,style:{marginBottom:"24px"},children:"Dashboard"}),e.jsx(ge,{gutter:[24,24],children:T.map((R,P)=>e.jsx(G,{xs:24,sm:12,lg:6,children:e.jsx(Td,{...R,loading:s})},P))}),e.jsxs(ge,{gutter:[24,24],style:{marginTop:"24px"},children:[e.jsx(G,{xs:24,lg:12,children:e.jsx(ie,{title:"Recent Activity",className:"info-card",styles:{body:{padding:"20px"}},loading:s,children:I.length>0?e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:I.map(R=>e.jsxs("div",{className:"activity-item",children:[Ae.cloneElement(R.icon,{style:{color:R.color}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[R.text,e.jsx(Oe,{type:"secondary",style:{fontSize:"12px"},children:R.timestamp})]})]},R.id))}):e.jsx(Oe,{type:"secondary",children:"No recent activity found"})})}),e.jsx(G,{xs:24,lg:12,children:e.jsx(ie,{title:"System Status",className:"info-card",styles:{body:{padding:"20px"}},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{className:"status-item",children:[e.jsx("div",{className:"status-indicator online"}),e.jsxs(Oe,{children:["Server Status: ",e.jsx(Oe,{strong:!0,type:"success",children:f.server})]})]}),e.jsxs("div",{className:"status-item",children:[e.jsx("div",{className:"status-indicator connected"}),e.jsxs(Oe,{children:["Database Status: ",e.jsx(Oe,{strong:!0,type:"success",children:f.database})]})]}),e.jsxs("div",{className:"status-item",children:[e.jsx("div",{className:"status-indicator backup"}),e.jsxs(Oe,{children:["Last Backup: ",e.jsx(Oe,{strong:!0,children:f.lastBackup})]})]}),e.jsxs("div",{className:"status-item",children:[e.jsx("div",{className:"status-indicator normal"}),e.jsxs(Oe,{children:["System Load: ",e.jsx(Oe,{strong:!0,children:f.systemLoad})]})]})]})})})]})]})},Ke={getExhibitions:()=>ut.get("/public/exhibitions"),getExhibition:s=>ut.get(`/public/exhibitions/${s}`),getLayout:s=>ut.get(`/public/exhibitions/${s}/layout`),getStallDetails:(s,t)=>ut.get(`/public/exhibitions/${s}/stalls/${t}`),bookStall:(s,t,n)=>ut.post(`/public/exhibitions/${s}/stalls/${t}/book`,n),bookMultipleStalls:(s,t)=>ut.post(`/public/exhibitions/${s}/stalls/book-multiple`,t),searchExhibitors:s=>ut.get("/public/exhibitors/search",{params:{query:s}}),exhibitorBookStalls:s=>Lt.post(`/exhibitor-bookings/${s.exhibitionId}`,s),getExhibitorBookings:()=>Lt.get("/exhibitor-bookings/my-bookings"),getExhibitorBooking:s=>Lt.get(`/exhibitor-bookings/${s}`),cancelExhibitorBooking:s=>Lt.patch(`/exhibitor-bookings/${s}/cancel`),getExhibitorBookingInvoice:s=>Lt.get(`/exhibitor-bookings/${s}/invoice`)},{Title:Pd,Text:yt,Paragraph:nf}=ke,Dd=()=>{const[s,t]=g.useState([]),[n,r]=g.useState(!0),[i,o]=g.useState(null),[l,x]=g.useState([]),[v,p]=g.useState(!0),I=Me(a=>a.exhibitorAuth.exhibitor),j=st();g.useEffect(()=>{f(),w()},[]);const f=async()=>{try{r(!0),o(null);const a=await Ke.getExhibitorBookings();t(a.data||[])}catch(a){console.error("Failed to fetch bookings:",a),o("Unable to load your bookings at this time. Please try again later.")}finally{r(!1)}},w=async()=>{try{p(!0);const a=await Ke.getExhibitions(),c=$e(),h=(a.data||[]).filter(k=>k.isActive&&$e(k.endDate).isAfter(c)).slice(0,3);x(h)}catch(a){console.error("Failed to fetch upcoming exhibitions:",a)}finally{p(!1)}},T=s.filter(a=>a.status==="approved").length,R=s.filter(a=>a.status==="pending").length;s.filter(a=>a.status==="rejected").length;const P=s.filter(a=>a.status==="confirmed").length,S=a=>{switch(a){case"approved":return e.jsxs(ne,{color:"success",children:[e.jsx(Qe,{})," Approved"]});case"pending":return e.jsxs(ne,{color:"warning",children:[e.jsx(mt,{})," Pending"]});case"rejected":return e.jsxs(ne,{color:"error",children:[e.jsx(js,{})," Rejected"]});case"confirmed":return e.jsxs(ne,{color:"blue",children:[e.jsx(Qe,{})," Confirmed"]});case"cancelled":return e.jsxs(ne,{color:"default",children:[e.jsx(js,{})," Cancelled"]});default:return e.jsx(ne,{children:"Unknown"})}},_=a=>{j(`/exhibitor/invoice/${a}`)},N=(a,c)=>a.status===c;return e.jsxs("div",{children:[e.jsxs(Pd,{level:2,children:["Welcome, ",(I==null?void 0:I.companyName)||"Exhibitor"]}),e.jsx(yt,{type:"secondary",children:"Here's an overview of your exhibition activities"}),i&&e.jsx(qe,{message:"Error",description:i,type:"error",showIcon:!0,style:{marginTop:24,marginBottom:24}}),R>0&&e.jsx(qe,{message:"Pending Approvals",description:`You have ${R} booking(s) waiting for approval.`,type:"info",showIcon:!0,style:{marginTop:24,marginBottom:24},action:e.jsx(H,{size:"small",type:"primary",onClick:()=>j("/exhibitor/bookings"),children:"View Bookings"})}),e.jsxs(ge,{gutter:[24,24],style:{marginTop:24},children:[e.jsx(G,{xs:24,sm:12,md:6,children:e.jsx(ie,{children:e.jsx(Nt,{title:"Total Bookings",value:n?"-":s.length,prefix:e.jsx(Ze,{}),loading:n})})}),e.jsx(G,{xs:24,sm:12,md:6,children:e.jsx(ie,{children:e.jsx(Nt,{title:"Confirmed",value:n?"-":P,valueStyle:{color:"#1890ff"},prefix:e.jsx(Qe,{}),loading:n})})}),e.jsx(G,{xs:24,sm:12,md:6,children:e.jsx(ie,{children:e.jsx(Nt,{title:"Approved",value:n?"-":T,valueStyle:{color:"#3f8600"},prefix:e.jsx(Qe,{}),loading:n})})}),e.jsx(G,{xs:24,sm:12,md:6,children:e.jsx(ie,{children:e.jsx(Nt,{title:"Pending",value:n?"-":R,valueStyle:{color:"#faad14"},prefix:e.jsx(mt,{}),loading:n})})})]}),e.jsx(ie,{title:"Recent Bookings",extra:e.jsx(Ge,{to:"/exhibitor/bookings",children:"View All"}),style:{marginTop:24},loading:n,children:n?e.jsx(wt,{active:!0,paragraph:{rows:3}}):s.length>0?e.jsx(vt,{dataSource:s.slice(0,5),renderItem:a=>{var c,h,k,m,C;return e.jsxs(vt.Item,{actions:[e.jsx(H,{type:"link",onClick:()=>j(`/exhibitor/bookings/${a._id}`),children:"View Details"},"view"),N(a,"approved")||N(a,"confirmed")?e.jsx(H,{type:"link",icon:e.jsx(go,{}),onClick:()=>_(a._id),children:"Invoice"},"invoice"):null].filter(Boolean),children:[e.jsx(vt.Item.Meta,{title:e.jsxs("div",{children:[e.jsx(yt,{strong:!0,children:((c=a.exhibitionId)==null?void 0:c.name)||"Exhibition"}),e.jsxs(yt,{type:"secondary",style:{marginLeft:12},children:["Stall: ",((h=a.stallIds)==null?void 0:h.map(d=>d.number).join(", "))||"N/A"]})]}),description:e.jsxs(ae,{direction:"vertical",size:1,children:[e.jsxs("div",{children:[e.jsxs(yt,{children:["Booked on: ",$e(a.createdAt).format("MMM D, YYYY")]}),e.jsx(Be,{type:"vertical"}),e.jsxs(yt,{children:["Amount: ₹",((k=a.amount)==null?void 0:k.toLocaleString())||"N/A"]})]}),e.jsx("div",{children:e.jsxs(yt,{children:["Exhibition date: ",$e((m=a.exhibitionId)==null?void 0:m.startDate).format("MMM D")," - ",$e((C=a.exhibitionId)==null?void 0:C.endDate).format("MMM D, YYYY")]})})]})}),S(a.status)]})}}):e.jsx(Ce,{description:"No bookings found",image:Ce.PRESENTED_IMAGE_SIMPLE})}),e.jsx(ie,{title:"Upcoming Exhibitions",style:{marginTop:24},loading:v,extra:e.jsx(Ge,{to:"/exhibitions",children:"View All"}),children:v?e.jsx(wt,{active:!0,paragraph:{rows:3}}):l.length>0?e.jsx(vt,{dataSource:l,renderItem:a=>e.jsx(vt.Item,{actions:[e.jsx(H,{type:"primary",onClick:()=>j(`/exhibitions/${a._id}/layout`),children:"Book Stall"},"book")],children:e.jsx(vt.Item.Meta,{title:a.name,description:e.jsxs(ae,{direction:"vertical",size:1,children:[e.jsx(yt,{children:a.venue}),e.jsxs(yt,{type:"secondary",children:[$e(a.startDate).format("MMM D")," - ",$e(a.endDate).format("MMM D, YYYY")]})]})})})}):e.jsxs("div",{style:{textAlign:"center",padding:"20px 0"},children:[e.jsx(xs,{style:{fontSize:48,color:"#1890ff",marginBottom:16}}),e.jsxs("div",{children:[e.jsx(yt,{children:"No upcoming exhibitions at the moment"}),e.jsx("div",{style:{marginTop:16},children:e.jsx(Ge,{to:"/exhibitions",children:e.jsx(H,{type:"primary",children:"Browse All Exhibitions"})})})]})]})}),e.jsx(ge,{gutter:[24,24],style:{marginTop:24},children:e.jsx(G,{span:24,children:e.jsx(ie,{title:"Quick Actions",children:e.jsxs(ge,{gutter:[16,16],children:[e.jsx(G,{xs:24,sm:12,md:8,lg:6,children:e.jsx(H,{type:"primary",icon:e.jsx(Ze,{}),block:!0,onClick:()=>j("/exhibitions"),children:"Book New Stall"})}),e.jsx(G,{xs:24,sm:12,md:8,lg:6,children:e.jsx(H,{icon:e.jsx(xs,{}),block:!0,onClick:()=>j("/exhibitor/bookings"),children:"View All Bookings"})}),e.jsx(G,{xs:24,sm:12,md:8,lg:6,children:e.jsx(H,{icon:e.jsx(sn,{}),block:!0,onClick:()=>j("/exhibitor/bookings?status=approved"),children:"Pending Payments"})}),e.jsx(G,{xs:24,sm:12,md:8,lg:6,children:e.jsx(H,{icon:e.jsx(Ne,{}),block:!0,onClick:()=>j("/exhibitor/profile"),children:"Update Profile"})})]})})})})]})},Rr=Ye.create({baseURL:ht}),Vt=Ye.create({baseURL:ht});Rr.interceptors.request.use(s=>{const t=localStorage.getItem("exhibitor_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));const $t=Ye.create({baseURL:ht});$t.interceptors.request.use(s=>{const t=localStorage.getItem("token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));const at={sendRegistrationOTP:async s=>await Vt.post("/exhibitors/send-otp",{email:s}),verifyOTP:async s=>await Vt.post("/exhibitors/verify-otp",s),register:async s=>await Vt.post("/exhibitors/register",s),login:async s=>await Vt.post("/exhibitors/login",s),requestPasswordReset:async s=>await Vt.post("/exhibitors/forgot-password",s),resetPassword:async s=>await Vt.post("/exhibitors/reset-password",s),getProfile:async()=>await Rr.get("/exhibitors/profile"),updateProfile:async s=>await Rr.put("/exhibitors/profile",s),getExhibitors:async()=>await $t.get("/exhibitors/admin/exhibitors"),getExhibitor:async s=>await $t.get(`/exhibitors/admin/exhibitors/${s}`),createExhibitor:async s=>await $t.post("/exhibitors/admin/exhibitors",s),updateStatus:async(s,t,n)=>await $t.put(`/exhibitors/admin/exhibitors/${s}/status`,{status:t,rejectionReason:n}),updateExhibitor:async(s,t)=>await $t.put(`/exhibitors/admin/exhibitors/${s}`,t),deleteExhibitor:async s=>await $t.delete(`/exhibitors/admin/exhibitors/${s}`)},{Step:kn}=Es,{Text:$d}=ke,Ld=({loginModalVisible:s,registerModalVisible:t,setRegisterModalVisible:n,setExhibitorCredentials:r,onForgotPassword:i})=>{const o=xt(),l=Me(D=>D.exhibitorAuth),[x,v]=g.useState(!1),[p,I]=g.useState(null),[j]=Q.useForm(),[f]=Q.useForm(),[w]=Q.useForm(),[T,R]=g.useState(0),[P,S]=g.useState(""),[_,N]=g.useState(!1),[a,c]=g.useState(!1),[h,k]=g.useState(0),[m,C]=g.useState({companyName:"",contactPerson:""}),d=g.useRef(null),u=async D=>{var M,U,V,O,X,Y,pe,fe,ue;try{I(null),v(!0);const re=await at.login(D),{exhibitor:me,token:Fe}=re.data;if(!me||!Fe)throw new Error("Invalid response from server");r({exhibitor:me,token:Fe}),o(As()),j.resetFields(),te.success("Login successful!")}catch(re){if(((M=re.response)==null?void 0:M.status)===403){const me=(V=(U=re.response)==null?void 0:U.data)==null?void 0:V.status;if(me==="pending")I("Your account is pending approval. You will be able to log in after admin approval.");else if(me==="rejected"){const Fe=(X=(O=re.response)==null?void 0:O.data)==null?void 0:X.rejectionReason;I(Fe?`Your registration has been rejected. Reason: ${Fe}`:"Your registration has been rejected. Please contact the administrator for more details.")}else I(((pe=(Y=re.response)==null?void 0:Y.data)==null?void 0:pe.message)||"Access denied. Please contact administrator.")}else I(((ue=(fe=re.response)==null?void 0:fe.data)==null?void 0:ue.message)||"Login failed. Please try again.")}finally{v(!1)}},y=async()=>{var D,M;try{const U=await f.validateFields(["email","companyName","contactPerson"]);v(!0),I(null),S(U.email),C({companyName:U.companyName,contactPerson:U.contactPerson}),await at.sendRegistrationOTP(U.email),N(!0),te.success("OTP sent to your email address"),k(60),b(),R(1)}catch(U){if(U.name==="ValidationError")return;const V=((M=(D=U.response)==null?void 0:D.data)==null?void 0:M.message)||"Failed to send OTP. Please try again.";I(V),te.error(V)}finally{v(!1)}},b=()=>{d.current&&clearInterval(d.current),d.current=setInterval(()=>{k(D=>D<=1?(d.current&&clearInterval(d.current),0):D-1)},1e3)},E=async()=>{var D,M;try{v(!0),I(null),await at.sendRegistrationOTP(P),te.success("New OTP sent to your email address"),k(60),b()}catch(U){const V=((M=(D=U.response)==null?void 0:D.data)==null?void 0:M.message)||"Failed to resend OTP. Please try again.";I(V),te.error(V)}finally{v(!1)}},B=async D=>{var M,U;try{v(!0),I(null);const V={email:P,otp:D.otp};await at.verifyOTP(V),c(!0),te.success("Email verified successfully"),d.current&&clearInterval(d.current),R(2)}catch(V){const O=((U=(M=V.response)==null?void 0:M.data)==null?void 0:U.message)||"Invalid OTP. Please try again.";I(O),te.error(O)}finally{v(!1)}},L=()=>{N(!1),c(!1),S(""),k(0),R(0),C({companyName:"",contactPerson:""}),d.current&&clearInterval(d.current),w.resetFields()},A=async D=>{var M,U,V;try{if(I(null),v(!0),!a){I("Email verification required");return}const{confirmPassword:O,...X}=D,Y={...X,email:P,companyName:m.companyName,contactPerson:m.contactPerson};console.log("Sending registration data:",Y);const pe=await at.register(Y);te.success("Registration successful! You can log in and book a stall only after admin approval."),n(!1),f.resetFields(),L(),setTimeout(()=>{o(Ft(void 0))},500)}catch(O){console.error("Registration error:",O),console.error("Response data:",(M=O.response)==null?void 0:M.data);const X=((V=(U=O.response)==null?void 0:U.data)==null?void 0:V.message)||"Registration failed. Please try again.";I(X),te.error(X)}finally{v(!1)}};Ae.useEffect(()=>()=>{d.current&&clearInterval(d.current)},[]);const $=()=>{n(!1),I(null),f.resetFields(),L()},F=()=>{o(As()),n(!0),j.resetFields()},q=()=>{n(!1),o(Ft(void 0)),f.resetFields()};return e.jsxs(e.Fragment,{children:[e.jsxs(tt,{title:"Exhibitor Login",open:s,onCancel:()=>{o(As()),I(null),j.resetFields()},footer:null,width:400,children:[l.loginContext==="stall-booking"&&e.jsx(qe,{message:"Login Required for Stall Booking",description:"Please log in to your exhibitor account to select and book stalls for this exhibition.",type:"info",showIcon:!0,style:{marginBottom:16}}),p&&e.jsx(qe,{message:p,type:"error",showIcon:!0,style:{marginBottom:16}}),e.jsxs(Q,{form:j,name:"exhibitor_login_modal",onFinish:u,layout:"vertical",children:[e.jsx(Q.Item,{name:"email",rules:[{required:!0,message:"Please input your email!"},{type:"email",message:"Please enter a valid email address!"}],children:e.jsx(se,{prefix:e.jsx(es,{}),placeholder:"Email",size:"large",disabled:x})}),e.jsx(Q.Item,{name:"password",rules:[{required:!0,message:"Please input your password!"}],children:e.jsx(se.Password,{prefix:e.jsx(Kt,{}),placeholder:"Password",size:"large",disabled:x})}),e.jsxs(Q.Item,{children:[e.jsx("div",{style:{textAlign:"right",marginBottom:10},children:e.jsx(H,{type:"link",onClick:()=>{o(As()),i()},style:{padding:0},children:"Forgot password?"})}),e.jsx(H,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:x,children:"Login"})]})]}),e.jsx(Be,{children:e.jsx("span",{style:{fontSize:"14px",color:"#888"},children:"Don't have an account?"})}),e.jsx(H,{type:"default",block:!0,onClick:F,children:"Register as Exhibitor"})]}),e.jsxs(tt,{title:"Exhibitor Registration",open:t,onCancel:$,footer:null,width:500,children:[e.jsxs(Es,{current:T,style:{marginBottom:24},children:[e.jsx(kn,{title:"Basic Info"}),e.jsx(kn,{title:"Verify Email"}),e.jsx(kn,{title:"Complete"})]}),p&&e.jsx(qe,{message:p,type:"error",showIcon:!0,style:{marginBottom:16}}),T===0&&e.jsxs(e.Fragment,{children:[e.jsx(qe,{message:"Email Verification Required",description:"We'll send a one-time password (OTP) to verify your email before completing registration.",type:"info",showIcon:!0,style:{marginBottom:16}}),e.jsxs(Q,{form:f,name:"exhibitor_register_step1",layout:"vertical",children:[e.jsx(Q.Item,{name:"companyName",rules:[{required:!0,message:"Please input your company name!"}],children:e.jsx(se,{prefix:e.jsx(Or,{}),placeholder:"Company Name",size:"large",disabled:x})}),e.jsx(Q.Item,{name:"contactPerson",rules:[{required:!0,message:"Please input contact person name!"}],children:e.jsx(se,{prefix:e.jsx(Ne,{}),placeholder:"Contact Person",size:"large",disabled:x})}),e.jsx(Q.Item,{name:"email",rules:[{required:!0,message:"Please input your email!"},{type:"email",message:"Please enter a valid email address!"}],children:e.jsx(se,{prefix:e.jsx(es,{}),placeholder:"Email",size:"large",disabled:x})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",onClick:y,block:!0,size:"large",loading:x,children:"Continue & Verify Email"})})]}),e.jsx(Be,{children:e.jsx("span",{style:{fontSize:"14px",color:"#888"},children:"Already have an account?"})}),e.jsx(H,{type:"default",block:!0,onClick:q,children:"Login"})]}),T===1&&e.jsxs(e.Fragment,{children:[e.jsx(qe,{message:"Email Verification",description:`We've sent a verification code to ${P}. Please enter it below to continue.`,type:"info",showIcon:!0,style:{marginBottom:16}}),e.jsxs(Q,{form:w,name:"verify_otp",onFinish:B,layout:"vertical",children:[e.jsx(Q.Item,{name:"otp",rules:[{required:!0,message:"Please enter the verification code!"}],children:e.jsx(se,{size:"large",placeholder:"Enter OTP",maxLength:6,style:{textAlign:"center",letterSpacing:"8px",fontSize:"20px"},disabled:x})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:x,children:"Verify & Continue"})})]}),e.jsxs(ge,{justify:"space-between",align:"middle",style:{marginTop:16},children:[e.jsx(G,{children:e.jsx(H,{type:"link",disabled:h>0||x,onClick:E,children:"Resend Code"})}),e.jsx(G,{children:h>0&&e.jsxs($d,{type:"secondary",children:["Resend in ",h,"s"]})})]}),e.jsx(Be,{}),e.jsx(H,{type:"default",block:!0,onClick:()=>R(0),children:"Back"})]}),T===2&&e.jsxs(e.Fragment,{children:[e.jsx(qe,{message:"Email Verified Successfully",description:"Please complete your registration by providing the remaining details.",type:"success",showIcon:!0,style:{marginBottom:16}}),e.jsxs(Q,{form:f,name:"exhibitor_register_step2",onFinish:A,layout:"vertical",children:[e.jsx(Q.Item,{name:"phone",rules:[{required:!0,message:"Please input your phone number!"}],children:e.jsx(se,{prefix:e.jsx(qr,{}),placeholder:"Phone Number",size:"large",disabled:x})}),e.jsx(Q.Item,{name:"address",rules:[{required:!0,message:"Please input your address!"}],children:e.jsx(se.TextArea,{placeholder:"Address",rows:3,disabled:x})}),e.jsx(Q.Item,{name:"password",rules:[{required:!0,message:"Please input your password!"},{min:6,message:"Password must be at least 6 characters!"}],children:e.jsx(se.Password,{prefix:e.jsx(Kt,{}),placeholder:"Password",size:"large",disabled:x})}),e.jsx(Q.Item,{name:"confirmPassword",dependencies:["password"],rules:[{required:!0,message:"Please confirm your password!"},({getFieldValue:D})=>({validator(M,U){return!U||D("password")===U?Promise.resolve():Promise.reject(new Error("The two passwords do not match!"))}})],children:e.jsx(se.Password,{prefix:e.jsx(Kt,{}),placeholder:"Confirm Password",size:"large",disabled:x})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:x,children:"Complete Registration"})})]})]})]})]})},{Step:rf}=Es,{Text:of}=ke,Bd=({visible:s})=>{const t=xt(),[n,r]=g.useState(!1),[i,o]=g.useState(null),[l,x]=g.useState(0),[v,p]=g.useState(""),[I,j]=g.useState(!1),[f,w]=g.useState(0),T=Q.useForm()[0],R=Q.useForm()[0],P=Q.useForm()[0],S=g.useRef(null),_=async d=>{var u,y;try{r(!0),o(null);const b=await at.requestPasswordReset(d);p(d.email),j(!0),x(1),te.success("Password reset code sent to your email"),w(60),N()}catch(b){const E=((y=(u=b.response)==null?void 0:u.data)==null?void 0:y.message)||"Failed to send password reset code. Please try again.";o(E)}finally{r(!1)}},N=()=>{S.current&&clearInterval(S.current),S.current=setInterval(()=>{w(d=>d<=1?(S.current&&clearInterval(S.current),0):d-1)},1e3)},a=async()=>{var d,u;try{r(!0),o(null),await at.requestPasswordReset({email:v}),te.success("New password reset code sent to your email"),w(60),N()}catch(y){const b=((u=(d=y.response)==null?void 0:d.data)==null?void 0:u.message)||"Failed to resend password reset code. Please try again.";o(b)}finally{r(!1)}},c=async d=>{var u,y;try{r(!0),o(null),x(2),S.current&&clearInterval(S.current)}catch(b){const E=((y=(u=b.response)==null?void 0:u.data)==null?void 0:y.message)||"Invalid code. Please try again.";o(E)}finally{r(!1)}},h=async d=>{var u,y;try{r(!0),o(null);const b=R.getFieldValue("otp"),E={email:v,otp:b,newPassword:d.newPassword};await at.resetPassword(E),te.success("Password reset successful. You can now log in with your new password."),k(),t(Sn()),t(Ft())}catch(b){const E=((y=(u=b.response)==null?void 0:u.data)==null?void 0:y.message)||"Failed to reset password. Please try again.";o(E)}finally{r(!1)}},k=()=>{x(0),p(""),j(!1),w(0),S.current&&clearInterval(S.current),T.resetFields(),R.resetFields(),P.resetFields()},m=()=>{k(),t(Sn())},C=()=>{k(),t(Sn()),t(Ft())};return Ae.useEffect(()=>()=>{S.current&&clearInterval(S.current)},[]),e.jsxs(tt,{title:"Forgot Password",open:s,onCancel:m,footer:null,width:400,children:[i&&e.jsx(qe,{message:i,type:"error",style:{marginBottom:16}}),e.jsx(Es,{current:l,size:"small",style:{marginBottom:20},items:[{title:"Email"},{title:"Verify"},{title:"Reset"}]}),l===0&&e.jsxs(Q,{form:T,onFinish:_,layout:"vertical",children:[e.jsx(Q.Item,{name:"email",label:"Email",rules:[{required:!0,message:"Please enter your email"},{type:"email",message:"Please enter a valid email"}],children:e.jsx(se,{prefix:e.jsx(es,{}),placeholder:"Email"})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",block:!0,loading:n,children:"Send Reset Code"})}),e.jsx(Be,{style:{margin:"12px 0"},children:e.jsx("span",{style:{fontSize:"12px",color:"#8c8c8c"},children:"Remember your password?"})}),e.jsx(H,{type:"link",onClick:C,block:!0,children:"Back to Login"})]}),l===1&&e.jsxs(Q,{form:R,onFinish:c,layout:"vertical",children:[e.jsxs("p",{children:["We've sent a verification code to ",e.jsx("strong",{children:v}),". Please check your email and enter the code below."]}),e.jsx(Q.Item,{name:"otp",rules:[{required:!0,message:"Please enter the verification code"},{pattern:/^\d{6}$/,message:"Please enter a valid 6-digit code"}],children:e.jsx(se,{placeholder:"Enter 6-digit code",maxLength:6,style:{letterSpacing:"0.5em",textAlign:"center",fontWeight:"bold"}})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",block:!0,loading:n,children:"Verify Code"})}),e.jsx("div",{style:{textAlign:"center",marginTop:8},children:f>0?e.jsxs(ke.Text,{type:"secondary",children:["Resend code in ",f,"s"]}):e.jsx(H,{type:"link",onClick:a,disabled:n,children:"Resend Code"})}),e.jsx(Be,{style:{margin:"12px 0"},children:e.jsx("span",{style:{fontSize:"12px",color:"#8c8c8c"},children:"Back to beginning"})}),e.jsx(H,{type:"link",onClick:()=>{x(0),S.current&&(clearInterval(S.current),w(0))},block:!0,children:"Change Email"})]}),l===2&&e.jsxs(Q,{form:P,onFinish:h,layout:"vertical",children:[e.jsx(Q.Item,{name:"newPassword",label:"New Password",rules:[{required:!0,message:"Please enter your new password"},{min:6,message:"Password must be at least 6 characters"}],hasFeedback:!0,children:e.jsx(se.Password,{prefix:e.jsx(Kt,{}),placeholder:"New Password"})}),e.jsx(Q.Item,{name:"confirmPassword",label:"Confirm Password",dependencies:["newPassword"],hasFeedback:!0,rules:[{required:!0,message:"Please confirm your password"},({getFieldValue:d})=>({validator(u,y){return!y||d("newPassword")===y?Promise.resolve():Promise.reject(new Error("The two passwords do not match"))}})],children:e.jsx(se.Password,{prefix:e.jsx(Kt,{}),placeholder:"Confirm Password"})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",block:!0,loading:n,children:"Reset Password"})})]})]})},{Header:Md}=ve,Fd=W(Md)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`,zd=W.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`,Od=W.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: flex-start;
  }
`,qd=W.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`,Ud=W.img`
  height: auto;
  width: 100%;
  max-width: 140px;
  max-height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 120px;
  }
`,Si=W(Bt)`
  background-color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #40a9ff;
    border-color: #e6f7ff;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  }
`,ki=W(ks)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  
  .ant-dropdown-menu-item {
    padding: 10px 16px;
    transition: all 0.2s;
    
    &:hover {
      background-color: #fafafa;
    }
  }
`,Vd=W(ks)`
  border: none;
  display: flex;
  justify-content: center;
  font-size: 15px;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`,Qd=W(H)`
  display: none;
  font-size: 18px;
  background: transparent;
  border: none;
  padding: 8px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  
  &:hover {
    transform: rotate(90deg);
    color: #4158D0;
  }
  
  &:active {
    transform: scale(0.9) rotate(90deg);
  }
`,Wd=W.div`
  .ant-drawer-header {
    padding: 16px 24px;
  }
  
  .ant-drawer-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .ant-drawer-body {
    padding: 24px 16px;
  }
  
  .ant-drawer-content-wrapper {
    max-width: 80%;
  }
`,Hd=W(Ge)`
  display: block;
  padding: 16px 8px;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    color: #1890ff;
  }
`,Ts=W(H)`
  width: 100%;
  margin-bottom: 12px;
  height: auto;
  padding: 12px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`,Yd=W.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`,Gd=W.span`
  margin-right: 8px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`,lt=()=>{var m;const s=st(),t=xt(),[n,r]=g.useState(!1),[i,o]=g.useState(!1),[l,x]=g.useState(!1),[v,p]=g.useState("/logo.png"),[I,j]=g.useState("Exhibition Manager"),f=Me(C=>C.exhibitorAuth),{exhibitor:w,isAuthenticated:T,showLoginModal:R,showForgotPasswordModal:P}=f;g.useEffect(()=>{const C=localStorage.getItem("cachedLogoUrl"),d=localStorage.getItem("logoTimestamp"),u=new Date().getTime();if(C&&d&&u-parseInt(d)<36e5)p(C);else{const y=`${K.defaults.baseURL}/public/logo`;p(y),localStorage.setItem("cachedLogoUrl",y),localStorage.setItem("logoTimestamp",u.toString());const b=new Image;b.src=y}fetch(`${K.defaults.baseURL}/public/site-info`).then(y=>y.json()).then(y=>{y.siteName&&j(y.siteName)}).catch(y=>{console.error("Error fetching site info:",y)})},[]),g.useEffect(()=>(te.config({top:84,duration:3,maxCount:1}),()=>{te.destroy()}),[]);const S=()=>{t(Bo()),te.success("Successfully logged out"),s("/"),r(!1),o(!1)},_=()=>{t(Ft(void 0)),r(!1),o(!1)},N=()=>{x(!0),r(!1),o(!1)},a=()=>{t(qc())},c=[{key:"exhibitions",label:"Exhibitions",path:"/exhibitions"},{key:"about",label:"About",path:"/about"},{key:"contact",label:"Contact",path:"/contact"}],h=e.jsx(ki,{items:[{key:"exhibitor-login",icon:e.jsx(li,{}),label:e.jsx("a",{onClick:_,children:"Exhibitor Login"})},{key:"exhibitor-register",icon:e.jsx(xr,{}),label:e.jsx("a",{onClick:N,children:"Register as Exhibitor"})}]}),k=e.jsx(ki,{items:[{key:"exhibitor-dashboard",icon:e.jsx(tn,{}),label:e.jsx(Ge,{to:"/exhibitor/dashboard",children:"Dashboard"})},{key:"exhibitor-profile",icon:e.jsx(Ne,{}),label:e.jsx(Ge,{to:"/exhibitor/profile",children:"My Profile"})},{key:"exhibitor-bookings",icon:e.jsx(Ze,{}),label:e.jsx(Ge,{to:"/exhibitor/bookings",children:"My Bookings"})},{key:"divider",type:"divider"},{key:"exhibitor-logout",icon:e.jsx(en,{}),label:e.jsx("a",{onClick:S,children:"Logout"})}]});return e.jsxs(e.Fragment,{children:[e.jsx(Fd,{children:e.jsxs(zd,{children:[e.jsx(Od,{children:e.jsx(Ge,{to:"/",style:{display:"flex",alignItems:"center",textDecoration:"none"},children:e.jsx(qd,{children:e.jsx(Ud,{src:v,alt:"Logo",onError:()=>p("/logo.png")})})})}),e.jsx(Vd,{mode:"horizontal",selectedKeys:[],style:{flex:1,display:"flex",justifyContent:"center"},items:c.map(C=>({key:C.key,label:e.jsx(Ge,{to:C.path,children:C.label})}))}),e.jsx(Yd,{children:e.jsx(ln,{overlay:f.isAuthenticated?k:h,trigger:["click"],placement:"bottomRight",open:n,onOpenChange:r,overlayStyle:{minWidth:"150px",marginTop:"10px"},children:f.isAuthenticated?e.jsxs(ae,{style:{cursor:"pointer"},children:[e.jsx(Gd,{children:((m=f.exhibitor)==null?void 0:m.companyName)||"Exhibitor"}),e.jsx(Si,{icon:e.jsx(Ne,{}),size:"large"})]}):e.jsx(Si,{icon:e.jsx(Ne,{}),size:"large"})})}),e.jsx(Qd,{icon:e.jsx(Za,{}),onClick:()=>o(!0)})]})}),e.jsx(Wd,{children:e.jsxs(ka,{title:"Exhibition Management System",placement:"right",onClose:()=>o(!1),open:i,width:280,closeIcon:e.jsx("span",{style:{fontSize:"16px"},children:"×"}),children:[e.jsx("div",{style:{marginBottom:24},children:c.map(C=>e.jsx(Hd,{to:C.path,onClick:()=>o(!1),children:C.label},C.key))}),e.jsx("div",{style:{marginTop:40},children:f.isAuthenticated?e.jsxs(e.Fragment,{children:[e.jsx(Ts,{type:"primary",icon:e.jsx(tn,{}),onClick:()=>{s("/exhibitor/dashboard"),o(!1)},children:"Dashboard"}),e.jsx(Ts,{type:"default",icon:e.jsx(en,{}),onClick:S,children:"Logout"})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ts,{type:"primary",style:{background:"#7E57C2",borderColor:"#7E57C2"},icon:e.jsx(li,{}),onClick:()=>{_(),o(!1)},children:"Exhibitor Login"}),e.jsx(Ts,{type:"default",icon:e.jsx(xr,{}),onClick:()=>{N(),o(!1)},children:"Register as Exhibitor"})]})})]})}),e.jsx(Ld,{loginModalVisible:R,registerModalVisible:l,setRegisterModalVisible:x,setExhibitorCredentials:C=>t(Ar(C)),onForgotPassword:a}),e.jsx(Bd,{visible:P})]})},{Footer:Kd}=ve,{Title:Xd,Paragraph:Jd,Text:Zd}=ke,eu=W(Kd)`
  background: linear-gradient(to right, #242a38, #1a1f2c);
  padding: 60px 0 20px;
  color: rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`,tu=W.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,_s=W(Xd)`
  color: white !important;
  font-size: 18px !important;
  margin-bottom: 20px !important;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #4158D0, #C850C0);
  }
`,su=W.div`
  margin-bottom: 20px;
`,nu=W.img`
  height: auto;
  width: 100%;
  max-width: 160px;
  margin-bottom: 16px;
`,dt=W(Ge)`
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`,En=W.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`,In=W.div`
  margin-right: 10px;
  color: #4158D0;
`,Ps=W.a`
  font-size: 24px;
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateY(-3px);
  }
`,ru=W(se)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #4158D0;
    box-shadow: 0 0 0 2px rgba(65, 88, 208, 0.2);
  }
`,iu=W(H)`
  background: linear-gradient(90deg, #4158D0, #C850C0);
  border: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`,ou=W(Zd)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  font-size: 14px;
`,au=W(Be)`
  background: rgba(255, 255, 255, 0.1);
  margin: 30px 0;
`,Oo=()=>{const[s,t]=g.useState("/logo.png"),[n,r]=g.useState("Exhibition Manager"),i=new Date().getFullYear();return g.useEffect(()=>{const o=`${K.defaults.baseURL}/public/logo`;t(o),fetch(`${K.defaults.baseURL}/public/site-info`).then(l=>l.json()).then(l=>{l.siteName&&r(l.siteName)}).catch(l=>{console.error("Error fetching site info:",l)})},[]),e.jsx(eu,{children:e.jsxs(tu,{children:[e.jsxs(ge,{gutter:[48,40],children:[e.jsxs(G,{xs:24,sm:24,md:8,lg:7,children:[e.jsx(su,{children:e.jsx(Ge,{to:"/",children:e.jsx(nu,{src:s,alt:n,onError:()=>t("/logo.png")})})}),e.jsx(Jd,{style:{color:"rgba(255, 255, 255, 0.7)",marginBottom:24},children:"The premier platform for exhibition stall booking. Connect exhibitors with event organizers and simplify the booking process."}),e.jsxs(ae,{children:[e.jsx(Ps,{href:"#",target:"_blank",rel:"noopener noreferrer",children:e.jsx(el,{})}),e.jsx(Ps,{href:"#",target:"_blank",rel:"noopener noreferrer",children:e.jsx(tl,{})}),e.jsx(Ps,{href:"#",target:"_blank",rel:"noopener noreferrer",children:e.jsx(sl,{})}),e.jsx(Ps,{href:"#",target:"_blank",rel:"noopener noreferrer",children:e.jsx(nl,{})})]})]}),e.jsxs(G,{xs:24,sm:12,md:5,lg:5,children:[e.jsx(_s,{level:4,children:"Quick Links"}),e.jsx(dt,{to:"/exhibitions",children:"Exhibitions"}),e.jsx(dt,{to:"/about",children:"About Us"}),e.jsx(dt,{to:"/contact",children:"Contact Us"}),e.jsx(dt,{to:"/privacy-policy",children:"Privacy Policy"}),e.jsx(dt,{to:"/terms",children:"Terms & Conditions"})]}),e.jsxs(G,{xs:24,sm:12,md:5,lg:5,children:[e.jsx(_s,{level:4,children:"For Exhibitors"}),e.jsx(dt,{to:"/exhibitor/login",children:"Login"}),e.jsx(dt,{to:"/exhibitor/register",children:"Register"}),e.jsx(dt,{to:"/exhibitor/dashboard",children:"Dashboard"}),e.jsx(dt,{to:"/exhibitor/bookings",children:"My Bookings"}),e.jsx(dt,{to:"/faq",children:"FAQ"})]}),e.jsxs(G,{xs:24,sm:24,md:6,lg:7,children:[e.jsx(_s,{level:4,children:"Contact Us"}),e.jsxs(En,{children:[e.jsx(In,{children:e.jsx(ts,{})}),e.jsx("div",{children:"123 Exhibition Street, New Delhi, India"})]}),e.jsxs(En,{children:[e.jsx(In,{children:e.jsx(qr,{})}),e.jsx("div",{children:"+91 98765 43210"})]}),e.jsxs(En,{children:[e.jsx(In,{children:e.jsx(es,{})}),e.jsx("div",{children:"info@exhibitionmanager.com"})]}),e.jsxs("div",{style:{marginTop:24},children:[e.jsx(_s,{level:4,children:"Newsletter"}),e.jsx(Q,{children:e.jsxs(ae.Compact,{style:{width:"100%"},children:[e.jsx(ru,{placeholder:"Your email address"}),e.jsx(iu,{type:"primary",icon:e.jsx(rl,{}),children:"Subscribe"})]})})]})]})]}),e.jsx(au,{}),e.jsxs(ou,{children:["© ",i," ",n,". All rights reserved."]})]})})},af=(s,t)=>{if(!s)return"";let r=`/exhibition/${s.slug||s._id||s.id}`;return t&&(r+=`/${t}`),r},qo=(s,t)=>s?`/exhibitions/${s.slug||s._id||s.id}`:"",{Title:De,Paragraph:_e,Text:Ds}=ke,{Content:lu}=ve,cu=s=>{if(!s)return"/exhibition-placeholder.jpg";if(s.startsWith("/")||s.startsWith("http"))return s;const t=s.startsWith("/")?s.substring(1):s;return t.includes("logos/")||t.includes("sponsors/")?`${K.defaults.baseURL}/public/images/${t}`:"/exhibition-placeholder.jpg"},du=W(lu)`
  padding-top: 64px;
`,uu=W.div`
  background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  padding: 80px 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`,hu=W.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`,pu=W.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,Qt=W(ie)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`,fu=W(ie)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`,ds=W(De)`
  position: relative;
  display: inline-block;
  margin-bottom: 48px !important;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, #4158D0, #C850C0);
  }
`,Wt=W.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 24px;
  font-size: 24px;
  
  & svg {
    font-size: 28px;
  }
`,$s=W.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`,Ei=W.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`,mu=W(ne)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 50px;
`,Ii=W(H)`
  height: 50px;
  font-weight: 500;
  border-radius: 8px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &.ant-btn-primary {
    background: linear-gradient(90deg, #4158D0, #C850C0);
    border: none;
    
    &:hover {
      background: linear-gradient(90deg, #3a4ec0, #b745af);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
  
  &.secondary-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #4158D0;
    border: none;
    
    &:hover {
      background: white;
      color: #C850C0;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  }
`,us=W.div`
  padding: 80px 0;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
  
  &.gray-bg {
    background: #f9fafb;
  }
  
  &.how-it-works {
    background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%);
  }
`;W.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4158D0, #C850C0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  font-size: 18px;
  flex-shrink: 0;
`;const gu=()=>{const s=st(),t=xt(),[n,r]=g.useState([]),[i,o]=g.useState(!0);g.useEffect(()=>{(async()=>{try{o(!0);const I=await Ke.getExhibitions();r(I.data.slice(0,4))}catch(I){console.error("Failed to fetch exhibitions:",I)}finally{o(!1)}})()},[]);const l=p=>{const I={year:"numeric",month:"short",day:"numeric"};return new Date(p).toLocaleDateString(void 0,I)},x=(p,I)=>{const j=new Date,f=new Date(p),w=new Date(I);return j<f?{status:"Upcoming",color:"#722ED1"}:j>w?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},v=()=>{t(Ft(void 0))};return e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsxs(du,{children:[e.jsxs(uu,{children:[e.jsx(hu,{}),e.jsx(pu,{children:e.jsxs(ge,{gutter:[48,48],align:"middle",children:[e.jsxs(G,{xs:24,lg:14,children:[e.jsx(De,{level:1,style:{fontSize:"3.5rem",marginBottom:24,color:"white",fontWeight:700},children:"Book Your Exhibition Space with Ease"}),e.jsx(_e,{style:{fontSize:"1.2rem",marginBottom:40,color:"rgba(255, 255, 255, 0.9)"},children:"Explore upcoming exhibitions, select your perfect stall, and secure your spot all in one place. Manage your exhibition presence effortlessly."}),e.jsx(ae,{size:16,wrap:!0,children:e.jsx(Ii,{type:"primary",size:"large",onClick:()=>s("/exhibitions"),icon:e.jsx(jr,{}),children:"Explore Exhibitions"})})]}),e.jsx(G,{xs:24,lg:10,children:e.jsx("img",{src:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",alt:"Exhibition Space",style:{width:"100%",borderRadius:"12px",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)",border:"4px solid rgba(255, 255, 255, 0.2)",objectFit:"cover",height:"300px"},onError:p=>{const I=p.target;I.src="https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",I.onerror=()=>{I.style.height="300px",I.style.background="linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",I.onerror=null;const j=I.parentElement;if(j){const f=document.createElement("div");f.style.position="absolute",f.style.top="50%",f.style.left="50%",f.style.transform="translate(-50%, -50%)",f.style.color="white",f.style.fontSize="18px",f.style.fontWeight="bold",f.style.textAlign="center",f.textContent="Exhibition Venue",j.appendChild(f)}}}})})]})})]}),e.jsx(us,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(ds,{level:2,children:"Featured Exhibitions"}),i?e.jsx(ge,{gutter:[24,24],children:[1,2,3,4].map(p=>e.jsx(G,{xs:24,sm:12,lg:6,children:e.jsx(ie,{style:{borderRadius:"12px"},children:e.jsx(wt,{active:!0,avatar:!0,paragraph:{rows:3}})})},p))}):n.length>0?e.jsx(ge,{gutter:[24,24],children:n.map((p,I)=>{const{status:j,color:f}=x(p.startDate,p.endDate);return e.jsx(G,{xs:24,sm:12,lg:6,children:e.jsxs(fu,{onClick:()=>s(qo(p)),cover:e.jsxs("div",{style:{height:200,overflow:"hidden",position:"relative"},children:[e.jsx("img",{alt:p.name,src:p.headerLogo?cu(p.headerLogo):"/exhibition-placeholder.jpg",style:{width:"100%",height:"100%",objectFit:"contain",filter:"brightness(0.95)"}}),e.jsx(ne,{color:f,style:{position:"absolute",top:12,left:12,borderRadius:"50px",padding:"2px 12px"},children:j}),I===0&&e.jsx(mu,{color:"#f50",children:"Featured"})]}),hoverable:!0,children:[e.jsx(De,{level:5,ellipsis:{rows:1},style:{marginBottom:8},children:p.name}),e.jsxs("div",{style:{marginBottom:12,display:"flex",alignItems:"center",gap:8},children:[e.jsx(ft,{style:{color:"#4158D0"}}),e.jsxs(Ds,{type:"secondary",style:{fontSize:13},children:[l(p.startDate)," - ",l(p.endDate)]})]}),p.venue&&e.jsxs("div",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[e.jsx(ts,{style:{color:"#C850C0"}}),e.jsx(Ds,{type:"secondary",style:{fontSize:13},ellipsis:!0,children:p.venue})]}),e.jsx(H,{type:"link",style:{padding:0,height:"auto"},icon:e.jsx(jr,{}),children:"View Details"})]})},p._id)})}):e.jsx("div",{style:{textAlign:"center",padding:40},children:e.jsx(_e,{children:"No exhibitions available at the moment. Check back soon!"})}),e.jsx("div",{style:{textAlign:"center",marginTop:40},children:e.jsx(H,{type:"primary",size:"large",onClick:()=>s("/exhibitions"),icon:e.jsx(il,{}),children:"View All Exhibitions"})})]})}),e.jsx(us,{className:"how-it-works",children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(ds,{level:2,children:"How to Book Stall"}),e.jsx("div",{style:{textAlign:"center",maxWidth:"800px",margin:"0 auto 40px"},children:e.jsx(_e,{style:{fontSize:"18px",color:"#666",fontWeight:500},children:"Secure your exhibition space in just a few simple steps. Our streamlined booking process makes it easy to showcase your business at premier events."})}),e.jsxs("div",{className:"booking-steps",children:[e.jsx("div",{className:"step-indicator",children:e.jsxs("div",{className:"step-dots",children:[[1,2,3,4,5,6,7].map(p=>e.jsxs("div",{className:"step-dot-container",children:[e.jsx("div",{className:"step-dot",children:p}),e.jsx("div",{className:"step-label",children:`Step ${p}`})]},p)),e.jsx("div",{className:"step-progress-line"})]})}),e.jsxs(ge,{gutter:[24,24],style:{marginTop:40},children:[e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsx("div",{className:"step-icon",children:e.jsx(Ne,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Register"}),e.jsx(_e,{children:"The exhibitor must first register on the platform with company details and contact information."})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsx("div",{className:"step-icon",children:e.jsx(Qe,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Admin Approval"}),e.jsx(_e,{children:"After registration, the admin will review and approve your account. You'll receive a notification."})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("div",{className:"step-icon",children:e.jsx(Ze,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Login & Book Stall"}),e.jsx(_e,{children:"Once approved, log in and select a stall from the interactive layout map."})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"4"}),e.jsx("div",{className:"step-icon",children:e.jsx(mt,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Stall Goes to Reserved"}),e.jsx(_e,{children:'After booking, the stall status changes to "Reserved" and will be temporarily held for you.'})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"5"}),e.jsx("div",{className:"step-icon",children:e.jsx(Qe,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Admin Final Approval"}),e.jsx(_e,{children:"The admin will review your reservation request and approve it based on availability."})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"6"}),e.jsx("div",{className:"step-icon",children:e.jsx(Qe,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Stall Becomes Booked"}),e.jsx(_e,{children:'After admin approval, the stall status changes to "Booked" and an invoice is generated.'})]})]})}),e.jsx(G,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"7"}),e.jsx("div",{className:"step-icon",children:e.jsx(ci,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(De,{level:5,children:"Make Payment in 3 Days"}),e.jsx(_e,{children:"Complete your payment within 3 days of booking to confirm your stall reservation."})]})]})})]}),e.jsx("style",{children:`
                  .booking-steps {
                    margin-top: 20px;
                  }
                  
                  .step-indicator {
                    margin-bottom: 30px;
                    padding: 0 40px;
                  }
                  
                  .step-dots {
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  
                  .step-progress-line {
                    position: absolute;
                    top: 25px;
                    left: 50px;
                    right: 50px;
                    height: 3px;
                    background: linear-gradient(90deg, #4158D0, #C850C0);
                    z-index: 0;
                  }
                  
                  .step-dot-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                  }
                  
                  .step-dot {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4158D0, #C850C0);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 20px;
                    margin-bottom: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  }
                  
                  .step-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                  }
                  
                  .step-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: 100%;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #f0f0f0;
                  }
                  
                  .step-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
                  }
                  
                  .step-card-header {
                    background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    border-bottom: 1px solid #f0f0f0;
                  }
                  
                  .step-number {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4158D0, #C850C0);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                  }
                  
                  .step-icon {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: #4158D0;
                  }
                  
                  .step-card-body {
                    padding: 16px;
                    flex: 1;
                  }
                  
                  .step-card-body h5 {
                    margin-bottom: 8px;
                  }
                  
                  .step-card-body p {
                    margin-bottom: 0;
                    color: #666;
                  }
                  
                  @media (max-width: 768px) {
                    .step-progress-line {
                      display: none;
                    }
                    
                    .step-dots {
                      display: none;
                    }
                  }
                `})]}),e.jsx("div",{style:{textAlign:"center",marginTop:60},children:e.jsx(Ii,{type:"primary",size:"large",onClick:v,icon:e.jsx(Ne,{}),children:"Register as Exhibitor"})})]})}),e.jsx(us,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(ds,{level:2,children:"Why Choose Us"}),e.jsxs(ge,{gutter:[24,24],children:[e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(65, 88, 208, 0.1)",color:"#4158D0"},children:e.jsx(Ur,{})}),e.jsx(De,{level:4,children:"Interactive Layouts"}),e.jsx(_e,{style:{fontSize:16},children:"Explore detailed exhibition floor plans with interactive maps to find your perfect spot."})]})}),e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(200, 80, 192, 0.1)",color:"#C850C0"},children:e.jsx(Ze,{})}),e.jsx(De,{level:4,children:"Real-time Availability"}),e.jsx(_e,{style:{fontSize:16},children:"See stall availability in real-time and book instantly without any delays or confusion."})]})}),e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(255, 204, 112, 0.1)",color:"#FFCC70"},children:e.jsx(ci,{})}),e.jsx(De,{level:4,children:"Secure Payments"}),e.jsx(_e,{style:{fontSize:16},children:"Complete your bookings with our secure payment gateway and receive instant confirmation."})]})}),e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(82, 196, 26, 0.1)",color:"#52c41a"},children:e.jsx(zr,{})}),e.jsx(De,{level:4,children:"Exhibitor Dashboard"}),e.jsx(_e,{style:{fontSize:16},children:"Manage all your bookings, payments, and exhibition details through our user-friendly dashboard."})]})}),e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(250, 140, 22, 0.1)",color:"#fa8c16"},children:e.jsx(ft,{})}),e.jsx(De,{level:4,children:"Schedule Management"}),e.jsx(_e,{style:{fontSize:16},children:"Keep track of important dates, setup times, and exhibition schedules all in one place."})]})}),e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(Qt,{children:[e.jsx(Wt,{style:{background:"rgba(24, 144, 255, 0.1)",color:"#1890ff"},children:e.jsx(Qe,{})}),e.jsx(De,{level:4,children:"Support & Assistance"}),e.jsx(_e,{style:{fontSize:16},children:"Get expert assistance throughout the booking process and during the exhibition."})]})})]})]})}),e.jsx(us,{className:"gray-bg",children:e.jsx("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:e.jsxs(ge,{gutter:[48,48],children:[e.jsxs(G,{xs:24,lg:12,children:[e.jsx(ds,{level:2,children:"Our Impact"}),e.jsxs(ge,{gutter:[24,24],children:[e.jsx(G,{xs:12,children:e.jsx($s,{children:e.jsx(Nt,{title:"Exhibitions",value:100,suffix:"+",valueStyle:{color:"#4158D0",fontWeight:"bold"}})})}),e.jsx(G,{xs:12,children:e.jsx($s,{children:e.jsx(Nt,{title:"Exhibitors",value:5e3,suffix:"+",valueStyle:{color:"#C850C0",fontWeight:"bold"}})})}),e.jsx(G,{xs:12,children:e.jsx($s,{children:e.jsx(Nt,{title:"Stalls Booked",value:12e3,suffix:"+",valueStyle:{color:"#FFCC70",fontWeight:"bold"}})})}),e.jsx(G,{xs:12,children:e.jsx($s,{children:e.jsx(Nt,{title:"Cities",value:25,suffix:"+",valueStyle:{color:"#52c41a",fontWeight:"bold"}})})})]})]}),e.jsxs(G,{xs:24,lg:12,children:[e.jsx(ds,{level:2,children:"What Exhibitors Say"}),e.jsxs(Ea,{autoplay:!0,dots:{className:"custom-carousel-dots"},children:[e.jsx("div",{children:e.jsxs(Ei,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx(Bt,{size:64,icon:e.jsx(Ne,{}),style:{backgroundColor:"#4158D0"}}),e.jsxs("div",{children:[e.jsx(De,{level:5,style:{margin:0},children:"Sarah Johnson"}),e.jsx(Ds,{type:"secondary",children:"Tech Innovations Inc."})]})]}),e.jsx(_e,{style:{fontSize:16},children:'"The booking process was seamless! I could view the layout, select my preferred spot, and complete payment all in one go. Will definitely use again for our next exhibition."'})]})}),e.jsx("div",{children:e.jsxs(Ei,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx(Bt,{size:64,icon:e.jsx(Ne,{}),style:{backgroundColor:"#C850C0"}}),e.jsxs("div",{children:[e.jsx(De,{level:5,style:{margin:0},children:"Michael Chen"}),e.jsx(Ds,{type:"secondary",children:"Global Exhibits Ltd"})]})]}),e.jsx(_e,{style:{fontSize:16},children:'"As a regular exhibitor, this platform has made my life so much easier. I love how I can see all my bookings and manage everything from one dashboard."'})]})})]})]})]})})}),e.jsx(us,{style:{padding:"60px 0"},children:e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto",padding:"40px 24px",background:"linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",borderRadius:"16px",color:"white",textAlign:"center",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.1)"},children:[e.jsx(De,{level:2,style:{color:"white",marginBottom:16},children:"Ready to Showcase Your Business?"}),e.jsx(_e,{style:{fontSize:"1.2rem",marginBottom:32,color:"rgba(255, 255, 255, 0.9)"},children:"Join thousands of successful exhibitors and book your perfect stall today"}),e.jsxs(ae,{size:16,wrap:!0,style:{justifyContent:"center"},children:[e.jsx(H,{size:"large",style:{height:"50px",background:"white",color:"#4158D0",border:"none",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:()=>s("/exhibitions"),icon:e.jsx(Ze,{}),children:"Browse Exhibitions"}),e.jsx(H,{size:"large",style:{height:"50px",background:"rgba(255, 255, 255, 0.2)",color:"white",border:"2px solid white",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:v,icon:e.jsx(Ne,{}),children:"Register as Exhibitor"})]})]})})]}),e.jsx(Oo,{})]})};let xu=class extends Ae.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,n){console.error("Error caught by boundary:",t,n)}render(){var t;return this.state.hasError?e.jsx(ys,{status:"error",title:"Something went wrong",subTitle:((t=this.state.error)==null?void 0:t.message)||"An unexpected error occurred",extra:[e.jsx(H,{type:"primary",onClick:()=>window.location.href="/dashboard",children:"Go to Dashboard"},"home"),e.jsx(H,{onClick:()=>window.location.reload(),children:"Reload Page"},"reload")]}):this.props.children}};const Ci=({width:s,height:t,scale:n=1,position:r={x:0,y:0},isSelected:i=!1,onSelect:o=()=>{},onChange:l=()=>{},children:x,isEditable:v=!0})=>{const p=j=>{v&&(o(),j.cancelBubble=!0)},I=Ae.useMemo(()=>{const j=[];for(let w=0;w<=s;w+=5)j.push(e.jsx(nn,{points:[w,0,w,t],stroke:"#e8e8e8",strokeWidth:1/n,dash:[5/n]},`v${w}`));for(let w=0;w<=t;w+=5)j.push(e.jsx(nn,{points:[0,w,s,w],stroke:"#e8e8e8",strokeWidth:1/n,dash:[5/n]},`h${w}`));return j},[s,t,n]);return e.jsxs(ss,{x:r.x,y:r.y,width:s,height:t,onClick:p,children:[e.jsx(dn,{width:s,height:t,fill:"#ffffff",stroke:i&&v?"#1890ff":"#d9d9d9",strokeWidth:i&&v?2/n:1/n,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:10/n,shadowOffset:{x:0,y:0},shadowOpacity:.5,cornerRadius:4/n}),e.jsx(ss,{children:I}),e.jsx(vs,{text:`${s}m × ${t}m`,fontSize:14/n,fill:"#666666",x:5,y:5}),x]})},yu=({visible:s,width:t,height:n,onCancel:r,onSubmit:i})=>{const[o]=Q.useForm();Ae.useEffect(()=>{s&&o.setFieldsValue({width:t,height:n})},[s,t,n,o]);const l=()=>{o.validateFields().then(x=>{i(x),o.resetFields()})};return e.jsx(tt,{title:"Edit Exhibition Space",open:s,onCancel:()=>{o.resetFields(),r()},onOk:l,destroyOnClose:!0,children:e.jsxs(Q,{form:o,layout:"vertical",initialValues:{width:t,height:n},children:[e.jsx(Q.Item,{name:"width",label:"Width (meters)",rules:[{required:!0,message:"Please enter width"},{type:"number",min:10,message:"Width must be at least 10 meters"}],children:e.jsx(ot,{min:10,max:1e3,style:{width:"100%"},placeholder:"Enter width in meters"})}),e.jsx(Q.Item,{name:"height",label:"Height (meters)",rules:[{required:!0,message:"Please enter height"},{type:"number",min:10,message:"Height must be at least 10 meters"}],children:e.jsx(ot,{min:10,max:1e3,style:{width:"100%"},placeholder:"Enter height in meters"})})]})})},Uo=({hall:s,isSelected:t=!1,onSelect:n,onChange:r,scale:i=1,position:o={x:0,y:0},exhibitionWidth:l=100,exhibitionHeight:x=100,isStallMode:v=!1})=>{const p=Ae.useRef(null),I=Ae.useRef(null),j=Ae.useMemo(()=>{const S=[],{width:_,height:N}=s.dimensions,a=1;for(let c=0;c<=_;c+=a)S.push(e.jsx(nn,{points:[c,0,c,N],stroke:"#ddd",strokeWidth:1/i,dash:[2/i,2/i],listening:!1},`v${c}`));for(let c=0;c<=N;c+=a)S.push(e.jsx(nn,{points:[0,c,_,c],stroke:"#ddd",strokeWidth:1/i,dash:[2/i,2/i],listening:!1},`h${c}`));return S},[s.dimensions.width,s.dimensions.height,i]);Ae.useEffect(()=>{var S;t&&I.current&&p.current&&(I.current.nodes([p.current]),(S=I.current.getLayer())==null||S.batchDraw())},[t]);const f=S=>{S.cancelBubble=!0;const _=S.target,N=_.x(),a=_.y(),c=Math.max(0,Math.min(N,l-s.dimensions.width)),h=Math.max(0,Math.min(a,x-s.dimensions.height));_.x(Math.round(c)),_.y(Math.round(h))},w=S=>{S.cancelBubble=!0;const _=S.target,N=Math.max(0,Math.min(_.x(),l-s.dimensions.width)),a=Math.max(0,Math.min(_.y(),x-s.dimensions.height));r==null||r({...s,_id:s._id,id:s.id||s._id,exhibitionId:s.exhibitionId,dimensions:{...s.dimensions,x:Math.round(N),y:Math.round(a)}})},T=S=>{S.cancelBubble=!0},R=S=>{if(!p.current)return;const _=p.current,N=_.scaleX(),a=_.scaleY();_.scaleX(1),_.scaleY(1);const c=Math.round(_.width()*N),h=Math.round(_.height()*a),k=_.x(),m=_.y(),C=Math.max(0,Math.min(k,l-c)),d=Math.max(0,Math.min(m,x-h));r==null||r({...s,_id:s._id,id:s.id||s._id,exhibitionId:s.exhibitionId,dimensions:{x:C,y:d,width:Math.max(5,Math.min(c,l-C)),height:Math.max(5,Math.min(h,x-d))}})},P=S=>{S.cancelBubble=!0,n==null||n(s)};return e.jsxs(ss,{ref:p,x:s.dimensions.x,y:s.dimensions.y,width:s.dimensions.width,height:s.dimensions.height,draggable:!v&&!!r,onClick:P,onTap:P,onDragStart:T,onDragMove:f,onDragEnd:w,onTransformEnd:R,children:[e.jsx(dn,{width:s.dimensions.width,height:s.dimensions.height,fill:"#ffffff",stroke:t?"#1890ff":"#d9d9d9",strokeWidth:t?2/i:1/i,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/i,shadowOffset:{x:2/i,y:2/i},shadowOpacity:.5}),e.jsx(ss,{children:j}),e.jsx(vs,{text:s.name,fontSize:14/i,fill:"#000000",width:s.dimensions.width,align:"center",y:s.dimensions.height/2-7/i})]})},bu=s=>{if(!s)return"";const t=window.location.origin,n=s.replace(/^\/?(api\/uploads\/)?/,"");if(n.includes("fixtures/"))return`${t}/api/uploads/${n}`;const r=localStorage.getItem("token");return r?`${t}/api/uploads/${n}?token=${r}`:""},Vo=({fixture:s,isSelected:t=!1,onSelect:n,onChange:r,scale:i=1,position:o={x:0,y:0},exhibitionWidth:l=100,exhibitionHeight:x=100,isEditable:v=!0})=>{const p=Ae.useRef(null),I=Ae.useRef(null),[j,f]=g.useState("");g.useEffect(()=>{if(s.icon){const a=bu(s.icon);f(a)}else f("")},[s.icon]);const[w]=hl(j);Ae.useEffect(()=>{var a;t&&I.current&&p.current&&(I.current.nodes([p.current]),(a=I.current.getLayer())==null||a.batchDraw())},[t]);const T=a=>{a.cancelBubble=!0},R=a=>{a.cancelBubble=!0;const c=a.target,h=c.x(),k=c.y(),m=Math.max(0,Math.min(h,l-s.dimensions.width)),C=Math.max(0,Math.min(k,x-s.dimensions.height));c.x(Math.round(m)),c.y(Math.round(C))},P=a=>{a.cancelBubble=!0;const c=a.target,h=c.x(),k=c.y(),m=Math.max(0,Math.min(h,l-s.dimensions.width)),C=Math.max(0,Math.min(k,x-s.dimensions.height)),d=s._id||s.id;r==null||r({...s,_id:d,id:d,exhibitionId:s.exhibitionId,position:{x:Math.round(m),y:Math.round(C)}})},S=a=>{if(!p.current)return;const c=p.current,h=c.scaleX(),k=c.scaleY(),m=c.rotation();c.scaleX(1),c.scaleY(1);const C=Math.round(s.dimensions.width*h),d=Math.round(s.dimensions.height*k),u=c.x(),y=c.y(),b=Math.max(0,Math.min(u,l-C)),E=Math.max(0,Math.min(y,x-d)),B=s._id||s.id;r==null||r({...s,_id:B,id:B,exhibitionId:s.exhibitionId,position:{x:b,y:E},dimensions:{width:Math.max(.5,Math.min(C,l-b)),height:Math.max(.5,Math.min(d,x-E))},rotation:m})},_=a=>{a.cancelBubble=!0,n==null||n(s)},N=()=>{const a=s.borderColor||(t?"#1890ff":"#d9d9d9"),c=s.borderRadius!==void 0?s.borderRadius/i:3/i;return w?e.jsx(fl,{image:w,width:s.dimensions.width,height:s.dimensions.height,fill:s.color||"#ffffff",stroke:a,strokeWidth:t?2/i:1/i,cornerRadius:c,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/i,shadowOffset:{x:2/i,y:2/i},shadowOpacity:.5}):e.jsx(dn,{width:s.dimensions.width,height:s.dimensions.height,fill:s.color||"#f0f2f5",stroke:a,strokeWidth:t?2/i:1/i,cornerRadius:c,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/i,shadowOffset:{x:2/i,y:2/i},shadowOpacity:.5})};return e.jsxs(e.Fragment,{children:[e.jsxs(ss,{ref:p,x:s.position.x,y:s.position.y,width:s.dimensions.width,height:s.dimensions.height,rotation:s.rotation||0,draggable:v&&!!r,onClick:_,onTap:_,onDragStart:T,onDragMove:R,onDragEnd:P,onTransformEnd:S,children:[N(),s.name&&s.showName!==!1&&e.jsx(vs,{text:s.name,fontSize:12/i,fill:"#000000",width:s.dimensions.width,align:"center",y:-16/i})]}),t&&v&&e.jsx(pl,{ref:I,rotateEnabled:!0,enabledAnchors:["top-left","top-right","bottom-left","bottom-right"],boundBoxFunc:(a,c)=>c.width<.5||c.height<.5?a:c})]})},ju=({visible:s,x:t,y:n,onExhibitionClick:r,onHallClick:i,onStallClick:o,onFixtureClick:l,onClose:x})=>{if(!s)return null;const v=[{key:"exhibition",icon:e.jsx(Ur,{}),label:"Exhibition Space",onClick:()=>{r(),x()}},{key:"hall",icon:e.jsx(Vr,{}),label:"Add Hall",onClick:()=>{i(),x()}}];return o&&v.push({key:"stall",icon:e.jsx(Ze,{}),label:"Add Stall",onClick:()=>{o(),x()}}),l&&v.push({key:"fixture",icon:e.jsx(mo,{}),label:"Add Fixture",onClick:()=>{l(),x()}}),e.jsx("div",{style:{position:"fixed",top:n,left:t,zIndex:1e3,boxShadow:"0 2px 8px rgba(0,0,0,0.15)",borderRadius:"4px",backgroundColor:"#fff",width:"200px"},children:e.jsx(ks,{items:v})})},vu=({stall:s,isSelected:t=!1,onSelect:n,onChange:r,hallWidth:i=0,hallHeight:o=0,hallX:l=0,hallY:x=0,scale:v=1,isDragging:p=!1})=>{const I=g.useRef(null),[j,f]=g.useState(!1),[w,T]=g.useState(!1),[R,P]=g.useState(!1);g.useEffect(()=>{P(window.innerWidth<768);const B=()=>{P(window.innerWidth<768)};return window.addEventListener("resize",B),()=>window.removeEventListener("resize",B)},[]),g.useEffect(()=>{if(j&&!p)T(!0);else if(p)T(!1);else{const B=setTimeout(()=>{T(!1)},100);return()=>clearTimeout(B)}},[j,p]),g.useEffect(()=>{if(j&&I.current&&!p){if(R&&!t)return;I.current.getStage()&&I.current.moveToTop()}},[j,t,R,p]);const S=t||s.isSelected,_=g.useCallback(B=>{switch(B){case"available":return"#52c41a";case"booked":return"#faad14";case"reserved":return"#1890ff";default:return"#d9d9d9"}},[]),N=g.useCallback(B=>{switch(B){case"available":return"rgba(82, 196, 26, 0.2)";case"booked":return"rgba(250, 173, 20, 0.2)";case"reserved":return"rgba(24, 144, 255, 0.2)";default:return"rgba(217, 217, 217, 0.2)"}},[]),a=g.useCallback(B=>{B.cancelBubble=!0;const L=B.target,A=L.x()-l,$=L.y()-x,F=Math.max(0,Math.min(A,i-s.dimensions.width)),q=Math.max(0,Math.min($,o-s.dimensions.height));L.x(Math.round(F+l)),L.y(Math.round(q+x))},[l,x,i,o,s.dimensions.width,s.dimensions.height]),c=g.useCallback(B=>{if(B.cancelBubble=!0,!r)return;const L=B.target,A=L.x()-l,$=L.y()-x,F=Math.max(0,Math.min(A,i-s.dimensions.width)),q=Math.max(0,Math.min($,o-s.dimensions.height));r({...s,id:s.id||s._id,_id:s._id||s.id,dimensions:{...s.dimensions,x:Math.round(F),y:Math.round(q)}})},[r,l,x,i,o,s]),h=g.useCallback(B=>{B.cancelBubble=!0},[]),k=g.useCallback(B=>{B.cancelBubble=!0,n&&!p&&n()},[n,p]),m=g.useCallback(()=>{R&&!S||p||f(!0)},[R,S,p]),C=g.useCallback(()=>{f(!1)},[]),d={x:0,y:0,width:10,height:10},u=s.dimensions||d,y=s.typeName||"Standard";s.ratePerSqm*u.width*u.height;const b=0,E=g.useMemo(()=>s.status!=="available"&&s.companyName?`${y} - ${u.width}×${u.height}m - ${s.companyName}`:`${y} - ${u.width}×${u.height}m`,[y,u.width,u.height,s.status,s.companyName]);return e.jsxs(ss,{ref:I,x:u.x+l,y:u.y+x,width:u.width,height:u.height,draggable:!!r,onClick:k,onTap:k,onDragStart:h,onDragMove:a,onDragEnd:c,opacity:s.status==="available"?1:.7,cursor:s.status==="available"?"pointer":"default",onMouseEnter:m,onMouseLeave:C,listening:p?!1:!R||s.status==="available",transformsEnabled:p||R?"position":"all",children:[e.jsx(dn,{width:u.width,height:u.height,fill:S?"rgba(24, 144, 255, 0.1)":N(s.status),stroke:S?"#1890ff":_(s.status),strokeWidth:S?2/v:1/v,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:p?0:R?2:3,shadowOffset:{x:1,y:1},shadowOpacity:p?0:.3,rotation:b,perfectDrawEnabled:!p,transformsEnabled:p?"position":"all",cornerRadius:.05}),e.jsx(vs,{text:s.number,fontSize:Math.min(u.width,u.height)*.25,fill:"#000000",width:u.width,height:u.height,align:"center",verticalAlign:"middle",transformsEnabled:"position",perfectDrawEnabled:!p,fontStyle:"bold",listening:!1}),S&&!p&&e.jsx(ml,{x:u.width-2,y:2,radius:Math.min(.8,u.width*.05),fill:"#1890ff",stroke:"#ffffff",strokeWidth:.2/v,transformsEnabled:"position",listening:!1}),w&&!p&&e.jsxs(gl,{x:u.width/2,y:0,opacity:1,listening:!1,children:[e.jsx(xl,{fill:"rgba(0, 0, 0, 1.0)",cornerRadius:.5,pointerDirection:"down",pointerWidth:4,pointerHeight:2,lineJoin:"round",y:-7,listening:!1}),e.jsx(vs,{text:E,fontSize:1.2,fill:"#ffffff",align:"center",padding:2,y:-7,offsetY:0,width:Math.max(E.length*.7,25),height:3,verticalAlign:"middle",listening:!1})]})]})},Qo=g.memo(vu),wu=({width:s,height:t,exhibitionWidth:n=100,exhibitionHeight:r=100,halls:i=[],stalls:o=[],fixtures:l=[],selectedHall:x=null,selectedFixture:v=null,onSelectHall:p=()=>{},onSelectFixture:I=()=>{},onHallChange:j=()=>{},onFixtureChange:f=()=>{},onExhibitionChange:w=()=>{},onAddHall:T=()=>{},onAddStall:R=()=>{},onAddFixture:P=()=>{},children:S,isStallMode:_=!1,isFixtureMode:N=!1,isPublicView:a=!1})=>{const c=g.useRef(null),h=g.useRef(null),k=g.useRef(null),[m,C]=g.useState(1),[d,u]=g.useState({x:0,y:0}),[y,b]=g.useState(!1),[E,B]=g.useState(!1),[L,A]=g.useState({visible:!1,x:0,y:0}),[$,F]=g.useState(!1),[q,D]=g.useState(!1),[M,U]=g.useState(!1),[V,O]=g.useState(void 0);g.useEffect(()=>{const J=()=>{U(window.innerWidth<768)};return J(),window.addEventListener("resize",J),()=>{window.removeEventListener("resize",J)}},[]);const X=g.useCallback(J=>{if(J.evt.preventDefault(),!c.current)return;const oe=c.current,xe=m,ee=oe.getPointerPosition(),Le={x:(ee.x-oe.x())/xe,y:(ee.y-oe.y())/xe},Ue=1.15,Xe=J.evt.deltaY<0?xe*Ue:xe/Ue,_t=Math.min(Math.max(.1,Xe),20),os={x:ee.x-Le.x*_t,y:ee.y-Le.y*_t};C(_t),u(os)},[m]),Y=g.useCallback(()=>{if(!c.current)return;const J=c.current,oe=Math.min(m*1.15,20),xe=J.width()/2,ee=J.height()/2,Le={x:(xe-d.x)/m,y:(ee-d.y)/m},Ue={x:xe-Le.x*oe,y:ee-Le.y*oe};C(oe),u(Ue)},[m,d]),pe=g.useCallback(()=>{if(!c.current)return;const J=c.current,oe=Math.max(m/1.15,.1),xe=J.width()/2,ee=J.height()/2,Le={x:(xe-d.x)/m,y:(ee-d.y)/m},Ue={x:xe-Le.x*oe,y:ee-Le.y*oe};C(oe),u(Ue)},[m,d]),fe=g.useCallback(J=>{J?(O(xn.pixelRatio),xn.pixelRatio=M?.8:1):V&&(xn.pixelRatio=V)},[V,M]),ue=g.useCallback(J=>{if(J.target===c.current&&(A({...L,visible:!1}),B(!0),fe(!0),h.current)){if(a){const oe=M?{x:-10,y:-10,width:s+20,height:t+20}:void 0;h.current.cache(oe)}if(h.current.hitGraphEnabled(!1),a&&c.current){const oe=c.current.container();oe.style.cursor="grabbing",oe.classList.add("dragging"),c.current.batchDraw(),h.current.getChildren().forEach(ee=>{if(ee.shadowForStrokeEnabled&&(ee._savedShadowForStroke=ee.shadowForStrokeEnabled(),ee.shadowForStrokeEnabled(!1)),ee.perfectDrawEnabled&&(ee._savedPerfectDraw=ee.perfectDrawEnabled(),ee.perfectDrawEnabled(!1)),ee.cache&&!ee.isCached&&ee.width&&ee.height){ee._dragCached=!0;try{M?ee.cache({offset:10,pixelRatio:.8}):ee.cache()}catch{ee._dragCached=!1}}})}}},[L,a,fe,M,s,t]),re=g.useCallback(J=>{if(a&&J.target===c.current){if(J.evt&&J.evt._dragSkipUpdate)return;if(J.evt&&(J.evt._dragSkipUpdate=!0),c.current&&h.current){const oe=M?.85:.7;Math.random()>oe&&c.current.batchDraw()}return}J.target===c.current&&M&&h.current&&(J.cancelBubble=!0)},[M,a]),me=g.useCallback(J=>{if(J.target===c.current){if(u({x:J.target.x(),y:J.target.y()}),fe(!1),h.current&&(h.current.hitGraphEnabled(!0),a&&h.current.clearCache(),a&&c.current)){const oe=c.current.container();oe.style.cursor="",oe.classList.remove("dragging"),h.current.getChildren().forEach(ee=>{ee._savedShadowForStroke!==void 0&&(ee.shadowForStrokeEnabled(ee._savedShadowForStroke),delete ee._savedShadowForStroke),ee._savedPerfectDraw!==void 0&&(ee.perfectDrawEnabled(ee._savedPerfectDraw),delete ee._savedPerfectDraw),ee._dragCached&&(ee.clearCache(),delete ee._dragCached)})}setTimeout(()=>{c.current&&c.current.batchDraw()},50),B(!1)}},[a,fe]),Fe=g.useCallback(()=>{b(!0),document.body.style.cursor=E?"grabbing":"grab"},[E]),z=g.useCallback(()=>{b(!1),document.body.style.cursor="default"},[]),Z=J=>{var xe,ee,Le;const oe=J.target.getClassName();if(oe==="Stage"||oe==="Layer"){A({...L,visible:!1});return}if(oe==="Group"||oe==="Rect"){p(null),I(null);const Ue=(xe=c.current)==null?void 0:xe.getPointerPosition();if(Ue&&he(Ue)){const{x:Xe,y:_t}=Ue,{x:os,y:ca}=((ee=c.current)==null?void 0:ee.position())||{x:0,y:0},{x:da,y:ua}=((Le=c.current)==null?void 0:Le.scale())||{x:1,y:1},ha=(Xe-os)/da,pa=(_t-ca)/ua;A({x:ha,y:pa,visible:!0})}else A({...L,visible:!1})}else A({...L,visible:!1})},he=J=>{if(!n||!r||!c.current)return!1;const{x:oe,y:xe}=J,{x:ee,y:Le}=c.current.position(),{x:Ue}=c.current.scale(),Xe={x:(oe-ee)/Ue,y:(xe-Le)/Ue};return Xe.x>=0&&Xe.x<=n&&Xe.y>=0&&Xe.y<=r},Ie=g.useCallback(()=>{p(null),I(null),F(!0),D(!0),A({...L,visible:!1})},[p,I,L]),Te=g.useCallback(J=>{w(J),D(!1)},[w]),We=()=>{F(!0),D(!0),A({...L,visible:!1})},is=()=>{T(),A({...L,visible:!1})},qt=()=>{R(),A({...L,visible:!1})};g.useEffect(()=>{if(s>0&&t>0&&n>0&&r>0){const J=_?20:40,oe=s-J*2,xe=t-J*2,ee=oe/n,Le=xe/r,Xe=Math.min(ee,Le),_t=(s-n*Xe)/2,os=(t-r*Xe)/2;C(Xe),u({x:_t,y:os}),c.current&&c.current.batchDraw()}},[s,t,n,r,_]);const Et=Ae.Children.map(S,J=>Ae.isValidElement(J)?Ae.cloneElement(J,{scale:m,position:d}):J),la=e.jsx(Ci,{width:n,height:r,scale:m,position:{x:0,y:0},isSelected:!1,onSelect:void 0,onChange:void 0,isEditable:!1});return s<=0||t<=0||n<=0||r<=0?e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"},children:"Loading..."}):e.jsxs("div",{style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"#fafafa",cursor:y?E?"grabbing":"grab":"default"},children:[e.jsx("div",{style:{position:"absolute",top:16,right:16,zIndex:1,display:"flex",gap:"8px"},children:e.jsxs(ae,{style:{background:"rgba(255, 255, 255, 0.9)",padding:"8px",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",backdropFilter:"blur(8px)"},children:[e.jsx(H,{icon:e.jsx(Ia,{}),onClick:pe,disabled:m<=.1,style:{borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center"}}),e.jsxs("div",{style:{padding:"0 8px",fontSize:"14px",color:"#666",userSelect:"none"},children:[Math.round(m*100),"%"]}),e.jsx(H,{icon:e.jsx(Ca,{}),onClick:Y,disabled:m>=20,style:{borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center"}})]})}),e.jsxs(yl,{ref:c,width:s,height:t,onClick:Z,draggable:!0,onDragStart:ue,onDragMove:re,onDragEnd:me,onMouseEnter:Fe,onMouseLeave:z,onWheel:X,x:d.x,y:d.y,scaleX:m,scaleY:m,perfectDrawEnabled:!E&&!a,hitGraphEnabled:!E,pixelRatio:E?M?.8:1:Math.min(1.5,window.devicePixelRatio||1),dragDistance:a?M?5:3:0,children:[a&&e.jsx(bl,{ref:k,listening:!1,children:la}),e.jsxs(jl,{ref:h,imageSmoothingEnabled:!E||!a,children:[!a&&e.jsx(Ci,{width:n,height:r,scale:m,position:{x:0,y:0},isSelected:$,onSelect:N?void 0:Ie,onChange:_||N?void 0:w,isEditable:!_&&!N}),i.map(J=>e.jsx(Uo,{hall:J,isSelected:(x==null?void 0:x.id)===J.id,onSelect:()=>p(J),onChange:_||N?void 0:j,scale:m,position:{x:0,y:0},exhibitionWidth:n,exhibitionHeight:r,isStallMode:_||N},J._id||J.id)),o.map(J=>{const oe=J._id||J.id,xe=i.find(ee=>ee.id===J.hallId||ee._id===J.hallId);return xe?e.jsx(Qo,{stall:{...J,_id:oe,id:oe},hallX:xe.dimensions.x,hallY:xe.dimensions.y,hallWidth:xe.dimensions.width,hallHeight:xe.dimensions.height,scale:m,isDragging:E&&a},oe):null}),l.map(J=>{const oe=J._id||J.id,ee=((v==null?void 0:v._id)||(v==null?void 0:v.id))===oe;return e.jsx(Vo,{fixture:{...J,_id:oe,id:oe},isSelected:ee,onSelect:()=>I(J),onChange:N?f:void 0,scale:m,position:{x:0,y:0},exhibitionWidth:n,exhibitionHeight:r,isEditable:N},oe)}),Et]})]}),e.jsx(ju,{visible:L.visible,x:L.x,y:L.y,onExhibitionClick:We,onHallClick:is,onStallClick:qt,onClose:()=>A({...L,visible:!1})}),e.jsx(yu,{visible:q,width:n,height:r,onCancel:()=>D(!1),onSubmit:Te})]})},Wo={getStallTypes:async()=>K.get("/stall-types"),createStallType:async s=>K.post("/stall-types",s),updateStallType:async(s,t)=>K.put(`/stall-types/${s}`,t),deleteStallType:async s=>K.delete(`/stall-types/${s}`)},cf=Object.freeze(Object.defineProperty({__proto__:null,default:Wo},Symbol.toStringTag,{value:"Module"})),{Title:Su}=ke,df=({visible:s,stall:t,hall:n,exhibition:r,onCancel:i,onSubmit:o,onDelete:l})=>{const[x]=Q.useForm(),[v,p]=g.useState([]),[I,j]=g.useState(!1),f=(S,_,N,a,c)=>{const k=[...N].sort((C,d)=>{const u=Math.floor(C.dimensions.y/5),y=Math.floor(d.dimensions.y/5);return u===y?C.dimensions.x-d.dimensions.x:C.dimensions.y-d.dimensions.y}),m=(C,d)=>C+S>a||d+_>c?!1:!k.some(u=>{const y=u.dimensions.x,b=u.dimensions.y,E=u.dimensions.width,B=u.dimensions.height,L=1;return!(C+S+L<=y||C>=y+E+L||d+_+L<=b||d>=b+B+L)});for(const C of k){const d=C.dimensions.x+C.dimensions.width+1,u=C.dimensions.y;if(m(d,u))return{x:d,y:u};const y=C.dimensions.x,b=C.dimensions.y+C.dimensions.height+1;if(m(y,b))return{x:y,y:b}}for(let C=0;C<c;C+=5)for(let d=0;d<a;d+=5)if(m(d,C))return{x:d,y:C};return{x:0,y:0}};g.useEffect(()=>{if(t){console.log("Setting form values for stall:",t);const S={number:t.number,stallTypeId:t.stallTypeId,width:t.dimensions.width,height:t.dimensions.height,ratePerSqm:t.ratePerSqm,status:t.status};console.log("Form values to set:",S),x.setFieldsValue(S)}else n&&!x.getFieldValue("status")&&x.setFieldsValue({status:"available",width:Math.min(20,n.dimensions.width/4),height:Math.min(20,n.dimensions.height/4),ratePerSqm:0})},[t,n,x]),g.useEffect(()=>{s&&(async()=>{var _;try{j(!0);const N=await Wo.getStallTypes();console.log("Fetched stall types:",N.data);const a=((_=r.stallRates)==null?void 0:_.map(h=>h.stallTypeId))||[];console.log("Configured stall type IDs:",a);const c=N.data.filter(h=>h.status==="active"&&h._id&&a.includes(h._id));console.log("Filtered stall types:",c),p(c)}catch(N){console.error("Failed to fetch stall types:",N)}finally{j(!1)}})()},[s,r.stallRates]);const w=S=>{var N;console.log("Stall type changed to:",S);const _=(N=r.stallRates)==null?void 0:N.find(a=>a.stallTypeId===S);console.log("Found stall rate:",_),_&&x.setFieldsValue({ratePerSqm:_.rate})},T=()=>{x.resetFields(),i()},R=()=>{if(console.log("Hall data:",n),!n||!n._id&&!n.id){te.error("Invalid hall selected. Please try again.");return}x.validateFields().then(S=>{var c;const _=n._id||n.id;if(!_){te.error("Hall ID is missing. Please select a hall again.");return}const N=t?{x:t.dimensions.x,y:t.dimensions.y}:f(S.width,S.height,((c=r.stalls)==null?void 0:c.filter(h=>h.hallId===_))||[],n.dimensions.width,n.dimensions.height),a={id:t==null?void 0:t.id,_id:t==null?void 0:t._id,number:S.number,stallTypeId:S.stallTypeId,dimensions:{x:N.x,y:N.y,width:S.width,height:S.height},ratePerSqm:S.ratePerSqm,status:S.status,hallId:_};console.log("Submitting stall data:",a),o(a)})},P=S=>{switch(S){case"available":return"#52c41a";case"booked":return"#faad14";case"reserved":return"#1890ff";default:return"#d9d9d9"}};return e.jsx(e.Fragment,{children:e.jsx(tt,{title:e.jsxs(ae,{children:[e.jsx(Ze,{style:{fontSize:"20px"}}),e.jsx(Su,{level:4,style:{margin:0},children:t?"Edit Stall":"Add Stall"})]}),open:s,onCancel:T,destroyOnClose:!0,forceRender:!0,width:480,centered:!0,footer:[e.jsxs(ae,{size:"middle",children:[t&&l&&e.jsx(H,{danger:!0,icon:e.jsx(Zt,{}),onClick:()=>l(t),children:"Delete"}),e.jsx(H,{onClick:T,children:"Cancel"}),e.jsx(H,{type:"primary",onClick:R,children:t?"Save Changes":"Create"})]},"footer-buttons")],children:e.jsxs(Q,{form:x,layout:"vertical",preserve:!1,requiredMark:"optional",style:{padding:"12px 0"},children:[e.jsx(Q.Item,{name:"number",label:"Stall Number",rules:[{required:!0,message:"Please enter stall number"}],children:e.jsx(se,{placeholder:"Enter stall number",size:"large",style:{borderRadius:"6px"}})}),e.jsx(Q.Item,{name:"stallTypeId",label:"Stall Type",rules:[{required:!0,message:"Please select stall type"}],children:e.jsx(it,{loading:I,placeholder:"Select stall type",size:"large",onChange:w,children:v.map(S=>e.jsx(it.Option,{value:S._id,children:S.name},S._id))})}),e.jsx(Be,{orientation:"left",plain:!0,style:{margin:"24px 0"},children:"Dimensions"}),e.jsxs(ae,{style:{width:"100%",gap:"16px"},children:[e.jsx(Q.Item,{name:"width",label:"Width (meters)",rules:[{required:!0,message:"Please enter width"},{type:"number",min:1,message:"Width must be at least 1 meter"},{type:"number",max:(n==null?void 0:n.dimensions.width)||100,message:"Width cannot exceed hall width"}],style:{flex:1},children:e.jsx(ot,{min:1,max:(n==null?void 0:n.dimensions.width)||100,style:{width:"100%"},size:"large",placeholder:"Width",addonAfter:"m"})}),e.jsx(Q.Item,{name:"height",label:"Height (meters)",rules:[{required:!0,message:"Please enter height"},{type:"number",min:1,message:"Height must be at least 1 meter"},{type:"number",max:(n==null?void 0:n.dimensions.height)||100,message:"Height cannot exceed hall height"}],style:{flex:1},children:e.jsx(ot,{min:1,max:(n==null?void 0:n.dimensions.height)||100,style:{width:"100%"},size:"large",placeholder:"Height",addonAfter:"m"})})]}),e.jsx(Be,{orientation:"left",plain:!0,style:{margin:"24px 0"},children:"Details"}),e.jsx(Q.Item,{name:"ratePerSqm",label:"Rate per sq.m (₹)",rules:[{required:!0,message:"Please select a stall type to set the rate"}],children:e.jsx(ot,{min:0,style:{width:"100%"},size:"large",placeholder:"Rate will be set based on stall type",prefix:"₹",disabled:!0,formatter:S=>`${S}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:S=>{const _=S?Number(S.replace(/\₹\s?|(,*)/g,"")):0;return isNaN(_)?0:_}})}),e.jsx(Q.Item,{name:"status",label:"Status",rules:[{required:!0,message:"Please select status"}],children:e.jsxs(it,{placeholder:"Select status",size:"large",style:{borderRadius:"6px"},children:[e.jsx(it.Option,{value:"available",children:e.jsxs(ae,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:P("available")}}),"Available"]})}),e.jsx(it.Option,{value:"booked",children:e.jsxs(ae,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:P("booked")}}),"Booked"]})}),e.jsx(it.Option,{value:"reserved",children:e.jsxs(ae,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:P("reserved")}}),"Reserved"]})})]})})]})})})},Ni=s=>{if(!s)return"";const t=window.location.origin,n=s.replace(/^\/?(api\/uploads\/)?/,"");if(n.includes("fixtures/"))return`${t}/api/uploads/${n}`;const r=localStorage.getItem("token");return r?`${t}/api/uploads/${n}?token=${r}`:""},ku=({name:s,type:t,color:n,rotation:r,showName:i,iconUrl:o,defaultIcons:l,borderColor:x=null,borderRadius:v=0})=>{g.useEffect(()=>{console.log("FixturePreview rendering with props:",{name:s,type:t,color:n,rotation:r,showName:i,iconUrl:o,defaultIconAvailable:!!l[t],borderColor:x,borderRadius:v})},[s,t,n,r,i,o,l,x,v]);const p=l[t]||"📦";return e.jsxs("div",{style:{padding:"24px",textAlign:"center",backgroundColor:"#fafafa",borderBottom:"1px solid #f0f0f0",borderRadius:"8px 8px 0 0"},children:[e.jsx("div",{style:{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"120px",height:"120px",borderRadius:`${v||4}px`,backgroundColor:n||"#f0f0f0",transform:`rotate(${r}deg)`,transition:"all 0.3s ease",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",overflow:"hidden",position:"relative",border:x?`1px solid ${x}`:"1px solid rgba(0,0,0,0.05)"},children:o?e.jsx("img",{src:o,alt:s,style:{width:"100%",height:"100%",objectFit:"contain",padding:"8px"}}):e.jsx("div",{style:{fontSize:"48px",lineHeight:"1",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:p})}),i&&e.jsx("div",{style:{marginTop:"12px",fontSize:"16px",fontWeight:500,color:"#333"},children:s}),e.jsxs("div",{style:{marginTop:"4px",fontSize:"14px",color:"#888",display:"flex",gap:"8px",justifyContent:"center",alignItems:"center"},children:[e.jsx("span",{children:t.charAt(0).toUpperCase()+t.slice(1)}),e.jsx("span",{children:"•"}),e.jsx("span",{children:n}),r>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:[r,"°"]})]}),x&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Border: ",x]})]}),v>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Radius: ",v,"px"]})]})]})]})},{Text:Eu}=ke,Cn=({activeKey:s,form:t,fixture:n,exhibitionWidth:r,exhibitionHeight:i,selectedType:o,showName:l,iconFileList:x,fixtureTypes:v,fixtureIcons:p,defaultColors:I,defaultDimensions:j,colorPresets:f,uploadProps:w,iconPreviewVisible:T=!1,previewImage:R="",onTypeChange:P,onColorChange:S,onShowNameChange:_,onIconPreviewCancel:N=()=>{}})=>{switch(s){case"basic":return a();case"position":return c();case"appearance":return h();default:return a()}function a(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(Q.Item,{name:"name",label:"Fixture Name",rules:[{required:!0,message:"Please enter fixture name"}],children:e.jsx(se,{placeholder:"Enter fixture name",prefix:e.jsx(Ot,{style:{color:"#aaa"}}),style:{borderRadius:"8px"}})}),e.jsx(Q.Item,{name:"showName",label:"Show Name on Layout",tooltip:"Toggle whether the fixture name appears on the layout",valuePropName:"checked",children:e.jsx(Na,{defaultChecked:!0,checkedChildren:"Visible",unCheckedChildren:"Hidden",onChange:k=>{_(k),console.log("Form values after showName toggle:",t.getFieldsValue(!0))}})}),e.jsx(Q.Item,{name:"type",label:"Fixture Type",rules:[{required:!0,message:"Please select fixture type"}],children:e.jsx(it,{placeholder:"Select fixture type",onChange:P,options:v.map(k=>({...k,label:e.jsxs(ae,{children:[e.jsx("span",{style:{fontSize:16},children:p[k.value]}),e.jsx("span",{children:k.label})]})})),style:{width:"100%",borderRadius:"8px"},listHeight:300,dropdownStyle:{borderRadius:"8px"}})})]})}function c(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(ie,{size:"small",title:"Position (meters)",style:{marginBottom:16,borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:["position","x"],label:"X Position",rules:[{required:!0,message:"X position is required"}],children:e.jsx(ot,{style:{width:"100%",borderRadius:"8px"},min:0,max:r,step:.1,precision:1,placeholder:"X position"})})}),e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:["position","y"],label:"Y Position",rules:[{required:!0,message:"Y position is required"}],children:e.jsx(ot,{style:{width:"100%",borderRadius:"8px"},min:0,max:i,step:.1,precision:1,placeholder:"Y position"})})})]})}),e.jsx(ie,{size:"small",title:"Dimensions (meters)",style:{marginBottom:16,borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:["dimensions","width"],label:"Width",rules:[{required:!0,message:"Width is required"}],children:e.jsx(ot,{style:{width:"100%",borderRadius:"8px"},min:.5,max:20,step:.1,precision:1,placeholder:"Width"})})}),e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:["dimensions","height"],label:"Height",rules:[{required:!0,message:"Height is required"}],children:e.jsx(ot,{style:{width:"100%",borderRadius:"8px"},min:.5,max:20,step:.1,precision:1,placeholder:"Height"})})})]})}),e.jsx(ie,{size:"small",title:e.jsxs("span",{children:[e.jsx(Ra,{})," Rotation (degrees)"]}),style:{borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsx(Q.Item,{name:"rotation",noStyle:!0,children:e.jsx(Aa,{min:0,max:360,marks:{0:"0°",90:"90°",180:"180°",270:"270°",360:"360°"},tooltip:{formatter:k=>`${k}°`},style:{marginTop:10},keyboard:!1})})})]})}function h(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(Q.Item,{name:"color",label:"Color",tooltip:"Choose a color for the fixture. This affects the background color and tint applied to SVG icons.",rules:[{validator:(k,m)=>{try{return m?Promise.resolve():Promise.reject("Please select a color")}catch{return Promise.reject("Please enter a valid color value")}}}],children:e.jsx(ri,{format:"hex",allowClear:!0,showText:!0,disabledAlpha:!0,presets:f,onChange:S,style:{width:"100%"}})}),e.jsx(Q.Item,{name:"borderColor",label:"Border Color",tooltip:"Choose a border color for the fixture. Leave empty for default borders.",children:e.jsx(ri,{format:"hex",allowClear:!0,showText:!0,disabledAlpha:!0,presets:f,style:{width:"100%"}})}),e.jsx(Q.Item,{name:"borderRadius",label:"Border Radius",tooltip:"Set the corner radius in pixels. Higher values make more rounded corners.",children:e.jsx(ot,{min:0,max:20,step:1,style:{width:"100%",borderRadius:"8px"},addonAfter:"px"})}),e.jsxs(ie,{size:"small",title:"Icon Upload",style:{borderRadius:8,marginBottom:16,marginTop:16},styles:{body:{padding:"16px"}},children:[e.jsx("div",{style:{marginBottom:0},children:e.jsx(Ta,{...w,children:x.length<1&&e.jsxs("div",{children:[e.jsx(al,{style:{fontSize:20}}),e.jsx("div",{style:{marginTop:8},children:"Upload Icon"})]})})}),e.jsx(Eu,{type:"secondary",style:{display:"block",marginTop:12},children:"Upload a custom icon or use the default icon for the selected fixture type. Supported formats: PNG, JPG, SVG. SVG icons are preferred for better quality at all sizes."})]}),e.jsx(Q.Item,{name:"icon",label:"Icon URL",tooltip:"URL to an icon image for this fixture. Will be used if no icon is uploaded.",children:e.jsx(se,{placeholder:"https://example.com/icon.png",prefix:e.jsx(ll,{style:{color:"#aaa"}}),style:{borderRadius:"8px"}})}),e.jsx(tt,{open:T,title:"Icon Preview",footer:null,onCancel:N,children:e.jsx("img",{alt:"Icon Preview",style:{width:"100%"},src:R})})]})}},Iu=s=>[{key:"basic",label:e.jsxs("span",{children:[e.jsx(Vr,{}),"Basic Info"]}),children:e.jsx(Cn,{...s,activeKey:"basic"})},{key:"position",label:e.jsxs("span",{children:[e.jsx(ts,{}),"Position"]}),children:e.jsx(Cn,{...s,activeKey:"position"})},{key:"appearance",label:e.jsxs("span",{children:[e.jsx(ol,{}),"Appearance"]}),children:e.jsx(Cn,{...s,activeKey:"appearance"})}],{Text:uf,Title:hf}=ke,{TabPane:pf}=zt,Cu=[{value:"sofa",label:"Sofa"},{value:"chair",label:"Chair"},{value:"table",label:"Table"},{value:"desk",label:"Desk"},{value:"plant",label:"Plant"},{value:"entrance",label:"Entrance"},{value:"exit",label:"Exit"},{value:"info",label:"Information"},{value:"restroom",label:"Restroom"},{value:"food",label:"Food Area"},{value:"custom",label:"Custom"}],Ls={sofa:{width:2,height:1},chair:{width:5,height:5},table:{width:1,height:1},desk:{width:2,height:.8},plant:{width:.5,height:.5},entrance:{width:1.5,height:.2},exit:{width:1.5,height:.2},info:{width:1,height:1},restroom:{width:1,height:1},food:{width:2,height:2},custom:{width:1,height:1}},It={sofa:"#a0d0ff",chair:"#a0d0ff",table:"#e0e0e0",desk:"#e0e0e0",plant:"#90ee90",entrance:"#98fb98",exit:"#ffcccb",info:"#add8e6",restroom:"#d8bfd8",food:"#ffe4b5",custom:"#f0f0f0"},Nn={sofa:"🛋️",chair:"🪑",table:"🪟",desk:"🖥️",plant:"🪴",entrance:"🚪",exit:"🚪",info:"ℹ️",restroom:"🚻",food:"🍽️",custom:"📦"},ff=({visible:s,fixture:t,onCancel:n,onSubmit:r,onDelete:i,exhibitionWidth:o,exhibitionHeight:l})=>{const[x]=Q.useForm(),[v,p]=g.useState(!1),[I,j]=g.useState(""),[f,w]=g.useState("basic"),[T,R]=g.useState(""),[P,S]=g.useState([]),[_,N]=g.useState(!1),[a,c]=g.useState(""),{message:h}=Dr.useApp(),[k,m]=g.useState("#f0f0f0"),[C,d]=g.useState("New Fixture"),[u,y]=g.useState("chair"),[b,E]=g.useState(0),[B,L]=g.useState(!0),[A,$]=g.useState(null),[F,q]=g.useState(0);g.useEffect(()=>{if(s)if(t){const z=Y(t.color),Z=It[t.type]||"#f0f0f0",he=z||Z;console.log("Setting up fixture colors:",{original:t.color,normalized:z,fallback:Z,final:he}),m(he),d(t.name),y(t.type),E(t.rotation||0),j(t.type),L(t.showName!==!1),$(t.borderColor||null),q(t.borderRadius||0)}else{const z="chair",Z=It[z];m(Z),d("New Fixture"),y(z),E(0),j(z),L(!0),$(null),q(0)}},[s,t]),g.useEffect(()=>{if(s&&x){if(t){const z=Y(t.color),Z=It[t.type]||"#f0f0f0",he=z||Z;x.setFieldsValue({name:t.name,type:t.type,position:{x:t.position.x,y:t.position.y},dimensions:{width:t.dimensions.width,height:t.dimensions.height},rotation:t.rotation||0,color:he,icon:t.icon||"",showName:t.showName!==!1,borderColor:t.borderColor||null,borderRadius:t.borderRadius||0});const Ie=t.icon?Ni(t.icon):"";R(Ie),t.icon?S([{uid:"-1",name:t.icon.split("/").pop()||"icon",status:"done",url:Ie,thumbUrl:Ie}]):S([])}else{const z="chair",Z=It[z];x.setFieldsValue({name:"New Fixture",type:z,position:{x:Math.floor(o/2),y:Math.floor(l/2)},dimensions:Ls[z],rotation:0,color:Z,icon:"",showName:!0,borderColor:null,borderRadius:0}),R(""),S([])}w("basic")}},[s,t,x,o,l]);const D=()=>{if(x&&s)try{const z=x.getFieldsValue(!0);if(z.name&&d(z.name),z.type&&y(z.type),z.rotation!==void 0&&E(z.rotation),z.color){const Z=Y(z.color);Z&&m(Z)}if(z.showName!==void 0&&L(z.showName),z.borderColor!==void 0){const Z=z.borderColor?Y(z.borderColor):null;$(Z)}z.borderRadius!==void 0&&q(z.borderRadius)}catch(z){console.log("Error updating preview",z)}};g.useEffect(()=>{if(x&&s)return x.getFieldsValue,D(),()=>{}},[x,s]);const M=z=>{if(j(z),y(z),!t){const Z=It[z]||It.custom;x.setFieldsValue({dimensions:Ls[z]||Ls.custom,color:Z}),m(Z)}},U=z=>{const Z=Y(z);x.setFieldValue("color",Z),m(Z);const he=Object.entries(It).find(([Ie,Te])=>Te.toLowerCase()===Z.toLowerCase());he&&!t&&(x.setFieldValue("type",he[0]),j(he[0]),y(he[0]))},V=()=>(console.log("Rendering fixture preview with:",{name:C,type:u,color:k,rotation:b,showName:B,iconUrl:T,borderColor:A,borderRadius:F}),e.jsx(ku,{name:C,type:u,color:k,rotation:b,showName:B,iconUrl:T,defaultIcons:Nn,borderColor:A,borderRadius:F})),O=({file:z,fileList:Z})=>{var he;if(z.status==="uploading"&&S(Z),z.status==="done"){h.success(`${z.name} uploaded successfully`);let Te=(((he=z.response)==null?void 0:he.url)||"").replace(/^\/api\/uploads\//,"");Te&&!Te.startsWith("fixtures/")&&(Te=`fixtures/${Te.replace(/^\//,"")}`),console.log("Icon path stored in form:",Te),x.setFieldValue("icon",Te);const We=Ni(Te);console.log("Using direct backend URL:",We),R(We);const is=z.name.toLowerCase().endsWith(".svg"),qt=Z.map(Et=>Et.uid===z.uid?{...Et,url:We,thumbUrl:We,type:is?"image/svg+xml":Et.type}:Et);S(qt),console.log("Form values after icon upload:",x.getFieldsValue(!0))}z.status==="error"&&(h.error(`${z.name} upload failed.`),S(Z.filter(Ie=>Ie.uid!==z.uid)))},X={name:"file",action:`${K.defaults.baseURL}/fixtures/upload/icons`,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},accept:"image/png,image/jpeg,image/jpg,image/svg+xml",listType:"picture-card",fileList:P,onChange:O,onPreview:z=>{c(z.url||z.thumbUrl||""),N(!0)},onRemove:()=>(R(""),S([]),x.setFieldValue("icon",""),console.log("Form values after icon removal:",x.getFieldsValue(!0)),!0),maxCount:1,showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0,showDownloadIcon:!1,removeIcon:e.jsx(Zt,{style:{color:"#ff4d4f"}})}},Y=z=>{try{if(!z)return"#f0f0f0";if(typeof z=="object"&&z!==null){if(typeof z.toHexString=="function")return z.toHexString();if(z.rgb||z.hex)return z.hex||`rgb(${z.rgb.r},${z.rgb.g},${z.rgb.b})`}if(typeof z=="string"){if(/^#([0-9A-F]{3}){1,2}$/i.test(z))return z;if(/^([0-9A-F]{3}){1,2}$/i.test(z))return`#${z}`;if(/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(z))return z}return"#f0f0f0"}catch(Z){return console.error("Error normalizing color:",Z),"#f0f0f0"}},pe=[{label:"Primary Colors",colors:["#1890ff","#52c41a","#faad14","#f5222d","#722ed1"]},{label:"Neutrals",colors:["#000000","#262626","#595959","#8c8c8c","#bfbfbf","#d9d9d9","#f0f0f0","#ffffff"]}],fe=Ae.useCallback(()=>{t&&i&&i(t)},[t,i]),ue=z=>{w(z),document.activeElement instanceof HTMLElement&&document.activeElement.blur()},re=Iu({form:x,fixture:t,exhibitionWidth:o,exhibitionHeight:l,selectedType:I,showName:B,iconFileList:P,fixtureTypes:Cu,fixtureIcons:Nn,defaultColors:It,defaultDimensions:Ls,colorPresets:pe,uploadProps:X,iconPreviewVisible:_,previewImage:a,onTypeChange:M,onColorChange:U,onShowNameChange:z=>L(z),onIconPreviewCancel:()=>N(!1),activeKey:f}),me=async()=>{try{p(!0);const z=await x.validateFields();d(z.name),y(z.type),E(z.rotation||0),m(Y(z.color)),L(z.showName),$(z.borderColor?Y(z.borderColor):null),q(z.borderRadius||0);let Z="";z.icon?Z=Fe(z.icon):t!=null&&t.icon&&(Z=t.icon),console.log("Form values being submitted:",{name:z.name,type:z.type,color:z.color,icon:z.icon,originalIcon:t==null?void 0:t.icon,cleanedIcon:Z,showName:z.showName,borderColor:z.borderColor,borderRadius:z.borderRadius});const he=(t==null?void 0:t._id)||(t==null?void 0:t.id)||"",Ie=z.color?Y(z.color):(t==null?void 0:t.color)||"#f0f0f0",Te=z.borderColor?Y(z.borderColor):null,We={...t,id:he,_id:he,name:z.name,type:z.type,position:z.position,dimensions:z.dimensions,rotation:z.rotation,color:Ie,icon:Z,zIndex:(t==null?void 0:t.zIndex)||1,isActive:(t==null?void 0:t.isActive)!==void 0?t.isActive:!0,borderColor:Te,borderRadius:z.borderRadius||0};he&&(We.showName=z.showName),console.log("Submitting fixture with icon path:",Z),console.log("Color being submitted:",Ie),await r(We),n()}catch(z){console.error("Fixture submission failed:",z),h.error("Failed to save fixture. Please check the form and try again.")}finally{p(!1)}},Fe=z=>{if(!z||typeof z!="string")return"";if(z.startsWith("fixtures/")&&!z.includes("?")&&!z.includes("http"))return z;let Z=z.replace(/^\/api\/uploads\//,"");if(Z=Z.replace(/^\//,""),Z.includes("?")||Z.includes("http")){const he=Z.split("?")[0].split("/").pop()||"";if(he)return`fixtures/${he}`}return Z&&!Z.startsWith("fixtures/")?`fixtures/${Z}`:Z};return e.jsxs(tt,{title:e.jsxs("div",{style:{padding:"8px 0",display:"flex",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:24,marginRight:8},children:t?Nn[t.type]:"🪑"}),e.jsx("span",{children:t?`Edit ${t.name}`:"Add New Fixture"})]}),open:s,onCancel:n,confirmLoading:v,footer:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("div",{children:t&&i&&e.jsx(H,{danger:!0,icon:e.jsx(Zt,{}),onClick:fe,style:{borderRadius:"6px"},children:"Delete"})}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(H,{onClick:n,icon:e.jsx(_a,{}),style:{borderRadius:"6px"},children:"Cancel"}),e.jsx(H,{type:"primary",onClick:me,icon:e.jsx(xo,{}),style:{borderRadius:"6px"},children:t?"Update":"Create"})]})]}),width:560,centered:!0,styles:{header:{borderBottom:"1px solid #f0f0f0",padding:"16px 24px"},body:{backgroundColor:"#fff",borderRadius:"0 0 8px 8px",padding:"0"},footer:{borderTop:"1px solid #f0f0f0",padding:"12px 24px",margin:0}},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .svg-icon {
          filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.2));
        }
        
        /* Fix for passive event listener warnings */
        .ant-slider, .ant-slider-handle, .ant-color-picker-trigger, .ant-color-picker-dropdown {
          touch-action: none !important;
        }
        
        .ant-slider-rail, .ant-slider-track {
          touch-action: pan-y !important;
        }
        
        .ant-tabs-tab, .ant-select-selector, .ant-input-number-input, .ant-color-picker-slider, .ant-color-picker-palette {
          touch-action: manipulation !important;
        }
        
        /* Fix circular references warning */
        .ant-color-picker-trigger-disabled .ant-color-picker-clear {
          display: none;
        }
      `}}),V(),e.jsx(Q,{form:x,layout:"vertical",initialValues:{name:"New Fixture",type:"chair",position:{x:0,y:0},dimensions:{width:1,height:1},rotation:0,color:"#f0f0f0",icon:"",showName:!0,borderColor:null,borderRadius:0},style:{padding:"0 24px 20px"},onValuesChange:D,children:e.jsx(zt,{activeKey:f,onChange:ue,items:re,tabBarStyle:{marginBottom:16},centered:!0})})]})},Nu=W(tt)`
  .ant-modal-content {
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  .ant-modal-header {
    padding: 24px 32px;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background: linear-gradient(to right, #4b47b9, #3f51b5);
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-close {
    color: white;
  }
`,Au=W.div`
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9fa;
  margin-bottom: 24px;
  
  .step-item {
    padding: 16px 24px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #666;
    gap: 10px;
    
    &.active {
      color: #4b47b9;
      font-weight: 500;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #4b47b9;
      }
      
      .step-icon {
        background-color: #4b47b9;
        color: white;
      }
    }
    
    &.completed {
      .step-icon {
        background-color: #52c41a;
        color: white;
      }
    }
    
    .step-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`,gs=W.div`
  padding: 24px 32px 32px;
`,Ru=W.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
`,Tu=W.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;W.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  .search-input {
    width: 240px;
    border-radius: 8px;
  }
  
  .filter-select {
    width: 160px;
    border-radius: 8px;
  }
`;W.div`
  margin-bottom: 24px;
  
  .tab-header {
    display: flex;
    margin-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .tab-item {
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &.active {
        color: #4b47b9;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #4b47b9;
          border-radius: 2px 2px 0 0;
        }
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #666;
        font-size: 12px;
        height: 20px;
        min-width: 20px;
        padding: 0 8px;
        border-radius: 10px;
        margin-left: 8px;
        
        &.active {
          background: #4b47b9;
          color: white;
        }
      }
    }
  }
`;W.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;W.div`
  border: 1px solid ${s=>s.selected?"#4b47b9":"#e6e6f0"};
  background: ${s=>s.selected?"rgba(75, 71, 185, 0.05)":"white"};
  border-radius: 12px;
  padding: 20px;
  padding-left: 48px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: ${s=>s.selected?"0 4px 12px rgba(75, 71, 185, 0.15)":"0 2px 8px rgba(0, 0, 0, 0.04)"};
  cursor: pointer;
  
  &:hover {
    border-color: #4b47b9;
    box-shadow: 0 4px 12px rgba(75, 71, 185, 0.15);
    transform: translateY(-2px);
  }
  
  .stall-price {
    position: absolute;
    top: 16px;
    right: 16px;
    background: ${s=>s.selected?"#4b47b9":"#52c41a"};
    color: white;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .stall-number {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f1f1f;
    display: flex;
    align-items: center;
    
    .hall-label {
      font-size: 13px;
      color: #666;
      margin-left: 8px;
      font-weight: normal;
    }
  }
  
  .stall-details {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    
    .detail-item {
      flex: 1;
      
      .label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
  
  .selection-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    background: ${s=>s.selected?"#4b47b9":"white"};
    border: 2px solid ${s=>s.selected?"#4b47b9":"#d9d9d9"};
    color: white;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;const _u=W(ie)`
  background: #f9fafc;
  border-radius: 12px;
  margin-top: 24px;
  border: 1px solid #eaecf0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
  
  .ant-card-head {
    background: #f2f4f7;
    border-bottom-color: #eaecf0;
    padding: 16px 24px;
    min-height: 48px;
    
    .ant-card-head-title {
      padding: 0;
      font-size: 16px;
      font-weight: 600;
      color: #101828;
    }
  }
  
  .ant-card-body {
    padding: 16px 24px 24px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid #eaecf0;
    }
    
    .label {
      color: #475467;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      text-align: right;
      color: #1f2937;
    }
    
    &.discount {
      color: #ef4444;
      
      .value {
        color: #ef4444;
      }
    }
    
    &.total {
      font-weight: 600;
      font-size: 16px;
      color: #101828;
      border-top: 1px solid #eaecf0;
      margin-top: 8px;
      padding-top: 16px;
      
      .label, .value {
        font-size: 16px;
        font-weight: 700;
        color: #101828;
      }
    }
  }
`;W(H)`
  &.ant-btn-primary {
    background: #4b47b9;
    border-color: #4b47b9;
    
    &:hover, &:focus {
      background: #3b37a9;
      border-color: #3b37a9;
    }
  }
  
  &.ant-btn-lg {
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-radius: 8px;
  }
`;W.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;W(ie)`
  background: #f8f8fc;
  border-radius: 12px;
  border: 1px solid #e6e6f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;W(se)`
  &.ant-input-lg {
    border-radius: 8px;
    border: 1px solid #e6e6f0;
    background: white;
    padding: 12px 16px;
    height: auto;
    
    &:hover, &:focus {
      border-color: #4b47b9;
      box-shadow: 0 0 0 2px rgba(75, 71, 185, 0.1);
    }
  }
  
  .anticon {
    color: #4b47b9;
  }
`;const An=W(H)`
  &.ant-btn-lg {
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    border-radius: 6px;
    font-weight: 500;
    
    &.ant-btn-primary {
      background: #4b47b9;
      border-color: #4b47b9;
      
      &:hover {
        background: #3f3fa0;
        border-color: #3f3fa0;
      }
    }

    &:not(.ant-btn-primary) {
      border-color: #d9d9d9;
      
      &:hover {
        color: #4b47b9;
        border-color: #4b47b9;
      }
    }
  }
`;W(ye)`
  .ant-descriptions-item-label {
    background: #f8f8fc !important;
    font-weight: 600;
    color: #1f1f1f;
  }
  
  .ant-descriptions-item-content {
    background: white !important;
  }
`;W.div`
  background: #f8f8fc;
  padding: 32px 0;
  border-bottom: 1px solid #e6e6f0;
  margin: -32px -32px 32px;
`;W(Es)`
  max-width: 900px;
  margin: 0 auto;

  .ant-steps-item {
    padding: 0 12px;
    margin: 0;
    
    &:first-of-type {
      padding-left: 0;
    }
    
    &:last-of-type {
      padding-right: 0;
    }
  }

  .ant-steps-item-container {
    position: relative;
  }

  .ant-steps-item-tail {
    padding: 0;
    top: 13px;
    margin: 0;
    
    &::after {
      height: 1px;
      margin: 0;
      background: #e6e6f0;
    }
  }

  .ant-steps-item-icon {
    width: 28px;
    height: 28px;
    line-height: 28px;
    margin-right: 8px;
    font-size: 14px;
    border: none;
    background: #e6e6f0;
    
    .anticon {
      font-size: 14px;
      top: 0;
    }
  }

  .ant-steps-item-content {
    display: inline-block;
  }

  .ant-steps-item-title {
    font-size: 14px;
    line-height: 28px;
    padding-right: 8px;
    color: rgba(0, 0, 0, 0.45);
    font-weight: normal;
    
    &::after {
      height: 1px;
      top: 14px;
      background: #e6e6f0 !important;
    }
  }

  .ant-steps-item-description {
    max-width: 140px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }

  .ant-steps-item-active {
    .ant-steps-item-icon {
      background: #4b47b9;
      border: none;
      
      .ant-steps-icon {
        color: white;
      }
    }
    
    .ant-steps-item-title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      
      &::after {
        background: #e6e6f0;
      }
    }
    
    .ant-steps-item-description {
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background: #4b47b9;
      border: none;
      
      .ant-steps-icon {
        color: white;
      }
    }
    
    .ant-steps-item-title {
      color: rgba(0, 0, 0, 0.85);
      
      &::after {
        background: #4b47b9 !important;
      }
    }
    
    .ant-steps-item-tail::after {
      background: #4b47b9;
    }
  }

  .ant-steps-item-wait {
    .ant-steps-item-icon {
      background: #e6e6f0;
      border: none;
      
      .ant-steps-icon {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
`;W.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;

  .company-name {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  .contact-details {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
`;W.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e6e6f0;
  }
`;W.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;W.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
`;W.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 338px; /* Height for 3 cards: (102px × 3) + (16px × 2 gaps) */
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #bbb;
    }
  }
`;W(ie)`
  &.ant-card {
    background: #f8f8fc;
    border: 1px solid #e6e6f0;
    border-radius: 8px;
    position: sticky;
    top: 24px;
  }

  .calculation-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .total-row {
    border-top: 1px solid #e6e6f0;
    margin-top: 16px;
    padding-top: 16px;
    font-weight: 600;
  }
`;const Ai=({form:s,stallDetails:t=[],selectedStallId:n,selectedStallIds:r=[],exhibition:i})=>{const[o,l]=g.useState([]);g.useEffect(()=>{let w=[...(s.getFieldValue("selectedStalls")||[]).map(T=>String(T))];if(n){const T=String(n);w.some(R=>R===T)||w.push(T)}r.length>0&&r.forEach(T=>{const R=String(T);w.some(P=>P===R)||w.push(R)}),console.log("StallDetailsStep - Initial stalls after normalization:",w),s.setFieldsValue({selectedStalls:w}),l(w)},[s,n,r]),g.useEffect(()=>{if(o.length>0){const j=s.getFieldValue("selectedStalls")||[],f=new Set(j.map(R=>String(R))),w=new Set(o.map(R=>String(R)));let T=f.size!==w.size;if(!T){for(const R of w)if(!f.has(R)){T=!0;break}}if(T){console.log("Syncing form with selected stalls:",o);const R=o.map(P=>String(P));s.setFieldsValue({selectedStalls:R}),s.validateFields(["selectedStalls"]).catch(P=>{})}}},[o,s]);const x=g.useMemo(()=>!t||t.length===0?[]:t.filter(j=>o.includes(j.id)),[t,o]),v=g.useMemo(()=>{var a,c,h;if(!t||t.length===0)return{baseAmount:0,discounts:[],totalDiscountAmount:0,amountAfterDiscount:0,taxes:[],totalTaxAmount:0,total:0,selectedStallNumbers:""};const j=t.filter(k=>o.includes(k.id)),f=j.reduce((k,m)=>k+(m.price||m.ratePerSqm*m.dimensions.width*m.dimensions.height),0),T=(((a=i==null?void 0:i.publicDiscountConfig)==null?void 0:a.filter(k=>k.isActive))||[]).map(k=>{const m=k.type==="percentage"?f*(Math.min(Math.max(0,k.value),100)/100):Math.min(k.value,f);return{name:k.name,type:k.type,value:k.value,amount:m}}),R=T.reduce((k,m)=>k+m.amount,0),P=f-R,S=((h=(c=i==null?void 0:i.taxConfig)==null?void 0:c.filter(k=>k.isActive))==null?void 0:h.map(k=>({name:k.name,rate:k.rate,amount:P*(k.rate/100)})))||[],_=S.reduce((k,m)=>k+m.amount,0),N=P+_;return{baseAmount:f,discounts:T,totalDiscountAmount:R,amountAfterDiscount:P,taxes:S,totalTaxAmount:_,total:N,selectedStallNumbers:j.map(k=>`${k.number||k.stallNumber||`Stall ${k.id}`} (${k.hallName||`Hall ${k.hallId||1}`})`).join(", ")}},[t,o,i==null?void 0:i.taxConfig,i==null?void 0:i.publicDiscountConfig]),p=j=>{const f=String(j);if(o.some(T=>String(T)===f)){const T=o.filter(R=>String(R)!==f);l(T),s.setFieldsValue({selectedStalls:T}),te.info("Stall removed from selection")}},I=j=>`₹${j.toLocaleString("en-IN")}`;return e.jsxs(gs,{children:[e.jsx(Ru,{children:"Your Selected Stalls"}),e.jsx(Tu,{children:"Review your selected stalls. You can remove a stall by clicking the delete button."}),e.jsx(Q.Item,{name:"selectedStalls",rules:[{required:!0,message:"Please select at least one stall"}],style:{display:"none"},children:e.jsx(it,{mode:"multiple"})}),x.length>0?e.jsx("div",{style:{marginBottom:24,background:"#fff",borderRadius:"8px",padding:"16px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.06)"},children:e.jsx(He,{dataSource:x.map(j=>({...j,key:j.id,price:j.price||j.ratePerSqm*j.dimensions.width*j.dimensions.height,area:j.dimensions.width*j.dimensions.height,dimensions:`${j.dimensions.width}m × ${j.dimensions.height}m`,size:`${j.dimensions.width}m × ${j.dimensions.height}m`,stallType:j.stallType||{name:j.typeName||j.type||"Standard"},type:j.typeName||j.type||"Standard"})),pagination:!1,size:"middle",rowClassName:()=>"stall-table-row",className:"selected-stalls-table",style:{borderRadius:"6px",overflow:"hidden"},columns:[{title:"Stall",dataIndex:"number",key:"number",render:(j,f)=>e.jsxs("span",{style:{fontWeight:600,fontSize:"15px"},children:["Stall ",j||f.stallNumber]})},{title:"Hall",dataIndex:"hallName",key:"hallName",render:(j,f)=>e.jsx(ne,{color:"blue",style:{borderRadius:"4px"},children:j||`Hall ${f.hallId}`})},{title:"Stall Type",dataIndex:"stallType",key:"stallType",align:"center",render:(j,f)=>{var T;const w=((T=f.stallType)==null?void 0:T.name)||f.type||"Standard";return e.jsx(ne,{color:"purple",style:{borderRadius:"4px",padding:"2px 8px"},children:w})}},{title:"Dimensions",dataIndex:"dimensions",key:"dimensions",align:"center",render:(j,f)=>e.jsxs(ae,{direction:"vertical",size:0,children:[e.jsx("span",{style:{fontWeight:500},children:j}),e.jsxs("span",{style:{color:"#888",fontSize:"13px"},children:[f.area," sqm"]})]})},{title:"Rate",dataIndex:"ratePerSqm",key:"ratePerSqm",align:"right",render:(j,f)=>e.jsxs("span",{style:{color:"#555"},children:["₹",(f.ratePerSqm||0).toLocaleString("en-IN"),"/sqm"]})},{title:"Price",dataIndex:"price",key:"price",align:"right",render:j=>e.jsx("span",{style:{fontWeight:600,color:"#1890ff",fontSize:"15px",display:"block",padding:"4px 8px",background:"rgba(24, 144, 255, 0.1)",borderRadius:"4px",textAlign:"right"},children:I(j)})},{title:"",key:"action",width:70,align:"center",render:(j,f)=>e.jsx(St,{title:"Remove from selection",children:e.jsx(H,{type:"text",danger:!0,icon:e.jsx(Zt,{}),onClick:()=>p(f.id),size:"middle",style:{borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center"}})})}]})}):e.jsx(Ce,{description:"No stalls selected yet. Please select stalls from the layout.",image:Ce.PRESENTED_IMAGE_SIMPLE,style:{margin:"32px 0"}}),o.length>0&&e.jsxs(_u,{title:e.jsx("span",{style:{fontSize:"16px",fontWeight:600},children:"Booking Summary"}),style:{borderRadius:"8px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.06)"},headStyle:{background:"#f6f8fa",borderBottom:"1px solid #eee"},bodyStyle:{padding:"16px 24px"},children:[e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Selected Stalls"}),e.jsxs("div",{className:"value",children:[o.length," stall(s) selected"]})]}),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Stall Numbers"}),e.jsx("div",{className:"value",style:{maxWidth:"60%",wordBreak:"break-word"},children:v.selectedStallNumbers})]}),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Base Amount"}),e.jsx("div",{className:"value",children:I(v.baseAmount)})]}),v.discounts.map((j,f)=>e.jsxs("div",{className:"summary-row discount",children:[e.jsxs("div",{className:"label",children:[j.name,j.type==="percentage"?` (${j.value}%)`:""]}),e.jsxs("div",{className:"value",style:{color:"#52c41a"},children:["- ",I(j.amount)]})]},`discount-${f}`)),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Amount after Discount"}),e.jsx("div",{className:"value",style:{fontWeight:500},children:I(v.amountAfterDiscount)})]}),v.taxes.map((j,f)=>e.jsxs("div",{className:"summary-row",children:[e.jsxs("div",{className:"label",children:[j.name," (",j.rate,"%)"]}),e.jsxs("div",{className:"value",style:{color:"#faad14"},children:["+ ",I(j.amount)]})]},`tax-${f}`)),e.jsxs("div",{className:"summary-row total",style:{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid #f0f0f0"},children:[e.jsx("div",{className:"label",style:{fontSize:"16px",fontWeight:600},children:"Total"}),e.jsx("div",{className:"value",style:{fontSize:"18px",fontWeight:700,color:"#1890ff"},children:I(v.total)})]})]})]})},{Title:Pu,Paragraph:Ri,Text:bt}=ke,{Panel:mf}=Pa,{Option:Du}=it,Ti=({form:s,formValues:t,selectedStallIds:n=[],exhibition:r,stallDetails:i=[]})=>{const o=s.getFieldValue("selectedStalls")||n||[],[l,x]=g.useState(s.getFieldValue("amenities")||[]),[v,p]=g.useState({}),I=g.useMemo(()=>i!=null&&i.length?i.filter(h=>o.includes(h.id)):[],[i,o]),j=g.useMemo(()=>I.reduce((h,k)=>h+k.dimensions.width*k.dimensions.height,0),[I]),f=(r==null?void 0:r.basicAmenities)&&r.basicAmenities.length>0,w=(r==null?void 0:r.amenities)&&r.amenities.length>0,T=g.useMemo(()=>!f||j===0?[]:((r==null?void 0:r.basicAmenities)||[]).map(h=>{const k=Math.floor(j/h.perSqm)*h.quantity;return{...h,calculatedQuantity:k>0?k:0,key:h._id||h.id}}),[r,f,j]),R=h=>{const k={...v};h.forEach(m=>{l.includes(m)||(k[m]=1)}),Object.keys(k).forEach(m=>{h.includes(m)||delete k[m]}),p(k),x(h)},P=h=>(h._id||h.id||"").toString(),S=(h,k)=>{p(m=>({...m,[h]:k}))};Ae.useEffect(()=>{const h=l.map(k=>({id:k,quantity:v[k]||1}));s.setFieldsValue({amenities:h})},[l,v,s]);const _=h=>`₹${h.toLocaleString("en-IN")}`,N=g.useMemo(()=>w?((r==null?void 0:r.amenities)||[]).filter(h=>l.includes(P(h))).map(h=>({...h,key:P(h),quantity:v[P(h)]||1})):[],[r,w,l,v]),a=[{title:"Name",dataIndex:"name",key:"name",render:(h,k)=>e.jsxs(ae,{children:[e.jsx(bt,{strong:!0,children:h}),e.jsx(ne,{color:"blue",children:k.type})]})},{title:"Quantity",dataIndex:"calculatedQuantity",key:"calculatedQuantity",width:120,render:h=>e.jsxs(ne,{color:"green",children:[h," ",h===1?"unit":"units"]})},{title:"Allocation",dataIndex:"perSqm",key:"perSqm",width:180,render:(h,k)=>e.jsx(St,{title:k.description,children:e.jsxs(bt,{type:"secondary",children:[e.jsx(Ot,{style:{marginRight:5}}),"1 ",k.quantity>1?`set of ${k.quantity}`:"unit"," per ",h," sqm"]})})}],c=[{title:"Name",dataIndex:"name",key:"name",render:(h,k)=>e.jsxs(ae,{align:"center",children:[e.jsx(bt,{strong:!0,children:h}),e.jsx(ne,{color:"blue",children:k.type}),e.jsx(bt,{type:"secondary",style:{fontSize:"13px"},children:k.description})]})},{title:"Rate",dataIndex:"rate",key:"rate",width:120,render:h=>e.jsx(bt,{strong:!0,style:{color:"#1890ff"},children:_(h)})},{title:"Quantity",dataIndex:"quantity",key:"quantity",width:120,render:(h,k)=>e.jsx(ot,{min:1,value:v[k.key]||1,onChange:m=>S(k.key,m||1),style:{width:"100%"}})},{title:"Total",key:"total",width:120,render:(h,k)=>{const m=v[k.key]||1,C=k.rate*m;return e.jsx(bt,{strong:!0,style:{color:"#1890ff"},children:_(C)})}}];return e.jsxs(gs,{children:[e.jsx(Pu,{level:4,children:"Stall Amenities"}),e.jsx(Ri,{type:"secondary",style:{marginBottom:24},children:"Review included amenities and select additional amenities for your exhibition stalls."}),e.jsx(ie,{title:`Selected Stalls: ${o.length}`,style:{marginBottom:24},children:o.length>0?e.jsxs(Ri,{children:["You've selected ",o.length," stall(s) with a total area of ",j," sq. meters."]}):e.jsx(Ce,{image:Ce.PRESENTED_IMAGE_SIMPLE,description:"No stalls selected"})}),e.jsx(ie,{title:e.jsxs(ae,{children:[e.jsx(kt,{status:"success"}),"Included Amenities"]}),style:{marginBottom:24},children:o.length===0?e.jsx(qe,{message:"Select stalls first",description:"Please select stalls to see what amenities are included.",type:"info",showIcon:!0}):f?e.jsx(He,{dataSource:T.filter(h=>h.calculatedQuantity>0),columns:a,pagination:!1,size:"small",locale:{emptyText:e.jsx(Ce,{image:Ce.PRESENTED_IMAGE_SIMPLE,description:"Your stall area is too small to qualify for any basic amenities."})}}):e.jsx(Ce,{image:e.jsx(di,{style:{fontSize:60,color:"#cccccc"}}),description:"No basic amenities have been configured for this exhibition."})}),e.jsx(Be,{}),e.jsx(ie,{title:"Additional Amenities (Extra Charges)",children:w?e.jsxs("div",{children:[e.jsx(Q.Item,{label:"Select Additional Amenities",style:{marginBottom:24},children:e.jsx(it,{mode:"multiple",style:{width:"100%"},placeholder:"Select amenities",value:l,onChange:R,optionLabelProp:"label",children:((r==null?void 0:r.amenities)||[]).map(h=>e.jsxs(Du,{value:P(h),label:`${h.name} (${_(h.rate)})`,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsxs(ae,{children:[e.jsx(bt,{strong:!0,children:h.name}),e.jsx(ne,{color:"blue",children:h.type})]}),e.jsx(bt,{style:{color:"#1890ff"},children:_(h.rate)})]}),e.jsx("div",{children:e.jsx(bt,{type:"secondary",children:h.description})})]},P(h)))})}),N.length>0&&e.jsxs("div",{style:{marginTop:16},children:[e.jsx(Be,{orientation:"left",children:"Selected Amenities"}),e.jsx(He,{dataSource:N,columns:c,pagination:!1,size:"small"})]})]}):e.jsx(Ce,{image:e.jsx(di,{style:{fontSize:60,color:"#cccccc"}}),description:"No additional amenities are available for this exhibition."})}),e.jsx(Q.Item,{name:"amenities",hidden:!0,children:e.jsx(se,{type:"hidden"})}),e.jsx(Q.Item,{name:"selectedStalls",hidden:!0,children:e.jsx(se,{type:"hidden"})})]})},{Title:Rn,Paragraph:_i,Text:we}=ke,Pi=({form:s,stallDetails:t=[],selectedStallId:n,selectedStallIds:r=[],selectedStalls:i=[],exhibition:o,onPrev:l,onFinish:x,loading:v=!1,formValues:p={}})=>{const[I,j]=g.useState([]),f=g.useMemo(()=>{const c=(s.getFieldValue("selectedStalls")||[]).map(k=>String(k));if(console.log("ReviewStep - Form has selectedStalls:",c),console.log("ReviewStep - Props selectedStallIds:",r),console.log("ReviewStep - Props selectedStalls:",i),c.length>0)return c;const h=[];if(n){const k=String(n);h.push(k)}return r&&r.length&&r.forEach(k=>{const m=String(k);h.includes(m)||h.push(m)}),i&&i.length&&i.forEach(k=>{const m=String(k);h.includes(m)||h.push(m)}),console.log("ReviewStep - Final consolidated stall IDs:",h),h},[s,n,r,i]);g.useEffect(()=>{if(console.log("ReviewStep - Processing stall details with IDs:",f),console.log("ReviewStep - Available stall details:",t),t&&t.length&&f.length){const a=t.filter(h=>f.includes(String(h.id)));console.log("ReviewStep - Matched stalls:",a.length);const c=a.map(h=>({key:h.id,id:h.id,number:h.number||h.stallNumber||`Stall ${h.id}`,hallName:h.hallName||`Hall ${h.hallId}`,size:`${h.dimensions.width}m × ${h.dimensions.height}m`,area:h.dimensions.width*h.dimensions.height,rate:h.ratePerSqm,price:h.price||h.ratePerSqm*h.dimensions.width*h.dimensions.height,type:h.typeName||h.type||"Standard"}));j(c)}},[t,f]);const w=g.useMemo(()=>{var A,$,F,q;const a=I.reduce((D,M)=>D+M.price,0),c=I.reduce((D,M)=>D+(M.area||0),0),h=((A=o==null?void 0:o.basicAmenities)==null?void 0:A.map(D=>{const M=Math.floor(c/D.perSqm)*D.quantity;return{...D,calculatedQuantity:M>0?M:0}}))||[],k=s.getFieldValue("amenities")||[];console.log("ReviewStep - Selected amenities with quantities:",k);let m=0;const C=k.map(D=>{var O;const M=D.id,U=D.quantity||1,V=(O=o==null?void 0:o.amenities)==null?void 0:O.find(X=>X.id===M||X._id===M);if(V){const X=(V.rate||0)*U;return m+=X,{name:V.name,rate:V.rate,type:V.type,description:V.description,quantity:U,total:X}}return null}).filter(Boolean);console.log("ReviewStep - Processed amenity items:",C);const u=((($=o==null?void 0:o.publicDiscountConfig)==null?void 0:$.filter(D=>D.isActive))||[]).map(D=>{const M=D.type==="percentage"?a*(Math.min(Math.max(0,D.value),100)/100):Math.min(D.value,a);return{name:D.name,type:D.type,value:D.value,amount:M}}),y=u.reduce((D,M)=>D+M.amount,0),b=a-y,E=b,B=((q=(F=o==null?void 0:o.taxConfig)==null?void 0:F.filter(D=>D.isActive))==null?void 0:q.map(D=>({name:D.name,rate:D.rate,amount:E*(D.rate/100)})))||[],L=B.reduce((D,M)=>D+M.amount,0);return{baseAmount:a,basicAmenities:h,totalStallArea:c,amenities:C,amenitiesTotal:m,discounts:u,totalDiscountAmount:y,amountAfterDiscount:b,subtotal:E,taxes:B,totalTaxAmount:L,total:E+L,stallCount:I.length}},[I,s,o]);g.useEffect(()=>{var c;const a=((c=o==null?void 0:o.publicDiscountConfig)==null?void 0:c.filter(h=>h.isActive))||[];if(a.length>0){const h=a[0];console.log("Setting discountId in form to:",h),s.setFieldsValue({discountId:{name:h.name,type:h.type,value:h.value}})}},[o,s]);const T=[{title:"Stall Number",dataIndex:"number",key:"number"},{title:"Hall",dataIndex:"hallName",key:"hallName"},{title:"Stall Type",dataIndex:"type",key:"type",render:(a,c)=>e.jsx(ne,{color:"purple",children:a},`stall-type-${c.key}`)},{title:"Size",dataIndex:"size",key:"size"},{title:"Area",dataIndex:"area",key:"area",render:(a,c)=>e.jsxs("span",{children:[a," sqm"]},`stall-area-${c.key}`)},{title:"Rate",dataIndex:"rate",key:"rate",render:(a,c)=>e.jsxs("span",{children:["₹",a,"/sqm"]},`stall-rate-${c.key}`)},{title:"Price",dataIndex:"price",key:"price",render:(a,c)=>e.jsxs("span",{children:["₹",a.toLocaleString()]},`stall-price-${c.key}`)}],R=a=>`₹${a.toLocaleString("en-IN")}`,P=p.customerName||s.getFieldValue("customerName"),S=p.customerPhone||s.getFieldValue("customerPhone"),_=p.email||s.getFieldValue("email"),N=p.companyName||s.getFieldValue("companyName");return console.log("ReviewStep - Exhibitor Info:",{customerName:P,companyName:N,customerPhone:S,customerEmail:_,formValues:p,formFieldValues:{customerName:s.getFieldValue("customerName"),companyName:s.getFieldValue("companyName"),customerPhone:s.getFieldValue("customerPhone"),email:s.getFieldValue("email")}}),v?e.jsx(gs,{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"300px"},children:e.jsx(et,{size:"large",tip:"Processing your booking..."})}):f.length===0?e.jsxs(gs,{children:[e.jsx(qe,{message:"No Stalls Selected",description:"Please go back and select at least one stall to book.",type:"warning",showIcon:!0}),e.jsx("div",{style:{marginTop:24,textAlign:"right"},children:e.jsx(H,{onClick:l,children:"Back to Stall Selection"})})]}):e.jsxs(gs,{children:[e.jsx(Q.Item,{name:"discountId",hidden:!0,children:e.jsx(se,{})}),e.jsx(Rn,{level:4,children:"Booking Summary"}),e.jsx(_i,{type:"secondary",style:{marginBottom:24},children:"Please review your booking details before submitting."}),e.jsx(ie,{title:"Exhibitor Information",style:{marginBottom:24},children:e.jsxs(ye,{column:2,children:[e.jsx(ye.Item,{label:"Name",children:P||"Not provided"}),e.jsx(ye.Item,{label:"Company",children:N||"Not provided"}),e.jsx(ye.Item,{label:"Phone",children:S||"Not provided"}),e.jsx(ye.Item,{label:"Email",children:_||"Not provided"})]})}),e.jsxs(ie,{title:"Selected Stalls",className:"review-card",size:"small",children:[e.jsx(He,{dataSource:I,columns:T,pagination:!1,size:"small",style:{marginBottom:16}}),e.jsxs(we,{strong:!0,children:["Total Base Amount: ",R(w.baseAmount)]})]}),w.basicAmenities&&w.basicAmenities.length>0&&e.jsxs(ie,{title:e.jsxs(ae,{children:[e.jsx(kt,{status:"success"}),"Included Basic Amenities"]}),style:{marginBottom:24},children:[e.jsxs(_i,{type:"secondary",style:{marginBottom:16},children:["The following amenities are included based on your total stall area of ",w.totalStallArea," sqm."]}),e.jsx(He,{dataSource:w.basicAmenities.filter(a=>a.calculatedQuantity>0).map((a,c)=>({...a,key:`basic-${c}`})),columns:[{title:"Name",dataIndex:"name",key:"name",render:(a,c)=>e.jsxs(ae,{children:[e.jsx(we,{strong:!0,children:a}),e.jsx(ne,{color:"blue",children:c.type})]},`name-${c.key}`)},{title:"Quantity",dataIndex:"calculatedQuantity",key:"calculatedQuantity",width:120,render:(a,c)=>e.jsxs(ne,{color:"green",children:[a," ",a===1?"unit":"units"]},`quantity-${c.key}`)},{title:"Allocation",dataIndex:"perSqm",key:"perSqm",width:180,render:(a,c)=>e.jsxs(we,{type:"secondary",children:[e.jsx(Ot,{style:{marginRight:5}}),"1 ",c.quantity>1?`set of ${c.quantity}`:"unit"," per ",a," sqm"]},`allocation-${c.key}`)},{title:"Status",key:"status",width:100,align:"right",render:(a,c)=>e.jsx(we,{type:"success",children:"Included"},`status-${c.key}`)}],pagination:!1,size:"small",locale:{emptyText:e.jsx(qe,{message:"No basic amenities",description:"Your stall area is too small to qualify for any basic amenities.",type:"info",showIcon:!0})}})]}),w.amenities&&w.amenities.length>0&&e.jsxs(ie,{title:"Selected Amenities",style:{marginBottom:24},children:[e.jsx(He,{dataSource:w.amenities.map((a,c)=>({...a,key:c})),columns:[{title:"Name",dataIndex:"name",key:"name",render:(a,c)=>e.jsxs(ae,{children:[e.jsx(we,{strong:!0,children:a}),e.jsx(ne,{color:"blue",children:c.type})]},`amenity-name-${c.key}`)},{title:"Description",dataIndex:"description",key:"description",render:(a,c)=>e.jsx(we,{type:"secondary",style:{fontSize:"13px"},children:a||"No description provided"},`amenity-desc-${c.key}`)},{title:"Rate",dataIndex:"rate",key:"rate",width:110,align:"right",render:(a,c)=>e.jsx(we,{strong:!0,style:{color:"#1890ff"},children:R(a)},`amenity-rate-${c.key}`)},{title:"Quantity",dataIndex:"quantity",key:"quantity",width:90,align:"center",render:(a,c)=>e.jsx(ne,{color:"green",children:a},`amenity-qty-${c.key}`)},{title:"Total",dataIndex:"total",key:"total",width:110,align:"right",render:(a,c)=>e.jsx(we,{strong:!0,style:{color:"#1890ff"},children:R(a)},`amenity-total-${c.key}`)}],pagination:!1,size:"small"}),e.jsx(Be,{}),e.jsx("div",{style:{textAlign:"right"},children:e.jsxs(we,{strong:!0,children:["Amenities Total: ",R(w.amenitiesTotal)]})})]}),e.jsxs(ie,{title:"Price Calculation",style:{marginBottom:24},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(we,{children:"Base Amount:"}),e.jsx(we,{children:R(w.baseAmount)})]}),w.discounts.length>0&&e.jsxs(e.Fragment,{children:[w.discounts.map((a,c)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsxs(we,{children:[a.name," (",a.type==="percentage"?`${a.value}%`:R(a.value),"):"]}),e.jsxs(we,{type:"danger",children:["- ",R(a.amount)]})]},c)),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(we,{children:"Amount after Discount:"}),e.jsx(we,{children:R(w.amountAfterDiscount)})]})]}),w.amenitiesTotal>0&&e.jsxs("div",{style:{background:"#f9f9f9",padding:"8px",borderRadius:"4px",marginBottom:"8px",border:"1px dashed #d9d9d9"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[e.jsx(we,{type:"secondary",children:"Selected Amenities (for information only):"}),e.jsx(we,{type:"secondary",children:R(w.amenitiesTotal)})]}),e.jsx(we,{type:"secondary",style:{fontSize:"12px",fontStyle:"italic"},children:"Note: Amenities are not included in the total calculation"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(we,{strong:!0,children:"Subtotal:"}),e.jsx(we,{strong:!0,children:R(w.subtotal)})]}),w.taxes.length>0&&e.jsx(e.Fragment,{children:w.taxes.map((a,c)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsxs(we,{children:[a.name," (",a.rate,"%):"]}),e.jsx(we,{children:R(a.amount)})]},c))}),e.jsx(Be,{}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(Rn,{level:5,children:"Total:"}),e.jsx(Rn,{level:5,children:R(w.total)})]})]})]})},{confirm:$u}=tt,Lu=({visible:s,stallDetails:t,selectedStallId:n,selectedStallIds:r,loading:i,exhibition:o,onCancel:l,onSubmit:x})=>{const[v]=Q.useForm(),[p,I]=g.useState(0),[j]=g.useState(3),[f,w]=g.useState({}),[T,R]=g.useState(!1),[P,S]=g.useState(!1),_=Me(u=>u.exhibitorAuth.exhibitor);g.useEffect(()=>{if(s){I(0),R(!1),w({}),v.resetFields();const u=r.map(E=>String(E));n&&u.push(String(n));const y=[...new Set(u)],b={selectedStalls:y,exhibitionId:o==null?void 0:o._id};_&&(b.customerName=_.contactPerson||"",b.companyName=_.companyName||"",b.email=_.email||"",b.customerPhone=_.phone||""),v.setFieldsValue(b),w(b),console.log("Booking form initialized with stalls:",y),console.log("Exhibitor profile data:",_)}},[s,v,n,r,o,_]);const N=()=>{R(!0)},a=()=>{T?$u({title:"Discard changes?",icon:e.jsx(yo,{}),content:"You have unsaved changes. Are you sure you want to close this form?",onOk(){l()}}):l()},c=()=>{S(!0),v.validateFields().then(u=>{const y={...f,...u},b={customerName:v.getFieldValue("customerName"),companyName:v.getFieldValue("companyName"),email:v.getFieldValue("email"),customerPhone:v.getFieldValue("customerPhone")},E={...y,...b};w(E),console.log("Step completed, saving form values:",E),console.log("Selected stalls are:",E.selectedStalls||[]),console.log("Exhibitor info:",b),I(p+1),S(!1)}).catch(u=>{S(!1),console.error("Form validation failed:",u),te.error("Please complete all required fields")})},h=()=>{I(p-1)},k=()=>{v.validateFields().then(u=>{const y={customerName:v.getFieldValue("customerName"),companyName:v.getFieldValue("companyName"),email:v.getFieldValue("email"),customerPhone:v.getFieldValue("customerPhone")},b=v.getFieldValue("selectedStalls")||[],E=v.getFieldValue("amenities")||[],L=t.filter(q=>b.includes(String(q.id))).reduce((q,D)=>q+D.dimensions.width*D.dimensions.height,0);let A=[];o!=null&&o.basicAmenities&&o.basicAmenities.length>0&&(A=o.basicAmenities.filter(q=>Math.floor(L/q.perSqm)*q.quantity>0).map(q=>{const D=Math.floor(L/q.perSqm)*q.quantity;return{name:q.name,type:q.type,perSqm:q.perSqm,quantity:q.quantity,calculatedQuantity:D,description:q.description||""}}));let $=[];E&&E.length>0&&($=E.map(q=>{var M;const D=(M=o==null?void 0:o.amenities)==null?void 0:M.find(U=>String(U._id||U.id)===String(q.id));return D?{id:String(D._id||D.id),name:D.name,type:D.type,rate:D.rate,quantity:q.quantity||1,description:D.description||""}:null}).filter(Boolean));const F={...f,...u,...y,basicAmenities:A,extraAmenities:$};console.log("Submitting booking with values:",F),console.log("Basic amenities:",A),console.log("Extra amenities:",$),x(F)}).catch(u=>{console.error("Form validation failed:",u),te.error("Please complete all required fields")})},m=["Stall Details","Amenities","Review"],C=[{title:"Stall Details",icon:e.jsx(cl,{}),content:e.jsx(Ai,{form:v,stallDetails:t,selectedStallId:n,selectedStallIds:r,exhibition:o})},{title:"Amenities",icon:e.jsx(Vr,{}),content:e.jsx(Ti,{form:v,stallDetails:t,selectedStallIds:v.getFieldValue("selectedStalls")||[],exhibition:o,formValues:f})},{title:"Review",icon:e.jsx(Qe,{}),content:e.jsx(Pi,{form:v,formValues:f,loading:i,exhibition:o,selectedStalls:v.getFieldValue("selectedStalls")||[],selectedStallIds:v.getFieldValue("selectedStalls")||[],stallDetails:t})}];g.useEffect(()=>{const u=v.getFieldValue("selectedStalls");console.log(`Step ${p} - Form has selectedStalls:`,u)},[p,v]);const d=u=>{const y=v.getFieldValue("selectedStalls")||[],b={customerName:v.getFieldValue("customerName"),companyName:v.getFieldValue("companyName"),email:v.getFieldValue("email"),customerPhone:v.getFieldValue("customerPhone")},E={...f,...b};switch(console.log(`Rendering step ${u} with:`,{selectedStalls:y,exhibitorInfo:b}),u){case 0:return e.jsx(Ai,{form:v,stallDetails:t,selectedStallId:n,selectedStallIds:r,exhibition:o});case 1:return e.jsx(Ti,{form:v,stallDetails:t,selectedStallIds:y,exhibition:o,formValues:E});case 2:return e.jsx(Pi,{form:v,formValues:E,loading:i,exhibition:o,selectedStalls:y,selectedStallIds:y,stallDetails:t,onPrev:h,onFinish:k});default:return null}};return e.jsx(Nu,{title:`Book Exhibition Stall - ${m[p]}`,open:s,onCancel:a,footer:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 24px"},children:[p>0&&e.jsx(An,{onClick:h,disabled:P||i,size:"large",children:"Back"}),e.jsx("div",{children:p<j-1?e.jsx(An,{type:"primary",onClick:c,loading:P,disabled:i,size:"large",children:"Next"}):e.jsx(An,{type:"primary",onClick:k,loading:i,disabled:P,size:"large",children:"Submit Booking"})})]}),width:900,destroyOnClose:!0,maskClosable:!1,className:"booking-modal",children:e.jsxs(et,{spinning:i||P,tip:i?"Processing your booking...":"Validating...",children:[e.jsx(Au,{children:C.map((u,y)=>e.jsxs("div",{className:`step-item ${p===y?"active":""} ${p>y?"completed":""}`,onClick:()=>p>y?I(y):null,style:{cursor:p>y?"pointer":"default"},children:[e.jsx("span",{className:"step-icon",children:p>y?e.jsx(to,{}):y+1}),u.title]},y))}),e.jsx(Q,{form:v,layout:"vertical",preserve:!0,onFieldsChange:N,children:d(p)},`form-step-${p}`)]})})},{Content:Bs}=ve,{Title:gf}=ke,Bu=s=>{if(!s)return"";if(s.startsWith("http"))return s;const t=s.startsWith("/")?s.substring(1):s;if(t.includes("logos/"))return`${ut.defaults.baseURL}/public/images/${t}`;const n=localStorage.getItem("token"),r=`uploads/${t}`;return n?`${ut.defaults.baseURL}/${r}?token=${n}`:`${ut.defaults.baseURL}/${r}`},Mu=()=>{var $,F,q,D;const{id:s}=cn(),t=st(),n=xt(),[r,i]=g.useState(null),[o,l]=g.useState(null),[x,v]=g.useState(null),[p,I]=g.useState([]),[j,f]=g.useState(!1),[w,T]=g.useState(!0),[R,P]=g.useState(null),[S,_]=g.useState(!1),[N,a]=g.useState(null),c=g.useRef(null),[h,k]=g.useState({width:800,height:600}),[m,C]=g.useState(!1),[d]=Q.useForm(),{isAuthenticated:u}=Me(M=>M.exhibitorAuth);g.useEffect(()=>{const M=()=>{C(window.innerWidth<768)};return M(),window.addEventListener("resize",M),()=>{window.removeEventListener("resize",M)}},[]);const y=g.useCallback(M=>M.status==="booked"||M.status==="reserved",[]),b=g.useCallback(()=>{if(c.current){const{clientWidth:M,clientHeight:U}=c.current,V=m?320:800,O=m?480:600,X=Math.max(M||V,V),Y=Math.max(U||O,O);(Math.abs(X-h.width)>5||Math.abs(Y-h.height)>5)&&k({width:X,height:Y})}},[h.width,h.height,m]);g.useEffect(()=>{let M=null;const U=()=>{M===null&&(M=window.setTimeout(()=>{M=null,b()},m?100:50))};b();const V=new ResizeObserver(U);return c.current&&V.observe(c.current),window.addEventListener("resize",U),()=>{M!==null&&window.clearTimeout(M),V.disconnect(),window.removeEventListener("resize",U)}},[b,m]),g.useEffect(()=>{(async()=>{try{if(!s){P("Exhibition ID is missing"),T(!1);return}T(!0),P(null);const U=await Ke.getLayout(s);i(U.data)}catch(U){P(U.message||"Failed to fetch layout"),console.error("Error fetching exhibition:",U)}finally{T(!1)}})()},[s]),g.useEffect(()=>{r&&b()},[r]),g.useEffect(()=>{u&&r&&(v(null),I([]),b(),te.info("You can now select stalls to book.",3))},[u]);const E=g.useCallback(async M=>{if(y(M)){te.info(`This stall (${M.stallNumber}) is already booked.`);return}if(!u){n(Ft("stall-booking"));return}const V=M._id||M.id;I(O=>O.includes(V)?(te.info(`Stall ${M.stallNumber} removed from selection`),O.filter(X=>X!==V)):(te.success(`Stall ${M.stallNumber} added to selection`),[...O,V]))},[y,u,n]),B=async M=>{try{_(!0);const U={...M,exhibitionId:r==null?void 0:r.exhibition._id,stallIds:M.selectedStalls};if(u){const V=await Ke.exhibitorBookStalls(U);te.success("Your booking request has been submitted successfully! It is pending review by the admin.")}else{const V=await Ke.bookMultipleStalls(s,U);te.success("Your booking request has been submitted successfully!")}if(f(!1),I([]),s)try{const V=await Ke.getLayout(s);i(V.data)}catch(V){console.error("Error refreshing layout data:",V)}}catch(U){console.error("Error booking stall",U),te.error("Failed to book stall. Please try again.")}finally{_(!1)}},L=async()=>{var M;try{if(!r)return;_(!0);let U=null;if(x){const O=r.layout.find(X=>X.stalls.some(Y=>Y.id===x));O?U=O.stalls.find(X=>X.id===x)||null:console.error("Selected stall not found in any hall")}const V=r.layout.flatMap(O=>O.stalls.map(X=>({...X,hallId:O.id,hallName:O.name}))).filter(O=>O.status==="available");if(p.length===0&&x===null&&V.length===0){te.error("No stalls are available for booking");return}if(!r.exhibition.basicAmenities)try{const O=await Ke.getExhibition(s||"");(M=O==null?void 0:O.data)!=null&&M.basicAmenities&&i({...r,exhibition:{...r.exhibition,basicAmenities:O.data.basicAmenities}})}catch(O){console.error("Error fetching exhibition details with amenities:",O)}a(V),f(!0)}catch(U){console.error("Error opening booking modal:",U),te.error("Failed to open booking form")}finally{_(!1)}};g.useCallback(M=>{M.cancelBubble=!0},[]);const A=g.useMemo(()=>{var M;return r?{halls:r.layout.map(U=>e.jsx(Uo,{hall:{...U,exhibitionId:s||""},isSelected:!1,onSelect:()=>{},isStallMode:!0},U.id)),stalls:r.layout.flatMap(U=>U.stalls.map(V=>{var O,X,Y,pe,fe,ue,re,me;return e.jsx(Qo,{stall:{...V,hallId:U.id,hallName:U.name,isSelected:p.includes(V.id),stallTypeId:"default",number:V.stallNumber,typeName:V.type||"Standard",ratePerSqm:V.price||0,rotation:0,dimensions:{x:((O=V.position)==null?void 0:O.x)||0,y:((X=V.position)==null?void 0:X.y)||0,width:((Y=V.dimensions)==null?void 0:Y.width)||0,height:((pe=V.dimensions)==null?void 0:pe.height)||0},status:V.status==="maintenance"?"booked":V.status},isSelected:x===V.id||p.includes(V.id),onSelect:V.status==="available"?()=>E(V):void 0,hallWidth:((fe=U.dimensions)==null?void 0:fe.width)||0,hallHeight:((ue=U.dimensions)==null?void 0:ue.height)||0,hallX:((re=U.dimensions)==null?void 0:re.x)||0,hallY:((me=U.dimensions)==null?void 0:me.y)||0},V.id)})),fixtures:(M=r.fixtures)==null?void 0:M.map(U=>{var V,O;return e.jsx(Vo,{fixture:{...U,id:U.id||U._id,_id:U._id||U.id,exhibitionId:s||"",isActive:!0,zIndex:5},scale:1,position:{x:0,y:0},exhibitionWidth:((V=r.exhibition.dimensions)==null?void 0:V.width)||0,exhibitionHeight:((O=r.exhibition.dimensions)==null?void 0:O.height)||0},U.id||U._id)})}:null},[r,s,x,p,E]);return w?e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx(Bs,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(et,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibition layout..."})]})})]}):R||!r?e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx(Bs,{style:{paddingTop:"64px"},children:e.jsx(ys,{status:"error",title:"Failed to load exhibition layout",subTitle:R||"The exhibition layout couldn't be loaded.",extra:[e.jsx(H,{type:"primary",onClick:()=>t("/exhibitions"),children:"Back to Exhibitions"},"back")]})})]}):!(($=r.exhibition.dimensions)!=null&&$.width)||!((F=r.exhibition.dimensions)!=null&&F.height)?e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx(Bs,{style:{paddingTop:"64px"},children:e.jsx(ie,{children:e.jsx(ys,{status:"error",title:"Invalid Exhibition Layout",subTitle:"Exhibition dimensions are not properly configured"})})})]}):e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsxs(Bs,{style:{paddingTop:"64px",background:"#f7f8fa"},children:[m&&e.jsx("div",{style:{height:"16px",width:"100%"}}),e.jsxs(ie,{className:"exhibition-card",style:{borderRadius:"8px",overflow:"hidden",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.08)",margin:m?"40px 0px 10px 0px":"10px 0px",border:"none"},bodyStyle:{padding:m?"5px":"24px"},children:[e.jsxs(ge,{gutter:[24,24],style:{marginBottom:m?16:32},children:[e.jsx(G,{xs:24,sm:24,md:12,children:e.jsxs("div",{style:{padding:m?"12px":"16px",background:"linear-gradient(145deg, #ffffff, #f8faff)",borderRadius:"8px",border:"1px solid rgba(230, 235, 245, 0.8)",height:"100%",display:"flex",flexDirection:m?"column":"row",alignItems:m?"flex-start":"center",gap:m?"12px":"16px",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.03)"},children:[e.jsx("div",{style:{flexShrink:0,display:"flex",justifyContent:m?"center":"flex-start",width:m?"100%":"auto"},children:r.exhibition.headerLogo?e.jsx(no,{src:Bu(r.exhibition.headerLogo),alt:`${r.exhibition.name} logo`,style:{maxHeight:m?70:90,maxWidth:m?200:250,objectFit:"contain"},preview:!1,fallback:"/exhibition-placeholder.jpg",placeholder:e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:m?200:250,height:m?70:90,backgroundColor:"#f5f5f5",borderRadius:"8px"},children:e.jsx(et,{size:"small"})})}):e.jsx("div",{style:{width:m?70:90,height:m?70:90,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg, #f0f0f0, #e6e6e6)",borderRadius:"8px",boxShadow:"inset 0 2px 4px rgba(0, 0, 0, 0.05)"},children:e.jsx(ft,{style:{fontSize:m?24:32,color:"#aaa"}})})}),!m&&e.jsx(Be,{type:"vertical",style:{height:"90px",margin:"0 16px",opacity:.6}}),e.jsxs("div",{style:{flex:1,width:m?"100%":"auto"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:m?"18px":"22px",fontWeight:600,background:"linear-gradient(90deg, #333, #666)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:r.exhibition.name}),e.jsxs("p",{style:{margin:"0 0 8px 0",display:"flex",alignItems:"center",gap:"8px",color:"#555",fontSize:m?"13px":"14px"},children:[e.jsx(ft,{style:{fontSize:m?"14px":"16px",color:"#1890ff"}}),e.jsxs("span",{children:[new Date(r.exhibition.startDate).toLocaleDateString()," -",new Date(r.exhibition.endDate).toLocaleDateString()]})]}),e.jsxs("p",{style:{margin:0,display:"flex",alignItems:"center",gap:"8px",color:"#555",fontSize:m?"13px":"14px"},children:[e.jsx(Ot,{style:{fontSize:m?"14px":"16px",color:"#1890ff"}}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:m?"nowrap":"normal",maxWidth:m?"260px":"none"},children:r.exhibition.venue})]})]})]})}),e.jsx(G,{xs:24,sm:24,md:12,children:e.jsxs("div",{style:{padding:m?"16px 5px":"24px",background:"linear-gradient(145deg, #ffffff, #f9fbfd)",borderRadius:"8px",border:"1px solid rgba(230, 235, 245, 0.8)",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.03)"},children:[e.jsx("div",{style:{marginBottom:"16px",fontSize:m?"15px":"16px",fontWeight:600,color:"#444",textAlign:"center"},children:"Stall Status:"}),e.jsxs("div",{style:{display:"flex",flexDirection:m?"column":"row",justifyContent:"center",alignItems:"center",gap:m?"10px":"16px",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#f6ffed",border:"1px solid #b7eb8f",width:m?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(kt,{status:"success"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Available"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#e6f7ff",border:"1px solid #91d5ff",width:m?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(kt,{status:"processing",color:"#1890ff"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Reserved"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#fff7e6",border:"1px solid #ffd591",width:m?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(kt,{status:"warning"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Booked"})]})]})]})})]}),e.jsxs("div",{ref:c,style:{width:"100%",height:m?"70vh":"80vh",minHeight:m?"400px":"600px",background:"#ffffff",borderRadius:"12px",overflow:"hidden",position:"relative",border:"1px solid rgba(230, 235, 245, 0.8)",boxShadow:"inset 0 2px 6px rgba(0, 0, 0, 0.03)",willChange:"transform",contain:"content",isolation:"isolate"},className:"public-canvas-container",children:[e.jsx("style",{children:`
                /* Hide only canvas context menu in public view */
                .konvajs-content .ant-menu {
                  display: none !important;
                }
                
                /* Base canvas optimization */
                .konvajs-content {
                  will-change: transform;
                  transform: translateZ(0);
                  backface-visibility: hidden;
                  transition: filter 0.2s ease-out;
                }
                
                /* Fast layer for static background */
                .public-canvas-container .konvajs-content canvas:first-child {
                  image-rendering: auto;
                }
                
                /* Canvas optimization for all canvases */
                .public-canvas-container canvas {
                  backface-visibility: hidden;
                  -webkit-backface-visibility: hidden;
                  transition: filter 0.15s linear;
                }
                
                /* Dragging state - apply blur effect with better control */
                .public-canvas-container .konvajs-content.dragging {
                  filter: blur(1px);
                }
                
                /* Mobile-specific blur - slightly stronger */
                @media (max-width: 768px) {
                  .public-canvas-container .konvajs-content.dragging {
                    filter: blur(1.5px);
                  }
                }
                
                /* Performance optimizations for dragging */
                .public-canvas-container .konvajs-content:active canvas {
                  image-rendering: optimizeSpeed;
                }
                
                /* Touch device optimizations */
                @media (pointer: coarse) {
                  .public-canvas-container .konvajs-content:active {
                    touch-action: none;
                  }
                  
                  .public-canvas-container .konvajs-content.dragging {
                    filter: blur(2px); /* Stronger blur for touch devices */
                  }
                }
                
                /* Animation smoothing to reduce flickering */
                .public-canvas-container .konvajs-content canvas {
                  will-change: filter;
                  transform: translateZ(0);
                }
                
                /* Low-end device optimizations */
                @media (max-width: 480px), 
                       (resolution: 150dpi),
                       (any-pointer: coarse) {
                  .public-canvas-container .konvajs-content:active canvas {
                    image-rendering: optimizeSpeed;
                  }
                }
              `}),e.jsxs(wu,{width:h.width,height:h.height,exhibitionWidth:((q=r==null?void 0:r.exhibition.dimensions)==null?void 0:q.width)||0,exhibitionHeight:((D=r==null?void 0:r.exhibition.dimensions)==null?void 0:D.height)||0,halls:(r==null?void 0:r.layout)||[],selectedHall:null,onSelectHall:()=>{},isStallMode:!0,onAddHall:()=>{},onAddStall:()=>{},onAddFixture:()=>{},onExhibitionChange:()=>{},isPublicView:!0,children:[A==null?void 0:A.halls,A==null?void 0:A.stalls,A==null?void 0:A.fixtures]})]})]})]}),p.length>0&&e.jsx(Da,{offsetBottom:20,children:e.jsx("div",{style:{position:"fixed",bottom:20,right:20,zIndex:1e3},children:e.jsxs(H,{type:"primary",size:"large",icon:e.jsx(br,{}),onClick:L,loading:S,style:{borderRadius:"30px",boxShadow:"0 6px 16px rgba(24, 144, 255, 0.25)",display:"flex",alignItems:"center",gap:"8px",padding:"0 22px",height:"48px",fontSize:"16px",fontWeight:500,background:"linear-gradient(145deg, #1890ff, #40a9ff)",border:"none",transition:"all 0.3s ease"},children:["Book Selected Stalls (",p.length,")"]})})}),e.jsx(Lu,{visible:j,stallDetails:N,selectedStallId:x,selectedStallIds:p,loading:S,exhibition:r==null?void 0:r.exhibition,onCancel:()=>{f(!1)},onSubmit:B})]})},Fu=Ae.memo(Mu),{Content:Tn}=ve,{Title:_n,Text:Pt,Paragraph:Di}=ke,Pn=s=>{if(!s)return"";if(s.startsWith("http"))return s;const t=s.startsWith("/")?s.substring(1):s;if(t.includes("logos/")||t.includes("sponsors/"))return`${K.defaults.baseURL}/public/images/${t}`;const n=localStorage.getItem("token"),r=`uploads/${t}`;return n?`${K.defaults.baseURL}/${r}?token=${n}`:`${K.defaults.baseURL}/${r}`},zu=(s,t)=>{const n=new Date,r=new Date(s),i=new Date(t);return n<r?{status:"Upcoming",color:"#722ED1"}:n>i?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},Ms=s=>{const t={year:"numeric",month:"long",day:"numeric"};return new Date(s).toLocaleDateString(void 0,t)},Ou=(s,t)=>{const n=new Date,r=new Date(s),i=new Date(t);if(n<r){const o=r.getTime()-n.getTime(),l=Math.ceil(o/(1e3*60*60*24));return{text:`Day${l!==1?"s":""} until start`,count:l,isPast:!1}}else if(n>i){const o=n.getTime()-i.getTime(),l=Math.ceil(o/(1e3*60*60*24));return{text:`Day${l!==1?"s":""} since end`,count:l,isPast:!0}}else{const o=i.getTime()-n.getTime(),l=Math.ceil(o/(1e3*60*60*24));return{text:`Day${l!==1?"s":""} remaining`,count:l,isPast:!1}}},qu=()=>{const{id:s}=cn(),t=st(),[n,r]=g.useState(null),[i,o]=g.useState(!0),[l,x]=g.useState(null),[v,p]=g.useState("https://images.unsplash.com/photo-1567419099214-0dd03b43e8de?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");if(g.useEffect(()=>{(async()=>{try{if(!s){x("Exhibition ID is missing");return}o(!0),x(null);const T=await Ke.getExhibition(s);if(r(T.data),T.data.headerBackground){const R=Pn(T.data.headerBackground);p(R);const P=new window.Image;P.src=R}else if(T.data.headerLogo){const R=Pn(T.data.headerLogo),P=new window.Image;P.src=R}}catch(T){console.error("Error fetching exhibition:",T),x(T.message||"Error fetching exhibition")}finally{o(!1)}})()},[s]),i)return e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx(Tn,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(et,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibition details..."})]})})]});if(l||!n)return e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx(Tn,{style:{paddingTop:"64px"},children:e.jsx(ys,{status:"404",title:"Exhibition not found",subTitle:l||"The exhibition you're looking for doesn't exist or has been removed.",extra:e.jsx(H,{type:"primary",onClick:()=>t("/exhibitions"),children:"Back to Exhibitions"})})})]});const{status:I,color:j}=zu(n.startDate,n.endDate),f=Ou(n.startDate,n.endDate);return e.jsxs(ve,{className:"exhibition-details-layout",children:[e.jsx(lt,{}),e.jsxs(Tn,{className:"exhibition-content",children:[e.jsx("div",{className:"breadcrumb-container",children:e.jsx($a,{items:[{title:e.jsx(Ge,{to:"/",children:e.jsx(Or,{})})},{title:e.jsx(Ge,{to:"/exhibitions",children:"Exhibitions"})},{title:n.name}]})}),e.jsx("div",{className:"exhibition-hero",style:{backgroundImage:`url('${v}')`},children:e.jsx("div",{className:"hero-overlay",children:e.jsxs("div",{className:"hero-content",children:[e.jsxs("div",{className:"hero-main",children:[e.jsx(_n,{level:1,className:"exhibition-title",children:n.name}),e.jsxs(ae,{size:24,className:"exhibition-meta",children:[e.jsxs("div",{className:"meta-item",children:[e.jsx(ft,{}),e.jsxs(Pt,{children:[Ms(n.startDate)," - ",Ms(n.endDate)]})]}),n.venue&&e.jsxs("div",{className:"meta-item",children:[e.jsx(ts,{}),e.jsx(Pt,{children:n.venue})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx(mt,{}),e.jsxs(Pt,{children:[f.text,": ",e.jsx("strong",{children:f.count})]})]})]})]}),e.jsxs("div",{className:"hero-actions",children:[e.jsx(H,{type:"primary",size:"large",icon:e.jsx(Ur,{}),onClick:()=>t(`/exhibitions/${s}/layout`),className:"action-button layout-button",children:"View Exhibition Layout"}),e.jsx(H,{size:"large",icon:e.jsx(Ze,{}),onClick:()=>t(`/exhibitions/${s}/layout`),className:"action-button book-button",children:"Book a Stall"}),f.isPast?null:e.jsx(H,{size:"large",icon:e.jsx(zr,{}),onClick:()=>t("/exhibitor/login"),className:"action-button exhibitor-button",children:"Exhibitor Access"})]})]})})}),e.jsx("div",{className:"stats-container",children:e.jsxs(ge,{gutter:[16,16],className:"stats-row",children:[e.jsx(G,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon duration-icon",children:e.jsx(ft,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value",children:Math.ceil((new Date(n.endDate).getTime()-new Date(n.startDate).getTime())/(1e3*60*60*24))}),e.jsx("div",{className:"stat-label",children:"Days Duration"})]})]})}),e.jsx(G,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon countdown-icon",children:e.jsx(mt,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value",children:f.count}),e.jsx("div",{className:"stat-label",children:f.text})]})]})}),e.jsx(G,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon status-icon",style:{backgroundColor:j+"20",color:j},children:e.jsx(Ot,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value status-value",style:{color:j},children:I}),e.jsx("div",{className:"stat-label",children:"Status"})]})]})})]})}),n.sponsorLogos&&n.sponsorLogos.length>0&&e.jsxs("div",{className:"sponsors-section",children:[e.jsx("div",{className:"sponsors-header",children:e.jsx(Pt,{type:"secondary",children:"PROUDLY SPONSORED BY"})}),e.jsx("div",{className:"sponsors-container",children:n.sponsorLogos.map((w,T)=>e.jsx("div",{className:"sponsor-logo-wrapper",children:e.jsx("div",{className:"sponsor-logo",children:e.jsx("img",{src:Pn(w),alt:`Sponsor ${T+1}`,className:"sponsor-logo-img",onError:R=>{R.target.src="/placeholder-logo.png"}})})},T))})]}),e.jsx("div",{className:"exhibition-details-container",children:e.jsxs(ge,{gutter:[24,24],children:[e.jsx(G,{xs:24,lg:16,children:e.jsxs(ie,{className:"details-card about-card",bordered:!1,children:[e.jsx(_n,{level:3,className:"section-title",children:"About This Exhibition"}),e.jsx(Di,{className:"main-description",children:n.description}),n.headerDescription&&e.jsx(Di,{className:"extended-description",children:n.headerDescription}),n.headerSubtitle&&e.jsxs("div",{className:"subtitle-section",children:[e.jsx(_n,{level:4,children:n.headerSubtitle}),e.jsx(Be,{})]})]})}),e.jsx(G,{xs:24,lg:8,children:e.jsx(ae,{direction:"vertical",style:{width:"100%"},size:24,children:e.jsx(ie,{title:"Key Information",className:"details-card info-card",bordered:!1,children:e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon start-icon",children:e.jsx(ft,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Pt,{type:"secondary",className:"info-label",children:"Start Date"}),e.jsx("div",{className:"info-value",children:Ms(n.startDate)})]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon end-icon",children:e.jsx(ft,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Pt,{type:"secondary",className:"info-label",children:"End Date"}),e.jsx("div",{className:"info-value",children:Ms(n.endDate)})]})]}),n.venue&&e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon venue-icon",children:e.jsx(ts,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Pt,{type:"secondary",className:"info-label",children:"Venue"}),e.jsx("div",{className:"info-value",children:n.venue})]})]})]})})})})]})})]}),e.jsx("style",{children:`
        .exhibition-details-layout {
          background-color: #f9fafc;
        }
        
        .exhibition-content {
          padding-top: 64px;
          min-height: calc(100vh - 64px);
        }
        
        .breadcrumb-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 24px;
        }
        
        /* Hero Section */
        .exhibition-hero {
          height: 500px;
          background-size: cover;
          background-position: center;
          position: relative;
          color: white;
          margin-bottom: 0;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(20, 20, 40, 0.7), rgba(20, 20, 40, 0.9));
          display: flex;
          align-items: center;
        }
        
        .hero-content {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        
        .hero-main {
          max-width: 800px;
        }
        
        .exhibition-title {
          color: #fff !important;
          margin-bottom: 32px !important;
          font-size: 3.5rem !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .exhibition-meta {
          margin-bottom: 24px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .meta-item .anticon {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .meta-item span {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }
        
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .action-button {
          padding: 0 24px;
          height: 48px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .layout-button {
          background: #4361ee;
          border-color: #4361ee;
        }
        
        .layout-button:hover {
          background: #3a56d4;
          border-color: #3a56d4;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(67, 97, 238, 0.25);
        }
        
        .book-button {
          background: white;
          color: #111;
          border-color: transparent;
        }
        
        .book-button:hover {
          background: #f8f9fa;
          color: #4361ee;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }
        
        .exhibitor-button {
          border-color: rgba(255, 255, 255, 0.3);
          color: white;
          background: transparent;
        }
        
        .exhibitor-button:hover {
          border-color: white;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        /* Stats Section */
        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          margin-top: -50px;
          margin-bottom: 40px;
          position: relative;
          z-index: 5;
        }
        
        .stats-row {
          margin: 0;
        }
        
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .duration-icon {
          background-color: #4361ee20;
          color: #4361ee;
        }
        
        .countdown-icon {
          background-color: #f7257520;
          color: #f72575;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          color: #111827;
        }
        
        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        /* Sponsor Logos Styles */
        .sponsors-section {
          max-width: 1280px;
          margin: 0 auto 40px;
          padding: 36px 24px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }
        
        .sponsors-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .sponsors-header .ant-typography {
          font-size: 14px;
          letter-spacing: 2px;
          font-weight: 600;
          color: #6b7280;
          position: relative;
          display: inline-block;
        }
        
        .sponsors-header .ant-typography:before,
        .sponsors-header .ant-typography:after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40px;
          height: 1px;
          background: #e5e7eb;
        }
        
        .sponsors-header .ant-typography:before {
          right: 100%;
          margin-right: 15px;
        }
        
        .sponsors-header .ant-typography:after {
          left: 100%;
          margin-left: 15px;
        }
        
        .sponsors-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: center;
          align-items: center;
        }
        
        .sponsor-logo-wrapper {
          display: inline-flex;
          transition: transform 0.3s ease;
        }
        
        .sponsor-logo-wrapper:hover {
          transform: translateY(-5px);
        }
        
        .sponsor-logo {
          width: 190px;
          height: auto;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px;
          transition: box-shadow 0.3s ease;
        }
        
        .sponsor-logo:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        
        .sponsor-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        /* Details Section */
        .exhibition-details-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }
        
        .details-card {
          border-radius: 16px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          height: 100%;
        }
        
        .about-card .ant-card-body {
          padding: 32px;
        }
        
        .section-title {
          margin-bottom: 24px !important;
          font-weight: 700 !important;
          color: #111827 !important;
          font-size: 28px !important;
          position: relative;
        }
        
        .section-title:after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -12px;
          width: 60px;
          height: 4px;
          background: #4361ee;
          border-radius: 2px;
        }
        
        .main-description {
          font-size: 16px !important;
          line-height: 1.7 !important;
          margin-bottom: 24px !important;
          color: #374151 !important;
        }
        
        .extended-description {
          font-size: 16px !important;
          line-height: 1.7 !important;
          margin-bottom: 24px !important;
          color: #6b7280 !important;
        }
        
        .subtitle-section {
          margin: 24px 0;
        }
        
        .subtitle-section .ant-typography {
          color: #111827;
          font-weight: 600;
        }
        
        .info-card .ant-card-head {
          border-bottom: none;
          padding: 20px 24px 0;
        }
        
        .info-card .ant-card-head-title {
          font-weight: 600;
          font-size: 18px;
          color: #111827;
        }
        
        .info-card .ant-card-body {
          padding: 16px 24px 24px;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        
        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        
        .start-icon {
          background-color: #4361ee20;
          color: #4361ee;
        }
        
        .end-icon {
          background-color: #f7257520;
          color: #f72575;
        }
        
        .venue-icon {
          background-color: #0ea5e920;
          color: #0ea5e9;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-label {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }
        
        @media (max-width: 991px) {
          .exhibition-hero {
            height: auto;
            min-height: 350px;
          }
          
          .hero-overlay {
            position: relative;
            padding: 50px 0;
          }
          
          .exhibition-title {
            font-size: 2.5rem !important;
          }
          
          .stats-container {
            margin-top: 0;
          }
          
          .stat-card {
            margin-bottom: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .exhibition-title {
            font-size: 2rem !important;
            margin-bottom: 24px !important;
          }
          
          .hero-content {
            padding: 40px 20px;
          }
          
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          
          .hero-actions button {
            width: 100%;
          }
          
          .sponsors-container {
            gap: 20px;
          }
          
          .sponsor-logo {
            width: 150px;
          }
          
          .stats-container {
            padding: 0 16px;
          }
          
          .stat-card {
            padding: 16px;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          
          .stat-value {
            font-size: 22px;
          }
          
          .exhibition-details-container {
            padding: 0 16px 40px;
          }
          
          .about-card .ant-card-body {
            padding: 24px;
          }
          
          .section-title {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .exhibition-title {
            font-size: 1.75rem !important;
          }
          
          .meta-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
        `})]})},{Title:$i,Text:Dn,Paragraph:Li}=ke,{Content:$n}=ve,Uu=(s,t)=>{const n=new Date,r=new Date(s),i=new Date(t);return n<r?{status:"Upcoming",color:"#722ED1"}:n>i?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},Bi=s=>{const t={year:"numeric",month:"short",day:"numeric"};return new Date(s).toLocaleDateString(void 0,t)},Vu=s=>{const t=new Date,r=new Date(s).getTime()-t.getTime();return Math.ceil(r/(1e3*60*60*24))},Mi=s=>{if(!s)return"/exhibition-placeholder.jpg";if(s.startsWith("/")||s.startsWith("http"))return s;const t=s.startsWith("/")?s.substring(1):s,n=t.includes("logos/")?t:`logos/${t}`;return`${K.defaults.baseURL}/public/images/${n}`},Qu=()=>{const s=st(),[t,n]=g.useState([]),[r,i]=g.useState(!0),[o,l]=g.useState(null),[x,v]=g.useState({});return g.useEffect(()=>{(async()=>{try{i(!0),l(null);const I=await Ke.getExhibitions();n(I.data);const j={};I.data.forEach(f=>{if(f.headerLogo){const w=Mi(f.headerLogo),T=new window.Image;T.onload=()=>{j[f._id]=!0,v(R=>({...R,[f._id]:!0}))},T.onerror=()=>{console.warn(`Failed to preload image: ${w}`),j[f._id]=!1,v(R=>({...R,[f._id]:!1}))},T.src=w}})}catch(I){l(I.message||"Failed to fetch exhibitions")}finally{i(!1)}})()},[]),r?e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx($n,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(et,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibitions..."})]})})]}):o?e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx($n,{style:{paddingTop:"64px"},children:e.jsx(ys,{status:"error",title:"Failed to load exhibitions",subTitle:o,extra:[e.jsx(H,{type:"primary",onClick:()=>window.location.reload(),children:"Try Again"},"retry")]})})]}):e.jsxs(ve,{children:[e.jsx(lt,{}),e.jsx($n,{style:{paddingTop:"64px",background:"#f5f5f5"},children:e.jsxs("div",{style:{padding:"80px 16px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:40},children:[e.jsx($i,{level:2,style:{marginBottom:12,fontSize:36},children:"Upcoming & Current Exhibitions"}),e.jsx(Li,{type:"secondary",style:{fontSize:16,maxWidth:600,margin:"0 auto"},children:"Discover and explore our exhibitions. Click on any card to view details and book stalls."})]}),t.length>0?e.jsx(ge,{gutter:[24,24],children:t.map(p=>{const{status:I,color:j}=Uu(p.startDate,p.endDate),f=Vu(p.startDate),w=p.headerLogo?Mi(p.headerLogo):void 0;return e.jsx(G,{xs:24,sm:12,lg:8,children:e.jsxs(ie,{hoverable:!0,onClick:()=>s(qo(p)),className:"exhibition-card",styles:{body:{padding:"0",overflow:"hidden",display:"flex",flexDirection:"column"}},style:{borderRadius:"12px",overflow:"hidden",height:"100%",boxShadow:"0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)"},children:[e.jsx(kt.Ribbon,{text:I,color:j,style:{right:"-1px",top:"10px",zIndex:2}}),e.jsxs("div",{className:"exhibition-card-container",children:[e.jsx("div",{className:"exhibition-card-logo-container",children:w&&e.jsx("div",{className:"exhibition-logo",children:e.jsx(no,{src:w,alt:`${p.name} logo`,preview:!1,fallback:"/exhibition-placeholder.jpg",placeholder:e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%",backgroundColor:"#f0f0f0"},children:e.jsx(et,{size:"small"})}),style:{width:"100%",height:"100%",objectFit:"contain"}})})}),e.jsxs("div",{className:"exhibition-card-content",children:[e.jsx("div",{className:"exhibition-title",children:e.jsx($i,{level:4,ellipsis:{rows:2},style:{marginBottom:8,fontSize:20,lineHeight:"28px"},children:p.name})}),e.jsx(Li,{type:"secondary",ellipsis:{rows:2},style:{marginBottom:16,fontSize:14},children:p.description}),e.jsxs("div",{className:"exhibition-card-details",children:[e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(ft,{style:{color:"#722ED1"}}),e.jsx(St,{title:"Exhibition Date Range",children:e.jsxs(Dn,{style:{fontSize:14},children:[Bi(p.startDate)," - ",Bi(p.endDate)]})})]}),p.venue&&e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(ts,{style:{color:"#F5222D"}}),e.jsx(St,{title:"Venue",children:e.jsx(Dn,{style:{fontSize:14},ellipsis:!0,children:p.venue})})]}),I==="Upcoming"&&f>0&&e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(mt,{style:{color:"#1890FF"}}),e.jsx(St,{title:"Time Remaining",children:e.jsxs(Dn,{style:{fontSize:14},children:["Starts in ",f," day",f!==1?"s":""]})})]})]}),e.jsx("div",{className:"exhibition-card-footer",children:e.jsxs(H,{type:"link",className:"view-details-btn",style:{padding:0,height:"auto",fontSize:14,fontWeight:500},children:["View Details ",e.jsx(jr,{})]})})]})]})]})},p._id)})}):e.jsx(Ce,{description:"No exhibitions currently available",style:{background:"#fff",padding:"48px",borderRadius:"12px",boxShadow:"0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)"},image:Ce.PRESENTED_IMAGE_SIMPLE})]})}),e.jsx(Oo,{}),e.jsx("style",{children:`
        .exhibition-card {
          transition: all 0.3s ease;
        }
        
        .exhibition-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.06) !important;
        }
        
        .exhibition-card-container {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
        }
        
        .exhibition-card-logo-container {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-color: #f9f9f9;
          border-right: 1px solid #eaeaea;
        }
        
        .exhibition-logo {
          position: relative;
          flex-shrink: 0;
          width: 100%;
          height: 172px;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border: 1px solid #e8e8e8;
        }
        
        .exhibition-card-content {
          width: 50%;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .exhibition-title {
          margin-right: 36px;
        }
        
        .exhibition-card-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .exhibition-card-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .exhibition-card-footer {
          margin-top: auto;
        }
        
        .view-details-btn {
          color: #722ED1;
        }
        
        .view-details-btn:hover {
          color: #9254DE;
        }
        
        .view-details-btn .anticon {
          transition: transform 0.3s ease;
        }
        
        .view-details-btn:hover .anticon {
          transform: translateX(4px);
        }
        
        @media (max-width: 575px) {
          .exhibition-card-container {
            flex-direction: column;
          }
          
          .exhibition-card-logo-container {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #eaeaea;
            padding: 20px;
          }
          
          .exhibition-logo {
            height: 140px;
          }
          
          .exhibition-card-content {
            width: 100%;
            padding: 20px;
          }
        }
        `})]})};class Wu extends Ae.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,n){console.error("Lazy loading error:",t,n)}render(){return this.state.hasError?e.jsx(qe,{message:"Something went wrong",description:"The component failed to load. Please try refreshing the page.",type:"error",showIcon:!0}):this.props.children}}const Hu=()=>e.jsx("div",{style:{padding:"20px",textAlign:"center"},children:e.jsx(et,{size:"large"})});function Ee(s,t=Hu){const n=g.lazy(s);return r=>e.jsx(Wu,{children:e.jsx(g.Suspense,{fallback:e.jsx(t,{}),children:e.jsx(n,{...r})})})}const{Title:Yu,Text:Ct}=ke,{Option:xf}=it,{TabPane:Ht}=zt,{confirm:Gu}=tt,{Search:Ku}=se,Xu=()=>{const[s,t]=g.useState([]),[n,r]=g.useState(!0),[i,o]=g.useState(null),[l,x]=g.useState(""),[v,p]=g.useState("all"),I=st(),j=Mr();g.useEffect(()=>{f()},[]),g.useEffect(()=>{const u=new URLSearchParams(j.search).get("status");u&&p(u)},[j]);const f=async()=>{try{r(!0),o(null);const d=await Ke.getExhibitorBookings();t(d.data||[])}catch(d){console.error("Error fetching bookings:",d),o("Failed to load bookings. Please try again.")}finally{r(!1)}},w=d=>{Gu({title:"Are you sure you want to cancel this booking?",icon:e.jsx(yo,{}),content:"This action cannot be undone. Once cancelled, the stalls will be available for others to book.",okText:"Yes, Cancel Booking",okType:"danger",cancelText:"No, Keep Booking",onOk:async()=>{try{await Ke.cancelExhibitorBooking(d),te.success("Booking cancelled successfully"),f()}catch(u){console.error("Error cancelling booking:",u),te.error("Failed to cancel booking")}}})},T=d=>{switch(d){case"approved":return e.jsxs(ne,{color:"success",children:[e.jsx(Qe,{})," Approved"]});case"pending":return e.jsxs(ne,{color:"warning",children:[e.jsx(mt,{})," Pending"]});case"rejected":return e.jsxs(ne,{color:"error",children:[e.jsx(js,{})," Rejected"]});case"confirmed":return e.jsxs(ne,{color:"blue",children:[e.jsx(Qe,{})," Confirmed"]});case"cancelled":return e.jsxs(ne,{color:"default",children:[e.jsx(js,{})," Cancelled"]});default:return e.jsx(ne,{children:"Unknown"})}},R=d=>{switch(d){case"paid":return e.jsxs(ne,{color:"success",children:[e.jsx(sn,{})," Paid"]});case"pending":return e.jsxs(ne,{color:"warning",children:[e.jsx(mt,{})," Pending"]});case"refunded":return e.jsxs(ne,{color:"default",children:[e.jsx(sn,{})," Refunded"]});default:return e.jsx(ne,{children:"Unknown"})}},P=async d=>{try{I(`/exhibitor/invoice/${d}`)}catch(u){console.error("Error navigating to invoice:",u),te.error("Failed to access invoice. Please try again.")}},S=[{title:"Exhibition",dataIndex:["exhibitionId","name"],key:"exhibitionName",render:(d,u)=>{var y,b;return e.jsxs(ae,{direction:"vertical",size:0,children:[e.jsx(Ct,{strong:!0,children:((y=u.exhibitionId)==null?void 0:y.name)||"N/A"}),e.jsx(Ct,{type:"secondary",style:{fontSize:"12px"},children:((b=u.exhibitionId)==null?void 0:b.venue)||"N/A"})]})},sorter:(d,u)=>{var y,b;return(((y=d.exhibitionId)==null?void 0:y.name)||"").localeCompare(((b=u.exhibitionId)==null?void 0:b.name)||"")}},{title:"Stall(s)",dataIndex:"stallIds",key:"stallNumbers",render:d=>e.jsx(ae,{direction:"vertical",size:4,children:(d==null?void 0:d.map(u=>e.jsx(ne,{children:u.number},u._id)))||"N/A"})},{title:"Type",key:"stallType",render:(d,u)=>{var y;return e.jsx(ae,{direction:"vertical",size:4,children:((y=u.stallIds)==null?void 0:y.map(b=>{var E;return(E=b.stallTypeId)!=null&&E.name?e.jsx(ne,{color:"blue",children:b.stallTypeId.name},b._id):e.jsx(Ct,{type:"secondary",children:"N/A"},b._id)}))||"N/A"})}},{title:"Dimensions",key:"dimensions",render:(d,u)=>{var y;return e.jsx(ae,{direction:"vertical",size:4,children:((y=u.stallIds)==null?void 0:y.map(b=>e.jsxs(Ct,{children:[b.dimensions.width,"m x ",b.dimensions.height,"m"]},b._id)))||"N/A"})}},{title:"Dates",key:"dates",render:(d,u)=>{var y,b;return e.jsxs(ae,{direction:"vertical",size:0,children:[e.jsxs(Ct,{children:[e.jsx(ft,{style:{marginRight:4}}),$e((y=u.exhibitionId)==null?void 0:y.startDate).format("MMM D")," - ",$e((b=u.exhibitionId)==null?void 0:b.endDate).format("MMM D, YYYY")]}),e.jsxs(Ct,{type:"secondary",style:{fontSize:"12px"},children:["Booked: ",$e(u.createdAt).format("MMM D, YYYY")]})]})},sorter:(d,u)=>$e(d.createdAt).unix()-$e(u.createdAt).unix()},{title:"Amount",dataIndex:"amount",key:"amount",render:d=>e.jsxs(Ct,{strong:!0,children:["₹",d.toLocaleString()]}),sorter:(d,u)=>d.amount-u.amount},{title:"Status",key:"status",dataIndex:"status",render:(d,u)=>d==="rejected"&&u.rejectionReason?e.jsxs(St,{title:u.rejectionReason,children:[T(d),e.jsx(Ot,{style:{marginLeft:4,color:"#ff4d4f"}})]}):T(d),filters:[{text:"Approved",value:"approved"},{text:"Pending",value:"pending"},{text:"Rejected",value:"rejected"},{text:"Confirmed",value:"confirmed"},{text:"Cancelled",value:"cancelled"}],onFilter:(d,u)=>u.status===d},{title:"Payment",key:"paymentStatus",dataIndex:"paymentStatus",render:d=>R(d),filters:[{text:"Paid",value:"paid"},{text:"Pending",value:"pending"},{text:"Refunded",value:"refunded"}],onFilter:(d,u)=>u.paymentStatus===d},{title:"Actions",key:"actions",render:(d,u)=>e.jsxs(ae,{children:[e.jsx(H,{type:"link",icon:e.jsx(La,{}),onClick:()=>I(`/exhibitor/bookings/${u._id}`),children:"Details"}),(u.status==="approved"||u.status==="confirmed")&&e.jsx(H,{type:"link",icon:e.jsx(go,{}),onClick:()=>P(u._id),children:"Invoice"}),u.status==="pending"&&e.jsx(H,{type:"link",danger:!0,onClick:()=>w(u._id),children:"Cancel"})]})}],_=d=>{x(d)},N=s.filter(d=>{var b,E;const u=(((b=d.exhibitionId)==null?void 0:b.name)||"").toLowerCase().includes(l.toLowerCase())||d.stallIds.some(B=>B.number.toLowerCase().includes(l.toLowerCase()))||(((E=d.exhibitionId)==null?void 0:E.venue)||"").toLowerCase().includes(l.toLowerCase())||(d.customerName||"").toLowerCase().includes(l.toLowerCase()),y=v==="all"||d.status===v;return u&&y}),a=()=>s.length,c=()=>s.filter(d=>d.status==="pending").length,h=()=>s.filter(d=>d.status==="approved").length,k=()=>s.filter(d=>d.status==="confirmed").length,m=()=>s.filter(d=>d.status==="rejected").length,C=()=>s.filter(d=>d.status==="cancelled").length;return e.jsxs("div",{children:[e.jsx(Yu,{level:2,children:"My Bookings"}),e.jsx(Ct,{type:"secondary",children:"Manage all your exhibition stall bookings in one place"}),i&&e.jsx(qe,{message:"Error",description:i,type:"error",showIcon:!0,style:{marginTop:24,marginBottom:24},action:e.jsx(H,{type:"primary",onClick:f,children:"Retry"})}),e.jsxs(ie,{style:{marginTop:24},children:[e.jsxs(ge,{gutter:[16,16],style:{marginBottom:16},children:[e.jsx(G,{flex:"auto",children:e.jsx(Ku,{placeholder:"Search bookings by exhibition name, stall number, or venue",onSearch:_,onChange:d=>x(d.target.value),style:{width:"100%",maxWidth:400},allowClear:!0})}),e.jsx(G,{children:e.jsx(H,{icon:e.jsx(ho,{}),onClick:f,children:"Refresh"})})]}),e.jsxs(zt,{defaultActiveKey:v,onChange:d=>p(d),children:[e.jsx(Ht,{tab:`All Bookings (${a()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):N.length>0?e.jsx(He,{columns:S,dataSource:N,rowKey:"_id",pagination:{pageSize:10},scroll:{x:!0},size:"middle"}):e.jsx(Ce,{description:l?"No bookings match your search criteria":"No bookings found",image:Ce.PRESENTED_IMAGE_SIMPLE})},"all"),e.jsx(Ht,{tab:`Pending (${c()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):e.jsx(He,{columns:S,dataSource:s.filter(d=>d.status==="pending"),rowKey:"_id",pagination:{pageSize:10},locale:{emptyText:e.jsx(Ce,{description:"No pending bookings"})},scroll:{x:!0},size:"middle"})},"pending"),e.jsx(Ht,{tab:`Approved (${h()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):e.jsx(He,{columns:S,dataSource:s.filter(d=>d.status==="approved"),rowKey:"_id",pagination:{pageSize:10},locale:{emptyText:e.jsx(Ce,{description:"No approved bookings"})},scroll:{x:!0},size:"middle"})},"approved"),e.jsx(Ht,{tab:`Confirmed (${k()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):e.jsx(He,{columns:S,dataSource:s.filter(d=>d.status==="confirmed"),rowKey:"_id",pagination:{pageSize:10},locale:{emptyText:e.jsx(Ce,{description:"No confirmed bookings"})},scroll:{x:!0},size:"middle"})},"confirmed"),e.jsx(Ht,{tab:`Rejected (${m()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):e.jsx(He,{columns:S,dataSource:s.filter(d=>d.status==="rejected"),rowKey:"_id",pagination:{pageSize:10},locale:{emptyText:e.jsx(Ce,{description:"No rejected bookings"})},scroll:{x:!0},size:"middle"})},"rejected"),e.jsx(Ht,{tab:`Cancelled (${C()})`,children:n?e.jsx(wt,{active:!0,paragraph:{rows:5}}):e.jsx(He,{columns:S,dataSource:s.filter(d=>d.status==="cancelled"),rowKey:"_id",pagination:{pageSize:10},locale:{emptyText:e.jsx(Ce,{description:"No cancelled bookings"})},scroll:{x:!0},size:"middle"})},"cancelled")]})]})]})},{Title:Fi,Text:Ln}=ke,Ju=()=>{var j,f,w,T,R,P,S,_,N,a,c,h,k;const{id:s}=cn(),t=st(),[n,r]=g.useState(null),[i,o]=g.useState(!0);g.useEffect(()=>{l()},[s]);const l=async()=>{try{o(!0);const m=await Ke.getExhibitorBooking(s||"");r(m.data)}catch(m){console.error("Error fetching booking details:",m),te.error("Failed to load booking details")}finally{o(!1)}},x=async()=>{try{t(`/exhibitor/invoice/${s}`)}catch(m){console.error("Error fetching invoice:",m),te.error("Failed to retrieve invoice")}},v=m=>{switch(m){case"approved":return e.jsxs(ne,{color:"success",children:[e.jsx(Qe,{})," Approved"]});case"pending":return e.jsxs(ne,{color:"warning",children:[e.jsx(mt,{})," Pending"]});case"rejected":return e.jsx(ne,{color:"error",children:"Rejected"});case"confirmed":return e.jsxs(ne,{color:"blue",children:[e.jsx(Qe,{})," Confirmed"]});case"cancelled":return e.jsx(ne,{color:"default",children:"Cancelled"});default:return e.jsx(ne,{children:"Unknown"})}},p=m=>{switch(m){case"paid":return e.jsx(ne,{color:"success",children:"Paid"});case"pending":return e.jsx(ne,{color:"warning",children:"Pending"});case"refunded":return e.jsx(ne,{color:"default",children:"Refunded"});default:return e.jsx(ne,{children:"Unknown"})}},I=[{title:"Stall Number",dataIndex:"number",key:"number"},{title:"Dimensions",key:"dimensions",render:m=>`${m.dimensions.width}m × ${m.dimensions.height}m`},{title:"Size",key:"size",render:m=>`${m.dimensions.width*m.dimensions.height} m²`},{title:"Rate per m²",dataIndex:"ratePerSqm",key:"ratePerSqm",render:m=>`₹${m.toLocaleString()}`},{title:"Amount",key:"amount",render:(m,C,d)=>{var y;const u=(y=n.calculations)==null?void 0:y.stalls[d];return u?`₹${u.baseAmount.toLocaleString()}`:"N/A"}}];return i?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"500px"},children:e.jsx(et,{size:"large"})}):n?e.jsxs("div",{style:{padding:"20px"},children:[e.jsxs("div",{style:{marginBottom:16},children:[e.jsx(H,{icon:e.jsx(dl,{}),onClick:()=>t("/exhibitor/bookings"),style:{marginRight:16},children:"Back to Bookings"}),["approved","confirmed"].includes(n.status)&&e.jsx(H,{type:"primary",icon:e.jsx(xs,{}),onClick:x,children:"View Invoice"})]}),e.jsxs(ie,{title:"Booking Details",style:{marginBottom:20},children:[e.jsxs(ye,{bordered:!0,column:{xs:1,sm:2,md:3},children:[e.jsx(ye.Item,{label:"Booking ID",children:n._id}),e.jsx(ye.Item,{label:"Exhibition",children:((j=n.exhibitionId)==null?void 0:j.name)||"N/A"}),e.jsx(ye.Item,{label:"Venue",children:((f=n.exhibitionId)==null?void 0:f.venue)||"N/A"}),e.jsx(ye.Item,{label:"Booking Date",children:$e(n.createdAt).format("MMM D, YYYY")}),e.jsxs(ye.Item,{label:"Exhibition Dates",children:[$e((w=n.exhibitionId)==null?void 0:w.startDate).format("MMM D, YYYY")," -",$e((T=n.exhibitionId)==null?void 0:T.endDate).format("MMM D, YYYY")]}),e.jsx(ye.Item,{label:"Status",children:v(n.status)}),e.jsx(ye.Item,{label:"Payment Status",children:p(n.paymentStatus||"pending")}),e.jsxs(ye.Item,{label:"Total Amount",children:["₹",((R=n.amount)==null?void 0:R.toLocaleString())||"N/A"]})]}),n.rejectionReason&&e.jsxs("div",{style:{marginTop:16},children:[e.jsx(Fi,{level:5,style:{color:"#f5222d"},children:"Rejection Reason:"}),e.jsx(Ln,{children:n.rejectionReason})]})]}),e.jsx(ie,{title:"Stall Details",style:{marginBottom:20},children:e.jsx(He,{dataSource:n.stallIds||[],columns:I,rowKey:"_id",pagination:!1})}),e.jsx(ie,{title:"Calculation Summary",children:e.jsx(ge,{gutter:[16,16],children:e.jsx(G,{span:24,children:e.jsxs(ye,{bordered:!0,column:1,children:[e.jsxs(ye.Item,{label:"Base Amount",children:["₹",((P=n.calculations)==null?void 0:P.totalBaseAmount.toLocaleString())||"N/A"]}),((S=n.calculations)==null?void 0:S.totalDiscountAmount)>0&&e.jsxs(ye.Item,{label:"Discount",children:["- ₹",((_=n.calculations)==null?void 0:_.totalDiscountAmount.toLocaleString())||"N/A"]}),((N=n.calculations)==null?void 0:N.totalDiscountAmount)>0&&e.jsxs(ye.Item,{label:"Amount After Discount",children:["₹",((a=n.calculations)==null?void 0:a.totalAmountAfterDiscount.toLocaleString())||"N/A"]}),(h=(c=n.calculations)==null?void 0:c.taxes)==null?void 0:h.map(m=>e.jsxs(ye.Item,{label:`${m.name} (${m.rate}%)`,children:["+ ₹",m.amount.toLocaleString()||"N/A"]},m.name)),e.jsx(ye.Item,{label:"Total Amount",children:e.jsxs(Ln,{strong:!0,style:{fontSize:"16px"},children:["₹",((k=n.amount)==null?void 0:k.toLocaleString())||"N/A"]})})]})})})}),e.jsx(ie,{title:"Customer Information",style:{marginTop:20},children:e.jsxs(ye,{bordered:!0,column:{xs:1,sm:2},children:[e.jsx(ye.Item,{label:"Company Name",children:n.companyName}),e.jsx(ye.Item,{label:"Contact Person",children:n.customerName}),e.jsx(ye.Item,{label:"Email",children:n.customerEmail}),e.jsx(ye.Item,{label:"Phone",children:n.customerPhone})]})})]}):e.jsx(ie,{children:e.jsxs("div",{style:{textAlign:"center",margin:"50px 0"},children:[e.jsx(Fi,{level:3,children:"Booking Not Found"}),e.jsx(Ln,{type:"secondary",children:"The requested booking could not be found or you don't have permission to view it."}),e.jsx("div",{style:{marginTop:20},children:e.jsx(H,{type:"primary",onClick:()=>t("/exhibitor/bookings"),children:"Back to Bookings"})})]})})},{Title:zi,Text:Oi}=ke,{TabPane:qi}=zt,Zu=()=>{var v;const[s]=Q.useForm(),[t,n]=g.useState(!1),[r,i]=g.useState(!1),o=xt(),l=Me(p=>p.exhibitorAuth.exhibitor);g.useEffect(()=>{(async()=>{try{i(!0);const I=await at.getProfile();I.data&&o(Ar({exhibitor:I.data,token:(l==null?void 0:l.token)||localStorage.getItem("exhibitor_token")||""}))}catch{te.error("Failed to fetch exhibitor profile")}finally{i(!1)}})()},[o]),g.useEffect(()=>{l&&s.setFieldsValue({companyName:l.companyName||"",contactPerson:l.contactPerson||"",email:l.email||"",phone:l.phone||"",address:l.address||"",website:l.website||"",description:l.description||"",panNumber:l.panNumber||"",gstNumber:l.gstNumber||"",city:l.city||"",state:l.state||"",pinCode:l.pinCode||""})},[l,s]);const x=async p=>{try{n(!0);const I=await at.updateProfile(p),j=(l==null?void 0:l.token)||localStorage.getItem("exhibitor_token")||"";o(Ar({exhibitor:{...l,...p},token:j})),te.success("Profile updated successfully")}catch{te.error("Failed to update profile")}finally{n(!1)}};return e.jsxs("div",{children:[e.jsx(zi,{level:2,children:"My Profile"}),e.jsx(Oi,{type:"secondary",children:"Manage your exhibitor profile information"}),e.jsx(ie,{style:{marginTop:24},loading:r,children:e.jsxs(zt,{defaultActiveKey:"profile",children:[e.jsx(qi,{tab:"Profile Information",children:e.jsxs(ge,{gutter:32,children:[e.jsx(G,{span:6,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24},children:[e.jsx(Bt,{size:100,icon:e.jsx(Ne,{}),style:{backgroundColor:"#1890ff",marginBottom:16},children:((v=l==null?void 0:l.companyName)==null?void 0:v.charAt(0).toUpperCase())||"E"}),e.jsx(zi,{level:4,children:l==null?void 0:l.companyName}),e.jsx(Oi,{type:"secondary",children:l==null?void 0:l.email})]})}),e.jsx(G,{span:18,children:e.jsxs(Q,{form:s,layout:"vertical",onFinish:x,initialValues:{companyName:(l==null?void 0:l.companyName)||"",contactPerson:(l==null?void 0:l.contactPerson)||"",email:(l==null?void 0:l.email)||"",phone:(l==null?void 0:l.phone)||"",address:(l==null?void 0:l.address)||"",website:(l==null?void 0:l.website)||"",description:(l==null?void 0:l.description)||"",panNumber:(l==null?void 0:l.panNumber)||"",gstNumber:(l==null?void 0:l.gstNumber)||"",city:(l==null?void 0:l.city)||"",state:(l==null?void 0:l.state)||"",pinCode:(l==null?void 0:l.pinCode)||""},children:[e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"companyName",label:"Company Name",rules:[{required:!0,message:"Please enter your company name"}],children:e.jsx(se,{prefix:e.jsx(Or,{}),placeholder:"Company Name"})})}),e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"contactPerson",label:"Contact Person",rules:[{required:!0,message:"Please enter contact person name"}],children:e.jsx(se,{prefix:e.jsx(Ne,{}),placeholder:"Contact Person"})})})]}),e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"email",label:"Email",rules:[{required:!0,message:"Please enter your email"},{type:"email",message:"Please enter a valid email"}],children:e.jsx(se,{prefix:e.jsx(es,{}),placeholder:"Email",disabled:!0})})}),e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"phone",label:"Phone",rules:[{required:!0,message:"Please enter your phone number"}],children:e.jsx(se,{prefix:e.jsx(qr,{}),placeholder:"Phone Number"})})})]}),e.jsx(Q.Item,{name:"address",label:"Address",children:e.jsx(se.TextArea,{rows:2,placeholder:"Company Address"})}),e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:8,children:e.jsx(Q.Item,{name:"city",label:"City",children:e.jsx(se,{placeholder:"City"})})}),e.jsx(G,{span:8,children:e.jsx(Q.Item,{name:"state",label:"State",children:e.jsx(se,{placeholder:"State"})})}),e.jsx(G,{span:8,children:e.jsx(Q.Item,{name:"pinCode",label:"PIN Code",rules:[{pattern:/^[0-9]{6}$/,message:"Please enter a valid 6-digit PIN code"}],children:e.jsx(se,{placeholder:"PIN Code",maxLength:6})})})]}),e.jsxs(ge,{gutter:16,children:[e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"panNumber",label:"PAN No.",rules:[{pattern:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,message:"Please enter a valid PAN number"}],children:e.jsx(se,{placeholder:"PAN Number",style:{textTransform:"uppercase"},maxLength:10})})}),e.jsx(G,{span:12,children:e.jsx(Q.Item,{name:"gstNumber",label:"GST No.",rules:[{pattern:/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,message:"Please enter a valid GST number"}],children:e.jsx(se,{placeholder:"GST Number",style:{textTransform:"uppercase"}})})})]}),e.jsx(Q.Item,{name:"website",label:"Website",children:e.jsx(se,{placeholder:"https://www.yourcompany.com"})}),e.jsx(Q.Item,{name:"description",label:"Company Description",children:e.jsx(se.TextArea,{rows:4,placeholder:"Brief description of your company"})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",loading:t,icon:e.jsx(xo,{}),children:"Save Changes"})})]})})]})},"profile"),e.jsx(qi,{tab:"Change Password",children:e.jsxs(Q,{layout:"vertical",onFinish:p=>{te.success("Password updated successfully")},children:[e.jsx(Q.Item,{name:"currentPassword",label:"Current Password",rules:[{required:!0,message:"Please enter your current password"}],children:e.jsx(se.Password,{placeholder:"Current Password"})}),e.jsx(Q.Item,{name:"newPassword",label:"New Password",rules:[{required:!0,message:"Please enter your new password"},{min:6,message:"Password must be at least 6 characters"}],children:e.jsx(se.Password,{placeholder:"New Password"})}),e.jsx(Q.Item,{name:"confirmPassword",label:"Confirm New Password",dependencies:["newPassword"],rules:[{required:!0,message:"Please confirm your new password"},({getFieldValue:p})=>({validator(I,j){return!j||p("newPassword")===j?Promise.resolve():Promise.reject(new Error("The two passwords do not match"))}})],children:e.jsx(se.Password,{placeholder:"Confirm New Password"})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",children:"Update Password"})})]})},"password")]})})]})};var eh=class extends Error{constructor(t){super(t[0].message);ni(this,"issues");this.name="SchemaError",this.issues=t}},Ho=(s=>(s.uninitialized="uninitialized",s.pending="pending",s.fulfilled="fulfilled",s.rejected="rejected",s))(Ho||{});function Ui(s){return{status:s,isUninitialized:s==="uninitialized",isLoading:s==="pending",isSuccess:s==="fulfilled",isError:s==="rejected"}}var Vi=bs;function Yo(s,t){if(s===t||!(Vi(s)&&Vi(t)||Array.isArray(s)&&Array.isArray(t)))return t;const n=Object.keys(t),r=Object.keys(s);let i=n.length===r.length;const o=Array.isArray(t)?[]:{};for(const l of n)o[l]=Yo(s[l],t[l]),i&&(i=s[l]===o[l]);return i?s:o}function Jt(s){let t=0;for(const n in s)t++;return t}var Qi=s=>[].concat(...s);function th(s){return new RegExp("(^|:)//").test(s)}function sh(){return typeof document>"u"?!0:document.visibilityState!=="hidden"}function rn(s){return s!=null}function nh(){return typeof navigator>"u"||navigator.onLine===void 0?!0:navigator.onLine}var rh=s=>s.replace(/\/$/,""),ih=s=>s.replace(/^\//,"");function oh(s,t){if(!s)return t;if(!t)return s;if(th(t))return t;const n=s.endsWith("/")||!t.startsWith("?")?"/":"";return s=rh(s),t=ih(t),`${s}${n}${t}`}function ah(s,t,n){return s.has(t)?s.get(t):s.set(t,n).get(t)}var Wi=(...s)=>fetch(...s),lh=s=>s.status>=200&&s.status<=299,ch=s=>/ion\/(vnd\.api\+)?json/.test(s.get("content-type")||"");function Hi(s){if(!bs(s))return s;const t={...s};for(const[n,r]of Object.entries(t))r===void 0&&delete t[n];return t}function Jr({baseUrl:s,prepareHeaders:t=j=>j,fetchFn:n=Wi,paramsSerializer:r,isJsonContentType:i=ch,jsonContentType:o="application/json",jsonReplacer:l,timeout:x,responseHandler:v,validateStatus:p,...I}={}){return typeof fetch>"u"&&n===Wi&&console.warn("Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments."),async(f,w,T)=>{const{getState:R,extra:P,endpoint:S,forced:_,type:N}=w;let a,{url:c,headers:h=new Headers(I.headers),params:k=void 0,responseHandler:m=v??"json",validateStatus:C=p??lh,timeout:d=x,...u}=typeof f=="string"?{url:f}:f,y,b=w.signal;d&&(y=new AbortController,w.signal.addEventListener("abort",y.abort),b=y.signal);let E={...I,signal:b,...u};h=new Headers(Hi(h)),E.headers=await t(h,{getState:R,arg:f,extra:P,endpoint:S,forced:_,type:N,extraOptions:T})||h;const B=V=>typeof V=="object"&&(bs(V)||Array.isArray(V)||typeof V.toJSON=="function");if(!E.headers.has("content-type")&&B(E.body)&&E.headers.set("content-type",o),B(E.body)&&i(E.headers)&&(E.body=JSON.stringify(E.body,l)),k){const V=~c.indexOf("?")?"&":"?",O=r?r(k):new URLSearchParams(Hi(k));c+=V+O}c=oh(s,c);const L=new Request(c,E);a={request:new Request(c,E)};let $,F=!1,q=y&&setTimeout(()=>{F=!0,y.abort()},d);try{$=await n(L)}catch(V){return{error:{status:F?"TIMEOUT_ERROR":"FETCH_ERROR",error:String(V)},meta:a}}finally{q&&clearTimeout(q),y==null||y.signal.removeEventListener("abort",y.abort)}const D=$.clone();a.response=D;let M,U="";try{let V;if(await Promise.all([j($,m).then(O=>M=O,O=>V=O),D.text().then(O=>U=O,()=>{})]),V)throw V}catch(V){return{error:{status:"PARSING_ERROR",originalStatus:$.status,data:U,error:String(V)},meta:a}}return C($,M)?{data:M,meta:a}:{error:{status:$.status,data:M},meta:a}};async function j(f,w){if(typeof w=="function")return w(f);if(w==="content-type"&&(w=i(f.headers)?"json":"text"),w==="json"){const T=await f.text();return T.length?JSON.parse(T):null}return f.text()}}var Yi=class{constructor(s,t=void 0){this.value=s,this.meta=t}},Zr=ns("__rtkq/focused"),Go=ns("__rtkq/unfocused"),ei=ns("__rtkq/online"),Ko=ns("__rtkq/offline");function fn(s){return s.type==="query"}function dh(s){return s.type==="mutation"}function mn(s){return s.type==="infinitequery"}function on(s){return fn(s)||mn(s)}function ti(s,t,n,r,i,o){return uh(s)?s(t,n,r,i).filter(rn).map(Tr).map(o):Array.isArray(s)?s.map(Tr).map(o):[]}function uh(s){return typeof s=="function"}function Tr(s){return typeof s=="string"?{type:s}:s}function hh(s,t){return s.catch(t)}var ws=Symbol("forceQueryFn"),_r=s=>typeof s[ws]=="function";function ph({serializeQueryArgs:s,queryThunk:t,infiniteQueryThunk:n,mutationThunk:r,api:i,context:o}){const l=new Map,x=new Map,{unsubscribeQueryResult:v,removeMutationResult:p,updateSubscriptionOptions:I}=i.internalActions;return{buildInitiateQuery:P,buildInitiateInfiniteQuery:S,buildInitiateMutation:_,getRunningQueryThunk:j,getRunningMutationThunk:f,getRunningQueriesThunk:w,getRunningMutationsThunk:T};function j(N,a){return c=>{var m;const h=o.endpointDefinitions[N],k=s({queryArgs:a,endpointDefinition:h,endpointName:N});return(m=l.get(c))==null?void 0:m[k]}}function f(N,a){return c=>{var h;return(h=x.get(c))==null?void 0:h[a]}}function w(){return N=>Object.values(l.get(N)||{}).filter(rn)}function T(){return N=>Object.values(x.get(N)||{}).filter(rn)}function R(N,a){const c=(h,{subscribe:k=!0,forceRefetch:m,subscriptionOptions:C,[ws]:d,...u}={})=>(y,b)=>{var X;const E=s({queryArgs:h,endpointDefinition:a,endpointName:N});let B;const L={...u,type:"query",subscribe:k,forceRefetch:m,subscriptionOptions:C,endpointName:N,originalArgs:h,queryCacheKey:E,[ws]:d};if(fn(a))B=t(L);else{const{direction:Y,initialPageParam:pe}=u;B=n({...L,direction:Y,initialPageParam:pe})}const A=i.endpoints[N].select(h),$=y(B),F=A(b()),{requestId:q,abort:D}=$,M=F.requestId!==q,U=(X=l.get(y))==null?void 0:X[E],V=()=>A(b()),O=Object.assign(d?$.then(V):M&&!U?Promise.resolve(F):Promise.all([U,$]).then(V),{arg:h,requestId:q,subscriptionOptions:C,queryCacheKey:E,abort:D,async unwrap(){const Y=await O;if(Y.isError)throw Y.error;return Y.data},refetch:()=>y(c(h,{subscribe:!1,forceRefetch:!0})),unsubscribe(){k&&y(v({queryCacheKey:E,requestId:q}))},updateSubscriptionOptions(Y){O.subscriptionOptions=Y,y(I({endpointName:N,requestId:q,queryCacheKey:E,options:Y}))}});if(!U&&!M&&!d){const Y=ah(l,y,{});Y[E]=O,O.then(()=>{delete Y[E],Jt(Y)||l.delete(y)})}return O};return c}function P(N,a){return R(N,a)}function S(N,a){return R(N,a)}function _(N){return(a,{track:c=!0,fixedCacheKey:h}={})=>(k,m)=>{const C=r({type:"mutation",endpointName:N,originalArgs:a,track:c,fixedCacheKey:h}),d=k(C),{requestId:u,abort:y,unwrap:b}=d,E=hh(d.unwrap().then($=>({data:$})),$=>({error:$})),B=()=>{k(p({requestId:u,fixedCacheKey:h}))},L=Object.assign(E,{arg:d.arg,requestId:u,abort:y,unwrap:b,reset:B}),A=x.get(k)||{};return x.set(k,A),A[u]=L,L.then(()=>{delete A[u],Jt(A)||x.delete(k)}),h&&(A[h]=L,L.then(()=>{A[h]===L&&(delete A[h],Jt(A)||x.delete(k))})),L}}}var Xo=class extends eh{constructor(s,t,n,r){super(s),this.value=t,this.schemaName=n,this._bqMeta=r}};async function Dt(s,t,n,r){const i=await s["~standard"].validate(t);if(i.issues)throw new Xo(i.issues,t,n,r);return i.value}function fh(s){return s}var hs=(s={})=>({...s,[ao]:!0});function mh({reducerPath:s,baseQuery:t,context:{endpointDefinitions:n},serializeQueryArgs:r,api:i,assertTagType:o,selectors:l,onSchemaFailure:x,catchSchemaFailure:v,skipSchemaValidation:p}){const I=(u,y,b,E)=>(B,L)=>{const A=n[u],$=r({queryArgs:y,endpointDefinition:A,endpointName:u});if(B(i.internalActions.queryResultPatched({queryCacheKey:$,patches:b})),!E)return;const F=i.endpoints[u].select(y)(L()),q=ti(A.providesTags,F.data,void 0,y,{},o);B(i.internalActions.updateProvidedBy([{queryCacheKey:$,providedTags:q}]))};function j(u,y,b=0){const E=[y,...u];return b&&E.length>b?E.slice(0,-1):E}function f(u,y,b=0){const E=[...u,y];return b&&E.length>b?E.slice(1):E}const w=(u,y,b,E=!0)=>(B,L)=>{const $=i.endpoints[u].select(y)(L()),F={patches:[],inversePatches:[],undo:()=>B(i.util.patchQueryData(u,y,F.inversePatches,E))};if($.status==="uninitialized")return F;let q;if("data"in $)if(Oa($.data)){const[D,M,U]=co($.data,b);F.patches.push(...M),F.inversePatches.push(...U),q=D}else q=b($.data),F.patches.push({op:"replace",path:[],value:q}),F.inversePatches.push({op:"replace",path:[],value:$.data});return F.patches.length===0||B(i.util.patchQueryData(u,y,F.patches,E)),F},T=(u,y,b)=>E=>E(i.endpoints[u].initiate(y,{subscribe:!1,forceRefetch:!0,[ws]:()=>({data:b})})),R=(u,y)=>u.query&&u[y]?u[y]:fh,P=async(u,{signal:y,abort:b,rejectWithValue:E,fulfillWithValue:B,dispatch:L,getState:A,extra:$})=>{var M,U;const F=n[u.endpointName],{metaSchema:q,skipSchemaValidation:D=p}=F;try{let V=R(F,"transformResponse");const O={signal:y,abort:b,dispatch:L,getState:A,extra:$,endpoint:u.endpointName,type:u.type,forced:u.type==="query"?S(u,A()):void 0,queryCacheKey:u.type==="query"?u.queryCacheKey:void 0},X=u.type==="query"?u[ws]:void 0;let Y;const pe=async(ue,re,me,Fe)=>{if(re==null&&ue.pages.length)return Promise.resolve({data:ue});const z={queryArg:u.originalArgs,pageParam:re},Z=await fe(z),he=Fe?j:f;return{data:{pages:he(ue.pages,Z.data,me),pageParams:he(ue.pageParams,re,me)},meta:Z.meta}};async function fe(ue){let re;const{extraOptions:me,argSchema:Fe,rawResponseSchema:z,responseSchema:Z}=F;if(Fe&&!D&&(ue=await Dt(Fe,ue,"argSchema",{})),X?re=X():F.query?re=await t(F.query(ue),O,me):re=await F.queryFn(ue,O,me,Te=>t(Te,O,me)),typeof process<"u",re.error)throw new Yi(re.error,re.meta);let{data:he}=re;z&&!D&&(he=await Dt(z,re.data,"rawResponseSchema",re.meta));let Ie=await V(he,re.meta,ue);return Z&&!D&&(Ie=await Dt(Z,Ie,"responseSchema",re.meta)),{...re,data:Ie}}if(u.type==="query"&&"infiniteQueryOptions"in F){const{infiniteQueryOptions:ue}=F,{maxPages:re=1/0}=ue;let me;const Fe={pages:[],pageParams:[]},z=(M=l.selectQueryEntry(A(),u.queryCacheKey))==null?void 0:M.data,he=S(u,A())&&!u.direction||!z?Fe:z;if("direction"in u&&u.direction&&he.pages.length){const Ie=u.direction==="backward",We=(Ie?Jo:Pr)(ue,he);me=await pe(he,We,re,Ie)}else{const{initialPageParam:Ie=ue.initialPageParam}=u,Te=(z==null?void 0:z.pageParams)??[],We=Te[0]??Ie,is=Te.length;me=await pe(he,We,re),X&&(me={data:me.data.pages[0]});for(let qt=1;qt<is;qt++){const Et=Pr(ue,me.data);me=await pe(me.data,Et,re)}}Y=me}else Y=await fe(u.originalArgs);return q&&!D&&Y.meta&&(Y.meta=await Dt(q,Y.meta,"metaSchema",Y.meta)),B(Y.data,hs({fulfilledTimeStamp:Date.now(),baseQueryMeta:Y.meta}))}catch(V){let O=V;if(O instanceof Yi){let X=R(F,"transformErrorResponse");const{rawErrorResponseSchema:Y,errorResponseSchema:pe}=F;let{value:fe,meta:ue}=O;try{Y&&!D&&(fe=await Dt(Y,fe,"rawErrorResponseSchema",ue)),q&&!D&&(ue=await Dt(q,ue,"metaSchema",ue));let re=await X(fe,ue,u.originalArgs);return pe&&!D&&(re=await Dt(pe,re,"errorResponseSchema",ue)),E(re,hs({baseQueryMeta:ue}))}catch(re){O=re}}try{if(O instanceof Xo){const X={endpoint:u.endpointName,arg:u.originalArgs,type:u.type,queryCacheKey:u.type==="query"?u.queryCacheKey:void 0};(U=F.onSchemaFailure)==null||U.call(F,O,X),x==null||x(O,X);const{catchSchemaFailure:Y=v}=F;if(Y)return E(Y(O,X),hs({baseQueryMeta:O._bqMeta}))}}catch(X){O=X}throw console.error(O),O}};function S(u,y){const b=l.selectQueryEntry(y,u.queryCacheKey),E=l.selectConfig(y).refetchOnMountOrArgChange,B=b==null?void 0:b.fulfilledTimeStamp,L=u.forceRefetch??(u.subscribe&&E);return L?L===!0||(Number(new Date)-Number(B))/1e3>=L:!1}const _=()=>de(`${s}/executeQuery`,P,{getPendingMeta({arg:y}){const b=n[y.endpointName];return hs({startedTimeStamp:Date.now(),...mn(b)?{direction:y.direction}:{}})},condition(y,{getState:b}){var D;const E=b(),B=l.selectQueryEntry(E,y.queryCacheKey),L=B==null?void 0:B.fulfilledTimeStamp,A=y.originalArgs,$=B==null?void 0:B.originalArgs,F=n[y.endpointName],q=y.direction;return _r(y)?!0:(B==null?void 0:B.status)==="pending"?!1:S(y,E)||fn(F)&&((D=F==null?void 0:F.forceRefetch)!=null&&D.call(F,{currentArg:A,previousArg:$,endpointState:B,state:E}))?!0:!(L&&!q)},dispatchConditionRejection:!0}),N=_(),a=_(),c=de(`${s}/executeMutation`,P,{getPendingMeta(){return hs({startedTimeStamp:Date.now()})}}),h=u=>"force"in u,k=u=>"ifOlderThan"in u,m=(u,y,b)=>(E,B)=>{const L=h(b)&&b.force,A=k(b)&&b.ifOlderThan,$=(q=!0)=>{const D={forceRefetch:q,isPrefetch:!0};return i.endpoints[u].initiate(y,D)},F=i.endpoints[u].select(y)(B());if(L)E($());else if(A){const q=F==null?void 0:F.fulfilledTimeStamp;if(!q){E($());return}(Number(new Date)-Number(new Date(q)))/1e3>=A&&E($())}else E($(!1))};function C(u){return y=>{var b,E;return((E=(b=y==null?void 0:y.meta)==null?void 0:b.arg)==null?void 0:E.endpointName)===u}}function d(u,y){return{matchPending:gn(lo(u),C(y)),matchFulfilled:gn(Mt(u),C(y)),matchRejected:gn(Br(u),C(y))}}return{queryThunk:N,mutationThunk:c,infiniteQueryThunk:a,prefetch:m,updateQueryData:w,upsertQueryData:T,patchQueryData:I,buildMatchThunkActions:d}}function Pr(s,{pages:t,pageParams:n}){const r=t.length-1;return s.getNextPageParam(t[r],t,n[r],n)}function Jo(s,{pages:t,pageParams:n}){var r;return(r=s.getPreviousPageParam)==null?void 0:r.call(s,t[0],t,n[0],n)}function Zo(s,t,n,r){return ti(n[s.meta.arg.endpointName][t],Mt(s)?s.payload:void 0,Lr(s)?s.payload:void 0,s.meta.arg.originalArgs,"baseQueryMeta"in s.meta?s.meta.baseQueryMeta:void 0,r)}function Fs(s,t,n){const r=s[t];r&&n(r)}function Ss(s){return("arg"in s?s.arg.fixedCacheKey:s.fixedCacheKey)??s.requestId}function Gi(s,t,n){const r=s[Ss(t)];r&&n(r)}var zs={};function gh({reducerPath:s,queryThunk:t,mutationThunk:n,serializeQueryArgs:r,context:{endpointDefinitions:i,apiUid:o,extractRehydrationInfo:l,hasRehydrationInfo:x},assertTagType:v,config:p}){const I=ns(`${s}/resetApiState`);function j(C,d,u,y){var b;C[b=d.queryCacheKey]??(C[b]={status:"uninitialized",endpointName:d.endpointName}),Fs(C,d.queryCacheKey,E=>{E.status="pending",E.requestId=u&&E.requestId?E.requestId:y.requestId,d.originalArgs!==void 0&&(E.originalArgs=d.originalArgs),E.startedTimeStamp=y.startedTimeStamp;const B=i[y.arg.endpointName];mn(B)&&"direction"in d&&(E.direction=d.direction)})}function f(C,d,u,y){Fs(C,d.arg.queryCacheKey,b=>{if(b.requestId!==d.requestId&&!y)return;const{merge:E}=i[d.arg.endpointName];if(b.status="fulfilled",E)if(b.data!==void 0){const{fulfilledTimeStamp:B,arg:L,baseQueryMeta:A,requestId:$}=d;let F=$r(b.data,q=>E(q,u,{arg:L.originalArgs,baseQueryMeta:A,fulfilledTimeStamp:B,requestId:$}));b.data=F}else b.data=u;else b.data=i[d.arg.endpointName].structuralSharing??!0?Yo(Ua(b.data)?Va(b.data):b.data,u):u;delete b.error,b.fulfilledTimeStamp=d.fulfilledTimeStamp})}const w=Ve({name:`${s}/queries`,initialState:zs,reducers:{removeQueryResult:{reducer(C,{payload:{queryCacheKey:d}}){delete C[d]},prepare:as()},cacheEntriesUpserted:{reducer(C,d){for(const u of d.payload){const{queryDescription:y,value:b}=u;j(C,y,!0,{arg:y,requestId:d.meta.requestId,startedTimeStamp:d.meta.timestamp}),f(C,{arg:y,requestId:d.meta.requestId,fulfilledTimeStamp:d.meta.timestamp,baseQueryMeta:{}},b,!0)}},prepare:C=>({payload:C.map(y=>{const{endpointName:b,arg:E,value:B}=y,L=i[b];return{queryDescription:{type:"query",endpointName:b,originalArgs:y.arg,queryCacheKey:r({queryArgs:E,endpointDefinition:L,endpointName:b})},value:B}}),meta:{[ao]:!0,requestId:ro(),timestamp:Date.now()}})},queryResultPatched:{reducer(C,{payload:{queryCacheKey:d,patches:u}}){Fs(C,d,y=>{y.data=oi(y.data,u.concat())})},prepare:as()}},extraReducers(C){C.addCase(t.pending,(d,{meta:u,meta:{arg:y}})=>{const b=_r(y);j(d,y,b,u)}).addCase(t.fulfilled,(d,{meta:u,payload:y})=>{const b=_r(u.arg);f(d,u,y,b)}).addCase(t.rejected,(d,{meta:{condition:u,arg:y,requestId:b},error:E,payload:B})=>{Fs(d,y.queryCacheKey,L=>{if(!u){if(L.requestId!==b)return;L.status="rejected",L.error=B??E}})}).addMatcher(x,(d,u)=>{const{queries:y}=l(u);for(const[b,E]of Object.entries(y))((E==null?void 0:E.status)==="fulfilled"||(E==null?void 0:E.status)==="rejected")&&(d[b]=E)})}}),T=Ve({name:`${s}/mutations`,initialState:zs,reducers:{removeMutationResult:{reducer(C,{payload:d}){const u=Ss(d);u in C&&delete C[u]},prepare:as()}},extraReducers(C){C.addCase(n.pending,(d,{meta:u,meta:{requestId:y,arg:b,startedTimeStamp:E}})=>{b.track&&(d[Ss(u)]={requestId:y,status:"pending",endpointName:b.endpointName,startedTimeStamp:E})}).addCase(n.fulfilled,(d,{payload:u,meta:y})=>{y.arg.track&&Gi(d,y,b=>{b.requestId===y.requestId&&(b.status="fulfilled",b.data=u,b.fulfilledTimeStamp=y.fulfilledTimeStamp)})}).addCase(n.rejected,(d,{payload:u,error:y,meta:b})=>{b.arg.track&&Gi(d,b,E=>{E.requestId===b.requestId&&(E.status="rejected",E.error=u??y)})}).addMatcher(x,(d,u)=>{const{mutations:y}=l(u);for(const[b,E]of Object.entries(y))((E==null?void 0:E.status)==="fulfilled"||(E==null?void 0:E.status)==="rejected")&&b!==(E==null?void 0:E.requestId)&&(d[b]=E)})}}),R={tags:{},keys:{}},P=Ve({name:`${s}/invalidation`,initialState:R,reducers:{updateProvidedBy:{reducer(C,d){var u,y,b;for(const{queryCacheKey:E,providedTags:B}of d.payload){S(C,E);for(const{type:L,id:A}of B){const $=(y=(u=C.tags)[L]??(u[L]={}))[b=A||"__internal_without_id"]??(y[b]=[]);$.includes(E)||$.push(E)}C.keys[E]=B}},prepare:as()}},extraReducers(C){C.addCase(w.actions.removeQueryResult,(d,{payload:{queryCacheKey:u}})=>{S(d,u)}).addMatcher(x,(d,u)=>{var b,E,B;const{provided:y}=l(u);for(const[L,A]of Object.entries(y))for(const[$,F]of Object.entries(A)){const q=(E=(b=d.tags)[L]??(b[L]={}))[B=$||"__internal_without_id"]??(E[B]=[]);for(const D of F)q.includes(D)||q.push(D)}}).addMatcher(Zs(Mt(t),Lr(t)),(d,u)=>{_(d,[u])}).addMatcher(w.actions.cacheEntriesUpserted.match,(d,u)=>{const y=u.payload.map(({queryDescription:b,value:E})=>({type:"UNKNOWN",payload:E,meta:{requestStatus:"fulfilled",requestId:"UNKNOWN",arg:b}}));_(d,y)})}});function S(C,d){var y;const u=C.keys[d]??[];for(const b of u){const E=b.type,B=b.id??"__internal_without_id",L=(y=C.tags[E])==null?void 0:y[B];L&&(C.tags[E][B]=L.filter(A=>A!==d))}delete C.keys[d]}function _(C,d){const u=d.map(y=>{const b=Zo(y,"providesTags",i,v),{queryCacheKey:E}=y.meta.arg;return{queryCacheKey:E,providedTags:b}});P.caseReducers.updateProvidedBy(C,P.actions.updateProvidedBy(u))}const N=Ve({name:`${s}/subscriptions`,initialState:zs,reducers:{updateSubscriptionOptions(C,d){},unsubscribeQueryResult(C,d){},internal_getRTKQSubscriptions(){}}}),a=Ve({name:`${s}/internalSubscriptions`,initialState:zs,reducers:{subscriptionsUpdated:{reducer(C,d){return oi(C,d.payload)},prepare:as()}}}),c=Ve({name:`${s}/config`,initialState:{online:nh(),focused:sh(),middlewareRegistered:!1,...p},reducers:{middlewareRegistered(C,{payload:d}){C.middlewareRegistered=C.middlewareRegistered==="conflict"||o!==d?"conflict":!0}},extraReducers:C=>{C.addCase(ei,d=>{d.online=!0}).addCase(Ko,d=>{d.online=!1}).addCase(Zr,d=>{d.focused=!0}).addCase(Go,d=>{d.focused=!1}).addMatcher(x,d=>({...d}))}}),h=za({queries:w.reducer,mutations:T.reducer,provided:P.reducer,subscriptions:a.reducer,config:c.reducer}),k=(C,d)=>h(I.match(d)?void 0:C,d),m={...c.actions,...w.actions,...N.actions,...a.actions,...T.actions,...P.actions,resetApiState:I};return{reducer:k,actions:m}}var nt=Symbol.for("RTKQ/skipToken"),ea={status:"uninitialized"},Ki=$r(ea,()=>{}),Xi=$r(ea,()=>{});function xh({serializeQueryArgs:s,reducerPath:t,createSelector:n}){const r=N=>Ki,i=N=>Xi;return{buildQuerySelector:f,buildInfiniteQuerySelector:w,buildMutationSelector:T,selectInvalidatedBy:R,selectCachedArgsForQuery:P,selectApiState:l,selectQueries:x,selectMutations:p,selectQueryEntry:v,selectConfig:I};function o(N){return{...N,...Ui(N.status)}}function l(N){return N[t]}function x(N){var a;return(a=l(N))==null?void 0:a.queries}function v(N,a){var c;return(c=x(N))==null?void 0:c[a]}function p(N){var a;return(a=l(N))==null?void 0:a.mutations}function I(N){var a;return(a=l(N))==null?void 0:a.config}function j(N,a,c){return h=>{if(h===nt)return n(r,c);const k=s({queryArgs:h,endpointDefinition:a,endpointName:N});return n(C=>v(C,k)??Ki,c)}}function f(N,a){return j(N,a,o)}function w(N,a){const{infiniteQueryOptions:c}=a;function h(k){const m={...k,...Ui(k.status)},{isLoading:C,isError:d,direction:u}=m,y=u==="forward",b=u==="backward";return{...m,hasNextPage:S(c,m.data),hasPreviousPage:_(c,m.data),isFetchingNextPage:C&&y,isFetchingPreviousPage:C&&b,isFetchNextPageError:d&&y,isFetchPreviousPageError:d&&b}}return j(N,a,h)}function T(){return N=>{let a;return typeof N=="object"?a=Ss(N)??nt:a=N,n(a===nt?i:k=>{var m,C;return((C=(m=l(k))==null?void 0:m.mutations)==null?void 0:C[a])??Xi},o)}}function R(N,a){const c=N[t],h=new Set;for(const k of a.filter(rn).map(Tr)){const m=c.provided.tags[k.type];if(!m)continue;let C=(k.id!==void 0?m[k.id]:Qi(Object.values(m)))??[];for(const d of C)h.add(d)}return Qi(Array.from(h.values()).map(k=>{const m=c.queries[k];return m?[{queryCacheKey:k,endpointName:m.endpointName,originalArgs:m.originalArgs}]:[]}))}function P(N,a){return Object.values(x(N)).filter(c=>(c==null?void 0:c.endpointName)===a&&c.status!=="uninitialized").map(c=>c.originalArgs)}function S(N,a){return a?Pr(N,a)!=null:!1}function _(N,a){return!a||!N.getPreviousPageParam?!1:Jo(N,a)!=null}}var Yt=WeakMap?new WeakMap:void 0,an=({endpointName:s,queryArgs:t})=>{let n="";const r=Yt==null?void 0:Yt.get(t);if(typeof r=="string")n=r;else{const i=JSON.stringify(t,(o,l)=>(l=typeof l=="bigint"?{$bigint:l.toString()}:l,l=bs(l)?Object.keys(l).sort().reduce((x,v)=>(x[v]=l[v],x),{}):l,l));bs(t)&&(Yt==null||Yt.set(t,i)),n=i}return`${s}(${n})`};function ta(...s){return function(n){const r=ii(p=>{var I;return(I=n.extractRehydrationInfo)==null?void 0:I.call(n,p,{reducerPath:n.reducerPath??"api"})}),i={reducerPath:"api",keepUnusedDataFor:60,refetchOnMountOrArgChange:!1,refetchOnFocus:!1,refetchOnReconnect:!1,invalidationBehavior:"delayed",...n,extractRehydrationInfo:r,serializeQueryArgs(p){let I=an;if("serializeQueryArgs"in p.endpointDefinition){const j=p.endpointDefinition.serializeQueryArgs;I=f=>{const w=j(f);return typeof w=="string"?w:an({...f,queryArgs:w})}}else n.serializeQueryArgs&&(I=n.serializeQueryArgs);return I(p)},tagTypes:[...n.tagTypes||[]]},o={endpointDefinitions:{},batch(p){p()},apiUid:ro(),extractRehydrationInfo:r,hasRehydrationInfo:ii(p=>r(p)!=null)},l={injectEndpoints:v,enhanceEndpoints({addTagTypes:p,endpoints:I}){if(p)for(const j of p)i.tagTypes.includes(j)||i.tagTypes.push(j);if(I)for(const[j,f]of Object.entries(I))typeof f=="function"?f(o.endpointDefinitions[j]):Object.assign(o.endpointDefinitions[j]||{},f);return l}},x=s.map(p=>p.init(l,i,o));function v(p){const I=p.endpoints({query:j=>({...j,type:"query"}),mutation:j=>({...j,type:"mutation"}),infiniteQuery:j=>({...j,type:"infinitequery"})});for(const[j,f]of Object.entries(I)){if(p.overrideExisting!==!0&&j in o.endpointDefinitions){if(p.overrideExisting==="throw")throw new Error(io(39));continue}o.endpointDefinitions[j]=f;for(const w of x)w.injectEndpoint(j,f)}return l}return l.injectEndpoints({endpoints:n.endpoints})}}function jt(s,...t){return Object.assign(s,...t)}var yh=({api:s,queryThunk:t,internalState:n})=>{const r=`${s.reducerPath}/subscriptions`;let i=null,o=null;const{updateSubscriptionOptions:l,unsubscribeQueryResult:x}=s.internalActions,v=(w,T)=>{var P,S,_;if(l.match(T)){const{queryCacheKey:N,requestId:a,options:c}=T.payload;return(P=w==null?void 0:w[N])!=null&&P[a]&&(w[N][a]=c),!0}if(x.match(T)){const{queryCacheKey:N,requestId:a}=T.payload;return w[N]&&delete w[N][a],!0}if(s.internalActions.removeQueryResult.match(T))return delete w[T.payload.queryCacheKey],!0;if(t.pending.match(T)){const{meta:{arg:N,requestId:a}}=T,c=w[S=N.queryCacheKey]??(w[S]={});return c[`${a}_running`]={},N.subscribe&&(c[a]=N.subscriptionOptions??c[a]??{}),!0}let R=!1;if(t.fulfilled.match(T)||t.rejected.match(T)){const N=w[T.meta.arg.queryCacheKey]||{},a=`${T.meta.requestId}_running`;R||(R=!!N[a]),delete N[a]}if(t.rejected.match(T)){const{meta:{condition:N,arg:a,requestId:c}}=T;if(N&&a.subscribe){const h=w[_=a.queryCacheKey]??(w[_]={});h[c]=a.subscriptionOptions??h[c]??{},R=!0}}return R},p=()=>n.currentSubscriptions,f={getSubscriptions:p,getSubscriptionCount:w=>{const R=p()[w]??{};return Jt(R)},isRequestSubscribed:(w,T)=>{var P;const R=p();return!!((P=R==null?void 0:R[w])!=null&&P[T])}};return(w,T)=>{if(i||(i=JSON.parse(JSON.stringify(n.currentSubscriptions))),s.util.resetApiState.match(w))return i=n.currentSubscriptions={},o=null,[!0,!1];if(s.internalActions.internal_getRTKQSubscriptions.match(w))return[!1,f];const R=v(n.currentSubscriptions,w);let P=!0;if(R){o||(o=setTimeout(()=>{const N=JSON.parse(JSON.stringify(n.currentSubscriptions)),[,a]=co(i,()=>N);T.next(s.internalActions.subscriptionsUpdated(a)),i=N,o=null},500));const S=typeof w.type=="string"&&!!w.type.startsWith(r),_=t.rejected.match(w)&&w.meta.condition&&!!w.meta.arg.subscribe;P=!S&&!_}return[P,!1]}};function bh(s){for(const t in s)return!1;return!0}var jh=2147483647/1e3-1,vh=({reducerPath:s,api:t,queryThunk:n,context:r,internalState:i,selectors:{selectQueryEntry:o,selectConfig:l}})=>{const{removeQueryResult:x,unsubscribeQueryResult:v,cacheEntriesUpserted:p}=t.internalActions,I=Zs(v.match,n.fulfilled,n.rejected,p.match);function j(P){const S=i.currentSubscriptions[P];return!!S&&!bh(S)}const f={},w=(P,S,_)=>{const N=S.getState(),a=l(N);if(I(P)){let c;if(p.match(P))c=P.payload.map(h=>h.queryDescription.queryCacheKey);else{const{queryCacheKey:h}=v.match(P)?P.payload:P.meta.arg;c=[h]}T(c,S,a)}if(t.util.resetApiState.match(P))for(const[c,h]of Object.entries(f))h&&clearTimeout(h),delete f[c];if(r.hasRehydrationInfo(P)){const{queries:c}=r.extractRehydrationInfo(P);T(Object.keys(c),S,a)}};function T(P,S,_){const N=S.getState();for(const a of P){const c=o(N,a);R(a,c==null?void 0:c.endpointName,S,_)}}function R(P,S,_,N){const a=r.endpointDefinitions[S],c=(a==null?void 0:a.keepUnusedDataFor)??N.keepUnusedDataFor;if(c===1/0)return;const h=Math.max(0,Math.min(c,jh));if(!j(P)){const k=f[P];k&&clearTimeout(k),f[P]=setTimeout(()=>{j(P)||_.dispatch(x({queryCacheKey:P})),delete f[P]},h*1e3)}}return w},Ji=new Error("Promise never resolved before cacheEntryRemoved."),wh=({api:s,reducerPath:t,context:n,queryThunk:r,mutationThunk:i,internalState:o,selectors:{selectQueryEntry:l,selectApiState:x}})=>{const v=ai(r),p=ai(i),I=Mt(r,i),j={};function f(S,_,N){const a=j[S];a!=null&&a.valueResolved&&(a.valueResolved({data:_,meta:N}),delete a.valueResolved)}function w(S){const _=j[S];_&&(delete j[S],_.cacheEntryRemoved())}const T=(S,_,N)=>{const a=R(S);function c(h,k,m,C){const d=l(N,k),u=l(_.getState(),k);!d&&u&&P(h,C,k,_,m)}if(r.pending.match(S))c(S.meta.arg.endpointName,a,S.meta.requestId,S.meta.arg.originalArgs);else if(s.internalActions.cacheEntriesUpserted.match(S))for(const{queryDescription:h,value:k}of S.payload){const{endpointName:m,originalArgs:C,queryCacheKey:d}=h;c(m,d,S.meta.requestId,C),f(d,k,{})}else if(i.pending.match(S))_.getState()[t].mutations[a]&&P(S.meta.arg.endpointName,S.meta.arg.originalArgs,a,_,S.meta.requestId);else if(I(S))f(a,S.payload,S.meta.baseQueryMeta);else if(s.internalActions.removeQueryResult.match(S)||s.internalActions.removeMutationResult.match(S))w(a);else if(s.util.resetApiState.match(S))for(const h of Object.keys(j))w(h)};function R(S){return v(S)?S.meta.arg.queryCacheKey:p(S)?S.meta.arg.fixedCacheKey??S.meta.requestId:s.internalActions.removeQueryResult.match(S)?S.payload.queryCacheKey:s.internalActions.removeMutationResult.match(S)?Ss(S.payload):""}function P(S,_,N,a,c){const h=n.endpointDefinitions[S],k=h==null?void 0:h.onCacheEntryAdded;if(!k)return;const m={},C=new Promise(B=>{m.cacheEntryRemoved=B}),d=Promise.race([new Promise(B=>{m.valueResolved=B}),C.then(()=>{throw Ji})]);d.catch(()=>{}),j[N]=m;const u=s.endpoints[S].select(on(h)?_:N),y=a.dispatch((B,L,A)=>A),b={...a,getCacheEntry:()=>u(a.getState()),requestId:c,extra:y,updateCachedData:on(h)?B=>a.dispatch(s.util.updateQueryData(S,_,B)):void 0,cacheDataLoaded:d,cacheEntryRemoved:C},E=k(_,b);Promise.resolve(E).catch(B=>{if(B!==Ji)throw B})}return T},Sh=({api:s,context:{apiUid:t},reducerPath:n})=>(r,i)=>{s.util.resetApiState.match(r)&&i.dispatch(s.internalActions.middlewareRegistered(t))},kh=({reducerPath:s,context:t,context:{endpointDefinitions:n},mutationThunk:r,queryThunk:i,api:o,assertTagType:l,refetchQuery:x,internalState:v})=>{const{removeQueryResult:p}=o.internalActions,I=Zs(Mt(r),Lr(r)),j=Zs(Mt(r,i),Br(r,i));let f=[];const w=(P,S)=>{I(P)?R(Zo(P,"invalidatesTags",n,l),S):j(P)?R([],S):o.util.invalidateTags.match(P)&&R(ti(P.payload,void 0,void 0,void 0,void 0,l),S)};function T(P){var N;const{queries:S,mutations:_}=P;for(const a of[S,_])for(const c in a)if(((N=a[c])==null?void 0:N.status)==="pending")return!0;return!1}function R(P,S){const _=S.getState(),N=_[s];if(f.push(...P),N.config.invalidationBehavior==="delayed"&&T(N))return;const a=f;if(f=[],a.length===0)return;const c=o.util.selectInvalidatedBy(_,a);t.batch(()=>{const h=Array.from(c.values());for(const{queryCacheKey:k}of h){const m=N.queries[k],C=v.currentSubscriptions[k]??{};m&&(Jt(C)===0?S.dispatch(p({queryCacheKey:k})):m.status!=="uninitialized"&&S.dispatch(x(m)))}})}return w},Eh=({reducerPath:s,queryThunk:t,api:n,refetchQuery:r,internalState:i})=>{const o={},l=(f,w)=>{(n.internalActions.updateSubscriptionOptions.match(f)||n.internalActions.unsubscribeQueryResult.match(f))&&v(f.payload,w),(t.pending.match(f)||t.rejected.match(f)&&f.meta.condition)&&v(f.meta.arg,w),(t.fulfilled.match(f)||t.rejected.match(f)&&!f.meta.condition)&&x(f.meta.arg,w),n.util.resetApiState.match(f)&&I()};function x({queryCacheKey:f},w){const T=w.getState()[s],R=T.queries[f],P=i.currentSubscriptions[f];if(!R||R.status==="uninitialized")return;const{lowestPollingInterval:S,skipPollingIfUnfocused:_}=j(P);if(!Number.isFinite(S))return;const N=o[f];N!=null&&N.timeout&&(clearTimeout(N.timeout),N.timeout=void 0);const a=Date.now()+S;o[f]={nextPollTimestamp:a,pollingInterval:S,timeout:setTimeout(()=>{(T.config.focused||!_)&&w.dispatch(r(R)),x({queryCacheKey:f},w)},S)}}function v({queryCacheKey:f},w){const R=w.getState()[s].queries[f],P=i.currentSubscriptions[f];if(!R||R.status==="uninitialized")return;const{lowestPollingInterval:S}=j(P);if(!Number.isFinite(S)){p(f);return}const _=o[f],N=Date.now()+S;(!_||N<_.nextPollTimestamp)&&x({queryCacheKey:f},w)}function p(f){const w=o[f];w!=null&&w.timeout&&clearTimeout(w.timeout),delete o[f]}function I(){for(const f of Object.keys(o))p(f)}function j(f={}){let w=!1,T=Number.POSITIVE_INFINITY;for(let R in f)f[R].pollingInterval&&(T=Math.min(f[R].pollingInterval,T),w=f[R].skipPollingIfUnfocused||w);return{lowestPollingInterval:T,skipPollingIfUnfocused:w}}return l},Ih=({api:s,context:t,queryThunk:n,mutationThunk:r})=>{const i=lo(n,r),o=Br(n,r),l=Mt(n,r),x={};return(p,I)=>{var j,f;if(i(p)){const{requestId:w,arg:{endpointName:T,originalArgs:R}}=p.meta,P=t.endpointDefinitions[T],S=P==null?void 0:P.onQueryStarted;if(S){const _={},N=new Promise((k,m)=>{_.resolve=k,_.reject=m});N.catch(()=>{}),x[w]=_;const a=s.endpoints[T].select(on(P)?R:w),c=I.dispatch((k,m,C)=>C),h={...I,getCacheEntry:()=>a(I.getState()),requestId:w,extra:c,updateCachedData:on(P)?k=>I.dispatch(s.util.updateQueryData(T,R,k)):void 0,queryFulfilled:N};S(R,h)}}else if(l(p)){const{requestId:w,baseQueryMeta:T}=p.meta;(j=x[w])==null||j.resolve({data:p.payload,meta:T}),delete x[w]}else if(o(p)){const{requestId:w,rejectedWithValue:T,baseQueryMeta:R}=p.meta;(f=x[w])==null||f.reject({error:p.payload??p.error,isUnhandledError:!T,meta:R}),delete x[w]}}},Ch=({reducerPath:s,context:t,api:n,refetchQuery:r,internalState:i})=>{const{removeQueryResult:o}=n.internalActions,l=(v,p)=>{Zr.match(v)&&x(p,"refetchOnFocus"),ei.match(v)&&x(p,"refetchOnReconnect")};function x(v,p){const I=v.getState()[s],j=I.queries,f=i.currentSubscriptions;t.batch(()=>{for(const w of Object.keys(f)){const T=j[w],R=f[w];if(!R||!T)continue;(Object.values(R).some(S=>S[p]===!0)||Object.values(R).every(S=>S[p]===void 0)&&I.config[p])&&(Jt(R)===0?v.dispatch(o({queryCacheKey:w})):T.status!=="uninitialized"&&v.dispatch(r(T)))}})}return l};function Nh(s){const{reducerPath:t,queryThunk:n,api:r,context:i}=s,{apiUid:o}=i,l={invalidateTags:ns(`${t}/invalidateTags`)},x=j=>j.type.startsWith(`${t}/`),v=[Sh,vh,kh,Eh,wh,Ih];return{middleware:j=>{let f=!1;const T={...s,internalState:{currentSubscriptions:{}},refetchQuery:I,isThisApiSliceAction:x},R=v.map(_=>_(T)),P=yh(T),S=Ch(T);return _=>N=>{if(!qa(N))return _(N);f||(f=!0,j.dispatch(r.internalActions.middlewareRegistered(o)));const a={...j,next:_},c=j.getState(),[h,k]=P(N,a,c);let m;if(h?m=_(N):m=k,j.getState()[t]&&(S(N,a,c),x(N)||i.hasRehydrationInfo(N)))for(const C of R)C(N,a,c);return m}},actions:l};function I(j){return s.api.endpoints[j.endpointName].initiate(j.originalArgs,{subscribe:!1,forceRefetch:!0})}}var Zi=Symbol(),sa=({createSelector:s=oo}={})=>({name:Zi,init(t,{baseQuery:n,tagTypes:r,reducerPath:i,serializeQueryArgs:o,keepUnusedDataFor:l,refetchOnMountOrArgChange:x,refetchOnFocus:v,refetchOnReconnect:p,invalidationBehavior:I,onSchemaFailure:j,catchSchemaFailure:f,skipSchemaValidation:w},T){Fa();const R=O=>O;Object.assign(t,{reducerPath:i,endpoints:{},internalActions:{onOnline:ei,onOffline:Ko,onFocus:Zr,onFocusLost:Go},util:{}});const P=xh({serializeQueryArgs:o,reducerPath:i,createSelector:s}),{selectInvalidatedBy:S,selectCachedArgsForQuery:_,buildQuerySelector:N,buildInfiniteQuerySelector:a,buildMutationSelector:c}=P;jt(t.util,{selectInvalidatedBy:S,selectCachedArgsForQuery:_});const{queryThunk:h,infiniteQueryThunk:k,mutationThunk:m,patchQueryData:C,updateQueryData:d,upsertQueryData:u,prefetch:y,buildMatchThunkActions:b}=mh({baseQuery:n,reducerPath:i,context:T,api:t,serializeQueryArgs:o,assertTagType:R,selectors:P,onSchemaFailure:j,catchSchemaFailure:f,skipSchemaValidation:w}),{reducer:E,actions:B}=gh({context:T,queryThunk:h,mutationThunk:m,serializeQueryArgs:o,reducerPath:i,assertTagType:R,config:{refetchOnFocus:v,refetchOnReconnect:p,refetchOnMountOrArgChange:x,keepUnusedDataFor:l,reducerPath:i,invalidationBehavior:I}});jt(t.util,{patchQueryData:C,updateQueryData:d,upsertQueryData:u,prefetch:y,resetApiState:B.resetApiState,upsertQueryEntries:B.cacheEntriesUpserted}),jt(t.internalActions,B);const{middleware:L,actions:A}=Nh({reducerPath:i,context:T,queryThunk:h,mutationThunk:m,infiniteQueryThunk:k,api:t,assertTagType:R,selectors:P});jt(t.util,A),jt(t,{reducer:E,middleware:L});const{buildInitiateQuery:$,buildInitiateInfiniteQuery:F,buildInitiateMutation:q,getRunningMutationThunk:D,getRunningMutationsThunk:M,getRunningQueriesThunk:U,getRunningQueryThunk:V}=ph({queryThunk:h,mutationThunk:m,infiniteQueryThunk:k,api:t,serializeQueryArgs:o,context:T});return jt(t.util,{getRunningMutationThunk:D,getRunningMutationsThunk:M,getRunningQueryThunk:V,getRunningQueriesThunk:U}),{name:Zi,injectEndpoint(O,X){var fe;const pe=(fe=t.endpoints)[O]??(fe[O]={});fn(X)&&jt(pe,{name:O,select:N(O,X),initiate:$(O,X)},b(h,O)),dh(X)&&jt(pe,{name:O,select:c(),initiate:q(O)},b(m,O)),mn(X)&&jt(pe,{name:O,select:a(O,X),initiate:F(O,X)},b(h,O))}}}});sa();function Os(s){return s.replace(s[0],s[0].toUpperCase())}function Ah(s){return s.type==="query"}function Rh(s){return s.type==="mutation"}function na(s){return s.type==="infinitequery"}function ps(s,...t){return Object.assign(s,...t)}var Bn=Symbol();function Mn(s,t,n,r){const i=g.useMemo(()=>({queryArgs:s,serialized:typeof s=="object"?t({queryArgs:s,endpointDefinition:n,endpointName:r}):s}),[s,t,n,r]),o=g.useRef(i);return g.useEffect(()=>{o.current.serialized!==i.serialized&&(o.current=i)},[i]),o.current.serialized===i.serialized?o.current.queryArgs:s}function qs(s){const t=g.useRef(s);return g.useEffect(()=>{ms(t.current,s)||(t.current=s)},[s]),ms(t.current,s)?t.current:s}var Th=()=>typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",_h=Th(),Ph=()=>typeof navigator<"u"&&navigator.product==="ReactNative",Dh=Ph(),$h=()=>_h||Dh?g.useLayoutEffect:g.useEffect,Lh=$h(),eo=s=>s.isUninitialized?{...s,isUninitialized:!1,isFetching:!0,isLoading:s.data===void 0,status:Ho.pending}:s;function Fn(s,...t){const n={};return t.forEach(r=>{n[r]=s[r]}),n}var zn=["data","status","isLoading","isSuccess","isError","error"];function Bh({api:s,moduleOptions:{batch:t,hooks:{useDispatch:n,useSelector:r,useStore:i},unstable__sideEffectsInRender:o,createSelector:l},serializeQueryArgs:x,context:v}){const p=o?a=>a():g.useEffect;return{buildQueryHooks:S,buildInfiniteQueryHooks:_,buildMutationHook:N,usePrefetch:f};function I(a,c,h){if(c!=null&&c.endpointName&&a.isUninitialized){const{endpointName:y}=c,b=v.endpointDefinitions[y];h!==nt&&x({queryArgs:c.originalArgs,endpointDefinition:b,endpointName:y})===x({queryArgs:h,endpointDefinition:b,endpointName:y})&&(c=void 0)}let k=a.isSuccess?a.data:c==null?void 0:c.data;k===void 0&&(k=a.data);const m=k!==void 0,C=a.isLoading,d=(!c||c.isLoading||c.isUninitialized)&&!m&&C,u=a.isSuccess||m&&(C&&!(c!=null&&c.isError)||a.isUninitialized);return{...a,data:k,currentData:a.data,isFetching:C,isLoading:d,isSuccess:u}}function j(a,c,h){if(c!=null&&c.endpointName&&a.isUninitialized){const{endpointName:y}=c,b=v.endpointDefinitions[y];h!==nt&&x({queryArgs:c.originalArgs,endpointDefinition:b,endpointName:y})===x({queryArgs:h,endpointDefinition:b,endpointName:y})&&(c=void 0)}let k=a.isSuccess?a.data:c==null?void 0:c.data;k===void 0&&(k=a.data);const m=k!==void 0,C=a.isLoading,d=(!c||c.isLoading||c.isUninitialized)&&!m&&C,u=a.isSuccess||C&&m;return{...a,data:k,currentData:a.data,isFetching:C,isLoading:d,isSuccess:u}}function f(a,c){const h=n(),k=qs(c);return g.useCallback((m,C)=>h(s.util.prefetch(a,m,{...k,...C})),[a,h,k])}function w(a,c,{refetchOnReconnect:h,refetchOnFocus:k,refetchOnMountOrArgChange:m,skip:C=!1,pollingInterval:d=0,skipPollingIfUnfocused:u=!1,...y}={}){const{initiate:b}=s.endpoints[a],E=n(),B=g.useRef(void 0);if(!B.current){const O=E(s.internalActions.internal_getRTKQSubscriptions());B.current=O}const L=Mn(C?nt:c,an,v.endpointDefinitions[a],a),A=qs({refetchOnReconnect:h,refetchOnFocus:k,pollingInterval:d,skipPollingIfUnfocused:u}),$=y.initialPageParam,F=qs($),q=g.useRef(void 0);let{queryCacheKey:D,requestId:M}=q.current||{},U=!1;D&&M&&(U=B.current.isRequestSubscribed(D,M));const V=!U&&q.current!==void 0;return p(()=>{V&&(q.current=void 0)},[V]),p(()=>{var Y;const O=q.current;if(L===nt){O==null||O.unsubscribe(),q.current=void 0;return}const X=(Y=q.current)==null?void 0:Y.subscriptionOptions;if(!O||O.arg!==L){O==null||O.unsubscribe();const pe=E(b(L,{subscriptionOptions:A,forceRefetch:m,...na(v.endpointDefinitions[a])?{initialPageParam:F}:{}}));q.current=pe}else A!==X&&O.updateSubscriptionOptions(A)},[E,b,m,L,A,V,F,a]),[q,E,b,A]}function T(a,c){return(k,{skip:m=!1,selectFromResult:C}={})=>{const{select:d}=s.endpoints[a],u=Mn(m?nt:k,x,v.endpointDefinitions[a],a),y=g.useRef(void 0),b=g.useMemo(()=>l([d(u),($,F)=>F,$=>u],c,{memoizeOptions:{resultEqualityCheck:ms}}),[d,u]),E=g.useMemo(()=>C?l([b],C,{devModeChecks:{identityFunctionCheck:"never"}}):b,[b,C]),B=r($=>E($,y.current),ms),L=i(),A=b(L.getState(),y.current);return Lh(()=>{y.current=A},[A]),B}}function R(a){g.useEffect(()=>()=>{var c,h;(h=(c=a.current)==null?void 0:c.unsubscribe)==null||h.call(c),a.current=void 0},[a])}function P(a){if(!a.current)throw new Error(io(38));return a.current.refetch()}function S(a){const c=(m,C={})=>{const[d]=w(a,m,C);return R(d),g.useMemo(()=>({refetch:()=>P(d)}),[d])},h=({refetchOnReconnect:m,refetchOnFocus:C,pollingInterval:d=0,skipPollingIfUnfocused:u=!1}={})=>{const{initiate:y}=s.endpoints[a],b=n(),[E,B]=g.useState(Bn),L=g.useRef(void 0),A=qs({refetchOnReconnect:m,refetchOnFocus:C,pollingInterval:d,skipPollingIfUnfocused:u});p(()=>{var M,U;const D=(M=L.current)==null?void 0:M.subscriptionOptions;A!==D&&((U=L.current)==null||U.updateSubscriptionOptions(A))},[A]);const $=g.useRef(A);p(()=>{$.current=A},[A]);const F=g.useCallback(function(D,M=!1){let U;return t(()=>{var V;(V=L.current)==null||V.unsubscribe(),L.current=U=b(y(D,{subscriptionOptions:$.current,forceRefetch:!M})),B(D)}),U},[b,y]),q=g.useCallback(()=>{var D,M;(D=L.current)!=null&&D.queryCacheKey&&b(s.internalActions.removeQueryResult({queryCacheKey:(M=L.current)==null?void 0:M.queryCacheKey}))},[b]);return g.useEffect(()=>()=>{var D;(D=L==null?void 0:L.current)==null||D.unsubscribe()},[]),g.useEffect(()=>{E!==Bn&&!L.current&&F(E,!0)},[E,F]),g.useMemo(()=>[F,E,{reset:q}],[F,E,q])},k=T(a,I);return{useQueryState:k,useQuerySubscription:c,useLazyQuerySubscription:h,useLazyQuery(m){const[C,d,{reset:u}]=h(m),y=k(d,{...m,skip:d===Bn}),b=g.useMemo(()=>({lastArg:d}),[d]);return g.useMemo(()=>[C,{...y,reset:u},b],[C,y,u,b])},useQuery(m,C){const d=c(m,C),u=k(m,{selectFromResult:m===nt||C!=null&&C.skip?void 0:eo,...C}),y=Fn(u,...zn);return g.useDebugValue(y),g.useMemo(()=>({...u,...d}),[u,d])}}}function _(a){const c=(k,m={})=>{const[C,d,u,y]=w(a,k,m),b=g.useRef(y);p(()=>{b.current=y},[y]);const E=g.useCallback(function(A,$){let F;return t(()=>{var q;(q=C.current)==null||q.unsubscribe(),C.current=F=d(u(A,{subscriptionOptions:b.current,direction:$}))}),F},[C,d,u]);R(C);const B=Mn(m.skip?nt:k,an,v.endpointDefinitions[a],a),L=g.useCallback(()=>P(C),[C]);return g.useMemo(()=>({trigger:E,refetch:L,fetchNextPage:()=>E(B,"forward"),fetchPreviousPage:()=>E(B,"backward")}),[L,E,B])},h=T(a,j);return{useInfiniteQueryState:h,useInfiniteQuerySubscription:c,useInfiniteQuery(k,m){const{refetch:C,fetchNextPage:d,fetchPreviousPage:u}=c(k,m),y=h(k,{selectFromResult:k===nt||m!=null&&m.skip?void 0:eo,...m}),b=Fn(y,...zn,"hasNextPage","hasPreviousPage");return g.useDebugValue(b),g.useMemo(()=>({...y,fetchNextPage:d,fetchPreviousPage:u,refetch:C}),[y,d,u,C])}}}function N(a){return({selectFromResult:c,fixedCacheKey:h}={})=>{const{select:k,initiate:m}=s.endpoints[a],C=n(),[d,u]=g.useState();g.useEffect(()=>()=>{d!=null&&d.arg.fixedCacheKey||d==null||d.reset()},[d]);const y=g.useCallback(function(D){const M=C(m(D,{fixedCacheKey:h}));return u(M),M},[C,m,h]),{requestId:b}=d||{},E=g.useMemo(()=>k({fixedCacheKey:h,requestId:d==null?void 0:d.requestId}),[h,d,k]),B=g.useMemo(()=>c?l([E],c):E,[c,E]),L=r(B,ms),A=h==null?d==null?void 0:d.arg.originalArgs:void 0,$=g.useCallback(()=>{t(()=>{d&&u(void 0),h&&C(s.internalActions.removeMutationResult({requestId:b,fixedCacheKey:h}))})},[C,h,d,b]),F=Fn(L,...zn,"endpointName");g.useDebugValue(F);const q=g.useMemo(()=>({...L,originalArgs:A,reset:$}),[L,A,$]);return g.useMemo(()=>[y,q],[y,q])}}}var Mh=Symbol(),Fh=({batch:s=Qa,hooks:t={useDispatch:xt,useSelector:Me,useStore:Wa},createSelector:n=oo,unstable__sideEffectsInRender:r=!1,...i}={})=>({name:Mh,init(o,{serializeQueryArgs:l},x){const v=o,{buildQueryHooks:p,buildInfiniteQueryHooks:I,buildMutationHook:j,usePrefetch:f}=Bh({api:o,moduleOptions:{batch:s,hooks:t,unstable__sideEffectsInRender:r,createSelector:n},serializeQueryArgs:l,context:x});return ps(v,{usePrefetch:f}),ps(x,{batch:s}),{injectEndpoint(w,T){if(Ah(T)){const{useQuery:R,useLazyQuery:P,useLazyQuerySubscription:S,useQueryState:_,useQuerySubscription:N}=p(w);ps(v.endpoints[w],{useQuery:R,useLazyQuery:P,useLazyQuerySubscription:S,useQueryState:_,useQuerySubscription:N}),o[`use${Os(w)}Query`]=R,o[`useLazy${Os(w)}Query`]=P}if(Rh(T)){const R=j(w);ps(v.endpoints[w],{useMutation:R}),o[`use${Os(w)}Mutation`]=R}else if(na(T)){const{useInfiniteQuery:R,useInfiniteQuerySubscription:P,useInfiniteQueryState:S}=I(w);ps(v.endpoints[w],{useInfiniteQuery:R,useInfiniteQuerySubscription:P,useInfiniteQueryState:S}),o[`use${Os(w)}InfiniteQuery`]=R}}}}}),si=ta(sa(),Fh());const zh="/api",Xs=si({reducerPath:"exhibitorInvoiceApi",baseQuery:Jr({baseUrl:zh,credentials:"include",prepareHeaders:s=>{const t=localStorage.getItem("exhibitor_token");return t&&s.set("authorization",`Bearer ${t}`),s.set("Content-Type","application/json"),s.set("Accept","application/json"),s}}),tagTypes:["ExhibitorInvoice"],endpoints:s=>({getExhibitorInvoice:s.query({query:t=>({url:`/exhibitor-bookings/${t}/invoice`,method:"GET"}),transformResponse:t=>t,transformErrorResponse:t=>t,providesTags:(t,n,r)=>[{type:"ExhibitorInvoice",id:r}]}),downloadExhibitorInvoice:s.mutation({query:t=>({url:`/exhibitor-bookings/${t}/invoice/download`,method:"GET",responseHandler:n=>n.blob()})}),shareViaEmail:s.mutation({query:({bookingId:t,...n})=>({url:`/exhibitor-bookings/${t}/invoice/share/email`,method:"POST",body:n})}),shareViaWhatsApp:s.mutation({query:({bookingId:t,...n})=>({url:`/exhibitor-bookings/${t}/invoice/share/whatsapp`,method:"POST",body:n})})})}),{useGetExhibitorInvoiceQuery:Oh,useDownloadExhibitorInvoiceMutation:qh,useShareViaEmailMutation:Uh,useShareViaWhatsAppMutation:Vh}=Xs,Qh=({booking:s})=>{var d,u,y;const[t,n]=g.useState(null),[r,i]=g.useState(!0),o=Me(b=>b.settings.settings);g.useEffect(()=>{(async()=>{i(!0);try{if(s.exhibitionId.headerLogo){const E=s.exhibitionId.headerLogo;n(`${K.defaults.baseURL}/public/uploads/${E}`),console.log("Using exhibition header logo:",E)}else if(o!=null&&o.logo){const E=o.logo;n(`${K.defaults.baseURL}/public/uploads/${E}`),console.log("Using global settings logo:",E)}else{const E=`${K.defaults.baseURL}/public/logo`;n(E),console.log("Using public logo endpoint:",E)}}catch(E){console.error("Error loading logo:",E),n(null)}finally{i(!1)}})()},[s.exhibitionId.headerLogo,o==null?void 0:o.logo]);const l=()=>{const b=new Date(s.exhibitionId.startDate||""),E=new Date(s.exhibitionId.endDate||""),B={};let L=new Date(b);for(;L<=E;){const $=L.toLocaleString("default",{month:"short",year:"numeric"});B[$]||(B[$]=[]),B[$].push(L.getDate().toString().padStart(2,"0")),L=new Date(L),L.setDate(L.getDate()+1)}const A=Object.entries(B).map(([$,F])=>`${F.join(", ")} ${$}`);return`${s.exhibitionId.name||"ABSE"} (${A.join(" & ")})`},x=b=>{const E=new Date(b);return{date:E.toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"}),time:E.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0})}},v=s.stallIds.map((b,E)=>{var $;const B=b,L=b.dimensions.width*b.dimensions.height,A=L*b.ratePerSqm;return{key:b._id,sn:E+1,stallNo:b.number,stallType:(($=B.stallTypeId)==null?void 0:$.name)||"Standard",dimensions:`${b.dimensions.width}x${b.dimensions.height}m`,area:L.toFixed(0),rate:b.ratePerSqm.toFixed(0),amount:A}}),p=v.reduce((b,E)=>b+E.amount,0),I=s.calculations,j=((d=I.stalls[0])==null?void 0:d.discount)!==void 0&&((u=I.stalls[0])==null?void 0:u.discount)!==null,f=j?(y=I.stalls[0])==null?void 0:y.discount:null,w=(f==null?void 0:f.type)||"percentage",T=(f==null?void 0:f.value)||0;let R=0;j&&T>0&&(w==="percentage"?R=Math.round(p*T/100*100)/100:w==="fixed"&&(R=Math.min(T,p)));const P=p-R,S=I.taxes.find(b=>b.name.includes("GST")),_=S?S.rate:18,N=Math.round(P*_/100*100)/100,a=P+N,c=p,h=R,k=P,m=N,C=a;return e.jsx("div",{className:"invoice-container",children:e.jsxs("div",{className:"proforma-invoice",children:[e.jsxs("div",{className:"header-section",children:[e.jsx("div",{className:"logo-cell",children:r?e.jsx("div",{className:"logo-loading",children:"Loading..."}):t?e.jsx("img",{src:t,alt:s.exhibitionId.companyName,className:"logo-image",onError:()=>n(null)}):s.exhibitionId.companyName}),e.jsxs("div",{className:"title-company",children:[e.jsx("div",{className:"title-cell",children:"PROFORMA INVOICE"}),e.jsx("div",{className:"company-cell",children:s.exhibitionId.companyName})]})]}),e.jsxs("div",{className:"bill-to-section",children:[e.jsx("div",{className:"bill-to-cell",children:"Bill To"}),e.jsxs("div",{className:"bill-to-info",children:[e.jsxs("div",{className:"info-row",children:[e.jsx("div",{className:"label-cell",children:"Company Name"}),e.jsx("div",{className:"value-cell",children:s.companyName}),e.jsx("div",{className:"date-label-cell",children:"Date"}),e.jsx("div",{className:"date-value-cell",children:x(s.createdAt).date})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("div",{className:"label-cell",children:"Phone No."}),e.jsx("div",{className:"value-cell",children:s.customerPhone}),e.jsx("div",{className:"date-label-cell",children:"Time"}),e.jsx("div",{className:"date-value-cell",children:x(s.createdAt).time})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("div",{className:"label-cell",children:"GST No."}),e.jsx("div",{className:"value-cell",children:s.customerGSTIN}),e.jsx("div",{className:"date-label-cell",children:"Invoice No"}),e.jsx("div",{className:"date-value-cell",children:s.invoiceNumber})]}),e.jsxs("div",{className:"info-row",children:[e.jsx("div",{className:"label-cell",children:"Address"}),e.jsx("div",{className:"value-cell",children:s.customerAddress})]})]})]}),e.jsxs("div",{className:"expo-venue-section",children:[e.jsxs("div",{className:"expo-column",children:[e.jsx("div",{className:"heading",children:"Expo Name"}),e.jsx("div",{className:"content",children:l()})]}),e.jsxs("div",{className:"venue-column",children:[e.jsx("div",{className:"heading",children:"Venue"}),e.jsx("div",{className:"content",children:s.exhibitionId.venue})]})]}),e.jsx("div",{className:"section-header stall-summary-header",children:"Stall Summary"}),e.jsxs("div",{className:"stall-table",children:[e.jsxs("div",{className:"stall-header",children:[e.jsx("div",{className:"stall-header-cell",children:"S/N"}),e.jsx("div",{className:"stall-header-cell",children:"Stall No."}),e.jsx("div",{className:"stall-header-cell",children:"Stall Type"}),e.jsx("div",{className:"stall-header-cell",children:"Dimensions"}),e.jsx("div",{className:"stall-header-cell",children:"Area (sqm)"}),e.jsx("div",{className:"stall-header-cell",children:"Rate (per sqm)"}),e.jsx("div",{className:"stall-header-cell",children:"Amount"})]}),v.map(b=>e.jsxs("div",{className:"stall-row",children:[e.jsx("div",{className:"stall-cell",children:b.sn}),e.jsx("div",{className:"stall-cell",children:b.stallNo}),e.jsx("div",{className:"stall-cell",children:b.stallType}),e.jsx("div",{className:"stall-cell",children:b.dimensions}),e.jsx("div",{className:"stall-cell",children:b.area}),e.jsx("div",{className:"stall-cell",children:Number(b.rate).toLocaleString("en-IN")}),e.jsx("div",{className:"stall-cell",children:b.amount.toLocaleString("en-IN")})]},b.key))]}),e.jsx("div",{className:"section-header",children:"Calculation Summary"}),e.jsxs("div",{className:"calc-table",children:[e.jsxs("div",{className:"calc-row",children:[e.jsx("div",{className:"calc-label",children:"Total Basic Amount"}),e.jsxs("div",{className:"calc-value",children:["₹",c.toLocaleString("en-IN")]})]}),j&&h>0&&e.jsxs("div",{className:"calc-row",children:[e.jsx("div",{className:"calc-label",children:w==="percentage"?`Discount (${T}%)`:`Discount (Fixed ₹${T.toLocaleString("en-IN")})`}),e.jsxs("div",{className:"calc-value",children:["-₹",h.toLocaleString("en-IN")]})]}),e.jsxs("div",{className:"calc-row",children:[e.jsx("div",{className:"calc-label",children:j&&h>0?"Amount after Discount":"Net Amount"}),e.jsxs("div",{className:"calc-value",children:["₹",k.toLocaleString("en-IN")]})]}),e.jsxs("div",{className:"calc-row",children:[e.jsxs("div",{className:"calc-label",children:["GST (",_,"%)"]}),e.jsxs("div",{className:"calc-value",children:["₹",m.toLocaleString("en-IN")]})]}),e.jsxs("div",{className:"calc-row total-row",children:[e.jsx("div",{className:"calc-label",children:"Total Amount"}),e.jsxs("div",{className:"calc-value",children:["₹",C.toLocaleString("en-IN")]})]})]}),e.jsxs("div",{className:"details-section",children:[e.jsxs("div",{className:"bank-details",children:[e.jsx("div",{className:"details-header",children:"Bank Details"}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Bank Name"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.bankName})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Account No."}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.bankAccount})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Name"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.bankAccountName})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Branch"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.bankBranch})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"IFSC CODE"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.bankIFSC})]})]}),e.jsxs("div",{className:"company-details",children:[e.jsx("div",{className:"details-header",children:"Company Details"}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"CIN No."}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyCIN})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Pan No."}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyPAN})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"SAC CODE"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companySAC})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"GST No."}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyGST})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Email"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyEmail})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Website"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyWebsite})]}),e.jsxs("div",{className:"details-row",children:[e.jsx("div",{className:"detail-label",children:"Address"}),e.jsx("div",{className:"detail-value",children:s.exhibitionId.companyAddress})]})]})]}),e.jsxs("div",{className:"instruction-section",children:[e.jsx("div",{className:"instruction-header",children:"PI Instruction"}),e.jsx("div",{className:"instruction-content",dangerouslySetInnerHTML:{__html:s.exhibitionId.piInstructions||"THIS INVOICE IS PROFORMA INVOICE DO NOT CLAIM ANY GOVERNMENT CREDITS ON THIS PROFORMA INVOICE. FINAL INVOICE WOULD BE RAISED AFTER 100% PAYMENT."}})]}),e.jsxs("div",{className:"instruction-section",children:[e.jsx("div",{className:"instruction-header",children:"Terms & Conditions"}),e.jsx("div",{className:"instruction-content",dangerouslySetInnerHTML:{__html:s.exhibitionId.termsAndConditions||'All cheques / Drafts should be payable to "AAKAR EXHIBITION Private Limited". This bill is payable as per agreed terms. All delayed payments will be charged interest @ 18% p.a. All Complaints / Disputes, if any on this bill should reach us within 15 days on receipt of bill, failing which the bill becomes fully payable. Subject to Ahmedabad Jurisdiction.'}})]}),e.jsx("div",{className:"signature-section",children:e.jsx("div",{className:"signature-text",children:"Authorised Signature"})})]})})},{Title:Wh,Text:Hh}=ke,Yh=()=>{var h,k,m,C,d,u,y,b,E,B,L,A,$,F,q,D,M,U,V;const{id:s}=cn(),{data:t,isLoading:n,error:r}=Oh(s||""),[i]=qh(),[o]=Uh(),[l]=Vh(),[x,v]=g.useState(!1),[p,I]=g.useState(!1),[j]=Q.useForm(),[f]=Q.useForm(),[w,T]=g.useState(0),[R,P]=g.useState(!1),S=async()=>{if(s)try{P(!0),T(0),te.loading({content:"Preparing invoice...",key:"download"});const X=(()=>{let Y=0;const pe=setInterval(()=>{Y+=5,Y<=90?(T(Y),Y%25===0&&te.loading({content:`Downloading: ${Y}% complete`,key:"download"})):clearInterval(pe)},200);return pe})();try{const Y=await i(s).unwrap();clearInterval(X),T(100),te.loading({content:"Finalizing download...",key:"download"});const pe=URL.createObjectURL(Y),fe=document.createElement("a");fe.href=pe,fe.download=`Invoice-${(t==null?void 0:t.invoiceNumber)||s||"download"}.pdf`,document.body.appendChild(fe),fe.click(),document.body.removeChild(fe),URL.revokeObjectURL(pe),te.success({content:"Invoice downloaded successfully",key:"download"})}catch(Y){throw clearInterval(X),Y}}catch(O){console.error("Error downloading PDF:",O),te.error({content:"Failed to download invoice",key:"download"})}finally{P(!1),setTimeout(()=>T(0),500)}},_=()=>{v(!0)},N=()=>{I(!0)},a=async O=>{try{await o({bookingId:s||"",email:O.email,message:O.message}).unwrap(),te.success(`Invoice sent to ${O.email}`),v(!1),j.resetFields()}catch(X){console.error("Error sending email:",X),te.error("Failed to send email")}},c=async O=>{try{await l({bookingId:s||"",phoneNumber:O.phoneNumber}).unwrap();const X=O.phoneNumber.replace(/\D/g,""),Y=encodeURIComponent(O.message);window.open(`https://wa.me/${X}?text=${Y}`,"_blank"),I(!1),f.resetFields()}catch(X){console.error("Error opening WhatsApp:",X),te.error("Failed to open WhatsApp")}};return n?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},children:e.jsx(et,{size:"large"})}):r||!t?e.jsxs("div",{style:{textAlign:"center",marginTop:"50px"},children:[e.jsx(Wh,{level:3,children:"Invoice Not Found"}),e.jsx(Hh,{children:"The requested invoice could not be loaded. Please try again later."})]}):e.jsxs(e.Fragment,{children:[e.jsxs(ie,{title:"Invoice Details",style:{margin:"20px"},children:[e.jsx(ge,{gutter:[16,24],children:e.jsx(G,{span:24,children:e.jsxs(ae,{direction:"vertical",style:{width:"100%"},children:[e.jsxs(ae,{children:[e.jsx(H,{icon:e.jsx(Ba,{}),onClick:S,loading:R&&w<100,disabled:R&&w>=100,children:"Download PDF"}),e.jsx(H,{icon:e.jsx(es,{}),onClick:_,disabled:R,children:"Share via Email"}),e.jsx(H,{icon:e.jsx(ul,{}),onClick:N,disabled:R,children:"Share via WhatsApp"})]}),R&&e.jsx(so,{percent:w,size:"small",status:"active",style:{marginBottom:0,marginTop:4}})]})})}),e.jsx(Be,{}),e.jsx(Qh,{booking:{...t.bookingId,customerGSTIN:(h=t.bookingId)!=null&&h.customerGSTIN||((k=t.bookingId)==null?void 0:k.customerGSTIN)===""?t.bookingId.customerGSTIN:"N/A",customerAddress:(m=t.bookingId)!=null&&m.customerAddress||((C=t.bookingId)==null?void 0:C.customerAddress)===""?t.bookingId.customerAddress:"N/A",invoiceNumber:t.invoiceNumber,exhibitionId:{...t.bookingId.exhibitionId,companyName:((d=t.bookingId.exhibitionId)==null?void 0:d.companyName)||"",bankName:((u=t.bookingId.exhibitionId)==null?void 0:u.bankName)||"",bankAccount:((y=t.bookingId.exhibitionId)==null?void 0:y.bankAccount)||"",bankAccountName:((b=t.bookingId.exhibitionId)==null?void 0:b.bankAccountName)||"",bankBranch:((E=t.bookingId.exhibitionId)==null?void 0:E.bankBranch)||"",bankIFSC:((B=t.bookingId.exhibitionId)==null?void 0:B.bankIFSC)||"",companyCIN:((L=t.bookingId.exhibitionId)==null?void 0:L.companyCIN)||"",companyPAN:((A=t.bookingId.exhibitionId)==null?void 0:A.companyPAN)||"",companySAC:(($=t.bookingId.exhibitionId)==null?void 0:$.companySAC)||"",companyGST:((F=t.bookingId.exhibitionId)==null?void 0:F.companyGST)||"",companyEmail:((q=t.bookingId.exhibitionId)==null?void 0:q.companyEmail)||"",companyWebsite:((D=t.bookingId.exhibitionId)==null?void 0:D.companyWebsite)||"",companyAddress:((M=t.bookingId.exhibitionId)==null?void 0:M.companyAddress)||""},calculations:{...t.bookingId.calculations,stalls:((V=(U=t.bookingId.calculations)==null?void 0:U.stalls)==null?void 0:V.map(O=>({...O,discount:O.discount?{...O.discount,type:O.discount.type||"percentage",value:O.discount.value}:void 0})))||[]}}})]}),e.jsx(tt,{title:"Share Invoice via Email",visible:x,onCancel:()=>v(!1),footer:null,children:e.jsxs(Q,{form:j,layout:"vertical",onFinish:a,children:[e.jsx(Q.Item,{name:"email",label:"Email Address",rules:[{required:!0,message:"Please enter an email address"},{type:"email",message:"Please enter a valid email address"}],children:e.jsx(se,{placeholder:"example@example.com"})}),e.jsx(Q.Item,{name:"message",label:"Message",initialValue:`Please find attached the invoice for your booking with invoice number ${t.invoiceNumber}.`,children:e.jsx(se.TextArea,{rows:4})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",children:"Send"})})]})}),e.jsx(tt,{title:"Share Invoice via WhatsApp",visible:p,onCancel:()=>I(!1),footer:null,children:e.jsxs(Q,{form:f,layout:"vertical",onFinish:c,children:[e.jsx(Q.Item,{name:"phoneNumber",label:"Phone Number",rules:[{required:!0,message:"Please enter a phone number"}],children:e.jsx(se,{placeholder:"+1234567890"})}),e.jsx(Q.Item,{name:"message",label:"Message",initialValue:`Please find the invoice for your booking with invoice number ${t.invoiceNumber}.`,children:e.jsx(se.TextArea,{rows:4})}),e.jsx(Q.Item,{children:e.jsx(H,{type:"primary",htmlType:"submit",children:"Open WhatsApp"})})]})})]})},Gh=Ee(()=>Se(()=>import("./Profile-BEo3OeuS.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),Kh=Ee(()=>Se(()=>import("./Settings-BAzlOeee.js"),__vite__mapDeps([9,1,2,3,4,5,6,7,8]))),Xh=Ee(()=>Se(()=>import("./index-bX3gGnZ8.js"),__vite__mapDeps([10,1,2,3,11,4,5,6,7,8]))),Jh=Ee(()=>Se(()=>import("./index-9hUyCWoI.js"),__vite__mapDeps([12,1,2,3,4,11,5,6,7,8]))),Zh=Ee(()=>Se(()=>import("./index-DTewkI6S.js"),__vite__mapDeps([13,1,2,4,5,3,6,7,8]))),ep=Ee(()=>Se(()=>import("./index-D8wA3CMj.js"),__vite__mapDeps([14,1,2,3,11,5,4,6,7,8]))),tp=Ee(()=>Se(()=>import("./index-CxAs-dm8.js"),__vite__mapDeps([15,1,2,3,16,17,4,5,6,7,8]))),sp=Ee(()=>Se(()=>import("./index-CWz5JEEp.js"),__vite__mapDeps([18,1,2,3,5,4,6,7,8]))),np=Ee(()=>Se(()=>import("./edit-D4Il21Q1.js"),__vite__mapDeps([19,1,2,3,16,17,4,5,6,7,8]))),rp=Ee(()=>Se(()=>import("./index-BuK1-zHv.js"),__vite__mapDeps([20,1,2,3,8,5,4,6,7]))),ip=Ee(()=>Se(()=>import("./index-DZZVylEq.js"),__vite__mapDeps([21,1,2,3,5,4,6,7,8]))),op=Ee(()=>Se(()=>import("./index-D5w1i-3l.js"),__vite__mapDeps([22,1,2,3,8,5,4,6,7]))),ap=Ee(()=>Se(()=>import("./index-wAFSmpZO.js"),__vite__mapDeps([23,1,2,5,3,8,4,6,7]))),lp=Ee(()=>Se(()=>import("./index-DbI_wMfq.js"),__vite__mapDeps([24,1,2,3,8,5,4,6,7]))),cp=Ee(()=>Se(()=>import("./index-CGU2E7cZ.js"),__vite__mapDeps([25,1,2,3,5,4,6,7,8]))),dp=Ee(()=>Se(()=>import("./index-C3sk--vM.js"),__vite__mapDeps([26,1,2,5,3,6,4,7,8]))),up=Ee(()=>Se(()=>import("./index-D99TAtqO.js"),__vite__mapDeps([27,1,2,3,4,11,28,5,6,7,8]))),hp=Ee(()=>Se(()=>import("./index-83dVlJAR.js"),__vite__mapDeps([29,1,2,3,5,4,6,7,8]))),pp=Ee(()=>Se(()=>import("./index-DvGp6Qnr.js"),__vite__mapDeps([30,1,2,5,4,3,6,7,8,31]))),fp=Ee(()=>Se(()=>import("./index-IqWDsv8O.js"),__vite__mapDeps([32,1,2,3,5,4,6,7,8]))),mp=Ee(()=>Se(()=>import("./index-Hi2As_aE.js"),__vite__mapDeps([33,1,2,3,4,5,6,7,8]))),gp=Ee(()=>Se(()=>import("./index-BehD1d6K.js"),__vite__mapDeps([34,1,2,3,28,4,5,6,7,8,35]))),je=({children:s})=>Me(n=>n.auth.isAuthenticated)?s:e.jsx(Fr,{to:"/login"}),Gt=({children:s})=>Me(n=>n.exhibitorAuth.isAuthenticated)?s:e.jsx(Fr,{to:"/"});function xp(){return e.jsx(Dr,{children:e.jsx(xu,{children:e.jsx(Ga,{children:e.jsxs(Ka,{children:[e.jsx(le,{path:"/",element:e.jsx(gu,{})}),e.jsx(le,{path:"/login",element:e.jsx(Ad,{})}),e.jsx(le,{path:"/exhibitions",element:e.jsx(Qu,{})}),e.jsx(le,{path:"/exhibitions/:id",element:e.jsx(qu,{})}),e.jsx(le,{path:"/exhibitions/:id/layout",element:e.jsx(Fu,{})}),e.jsx(le,{path:"/exhibitor/dashboard",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx(Dd,{})})})}),e.jsx(le,{path:"/exhibitor/profile",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx(Zu,{})})})}),e.jsx(le,{path:"/exhibitor/bookings",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx(Xu,{})})})}),e.jsx(le,{path:"/exhibitor/bookings/:id",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx(Ju,{})})})}),e.jsx(le,{path:"/exhibitor/support",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx("div",{children:"Help & Support"})})})}),e.jsx(le,{path:"/exhibitor/invoice/:id",element:e.jsx(Gt,{children:e.jsx(Ut,{children:e.jsx(Yh,{})})})}),e.jsx(le,{path:"/dashboard",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(_d,{})})})}),e.jsx(le,{path:"/account",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(Gh,{})})})}),e.jsx(le,{path:"/exhibition",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(ep,{})})})}),e.jsx(le,{path:"/exhibition/create",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(tp,{})})})}),e.jsx(le,{path:"/exhibition/:id",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(sp,{})})})}),e.jsx(le,{path:"/exhibition/:id/space",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(rp,{})})})}),e.jsx(le,{path:"/exhibition/:id/layout",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(ip,{})})})}),e.jsx(le,{path:"/exhibition/:id/halls",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(op,{})})})}),e.jsx(le,{path:"/exhibition/:id/stalls",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(ap,{})})})}),e.jsx(le,{path:"/exhibition/:id/fixtures",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(lp,{})})})}),e.jsx(le,{path:"/exhibition/:id/edit",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(np,{})})})}),e.jsx(le,{path:"/stall/list",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(cp,{})})})}),e.jsx(le,{path:"/stall-types",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(dp,{})})})}),e.jsx(le,{path:"/bookings",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(up,{})})})}),e.jsx(le,{path:"/bookings/create",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(hp,{})})})}),e.jsx(le,{path:"/amenities",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(gp,{})})})}),e.jsx(le,{path:"/invoices",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(fp,{})})})}),e.jsx(le,{path:"/invoice/:id",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(pp,{})})})}),e.jsx(le,{path:"/index",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(Jh,{})})})}),e.jsx(le,{path:"/settings",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(Kh,{})})})}),e.jsx(le,{path:"/roles",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(Xh,{})})})}),e.jsx(le,{path:"/notifications",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(Zh,{})})})}),e.jsx(le,{path:"/exhibitors",element:e.jsx(je,{children:e.jsx(be,{children:e.jsx(mp,{})})})}),e.jsx(le,{path:"*",element:e.jsx(Fr,{to:"/",replace:!0})})]})})})})}const Pe=s=>{var n,r;const t=((r=(n=s.response)==null?void 0:n.data)==null?void 0:r.message)||"An error occurred";throw new Error(t)},ct={getExhibitions:async()=>{try{return await K.get("/exhibitions")}catch(s){return Pe(s)}},getActiveExhibitions:async()=>{try{return await K.get("/exhibitions/active")}catch(s){return Pe(s)}},getExhibition:async s=>{try{return await K.get(`/exhibitions/${s}`)}catch(t){return Pe(t)}},createExhibition:async s=>{try{return await K.post("/exhibitions",s)}catch(t){return Pe(t)}},updateExhibition:async(s,t)=>{try{return await K.put(`/exhibitions/${s}`,t)}catch(n){return Pe(n)}},deleteExhibition:async s=>{try{return await K.delete(`/exhibitions/${s}`)}catch(t){return Pe(t)}},getHalls:async s=>{try{return await K.get(`/exhibitions/${s}/halls`)}catch(t){return Pe(t)}},createHall:async(s,t)=>{try{const{_id:n,id:r,createdAt:i,updatedAt:o,...l}=t;return console.log("Creating hall with data:",{exhibitionId:s,data:l}),(await K.post(`/exhibitions/${s}/halls`,l)).data}catch(n){throw console.error("Error creating hall:",n),n}},updateHall:async(s,t,n)=>{try{const{_id:r,id:i,createdAt:o,updatedAt:l,...x}=n;console.log("Updating hall with data:",{exhibitionId:s,hallId:t,data:x});const v=await K.put(`/exhibitions/${s}/halls/${t}`,x);return console.log("Hall updated:",v.data),v}catch(r){return console.error("Error updating hall:",r),Pe(r)}},deleteHall:async(s,t)=>{var n,r,i;try{if(!s||!t)throw new Error("Exhibition ID and Hall ID are required");console.log("Deleting hall:",{exhibitionId:s,hallId:t});const o=await K.delete(`/exhibitions/${s}/halls/${t}`);if(!o.data)throw new Error("No response received from server");return o}catch(o){throw console.error("Error deleting hall:",o),((n=o.response)==null?void 0:n.status)===401?new Error("Unauthorized. Please log in again."):((r=o.response)==null?void 0:r.status)===403?new Error("You do not have permission to delete halls."):((i=o.response)==null?void 0:i.status)===404?new Error("Hall not found."):o}},saveLayout:async(s,t)=>{try{if(!s)throw new Error("Exhibition ID is required");return{data:{halls:t}}}catch(n){return Pe(n)}},getLayout:async s=>{try{if(!s)throw new Error("Exhibition ID is required");return await K.get(`/exhibitions/${s}/layout`)}catch(t){return Pe(t)}},getStalls:async(s,t)=>{try{if(!s)throw new Error("Exhibition ID is required");return await K.get(`/exhibitions/${s}/stalls`,{params:{hallId:t}})}catch(n){return Pe(n)}},createStall:async(s,t)=>{try{if(!s)throw new Error("Exhibition ID is required");return await K.post(`/exhibitions/${s}/stalls`,t)}catch(n){return Pe(n)}},updateStall:async(s,t,n)=>{try{if(!s||!t)throw new Error("Exhibition ID and Stall ID are required");console.log("Updating stall:",{exhibitionId:s,stallId:t,data:n});const r=await K.put(`/exhibitions/${s}/stalls/${t}`,n);return console.log("Stall update response:",r),r}catch(r){return console.error("Error updating stall:",r),Pe(r)}},deleteStall:async(s,t)=>{try{if(!s||!t)throw new Error("Exhibition ID and Stall ID are required");return await K.delete(`/exhibitions/${s}/stalls/${t}`)}catch(n){return Pe(n)}},getFixtures:async(s,t)=>{try{const n=`/exhibitions/${s}/fixtures`,r=t?{type:t}:void 0;return await K.get(n,{params:r})}catch(n){return Pe(n)}},getFixture:async(s,t)=>{try{return await K.get(`/exhibitions/${s}/fixtures/${t}`)}catch(n){return Pe(n)}},createFixture:async(s,t)=>{try{return await K.post(`/exhibitions/${s}/fixtures`,t)}catch(n){return Pe(n)}},updateFixture:async(s,t,n)=>{try{return await K.put(`/exhibitions/${s}/fixtures/${t}`,n)}catch(r){return Pe(r)}},deleteFixture:async(s,t)=>{try{return await K.delete(`/exhibitions/${s}/fixtures/${t}`)}catch(n){return Pe(n)}}},yp={exhibitions:[],currentExhibition:null,halls:[],stalls:[],fixtures:[],loading:!1,error:null},On=de("exhibition/fetchExhibitions",async(s,{rejectWithValue:t})=>{try{return(await ct.getExhibitions()).data.map(i=>({...i,id:i._id||i.id})).filter(i=>i.id)}catch(n){return t(n.message)}}),qn=de("exhibition/fetchExhibition",async(s,{rejectWithValue:t})=>{try{if(!s)throw new Error("Exhibition ID is required");return(await ct.getExhibition(s)).data}catch(n){return t(n.message)}}),Un=de("exhibition/createExhibition",async(s,{rejectWithValue:t})=>{try{return(await ct.createExhibition(s)).data}catch(n){return t(n.message)}}),Vn=de("exhibition/updateExhibition",async({id:s,data:t},{rejectWithValue:n})=>{try{if(!s)throw new Error("Exhibition ID is required");return(await ct.updateExhibition(s,t)).data}catch(r){return n(r.message)}}),Qn=de("exhibition/fetchHalls",async(s,{rejectWithValue:t})=>{var n;try{if(!s)throw new Error("Exhibition ID is required");return(await ct.getHalls(s)).data}catch(r){return((n=r.response)==null?void 0:n.status)===404?[]:t(r.message)}}),Wn=de("exhibition/fetchStalls",async({exhibitionId:s,hallId:t},{rejectWithValue:n})=>{try{if(!s)throw new Error("Exhibition ID is required");return(await ct.getStalls(s,t)).data}catch(r){return n(r.message)}}),Hn=de("exhibition/deleteExhibition",async(s,{rejectWithValue:t})=>{try{return await ct.deleteExhibition(s),s}catch(n){return t(n.message)}}),Yn=de("exhibition/fetchFixtures",async({exhibitionId:s,type:t},{rejectWithValue:n})=>{try{if(!s)throw new Error("Exhibition ID is required");return(await ct.getFixtures(s,t)).data}catch(r){return n(r.message)}}),Gn=de("exhibition/createFixture",async({exhibitionId:s,data:t},{rejectWithValue:n})=>{try{if(!s)throw new Error("Exhibition ID is required");return(await ct.createFixture(s,t)).data}catch(r){return n(r.message)}}),Kn=de("exhibition/updateFixture",async({exhibitionId:s,id:t,data:n},{rejectWithValue:r})=>{try{if(!s||!t)throw new Error("Exhibition ID and Fixture ID are required");return(await ct.updateFixture(s,t,n)).data}catch(i){return r(i.message)}}),Xn=de("exhibition/deleteFixture",async({exhibitionId:s,id:t},{rejectWithValue:n})=>{try{if(!s||!t)throw new Error("Exhibition ID and Fixture ID are required");return await ct.deleteFixture(s,t),t}catch(r){return n(r.message)}}),ra=Ve({name:"exhibition",initialState:yp,reducers:{clearCurrentExhibition:s=>{s.currentExhibition=null,s.halls=[],s.stalls=[],s.fixtures=[],s.error=null},clearError:s=>{s.error=null},clearStalls:s=>{s.stalls=[]},clearFixtures:s=>{s.fixtures=[]}},extraReducers:s=>{s.addCase(On.pending,t=>{t.loading=!0,t.error=null}).addCase(On.fulfilled,(t,n)=>{t.loading=!1,t.exhibitions=n.payload}).addCase(On.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(qn.pending,t=>{t.loading=!0,t.error=null}).addCase(qn.fulfilled,(t,n)=>{t.loading=!1,t.currentExhibition=n.payload}).addCase(qn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Un.pending,t=>{t.loading=!0,t.error=null}).addCase(Un.fulfilled,(t,n)=>{t.loading=!1,t.exhibitions.push(n.payload)}).addCase(Un.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Vn.pending,t=>{t.loading=!0,t.error=null}).addCase(Vn.fulfilled,(t,n)=>{t.loading=!1,t.currentExhibition=n.payload;const r=t.exhibitions.findIndex(i=>i.id===n.payload.id);r!==-1&&(t.exhibitions[r]=n.payload)}).addCase(Vn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Qn.pending,t=>{t.loading=!0,t.error=null}).addCase(Qn.fulfilled,(t,n)=>{t.loading=!1,t.halls=n.payload}).addCase(Qn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Wn.pending,t=>{t.loading=!0,t.error=null}).addCase(Wn.fulfilled,(t,n)=>{t.loading=!1;const r=n.payload.map(i=>{var o;return{...i,id:i._id||i.id,_id:i._id||i.id,stallTypeId:typeof i.stallTypeId=="string"?i.stallTypeId:(o=i.stallTypeId)==null?void 0:o._id,stallType:i.stallType||{name:"N/A",description:null}}});n.meta.arg.hallId,t.stalls=r}).addCase(Wn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Hn.pending,t=>{t.loading=!0,t.error=null}).addCase(Hn.fulfilled,(t,n)=>{t.loading=!1,t.exhibitions=t.exhibitions.filter(r=>(r._id||r.id)!==n.payload)}).addCase(Hn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Yn.pending,t=>{t.loading=!0,t.error=null}).addCase(Yn.fulfilled,(t,n)=>{t.loading=!1,t.fixtures=n.payload.map(r=>({...r,id:r._id||r.id,_id:r._id||r.id}))}).addCase(Yn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Gn.pending,t=>{t.loading=!0,t.error=null}).addCase(Gn.fulfilled,(t,n)=>{t.loading=!1;const r={...n.payload,id:n.payload._id||n.payload.id,_id:n.payload._id||n.payload.id};t.fixtures.push(r)}).addCase(Gn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Kn.pending,t=>{t.loading=!0,t.error=null}).addCase(Kn.fulfilled,(t,n)=>{t.loading=!1;const r={...n.payload,id:n.payload._id||n.payload.id,_id:n.payload._id||n.payload.id},i=t.fixtures.findIndex(o=>o.id===r.id||o._id===r._id);i!==-1&&(t.fixtures[i]=r)}).addCase(Kn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(Xn.pending,t=>{t.loading=!0,t.error=null}).addCase(Xn.fulfilled,(t,n)=>{t.loading=!1,t.fixtures=t.fixtures.filter(r=>r.id!==n.payload&&r._id!==n.payload)}).addCase(Xn.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),{clearCurrentExhibition:yf,clearError:bf,clearStalls:jf,clearFixtures:vf}=ra.actions,bp=ra.reducer,jp={bookings:[],currentBooking:null,loading:!1,statsLoading:!1,error:null,pagination:{total:0,page:1,limit:10,pages:0},stats:{total:0,pending:0,approved:0,rejected:0,confirmed:0,cancelled:0,totalRevenue:0,totalBaseAmount:0}},Jn=de("booking/fetchBookings",async(s={},{rejectWithValue:t})=>{var n,r;try{const i={};return s.page&&(i.page=s.page),s.limit&&(i.limit=s.limit),(await K.get("/bookings",{params:i})).data}catch(i){return t(((r=(n=i==null?void 0:i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch bookings")}}),Zn=de("booking/fetchBooking",async s=>(await K.get(`/bookings/${s}`)).data),er=de("booking/createBooking",async s=>(await K.post("/bookings",s)).data),tr=de("booking/updateStatus",async({id:s,status:t,rejectionReason:n})=>(await K.patch(`/bookings/${s}`,{status:t,...n&&{rejectionReason:n}})).data),sr=de("booking/updatePaymentStatus",async({id:s,paymentStatus:t,paymentDetails:n})=>(await K.patch(`/bookings/${s}/payment`,{paymentStatus:t,paymentDetails:n})).data),nr=de("booking/deleteBooking",async s=>(await K.delete(`/bookings/${s}`),s)),rr=de("booking/fetchBookingStats",async(s,{rejectWithValue:t})=>{var n,r;try{return(await K.get("/bookings/stats")).data}catch(i){return t(((r=(n=i==null?void 0:i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch booking statistics")}}),ia=Ve({name:"booking",initialState:jp,reducers:{clearCurrentBooking:s=>{s.currentBooking=null},clearBookingError:s=>{s.error=null}},extraReducers:s=>{s.addCase(Jn.pending,t=>{t.loading=!0,t.error=null}).addCase(Jn.fulfilled,(t,n)=>{t.loading=!1,t.bookings=n.payload.data||[],n.payload.pagination&&(t.pagination=n.payload.pagination)}).addCase(Jn.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to fetch bookings"}).addCase(Zn.pending,t=>{t.loading=!0,t.error=null}).addCase(Zn.fulfilled,(t,n)=>{t.loading=!1,t.currentBooking=n.payload}).addCase(Zn.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to fetch booking"}).addCase(er.pending,t=>{t.loading=!0,t.error=null}).addCase(er.fulfilled,(t,n)=>{t.loading=!1,t.bookings.unshift(n.payload),t.currentBooking=n.payload}).addCase(er.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to create booking"}).addCase(tr.pending,t=>{t.loading=!0,t.error=null}).addCase(tr.fulfilled,(t,n)=>{var i;t.loading=!1;const r=t.bookings.findIndex(o=>o._id===n.payload._id);r!==-1&&(t.bookings[r]=n.payload),((i=t.currentBooking)==null?void 0:i._id)===n.payload._id&&(t.currentBooking=n.payload)}).addCase(tr.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to update booking status"}).addCase(sr.pending,t=>{t.loading=!0,t.error=null}).addCase(sr.fulfilled,(t,n)=>{var i;t.loading=!1;const r=t.bookings.findIndex(o=>o._id===n.payload._id);r!==-1&&(t.bookings[r]=n.payload),((i=t.currentBooking)==null?void 0:i._id)===n.payload._id&&(t.currentBooking=n.payload)}).addCase(sr.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to update payment status"}).addCase(rr.pending,t=>{t.statsLoading=!0,t.error=null}).addCase(rr.fulfilled,(t,n)=>{t.statsLoading=!1,t.stats=n.payload}).addCase(rr.rejected,(t,n)=>{t.statsLoading=!1,t.error=n.error.message||"Failed to fetch booking statistics"}).addCase(nr.pending,t=>{t.loading=!0,t.error=null}).addCase(nr.fulfilled,(t,n)=>{var r;t.loading=!1,t.bookings=t.bookings.filter(i=>i._id!==n.payload),((r=t.currentBooking)==null?void 0:r._id)===n.payload&&(t.currentBooking=null)}).addCase(nr.rejected,(t,n)=>{t.loading=!1,t.error=n.error.message||"Failed to delete booking"})}}),{clearCurrentBooking:wf,clearBookingError:Sf}=ia.actions,vp=ia.reducer,wp={exhibitors:[],loading:!1,error:null},ir=de("exhibitors/fetchAll",async(s,{rejectWithValue:t})=>{var n,r;try{return(await at.getExhibitors()).data}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch exhibitors")}}),Sp=Ve({name:"exhibitor",initialState:wp,reducers:{},extraReducers:s=>{s.addCase(ir.pending,t=>{t.loading=!0,t.error=null}).addCase(ir.fulfilled,(t,n)=>{t.exhibitors=n.payload,t.loading=!1}).addCase(ir.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),kp=Sp.reducer,Ep=async()=>{try{return(await K.get("/roles")).data}catch(s){throw console.error("Error fetching roles:",s),s}},Ip=async s=>{try{return(await K.get(`/roles/${s}`)).data}catch(t){throw console.error("Error fetching role:",t),t}},Cp=async s=>{try{return(await K.post("/roles",s)).data}catch(t){throw console.error("Error creating role:",t),t}},Np=async(s,t)=>{try{return(await K.put(`/roles/${s}`,t)).data}catch(n){throw console.error("Error updating role:",n),n}},Ap=async s=>{try{await K.delete(`/roles/${s}`)}catch(t){throw console.error("Error deleting role:",t),t}},Rp={roles:[],role:null,loading:!1,error:null},or=de("roles/fetchRoles",async(s,{rejectWithValue:t})=>{var n,r;try{return await Ep()}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch roles")}}),ar=de("roles/fetchRoleById",async(s,{rejectWithValue:t})=>{var n,r;try{return await Ip(s)}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch role")}}),lr=de("roles/addRole",async(s,{rejectWithValue:t})=>{var n,r;try{return await Cp(s)}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to create role")}}),cr=de("roles/modifyRole",async({id:s,roleData:t},{rejectWithValue:n})=>{var r,i;try{return await Np(s,t)}catch(o){return n(((i=(r=o.response)==null?void 0:r.data)==null?void 0:i.message)||"Failed to update role")}}),dr=de("roles/removeRole",async(s,{rejectWithValue:t})=>{var n,r;try{return await Ap(s),s}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to delete role")}}),oa=Ve({name:"roles",initialState:Rp,reducers:{clearRoleError:s=>{s.error=null},setSelectedRole:(s,t)=>{s.role=t.payload}},extraReducers:s=>{s.addCase(or.pending,t=>{t.loading=!0,t.error=null}).addCase(or.fulfilled,(t,n)=>{t.loading=!1,t.roles=n.payload}).addCase(or.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(ar.pending,t=>{t.loading=!0,t.error=null}).addCase(ar.fulfilled,(t,n)=>{t.loading=!1,t.role=n.payload}).addCase(ar.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(lr.pending,t=>{t.loading=!0,t.error=null}).addCase(lr.fulfilled,(t,n)=>{t.loading=!1,t.roles.push(n.payload)}).addCase(lr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(cr.pending,t=>{t.loading=!0,t.error=null}).addCase(cr.fulfilled,(t,n)=>{var i;t.loading=!1;const r=t.roles.findIndex(o=>o._id===n.payload._id);r!==-1&&(t.roles[r]=n.payload),((i=t.role)==null?void 0:i._id)===n.payload._id&&(t.role=n.payload)}).addCase(cr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(dr.pending,t=>{t.loading=!0,t.error=null}).addCase(dr.fulfilled,(t,n)=>{var r;t.loading=!1,t.roles=t.roles.filter(i=>i._id!==n.payload),((r=t.role)==null?void 0:r._id)===n.payload&&(t.role=null)}).addCase(dr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),{clearRoleError:kf,setSelectedRole:Ef}=oa.actions,Tp=oa.reducer,_p=async()=>{try{return(await K.get("/users")).data}catch(s){throw console.error("Error fetching users:",s),s}},Pp=async s=>{try{return(await K.get(`/users/${s}`)).data}catch(t){throw console.error("Error fetching user:",t),t}},Dp=async s=>{try{return(await K.post("/users",s)).data}catch(t){throw console.error("Error creating user:",t),t}},$p=async(s,t)=>{try{return(await K.put(`/users/${s}`,t)).data}catch(n){throw console.error("Error updating user:",n),n}},Lp=async s=>{try{await K.delete(`/users/${s}`)}catch(t){throw console.error("Error deleting user:",t),t}},Bp={users:[],selectedUser:null,loading:!1,error:null},ur=de("users/fetchUsers",async(s,{rejectWithValue:t})=>{var n,r;try{return await _p()}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch users")}}),hr=de("users/fetchUserById",async(s,{rejectWithValue:t})=>{var n,r;try{return await Pp(s)}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to fetch user")}}),pr=de("users/addUser",async(s,{rejectWithValue:t})=>{var n,r;try{return await Dp(s)}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to create user")}}),fr=de("users/modifyUser",async({id:s,userData:t},{rejectWithValue:n})=>{var r,i;try{return await $p(s,t)}catch(o){return n(((i=(r=o.response)==null?void 0:r.data)==null?void 0:i.message)||"Failed to update user")}}),mr=de("users/removeUser",async(s,{rejectWithValue:t})=>{var n,r;try{return await Lp(s),s}catch(i){return t(((r=(n=i.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to delete user")}}),aa=Ve({name:"users",initialState:Bp,reducers:{clearUserError:s=>{s.error=null},setSelectedUser:(s,t)=>{s.selectedUser=t.payload}},extraReducers:s=>{s.addCase(ur.pending,t=>{t.loading=!0,t.error=null}).addCase(ur.fulfilled,(t,n)=>{t.loading=!1,t.users=n.payload}).addCase(ur.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(hr.pending,t=>{t.loading=!0,t.error=null}).addCase(hr.fulfilled,(t,n)=>{t.loading=!1,t.selectedUser=n.payload}).addCase(hr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(pr.pending,t=>{t.loading=!0,t.error=null}).addCase(pr.fulfilled,(t,n)=>{t.loading=!1,t.users.push(n.payload)}).addCase(pr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(fr.pending,t=>{t.loading=!0,t.error=null}).addCase(fr.fulfilled,(t,n)=>{var i;t.loading=!1;const r=t.users.findIndex(o=>o._id===n.payload._id);r!==-1&&(t.users[r]=n.payload),((i=t.selectedUser)==null?void 0:i._id)===n.payload._id&&(t.selectedUser=n.payload)}).addCase(fr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload}).addCase(mr.pending,t=>{t.loading=!0,t.error=null}).addCase(mr.fulfilled,(t,n)=>{var r;t.loading=!1,t.users=t.users.filter(i=>i._id!==n.payload),((r=t.selectedUser)==null?void 0:r._id)===n.payload&&(t.selectedUser=null)}).addCase(mr.rejected,(t,n)=>{t.loading=!1,t.error=n.payload})}}),{clearUserError:If,setSelectedUser:Cf}=aa.actions,Mp=aa.reducer,gr=si({reducerPath:"bookingApi",baseQuery:Jr({baseUrl:"/api"}),endpoints:s=>({getBookings:s.query({query:()=>"/bookings"}),getBooking:s.query({query:t=>`/bookings/${t}`}),createBooking:s.mutation({query:t=>({url:"/bookings",method:"POST",body:t})}),updateBookingStatus:s.mutation({query:({id:t,status:n})=>({url:`/bookings/${t}/status`,method:"PATCH",body:{status:n}})})})}),Fp="/api",Js=si({reducerPath:"invoiceApi",baseQuery:Jr({baseUrl:Fp,credentials:"include",prepareHeaders:s=>{const t=localStorage.getItem("token");return t&&s.set("authorization",`Bearer ${t}`),s.set("Content-Type","application/json"),s.set("Accept","application/json"),s}}),tagTypes:["Invoice"],endpoints:s=>({getInvoices:s.query({query:(t={page:1,limit:10})=>({url:"/invoices",method:"GET",params:t}),transformResponse:t=>(console.log("Raw invoice response:",t),typeof t=="object"&&t!==null&&"data"in t?t:Array.isArray(t)?{success:!0,data:t,pagination:{total:t.length,page:1,limit:t.length,pages:1}}:(console.error("Invalid invoice response:",t),{success:!1,data:[],pagination:{total:0,page:1,limit:10,pages:0}})),transformErrorResponse:t=>(console.error("Invoice API Error:",t),t),providesTags:["Invoice"]}),getInvoice:s.query({query:t=>({url:`/invoices/${t}`,method:"GET"}),transformErrorResponse:t=>(console.error("Get Invoice Error:",t),t),providesTags:(t,n,r)=>[{type:"Invoice",id:r}]}),downloadInvoice:s.mutation({query:t=>({url:`/invoices/${t}/download`,method:"GET",responseHandler:n=>n.blob()})}),shareViaEmail:s.mutation({query:({id:t,...n})=>({url:`/invoices/${t}/share/email`,method:"POST",body:n})}),shareViaWhatsApp:s.mutation({query:({id:t,...n})=>({url:`/invoices/${t}/share/whatsapp`,method:"POST",body:n})})})}),{useGetInvoicesQuery:Nf,useGetInvoiceQuery:Af,useShareViaEmailMutation:Rf}=Js,zp=Ha({reducer:{auth:Sl,exhibitorAuth:Uc,exhibition:bp,booking:vp,exhibitor:kp,settings:_c,role:Tp,user:Mp,[gr.reducerPath]:gr.reducer,[Js.reducerPath]:Js.reducer,[Xs.reducerPath]:Xs.reducer},middleware:s=>s().concat(gr.middleware).concat(Js.middleware).concat(Xs.middleware)}),Op={token:{colorPrimary:"#7C3AED",borderRadius:8,colorBgContainer:"#FFFFFF",colorBgLayout:"#F9FAFB",fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"},components:{Layout:{siderBg:"#FFFFFF",headerBg:"#FFFFFF"},Menu:{itemBg:"transparent",itemSelectedBg:"#F3F4F6",itemHoverBg:"#F3F4F6",itemSelectedColor:"#7C3AED",itemColor:"#6B7280"},Card:{boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"},Button:{borderRadius:8,primaryShadow:"0 1px 2px 0 rgb(124 58 237 / 0.05)"},Table:{borderRadius:8,headerBg:"#F9FAFB"}}};vr.createRoot(document.getElementById("root")).render(e.jsx(Ae.StrictMode,{children:e.jsx(Ya,{store:zp,children:e.jsx(Ma,{theme:Op,children:e.jsx(Dr,{children:e.jsx(xp,{})})})})}));export{cf as $,Qn as A,Wn as B,Vn as C,Wo as D,Zp as E,xu as F,wu as G,df as H,ff as I,Yn as J,Kn as K,Gn as L,Xn as M,kc as N,Nf as O,tr as P,Jn as Q,rr as R,Qo as S,nr as T,ir as U,er as V,at as W,Af as X,Qh as Y,Xp as Z,Rf as _,bo as a,K as b,wn as c,or as d,lr as e,Gs as f,fr as g,pr as h,ur as i,Cf as j,mr as k,ef as l,cr as m,ze as n,pt as o,tf as p,On as q,dr as r,wl as s,Hn as t,Ks as u,af as v,qo as w,ct as x,Un as y,qn as z};
