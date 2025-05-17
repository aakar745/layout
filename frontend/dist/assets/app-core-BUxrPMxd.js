import{j as s,r as p,R as Ke}from"./vendor-react-core-GL8v-krj.js";import{b as H,u as we}from"./vendor-redux-9XI87JsB.js";import{r as Ye,l as $e,e as Me,E as Xe,s as Qe,F as Je,a as Ze,b as et}from"./app-auth-pav3ebXF.js";import{a as S}from"./vendor-http-t--hEgTQ.js";import{l as tt}from"./vendor-deps-j0W__MH0.js";import{d as ke,r as st}from"./vendor-date-utils-CEjhVsrT.js";import{T as Ee,L as xe,g as Re,S as F,h as rt,l as ge,f as ne,B as C,k as ot,o as it,E as Ae,D as Ue,r as ae,w as P,t as ce,x as nt,s as he,y as at,I as ct,R as lt,C as Z,F as dt}from"./vendor-antd-core-1s5t57SE.js";import{e as Pe,A as Be,i as T,B as ht,m as ut,l as be,w as pt,C as xt,D as fe,v as gt,E as ze,F as Oe,G as re,H as oe,I as bt,J as ie,u as ft,K as mt,x as He,L as yt,M as wt,N as kt,O as Et,P as Ne,Q as jt,S as vt,T as Ct,U as It,V as St,s as $t,q as Rt,W as At}from"./vendor-antd-icons-C-4QrCZ0.js";import{u as le,a as Fe,L as M}from"./vendor-react-router-BoDVXa_L.js";import{f as Nt}from"./app-admin-iCKr2TyV.js";import{n as h}from"./vendor-ui-utils-C1xmPZI8.js";const de="/api",c=S.create({baseURL:de,headers:{"Content-Type":"application/json",Accept:"application/json"}}),D=S.create({baseURL:de,headers:{"Content-Type":"application/json",Accept:"application/json"}}),je=S.create({baseURL:de,headers:{"Content-Type":"application/json",Accept:"application/json"}});c.interceptors.request.use(e=>{var n,l,u,b,f,k,m,d,R;const t=localStorage.getItem("token"),r=localStorage.getItem("exhibitor_token"),o=((n=e.url)==null?void 0:n.startsWith("/bookings/"))&&e.method==="patch"||((l=e.url)==null?void 0:l.includes("/exhibition/"))||((u=e.url)==null?void 0:u.includes("/stalls/"))||((b=e.url)==null?void 0:b.includes("/halls/"))||((f=e.url)==null?void 0:f.includes("/users/"))||((k=e.url)==null?void 0:k.includes("/roles/")),a=((m=e.url)==null?void 0:m.includes("/test-booking"))||((d=e.url)==null?void 0:d.includes("/exhibitor-bookings"))||((R=e.url)==null?void 0:R.startsWith("/exhibitors/"));return o?t?e.headers.Authorization=`Bearer ${t}`:console.warn("Admin token required but not found for:",e.url):a&&r?e.headers.Authorization=`Bearer ${r}`:t?e.headers.Authorization=`Bearer ${t}`:r&&(e.headers.Authorization=`Bearer ${r}`),e},e=>Promise.reject(e));je.interceptors.request.use(e=>{const t=localStorage.getItem("exhibitor_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e));c.interceptors.response.use(e=>e,e=>{var r,o,a;((r=e.response)==null?void 0:r.status)===401&&localStorage.removeItem("token");const t=((a=(o=e.response)==null?void 0:o.data)==null?void 0:a.message)||e.message;return Promise.reject(new Error(t))});je.interceptors.response.use(e=>e,e=>{var r,o,a;((r=e.response)==null?void 0:r.status)===401&&localStorage.removeItem("exhibitor_token");const t=((a=(o=e.response)==null?void 0:o.data)==null?void 0:a.message)||e.message;return Promise.reject(new Error(t))});const _t=async(e,t=!1,r)=>{const o=t?localStorage.getItem("exhibitor_token"):localStorage.getItem("token");return S.get(`${de}${e}`,{responseType:"blob",headers:{Authorization:`Bearer ${o}`},onDownloadProgress:r})},Us=Object.freeze(Object.defineProperty({__proto__:null,default:c,downloadFile:_t,exhibitorApi:je,publicApi:D},Symbol.toStringTag,{value:"Module"})),Ps={login:async e=>await c.post("/auth/login",e),getProfile:async()=>await c.get("/auth/me"),changePassword:async e=>await c.post("/auth/change-password",e)},Tt=window.location.hostname!=="localhost"&&window.location.hostname!=="127.0.0.1",N=Tt?"https://aakardata.in/api":"http://localhost:5000/api",Bs="ma7o6bmjpok2nhnhq6jgcwrlg446a2hnyxqih70ni695pvm5";class Lt{constructor(){this.socket=null,this.subscribedToNotifications=!1,this.reconnectTimer=null,this.listeners={},this.unreadCount=0,this.isExhibitor=!1,this.lastToken="",this.handleConnect=()=>{setTimeout(()=>{this.subscribedToNotifications&&this.socket&&this.socket.emit("subscribe_notifications"),this.fetchUnreadCount(),this.triggerEvent("connected",!0)},500)},this.handleDisconnect=t=>{this.triggerEvent("disconnected",t),t!=="io client disconnect"&&t!=="transport close"&&this.scheduleReconnect()},this.handleConnectError=t=>{console.error("Notification socket connection error:",t),this.scheduleReconnect()},this.handleError=t=>{console.error("Notification socket error:",t),this.scheduleReconnect()},this.scheduleReconnect=()=>{this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.refreshAndReconnect(),this.reconnectTimer=null},5e3))},this.refreshAndReconnect=async()=>{try{const t=this.isExhibitor?"exhibitor_token":"token",r=localStorage.getItem(t);r?this.init(r,this.isExhibitor):console.error(`No ${this.isExhibitor?"exhibitor":"admin"} token found for reconnection`)}catch(t){console.error("Error refreshing token for socket reconnection:",t)}},this.handleNewNotification=t=>{this.unreadCount=t.unreadCount,this.triggerEvent("notification",t.notification),this.triggerEvent("unreadCount",this.unreadCount)},this.handleNotificationUpdate=t=>{this.unreadCount=t.unreadCount,this.triggerEvent("unreadCount",this.unreadCount),t.newNotifications&&t.newNotifications.length>0&&t.newNotifications.forEach(r=>{this.triggerEvent("notification",r)})}}init(t,r=!1){var o;if(!((o=this.socket)!=null&&o.connected&&this.lastToken===t&&this.isExhibitor===r)){this.isExhibitor=r,this.lastToken=t,this.socket&&(this.socket.disconnect(),this.socket=null),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null);try{if(!t||typeof t!="string")throw new Error("Invalid token provided for socket connection");const a=N.replace("/api",""),n=t.startsWith("Bearer ")?t.substring(7):t;this.socket=tt(a,{auth:{token:n,type:r?"exhibitor":"admin"},forceNew:!0,reconnection:!0,reconnectionAttempts:5,reconnectionDelay:3e3,timeout:2e4,autoConnect:!0,transports:["polling","websocket"]}),this.socket.on("connect",this.handleConnect),this.socket.on("disconnect",this.handleDisconnect),this.socket.on("connect_error",this.handleConnectError),this.socket.on("error",this.handleError),this.socket.on("new_notification",this.handleNewNotification),this.socket.on("notification_update",this.handleNotificationUpdate)}catch(a){console.error("Error initializing notification socket:",a),this.scheduleReconnect()}}}subscribeToNotifications(){this.subscribedToNotifications=!0,this.socket&&this.socket.connected&&this.socket.emit("subscribe_notifications")}unsubscribeFromNotifications(){this.subscribedToNotifications=!1,this.socket&&this.socket.connected&&this.socket.emit("unsubscribe_notifications")}disconnect(){this.socket&&(this.socket.disconnect(),this.socket=null),this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.unreadCount=0,this.subscribedToNotifications=!1}addEventListener(t,r){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(r)}removeEventListener(t,r){this.listeners[t]&&(this.listeners[t]=this.listeners[t].filter(o=>o!==r))}triggerEvent(t,r){this.listeners[t]&&this.listeners[t].forEach(o=>{try{o(r)}catch(a){console.error(`Error in notification ${t} listener:`,a)}})}getUnreadCount(){return this.unreadCount}async fetchUnreadCount(){try{const t=this.isExhibitor?"notifications/exhibitor":"notifications/admin",r={limit:1,page:1,unreadOnly:!0},o=this.isExhibitor?"exhibitor_token":"token",a=localStorage.getItem(o);if(!a)return console.error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`),0;const n=await S.get(t,{baseURL:N,params:r,headers:{Authorization:`Bearer ${a}`}});return n.data&&n.data.success?(this.unreadCount=n.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount),this.unreadCount):0}catch(t){return console.error("Error fetching unread count:",t),0}}async getNotifications(t=1,r=10,o=!1){try{const a=this.isExhibitor?"notifications/exhibitor":"notifications/admin",n={page:t,limit:r,unreadOnly:o},l=this.isExhibitor?"exhibitor_token":"token",u=localStorage.getItem(l);if(!u)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);return(await S.get(a,{baseURL:N,params:n,headers:{Authorization:`Bearer ${u}`}})).data}catch(a){return console.error("Error fetching notifications:",a),{success:!1,data:{notifications:[],pagination:{total:0,page:1,limit:10,pages:0},unreadCount:0}}}}async markAsRead(t){try{const r=this.isExhibitor?`notifications/exhibitor/mark-read/${t}`:`notifications/admin/mark-read/${t}`,o=this.isExhibitor?"exhibitor_token":"token",a=localStorage.getItem(o);if(!a)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);const n=await S.put(r,{},{baseURL:N,headers:{Authorization:`Bearer ${a}`}});return n.data&&n.data.success&&(this.unreadCount=n.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount)),n.data}catch(r){throw console.error("Error marking notification as read:",r),r}}async markAllAsRead(){try{const t=this.isExhibitor?"notifications/exhibitor/mark-all-read":"notifications/admin/mark-all-read",r=this.isExhibitor?"exhibitor_token":"token",o=localStorage.getItem(r);if(!o)throw new Error(`No ${this.isExhibitor?"exhibitor":"admin"} token available for notification requests`);const a=await S.put(t,{},{baseURL:N,headers:{Authorization:`Bearer ${o}`}});return a.data&&a.data.success&&(this.unreadCount=0,this.triggerEvent("unreadCount",this.unreadCount)),a.data}catch(t){throw console.error("Error marking all notifications as read:",t),t}}async deleteNotification(t){try{const r=this.isExhibitor?`notifications/exhibitor/${t}`:`notifications/admin/${t}`,o=await S.delete(r,{baseURL:N,headers:{Authorization:`Bearer ${localStorage.getItem(this.isExhibitor?"exhibitor_token":"token")}`}});if(o.data.success)return o.data.data.unreadCount!==void 0&&(this.unreadCount=o.data.data.unreadCount,this.triggerEvent("unreadCount",this.unreadCount)),o.data;throw new Error("Failed to delete notification")}catch(r){throw console.error("Error deleting notification:",r),r}}async deleteAllNotifications(){try{const t=this.isExhibitor?"notifications/exhibitor/delete-all":"notifications/admin/delete-all",r=await S.delete(t,{baseURL:N,headers:{Authorization:`Bearer ${localStorage.getItem(this.isExhibitor?"exhibitor_token":"token")}`}});if(r.data.success)return this.unreadCount=0,this.triggerEvent("unreadCount",this.unreadCount),r.data;throw new Error("Failed to delete all notifications")}catch(t){throw console.error("Error deleting all notifications:",t),t}}}const v=new Lt;var _=(e=>(e.NEW_LEAD="New Lead",e.FOLLOWUP_DUE="Follow-up Due",e.STATUS_CHANGE="Status Changed",e.ASSIGNMENT="Lead Assigned",e.NEW_BOOKING="NEW_BOOKING",e.BOOKING_CONFIRMED="BOOKING_CONFIRMED",e.BOOKING_CANCELLED="BOOKING_CANCELLED",e.PAYMENT_RECEIVED="PAYMENT_RECEIVED",e.INVOICE_GENERATED="INVOICE_GENERATED",e.EXHIBITION_UPDATE="EXHIBITION_UPDATE",e.SYSTEM_MESSAGE="SYSTEM_MESSAGE",e.EXHIBITOR_MESSAGE="EXHIBITOR_MESSAGE",e.EXHIBITOR_REGISTERED="EXHIBITOR_REGISTERED",e))(_||{}),U=(e=>(e.HIGH="HIGH",e.MEDIUM="MEDIUM",e.LOW="LOW",e))(U||{}),me=(e=>(e.READ="Read",e.UNREAD="Unread",e))(me||{});ke.extend(st);const _e=e=>{switch(e){case U.HIGH:return"#f5222d";case U.MEDIUM:return"#faad14";case U.LOW:return"#52c41a";default:return"#1677ff"}},Dt=e=>ke(e).fromNow(),Mt=e=>ke(e).format("YYYY-MM-DD HH:mm"),zs=e=>e.filter(t=>t.isRead===!1).length,Os=e=>{if(!e.entityId||!e.entityType)return"/notifications";switch(e.entityType){case"lead":return`/leads/${e.entityId}`;case"followup":return`/followups/${e.entityId}`;case"Booking":return"/bookings";case"Invoice":return`/invoice/${e.entityId}`;case"Exhibition":return`/exhibition/${e.entityId}`;case"Exhibitor":return`/exhibitors?id=${e.entityId}`;default:return"/notifications"}},{Text:Te,Paragraph:Ut}=Ee,Pt=({notification:e,onView:t,onMarkAsRead:r,onDelete:o})=>{const a=()=>{switch(e.type){case _.NEW_LEAD:return s.jsx(be,{style:{color:"#1677ff"}});case _.FOLLOWUP_DUE:return s.jsx(ut,{style:{color:"#faad14"}});case _.STATUS_CHANGE:return s.jsx(ht,{style:{color:"#722ed1"}});case _.ASSIGNMENT:return s.jsx(T,{style:{color:"#52c41a"}});default:return s.jsx(Be,{style:{color:"#1677ff"}})}},n=()=>{e.isRead||r(e),t(e)},l=u=>{u.stopPropagation(),o(e)};return s.jsx(xe.Item,{onClick:n,className:e.isRead?"":"notification-unread",style:{cursor:"pointer",backgroundColor:e.isRead?"transparent":"#f0f5ff",padding:"16px",borderRadius:"4px",transition:"background-color 0.3s"},actions:[s.jsx(Re,{title:"Delete notification",children:s.jsx(C,{type:"text",danger:!0,icon:s.jsx(Pe,{}),onClick:l,"aria-label":"Delete notification"})})],children:s.jsx(xe.Item.Meta,{avatar:s.jsx(ge,{dot:!e.isRead,color:_e(e.priority),children:s.jsx(ne,{icon:a(),size:"large",style:{backgroundColor:"white",border:`1px solid ${_e(e.priority)}`}})}),title:s.jsxs(F,{children:[s.jsx(Te,{strong:!0,children:e.title}),!e.isRead&&s.jsx(rt,{color:"blue",children:"New"})]}),description:s.jsxs("div",{children:[s.jsx(Ut,{ellipsis:{rows:2},style:{marginBottom:4},children:e.message}),s.jsx(Re,{title:Mt(e.createdAt),children:s.jsx(Te,{type:"secondary",style:{fontSize:12},children:Dt(e.createdAt)})})]})})})},{Title:Bt,Text:Hs}=Ee,zt=e=>{switch(e){case"NEW_BOOKING":return _.NEW_LEAD;case"BOOKING_CONFIRMED":case"INVOICE_GENERATED":case"PAYMENT_RECEIVED":return _.STATUS_CHANGE;case"EXHIBITOR_MESSAGE":return _.FOLLOWUP_DUE;case"EXHIBITOR_REGISTERED":return _.NEW_LEAD;default:return _.STATUS_CHANGE}},Ot=e=>{switch(e){case"HIGH":return U.HIGH;case"MEDIUM":return U.MEDIUM;case"LOW":return U.LOW;default:return U.MEDIUM}},Ht=({isExhibitor:e=!1})=>{const t=le(),[r,o]=p.useState([]),[a,n]=p.useState(!1),[l,u]=p.useState(!1),[b,f]=p.useState(0),[k,m]=p.useState(!1),[d,R]=p.useState("all"),q=p.useRef(null),{isAuthenticated:G,user:B}=H(i=>i.auth),{isAuthenticated:z}=H(i=>i.exhibitorAuth||{isAuthenticated:!1}),L=e?z:G,[K,W]=p.useState(!1);p.useEffect(()=>{if(L){const i=e?"exhibitor_token":"token",g=localStorage.getItem(i);if(g){v.init(g,e),v.subscribeToNotifications();const ve=J=>{f(J),J>0&&!l&&(m(!0),setTimeout(()=>{m(!1)},2e3))},Ce=J=>{o(Ve=>[J,...Ve])},Ie=()=>{W(!0),x()},Se=()=>{W(!1)};return v.addEventListener("unreadCount",ve),v.addEventListener("notification",Ce),v.addEventListener("connected",Ie),v.addEventListener("disconnected",Se),x(),()=>{v.removeEventListener("unreadCount",ve),v.removeEventListener("notification",Ce),v.removeEventListener("connected",Ie),v.removeEventListener("disconnected",Se),v.unsubscribeFromNotifications()}}else console.error(`No ${e?"exhibitor":"admin"} token found in localStorage`)}},[L,e]);const x=async()=>{if(L){n(!0);try{const i=await v.getNotifications(1,10);i.success&&(o(i.data.notifications),f(i.data.unreadCount))}catch(i){console.error("Error fetching notifications:",i)}finally{n(!1)}}},j=i=>{u(i),i&&(q.current&&q.current.classList.remove("bell-animate"),x())},I=async i=>{if(i.isRead||await E(i),u(!1),i.entityId&&i.entityType){let g="";switch(i.entityType){case"Booking":g=e?`/exhibitor/bookings/${i.entityId}`:"/bookings";break;case"Invoice":g=e?`/exhibitor/invoice/${i.entityId}`:`/invoice/${i.entityId}`;break;case"Exhibition":g=`/exhibition/${i.entityId}`;break;case"Exhibitor":g=`/exhibitors?id=${i.entityId}`;break;default:g=""}t(g||"/notifications")}else t("/notifications")},E=async i=>{try{await v.markAsRead(i._id),o(r.map(g=>g._id===i._id?{...g,isRead:!0}:g))}catch(g){console.error("Error marking notification as read:",g)}},w=async i=>{try{await v.deleteNotification(i._id),o(r.filter(g=>g._id!==i._id)),i.isRead||f(g=>Math.max(0,g-1))}catch(g){console.error("Error deleting notification:",g)}},Y=()=>{u(!1),t("/notifications")},X=async()=>{try{await v.markAllAsRead(),o(r.map(i=>({...i,isRead:!0}))),f(0)}catch(i){console.error("Error marking all notifications as read:",i)}},$=async()=>{try{await v.deleteAllNotifications(),o([]),f(0)}catch(i){console.error("Error deleting all notifications:",i)}},Q=()=>d==="unread"?r.filter(i=>!i.isRead):r.slice(0,10),qe=i=>{R(i)},Ge=i=>{var g;return{_id:i._id,recipient:i.recipient,recipientType:i.recipientType||"admin",title:i.title,message:i.message,type:zt(i.type),priority:Ot(i.priority),isRead:i.isRead,readAt:i.readAt,entityId:i.entityId,entityType:i.entityType,data:i.data,createdAt:i.createdAt,updatedAt:i.updatedAt||i.createdAt,id:i._id,userId:i.recipient,source:(g=i.data)==null?void 0:g.source,status:i.isRead?me.READ:me.UNREAD}},We=s.jsxs("div",{className:"notification-dropdown",children:[s.jsxs("div",{className:"notification-header",children:[s.jsx(Bt,{level:5,style:{margin:0},children:"Notifications"}),s.jsxs(F,{children:[s.jsx(C,{type:"text",size:"small",icon:s.jsx(pt,{}),onClick:x,loading:a,className:"header-btn",title:"Refresh notifications"}),s.jsx(C,{type:"text",size:"small",icon:s.jsx(xt,{}),onClick:X,disabled:b===0,className:"header-btn",title:"Mark all as read"}),s.jsx(C,{type:"text",size:"small",danger:!0,icon:s.jsx(Pe,{}),onClick:$,disabled:r.length===0,className:"header-btn",title:"Clear all notifications"}),s.jsx(C,{type:"text",size:"small",icon:s.jsx(fe,{}),onClick:()=>t("/notifications"),className:"header-btn",title:"Notification Settings"}),s.jsx(C,{type:"text",size:"small",icon:s.jsx(gt,{}),onClick:()=>u(!1),className:"header-btn",title:"Close"})]})]}),s.jsx(ot,{activeKey:d,onChange:qe,size:"small",className:"notification-tabs",items:[{key:"all",label:s.jsx("span",{children:"All"})},{key:"unread",label:s.jsxs("span",{className:"tab-label",children:["Unread",s.jsx(ge,{count:b,size:"small",offset:[5,-3],style:{backgroundColor:"#1677ff"}})]})}]}),s.jsx("div",{className:"notification-list",children:s.jsx(it,{spinning:a,children:Q().length===0?s.jsx(Ae,{image:Ae.PRESENTED_IMAGE_SIMPLE,description:d==="unread"?"No unread notifications":"No notifications",style:{padding:"20px 0"}}):s.jsx(xe,{dataSource:Q(),renderItem:i=>s.jsx(Pt,{notification:Ge(i),onView:()=>I(i),onMarkAsRead:()=>E(i),onDelete:w})})})}),s.jsx(Ue,{style:{margin:"0"}}),s.jsx("div",{className:"notification-footer",children:s.jsx(C,{type:"link",onClick:Y,children:"View All Notifications"})})]});return s.jsx("div",{ref:q,className:`bell-container ${k?"bell-animate":""}`,children:s.jsx(ae,{overlay:We,trigger:["click"],open:l,onOpenChange:j,placement:"bottomRight",getPopupContainer:i=>i.parentNode,overlayClassName:"notification-dropdown-overlay",children:s.jsx("div",{className:"bell-trigger",children:s.jsx(ge,{count:b,className:"notification-badge",size:"default",overflowCount:99,children:s.jsx(Be,{className:"notification-bell-icon"})})})})})};class Ft{async getSettings(){return(await c.get("/settings")).data}async updateSettings(t){return(await c.put("/settings",t)).data}async uploadLogo(t){const r=new FormData;return r.append("file",t),(await c.post("/settings/upload/logo",r,{headers:{"Content-Type":"multipart/form-data"}})).data}}const Fs=new Ft,qt=()=>{const{user:e}=H(r=>r.auth),t=r=>{if(!e||!e.role||!e.role.permissions)return!1;const o=e.role.permissions;if(o.includes(r)||o.includes("*")||o.includes("all")||o.includes("admin")||o.includes("superadmin")||o.includes("full_access")||o.includes("manage_all"))return!0;const a=r.split("_");if(a.length===2){const n=a[0],l=a[1],u=[`${n}.*`,`*.${l}`,`view_${n}`,`${n}_view`,`${n}s_${l}`,`${l}_${n}`,`${n}`,`${l}`,n.endsWith("s")?`${n.slice(0,-1)}_${l}`:`${n}s_${l}`,`${n}_${l==="view"?"read":l}`,`${l==="view"?"read":l}_${n}`];for(const b of u)if(o.includes(b))return!0}return!1};return{hasPermission:t,hasAnyPermission:r=>r.some(o=>t(o)),hasAllPermissions:r=>r.every(o=>t(o))}},{Header:Gt,Sider:Wt,Content:Vt}=P,Kt=h.div`
  height: 65px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #E5E7EB;
  transition: all 0.3s;
`,Yt=h.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
`,Xt=h.img`
  height: auto;
  width: 100%;
  max-width: 150px;
  max-height: auto;
  object-fit: contain;
`;h.span`
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  transition: opacity 0.3s, margin-left 0.3s;
`;const qs=({children:e})=>{const[t,r]=p.useState(!1),o=le(),a=we(),n=Fe(),l=H(x=>x.auth.user),{settings:u}=H(x=>x.settings),[b,f]=p.useState("/logo.png"),[k,m]=p.useState(!1),{hasPermission:d}=qt(),R=p.useCallback(async()=>{try{m(!0),await a(Ye()).unwrap()}catch{}finally{m(!1)}},[a]);p.useEffect(()=>{const x=setInterval(()=>{R()},3e5);return()=>clearInterval(x)},[R]),p.useEffect(()=>{R()},[n.pathname,R]),p.useEffect(()=>{},[l,d]),p.useEffect(()=>{a(Nt())},[a]);const q=[{key:"dashboard",icon:s.jsx(oe,{}),label:"Dashboard",requiredPermission:"dashboard_view",onClick:()=>o("/dashboard")},{key:"exhibition",icon:s.jsx(bt,{}),label:"Exhibitions",requiredPermission:"exhibitions_view",onClick:()=>o("/exhibition")},{key:"stalls",icon:s.jsx(ie,{}),label:"Stalls",requiredPermission:"view_stalls",children:[{key:"stall/list",label:"Stall List",requiredPermission:"view_stalls",onClick:()=>o("/stall/list")},{key:"stall-types",label:"Stall Types",requiredPermission:"view_stall_types",onClick:()=>o("/stall-types")}]},{key:"bookings",icon:s.jsx(ft,{}),label:"Stall Bookings",requiredPermission:"view_bookings",onClick:()=>o("/bookings")},{key:"amenities",icon:s.jsx(mt,{}),label:"Amenities",requiredPermission:"view_amenities",onClick:()=>o("/amenities")},{key:"invoices",icon:s.jsx(He,{}),label:"Invoices",requiredPermission:"view_invoices",onClick:()=>o("/invoices")},{key:"exhibitors",icon:s.jsx(yt,{}),label:"Exhibitors",requiredPermission:"view_exhibitors",onClick:()=>o("/exhibitors")},{key:"index",icon:s.jsx(T,{}),label:"Users",requiredPermission:"users_view",onClick:()=>o("/index")},{key:"roles",icon:s.jsx(wt,{}),label:"Roles",requiredPermission:"roles_view",onClick:()=>o("/roles")},{key:"settings",icon:s.jsx(fe,{}),label:"Settings",requiredPermission:"settings_view",onClick:()=>o("/settings")}],G=x=>x.filter(j=>{if(j.requiredPermission&&!d(j.requiredPermission))return!1;if(j.children){const I=G(j.children);if(I.length===0)return!1;j.children=I}return!0}),B=G(q),z=x=>x.map(j=>{const{requiredPermission:I,...E}=j;return E.children&&(E.children=z(E.children)),E}),L=z(B);p.useEffect(()=>{const x={dashboard:"dashboard_view",exhibition:"exhibitions_view","stall/list":"view_stalls","stall-types":"view_stall_types",bookings:"view_bookings",amenities:"view_amenities",invoices:"view_invoices",exhibitors:"view_exhibitors",index:"users_view",roles:"roles_view",settings:"settings_view"},j=n.pathname.substring(1)||"dashboard",I=x[j];if(I&&!d(I)){const E=B.length>0?B[0]:null;E?o(`/${E.key}`):(a($e()),o("/login"))}},[n.pathname,d,B,o,a]),p.useEffect(()=>{const x=localStorage.getItem("cachedLogoUrl"),j=localStorage.getItem("logoTimestamp"),I=new Date().getTime();if(x&&j&&I-parseInt(j)<36e5)f(x);else if(u!=null&&u.logo){const E=`${c.defaults.baseURL}/public/logo`;f(E),localStorage.setItem("cachedLogoUrl",E),localStorage.setItem("logoTimestamp",I.toString());const w=new Image;w.src=E}},[u]);const K=[{key:"profile",label:"Profile",icon:s.jsx(T,{}),onClick:()=>o("/account")},{key:"settings",label:"Settings",icon:s.jsx(fe,{}),onClick:()=>o("/settings")},{key:"divider",type:"divider"},{key:"logout",label:"Logout",icon:s.jsx(re,{}),onClick:()=>{a($e()),o("/login")}}],W=()=>{const x=n.pathname.substring(1);return x.charAt(0).toUpperCase()+x.slice(1)};return s.jsxs(P,{style:{minHeight:"100vh"},children:[s.jsxs(Wt,{trigger:null,collapsible:!0,collapsed:t,style:{background:"#fff",borderRight:"1px solid #E5E7EB",boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1)",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflow:"hidden"},width:256,collapsedWidth:80,children:[s.jsx(Kt,{children:s.jsx(Yt,{children:s.jsx(Xt,{src:b,alt:"Logo",onError:()=>f("/logo.png")})})}),s.jsx(ce,{mode:"inline",selectedKeys:[n.pathname.substring(1)||"dashboard"],items:L,style:{border:"none",padding:"16px 0",background:"transparent"},className:"main-nav-menu",inlineCollapsed:t})]}),s.jsxs(P,{style:{marginLeft:t?80:256,transition:"all 0.2s"},children:[s.jsxs(Gt,{style:{padding:"0 24px",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 0 0 rgb(0 0 0 / 0.05)",zIndex:99},children:[s.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[s.jsx(C,{type:"text",icon:t?s.jsx(ze,{}):s.jsx(Oe,{}),onClick:()=>r(!t),style:{fontSize:16}}),s.jsx("span",{style:{marginLeft:24,fontSize:20,fontWeight:600,color:"#111827"},children:W()})]}),s.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[s.jsx("div",{style:{marginRight:20},children:s.jsx(Ht,{isExhibitor:!1})}),s.jsx(ae,{menu:{items:K},placement:"bottomRight",children:s.jsxs(F,{align:"center",style:{cursor:"pointer"},children:[s.jsx(ne,{size:"small",icon:s.jsx(T,{}),style:{backgroundColor:"#5046e5"}}),s.jsx("span",{style:{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:(l==null?void 0:l.username)||"User"})]})})]})]}),s.jsx(Vt,{style:{margin:"24px 16px",padding:24,minHeight:280,background:"#fff",borderRadius:8,boxShadow:"0 1px 2px 0 rgb(0 0 0 / 0.05)"},children:e})]})]})},{Header:Qt,Sider:Jt,Content:Zt}=P,Gs=({children:e})=>{var m;const[t,r]=p.useState(!1),o=le(),a=we(),n=Fe(),l=H(d=>d.exhibitorAuth.exhibitor),u=()=>{const d=n.pathname;return d.includes("/exhibitor/dashboard")?"dashboard":d.includes("/exhibitor/bookings")?"bookings":d.includes("/exhibitor/profile")?"profile":d.includes("/exhibitions")?"exhibitions":d.includes("/exhibitor/support")?"help":"dashboard"},b=[{key:"dashboard",icon:s.jsx(oe,{}),label:"Dashboard",onClick:()=>o("/exhibitor/dashboard")},{key:"bookings",icon:s.jsx(ie,{}),label:"My Bookings",onClick:()=>o("/exhibitor/bookings")},{key:"profile",icon:s.jsx(T,{}),label:"My Profile",onClick:()=>o("/exhibitor/profile")},{key:"exhibitions",icon:s.jsx(He,{}),label:"Exhibitions",onClick:()=>o("/exhibitions")},{key:"help",icon:s.jsx(kt,{}),label:"Help & Support",onClick:()=>o("/exhibitor/support")}],f=[{key:"profile",label:"My Profile",icon:s.jsx(T,{}),onClick:()=>o("/exhibitor/profile")},{key:"bookings",label:"My Bookings",icon:s.jsx(ie,{}),onClick:()=>o("/exhibitor/bookings")},{key:"divider",type:"divider"},{key:"logout",label:"Logout",icon:s.jsx(re,{}),onClick:()=>{a(Me()),o("/")}}],k=()=>{const d=n.pathname.replace("/exhibitor/","");return d==="dashboard"?"Dashboard":d.startsWith("bookings")?d.includes("/")?"Booking Details":"My Bookings":d==="profile"?"My Profile":d==="support"?"Help & Support":d.charAt(0).toUpperCase()+d.slice(1)};return s.jsxs(P,{style:{minHeight:"100vh"},children:[s.jsxs(Jt,{trigger:null,collapsible:!0,collapsed:t,style:{background:"#fff",borderRight:"1px solid #E5E7EB",boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1)",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflow:"hidden"},width:256,collapsedWidth:80,children:[s.jsxs("div",{style:{height:65,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:t?"center":"flex-start",borderBottom:"1px solid #E5E7EB"},children:[s.jsx("img",{src:"/logo.svg",alt:"Logo",style:{height:32,width:"auto"}}),!t&&s.jsx("span",{style:{marginLeft:12,fontSize:18,fontWeight:600,color:"#1890ff",whiteSpace:"nowrap"},children:"Exhibitor Portal"})]}),s.jsx(ce,{mode:"inline",selectedKeys:[u()],items:b,style:{border:"none",padding:t?"16px 0":"16px 8px",background:"transparent"},className:"main-nav-menu",inlineCollapsed:t})]}),s.jsxs(P,{style:{marginLeft:t?80:256,transition:"all 0.2s"},children:[s.jsxs(Qt,{style:{padding:"0 24px",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 0 0 rgb(0 0 0 / 0.05)",zIndex:99},children:[s.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[s.jsx(C,{type:"text",icon:t?s.jsx(ze,{}):s.jsx(Oe,{}),onClick:()=>r(!t),style:{fontSize:16}}),s.jsx("span",{style:{marginLeft:24,fontSize:20,fontWeight:600,color:"#111827"},children:k()})]}),s.jsx(ae,{menu:{items:f},placement:"bottomRight",children:s.jsxs(F,{align:"center",style:{cursor:"pointer"},children:[s.jsx(ne,{size:"small",style:{backgroundColor:"#5046e5"},children:((m=l==null?void 0:l.companyName)==null?void 0:m.charAt(0).toUpperCase())||"E"}),s.jsx("span",{style:{maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:(l==null?void 0:l.companyName)||"Exhibitor"})]})})]}),s.jsx(Zt,{style:{margin:"24px 16px",padding:24,minHeight:280,background:"#fff",borderRadius:8,boxShadow:"0 1px 2px 0 rgb(0 0 0 / 0.05)"},children:e})]})]})};class Ws extends Ke.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,r){console.error("Error caught by boundary:",t,r)}render(){var t;return this.state.hasError?s.jsx(nt,{status:"error",title:"Something went wrong",subTitle:((t=this.state.error)==null?void 0:t.message)||"An unexpected error occurred",extra:[s.jsx(C,{type:"primary",onClick:()=>window.location.href="/dashboard",children:"Go to Dashboard"},"home"),s.jsx(C,{onClick:()=>window.location.reload(),children:"Reload Page"},"reload")]}):this.props.children}}const Vs={getExhibitions:()=>D.get("/public/exhibitions"),getExhibition:e=>D.get(`/public/exhibitions/${e}`),getLayout:e=>D.get(`/public/exhibitions/${e}/layout`),getStallDetails:(e,t)=>D.get(`/public/exhibitions/${e}/stalls/${t}`),bookStall:(e,t,r)=>D.post(`/public/exhibitions/${e}/stalls/${t}/book`,r),bookMultipleStalls:(e,t)=>D.post(`/public/exhibitions/${e}/stalls/book-multiple`,t),searchExhibitors:e=>D.get("/public/exhibitors/search",{params:{query:e}}),exhibitorBookStalls:e=>c.post(`/exhibitor-bookings/${e.exhibitionId}`,e),getExhibitorBookings:()=>c.get("/exhibitor-bookings/my-bookings"),getExhibitorBooking:e=>c.get(`/exhibitor-bookings/${e}`),cancelExhibitorBooking:e=>c.patch(`/exhibitor-bookings/${e}/cancel`),getExhibitorBookingInvoice:e=>c.get(`/exhibitor-bookings/${e}/invoice`)},es={getStallTypes:async()=>c.get("/stall-types"),createStallType:async e=>c.post("/stall-types",e),updateStallType:async(e,t)=>c.put(`/stall-types/${e}`,t),deleteStallType:async e=>c.delete(`/stall-types/${e}`)},Ks=Object.freeze(Object.defineProperty({__proto__:null,default:es},Symbol.toStringTag,{value:"Module"})),Ys=e=>{if(!e)return"";const t=window.location.origin,r=e.replace(/^\/?(api\/uploads\/)?/,"");if(r.includes("fixtures/"))return`${t}/api/uploads/${r}`;const o=localStorage.getItem("token");return o?`${t}/api/uploads/${r}?token=${o}`:""},ye=S.create({baseURL:N}),V=S.create({baseURL:N});ye.interceptors.request.use(e=>{const t=localStorage.getItem("exhibitor_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e));const O=S.create({baseURL:N});O.interceptors.request.use(e=>{const t=localStorage.getItem("token");return t&&(e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e));const Xs={sendRegistrationOTP:async e=>await V.post("/exhibitors/send-otp",{email:e}),verifyOTP:async e=>await V.post("/exhibitors/verify-otp",e),register:async e=>await V.post("/exhibitors/register",e),login:async e=>await V.post("/exhibitors/login",e),requestPasswordReset:async e=>await V.post("/exhibitors/forgot-password",e),resetPassword:async e=>await V.post("/exhibitors/reset-password",e),getProfile:async()=>await ye.get("/exhibitors/profile"),updateProfile:async e=>await ye.put("/exhibitors/profile",e),getExhibitors:async()=>await O.get("/exhibitors/admin/exhibitors"),getExhibitor:async e=>await O.get(`/exhibitors/admin/exhibitors/${e}`),createExhibitor:async e=>await O.post("/exhibitors/admin/exhibitors",e),updateStatus:async(e,t,r)=>await O.put(`/exhibitors/admin/exhibitors/${e}/status`,{status:t,rejectionReason:r}),updateExhibitor:async(e,t)=>await O.put(`/exhibitors/admin/exhibitors/${e}`,t),deleteExhibitor:async e=>await O.delete(`/exhibitors/admin/exhibitors/${e}`)},{Header:ts}=P,ss=h(ts)`
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
`,rs=h.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`,os=h.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: flex-start;
  }
`,is=h.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`,ns=h.img`
  height: auto;
  width: 100%;
  max-width: 140px;
  max-height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 120px;
  }
`,Le=h(ne)`
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
`,De=h(ce)`
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
`,as=h(ce)`
  border: none;
  display: flex;
  justify-content: center;
  font-size: 15px;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`,cs=h(C)`
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
`,ls=h.div`
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
`,ds=h(M)`
  display: block;
  padding: 16px 8px;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    color: #1890ff;
  }
`,ee=h(C)`
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
`,hs=h.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`,us=h.span`
  margin-right: 8px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`,Qs=()=>{var E;const e=le(),t=we(),[r,o]=p.useState(!1),[a,n]=p.useState(!1),[l,u]=p.useState(!1),[b,f]=p.useState("/logo.png"),[k,m]=p.useState("Exhibition Manager"),d=H(w=>w.exhibitorAuth),{exhibitor:R,isAuthenticated:q,showLoginModal:G,showForgotPasswordModal:B}=d;p.useEffect(()=>{const w=localStorage.getItem("cachedLogoUrl"),Y=localStorage.getItem("logoTimestamp"),X=new Date().getTime();if(w&&Y&&X-parseInt(Y)<36e5)f(w);else{const $=`${c.defaults.baseURL}/public/logo`;f($),localStorage.setItem("cachedLogoUrl",$),localStorage.setItem("logoTimestamp",X.toString());const Q=new Image;Q.src=$}fetch(`${c.defaults.baseURL}/public/site-info`).then($=>$.json()).then($=>{$.siteName&&m($.siteName)}).catch($=>{console.error("Error fetching site info:",$)})},[]),p.useEffect(()=>(he.config({top:84,duration:3,maxCount:1}),()=>{he.destroy()}),[]);const z=()=>{t(Me()),he.success("Successfully logged out"),e("/"),o(!1),n(!1)},L=()=>{t(Ze(void 0)),o(!1),n(!1)},K=()=>{u(!0),o(!1),n(!1)},W=()=>{t(et())},x=[{key:"exhibitions",label:"Exhibitions",path:"/exhibitions"},{key:"about",label:"About",path:"/about"},{key:"contact",label:"Contact",path:"/contact"}],j=s.jsx(De,{items:[{key:"exhibitor-login",icon:s.jsx(Ne,{}),label:s.jsx("a",{onClick:L,children:"Exhibitor Login"})},{key:"exhibitor-register",icon:s.jsx(be,{}),label:s.jsx("a",{onClick:K,children:"Register as Exhibitor"})}]}),I=s.jsx(De,{items:[{key:"exhibitor-dashboard",icon:s.jsx(oe,{}),label:s.jsx(M,{to:"/exhibitor/dashboard",children:"Dashboard"})},{key:"exhibitor-profile",icon:s.jsx(T,{}),label:s.jsx(M,{to:"/exhibitor/profile",children:"My Profile"})},{key:"exhibitor-bookings",icon:s.jsx(ie,{}),label:s.jsx(M,{to:"/exhibitor/bookings",children:"My Bookings"})},{key:"divider",type:"divider"},{key:"exhibitor-logout",icon:s.jsx(re,{}),label:s.jsx("a",{onClick:z,children:"Logout"})}]});return s.jsxs(s.Fragment,{children:[s.jsx(ss,{children:s.jsxs(rs,{children:[s.jsx(os,{children:s.jsx(M,{to:"/",style:{display:"flex",alignItems:"center",textDecoration:"none"},children:s.jsx(is,{children:s.jsx(ns,{src:b,alt:"Logo",onError:()=>f("/logo.png")})})})}),s.jsx(as,{mode:"horizontal",selectedKeys:[],style:{flex:1,display:"flex",justifyContent:"center"},items:x.map(w=>({key:w.key,label:s.jsx(M,{to:w.path,children:w.label})}))}),s.jsx(hs,{children:s.jsx(ae,{overlay:d.isAuthenticated?I:j,trigger:["click"],placement:"bottomRight",open:r,onOpenChange:o,overlayStyle:{minWidth:"150px",marginTop:"10px"},children:d.isAuthenticated?s.jsxs(F,{style:{cursor:"pointer"},children:[s.jsx(us,{children:((E=d.exhibitor)==null?void 0:E.companyName)||"Exhibitor"}),s.jsx(Le,{icon:s.jsx(T,{}),size:"large"})]}):s.jsx(Le,{icon:s.jsx(T,{}),size:"large"})})}),s.jsx(cs,{icon:s.jsx(Et,{}),onClick:()=>n(!0)})]})}),s.jsx(ls,{children:s.jsxs(at,{title:"Exhibition Management System",placement:"right",onClose:()=>n(!1),open:a,width:280,closeIcon:s.jsx("span",{style:{fontSize:"16px"},children:"×"}),children:[s.jsx("div",{style:{marginBottom:24},children:x.map(w=>s.jsx(ds,{to:w.path,onClick:()=>n(!1),children:w.label},w.key))}),s.jsx("div",{style:{marginTop:40},children:d.isAuthenticated?s.jsxs(s.Fragment,{children:[s.jsx(ee,{type:"primary",icon:s.jsx(oe,{}),onClick:()=>{e("/exhibitor/dashboard"),n(!1)},children:"Dashboard"}),s.jsx(ee,{type:"default",icon:s.jsx(re,{}),onClick:z,children:"Logout"})]}):s.jsxs(s.Fragment,{children:[s.jsx(ee,{type:"primary",style:{background:"#7E57C2",borderColor:"#7E57C2"},icon:s.jsx(Ne,{}),onClick:()=>{L(),n(!1)},children:"Exhibitor Login"}),s.jsx(ee,{type:"default",icon:s.jsx(be,{}),onClick:()=>{K(),n(!1)},children:"Register as Exhibitor"})]})})]})}),s.jsx(Xe,{loginModalVisible:G,registerModalVisible:l,setRegisterModalVisible:u,setExhibitorCredentials:w=>t(Qe(w)),onForgotPassword:W}),s.jsx(Je,{visible:B})]})},{Footer:ps}=P,{Title:xs,Paragraph:gs,Text:bs}=Ee,fs=h(ps)`
  background: linear-gradient(to right, #242a38, #1a1f2c);
  padding: 60px 0 20px;
  color: rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`,ms=h.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,te=h(xs)`
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
`,ys=h.div`
  margin-bottom: 20px;
`,ws=h.img`
  height: auto;
  width: 100%;
  max-width: 160px;
  margin-bottom: 16px;
`,A=h(M)`
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`,ue=h.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`,pe=h.div`
  margin-right: 10px;
  color: #4158D0;
`,se=h.a`
  font-size: 24px;
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateY(-3px);
  }
`,ks=h(ct)`
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
`,Es=h(C)`
  background: linear-gradient(90deg, #4158D0, #C850C0);
  border: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`,js=h(bs)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  font-size: 14px;
`,vs=h(Ue)`
  background: rgba(255, 255, 255, 0.1);
  margin: 30px 0;
`,Js=()=>{const[e,t]=p.useState("/logo.png"),[r,o]=p.useState("Exhibition Manager"),a=new Date().getFullYear();return p.useEffect(()=>{const n=`${c.defaults.baseURL}/public/logo`;t(n),fetch(`${c.defaults.baseURL}/public/site-info`).then(l=>l.json()).then(l=>{l.siteName&&o(l.siteName)}).catch(l=>{console.error("Error fetching site info:",l)})},[]),s.jsx(fs,{children:s.jsxs(ms,{children:[s.jsxs(lt,{gutter:[48,40],children:[s.jsxs(Z,{xs:24,sm:24,md:8,lg:7,children:[s.jsx(ys,{children:s.jsx(M,{to:"/",children:s.jsx(ws,{src:e,alt:r,onError:()=>t("/logo.png")})})}),s.jsx(gs,{style:{color:"rgba(255, 255, 255, 0.7)",marginBottom:24},children:"The premier platform for exhibition stall booking. Connect exhibitors with event organizers and simplify the booking process."}),s.jsxs(F,{children:[s.jsx(se,{href:"#",target:"_blank",rel:"noopener noreferrer",children:s.jsx(jt,{})}),s.jsx(se,{href:"#",target:"_blank",rel:"noopener noreferrer",children:s.jsx(vt,{})}),s.jsx(se,{href:"#",target:"_blank",rel:"noopener noreferrer",children:s.jsx(Ct,{})}),s.jsx(se,{href:"#",target:"_blank",rel:"noopener noreferrer",children:s.jsx(It,{})})]})]}),s.jsxs(Z,{xs:24,sm:12,md:5,lg:5,children:[s.jsx(te,{level:4,children:"Quick Links"}),s.jsx(A,{to:"/exhibitions",children:"Exhibitions"}),s.jsx(A,{to:"/about",children:"About Us"}),s.jsx(A,{to:"/contact",children:"Contact Us"}),s.jsx(A,{to:"/privacy-policy",children:"Privacy Policy"}),s.jsx(A,{to:"/terms",children:"Terms & Conditions"})]}),s.jsxs(Z,{xs:24,sm:12,md:5,lg:5,children:[s.jsx(te,{level:4,children:"For Exhibitors"}),s.jsx(A,{to:"/exhibitor/login",children:"Login"}),s.jsx(A,{to:"/exhibitor/register",children:"Register"}),s.jsx(A,{to:"/exhibitor/dashboard",children:"Dashboard"}),s.jsx(A,{to:"/exhibitor/bookings",children:"My Bookings"}),s.jsx(A,{to:"/faq",children:"FAQ"})]}),s.jsxs(Z,{xs:24,sm:24,md:6,lg:7,children:[s.jsx(te,{level:4,children:"Contact Us"}),s.jsxs(ue,{children:[s.jsx(pe,{children:s.jsx(St,{})}),s.jsx("div",{children:"123 Exhibition Street, New Delhi, India"})]}),s.jsxs(ue,{children:[s.jsx(pe,{children:s.jsx($t,{})}),s.jsx("div",{children:"+91 98765 43210"})]}),s.jsxs(ue,{children:[s.jsx(pe,{children:s.jsx(Rt,{})}),s.jsx("div",{children:"info@exhibitionmanager.com"})]}),s.jsxs("div",{style:{marginTop:24},children:[s.jsx(te,{level:4,children:"Newsletter"}),s.jsx(dt,{children:s.jsxs(F.Compact,{style:{width:"100%"},children:[s.jsx(ks,{placeholder:"Your email address"}),s.jsx(Es,{type:"primary",icon:s.jsx(At,{}),children:"Subscribe"})]})})]})]})]}),s.jsx(vs,{}),s.jsxs(js,{children:["© ",a," ",r,". All rights reserved."]})]})})},y=e=>{var r,o;const t=((o=(r=e.response)==null?void 0:r.data)==null?void 0:o.message)||"An error occurred";throw new Error(t)},Zs={getExhibitions:async()=>{try{return await c.get("/exhibitions")}catch(e){return y(e)}},getActiveExhibitions:async()=>{try{return await c.get("/exhibitions/active")}catch(e){return y(e)}},getExhibition:async e=>{try{return await c.get(`/exhibitions/${e}`)}catch(t){return y(t)}},createExhibition:async e=>{try{return await c.post("/exhibitions",e)}catch(t){return y(t)}},updateExhibition:async(e,t)=>{try{return await c.put(`/exhibitions/${e}`,t)}catch(r){return y(r)}},deleteExhibition:async e=>{try{return await c.delete(`/exhibitions/${e}`)}catch(t){return y(t)}},getHalls:async e=>{try{return await c.get(`/exhibitions/${e}/halls`)}catch(t){return y(t)}},createHall:async(e,t)=>{try{const{_id:r,id:o,createdAt:a,updatedAt:n,...l}=t;return console.log("Creating hall with data:",{exhibitionId:e,data:l}),(await c.post(`/exhibitions/${e}/halls`,l)).data}catch(r){throw console.error("Error creating hall:",r),r}},updateHall:async(e,t,r)=>{try{const{_id:o,id:a,createdAt:n,updatedAt:l,...u}=r;console.log("Updating hall with data:",{exhibitionId:e,hallId:t,data:u});const b=await c.put(`/exhibitions/${e}/halls/${t}`,u);return console.log("Hall updated:",b.data),b}catch(o){return console.error("Error updating hall:",o),y(o)}},deleteHall:async(e,t)=>{var r,o,a;try{if(!e||!t)throw new Error("Exhibition ID and Hall ID are required");console.log("Deleting hall:",{exhibitionId:e,hallId:t});const n=await c.delete(`/exhibitions/${e}/halls/${t}`);if(!n.data)throw new Error("No response received from server");return n}catch(n){throw console.error("Error deleting hall:",n),((r=n.response)==null?void 0:r.status)===401?new Error("Unauthorized. Please log in again."):((o=n.response)==null?void 0:o.status)===403?new Error("You do not have permission to delete halls."):((a=n.response)==null?void 0:a.status)===404?new Error("Hall not found."):n}},saveLayout:async(e,t)=>{try{if(!e)throw new Error("Exhibition ID is required");return{data:{halls:t}}}catch(r){return y(r)}},getLayout:async e=>{try{if(!e)throw new Error("Exhibition ID is required");return await c.get(`/exhibitions/${e}/layout`)}catch(t){return y(t)}},getStalls:async(e,t)=>{try{if(!e)throw new Error("Exhibition ID is required");return await c.get(`/exhibitions/${e}/stalls`,{params:{hallId:t}})}catch(r){return y(r)}},createStall:async(e,t)=>{try{if(!e)throw new Error("Exhibition ID is required");return await c.post(`/exhibitions/${e}/stalls`,t)}catch(r){return y(r)}},updateStall:async(e,t,r)=>{try{if(!e||!t)throw new Error("Exhibition ID and Stall ID are required");console.log("Updating stall:",{exhibitionId:e,stallId:t,data:r});const o=await c.put(`/exhibitions/${e}/stalls/${t}`,r);return console.log("Stall update response:",o),o}catch(o){return console.error("Error updating stall:",o),y(o)}},deleteStall:async(e,t)=>{try{if(!e||!t)throw new Error("Exhibition ID and Stall ID are required");return await c.delete(`/exhibitions/${e}/stalls/${t}`)}catch(r){return y(r)}},getFixtures:async(e,t)=>{try{const r=`/exhibitions/${e}/fixtures`,o=t?{type:t}:void 0;return await c.get(r,{params:o})}catch(r){return y(r)}},getFixture:async(e,t)=>{try{return await c.get(`/exhibitions/${e}/fixtures/${t}`)}catch(r){return y(r)}},createFixture:async(e,t)=>{try{return await c.post(`/exhibitions/${e}/fixtures`,t)}catch(r){return y(r)}},updateFixture:async(e,t,r)=>{try{return await c.put(`/exhibitions/${e}/fixtures/${t}`,r)}catch(o){return y(o)}},deleteFixture:async(e,t)=>{try{return await c.delete(`/exhibitions/${e}/fixtures/${t}`)}catch(r){return y(r)}}},er=async()=>{try{return(await c.get("/roles")).data}catch(e){throw console.error("Error fetching roles:",e),e}},tr=async e=>{try{return(await c.get(`/roles/${e}`)).data}catch(t){throw console.error("Error fetching role:",t),t}},sr=async e=>{try{return(await c.post("/roles",e)).data}catch(t){throw console.error("Error creating role:",t),t}},rr=async(e,t)=>{try{return(await c.put(`/roles/${e}`,t)).data}catch(r){throw console.error("Error updating role:",r),r}},or=async e=>{try{await c.delete(`/roles/${e}`)}catch(t){throw console.error("Error deleting role:",t),t}},ir=async()=>{try{return(await c.get("/users")).data}catch(e){throw console.error("Error fetching users:",e),e}},nr=async e=>{try{return(await c.get(`/users/${e}`)).data}catch(t){throw console.error("Error fetching user:",t),t}},ar=async e=>{try{return(await c.post("/users",e)).data}catch(t){throw console.error("Error creating user:",t),t}},cr=async(e,t)=>{try{return(await c.put(`/users/${e}`,t)).data}catch(r){throw console.error("Error updating user:",r),r}},lr=async e=>{try{await c.delete(`/users/${e}`)}catch(t){throw console.error("Error deleting user:",t),t}},Cs={getDashboardStats:async()=>{var e;try{const r=(await c.get("/users")).data||[],o=await c.get("/bookings"),a=((e=o.data)==null?void 0:e.data)||o.data||[],l=(await c.get("/exhibitions")).data||[],u=a.filter(k=>k.status==="confirmed"||k.status==="approved").reduce((k,m)=>k+(m.amount||0),0),b=[...a].sort((k,m)=>new Date(m.createdAt).getTime()-new Date(k.createdAt).getTime()).slice(0,5),f=[...r].sort((k,m)=>new Date(m.createdAt||0).getTime()-new Date(k.createdAt||0).getTime()).slice(0,5);return{userCount:r.length,bookingCount:a.length,totalRevenue:u,exhibitionCount:l.length,recentBookings:b,recentUsers:f}}catch(t){return console.error("Error fetching dashboard stats:",t),{userCount:0,bookingCount:0,totalRevenue:0,exhibitionCount:0,recentBookings:[],recentUsers:[]}}},getRecentActivity:async()=>{try{const{recentBookings:e,recentUsers:t}=await Cs.getDashboardStats();return[...e.map(o=>({id:o._id,type:"booking",title:`New booking ${o._id.substring(0,8)}`,timestamp:o.createdAt,data:o})),...t.map(o=>({id:o._id,type:"user",title:`User ${o.username||"unknown"}`,timestamp:o.createdAt,data:o}))].sort((o,a)=>new Date(a.timestamp).getTime()-new Date(o.timestamp).getTime())}catch(e){return console.error("Error fetching recent activities:",e),[]}}};export{Os as A,Us as B,Ks as C,Ws as E,Qs as G,qs as M,Pt as N,tr as a,ir as b,sr as c,or as d,nr as e,ar as f,er as g,cr as h,lr as i,c as j,Ps as k,Xs as l,Zs as m,Cs as n,es as o,Ys as p,Vs as q,Js as r,Fs as s,Bs as t,rr as u,_t as v,Gs as w,v as x,zs as y,_ as z};
