import{R as xe,j as e,r as p,E as Ks}from"./vendor-react-core-GL8v-krj.js";import{L as Mt,G as ht,R as Ht,T as vt,u as Zs,a as Js,I as en,C as tn,b as sn,c as nn,K as Yt,S as an,F as on,d as rn}from"./vendor-canvas-DygNVcxM.js";import{b as be,u as Le,c as De,a as ln}from"./vendor-redux-9XI87JsB.js";import{o as Ls,p as us,j as Se,G as ze,q as et,r as dn,m as le,t as cn,E as Ut}from"./app-core-BUxrPMxd.js";import{d as Ae}from"./vendor-date-utils-CEjhVsrT.js";import"./app-dashboard-DAvQsPhE.js";import{u as hn}from"./app-admin-iCKr2TyV.js";import{F as E,M as Ie,v as re,t as pn,S as Q,B as _,I as Z,T as je,b as te,D as Ee,s as ce,c as gt,a as q,R as ie,C as F,z as un,G as xs,U as Bt,A as nt,k as kt,i as dt,n as xn,e as Oe,h as he,g as Ve,E as Re,H as mn,m as ls,l as ct,o as st,w as ve,x as _t,J as $s,K as gn,N as fn,j as Pe,p as Ms,O as bn,P as ft,r as yn,Q as jn,f as wn}from"./vendor-antd-core-1s5t57SE.js";import{b as We,u as me,L as ms,a as ut,N as vn,c as Sn}from"./vendor-react-router-BoDVXa_L.js";import{_ as Ct,$ as It,J as Et,I as Bs,a0 as kn,a1 as Cn,e as He,V as St,b as qt,p as Qe,a2 as In,a3 as En,a4 as Tn,a5 as Nn,R as cs,a6 as gs,a7 as Dn,u as bt,C as Rn,h as An,a8 as Ge,X as Pn,r as zn,m as pt,L as Fn,a9 as Ln,c as Te,x as fs,aa as bs,j as $n,n as At,d as ds,y as Mn,t as Bn,ab as tt,ac as _n,i as qn,ad as xt,ae as _s}from"./vendor-antd-icons-C-4QrCZ0.js";import{n as ae}from"./vendor-ui-utils-C1xmPZI8.js";import{a as Hn}from"./app-auth-pav3ebXF.js";const ys=({width:t,height:s,scale:i=1,position:n={x:0,y:0},isSelected:a=!1,onSelect:o=()=>{},onChange:r=()=>{},children:h,isEditable:f=!0})=>{const c=m=>{f&&(o(),m.cancelBubble=!0)},I=xe.useMemo(()=>{const m=[];for(let k=0;k<=t;k+=5)m.push(e.jsx(Mt,{points:[k,0,k,s],stroke:"#e8e8e8",strokeWidth:1/i,dash:[5/i]},`v${k}`));for(let k=0;k<=s;k+=5)m.push(e.jsx(Mt,{points:[0,k,t,k],stroke:"#e8e8e8",strokeWidth:1/i,dash:[5/i]},`h${k}`));return m},[t,s,i]);return e.jsxs(ht,{x:n.x,y:n.y,width:t,height:s,onClick:c,children:[e.jsx(Ht,{width:t,height:s,fill:"#ffffff",stroke:a&&f?"#1890ff":"#d9d9d9",strokeWidth:a&&f?2/i:1/i,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:10/i,shadowOffset:{x:0,y:0},shadowOpacity:.5,cornerRadius:4/i}),e.jsx(ht,{children:I}),e.jsx(vt,{text:`${t}m × ${s}m`,fontSize:14/i,fill:"#666666",x:5,y:5}),h]})},Un=({visible:t,width:s,height:i,onCancel:n,onSubmit:a})=>{const[o]=E.useForm();xe.useEffect(()=>{t&&o.setFieldsValue({width:s,height:i})},[t,s,i,o]);const r=()=>{o.validateFields().then(h=>{a(h),o.resetFields()})};return e.jsx(Ie,{title:"Edit Exhibition Space",open:t,onCancel:()=>{o.resetFields(),n()},onOk:r,destroyOnClose:!0,children:e.jsxs(E,{form:o,layout:"vertical",initialValues:{width:s,height:i},children:[e.jsx(E.Item,{name:"width",label:"Width (meters)",rules:[{required:!0,message:"Please enter width"},{type:"number",min:10,message:"Width must be at least 10 meters"}],children:e.jsx(re,{min:10,max:1e3,style:{width:"100%"},placeholder:"Enter width in meters"})}),e.jsx(E.Item,{name:"height",label:"Height (meters)",rules:[{required:!0,message:"Please enter height"},{type:"number",min:10,message:"Height must be at least 10 meters"}],children:e.jsx(re,{min:10,max:1e3,style:{width:"100%"},placeholder:"Enter height in meters"})})]})})},qs=({hall:t,isSelected:s=!1,onSelect:i,onChange:n,scale:a=1,position:o={x:0,y:0},exhibitionWidth:r=100,exhibitionHeight:h=100,isStallMode:f=!1})=>{const c=xe.useRef(null),I=xe.useRef(null),m=xe.useMemo(()=>{const w=[],{width:y,height:P}=t.dimensions,g=1;for(let d=0;d<=y;d+=g)w.push(e.jsx(Mt,{points:[d,0,d,P],stroke:"#ddd",strokeWidth:1/a,dash:[2/a,2/a],listening:!1},`v${d}`));for(let d=0;d<=P;d+=g)w.push(e.jsx(Mt,{points:[0,d,y,d],stroke:"#ddd",strokeWidth:1/a,dash:[2/a,2/a],listening:!1},`h${d}`));return w},[t.dimensions.width,t.dimensions.height,a]);xe.useEffect(()=>{var w;s&&I.current&&c.current&&(I.current.nodes([c.current]),(w=I.current.getLayer())==null||w.batchDraw())},[s]);const j=w=>{w.cancelBubble=!0;const y=w.target,P=y.x(),g=y.y(),d=Math.max(0,Math.min(P,r-t.dimensions.width)),x=Math.max(0,Math.min(g,h-t.dimensions.height));y.x(Math.round(d)),y.y(Math.round(x))},k=w=>{w.cancelBubble=!0;const y=w.target,P=Math.max(0,Math.min(y.x(),r-t.dimensions.width)),g=Math.max(0,Math.min(y.y(),h-t.dimensions.height));n==null||n({...t,_id:t._id,id:t.id||t._id,exhibitionId:t.exhibitionId,dimensions:{...t.dimensions,x:Math.round(P),y:Math.round(g)}})},v=w=>{w.cancelBubble=!0},l=w=>{if(!c.current)return;const y=c.current,P=y.scaleX(),g=y.scaleY();y.scaleX(1),y.scaleY(1);const d=Math.round(y.width()*P),x=Math.round(y.height()*g),S=y.x(),u=y.y(),A=Math.max(0,Math.min(S,r-d)),L=Math.max(0,Math.min(u,h-x));n==null||n({...t,_id:t._id,id:t.id||t._id,exhibitionId:t.exhibitionId,dimensions:{x:A,y:L,width:Math.max(5,Math.min(d,r-A)),height:Math.max(5,Math.min(x,h-L))}})},C=w=>{w.cancelBubble=!0,i==null||i(t)};return e.jsxs(ht,{ref:c,x:t.dimensions.x,y:t.dimensions.y,width:t.dimensions.width,height:t.dimensions.height,draggable:!f&&!!n,onClick:C,onTap:C,onDragStart:v,onDragMove:j,onDragEnd:k,onTransformEnd:l,children:[e.jsx(Ht,{width:t.dimensions.width,height:t.dimensions.height,fill:"#ffffff",stroke:s?"#1890ff":"#d9d9d9",strokeWidth:s?2/a:1/a,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/a,shadowOffset:{x:2/a,y:2/a},shadowOpacity:.5}),e.jsx(ht,{children:m}),e.jsx(vt,{text:t.name,fontSize:14/a,fill:"#000000",width:t.dimensions.width,align:"center",y:t.dimensions.height/2-7/a})]})},On=t=>{if(!t)return"";const s=window.location.origin,i=t.replace(/^\/?(api\/uploads\/)?/,"");if(i.includes("fixtures/"))return`${s}/api/uploads/${i}`;const n=localStorage.getItem("token");return n?`${s}/api/uploads/${i}?token=${n}`:""},Hs=({fixture:t,isSelected:s=!1,onSelect:i,onChange:n,scale:a=1,position:o={x:0,y:0},exhibitionWidth:r=100,exhibitionHeight:h=100,isEditable:f=!0})=>{const c=xe.useRef(null),I=xe.useRef(null),[m,j]=p.useState("");p.useEffect(()=>{if(t.icon){const g=On(t.icon);j(g)}else j("")},[t.icon]);const[k]=Zs(m);xe.useEffect(()=>{var g;s&&I.current&&c.current&&(I.current.nodes([c.current]),(g=I.current.getLayer())==null||g.batchDraw())},[s]);const v=g=>{g.cancelBubble=!0},l=g=>{g.cancelBubble=!0;const d=g.target,x=d.x(),S=d.y(),u=Math.max(0,Math.min(x,r-t.dimensions.width)),A=Math.max(0,Math.min(S,h-t.dimensions.height));d.x(Math.round(u)),d.y(Math.round(A))},C=g=>{g.cancelBubble=!0;const d=g.target,x=d.x(),S=d.y(),u=Math.max(0,Math.min(x,r-t.dimensions.width)),A=Math.max(0,Math.min(S,h-t.dimensions.height)),L=t._id||t.id;n==null||n({...t,_id:L,id:L,exhibitionId:t.exhibitionId,position:{x:Math.round(u),y:Math.round(A)}})},w=g=>{if(!c.current)return;const d=c.current,x=d.scaleX(),S=d.scaleY(),u=d.rotation();d.scaleX(1),d.scaleY(1);const A=Math.round(t.dimensions.width*x),L=Math.round(t.dimensions.height*S),R=d.x(),H=d.y(),V=Math.max(0,Math.min(R,r-A)),b=Math.max(0,Math.min(H,h-L)),N=t._id||t.id;n==null||n({...t,_id:N,id:N,exhibitionId:t.exhibitionId,position:{x:V,y:b},dimensions:{width:Math.max(.5,Math.min(A,r-V)),height:Math.max(.5,Math.min(L,h-b))},rotation:u})},y=g=>{g.cancelBubble=!0,i==null||i(t)},P=()=>{const g=t.borderColor||(s?"#1890ff":"#d9d9d9"),d=t.borderRadius!==void 0?t.borderRadius/a:3/a;return k?e.jsx(en,{image:k,width:t.dimensions.width,height:t.dimensions.height,fill:t.color||"#ffffff",stroke:g,strokeWidth:s?2/a:1/a,cornerRadius:d,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/a,shadowOffset:{x:2/a,y:2/a},shadowOpacity:.5}):e.jsx(Ht,{width:t.dimensions.width,height:t.dimensions.height,fill:t.color||"#f0f2f5",stroke:g,strokeWidth:s?2/a:1/a,cornerRadius:d,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:5/a,shadowOffset:{x:2/a,y:2/a},shadowOpacity:.5})};return e.jsxs(e.Fragment,{children:[e.jsxs(ht,{ref:c,x:t.position.x,y:t.position.y,width:t.dimensions.width,height:t.dimensions.height,rotation:t.rotation||0,draggable:f&&!!n,onClick:y,onTap:y,onDragStart:v,onDragMove:l,onDragEnd:C,onTransformEnd:w,children:[P(),t.name&&t.showName!==!1&&e.jsx(vt,{text:t.name,fontSize:12/a,fill:"#000000",width:t.dimensions.width,align:"center",y:-16/a})]}),s&&f&&e.jsx(Js,{ref:I,rotateEnabled:!0,enabledAnchors:["top-left","top-right","bottom-left","bottom-right"],boundBoxFunc:(g,d)=>d.width<.5||d.height<.5?g:d})]})},Vn=({visible:t,x:s,y:i,onExhibitionClick:n,onHallClick:a,onStallClick:o,onFixtureClick:r,onClose:h})=>{if(!t)return null;const f=[{key:"exhibition",icon:e.jsx(Ct,{}),label:"Exhibition Space",onClick:()=>{n(),h()}},{key:"hall",icon:e.jsx(It,{}),label:"Add Hall",onClick:()=>{a(),h()}}];return o&&f.push({key:"stall",icon:e.jsx(Et,{}),label:"Add Stall",onClick:()=>{o(),h()}}),r&&f.push({key:"fixture",icon:e.jsx(Bs,{}),label:"Add Fixture",onClick:()=>{r(),h()}}),e.jsx("div",{style:{position:"fixed",top:i,left:s,zIndex:1e3,boxShadow:"0 2px 8px rgba(0,0,0,0.15)",borderRadius:"4px",backgroundColor:"#fff",width:"200px"},children:e.jsx(pn,{items:f})})},Wn=({stall:t,isSelected:s=!1,onSelect:i,onChange:n,hallWidth:a=0,hallHeight:o=0,hallX:r=0,hallY:h=0,scale:f=1,isDragging:c=!1})=>{const I=p.useRef(null),[m,j]=p.useState(!1),[k,v]=p.useState(!1),[l,C]=p.useState(!1);p.useEffect(()=>{C(window.innerWidth<768);const N=()=>{C(window.innerWidth<768)};return window.addEventListener("resize",N),()=>window.removeEventListener("resize",N)},[]),p.useEffect(()=>{if(m&&!c)v(!0);else if(c)v(!1);else{const N=setTimeout(()=>{v(!1)},100);return()=>clearTimeout(N)}},[m,c]),p.useEffect(()=>{if(m&&I.current&&!c){if(l&&!s)return;I.current.getStage()&&I.current.moveToTop()}},[m,s,l,c]);const w=s||t.isSelected,y=p.useCallback(N=>{switch(N){case"available":return"#52c41a";case"booked":return"#faad14";case"reserved":return"#1890ff";default:return"#d9d9d9"}},[]),P=p.useCallback(N=>{switch(N){case"available":return"rgba(82, 196, 26, 0.2)";case"booked":return"rgba(250, 173, 20, 0.2)";case"reserved":return"rgba(24, 144, 255, 0.2)";default:return"rgba(217, 217, 217, 0.2)"}},[]),g=p.useCallback(N=>{N.cancelBubble=!0;const $=N.target,X=$.x()-r,D=$.y()-h,B=Math.max(0,Math.min(X,a-t.dimensions.width)),Y=Math.max(0,Math.min(D,o-t.dimensions.height));$.x(Math.round(B+r)),$.y(Math.round(Y+h))},[r,h,a,o,t.dimensions.width,t.dimensions.height]),d=p.useCallback(N=>{if(N.cancelBubble=!0,!n)return;const $=N.target,X=$.x()-r,D=$.y()-h,B=Math.max(0,Math.min(X,a-t.dimensions.width)),Y=Math.max(0,Math.min(D,o-t.dimensions.height));n({...t,id:t.id||t._id,_id:t._id||t.id,dimensions:{...t.dimensions,x:Math.round(B),y:Math.round(Y)}})},[n,r,h,a,o,t]),x=p.useCallback(N=>{N.cancelBubble=!0},[]),S=p.useCallback(N=>{N.cancelBubble=!0,i&&!c&&i()},[i,c]),u=p.useCallback(()=>{l&&!w||c||j(!0)},[l,w,c]),A=p.useCallback(()=>{j(!1)},[]),L={x:0,y:0,width:10,height:10},R=t.dimensions||L,H=t.typeName||"Standard";t.ratePerSqm*R.width*R.height;const V=0,b=p.useMemo(()=>t.status!=="available"&&t.companyName?`${H} - ${R.width}×${R.height}m - ${t.companyName}`:`${H} - ${R.width}×${R.height}m`,[H,R.width,R.height,t.status,t.companyName]);return e.jsxs(ht,{ref:I,x:R.x+r,y:R.y+h,width:R.width,height:R.height,draggable:!!n,onClick:S,onTap:S,onDragStart:x,onDragMove:g,onDragEnd:d,opacity:t.status==="available"?1:.7,cursor:t.status==="available"?"pointer":"default",onMouseEnter:u,onMouseLeave:A,listening:c?!1:!l||t.status==="available",transformsEnabled:c||l?"position":"all",children:[e.jsx(Ht,{width:R.width,height:R.height,fill:w?"rgba(24, 144, 255, 0.1)":P(t.status),stroke:w?"#1890ff":y(t.status),strokeWidth:w?2/f:1/f,shadowColor:"rgba(0,0,0,0.1)",shadowBlur:c?0:l?2:3,shadowOffset:{x:1,y:1},shadowOpacity:c?0:.3,rotation:V,perfectDrawEnabled:!c,transformsEnabled:c?"position":"all",cornerRadius:.05}),e.jsx(vt,{text:t.number,fontSize:Math.min(R.width,R.height)*.25,fill:"#000000",width:R.width,height:R.height,align:"center",verticalAlign:"middle",transformsEnabled:"position",perfectDrawEnabled:!c,fontStyle:"bold",listening:!1}),w&&!c&&e.jsx(tn,{x:R.width-2,y:2,radius:Math.min(.8,R.width*.05),fill:"#1890ff",stroke:"#ffffff",strokeWidth:.2/f,transformsEnabled:"position",listening:!1}),k&&!c&&e.jsxs(sn,{x:R.width/2,y:0,opacity:1,listening:!1,children:[e.jsx(nn,{fill:"rgba(0, 0, 0, 1.0)",cornerRadius:.5,pointerDirection:"down",pointerWidth:4,pointerHeight:2,lineJoin:"round",y:-7,listening:!1}),e.jsx(vt,{text:b,fontSize:1.2,fill:"#ffffff",align:"center",padding:2,y:-7,offsetY:0,width:Math.max(b.length*.7,25),height:3,verticalAlign:"middle",listening:!1})]})]})},hs=p.memo(Wn),Tt=({width:t,height:s,exhibitionWidth:i=100,exhibitionHeight:n=100,halls:a=[],stalls:o=[],fixtures:r=[],selectedHall:h=null,selectedFixture:f=null,onSelectHall:c=()=>{},onSelectFixture:I=()=>{},onHallChange:m=()=>{},onFixtureChange:j=()=>{},onExhibitionChange:k=()=>{},onAddHall:v=()=>{},onAddStall:l=()=>{},onAddFixture:C=()=>{},children:w,isStallMode:y=!1,isFixtureMode:P=!1,isPublicView:g=!1})=>{const d=p.useRef(null),x=p.useRef(null),S=p.useRef(null),[u,A]=p.useState(1),[L,R]=p.useState({x:0,y:0}),[H,V]=p.useState(!1),[b,N]=p.useState(!1),[$,X]=p.useState({visible:!1,x:0,y:0}),[D,B]=p.useState(!1),[Y,M]=p.useState(!1),[z,W]=p.useState(!1),[U,ee]=p.useState(void 0);p.useEffect(()=>{const O=()=>{W(window.innerWidth<768)};return O(),window.addEventListener("resize",O),()=>{window.removeEventListener("resize",O)}},[]);const se=p.useCallback(O=>{if(O.evt.preventDefault(),!d.current)return;const J=d.current,ne=u,G=J.getPointerPosition(),ge={x:(G.x-J.x())/ne,y:(G.y-J.y())/ne},ye=1.15,Ce=O.evt.deltaY<0?ne*ye:ne/ye,Ke=Math.min(Math.max(.1,Ce),20),mt={x:G.x-ge.x*Ke,y:G.y-ge.y*Ke};A(Ke),R(mt)},[u]),ue=p.useCallback(()=>{if(!d.current)return;const O=d.current,J=Math.min(u*1.15,20),ne=O.width()/2,G=O.height()/2,ge={x:(ne-L.x)/u,y:(G-L.y)/u},ye={x:ne-ge.x*J,y:G-ge.y*J};A(J),R(ye)},[u,L]),it=p.useCallback(()=>{if(!d.current)return;const O=d.current,J=Math.max(u/1.15,.1),ne=O.width()/2,G=O.height()/2,ge={x:(ne-L.x)/u,y:(G-L.y)/u},ye={x:ne-ge.x*J,y:G-ge.y*J};A(J),R(ye)},[u,L]),$e=p.useCallback(O=>{O?(ee(Yt.pixelRatio),Yt.pixelRatio=z?.8:1):U&&(Yt.pixelRatio=U)},[U,z]),at=p.useCallback(O=>{if(O.target===d.current&&(X({...$,visible:!1}),N(!0),$e(!0),x.current)){if(g){const J=z?{x:-10,y:-10,width:t+20,height:s+20}:void 0;x.current.cache(J)}if(x.current.hitGraphEnabled(!1),g&&d.current){const J=d.current.container();J.style.cursor="grabbing",J.classList.add("dragging"),d.current.batchDraw(),x.current.getChildren().forEach(G=>{if(G.shadowForStrokeEnabled&&(G._savedShadowForStroke=G.shadowForStrokeEnabled(),G.shadowForStrokeEnabled(!1)),G.perfectDrawEnabled&&(G._savedPerfectDraw=G.perfectDrawEnabled(),G.perfectDrawEnabled(!1)),G.cache&&!G.isCached&&G.width&&G.height){G._dragCached=!0;try{z?G.cache({offset:10,pixelRatio:.8}):G.cache()}catch{G._dragCached=!1}}})}}},[$,g,$e,z,t,s]),ot=p.useCallback(O=>{if(g&&O.target===d.current){if(O.evt&&O.evt._dragSkipUpdate)return;if(O.evt&&(O.evt._dragSkipUpdate=!0),d.current&&x.current){const J=z?.85:.7;Math.random()>J&&d.current.batchDraw()}return}O.target===d.current&&z&&x.current&&(O.cancelBubble=!0)},[z,g]),rt=p.useCallback(O=>{if(O.target===d.current){if(R({x:O.target.x(),y:O.target.y()}),$e(!1),x.current&&(x.current.hitGraphEnabled(!0),g&&x.current.clearCache(),g&&d.current)){const J=d.current.container();J.style.cursor="",J.classList.remove("dragging"),x.current.getChildren().forEach(G=>{G._savedShadowForStroke!==void 0&&(G.shadowForStrokeEnabled(G._savedShadowForStroke),delete G._savedShadowForStroke),G._savedPerfectDraw!==void 0&&(G.perfectDrawEnabled(G._savedPerfectDraw),delete G._savedPerfectDraw),G._dragCached&&(G.clearCache(),delete G._dragCached)})}setTimeout(()=>{d.current&&d.current.batchDraw()},50),N(!1)}},[g,$e]),Ot=p.useCallback(()=>{V(!0),document.body.style.cursor=b?"grabbing":"grab"},[b]),T=p.useCallback(()=>{V(!1),document.body.style.cursor="default"},[]),K=O=>{var ne,G,ge;const J=O.target.getClassName();if(J==="Stage"||J==="Layer"){X({...$,visible:!1});return}if(J==="Group"||J==="Rect"){c(null),I(null);const ye=(ne=d.current)==null?void 0:ne.getPointerPosition();if(ye&&de(ye)){const{x:Ce,y:Ke}=ye,{x:mt,y:Ws}=((G=d.current)==null?void 0:G.position())||{x:0,y:0},{x:Ys,y:Xs}=((ge=d.current)==null?void 0:ge.scale())||{x:1,y:1},Gs=(Ce-mt)/Ys,Qs=(Ke-Ws)/Xs;X({x:Gs,y:Qs,visible:!0})}else X({...$,visible:!1})}else X({...$,visible:!1})},de=O=>{if(!i||!n||!d.current)return!1;const{x:J,y:ne}=O,{x:G,y:ge}=d.current.position(),{x:ye}=d.current.scale(),Ce={x:(J-G)/ye,y:(ne-ge)/ye};return Ce.x>=0&&Ce.x<=i&&Ce.y>=0&&Ce.y<=n},ke=p.useCallback(()=>{c(null),I(null),B(!0),M(!0),X({...$,visible:!1})},[c,I,$]),we=p.useCallback(O=>{k(O),M(!1)},[k]),Me=()=>{B(!0),M(!0),X({...$,visible:!1})},Vt=()=>{v(),X({...$,visible:!1})},Wt=()=>{l(),X({...$,visible:!1})};p.useEffect(()=>{if(t>0&&s>0&&i>0&&n>0){const O=y?20:40,J=t-O*2,ne=s-O*2,G=J/i,ge=ne/n,Ce=Math.min(G,ge),Ke=(t-i*Ce)/2,mt=(s-n*Ce)/2;A(Ce),R({x:Ke,y:mt}),d.current&&d.current.batchDraw()}},[t,s,i,n,y]);const lt=xe.Children.map(w,O=>xe.isValidElement(O)?xe.cloneElement(O,{scale:u,position:L}):O),Vs=e.jsx(ys,{width:i,height:n,scale:u,position:{x:0,y:0},isSelected:!1,onSelect:void 0,onChange:void 0,isEditable:!1});return t<=0||s<=0||i<=0||n<=0?e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"},children:"Loading..."}):e.jsxs("div",{style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",background:"#fafafa",cursor:H?b?"grabbing":"grab":"default"},children:[e.jsx("div",{style:{position:"absolute",top:16,right:16,zIndex:1,display:"flex",gap:"8px"},children:e.jsxs(Q,{style:{background:"rgba(255, 255, 255, 0.9)",padding:"8px",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",backdropFilter:"blur(8px)"},children:[e.jsx(_,{icon:e.jsx(kn,{}),onClick:it,disabled:u<=.1,style:{borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center"}}),e.jsxs("div",{style:{padding:"0 8px",fontSize:"14px",color:"#666",userSelect:"none"},children:[Math.round(u*100),"%"]}),e.jsx(_,{icon:e.jsx(Cn,{}),onClick:ue,disabled:u>=20,style:{borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center"}})]})}),e.jsxs(an,{ref:d,width:t,height:s,onClick:K,draggable:!0,onDragStart:at,onDragMove:ot,onDragEnd:rt,onMouseEnter:Ot,onMouseLeave:T,onWheel:se,x:L.x,y:L.y,scaleX:u,scaleY:u,perfectDrawEnabled:!b&&!g,hitGraphEnabled:!b,pixelRatio:b?z?.8:1:Math.min(1.5,window.devicePixelRatio||1),dragDistance:g?z?5:3:0,children:[g&&e.jsx(on,{ref:S,listening:!1,children:Vs}),e.jsxs(rn,{ref:x,imageSmoothingEnabled:!b||!g,children:[!g&&e.jsx(ys,{width:i,height:n,scale:u,position:{x:0,y:0},isSelected:D,onSelect:P?void 0:ke,onChange:y||P?void 0:k,isEditable:!y&&!P}),a.map(O=>e.jsx(qs,{hall:O,isSelected:(h==null?void 0:h.id)===O.id,onSelect:()=>c(O),onChange:y||P?void 0:m,scale:u,position:{x:0,y:0},exhibitionWidth:i,exhibitionHeight:n,isStallMode:y||P},O._id||O.id)),o.map(O=>{const J=O._id||O.id,ne=a.find(G=>G.id===O.hallId||G._id===O.hallId);return ne?e.jsx(hs,{stall:{...O,_id:J,id:J},hallX:ne.dimensions.x,hallY:ne.dimensions.y,hallWidth:ne.dimensions.width,hallHeight:ne.dimensions.height,scale:u,isDragging:b&&g},J):null}),r.map(O=>{const J=O._id||O.id,G=((f==null?void 0:f._id)||(f==null?void 0:f.id))===J;return e.jsx(Hs,{fixture:{...O,_id:J,id:J},isSelected:G,onSelect:()=>I(O),onChange:P?j:void 0,scale:u,position:{x:0,y:0},exhibitionWidth:i,exhibitionHeight:n,isEditable:P},J)}),lt]})]}),e.jsx(Vn,{visible:$.visible,x:$.x,y:$.y,onExhibitionClick:Me,onHallClick:Vt,onStallClick:Wt,onClose:()=>X({...$,visible:!1})}),e.jsx(Un,{visible:Y,width:i,height:n,onCancel:()=>M(!1),onSubmit:we})]})},Yn=({visible:t,hall:s,exhibitionWidth:i,exhibitionHeight:n,onCancel:a,onSubmit:o,onDelete:r})=>{const[h]=E.useForm();xe.useEffect(()=>{t&&(s?h.setFieldsValue({name:s.name,width:s.dimensions.width,height:s.dimensions.height}):h.setFieldsValue({name:"",width:Math.min(10,i),height:Math.min(10,n)}))},[t,s,i,n,h]);const f=async()=>{var j,k;const I=await h.validateFields(),m=s?{...s,_id:s._id,id:s.id||s._id,name:I.name,dimensions:{x:((j=s.dimensions)==null?void 0:j.x)||0,y:((k=s.dimensions)==null?void 0:k.y)||0,width:I.width,height:I.height},exhibitionId:s.exhibitionId}:{name:I.name,dimensions:{x:0,y:0,width:I.width,height:I.height}};o(m),h.resetFields()},c=()=>{s&&r&&Ie.confirm({title:"Delete Hall",content:`Are you sure you want to delete hall "${s.name}"? This action cannot be undone.`,okText:"Yes, Delete",cancelText:"No, Cancel",okButtonProps:{className:"confirm-delete-button"},centered:!0,onOk:()=>r(s)})};return e.jsx(Ie,{title:s?"Edit Hall":"Add New Hall",open:t,onCancel:()=>{h.resetFields(),a()},footer:null,width:400,destroyOnClose:!0,className:"hall-form-modal",children:e.jsxs(E,{form:h,layout:"vertical",style:{marginTop:"16px"},children:[e.jsx(E.Item,{name:"name",label:e.jsxs("span",{style:{color:"#000"},children:["Hall Name ",e.jsx("span",{style:{color:"#ff4d4f"},children:"*"})]}),rules:[{required:!0,message:"Please enter hall name"}],children:e.jsx(Z,{placeholder:"Enter hall name"})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsx(E.Item,{name:"width",label:e.jsxs("span",{style:{color:"#000"},children:["Width (meters) ",e.jsx("span",{style:{color:"#ff4d4f"},children:"*"})]}),rules:[{required:!0,message:"Please enter width"},{type:"number",min:5,message:"Width must be at least 5 meters"},{type:"number",max:i,message:`Width cannot exceed ${i} meters`}],children:e.jsx(re,{min:5,max:i,style:{width:"100%"},placeholder:"Enter width"})}),e.jsx(E.Item,{name:"height",label:e.jsxs("span",{style:{color:"#000"},children:["Height (meters) ",e.jsx("span",{style:{color:"#ff4d4f"},children:"*"})]}),rules:[{required:!0,message:"Please enter height"},{type:"number",min:5,message:"Height must be at least 5 meters"},{type:"number",max:n,message:`Height cannot exceed ${n} meters`}],children:e.jsx(re,{min:5,max:n,style:{width:"100%"},placeholder:"Enter height"})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"32px",gap:"8px"},children:[e.jsx(Q,{children:s&&r&&e.jsx(_,{className:"delete-button",icon:e.jsx(He,{}),onClick:c,children:"Delete Hall"})}),e.jsxs(Q,{children:[e.jsx(_,{onClick:()=>{h.resetFields(),a()},children:"Cancel"}),e.jsx(_,{type:"primary",onClick:f,className:"update-button",children:s?"Update Hall":"Create Hall"})]})]})]})})},{Title:Xn}=je,Gn=({visible:t,stall:s,hall:i,exhibition:n,onCancel:a,onSubmit:o,onDelete:r})=>{const[h]=E.useForm(),[f,c]=p.useState([]),[I,m]=p.useState(!1),j=(w,y,P,g,d)=>{const S=[...P].sort((A,L)=>{const R=Math.floor(A.dimensions.y/5),H=Math.floor(L.dimensions.y/5);return R===H?A.dimensions.x-L.dimensions.x:A.dimensions.y-L.dimensions.y}),u=(A,L)=>A+w>g||L+y>d?!1:!S.some(R=>{const H=R.dimensions.x,V=R.dimensions.y,b=R.dimensions.width,N=R.dimensions.height,$=1;return!(A+w+$<=H||A>=H+b+$||L+y+$<=V||L>=V+N+$)});for(const A of S){const L=A.dimensions.x+A.dimensions.width+1,R=A.dimensions.y;if(u(L,R))return{x:L,y:R};const H=A.dimensions.x,V=A.dimensions.y+A.dimensions.height+1;if(u(H,V))return{x:H,y:V}}for(let A=0;A<d;A+=5)for(let L=0;L<g;L+=5)if(u(L,A))return{x:L,y:A};return{x:0,y:0}};p.useEffect(()=>{if(s){console.log("Setting form values for stall:",s);const w={number:s.number,stallTypeId:s.stallTypeId,width:s.dimensions.width,height:s.dimensions.height,ratePerSqm:s.ratePerSqm,status:s.status};console.log("Form values to set:",w),h.setFieldsValue(w)}else i&&!h.getFieldValue("status")&&h.setFieldsValue({status:"available",width:Math.min(20,i.dimensions.width/4),height:Math.min(20,i.dimensions.height/4),ratePerSqm:0})},[s,i,h]),p.useEffect(()=>{t&&(async()=>{var y;try{m(!0);const P=await Ls.getStallTypes();console.log("Fetched stall types:",P.data);const g=((y=n.stallRates)==null?void 0:y.map(x=>x.stallTypeId))||[];console.log("Configured stall type IDs:",g);const d=P.data.filter(x=>x.status==="active"&&x._id&&g.includes(x._id));console.log("Filtered stall types:",d),c(d)}catch(P){console.error("Failed to fetch stall types:",P)}finally{m(!1)}})()},[t,n.stallRates]);const k=w=>{var P;console.log("Stall type changed to:",w);const y=(P=n.stallRates)==null?void 0:P.find(g=>g.stallTypeId===w);console.log("Found stall rate:",y),y&&h.setFieldsValue({ratePerSqm:y.rate})},v=()=>{h.resetFields(),a()},l=()=>{if(console.log("Hall data:",i),!i||!i._id&&!i.id){ce.error("Invalid hall selected. Please try again.");return}h.validateFields().then(w=>{var d;const y=i._id||i.id;if(!y){ce.error("Hall ID is missing. Please select a hall again.");return}const P=s?{x:s.dimensions.x,y:s.dimensions.y}:j(w.width,w.height,((d=n.stalls)==null?void 0:d.filter(x=>x.hallId===y))||[],i.dimensions.width,i.dimensions.height),g={id:s==null?void 0:s.id,_id:s==null?void 0:s._id,number:w.number,stallTypeId:w.stallTypeId,dimensions:{x:P.x,y:P.y,width:w.width,height:w.height},ratePerSqm:w.ratePerSqm,status:w.status,hallId:y};console.log("Submitting stall data:",g),o(g)})},C=w=>{switch(w){case"available":return"#52c41a";case"booked":return"#faad14";case"reserved":return"#1890ff";default:return"#d9d9d9"}};return e.jsx(e.Fragment,{children:e.jsx(Ie,{title:e.jsxs(Q,{children:[e.jsx(Et,{style:{fontSize:"20px"}}),e.jsx(Xn,{level:4,style:{margin:0},children:s?"Edit Stall":"Add Stall"})]}),open:t,onCancel:v,destroyOnClose:!0,forceRender:!0,width:480,centered:!0,footer:[e.jsxs(Q,{size:"middle",children:[s&&r&&e.jsx(_,{danger:!0,icon:e.jsx(He,{}),onClick:()=>r(s),children:"Delete"}),e.jsx(_,{onClick:v,children:"Cancel"}),e.jsx(_,{type:"primary",onClick:l,children:s?"Save Changes":"Create"})]},"footer-buttons")],children:e.jsxs(E,{form:h,layout:"vertical",preserve:!1,requiredMark:"optional",style:{padding:"12px 0"},children:[e.jsx(E.Item,{name:"number",label:"Stall Number",rules:[{required:!0,message:"Please enter stall number"}],children:e.jsx(Z,{placeholder:"Enter stall number",size:"large",style:{borderRadius:"6px"}})}),e.jsx(E.Item,{name:"stallTypeId",label:"Stall Type",rules:[{required:!0,message:"Please select stall type"}],children:e.jsx(te,{loading:I,placeholder:"Select stall type",size:"large",onChange:k,children:f.map(w=>e.jsx(te.Option,{value:w._id,children:w.name},w._id))})}),e.jsx(Ee,{orientation:"left",plain:!0,style:{margin:"24px 0"},children:"Dimensions"}),e.jsxs(Q,{style:{width:"100%",gap:"16px"},children:[e.jsx(E.Item,{name:"width",label:"Width (meters)",rules:[{required:!0,message:"Please enter width"},{type:"number",min:1,message:"Width must be at least 1 meter"},{type:"number",max:(i==null?void 0:i.dimensions.width)||100,message:"Width cannot exceed hall width"}],style:{flex:1},children:e.jsx(re,{min:1,max:(i==null?void 0:i.dimensions.width)||100,style:{width:"100%"},size:"large",placeholder:"Width",addonAfter:"m"})}),e.jsx(E.Item,{name:"height",label:"Height (meters)",rules:[{required:!0,message:"Please enter height"},{type:"number",min:1,message:"Height must be at least 1 meter"},{type:"number",max:(i==null?void 0:i.dimensions.height)||100,message:"Height cannot exceed hall height"}],style:{flex:1},children:e.jsx(re,{min:1,max:(i==null?void 0:i.dimensions.height)||100,style:{width:"100%"},size:"large",placeholder:"Height",addonAfter:"m"})})]}),e.jsx(Ee,{orientation:"left",plain:!0,style:{margin:"24px 0"},children:"Details"}),e.jsx(E.Item,{name:"ratePerSqm",label:"Rate per sq.m (₹)",rules:[{required:!0,message:"Please select a stall type to set the rate"}],children:e.jsx(re,{min:0,style:{width:"100%"},size:"large",placeholder:"Rate will be set based on stall type",prefix:"₹",disabled:!0,formatter:w=>`${w}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:w=>{const y=w?Number(w.replace(/\₹\s?|(,*)/g,"")):0;return isNaN(y)?0:y}})}),e.jsx(E.Item,{name:"status",label:"Status",rules:[{required:!0,message:"Please select status"}],children:e.jsxs(te,{placeholder:"Select status",size:"large",style:{borderRadius:"6px"},children:[e.jsx(te.Option,{value:"available",children:e.jsxs(Q,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:C("available")}}),"Available"]})}),e.jsx(te.Option,{value:"booked",children:e.jsxs(Q,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:C("booked")}}),"Booked"]})}),e.jsx(te.Option,{value:"reserved",children:e.jsxs(Q,{children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:C("reserved")}}),"Reserved"]})})]})})]})})})},Qn=({name:t,type:s,color:i,rotation:n,showName:a,iconUrl:o,defaultIcons:r,borderColor:h=null,borderRadius:f=0})=>{p.useEffect(()=>{console.log("FixturePreview rendering with props:",{name:t,type:s,color:i,rotation:n,showName:a,iconUrl:o,defaultIconAvailable:!!r[s],borderColor:h,borderRadius:f})},[t,s,i,n,a,o,r,h,f]);const c=r[s]||"📦";return e.jsxs("div",{style:{padding:"24px",textAlign:"center",backgroundColor:"#fafafa",borderBottom:"1px solid #f0f0f0",borderRadius:"8px 8px 0 0"},children:[e.jsx("div",{style:{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"120px",height:"120px",borderRadius:`${f||4}px`,backgroundColor:i||"#f0f0f0",transform:`rotate(${n}deg)`,transition:"all 0.3s ease",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",overflow:"hidden",position:"relative",border:h?`1px solid ${h}`:"1px solid rgba(0,0,0,0.05)"},children:o?e.jsx("img",{src:o,alt:t,style:{width:"100%",height:"100%",objectFit:"contain",padding:"8px"}}):e.jsx("div",{style:{fontSize:"48px",lineHeight:"1",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:c})}),a&&e.jsx("div",{style:{marginTop:"12px",fontSize:"16px",fontWeight:500,color:"#333"},children:t}),e.jsxs("div",{style:{marginTop:"4px",fontSize:"14px",color:"#888",display:"flex",gap:"8px",justifyContent:"center",alignItems:"center"},children:[e.jsx("span",{children:s.charAt(0).toUpperCase()+s.slice(1)}),e.jsx("span",{children:"•"}),e.jsx("span",{children:i}),n>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:[n,"°"]})]}),h&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Border: ",h]})]}),f>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"•"}),e.jsxs("span",{children:["Radius: ",f,"px"]})]})]})]})},{Text:Kn}=je,Xt=({activeKey:t,form:s,fixture:i,exhibitionWidth:n,exhibitionHeight:a,selectedType:o,showName:r,iconFileList:h,fixtureTypes:f,fixtureIcons:c,defaultColors:I,defaultDimensions:m,colorPresets:j,uploadProps:k,iconPreviewVisible:v=!1,previewImage:l="",onTypeChange:C,onColorChange:w,onShowNameChange:y,onIconPreviewCancel:P=()=>{}})=>{switch(t){case"basic":return g();case"position":return d();case"appearance":return x();default:return g()}function g(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(E.Item,{name:"name",label:"Fixture Name",rules:[{required:!0,message:"Please enter fixture name"}],children:e.jsx(Z,{placeholder:"Enter fixture name",prefix:e.jsx(Qe,{style:{color:"#aaa"}}),style:{borderRadius:"8px"}})}),e.jsx(E.Item,{name:"showName",label:"Show Name on Layout",tooltip:"Toggle whether the fixture name appears on the layout",valuePropName:"checked",children:e.jsx(gt,{defaultChecked:!0,checkedChildren:"Visible",unCheckedChildren:"Hidden",onChange:S=>{y(S),console.log("Form values after showName toggle:",s.getFieldsValue(!0))}})}),e.jsx(E.Item,{name:"type",label:"Fixture Type",rules:[{required:!0,message:"Please select fixture type"}],children:e.jsx(te,{placeholder:"Select fixture type",onChange:C,options:f.map(S=>({...S,label:e.jsxs(Q,{children:[e.jsx("span",{style:{fontSize:16},children:c[S.value]}),e.jsx("span",{children:S.label})]})})),style:{width:"100%",borderRadius:"8px"},listHeight:300,dropdownStyle:{borderRadius:"8px"}})})]})}function d(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(q,{size:"small",title:"Position (meters)",style:{marginBottom:16,borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsxs(ie,{gutter:16,children:[e.jsx(F,{span:12,children:e.jsx(E.Item,{name:["position","x"],label:"X Position",rules:[{required:!0,message:"X position is required"}],children:e.jsx(re,{style:{width:"100%",borderRadius:"8px"},min:0,max:n,step:.1,precision:1,placeholder:"X position"})})}),e.jsx(F,{span:12,children:e.jsx(E.Item,{name:["position","y"],label:"Y Position",rules:[{required:!0,message:"Y position is required"}],children:e.jsx(re,{style:{width:"100%",borderRadius:"8px"},min:0,max:a,step:.1,precision:1,placeholder:"Y position"})})})]})}),e.jsx(q,{size:"small",title:"Dimensions (meters)",style:{marginBottom:16,borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsxs(ie,{gutter:16,children:[e.jsx(F,{span:12,children:e.jsx(E.Item,{name:["dimensions","width"],label:"Width",rules:[{required:!0,message:"Width is required"}],children:e.jsx(re,{style:{width:"100%",borderRadius:"8px"},min:.5,max:20,step:.1,precision:1,placeholder:"Width"})})}),e.jsx(F,{span:12,children:e.jsx(E.Item,{name:["dimensions","height"],label:"Height",rules:[{required:!0,message:"Height is required"}],children:e.jsx(re,{style:{width:"100%",borderRadius:"8px"},min:.5,max:20,step:.1,precision:1,placeholder:"Height"})})})]})}),e.jsx(q,{size:"small",title:e.jsxs("span",{children:[e.jsx(In,{})," Rotation (degrees)"]}),style:{borderRadius:8},styles:{body:{padding:"12px 16px"}},children:e.jsx(E.Item,{name:"rotation",noStyle:!0,children:e.jsx(un,{min:0,max:360,marks:{0:"0°",90:"90°",180:"180°",270:"270°",360:"360°"},tooltip:{formatter:S=>`${S}°`},style:{marginTop:10},keyboard:!1})})})]})}function x(){return e.jsxs("div",{className:"tab-content",children:[e.jsx(E.Item,{name:"color",label:"Color",tooltip:"Choose a color for the fixture. This affects the background color and tint applied to SVG icons.",rules:[{validator:(S,u)=>{try{return u?Promise.resolve():Promise.reject("Please select a color")}catch{return Promise.reject("Please enter a valid color value")}}}],children:e.jsx(xs,{format:"hex",allowClear:!0,showText:!0,disabledAlpha:!0,presets:j,onChange:w,style:{width:"100%"}})}),e.jsx(E.Item,{name:"borderColor",label:"Border Color",tooltip:"Choose a border color for the fixture. Leave empty for default borders.",children:e.jsx(xs,{format:"hex",allowClear:!0,showText:!0,disabledAlpha:!0,presets:j,style:{width:"100%"}})}),e.jsx(E.Item,{name:"borderRadius",label:"Border Radius",tooltip:"Set the corner radius in pixels. Higher values make more rounded corners.",children:e.jsx(re,{min:0,max:20,step:1,style:{width:"100%",borderRadius:"8px"},addonAfter:"px"})}),e.jsxs(q,{size:"small",title:"Icon Upload",style:{borderRadius:8,marginBottom:16,marginTop:16},styles:{body:{padding:"16px"}},children:[e.jsx("div",{style:{marginBottom:0},children:e.jsx(Bt,{...k,children:h.length<1&&e.jsxs("div",{children:[e.jsx(En,{style:{fontSize:20}}),e.jsx("div",{style:{marginTop:8},children:"Upload Icon"})]})})}),e.jsx(Kn,{type:"secondary",style:{display:"block",marginTop:12},children:"Upload a custom icon or use the default icon for the selected fixture type. Supported formats: PNG, JPG, SVG. SVG icons are preferred for better quality at all sizes."})]}),e.jsx(E.Item,{name:"icon",label:"Icon URL",tooltip:"URL to an icon image for this fixture. Will be used if no icon is uploaded.",children:e.jsx(Z,{placeholder:"https://example.com/icon.png",prefix:e.jsx(Tn,{style:{color:"#aaa"}}),style:{borderRadius:"8px"}})}),e.jsx(Ie,{open:v,title:"Icon Preview",footer:null,onCancel:P,children:e.jsx("img",{alt:"Icon Preview",style:{width:"100%"},src:l})})]})}},Zn=t=>[{key:"basic",label:e.jsxs("span",{children:[e.jsx(It,{}),"Basic Info"]}),children:e.jsx(Xt,{...t,activeKey:"basic"})},{key:"position",label:e.jsxs("span",{children:[e.jsx(St,{}),"Position"]}),children:e.jsx(Xt,{...t,activeKey:"position"})},{key:"appearance",label:e.jsxs("span",{children:[e.jsx(qt,{}),"Appearance"]}),children:e.jsx(Xt,{...t,activeKey:"appearance"})}],{Text:Ki,Title:Zi}=je,{TabPane:Ji}=kt,Jn=[{value:"sofa",label:"Sofa"},{value:"chair",label:"Chair"},{value:"table",label:"Table"},{value:"desk",label:"Desk"},{value:"plant",label:"Plant"},{value:"entrance",label:"Entrance"},{value:"exit",label:"Exit"},{value:"info",label:"Information"},{value:"restroom",label:"Restroom"},{value:"food",label:"Food Area"},{value:"custom",label:"Custom"}],Nt={sofa:{width:2,height:1},chair:{width:5,height:5},table:{width:1,height:1},desk:{width:2,height:.8},plant:{width:.5,height:.5},entrance:{width:1.5,height:.2},exit:{width:1.5,height:.2},info:{width:1,height:1},restroom:{width:1,height:1},food:{width:2,height:2},custom:{width:1,height:1}},Ye={sofa:"#a0d0ff",chair:"#a0d0ff",table:"#e0e0e0",desk:"#e0e0e0",plant:"#90ee90",entrance:"#98fb98",exit:"#ffcccb",info:"#add8e6",restroom:"#d8bfd8",food:"#ffe4b5",custom:"#f0f0f0"},Gt={sofa:"🛋️",chair:"🪑",table:"🪟",desk:"🖥️",plant:"🪴",entrance:"🚪",exit:"🚪",info:"ℹ️",restroom:"🚻",food:"🍽️",custom:"📦"},ei=({visible:t,fixture:s,onCancel:i,onSubmit:n,onDelete:a,exhibitionWidth:o,exhibitionHeight:r})=>{const[h]=E.useForm(),[f,c]=p.useState(!1),[I,m]=p.useState(""),[j,k]=p.useState("basic"),[v,l]=p.useState(""),[C,w]=p.useState([]),[y,P]=p.useState(!1),[g,d]=p.useState(""),{message:x}=nt.useApp(),[S,u]=p.useState("#f0f0f0"),[A,L]=p.useState("New Fixture"),[R,H]=p.useState("chair"),[V,b]=p.useState(0),[N,$]=p.useState(!0),[X,D]=p.useState(null),[B,Y]=p.useState(0);p.useEffect(()=>{if(t)if(s){const T=ue(s.color),K=Ye[s.type]||"#f0f0f0",de=T||K;console.log("Setting up fixture colors:",{original:s.color,normalized:T,fallback:K,final:de}),u(de),L(s.name),H(s.type),b(s.rotation||0),m(s.type),$(s.showName!==!1),D(s.borderColor||null),Y(s.borderRadius||0)}else{const T="chair",K=Ye[T];u(K),L("New Fixture"),H(T),b(0),m(T),$(!0),D(null),Y(0)}},[t,s]),p.useEffect(()=>{if(t&&h){if(s){const T=ue(s.color),K=Ye[s.type]||"#f0f0f0",de=T||K;h.setFieldsValue({name:s.name,type:s.type,position:{x:s.position.x,y:s.position.y},dimensions:{width:s.dimensions.width,height:s.dimensions.height},rotation:s.rotation||0,color:de,icon:s.icon||"",showName:s.showName!==!1,borderColor:s.borderColor||null,borderRadius:s.borderRadius||0});const ke=s.icon?us(s.icon):"";l(ke),s.icon?w([{uid:"-1",name:s.icon.split("/").pop()||"icon",status:"done",url:ke,thumbUrl:ke}]):w([])}else{const T="chair",K=Ye[T];h.setFieldsValue({name:"New Fixture",type:T,position:{x:Math.floor(o/2),y:Math.floor(r/2)},dimensions:Nt[T],rotation:0,color:K,icon:"",showName:!0,borderColor:null,borderRadius:0}),l(""),w([])}k("basic")}},[t,s,h,o,r]);const M=()=>{if(h&&t)try{const T=h.getFieldsValue(!0);if(T.name&&L(T.name),T.type&&H(T.type),T.rotation!==void 0&&b(T.rotation),T.color){const K=ue(T.color);K&&u(K)}if(T.showName!==void 0&&$(T.showName),T.borderColor!==void 0){const K=T.borderColor?ue(T.borderColor):null;D(K)}T.borderRadius!==void 0&&Y(T.borderRadius)}catch(T){console.log("Error updating preview",T)}};p.useEffect(()=>{if(h&&t)return h.getFieldsValue,M(),()=>{}},[h,t]);const z=T=>{if(m(T),H(T),!s){const K=Ye[T]||Ye.custom;h.setFieldsValue({dimensions:Nt[T]||Nt.custom,color:K}),u(K)}},W=T=>{const K=ue(T);h.setFieldValue("color",K),u(K);const de=Object.entries(Ye).find(([ke,we])=>we.toLowerCase()===K.toLowerCase());de&&!s&&(h.setFieldValue("type",de[0]),m(de[0]),H(de[0]))},U=()=>(console.log("Rendering fixture preview with:",{name:A,type:R,color:S,rotation:V,showName:N,iconUrl:v,borderColor:X,borderRadius:B}),e.jsx(Qn,{name:A,type:R,color:S,rotation:V,showName:N,iconUrl:v,defaultIcons:Gt,borderColor:X,borderRadius:B})),ee=({file:T,fileList:K})=>{var de;if(T.status==="uploading"&&w(K),T.status==="done"){x.success(`${T.name} uploaded successfully`);let we=(((de=T.response)==null?void 0:de.url)||"").replace(/^\/api\/uploads\//,"");we&&!we.startsWith("fixtures/")&&(we=`fixtures/${we.replace(/^\//,"")}`),console.log("Icon path stored in form:",we),h.setFieldValue("icon",we);const Me=us(we);console.log("Using direct backend URL:",Me),l(Me);const Vt=T.name.toLowerCase().endsWith(".svg"),Wt=K.map(lt=>lt.uid===T.uid?{...lt,url:Me,thumbUrl:Me,type:Vt?"image/svg+xml":lt.type}:lt);w(Wt),console.log("Form values after icon upload:",h.getFieldsValue(!0))}T.status==="error"&&(x.error(`${T.name} upload failed.`),w(K.filter(ke=>ke.uid!==T.uid)))},se={name:"file",action:`${Se.defaults.baseURL}/fixtures/upload/icons`,headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},accept:"image/png,image/jpeg,image/jpg,image/svg+xml",listType:"picture-card",fileList:C,onChange:ee,onPreview:T=>{d(T.url||T.thumbUrl||""),P(!0)},onRemove:()=>(l(""),w([]),h.setFieldValue("icon",""),console.log("Form values after icon removal:",h.getFieldsValue(!0)),!0),maxCount:1,showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0,showDownloadIcon:!1,removeIcon:e.jsx(He,{style:{color:"#ff4d4f"}})}},ue=T=>{try{if(!T)return"#f0f0f0";if(typeof T=="object"&&T!==null){if(typeof T.toHexString=="function")return T.toHexString();if(T.rgb||T.hex)return T.hex||`rgb(${T.rgb.r},${T.rgb.g},${T.rgb.b})`}if(typeof T=="string"){if(/^#([0-9A-F]{3}){1,2}$/i.test(T))return T;if(/^([0-9A-F]{3}){1,2}$/i.test(T))return`#${T}`;if(/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(T))return T}return"#f0f0f0"}catch(K){return console.error("Error normalizing color:",K),"#f0f0f0"}},it=[{label:"Primary Colors",colors:["#1890ff","#52c41a","#faad14","#f5222d","#722ed1"]},{label:"Neutrals",colors:["#000000","#262626","#595959","#8c8c8c","#bfbfbf","#d9d9d9","#f0f0f0","#ffffff"]}],$e=xe.useCallback(()=>{s&&a&&a(s)},[s,a]),at=T=>{k(T),document.activeElement instanceof HTMLElement&&document.activeElement.blur()},ot=Zn({form:h,fixture:s,exhibitionWidth:o,exhibitionHeight:r,selectedType:I,showName:N,iconFileList:C,fixtureTypes:Jn,fixtureIcons:Gt,defaultColors:Ye,defaultDimensions:Nt,colorPresets:it,uploadProps:se,iconPreviewVisible:y,previewImage:g,onTypeChange:z,onColorChange:W,onShowNameChange:T=>$(T),onIconPreviewCancel:()=>P(!1),activeKey:j}),rt=async()=>{try{c(!0);const T=await h.validateFields();L(T.name),H(T.type),b(T.rotation||0),u(ue(T.color)),$(T.showName),D(T.borderColor?ue(T.borderColor):null),Y(T.borderRadius||0);let K="";T.icon?K=Ot(T.icon):s!=null&&s.icon&&(K=s.icon),console.log("Form values being submitted:",{name:T.name,type:T.type,color:T.color,icon:T.icon,originalIcon:s==null?void 0:s.icon,cleanedIcon:K,showName:T.showName,borderColor:T.borderColor,borderRadius:T.borderRadius});const de=(s==null?void 0:s._id)||(s==null?void 0:s.id)||"",ke=T.color?ue(T.color):(s==null?void 0:s.color)||"#f0f0f0",we=T.borderColor?ue(T.borderColor):null,Me={...s,id:de,_id:de,name:T.name,type:T.type,position:T.position,dimensions:T.dimensions,rotation:T.rotation,color:ke,icon:K,zIndex:(s==null?void 0:s.zIndex)||1,isActive:(s==null?void 0:s.isActive)!==void 0?s.isActive:!0,borderColor:we,borderRadius:T.borderRadius||0};de&&(Me.showName=T.showName),console.log("Submitting fixture with icon path:",K),console.log("Color being submitted:",ke),await n(Me),i()}catch(T){console.error("Fixture submission failed:",T),x.error("Failed to save fixture. Please check the form and try again.")}finally{c(!1)}},Ot=T=>{if(!T||typeof T!="string")return"";if(T.startsWith("fixtures/")&&!T.includes("?")&&!T.includes("http"))return T;let K=T.replace(/^\/api\/uploads\//,"");if(K=K.replace(/^\//,""),K.includes("?")||K.includes("http")){const de=K.split("?")[0].split("/").pop()||"";if(de)return`fixtures/${de}`}return K&&!K.startsWith("fixtures/")?`fixtures/${K}`:K};return e.jsxs(Ie,{title:e.jsxs("div",{style:{padding:"8px 0",display:"flex",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:24,marginRight:8},children:s?Gt[s.type]:"🪑"}),e.jsx("span",{children:s?`Edit ${s.name}`:"Add New Fixture"})]}),open:t,onCancel:i,confirmLoading:f,footer:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx("div",{children:s&&a&&e.jsx(_,{danger:!0,icon:e.jsx(He,{}),onClick:$e,style:{borderRadius:"6px"},children:"Delete"})}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx(_,{onClick:i,icon:e.jsx(Nn,{}),style:{borderRadius:"6px"},children:"Cancel"}),e.jsx(_,{type:"primary",onClick:rt,icon:e.jsx(cs,{}),style:{borderRadius:"6px"},children:s?"Update":"Create"})]})]}),width:560,centered:!0,styles:{header:{borderBottom:"1px solid #f0f0f0",padding:"16px 24px"},body:{backgroundColor:"#fff",borderRadius:"0 0 8px 8px",padding:"0"},footer:{borderTop:"1px solid #f0f0f0",padding:"12px 24px",margin:0}},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}}),U(),e.jsx(E,{form:h,layout:"vertical",initialValues:{name:"New Fixture",type:"chair",position:{x:0,y:0},dimensions:{width:1,height:1},rotation:0,color:"#f0f0f0",icon:"",showName:!0,borderColor:null,borderRadius:0},style:{padding:"0 24px 20px"},onValuesChange:M,children:e.jsx(kt,{activeKey:j,onChange:at,items:ot,tabBarStyle:{marginBottom:16},centered:!0})})]})},ti=ae(Ie)`
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
`,si=ae.div`
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
`,yt=ae.div`
  padding: 24px 32px 32px;
`,ni=ae.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
`,ii=ae.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;ae.div`
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
`;ae.div`
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
`;ae.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;ae.div`
  border: 1px solid ${t=>t.selected?"#4b47b9":"#e6e6f0"};
  background: ${t=>t.selected?"rgba(75, 71, 185, 0.05)":"white"};
  border-radius: 12px;
  padding: 20px;
  padding-left: 48px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: ${t=>t.selected?"0 4px 12px rgba(75, 71, 185, 0.15)":"0 2px 8px rgba(0, 0, 0, 0.04)"};
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
    background: ${t=>t.selected?"#4b47b9":"#52c41a"};
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
    background: ${t=>t.selected?"#4b47b9":"white"};
    border: 2px solid ${t=>t.selected?"#4b47b9":"#d9d9d9"};
    color: white;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;const ai=ae(q)`
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
`;ae(_)`
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
`;ae.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;ae(q)`
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
`;ae(Z)`
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
`;const Qt=ae(_)`
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
`;ae(dt)`
  .ant-descriptions-item-label {
    background: #f8f8fc !important;
    font-weight: 600;
    color: #1f1f1f;
  }
  
  .ant-descriptions-item-content {
    background: white !important;
  }
`;ae.div`
  background: #f8f8fc;
  padding: 32px 0;
  border-bottom: 1px solid #e6e6f0;
  margin: -32px -32px 32px;
`;ae(xn)`
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
`;ae.div`
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
`;ae.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e6e6f0;
  }
`;ae.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;ae.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
`;ae.div`
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
`;ae(q)`
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
`;const js=({form:t,stallDetails:s=[],selectedStallId:i,selectedStallIds:n=[],exhibition:a})=>{const[o,r]=p.useState([]);p.useEffect(()=>{let k=[...(t.getFieldValue("selectedStalls")||[]).map(v=>String(v))];if(i){const v=String(i);k.some(l=>l===v)||k.push(v)}n.length>0&&n.forEach(v=>{const l=String(v);k.some(C=>C===l)||k.push(l)}),console.log("StallDetailsStep - Initial stalls after normalization:",k),t.setFieldsValue({selectedStalls:k}),r(k)},[t,i,n]),p.useEffect(()=>{if(o.length>0){const m=t.getFieldValue("selectedStalls")||[],j=new Set(m.map(l=>String(l))),k=new Set(o.map(l=>String(l)));let v=j.size!==k.size;if(!v){for(const l of k)if(!j.has(l)){v=!0;break}}if(v){console.log("Syncing form with selected stalls:",o);const l=o.map(C=>String(C));t.setFieldsValue({selectedStalls:l}),t.validateFields(["selectedStalls"]).catch(C=>{})}}},[o,t]);const h=p.useMemo(()=>!s||s.length===0?[]:s.filter(m=>o.includes(m.id)),[s,o]),f=p.useMemo(()=>{var g,d,x;if(!s||s.length===0)return{baseAmount:0,discounts:[],totalDiscountAmount:0,amountAfterDiscount:0,taxes:[],totalTaxAmount:0,total:0,selectedStallNumbers:""};const m=s.filter(S=>o.includes(S.id)),j=m.reduce((S,u)=>S+(u.price||u.ratePerSqm*u.dimensions.width*u.dimensions.height),0),v=(((g=a==null?void 0:a.publicDiscountConfig)==null?void 0:g.filter(S=>S.isActive))||[]).map(S=>{const u=S.type==="percentage"?j*(Math.min(Math.max(0,S.value),100)/100):Math.min(S.value,j);return{name:S.name,type:S.type,value:S.value,amount:u}}),l=v.reduce((S,u)=>S+u.amount,0),C=j-l,w=((x=(d=a==null?void 0:a.taxConfig)==null?void 0:d.filter(S=>S.isActive))==null?void 0:x.map(S=>({name:S.name,rate:S.rate,amount:C*(S.rate/100)})))||[],y=w.reduce((S,u)=>S+u.amount,0),P=C+y;return{baseAmount:j,discounts:v,totalDiscountAmount:l,amountAfterDiscount:C,taxes:w,totalTaxAmount:y,total:P,selectedStallNumbers:m.map(S=>`${S.number||S.stallNumber||`Stall ${S.id}`} (${S.hallName||`Hall ${S.hallId||1}`})`).join(", ")}},[s,o,a==null?void 0:a.taxConfig,a==null?void 0:a.publicDiscountConfig]),c=m=>{const j=String(m);if(o.some(v=>String(v)===j)){const v=o.filter(l=>String(l)!==j);r(v),t.setFieldsValue({selectedStalls:v}),ce.info("Stall removed from selection")}},I=m=>`₹${m.toLocaleString("en-IN")}`;return e.jsxs(yt,{children:[e.jsx(ni,{children:"Your Selected Stalls"}),e.jsx(ii,{children:"Review your selected stalls. You can remove a stall by clicking the delete button."}),e.jsx(E.Item,{name:"selectedStalls",rules:[{required:!0,message:"Please select at least one stall"}],style:{display:"none"},children:e.jsx(te,{mode:"multiple"})}),h.length>0?e.jsx("div",{style:{marginBottom:24,background:"#fff",borderRadius:"8px",padding:"16px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.06)"},children:e.jsx(Oe,{dataSource:h.map(m=>({...m,key:m.id,price:m.price||m.ratePerSqm*m.dimensions.width*m.dimensions.height,area:m.dimensions.width*m.dimensions.height,dimensions:`${m.dimensions.width}m × ${m.dimensions.height}m`,size:`${m.dimensions.width}m × ${m.dimensions.height}m`,stallType:m.stallType||{name:m.typeName||m.type||"Standard"},type:m.typeName||m.type||"Standard"})),pagination:!1,size:"middle",rowClassName:()=>"stall-table-row",className:"selected-stalls-table",style:{borderRadius:"6px",overflow:"hidden"},columns:[{title:"Stall",dataIndex:"number",key:"number",render:(m,j)=>e.jsxs("span",{style:{fontWeight:600,fontSize:"15px"},children:["Stall ",m||j.stallNumber]})},{title:"Hall",dataIndex:"hallName",key:"hallName",render:(m,j)=>e.jsx(he,{color:"blue",style:{borderRadius:"4px"},children:m||`Hall ${j.hallId}`})},{title:"Stall Type",dataIndex:"stallType",key:"stallType",align:"center",render:(m,j)=>{var v;const k=((v=j.stallType)==null?void 0:v.name)||j.type||"Standard";return e.jsx(he,{color:"purple",style:{borderRadius:"4px",padding:"2px 8px"},children:k})}},{title:"Dimensions",dataIndex:"dimensions",key:"dimensions",align:"center",render:(m,j)=>e.jsxs(Q,{direction:"vertical",size:0,children:[e.jsx("span",{style:{fontWeight:500},children:m}),e.jsxs("span",{style:{color:"#888",fontSize:"13px"},children:[j.area," sqm"]})]})},{title:"Rate",dataIndex:"ratePerSqm",key:"ratePerSqm",align:"right",render:(m,j)=>e.jsxs("span",{style:{color:"#555"},children:["₹",(j.ratePerSqm||0).toLocaleString("en-IN"),"/sqm"]})},{title:"Price",dataIndex:"price",key:"price",align:"right",render:m=>e.jsx("span",{style:{fontWeight:600,color:"#1890ff",fontSize:"15px",display:"block",padding:"4px 8px",background:"rgba(24, 144, 255, 0.1)",borderRadius:"4px",textAlign:"right"},children:I(m)})},{title:"",key:"action",width:70,align:"center",render:(m,j)=>e.jsx(Ve,{title:"Remove from selection",children:e.jsx(_,{type:"text",danger:!0,icon:e.jsx(He,{}),onClick:()=>c(j.id),size:"middle",style:{borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center"}})})}]})}):e.jsx(Re,{description:"No stalls selected yet. Please select stalls from the layout.",image:Re.PRESENTED_IMAGE_SIMPLE,style:{margin:"32px 0"}}),o.length>0&&e.jsxs(ai,{title:e.jsx("span",{style:{fontSize:"16px",fontWeight:600},children:"Booking Summary"}),style:{borderRadius:"8px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.06)"},headStyle:{background:"#f6f8fa",borderBottom:"1px solid #eee"},bodyStyle:{padding:"16px 24px"},children:[e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Selected Stalls"}),e.jsxs("div",{className:"value",children:[o.length," stall(s) selected"]})]}),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Stall Numbers"}),e.jsx("div",{className:"value",style:{maxWidth:"60%",wordBreak:"break-word"},children:f.selectedStallNumbers})]}),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Base Amount"}),e.jsx("div",{className:"value",children:I(f.baseAmount)})]}),f.discounts.map((m,j)=>e.jsxs("div",{className:"summary-row discount",children:[e.jsxs("div",{className:"label",children:[m.name,m.type==="percentage"?` (${m.value}%)`:""]}),e.jsxs("div",{className:"value",style:{color:"#52c41a"},children:["- ",I(m.amount)]})]},`discount-${j}`)),e.jsxs("div",{className:"summary-row",children:[e.jsx("div",{className:"label",children:"Amount after Discount"}),e.jsx("div",{className:"value",style:{fontWeight:500},children:I(f.amountAfterDiscount)})]}),f.taxes.map((m,j)=>e.jsxs("div",{className:"summary-row",children:[e.jsxs("div",{className:"label",children:[m.name," (",m.rate,"%)"]}),e.jsxs("div",{className:"value",style:{color:"#faad14"},children:["+ ",I(m.amount)]})]},`tax-${j}`)),e.jsxs("div",{className:"summary-row total",style:{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid #f0f0f0"},children:[e.jsx("div",{className:"label",style:{fontSize:"16px",fontWeight:600},children:"Total"}),e.jsx("div",{className:"value",style:{fontSize:"18px",fontWeight:700,color:"#1890ff"},children:I(f.total)})]})]})]})},{Title:oi,Paragraph:ws,Text:Be}=je,{Panel:ea}=mn,{Option:ri}=te,vs=({form:t,formValues:s,selectedStallIds:i=[],exhibition:n,stallDetails:a=[]})=>{const o=t.getFieldValue("selectedStalls")||i||[],[r,h]=p.useState(t.getFieldValue("amenities")||[]),[f,c]=p.useState({}),I=p.useMemo(()=>a!=null&&a.length?a.filter(x=>o.includes(x.id)):[],[a,o]),m=p.useMemo(()=>I.reduce((x,S)=>x+S.dimensions.width*S.dimensions.height,0),[I]),j=(n==null?void 0:n.basicAmenities)&&n.basicAmenities.length>0,k=(n==null?void 0:n.amenities)&&n.amenities.length>0,v=p.useMemo(()=>!j||m===0?[]:((n==null?void 0:n.basicAmenities)||[]).map(x=>{const S=Math.floor(m/x.perSqm)*x.quantity;return{...x,calculatedQuantity:S>0?S:0,key:x._id||x.id}}),[n,j,m]),l=x=>{const S={...f};x.forEach(u=>{r.includes(u)||(S[u]=1)}),Object.keys(S).forEach(u=>{x.includes(u)||delete S[u]}),c(S),h(x)},C=x=>(x._id||x.id||"").toString(),w=(x,S)=>{c(u=>({...u,[x]:S}))};xe.useEffect(()=>{const x=r.map(S=>({id:S,quantity:f[S]||1}));t.setFieldsValue({amenities:x})},[r,f,t]);const y=x=>`₹${x.toLocaleString("en-IN")}`,P=p.useMemo(()=>k?((n==null?void 0:n.amenities)||[]).filter(x=>r.includes(C(x))).map(x=>({...x,key:C(x),quantity:f[C(x)]||1})):[],[n,k,r,f]),g=[{title:"Name",dataIndex:"name",key:"name",render:(x,S)=>e.jsxs(Q,{children:[e.jsx(Be,{strong:!0,children:x}),e.jsx(he,{color:"blue",children:S.type})]})},{title:"Quantity",dataIndex:"calculatedQuantity",key:"calculatedQuantity",width:120,render:x=>e.jsxs(he,{color:"green",children:[x," ",x===1?"unit":"units"]})},{title:"Allocation",dataIndex:"perSqm",key:"perSqm",width:180,render:(x,S)=>e.jsx(Ve,{title:S.description,children:e.jsxs(Be,{type:"secondary",children:[e.jsx(Qe,{style:{marginRight:5}}),"1 ",S.quantity>1?`set of ${S.quantity}`:"unit"," per ",x," sqm"]})})}],d=[{title:"Name",dataIndex:"name",key:"name",render:(x,S)=>e.jsxs(Q,{align:"center",children:[e.jsx(Be,{strong:!0,children:x}),e.jsx(he,{color:"blue",children:S.type}),e.jsx(Be,{type:"secondary",style:{fontSize:"13px"},children:S.description})]})},{title:"Rate",dataIndex:"rate",key:"rate",width:120,render:x=>e.jsx(Be,{strong:!0,style:{color:"#1890ff"},children:y(x)})},{title:"Quantity",dataIndex:"quantity",key:"quantity",width:120,render:(x,S)=>e.jsx(re,{min:1,value:f[S.key]||1,onChange:u=>w(S.key,u||1),style:{width:"100%"}})},{title:"Total",key:"total",width:120,render:(x,S)=>{const u=f[S.key]||1,A=S.rate*u;return e.jsx(Be,{strong:!0,style:{color:"#1890ff"},children:y(A)})}}];return e.jsxs(yt,{children:[e.jsx(oi,{level:4,children:"Stall Amenities"}),e.jsx(ws,{type:"secondary",style:{marginBottom:24},children:"Review included amenities and select additional amenities for your exhibition stalls."}),e.jsx(q,{title:`Selected Stalls: ${o.length}`,style:{marginBottom:24},children:o.length>0?e.jsxs(ws,{children:["You've selected ",o.length," stall(s) with a total area of ",m," sq. meters."]}):e.jsx(Re,{image:Re.PRESENTED_IMAGE_SIMPLE,description:"No stalls selected"})}),e.jsx(q,{title:e.jsxs(Q,{children:[e.jsx(ct,{status:"success"}),"Included Amenities"]}),style:{marginBottom:24},children:o.length===0?e.jsx(ls,{message:"Select stalls first",description:"Please select stalls to see what amenities are included.",type:"info",showIcon:!0}):j?e.jsx(Oe,{dataSource:v.filter(x=>x.calculatedQuantity>0),columns:g,pagination:!1,size:"small",locale:{emptyText:e.jsx(Re,{image:Re.PRESENTED_IMAGE_SIMPLE,description:"Your stall area is too small to qualify for any basic amenities."})}}):e.jsx(Re,{image:e.jsx(gs,{style:{fontSize:60,color:"#cccccc"}}),description:"No basic amenities have been configured for this exhibition."})}),e.jsx(Ee,{}),e.jsx(q,{title:"Additional Amenities (Extra Charges)",children:k?e.jsxs("div",{children:[e.jsx(E.Item,{label:"Select Additional Amenities",style:{marginBottom:24},children:e.jsx(te,{mode:"multiple",style:{width:"100%"},placeholder:"Select amenities",value:r,onChange:l,optionLabelProp:"label",children:((n==null?void 0:n.amenities)||[]).map(x=>e.jsxs(ri,{value:C(x),label:`${x.name} (${y(x.rate)})`,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsxs(Q,{children:[e.jsx(Be,{strong:!0,children:x.name}),e.jsx(he,{color:"blue",children:x.type})]}),e.jsx(Be,{style:{color:"#1890ff"},children:y(x.rate)})]}),e.jsx("div",{children:e.jsx(Be,{type:"secondary",children:x.description})})]},C(x)))})}),P.length>0&&e.jsxs("div",{style:{marginTop:16},children:[e.jsx(Ee,{orientation:"left",children:"Selected Amenities"}),e.jsx(Oe,{dataSource:P,columns:d,pagination:!1,size:"small"})]})]}):e.jsx(Re,{image:e.jsx(gs,{style:{fontSize:60,color:"#cccccc"}}),description:"No additional amenities are available for this exhibition."})}),e.jsx(E.Item,{name:"amenities",hidden:!0,children:e.jsx(Z,{type:"hidden"})}),e.jsx(E.Item,{name:"selectedStalls",hidden:!0,children:e.jsx(Z,{type:"hidden"})})]})},{Title:Kt,Paragraph:Ss,Text:oe}=je,ks=({form:t,stallDetails:s=[],selectedStallId:i,selectedStallIds:n=[],selectedStalls:a=[],exhibition:o,onPrev:r,onFinish:h,loading:f=!1,formValues:c={}})=>{const[I,m]=p.useState([]),j=p.useMemo(()=>{const d=(t.getFieldValue("selectedStalls")||[]).map(S=>String(S));if(console.log("ReviewStep - Form has selectedStalls:",d),console.log("ReviewStep - Props selectedStallIds:",n),console.log("ReviewStep - Props selectedStalls:",a),d.length>0)return d;const x=[];if(i){const S=String(i);x.push(S)}return n&&n.length&&n.forEach(S=>{const u=String(S);x.includes(u)||x.push(u)}),a&&a.length&&a.forEach(S=>{const u=String(S);x.includes(u)||x.push(u)}),console.log("ReviewStep - Final consolidated stall IDs:",x),x},[t,i,n,a]);p.useEffect(()=>{if(console.log("ReviewStep - Processing stall details with IDs:",j),console.log("ReviewStep - Available stall details:",s),s&&s.length&&j.length){const g=s.filter(x=>j.includes(String(x.id)));console.log("ReviewStep - Matched stalls:",g.length);const d=g.map(x=>({key:x.id,id:x.id,number:x.number||x.stallNumber||`Stall ${x.id}`,hallName:x.hallName||`Hall ${x.hallId}`,size:`${x.dimensions.width}m × ${x.dimensions.height}m`,area:x.dimensions.width*x.dimensions.height,rate:x.ratePerSqm,price:x.price||x.ratePerSqm*x.dimensions.width*x.dimensions.height,type:x.typeName||x.type||"Standard"}));m(d)}},[s,j]);const k=p.useMemo(()=>{var X,D,B,Y;const g=I.reduce((M,z)=>M+z.price,0),d=I.reduce((M,z)=>M+(z.area||0),0),x=((X=o==null?void 0:o.basicAmenities)==null?void 0:X.map(M=>{const z=Math.floor(d/M.perSqm)*M.quantity;return{...M,calculatedQuantity:z>0?z:0}}))||[],S=t.getFieldValue("amenities")||[];console.log("ReviewStep - Selected amenities with quantities:",S);let u=0;const A=S.map(M=>{var ee;const z=M.id,W=M.quantity||1,U=(ee=o==null?void 0:o.amenities)==null?void 0:ee.find(se=>se.id===z||se._id===z);if(U){const se=(U.rate||0)*W;return u+=se,{name:U.name,rate:U.rate,type:U.type,description:U.description,quantity:W,total:se}}return null}).filter(Boolean);console.log("ReviewStep - Processed amenity items:",A);const R=(((D=o==null?void 0:o.publicDiscountConfig)==null?void 0:D.filter(M=>M.isActive))||[]).map(M=>{const z=M.type==="percentage"?g*(Math.min(Math.max(0,M.value),100)/100):Math.min(M.value,g);return{name:M.name,type:M.type,value:M.value,amount:z}}),H=R.reduce((M,z)=>M+z.amount,0),V=g-H,b=V,N=((Y=(B=o==null?void 0:o.taxConfig)==null?void 0:B.filter(M=>M.isActive))==null?void 0:Y.map(M=>({name:M.name,rate:M.rate,amount:b*(M.rate/100)})))||[],$=N.reduce((M,z)=>M+z.amount,0);return{baseAmount:g,basicAmenities:x,totalStallArea:d,amenities:A,amenitiesTotal:u,discounts:R,totalDiscountAmount:H,amountAfterDiscount:V,subtotal:b,taxes:N,totalTaxAmount:$,total:b+$,stallCount:I.length}},[I,t,o]);p.useEffect(()=>{var d;const g=((d=o==null?void 0:o.publicDiscountConfig)==null?void 0:d.filter(x=>x.isActive))||[];if(g.length>0){const x=g[0];console.log("Setting discountId in form to:",x),t.setFieldsValue({discountId:{name:x.name,type:x.type,value:x.value}})}},[o,t]);const v=[{title:"Stall Number",dataIndex:"number",key:"number"},{title:"Hall",dataIndex:"hallName",key:"hallName"},{title:"Stall Type",dataIndex:"type",key:"type",render:(g,d)=>e.jsx(he,{color:"purple",children:g},`stall-type-${d.key}`)},{title:"Size",dataIndex:"size",key:"size"},{title:"Area",dataIndex:"area",key:"area",render:(g,d)=>e.jsxs("span",{children:[g," sqm"]},`stall-area-${d.key}`)},{title:"Rate",dataIndex:"rate",key:"rate",render:(g,d)=>e.jsxs("span",{children:["₹",g,"/sqm"]},`stall-rate-${d.key}`)},{title:"Price",dataIndex:"price",key:"price",render:(g,d)=>e.jsxs("span",{children:["₹",g.toLocaleString()]},`stall-price-${d.key}`)}],l=g=>`₹${g.toLocaleString("en-IN")}`,C=c.customerName||t.getFieldValue("customerName"),w=c.customerPhone||t.getFieldValue("customerPhone"),y=c.email||t.getFieldValue("email"),P=c.companyName||t.getFieldValue("companyName");return console.log("ReviewStep - Exhibitor Info:",{customerName:C,companyName:P,customerPhone:w,customerEmail:y,formValues:c,formFieldValues:{customerName:t.getFieldValue("customerName"),companyName:t.getFieldValue("companyName"),customerPhone:t.getFieldValue("customerPhone"),email:t.getFieldValue("email")}}),f?e.jsx(yt,{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"300px"},children:e.jsx(st,{size:"large",tip:"Processing your booking..."})}):j.length===0?e.jsxs(yt,{children:[e.jsx(ls,{message:"No Stalls Selected",description:"Please go back and select at least one stall to book.",type:"warning",showIcon:!0}),e.jsx("div",{style:{marginTop:24,textAlign:"right"},children:e.jsx(_,{onClick:r,children:"Back to Stall Selection"})})]}):e.jsxs(yt,{children:[e.jsx(E.Item,{name:"discountId",hidden:!0,children:e.jsx(Z,{})}),e.jsx(Kt,{level:4,children:"Booking Summary"}),e.jsx(Ss,{type:"secondary",style:{marginBottom:24},children:"Please review your booking details before submitting."}),e.jsx(q,{title:"Exhibitor Information",style:{marginBottom:24},children:e.jsxs(dt,{column:2,children:[e.jsx(dt.Item,{label:"Name",children:C||"Not provided"}),e.jsx(dt.Item,{label:"Company",children:P||"Not provided"}),e.jsx(dt.Item,{label:"Phone",children:w||"Not provided"}),e.jsx(dt.Item,{label:"Email",children:y||"Not provided"})]})}),e.jsxs(q,{title:"Selected Stalls",className:"review-card",size:"small",children:[e.jsx(Oe,{dataSource:I,columns:v,pagination:!1,size:"small",style:{marginBottom:16}}),e.jsxs(oe,{strong:!0,children:["Total Base Amount: ",l(k.baseAmount)]})]}),k.basicAmenities&&k.basicAmenities.length>0&&e.jsxs(q,{title:e.jsxs(Q,{children:[e.jsx(ct,{status:"success"}),"Included Basic Amenities"]}),style:{marginBottom:24},children:[e.jsxs(Ss,{type:"secondary",style:{marginBottom:16},children:["The following amenities are included based on your total stall area of ",k.totalStallArea," sqm."]}),e.jsx(Oe,{dataSource:k.basicAmenities.filter(g=>g.calculatedQuantity>0).map((g,d)=>({...g,key:`basic-${d}`})),columns:[{title:"Name",dataIndex:"name",key:"name",render:(g,d)=>e.jsxs(Q,{children:[e.jsx(oe,{strong:!0,children:g}),e.jsx(he,{color:"blue",children:d.type})]},`name-${d.key}`)},{title:"Quantity",dataIndex:"calculatedQuantity",key:"calculatedQuantity",width:120,render:(g,d)=>e.jsxs(he,{color:"green",children:[g," ",g===1?"unit":"units"]},`quantity-${d.key}`)},{title:"Allocation",dataIndex:"perSqm",key:"perSqm",width:180,render:(g,d)=>e.jsxs(oe,{type:"secondary",children:[e.jsx(Qe,{style:{marginRight:5}}),"1 ",d.quantity>1?`set of ${d.quantity}`:"unit"," per ",g," sqm"]},`allocation-${d.key}`)},{title:"Status",key:"status",width:100,align:"right",render:(g,d)=>e.jsx(oe,{type:"success",children:"Included"},`status-${d.key}`)}],pagination:!1,size:"small",locale:{emptyText:e.jsx(ls,{message:"No basic amenities",description:"Your stall area is too small to qualify for any basic amenities.",type:"info",showIcon:!0})}})]}),k.amenities&&k.amenities.length>0&&e.jsxs(q,{title:"Selected Amenities",style:{marginBottom:24},children:[e.jsx(Oe,{dataSource:k.amenities.map((g,d)=>({...g,key:d})),columns:[{title:"Name",dataIndex:"name",key:"name",render:(g,d)=>e.jsxs(Q,{children:[e.jsx(oe,{strong:!0,children:g}),e.jsx(he,{color:"blue",children:d.type})]},`amenity-name-${d.key}`)},{title:"Description",dataIndex:"description",key:"description",render:(g,d)=>e.jsx(oe,{type:"secondary",style:{fontSize:"13px"},children:g||"No description provided"},`amenity-desc-${d.key}`)},{title:"Rate",dataIndex:"rate",key:"rate",width:110,align:"right",render:(g,d)=>e.jsx(oe,{strong:!0,style:{color:"#1890ff"},children:l(g)},`amenity-rate-${d.key}`)},{title:"Quantity",dataIndex:"quantity",key:"quantity",width:90,align:"center",render:(g,d)=>e.jsx(he,{color:"green",children:g},`amenity-qty-${d.key}`)},{title:"Total",dataIndex:"total",key:"total",width:110,align:"right",render:(g,d)=>e.jsx(oe,{strong:!0,style:{color:"#1890ff"},children:l(g)},`amenity-total-${d.key}`)}],pagination:!1,size:"small"}),e.jsx(Ee,{}),e.jsx("div",{style:{textAlign:"right"},children:e.jsxs(oe,{strong:!0,children:["Amenities Total: ",l(k.amenitiesTotal)]})})]}),e.jsxs(q,{title:"Price Calculation",style:{marginBottom:24},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(oe,{children:"Base Amount:"}),e.jsx(oe,{children:l(k.baseAmount)})]}),k.discounts.length>0&&e.jsxs(e.Fragment,{children:[k.discounts.map((g,d)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsxs(oe,{children:[g.name," (",g.type==="percentage"?`${g.value}%`:l(g.value),"):"]}),e.jsxs(oe,{type:"danger",children:["- ",l(g.amount)]})]},d)),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(oe,{children:"Amount after Discount:"}),e.jsx(oe,{children:l(k.amountAfterDiscount)})]})]}),k.amenitiesTotal>0&&e.jsxs("div",{style:{background:"#f9f9f9",padding:"8px",borderRadius:"4px",marginBottom:"8px",border:"1px dashed #d9d9d9"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4},children:[e.jsx(oe,{type:"secondary",children:"Selected Amenities (for information only):"}),e.jsx(oe,{type:"secondary",children:l(k.amenitiesTotal)})]}),e.jsx(oe,{type:"secondary",style:{fontSize:"12px",fontStyle:"italic"},children:"Note: Amenities are not included in the total calculation"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsx(oe,{strong:!0,children:"Subtotal:"}),e.jsx(oe,{strong:!0,children:l(k.subtotal)})]}),k.taxes.length>0&&e.jsx(e.Fragment,{children:k.taxes.map((g,d)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8},children:[e.jsxs(oe,{children:[g.name," (",g.rate,"%):"]}),e.jsx(oe,{children:l(g.amount)})]},d))}),e.jsx(Ee,{}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(Kt,{level:5,children:"Total:"}),e.jsx(Kt,{level:5,children:l(k.total)})]})]})]})},{confirm:li}=Ie,di=({visible:t,stallDetails:s,selectedStallId:i,selectedStallIds:n,loading:a,exhibition:o,onCancel:r,onSubmit:h})=>{const[f]=E.useForm(),[c,I]=p.useState(0),[m]=p.useState(3),[j,k]=p.useState({}),[v,l]=p.useState(!1),[C,w]=p.useState(!1),y=be(R=>R.exhibitorAuth.exhibitor);p.useEffect(()=>{if(t){I(0),l(!1),k({}),f.resetFields();const R=n.map(b=>String(b));i&&R.push(String(i));const H=[...new Set(R)],V={selectedStalls:H,exhibitionId:o==null?void 0:o._id};y&&(V.customerName=y.contactPerson||"",V.companyName=y.companyName||"",V.email=y.email||"",V.customerPhone=y.phone||""),f.setFieldsValue(V),k(V),console.log("Booking form initialized with stalls:",H),console.log("Exhibitor profile data:",y)}},[t,f,i,n,o,y]);const P=()=>{l(!0)},g=()=>{v?li({title:"Discard changes?",icon:e.jsx(An,{}),content:"You have unsaved changes. Are you sure you want to close this form?",onOk(){r()}}):r()},d=()=>{w(!0),f.validateFields().then(R=>{const H={...j,...R},V={customerName:f.getFieldValue("customerName"),companyName:f.getFieldValue("companyName"),email:f.getFieldValue("email"),customerPhone:f.getFieldValue("customerPhone")},b={...H,...V};k(b),console.log("Step completed, saving form values:",b),console.log("Selected stalls are:",b.selectedStalls||[]),console.log("Exhibitor info:",V),I(c+1),w(!1)}).catch(R=>{w(!1),console.error("Form validation failed:",R),ce.error("Please complete all required fields")})},x=()=>{I(c-1)},S=()=>{f.validateFields().then(R=>{const H={customerName:f.getFieldValue("customerName"),companyName:f.getFieldValue("companyName"),email:f.getFieldValue("email"),customerPhone:f.getFieldValue("customerPhone")},V=f.getFieldValue("selectedStalls")||[],b=f.getFieldValue("amenities")||[],$=s.filter(Y=>V.includes(String(Y.id))).reduce((Y,M)=>Y+M.dimensions.width*M.dimensions.height,0);let X=[];o!=null&&o.basicAmenities&&o.basicAmenities.length>0&&(X=o.basicAmenities.filter(Y=>Math.floor($/Y.perSqm)*Y.quantity>0).map(Y=>{const M=Math.floor($/Y.perSqm)*Y.quantity;return{name:Y.name,type:Y.type,perSqm:Y.perSqm,quantity:Y.quantity,calculatedQuantity:M,description:Y.description||""}}));let D=[];b&&b.length>0&&(D=b.map(Y=>{var z;const M=(z=o==null?void 0:o.amenities)==null?void 0:z.find(W=>String(W._id||W.id)===String(Y.id));return M?{id:String(M._id||M.id),name:M.name,type:M.type,rate:M.rate,quantity:Y.quantity||1,description:M.description||""}:null}).filter(Boolean));const B={...j,...R,...H,basicAmenities:X,extraAmenities:D};console.log("Submitting booking with values:",B),console.log("Basic amenities:",X),console.log("Extra amenities:",D),h(B)}).catch(R=>{console.error("Form validation failed:",R),ce.error("Please complete all required fields")})},u=["Stall Details","Amenities","Review"],A=[{title:"Stall Details",icon:e.jsx(Dn,{}),content:e.jsx(js,{form:f,stallDetails:s,selectedStallId:i,selectedStallIds:n,exhibition:o})},{title:"Amenities",icon:e.jsx(It,{}),content:e.jsx(vs,{form:f,stallDetails:s,selectedStallIds:f.getFieldValue("selectedStalls")||[],exhibition:o,formValues:j})},{title:"Review",icon:e.jsx(bt,{}),content:e.jsx(ks,{form:f,formValues:j,loading:a,exhibition:o,selectedStalls:f.getFieldValue("selectedStalls")||[],selectedStallIds:f.getFieldValue("selectedStalls")||[],stallDetails:s})}];p.useEffect(()=>{const R=f.getFieldValue("selectedStalls");console.log(`Step ${c} - Form has selectedStalls:`,R)},[c,f]);const L=R=>{const H=f.getFieldValue("selectedStalls")||[],V={customerName:f.getFieldValue("customerName"),companyName:f.getFieldValue("companyName"),email:f.getFieldValue("email"),customerPhone:f.getFieldValue("customerPhone")},b={...j,...V};switch(console.log(`Rendering step ${R} with:`,{selectedStalls:H,exhibitorInfo:V}),R){case 0:return e.jsx(js,{form:f,stallDetails:s,selectedStallId:i,selectedStallIds:n,exhibition:o});case 1:return e.jsx(vs,{form:f,stallDetails:s,selectedStallIds:H,exhibition:o,formValues:b});case 2:return e.jsx(ks,{form:f,formValues:b,loading:a,exhibition:o,selectedStalls:H,selectedStallIds:H,stallDetails:s,onPrev:x,onFinish:S});default:return null}};return e.jsx(ti,{title:`Book Exhibition Stall - ${u[c]}`,open:t,onCancel:g,footer:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 24px"},children:[c>0&&e.jsx(Qt,{onClick:x,disabled:C||a,size:"large",children:"Back"}),e.jsx("div",{children:c<m-1?e.jsx(Qt,{type:"primary",onClick:d,loading:C,disabled:a,size:"large",children:"Next"}):e.jsx(Qt,{type:"primary",onClick:S,loading:a,disabled:C,size:"large",children:"Submit Booking"})})]}),width:900,destroyOnClose:!0,maskClosable:!1,className:"booking-modal",children:e.jsxs(st,{spinning:a||C,tip:a?"Processing your booking...":"Validating...",children:[e.jsx(si,{children:A.map((R,H)=>e.jsxs("div",{className:`step-item ${c===H?"active":""} ${c>H?"completed":""}`,onClick:()=>c>H?I(H):null,style:{cursor:c>H?"pointer":"default"},children:[e.jsx("span",{className:"step-icon",children:c>H?e.jsx(Rn,{}):H+1}),R.title]},H))}),e.jsx(E,{form:f,layout:"vertical",preserve:!0,onFieldsChange:P,children:L(c)},`form-step-${c}`)]})})},{Content:Dt}=ve,{Title:ta}=je,ci=t=>{if(!t)return"";if(t.startsWith("http"))return t;const s=t.startsWith("/")?t.substring(1):t;if(s.includes("logos/"))return`${Se.defaults.baseURL}/public/images/${s}`;const i=localStorage.getItem("token"),n=`uploads/${s}`;return i?`${Se.defaults.baseURL}/${n}?token=${i}`:`${Se.defaults.baseURL}/${n}`},hi=()=>{var D,B,Y,M;const{id:t}=We(),s=me(),i=Le(),[n,a]=p.useState(null),[o,r]=p.useState(null),[h,f]=p.useState(null),[c,I]=p.useState([]),[m,j]=p.useState(!1),[k,v]=p.useState(!0),[l,C]=p.useState(null),[w,y]=p.useState(!1),[P,g]=p.useState(null),d=p.useRef(null),[x,S]=p.useState({width:800,height:600}),[u,A]=p.useState(!1),[L]=E.useForm(),{isAuthenticated:R}=be(z=>z.exhibitorAuth);p.useEffect(()=>{const z=()=>{A(window.innerWidth<768)};return z(),window.addEventListener("resize",z),()=>{window.removeEventListener("resize",z)}},[]);const H=p.useCallback(z=>z.status==="booked"||z.status==="reserved",[]),V=p.useCallback(()=>{if(d.current){const{clientWidth:z,clientHeight:W}=d.current,U=u?320:800,ee=u?480:600,se=Math.max(z||U,U),ue=Math.max(W||ee,ee);(Math.abs(se-x.width)>5||Math.abs(ue-x.height)>5)&&S({width:se,height:ue})}},[x.width,x.height,u]);p.useEffect(()=>{let z=null;const W=()=>{z===null&&(z=window.setTimeout(()=>{z=null,V()},u?100:50))};V();const U=new ResizeObserver(W);return d.current&&U.observe(d.current),window.addEventListener("resize",W),()=>{z!==null&&window.clearTimeout(z),U.disconnect(),window.removeEventListener("resize",W)}},[V,u]),p.useEffect(()=>{(async()=>{try{if(!t){C("Exhibition ID is missing"),v(!1);return}v(!0),C(null);const W=await et.getLayout(t);a(W.data)}catch(W){C(W.message||"Failed to fetch layout"),console.error("Error fetching exhibition:",W)}finally{v(!1)}})()},[t]),p.useEffect(()=>{n&&V()},[n]),p.useEffect(()=>{R&&n&&(f(null),I([]),V(),ce.info("You can now select stalls to book.",3))},[R]);const b=p.useCallback(async z=>{if(H(z)){ce.info(`This stall (${z.stallNumber}) is already booked.`);return}if(!R){i(Hn("stall-booking"));return}const U=z._id||z.id;I(ee=>ee.includes(U)?(ce.info(`Stall ${z.stallNumber} removed from selection`),ee.filter(se=>se!==U)):(ce.success(`Stall ${z.stallNumber} added to selection`),[...ee,U]))},[H,R,i]),N=async z=>{try{y(!0);const W={...z,exhibitionId:n==null?void 0:n.exhibition._id,stallIds:z.selectedStalls};if(R){const U=await et.exhibitorBookStalls(W);ce.success("Your booking request has been submitted successfully! It is pending review by the admin.")}else{const U=await et.bookMultipleStalls(t,W);ce.success("Your booking request has been submitted successfully!")}if(j(!1),I([]),t)try{const U=await et.getLayout(t);a(U.data)}catch(U){console.error("Error refreshing layout data:",U)}}catch(W){console.error("Error booking stall",W),ce.error("Failed to book stall. Please try again.")}finally{y(!1)}},$=async()=>{var z;try{if(!n)return;y(!0);let W=null;if(h){const ee=n.layout.find(se=>se.stalls.some(ue=>ue.id===h));ee?W=ee.stalls.find(se=>se.id===h)||null:console.error("Selected stall not found in any hall")}const U=n.layout.flatMap(ee=>ee.stalls.map(se=>({...se,hallId:ee.id,hallName:ee.name}))).filter(ee=>ee.status==="available");if(c.length===0&&h===null&&U.length===0){ce.error("No stalls are available for booking");return}if(!n.exhibition.basicAmenities)try{const ee=await et.getExhibition(t||"");(z=ee==null?void 0:ee.data)!=null&&z.basicAmenities&&a({...n,exhibition:{...n.exhibition,basicAmenities:ee.data.basicAmenities}})}catch(ee){console.error("Error fetching exhibition details with amenities:",ee)}g(U),j(!0)}catch(W){console.error("Error opening booking modal:",W),ce.error("Failed to open booking form")}finally{y(!1)}};p.useCallback(z=>{z.cancelBubble=!0},[]);const X=p.useMemo(()=>{var z;return n?{halls:n.layout.map(W=>e.jsx(qs,{hall:{...W,exhibitionId:t||""},isSelected:!1,onSelect:()=>{},isStallMode:!0},W.id)),stalls:n.layout.flatMap(W=>W.stalls.map(U=>{var ee,se,ue,it,$e,at,ot,rt;return e.jsx(hs,{stall:{...U,hallId:W.id,hallName:W.name,isSelected:c.includes(U.id),stallTypeId:"default",number:U.stallNumber,typeName:U.type||"Standard",ratePerSqm:U.price||0,rotation:0,dimensions:{x:((ee=U.position)==null?void 0:ee.x)||0,y:((se=U.position)==null?void 0:se.y)||0,width:((ue=U.dimensions)==null?void 0:ue.width)||0,height:((it=U.dimensions)==null?void 0:it.height)||0},status:U.status==="maintenance"?"booked":U.status},isSelected:h===U.id||c.includes(U.id),onSelect:U.status==="available"?()=>b(U):void 0,hallWidth:(($e=W.dimensions)==null?void 0:$e.width)||0,hallHeight:((at=W.dimensions)==null?void 0:at.height)||0,hallX:((ot=W.dimensions)==null?void 0:ot.x)||0,hallY:((rt=W.dimensions)==null?void 0:rt.y)||0},U.id)})),fixtures:(z=n.fixtures)==null?void 0:z.map(W=>{var U,ee;return e.jsx(Hs,{fixture:{...W,id:W.id||W._id,_id:W._id||W.id,exhibitionId:t||"",isActive:!0,zIndex:5},scale:1,position:{x:0,y:0},exhibitionWidth:((U=n.exhibition.dimensions)==null?void 0:U.width)||0,exhibitionHeight:((ee=n.exhibition.dimensions)==null?void 0:ee.height)||0},W.id||W._id)})}:null},[n,t,h,c,b]);return k?e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(Dt,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(st,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibition layout..."})]})})]}):l||!n?e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(Dt,{style:{paddingTop:"64px"},children:e.jsx(_t,{status:"error",title:"Failed to load exhibition layout",subTitle:l||"The exhibition layout couldn't be loaded.",extra:[e.jsx(_,{type:"primary",onClick:()=>s("/exhibitions"),children:"Back to Exhibitions"},"back")]})})]}):!((D=n.exhibition.dimensions)!=null&&D.width)||!((B=n.exhibition.dimensions)!=null&&B.height)?e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(Dt,{style:{paddingTop:"64px"},children:e.jsx(q,{children:e.jsx(_t,{status:"error",title:"Invalid Exhibition Layout",subTitle:"Exhibition dimensions are not properly configured"})})})]}):e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsxs(Dt,{style:{paddingTop:"64px",background:"#f7f8fa"},children:[u&&e.jsx("div",{style:{height:"16px",width:"100%"}}),e.jsxs(q,{className:"exhibition-card",style:{borderRadius:"8px",overflow:"hidden",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.08)",margin:u?"40px 0px 10px 0px":"10px 0px",border:"none"},bodyStyle:{padding:u?"5px":"24px"},children:[e.jsxs(ie,{gutter:[24,24],style:{marginBottom:u?16:32},children:[e.jsx(F,{xs:24,sm:24,md:12,children:e.jsxs("div",{style:{padding:u?"12px":"16px",background:"linear-gradient(145deg, #ffffff, #f8faff)",borderRadius:"8px",border:"1px solid rgba(230, 235, 245, 0.8)",height:"100%",display:"flex",flexDirection:u?"column":"row",alignItems:u?"flex-start":"center",gap:u?"12px":"16px",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.03)"},children:[e.jsx("div",{style:{flexShrink:0,display:"flex",justifyContent:u?"center":"flex-start",width:u?"100%":"auto"},children:n.exhibition.headerLogo?e.jsx($s,{src:ci(n.exhibition.headerLogo),alt:`${n.exhibition.name} logo`,style:{maxHeight:u?70:90,maxWidth:u?200:250,objectFit:"contain"},preview:!1,fallback:"/exhibition-placeholder.jpg",placeholder:e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:u?200:250,height:u?70:90,backgroundColor:"#f5f5f5",borderRadius:"8px"},children:e.jsx(st,{size:"small"})})}):e.jsx("div",{style:{width:u?70:90,height:u?70:90,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg, #f0f0f0, #e6e6e6)",borderRadius:"8px",boxShadow:"inset 0 2px 4px rgba(0, 0, 0, 0.05)"},children:e.jsx(Ge,{style:{fontSize:u?24:32,color:"#aaa"}})})}),!u&&e.jsx(Ee,{type:"vertical",style:{height:"90px",margin:"0 16px",opacity:.6}}),e.jsxs("div",{style:{flex:1,width:u?"100%":"auto"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:u?"18px":"22px",fontWeight:600,background:"linear-gradient(90deg, #333, #666)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:n.exhibition.name}),e.jsxs("p",{style:{margin:"0 0 8px 0",display:"flex",alignItems:"center",gap:"8px",color:"#555",fontSize:u?"13px":"14px"},children:[e.jsx(Ge,{style:{fontSize:u?"14px":"16px",color:"#1890ff"}}),e.jsxs("span",{children:[new Date(n.exhibition.startDate).toLocaleDateString()," -",new Date(n.exhibition.endDate).toLocaleDateString()]})]}),e.jsxs("p",{style:{margin:0,display:"flex",alignItems:"center",gap:"8px",color:"#555",fontSize:u?"13px":"14px"},children:[e.jsx(Qe,{style:{fontSize:u?"14px":"16px",color:"#1890ff"}}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:u?"nowrap":"normal",maxWidth:u?"260px":"none"},children:n.exhibition.venue})]})]})]})}),e.jsx(F,{xs:24,sm:24,md:12,children:e.jsxs("div",{style:{padding:u?"16px 5px":"24px",background:"linear-gradient(145deg, #ffffff, #f9fbfd)",borderRadius:"8px",border:"1px solid rgba(230, 235, 245, 0.8)",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.03)"},children:[e.jsx("div",{style:{marginBottom:"16px",fontSize:u?"15px":"16px",fontWeight:600,color:"#444",textAlign:"center"},children:"Stall Status:"}),e.jsxs("div",{style:{display:"flex",flexDirection:u?"column":"row",justifyContent:"center",alignItems:"center",gap:u?"10px":"16px",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#f6ffed",border:"1px solid #b7eb8f",width:u?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(ct,{status:"success"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Available"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#e6f7ff",border:"1px solid #91d5ff",width:u?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(ct,{status:"processing",color:"#1890ff"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Reserved"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",borderRadius:"8px",background:"#fff7e6",border:"1px solid #ffd591",width:u?"90%":"30%",boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"},children:[e.jsx(ct,{status:"warning"}),e.jsx("span",{style:{marginLeft:"8px",fontWeight:500},children:"Booked"})]})]})]})})]}),e.jsxs("div",{ref:d,style:{width:"100%",height:u?"70vh":"80vh",minHeight:u?"400px":"600px",background:"#ffffff",borderRadius:"12px",overflow:"hidden",position:"relative",border:"1px solid rgba(230, 235, 245, 0.8)",boxShadow:"inset 0 2px 6px rgba(0, 0, 0, 0.03)",willChange:"transform",contain:"content",isolation:"isolate"},className:"public-canvas-container",children:[e.jsx("style",{children:`
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
              `}),e.jsxs(Tt,{width:x.width,height:x.height,exhibitionWidth:((Y=n==null?void 0:n.exhibition.dimensions)==null?void 0:Y.width)||0,exhibitionHeight:((M=n==null?void 0:n.exhibition.dimensions)==null?void 0:M.height)||0,halls:(n==null?void 0:n.layout)||[],selectedHall:null,onSelectHall:()=>{},isStallMode:!0,onAddHall:()=>{},onAddStall:()=>{},onAddFixture:()=>{},onExhibitionChange:()=>{},isPublicView:!0,children:[X==null?void 0:X.halls,X==null?void 0:X.stalls,X==null?void 0:X.fixtures]})]})]})]}),c.length>0&&e.jsx(gn,{offsetBottom:20,children:e.jsx("div",{style:{position:"fixed",bottom:20,right:20,zIndex:1e3},children:e.jsxs(_,{type:"primary",size:"large",icon:e.jsx(Pn,{}),onClick:$,loading:w,style:{borderRadius:"30px",boxShadow:"0 6px 16px rgba(24, 144, 255, 0.25)",display:"flex",alignItems:"center",gap:"8px",padding:"0 22px",height:"48px",fontSize:"16px",fontWeight:500,background:"linear-gradient(145deg, #1890ff, #40a9ff)",border:"none",transition:"all 0.3s ease"},children:["Book Selected Stalls (",c.length,")"]})})}),e.jsx(di,{visible:m,stallDetails:P,selectedStallId:h,selectedStallIds:c,loading:w,exhibition:n==null?void 0:n.exhibition,onCancel:()=>{j(!1)},onSubmit:N})]})},sa=xe.memo(hi),{Content:Zt}=ve,{Title:Jt,Text:Ze,Paragraph:Cs}=je,es=t=>{if(!t)return"";if(t.startsWith("http"))return t;const s=t.startsWith("/")?t.substring(1):t;if(s.includes("logos/")||s.includes("sponsors/"))return`${Se.defaults.baseURL}/public/images/${s}`;const i=localStorage.getItem("token"),n=`uploads/${s}`;return i?`${Se.defaults.baseURL}/${n}?token=${i}`:`${Se.defaults.baseURL}/${n}`},pi=(t,s)=>{const i=new Date,n=new Date(t),a=new Date(s);return i<n?{status:"Upcoming",color:"#722ED1"}:i>a?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},Rt=t=>{const s={year:"numeric",month:"long",day:"numeric"};return new Date(t).toLocaleDateString(void 0,s)},ui=(t,s)=>{const i=new Date,n=new Date(t),a=new Date(s);if(i<n){const o=n.getTime()-i.getTime(),r=Math.ceil(o/(1e3*60*60*24));return{text:`Day${r!==1?"s":""} until start`,count:r,isPast:!1}}else if(i>a){const o=i.getTime()-a.getTime(),r=Math.ceil(o/(1e3*60*60*24));return{text:`Day${r!==1?"s":""} since end`,count:r,isPast:!0}}else{const o=a.getTime()-i.getTime(),r=Math.ceil(o/(1e3*60*60*24));return{text:`Day${r!==1?"s":""} remaining`,count:r,isPast:!1}}},na=()=>{const{id:t}=We(),s=me(),[i,n]=p.useState(null),[a,o]=p.useState(!0),[r,h]=p.useState(null),[f,c]=p.useState("https://images.unsplash.com/photo-1567419099214-0dd03b43e8de?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");if(p.useEffect(()=>{(async()=>{try{if(!t){h("Exhibition ID is missing");return}o(!0),h(null);const v=await et.getExhibition(t);if(n(v.data),v.data.headerBackground){const l=es(v.data.headerBackground);c(l);const C=new window.Image;C.src=l}else if(v.data.headerLogo){const l=es(v.data.headerLogo),C=new window.Image;C.src=l}}catch(v){console.error("Error fetching exhibition:",v),h(v.message||"Error fetching exhibition")}finally{o(!1)}})()},[t]),a)return e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(Zt,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(st,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibition details..."})]})})]});if(r||!i)return e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(Zt,{style:{paddingTop:"64px"},children:e.jsx(_t,{status:"404",title:"Exhibition not found",subTitle:r||"The exhibition you're looking for doesn't exist or has been removed.",extra:e.jsx(_,{type:"primary",onClick:()=>s("/exhibitions"),children:"Back to Exhibitions"})})})]});const{status:I,color:m}=pi(i.startDate,i.endDate),j=ui(i.startDate,i.endDate);return e.jsxs(ve,{className:"exhibition-details-layout",children:[e.jsx(ze,{}),e.jsxs(Zt,{className:"exhibition-content",children:[e.jsx("div",{className:"breadcrumb-container",children:e.jsx(fn,{items:[{title:e.jsx(ms,{to:"/",children:e.jsx(zn,{})})},{title:e.jsx(ms,{to:"/exhibitions",children:"Exhibitions"})},{title:i.name}]})}),e.jsx("div",{className:"exhibition-hero",style:{backgroundImage:`url('${f}')`},children:e.jsx("div",{className:"hero-overlay",children:e.jsxs("div",{className:"hero-content",children:[e.jsxs("div",{className:"hero-main",children:[e.jsx(Jt,{level:1,className:"exhibition-title",children:i.name}),e.jsxs(Q,{size:24,className:"exhibition-meta",children:[e.jsxs("div",{className:"meta-item",children:[e.jsx(Ge,{}),e.jsxs(Ze,{children:[Rt(i.startDate)," - ",Rt(i.endDate)]})]}),i.venue&&e.jsxs("div",{className:"meta-item",children:[e.jsx(St,{}),e.jsx(Ze,{children:i.venue})]}),e.jsxs("div",{className:"meta-item",children:[e.jsx(pt,{}),e.jsxs(Ze,{children:[j.text,": ",e.jsx("strong",{children:j.count})]})]})]})]}),e.jsxs("div",{className:"hero-actions",children:[e.jsx(_,{type:"primary",size:"large",icon:e.jsx(Ct,{}),onClick:()=>s(`/exhibitions/${t}/layout`),className:"action-button layout-button",children:"View Exhibition Layout"}),e.jsx(_,{size:"large",icon:e.jsx(Et,{}),onClick:()=>s(`/exhibitions/${t}/layout`),className:"action-button book-button",children:"Book a Stall"}),j.isPast?null:e.jsx(_,{size:"large",icon:e.jsx(Fn,{}),onClick:()=>s("/exhibitor/login"),className:"action-button exhibitor-button",children:"Exhibitor Access"})]})]})})}),e.jsx("div",{className:"stats-container",children:e.jsxs(ie,{gutter:[16,16],className:"stats-row",children:[e.jsx(F,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon duration-icon",children:e.jsx(Ge,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value",children:Math.ceil((new Date(i.endDate).getTime()-new Date(i.startDate).getTime())/(1e3*60*60*24))}),e.jsx("div",{className:"stat-label",children:"Days Duration"})]})]})}),e.jsx(F,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon countdown-icon",children:e.jsx(pt,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value",children:j.count}),e.jsx("div",{className:"stat-label",children:j.text})]})]})}),e.jsx(F,{xs:24,sm:8,children:e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon status-icon",style:{backgroundColor:m+"20",color:m},children:e.jsx(Qe,{})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value status-value",style:{color:m},children:I}),e.jsx("div",{className:"stat-label",children:"Status"})]})]})})]})}),i.sponsorLogos&&i.sponsorLogos.length>0&&e.jsxs("div",{className:"sponsors-section",children:[e.jsx("div",{className:"sponsors-header",children:e.jsx(Ze,{type:"secondary",children:"PROUDLY SPONSORED BY"})}),e.jsx("div",{className:"sponsors-container",children:i.sponsorLogos.map((k,v)=>e.jsx("div",{className:"sponsor-logo-wrapper",children:e.jsx("div",{className:"sponsor-logo",children:e.jsx("img",{src:es(k),alt:`Sponsor ${v+1}`,className:"sponsor-logo-img",onError:l=>{l.target.src="/placeholder-logo.png"}})})},v))})]}),e.jsx("div",{className:"exhibition-details-container",children:e.jsxs(ie,{gutter:[24,24],children:[e.jsx(F,{xs:24,lg:16,children:e.jsxs(q,{className:"details-card about-card",bordered:!1,children:[e.jsx(Jt,{level:3,className:"section-title",children:"About This Exhibition"}),e.jsx(Cs,{className:"main-description",children:i.description}),i.headerDescription&&e.jsx(Cs,{className:"extended-description",children:i.headerDescription}),i.headerSubtitle&&e.jsxs("div",{className:"subtitle-section",children:[e.jsx(Jt,{level:4,children:i.headerSubtitle}),e.jsx(Ee,{})]})]})}),e.jsx(F,{xs:24,lg:8,children:e.jsx(Q,{direction:"vertical",style:{width:"100%"},size:24,children:e.jsx(q,{title:"Key Information",className:"details-card info-card",bordered:!1,children:e.jsxs("div",{className:"info-grid",children:[e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon start-icon",children:e.jsx(Ge,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Ze,{type:"secondary",className:"info-label",children:"Start Date"}),e.jsx("div",{className:"info-value",children:Rt(i.startDate)})]})]}),e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon end-icon",children:e.jsx(Ge,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Ze,{type:"secondary",className:"info-label",children:"End Date"}),e.jsx("div",{className:"info-value",children:Rt(i.endDate)})]})]}),i.venue&&e.jsxs("div",{className:"info-item",children:[e.jsx("div",{className:"info-icon venue-icon",children:e.jsx(St,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx(Ze,{type:"secondary",className:"info-label",children:"Venue"}),e.jsx("div",{className:"info-value",children:i.venue})]})]})]})})})})]})})]}),e.jsx("style",{children:`
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
        `})]})},pe=(t,s)=>{if(!t)return"";let n=`/exhibition/${t.slug||t._id||t.id}`;return s&&(n+=`/${s}`),n},ps=(t,s)=>t?`/exhibitions/${t.slug||t._id||t.id}`:"",{Title:Is,Text:ts,Paragraph:Es}=je,{Content:ss}=ve,xi=(t,s)=>{const i=new Date,n=new Date(t),a=new Date(s);return i<n?{status:"Upcoming",color:"#722ED1"}:i>a?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},Ts=t=>{const s={year:"numeric",month:"short",day:"numeric"};return new Date(t).toLocaleDateString(void 0,s)},mi=t=>{const s=new Date,n=new Date(t).getTime()-s.getTime();return Math.ceil(n/(1e3*60*60*24))},Ns=t=>{if(!t)return"/exhibition-placeholder.jpg";if(t.startsWith("/")||t.startsWith("http"))return t;const s=t.startsWith("/")?t.substring(1):t,i=s.includes("logos/")?s:`logos/${s}`;return`${Se.defaults.baseURL}/public/images/${i}`},ia=()=>{const t=me(),[s,i]=p.useState([]),[n,a]=p.useState(!0),[o,r]=p.useState(null),[h,f]=p.useState({});return p.useEffect(()=>{(async()=>{try{a(!0),r(null);const I=await et.getExhibitions();i(I.data);const m={};I.data.forEach(j=>{if(j.headerLogo){const k=Ns(j.headerLogo),v=new window.Image;v.onload=()=>{m[j._id]=!0,f(l=>({...l,[j._id]:!0}))},v.onerror=()=>{console.warn(`Failed to preload image: ${k}`),m[j._id]=!1,f(l=>({...l,[j._id]:!1}))},v.src=k}})}catch(I){r(I.message||"Failed to fetch exhibitions")}finally{a(!1)}})()},[]),n?e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(ss,{style:{paddingTop:"64px"},children:e.jsxs("div",{style:{textAlign:"center",padding:"48px"},children:[e.jsx(st,{size:"large"}),e.jsx("p",{style:{marginTop:16},children:"Loading exhibitions..."})]})})]}):o?e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(ss,{style:{paddingTop:"64px"},children:e.jsx(_t,{status:"error",title:"Failed to load exhibitions",subTitle:o,extra:[e.jsx(_,{type:"primary",onClick:()=>window.location.reload(),children:"Try Again"},"retry")]})})]}):e.jsxs(ve,{children:[e.jsx(ze,{}),e.jsx(ss,{style:{paddingTop:"64px",background:"#f5f5f5"},children:e.jsxs("div",{style:{padding:"80px 16px"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:40},children:[e.jsx(Is,{level:2,style:{marginBottom:12,fontSize:36},children:"Upcoming & Current Exhibitions"}),e.jsx(Es,{type:"secondary",style:{fontSize:16,maxWidth:600,margin:"0 auto"},children:"Discover and explore our exhibitions. Click on any card to view details and book stalls."})]}),s.length>0?e.jsx(ie,{gutter:[24,24],children:s.map(c=>{const{status:I,color:m}=xi(c.startDate,c.endDate),j=mi(c.startDate),k=c.headerLogo?Ns(c.headerLogo):void 0;return e.jsx(F,{xs:24,sm:12,lg:8,children:e.jsxs(q,{hoverable:!0,onClick:()=>t(ps(c)),className:"exhibition-card",styles:{body:{padding:"0",overflow:"hidden",display:"flex",flexDirection:"column"}},style:{borderRadius:"12px",overflow:"hidden",height:"100%",boxShadow:"0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)"},children:[e.jsx(ct.Ribbon,{text:I,color:m,style:{right:"-1px",top:"10px",zIndex:2}}),e.jsxs("div",{className:"exhibition-card-container",children:[e.jsx("div",{className:"exhibition-card-logo-container",children:k&&e.jsx("div",{className:"exhibition-logo",children:e.jsx($s,{src:k,alt:`${c.name} logo`,preview:!1,fallback:"/exhibition-placeholder.jpg",placeholder:e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%",backgroundColor:"#f0f0f0"},children:e.jsx(st,{size:"small"})}),style:{width:"100%",height:"100%",objectFit:"contain"}})})}),e.jsxs("div",{className:"exhibition-card-content",children:[e.jsx("div",{className:"exhibition-title",children:e.jsx(Is,{level:4,ellipsis:{rows:2},style:{marginBottom:8,fontSize:20,lineHeight:"28px"},children:c.name})}),e.jsx(Es,{type:"secondary",ellipsis:{rows:2},style:{marginBottom:16,fontSize:14},children:c.description}),e.jsxs("div",{className:"exhibition-card-details",children:[e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(Ge,{style:{color:"#722ED1"}}),e.jsx(Ve,{title:"Exhibition Date Range",children:e.jsxs(ts,{style:{fontSize:14},children:[Ts(c.startDate)," - ",Ts(c.endDate)]})})]}),c.venue&&e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(St,{style:{color:"#F5222D"}}),e.jsx(Ve,{title:"Venue",children:e.jsx(ts,{style:{fontSize:14},ellipsis:!0,children:c.venue})})]}),I==="Upcoming"&&j>0&&e.jsxs("div",{className:"exhibition-card-detail-item",children:[e.jsx(pt,{style:{color:"#1890FF"}}),e.jsx(Ve,{title:"Time Remaining",children:e.jsxs(ts,{style:{fontSize:14},children:["Starts in ",j," day",j!==1?"s":""]})})]})]}),e.jsx("div",{className:"exhibition-card-footer",children:e.jsxs(_,{type:"link",className:"view-details-btn",style:{padding:0,height:"auto",fontSize:14,fontWeight:500},children:["View Details ",e.jsx(Ln,{})]})})]})]})]})},c._id)})}):e.jsx(Re,{description:"No exhibitions currently available",style:{background:"#fff",padding:"48px",borderRadius:"12px",boxShadow:"0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)"},image:Re.PRESENTED_IMAGE_SIMPLE})]})}),e.jsx(dn,{}),e.jsx("style",{children:`
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
        `})]})},gi={exhibitions:[],currentExhibition:null,halls:[],stalls:[],fixtures:[],loading:!1,error:null},Xe=De("exhibition/fetchExhibitions",async(t,{rejectWithValue:s})=>{try{return(await le.getExhibitions()).data.map(a=>({...a,id:a._id||a.id})).filter(a=>a.id)}catch(i){return s(i.message)}}),Ne=De("exhibition/fetchExhibition",async(t,{rejectWithValue:s})=>{try{if(!t)throw new Error("Exhibition ID is required");return(await le.getExhibition(t)).data}catch(i){return s(i.message)}}),Pt=De("exhibition/createExhibition",async(t,{rejectWithValue:s})=>{try{return(await le.createExhibition(t)).data}catch(i){return s(i.message)}}),zt=De("exhibition/updateExhibition",async({id:t,data:s},{rejectWithValue:i})=>{try{if(!t)throw new Error("Exhibition ID is required");return(await le.updateExhibition(t,s)).data}catch(n){return i(n.message)}}),Fe=De("exhibition/fetchHalls",async(t,{rejectWithValue:s})=>{var i;try{if(!t)throw new Error("Exhibition ID is required");return(await le.getHalls(t)).data}catch(n){return((i=n.response)==null?void 0:i.status)===404?[]:s(n.message)}}),Ue=De("exhibition/fetchStalls",async({exhibitionId:t,hallId:s},{rejectWithValue:i})=>{try{if(!t)throw new Error("Exhibition ID is required");return(await le.getStalls(t,s)).data}catch(n){return i(n.message)}}),jt=De("exhibition/deleteExhibition",async(t,{rejectWithValue:s})=>{try{return await le.deleteExhibition(t),t}catch(i){return s(i.message)}}),wt=De("exhibition/fetchFixtures",async({exhibitionId:t,type:s},{rejectWithValue:i})=>{try{if(!t)throw new Error("Exhibition ID is required");return(await le.getFixtures(t,s)).data}catch(n){return i(n.message)}}),Ft=De("exhibition/createFixture",async({exhibitionId:t,data:s},{rejectWithValue:i})=>{try{if(!t)throw new Error("Exhibition ID is required");return(await le.createFixture(t,s)).data}catch(n){return i(n.message)}}),Lt=De("exhibition/updateFixture",async({exhibitionId:t,id:s,data:i},{rejectWithValue:n})=>{try{if(!t||!s)throw new Error("Exhibition ID and Fixture ID are required");return(await le.updateFixture(t,s,i)).data}catch(a){return n(a.message)}}),$t=De("exhibition/deleteFixture",async({exhibitionId:t,id:s},{rejectWithValue:i})=>{try{if(!t||!s)throw new Error("Exhibition ID and Fixture ID are required");return await le.deleteFixture(t,s),s}catch(n){return i(n.message)}}),Us=ln({name:"exhibition",initialState:gi,reducers:{clearCurrentExhibition:t=>{t.currentExhibition=null,t.halls=[],t.stalls=[],t.fixtures=[],t.error=null},clearError:t=>{t.error=null},clearStalls:t=>{t.stalls=[]},clearFixtures:t=>{t.fixtures=[]}},extraReducers:t=>{t.addCase(Xe.pending,s=>{s.loading=!0,s.error=null}).addCase(Xe.fulfilled,(s,i)=>{s.loading=!1,s.exhibitions=i.payload}).addCase(Xe.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Ne.pending,s=>{s.loading=!0,s.error=null}).addCase(Ne.fulfilled,(s,i)=>{s.loading=!1,s.currentExhibition=i.payload}).addCase(Ne.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Pt.pending,s=>{s.loading=!0,s.error=null}).addCase(Pt.fulfilled,(s,i)=>{s.loading=!1,s.exhibitions.push(i.payload)}).addCase(Pt.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(zt.pending,s=>{s.loading=!0,s.error=null}).addCase(zt.fulfilled,(s,i)=>{s.loading=!1,s.currentExhibition=i.payload;const n=s.exhibitions.findIndex(a=>a.id===i.payload.id);n!==-1&&(s.exhibitions[n]=i.payload)}).addCase(zt.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Fe.pending,s=>{s.loading=!0,s.error=null}).addCase(Fe.fulfilled,(s,i)=>{s.loading=!1,s.halls=i.payload}).addCase(Fe.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Ue.pending,s=>{s.loading=!0,s.error=null}).addCase(Ue.fulfilled,(s,i)=>{s.loading=!1;const n=i.payload.map(a=>{var o;return{...a,id:a._id||a.id,_id:a._id||a.id,stallTypeId:typeof a.stallTypeId=="string"?a.stallTypeId:(o=a.stallTypeId)==null?void 0:o._id,stallType:a.stallType||{name:"N/A",description:null}}});i.meta.arg.hallId,s.stalls=n}).addCase(Ue.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(jt.pending,s=>{s.loading=!0,s.error=null}).addCase(jt.fulfilled,(s,i)=>{s.loading=!1,s.exhibitions=s.exhibitions.filter(n=>(n._id||n.id)!==i.payload)}).addCase(jt.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(wt.pending,s=>{s.loading=!0,s.error=null}).addCase(wt.fulfilled,(s,i)=>{s.loading=!1,s.fixtures=i.payload.map(n=>({...n,id:n._id||n.id,_id:n._id||n.id}))}).addCase(wt.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Ft.pending,s=>{s.loading=!0,s.error=null}).addCase(Ft.fulfilled,(s,i)=>{s.loading=!1;const n={...i.payload,id:i.payload._id||i.payload.id,_id:i.payload._id||i.payload.id};s.fixtures.push(n)}).addCase(Ft.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase(Lt.pending,s=>{s.loading=!0,s.error=null}).addCase(Lt.fulfilled,(s,i)=>{s.loading=!1;const n={...i.payload,id:i.payload._id||i.payload.id,_id:i.payload._id||i.payload.id},a=s.fixtures.findIndex(o=>o.id===n.id||o._id===n._id);a!==-1&&(s.fixtures[a]=n)}).addCase(Lt.rejected,(s,i)=>{s.loading=!1,s.error=i.payload}).addCase($t.pending,s=>{s.loading=!0,s.error=null}).addCase($t.fulfilled,(s,i)=>{s.loading=!1,s.fixtures=s.fixtures.filter(n=>n.id!==i.payload&&n._id!==i.payload)}).addCase($t.rejected,(s,i)=>{s.loading=!1,s.error=i.payload})}}),{clearCurrentExhibition:aa,clearError:oa,clearStalls:ra,clearFixtures:la}=Us.actions,da=Us.reducer,{Title:fi,Text:Je}=je,{RangePicker:bi}=Ms,yi=()=>{const{message:t,modal:s}=nt.useApp(),i=me(),n=Le(),{exhibitions:a,loading:o}=be(b=>b.exhibition),[r,h]=p.useState([]),[f,c]=p.useState(!1),[I,m]=p.useState(!1),[j,k]=p.useState({status:[],dateRange:null,search:"",activeStatus:null}),[v,l]=p.useState("all"),{hasPermission:C}=hn();p.useEffect(()=>{n(Xe())},[n]);const w=p.useMemo(()=>{const b=a.length,N=a.filter(B=>B.status==="published").length,$=a.filter(B=>new Date(B.startDate)>new Date).length,X=a.filter(B=>B.status==="completed").length,D=a.filter(B=>B.isActive).length;return{total:b,active:N,upcoming:$,completed:X,activeCount:D}},[a]),y=async b=>{const N=b._id||b.id;try{c(!0),await n(jt(N)).unwrap(),t.success("Exhibition deleted successfully")}catch($){t.error($.message||"Failed to delete exhibition")}finally{c(!1)}},P=async()=>{s.confirm({title:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",color:"#101828",padding:"20px 24px",borderBottom:"1px solid #EAECF0"},children:[e.jsx(He,{style:{color:"#F04438",fontSize:"22px"}}),e.jsx("span",{style:{fontSize:"18px",fontWeight:600,lineHeight:"28px"},children:"Delete Selected Exhibitions"})]}),content:e.jsxs("div",{style:{padding:"20px 24px",color:"#475467"},children:[e.jsxs("p",{style:{fontSize:"14px",lineHeight:"20px",marginBottom:"8px"},children:["Are you sure you want to delete ",e.jsxs("strong",{children:[r.length," selected exhibitions"]}),"?"]}),e.jsx("p",{style:{color:"#667085",fontSize:"14px",lineHeight:"20px",marginBottom:0},children:"This action cannot be undone and will permanently delete all associated data for these exhibitions."})]}),footer:e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",padding:"20px 24px",borderTop:"1px solid #EAECF0",marginTop:0},children:[e.jsx(_,{onClick:()=>Ie.destroyAll(),style:{height:"40px",padding:"10px 18px",borderRadius:"8px",border:"1px solid #D0D5DD",color:"#344054",fontWeight:500,fontSize:"14px",lineHeight:"20px",display:"flex",alignItems:"center",boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)"},children:"Cancel"}),e.jsx(_,{danger:!0,type:"primary",onClick:async()=>{try{c(!0),await Promise.all(r.map(b=>n(jt(b._id||b.id)).unwrap())),t.success(`Successfully deleted ${r.length} exhibitions`),h([])}catch(b){t.error(b.message||"Failed to delete some exhibitions")}finally{c(!1),Ie.destroyAll()}},style:{height:"40px",padding:"10px 18px",borderRadius:"8px",border:"none",backgroundColor:"#D92D20",color:"white",fontWeight:500,fontSize:"14px",lineHeight:"20px",display:"flex",alignItems:"center",boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)"},children:"Delete All"})]}),centered:!0,icon:null,width:400,closable:!0,maskClosable:!0,className:"delete-confirmation-modal",styles:{mask:{backgroundColor:"rgba(52, 64, 84, 0.7)"},content:{padding:0,borderRadius:"12px",boxShadow:"0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.1)"},body:{padding:0},footer:{display:"none"}}})},g=async(b,N)=>{try{m(!0);const $=b._id||b.id;await le.updateExhibition($,{status:N});const X=a.map(D=>(D._id||D.id)===$?{...D,status:N}:D);n(Xe.fulfilled(X,"",void 0)),t.success("Status updated successfully")}catch{t.error("Failed to update status"),n(Xe())}finally{m(!1)}},d=async(b,N)=>{try{m(!0);const $=b._id||b.id;await le.updateExhibition($,{isActive:N});const X=a.map(D=>(D._id||D.id)===$?{...D,isActive:N}:D);n(Xe.fulfilled(X,"",void 0)),t.success(`Exhibition ${N?"activated":"deactivated"} successfully`)}catch{t.error("Failed to update active status"),n(Xe())}finally{m(!1)}},x=(b,N)=>{const $=b._id||b.id;N==="/layout"?i(pe(b,"layout"),{state:{exhibitionId:$}}):i(pe(b)+N,{state:{exhibitionId:$}})},S=b=>{switch(b.toLowerCase()){case"published":return"#52c41a";case"draft":return"#faad14";case"completed":return"#1890ff";default:return"#d9d9d9"}},u=(b,N)=>{const $=S(b);return e.jsxs(Q,{size:4,style:{display:"inline-flex",alignItems:"center"},children:[e.jsx(he,{color:$,style:{textTransform:"capitalize",minWidth:"80px",textAlign:"center",margin:0},children:b}),!N&&e.jsx(he,{color:"red",style:{margin:0},children:"Inactive"})]})},A=b=>{const N=new Date,$=new Date(b.startDate),X=new Date(b.endDate);if(N<$)return 0;if(N>X)return 100;const D=X.getTime()-$.getTime(),B=N.getTime()-$.getTime();return Math.round(B/D*100)},L=b=>{s.confirm({title:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",color:"#101828",padding:"20px 24px",borderBottom:"1px solid #EAECF0"},children:[e.jsx(He,{style:{color:"#F04438",fontSize:"22px"}}),e.jsx("span",{style:{fontSize:"18px",fontWeight:600,lineHeight:"28px"},children:"Delete Exhibition"})]}),content:e.jsxs("div",{style:{padding:"20px 24px",color:"#475467"},children:[e.jsxs("p",{style:{fontSize:"14px",lineHeight:"20px",marginBottom:"8px"},children:["Are you sure you want to delete ",e.jsx("strong",{children:b.name}),"?"]}),e.jsx("p",{style:{color:"#667085",fontSize:"14px",lineHeight:"20px",marginBottom:0},children:"This action cannot be undone and will permanently delete all associated data."})]}),footer:e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px",padding:"20px 24px",borderTop:"1px solid #EAECF0",marginTop:0},children:[e.jsx(_,{onClick:()=>Ie.destroyAll(),style:{height:"40px",padding:"10px 18px",borderRadius:"8px",border:"1px solid #D0D5DD",color:"#344054",fontWeight:500,fontSize:"14px",lineHeight:"20px",display:"flex",alignItems:"center",boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)"},children:"Cancel"}),e.jsx(_,{danger:!0,type:"primary",onClick:()=>{y(b),Ie.destroyAll()},style:{height:"40px",padding:"10px 18px",borderRadius:"8px",border:"none",backgroundColor:"#D92D20",color:"white",fontWeight:500,fontSize:"14px",lineHeight:"20px",display:"flex",alignItems:"center",boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)"},children:"Delete"})]}),centered:!0,icon:null,width:400,closable:!0,maskClosable:!0,className:"delete-confirmation-modal",styles:{mask:{backgroundColor:"rgba(52, 64, 84, 0.7)"},content:{padding:0,borderRadius:"12px",boxShadow:"0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.1)"},body:{padding:0},footer:{display:"none"}}})},R=b=>[{key:"view",label:"View Details",icon:e.jsx(At,{}),onClick:()=>x(b,"")},{key:"edit",label:"Edit Exhibition",icon:e.jsx(ds,{}),onClick:()=>x(b,"/edit")},{key:"layout",label:"Manage Layout",icon:e.jsx(Ct,{}),onClick:()=>x(b,"/layout")},{type:"divider"},...b.status==="published"?[{key:"public-view",label:"Public View",icon:e.jsx(At,{}),onClick:()=>window.open(ps(b),"_blank")},{type:"divider"}]:[],{key:"status",label:"Change Status",icon:e.jsx(Bn,{}),children:[{key:"draft",label:e.jsxs(Q,{children:[e.jsx(he,{color:"#faad14",style:{margin:0},children:"Draft"}),e.jsx("span",{children:"Set as Draft"})]}),icon:e.jsx(fs,{}),onClick:()=>g(b,"draft"),disabled:b.status==="draft"||I},{key:"published",label:e.jsxs(Q,{children:[e.jsx(he,{color:"#52c41a",style:{margin:0},children:"Published"}),e.jsx("span",{children:"Publish"})]}),icon:e.jsx(bt,{}),onClick:()=>g(b,"published"),disabled:b.status==="published"||I},{key:"completed",label:e.jsxs(Q,{children:[e.jsx(he,{color:"#1890ff",style:{margin:0},children:"Completed"}),e.jsx("span",{children:"Mark as Completed"})]}),icon:e.jsx(pt,{}),onClick:()=>g(b,"completed"),disabled:b.status==="completed"||I}]},{key:"active-status",label:e.jsxs(Q,{children:[b.isActive?e.jsx(he,{color:"red",style:{margin:0},children:"Deactivate"}):e.jsx(he,{color:"#52c41a",style:{margin:0},children:"Activate"}),e.jsx("span",{children:b.isActive?"Deactivate":"Activate"})]}),icon:e.jsx(bs,{}),onClick:()=>d(b,!b.isActive),disabled:I},{type:"divider"},{key:"delete",label:"Delete",icon:e.jsx(He,{}),danger:!0,onClick:()=>L(b)}],H=p.useMemo(()=>a.filter(b=>{if(j.search&&!b.name.toLowerCase().includes(j.search.toLowerCase())||j.status.length>0&&!j.status.includes(b.status)||j.activeStatus!==null&&b.isActive!==j.activeStatus)return!1;if(j.dateRange){const[N,$]=j.dateRange,X=new Date(b.startDate),D=new Date(b.endDate);if(X<new Date(N)||D>new Date($))return!1}switch(v){case"active":return b.status==="published";case"upcoming":return new Date(b.startDate)>new Date;case"completed":return b.status==="completed";default:return!0}}),[a,j,v]),V=[{title:"Exhibition Details",key:"details",render:(b,N)=>e.jsx(Je,{strong:!0,style:{fontSize:"16px",cursor:"pointer"},onClick:()=>x(N,""),children:N.name})},{title:"Status",key:"status",width:180,align:"center",render:(b,N)=>u(N.status,N.isActive),filters:[{text:"Draft",value:"draft"},{text:"Published",value:"published"},{text:"Completed",value:"completed"}],onFilter:(b,N)=>N.status===b},{title:"Start Date",key:"startDate",width:130,render:(b,N)=>e.jsx(Je,{children:Ae(N.startDate).format("MMM D, YYYY")})},{title:"End Date",key:"endDate",width:130,render:(b,N)=>e.jsx(Je,{children:Ae(N.endDate).format("MMM D, YYYY")})},{title:"Create Date",key:"createdAt",width:130,render:(b,N)=>e.jsx(Je,{children:Ae(N.createdAt).format("MMM D, YYYY")})},{title:"Progress",key:"progress",width:200,render:(b,N)=>e.jsx(ft,{percent:A(N),size:"small",status:N.status==="completed"?"success":"active"})},{title:"Actions",key:"actions",width:150,fixed:"right",render:(b,N)=>e.jsxs(Q,{size:"middle",children:[C("exhibitions_view")&&e.jsx(Ve,{title:"View Details",children:e.jsx(_,{type:"text",icon:e.jsx(At,{}),onClick:()=>x(N,"")})}),C("exhibitions_edit")&&e.jsx(Ve,{title:"Edit Exhibition",children:e.jsx(_,{type:"text",icon:e.jsx(ds,{}),onClick:()=>x(N,"/edit")})}),C("exhibitions_delete")&&e.jsx(yn,{menu:{items:R(N)},trigger:["click"],placement:"bottomRight",children:e.jsx(_,{type:"text",icon:e.jsx(Mn,{})})})]})}];return e.jsxs("div",{className:"dashboard-container",children:[e.jsx("div",{style:{marginBottom:"24px"},children:e.jsxs(ie,{gutter:[24,24],align:"middle",children:[e.jsx(F,{flex:"auto",children:e.jsxs(Q,{direction:"vertical",size:4,children:[e.jsx(fi,{level:4,style:{margin:0},children:"Exhibitions"}),e.jsx(Je,{type:"secondary",children:"Manage your exhibition spaces and layouts"})]})}),e.jsx(F,{children:e.jsx(_,{type:"primary",icon:e.jsx(Te,{}),onClick:()=>i("/exhibition/create"),size:"large",children:"Create Exhibition"})})]})}),e.jsxs(ie,{gutter:[24,24],style:{marginBottom:"24px"},children:[e.jsx(F,{xs:24,sm:12,md:6,lg:4,children:e.jsx(q,{children:e.jsx(Pe,{title:"Total Exhibitions",value:w.total,prefix:e.jsx(fs,{})})})}),e.jsx(F,{xs:24,sm:12,md:6,lg:5,children:e.jsx(q,{children:e.jsx(Pe,{title:"Published Exhibitions",value:w.active,prefix:e.jsx(bt,{style:{color:"#52c41a"}})})})}),e.jsx(F,{xs:24,sm:12,md:6,lg:5,children:e.jsx(q,{children:e.jsx(Pe,{title:"Upcoming Exhibitions",value:w.upcoming,prefix:e.jsx(pt,{style:{color:"#1890ff"}})})})}),e.jsx(F,{xs:24,sm:12,md:6,lg:5,children:e.jsx(q,{children:e.jsx(Pe,{title:"Completed Exhibitions",value:w.completed,prefix:e.jsx(bt,{style:{color:"#8c8c8c"}})})})}),e.jsx(F,{xs:24,sm:12,md:6,lg:5,children:e.jsx(q,{children:e.jsx(Pe,{title:"Active Status",value:w.activeCount,prefix:e.jsx(bs,{style:{color:"#52c41a"}})})})})]}),e.jsx(q,{className:"info-card",style:{marginBottom:"16px"},styles:{body:{padding:"20px"}},children:e.jsxs(Q,{direction:"vertical",size:"middle",style:{width:"100%"},children:[e.jsxs(ie,{gutter:[16,16],align:"middle",children:[e.jsx(F,{flex:"auto",children:e.jsxs(Q,{size:"middle",wrap:!0,children:[e.jsx(Z,{placeholder:"Search exhibitions",prefix:e.jsx($n,{style:{color:"#8c8c8c"}}),style:{width:"250px"},value:j.search,onChange:b=>k(N=>({...N,search:b.target.value})),allowClear:!0}),e.jsx(te,{mode:"multiple",placeholder:"Filter by status",style:{minWidth:"200px"},value:j.status,onChange:b=>k(N=>({...N,status:b})),options:[{label:"Draft",value:"draft"},{label:"Published",value:"published"},{label:"Completed",value:"completed"}]}),e.jsxs(te,{placeholder:"Active Status",style:{width:"150px"},value:j.activeStatus,onChange:b=>k(N=>({...N,activeStatus:b})),allowClear:!0,children:[e.jsx(te.Option,{value:!0,children:"Active"}),e.jsx(te.Option,{value:!1,children:"Inactive"})]}),e.jsx(bi,{onChange:b=>k(N=>{var $,X;return{...N,dateRange:b?[(($=b[0])==null?void 0:$.toISOString())||"",((X=b[1])==null?void 0:X.toISOString())||""]:null}})})]})}),e.jsx(F,{children:e.jsx(bn,{options:[{label:"All",value:"all"},{label:"Active",value:"active"},{label:"Upcoming",value:"upcoming"},{label:"Completed",value:"completed"}],value:v,onChange:b=>l(b)})})]}),r.length>0&&e.jsx(ie,{children:e.jsxs(Q,{children:[e.jsxs(Je,{children:["Selected ",r.length," items"]}),e.jsx(_,{danger:!0,onClick:P,children:"Delete Selected"})]})})]})}),e.jsx(q,{className:"info-card",styles:{body:{padding:0}},children:e.jsx(Oe,{columns:V,dataSource:H.map(b=>({...b,key:b._id||b.id})),rowKey:b=>b._id||b.id,loading:o||f||I,rowSelection:{selectedRowKeys:r.map(b=>b._id||b.id),onChange:(b,N)=>h(N),selections:[Oe.SELECTION_ALL,Oe.SELECTION_NONE]},footer:()=>r.length>0&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"},children:[e.jsxs(Je,{children:["Selected ",e.jsx("strong",{children:r.length})," ",r.length===1?"exhibition":"exhibitions"]}),e.jsx(_,{danger:!0,onClick:P,icon:e.jsx(He,{}),loading:f,children:"Delete Selected"})]}),scroll:{x:1500},pagination:{pageSize:10,showSizeChanger:!0,showTotal:b=>`Total ${b} items`,style:{marginTop:"16px"}}})})]})},ca=Object.freeze(Object.defineProperty({__proto__:null,default:yi},Symbol.toStringTag,{value:"Module"})),{RangePicker:ji}=Ms,{Title:_e,Text:qe}=je,Ds=({value:t="",onChange:s})=>{const i=xe.useRef(null),[n]=xe.useState(t);return e.jsx(Ks,{apiKey:cn,onInit:(a,o)=>{i.current=o},value:t,init:{height:300,menubar:!1,plugins:["advlist","autolink","lists","link","charmap","preview","searchreplace","visualblocks","code","fullscreen","insertdatetime","table","help","wordcount"],toolbar:"undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | help",content_style:'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; font-size: 14px; }',branding:!1,promotion:!1,entity_encoding:"raw",convert_urls:!1,paste_data_images:!0,resize:!1,statusbar:!1,browser_spellcheck:!0,setup:a=>{a.on("init",()=>{a.undoManager.clear(),a.undoManager.add()}),a.on("change",()=>{a.undoManager.add()})}},onEditorChange:a=>{s==null||s(a)}})},wi=({form:t})=>{const[s,i]=p.useState([]),[n,a]=p.useState(!1);return p.useEffect(()=>{(async()=>{try{a(!0);const r=await Ls.getStallTypes();i(r.data.filter(h=>h.status==="active"))}catch(r){console.error("Failed to fetch stall types:",r)}finally{a(!1)}})()},[]),e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto"},children:[e.jsxs(q,{className:"settings-card",children:[e.jsx(_e,{level:4,children:"Basic Information"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Enter the main details of your exhibition"}),e.jsxs(ie,{gutter:24,children:[e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"name",label:"Exhibition Name",rules:[{required:!0,message:"Please enter exhibition name"}],children:e.jsx(Z,{placeholder:"Enter exhibition name"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"description",label:"Description",rules:[{required:!0,message:"Please enter description"}],children:e.jsx(Z.TextArea,{rows:4,placeholder:"Enter exhibition description"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"venue",label:"Exhibition Venue",rules:[{required:!0,message:"Please enter exhibition venue"}],children:e.jsx(Z.TextArea,{rows:2,placeholder:"Enter exhibition venue details"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"invoicePrefix",label:"Invoice Prefix",tooltip:"This prefix will be used for all invoices generated for this exhibition (e.g. INV, EXP23)",rules:[{max:10,message:"Prefix cannot be longer than 10 characters"},{pattern:/^[A-Za-z0-9-]*$/,message:"Only letters, numbers, and hyphens are allowed"}],children:e.jsx(Z,{placeholder:"Enter invoice prefix (default: INV)"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"dateRange",label:"Exhibition Dates",rules:[{required:!0,message:"Please select exhibition dates"}],children:e.jsx(ji,{style:{width:"100%"}})})})]})]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(_e,{level:4,children:"Company Details"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Enter your company information"}),e.jsxs(ie,{gutter:24,children:[e.jsxs(F,{span:12,children:[e.jsx(E.Item,{name:"companyName",label:"Company Name",rules:[{required:!0,message:"Please enter company name"}],children:e.jsx(Z,{placeholder:"Enter company name"})}),e.jsx(E.Item,{name:"companyContactNo",label:"Contact No.",rules:[{required:!0,message:"Please enter contact number"}],children:e.jsx(Z,{placeholder:"Enter contact number"})}),e.jsx(E.Item,{name:"companyEmail",label:"Email",rules:[{required:!0,message:"Please enter email"},{type:"email",message:"Please enter a valid email"}],children:e.jsx(Z,{placeholder:"Enter email address"})}),e.jsx(E.Item,{name:"companyAddress",label:"Address",rules:[{required:!0,message:"Please enter address"}],children:e.jsx(Z.TextArea,{rows:4,placeholder:"Enter company address"})}),e.jsx(E.Item,{name:"termsAndConditions",label:"Terms & Conditions",tooltip:"Use the rich text editor to format your terms and conditions",children:e.jsx(Ds,{})})]}),e.jsxs(F,{span:12,children:[e.jsx(E.Item,{name:"companyPAN",label:"PAN No.",rules:[{required:!0,message:"Please enter PAN number"}],children:e.jsx(Z,{placeholder:"Enter PAN number"})}),e.jsx(E.Item,{name:"companyGST",label:"GST No.",rules:[{required:!0,message:"Please enter GST number"}],children:e.jsx(Z,{placeholder:"Enter GST number"})}),e.jsx(E.Item,{name:"companySAC",label:"SAC Code No.",children:e.jsx(Z,{placeholder:"Enter SAC code number"})}),e.jsx(E.Item,{name:"companyCIN",label:"CIN No.",children:e.jsx(Z,{placeholder:"Enter CIN number"})}),e.jsx(E.Item,{name:"companyWebsite",label:"Website",rules:[{type:"url",message:"Please enter a valid URL"}],children:e.jsx(Z,{placeholder:"Enter website URL"})}),e.jsx(E.Item,{name:"piInstructions",label:"PI Instructions",tooltip:"Use the rich text editor to format your PI instructions",children:e.jsx(Ds,{})})]})]})]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(_e,{level:4,children:"Bank Details"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Enter your bank account information for payments"}),e.jsxs(ie,{gutter:24,children:[e.jsxs(F,{span:12,children:[e.jsx(E.Item,{name:"bankName",label:"Bank Name",rules:[{required:!0,message:"Please enter bank name"}],children:e.jsx(Z,{placeholder:"Enter bank name"})}),e.jsx(E.Item,{name:"bankBranch",label:"Branch Name",rules:[{required:!0,message:"Please enter branch name"}],children:e.jsx(Z,{placeholder:"Enter branch name"})}),e.jsx(E.Item,{name:"bankIFSC",label:"IFSC Code",rules:[{required:!0,message:"Please enter IFSC code"},{pattern:/^[A-Z]{4}0[A-Z0-9]{6}$/,message:"Please enter a valid IFSC code"}],children:e.jsx(Z,{placeholder:"Enter IFSC code",style:{textTransform:"uppercase"}})})]}),e.jsxs(F,{span:12,children:[e.jsx(E.Item,{name:"bankAccountName",label:"Account Name",rules:[{required:!0,message:"Please enter account name"}],children:e.jsx(Z,{placeholder:"Enter account name"})}),e.jsx(E.Item,{name:"bankAccount",label:"Account Number",rules:[{required:!0,message:"Please enter account number"},{pattern:/^\d+$/,message:"Please enter a valid account number"}],children:e.jsx(Z,{placeholder:"Enter account number"})})]})]})]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(_e,{level:4,children:"Stall Rates & Pricing"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Configure pricing, taxes, and discounts for stalls"}),e.jsxs("div",{style:{marginBottom:"32px"},children:[e.jsx(_e,{level:5,children:"Stall Type Rates"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"16px",display:"block"},children:"Configure pricing per square meter for different types of stalls"}),e.jsx(E.List,{name:"stallRates",children:(o,{add:r,remove:h})=>e.jsxs(e.Fragment,{children:[o.map(({key:f,name:c,...I})=>e.jsxs(Q,{style:{display:"flex",marginBottom:8},align:"baseline",children:[e.jsx(E.Item,{...I,name:[c,"stallTypeId"],rules:[{required:!0,message:"Please select stall type"}],children:e.jsx(te,{loading:n,placeholder:"Select stall type",style:{width:200},children:s.map(m=>e.jsx(te.Option,{value:m._id,children:m.name},m._id))})}),e.jsx(E.Item,{...I,name:[c,"rate"],rules:[{required:!0,message:"Please enter rate"}],children:e.jsx(re,{min:0,placeholder:"Rate per sq.m",style:{width:200},prefix:"₹",formatter:m=>`${m}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:m=>{const j=m?Number(m.replace(/\₹\s?|(,*)/g,"")):0;return isNaN(j)?0:j}})}),e.jsx(tt,{onClick:()=>h(c)})]},f)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>r(),block:!0,icon:e.jsx(Te,{}),children:"Add Stall Type Rate"})})]})})]}),e.jsxs("div",{style:{marginBottom:"32px"},children:[e.jsx(_e,{level:5,children:"Tax Configuration"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"16px",display:"block"},children:"Configure applicable taxes for stall bookings"}),e.jsx(E.List,{name:"taxConfig",children:(o,{add:r,remove:h})=>e.jsxs(e.Fragment,{children:[o.map(({key:f,name:c,...I})=>e.jsxs(Q,{style:{display:"flex",marginBottom:8},align:"baseline",children:[e.jsx(E.Item,{...I,name:[c,"name"],rules:[{required:!0,message:"Please enter tax name"}],children:e.jsx(Z,{placeholder:"Tax name",style:{width:150}})}),e.jsx(E.Item,{...I,name:[c,"rate"],rules:[{required:!0,message:"Please enter tax rate"}],children:e.jsx(re,{min:0,max:100,placeholder:"Tax rate",style:{width:150},formatter:m=>`${m}%`,parser:m=>{const j=m?Number(m.replace("%","")):0;return isNaN(j)?0:Math.min(j,100)}})}),e.jsx(E.Item,{...I,name:[c,"isActive"],valuePropName:"checked",children:e.jsx(gt,{checkedChildren:"Active",unCheckedChildren:"Inactive"})}),e.jsx(tt,{onClick:()=>h(c)})]},f)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>r(),block:!0,icon:e.jsx(Te,{}),children:"Add Tax"})})]})})]}),e.jsxs("div",{children:[e.jsx(_e,{level:5,children:"Admin Discount Configuration"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"16px",display:"block"},children:"Configure available discounts for admin panel stall bookings"}),e.jsx(E.List,{name:"discountConfig",children:(o,{add:r,remove:h})=>e.jsxs(e.Fragment,{children:[o.map(({key:f,name:c,...I})=>e.jsxs(Q,{style:{display:"flex",marginBottom:8},align:"baseline",children:[e.jsx(E.Item,{...I,name:[c,"name"],rules:[{required:!0,message:"Please enter discount name"}],children:e.jsx(Z,{placeholder:"Discount",style:{width:150}})}),e.jsx(E.Item,{...I,name:[c,"type"],rules:[{required:!0,message:"Please select type"}],children:e.jsxs(te,{style:{width:150},children:[e.jsx(te.Option,{value:"percentage",children:"Percentage (%)"}),e.jsx(te.Option,{value:"fixed",children:"Fixed Amount (₹)"})]})}),e.jsx(E.Item,{noStyle:!0,shouldUpdate:(m,j)=>{var k,v,l,C;return((v=(k=m==null?void 0:m.discountConfig)==null?void 0:k[c])==null?void 0:v.type)!==((C=(l=j==null?void 0:j.discountConfig)==null?void 0:l[c])==null?void 0:C.type)},children:({getFieldValue:m})=>{const j=m(["discountConfig",c,"type"]);return e.jsx(E.Item,{...I,name:[c,"value"],rules:[{required:!0,message:`Please enter ${j==="percentage"?"percentage":"amount"}`}],children:e.jsx(re,{min:0,max:j==="percentage"?100:void 0,placeholder:j==="percentage"?"Percentage":"Amount",style:{width:150},formatter:k=>j==="percentage"?`${k}%`:`₹${k}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:k=>{const v=k?Number(k.replace(/[₹%,]/g,"")):0;return isNaN(v)?0:v}})})}}),e.jsx(E.Item,{...I,name:[c,"isActive"],valuePropName:"checked",children:e.jsx(gt,{checkedChildren:"Active",unCheckedChildren:"Inactive"})}),e.jsx(tt,{onClick:()=>h(c)})]},f)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>r(),block:!0,icon:e.jsx(Te,{}),children:"Add Admin Discount"})})]})})]}),e.jsxs("div",{style:{marginTop:"24px"},children:[e.jsx(_e,{level:5,children:"Public Discount Configuration"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"16px",display:"block"},children:"Configure available discounts for public stall bookings"}),e.jsx(E.List,{name:"publicDiscountConfig",children:(o,{add:r,remove:h})=>e.jsxs(e.Fragment,{children:[o.map(({key:f,name:c,...I})=>e.jsxs(Q,{style:{display:"flex",marginBottom:8},align:"baseline",children:[e.jsx(E.Item,{...I,name:[c,"name"],rules:[{required:!0,message:"Please enter discount name"}],children:e.jsx(Z,{placeholder:"Discount",style:{width:150}})}),e.jsx(E.Item,{...I,name:[c,"type"],rules:[{required:!0,message:"Please select type"}],children:e.jsxs(te,{style:{width:150},children:[e.jsx(te.Option,{value:"percentage",children:"Percentage (%)"}),e.jsx(te.Option,{value:"fixed",children:"Fixed Amount (₹)"})]})}),e.jsx(E.Item,{noStyle:!0,shouldUpdate:(m,j)=>{var k,v,l,C;return((v=(k=m==null?void 0:m.publicDiscountConfig)==null?void 0:k[c])==null?void 0:v.type)!==((C=(l=j==null?void 0:j.publicDiscountConfig)==null?void 0:l[c])==null?void 0:C.type)},children:({getFieldValue:m})=>{const j=m(["publicDiscountConfig",c,"type"]);return e.jsx(E.Item,{...I,name:[c,"value"],rules:[{required:!0,message:`Please enter ${j==="percentage"?"percentage":"amount"}`}],children:e.jsx(re,{min:0,max:j==="percentage"?100:void 0,placeholder:j==="percentage"?"Percentage":"Amount",style:{width:150},formatter:k=>j==="percentage"?`${k}%`:`₹${k}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:k=>{const v=k?Number(k.replace(/[₹%,]/g,"")):0;return isNaN(v)?0:v}})})}}),e.jsx(E.Item,{...I,name:[c,"isActive"],valuePropName:"checked",children:e.jsx(gt,{checkedChildren:"Active",unCheckedChildren:"Inactive"})}),e.jsx(tt,{onClick:()=>h(c)})]},f)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>r(),block:!0,icon:e.jsx(Te,{}),children:"Add Public Discount"})})]})})]})]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(_e,{level:4,children:"Status Settings"}),e.jsx(qe,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Manage the visibility and status of your exhibition"}),e.jsxs(ie,{gutter:24,children:[e.jsx(F,{span:12,children:e.jsx(E.Item,{name:"status",label:"Status",rules:[{required:!0,message:"Please select status"}],children:e.jsxs(te,{children:[e.jsx(te.Option,{value:"draft",children:"Draft"}),e.jsx(te.Option,{value:"published",children:"Published"}),e.jsx(te.Option,{value:"completed",children:"Completed"})]})})}),e.jsx(F,{span:12,children:e.jsx(E.Item,{name:"isActive",label:"Active Status",valuePropName:"checked",children:e.jsx(gt,{checkedChildren:"Active",unCheckedChildren:"Inactive"})})})]})]})]})},{Title:Rs,Text:ns}=je,vi=({form:t})=>{const{message:s}=nt.useApp(),[i,n]=p.useState([]),[a,o]=p.useState([]),[r,h]=p.useState(0),[f,c]=p.useState({}),I=l=>{const C=localStorage.getItem("token");return{url:`${Se.defaults.baseURL}/uploads/${l}`,token:C}};p.useEffect(()=>{const l=t.getFieldValue("headerLogo");if(l){const{url:C,token:w}=I(l);fetch(C,{headers:{authorization:`Bearer ${w}`}}).then(y=>y.blob()).then(y=>{const P=URL.createObjectURL(y);n([{uid:"-1",name:l.split("/").pop()||"logo",status:"done",url:P,thumbUrl:P,type:y.type,response:{path:l}}])}).catch(()=>{n([])})}},[t]),p.useEffect(()=>{const l=t.getFieldValue("sponsorLogos")||[];l.length>0&&Promise.all(l.map(async(C,w)=>{const{url:y,token:P}=I(C);try{const d=await(await fetch(y,{headers:{authorization:`Bearer ${P}`}})).blob(),x=URL.createObjectURL(d);return{uid:`-${w+1}`,name:C.split("/").pop()||`sponsor-${w+1}`,status:"done",url:x,thumbUrl:x,type:d.type,response:{path:C}}}catch{return null}})).then(C=>{o(C.filter(Boolean))})},[t]);const m={name:"file",action:`${Se.defaults.baseURL}/exhibitions/upload/logos`,headers:{authorization:`Bearer ${localStorage.getItem("token")}`},maxCount:1,accept:"image/*",fileList:i,listType:"picture-card",showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0},onChange(l){const{status:C,name:w,response:y,uid:P}=l.file;if(C==="uploading"){n([...l.fileList]);return}if(C==="done"&&y){const{url:g,token:d}=I(y.path);h(0),fetch(g,{headers:{authorization:`Bearer ${d}`}}).then(x=>x.blob()).then(x=>{const S=URL.createObjectURL(x);n([{uid:l.file.uid,name:w,status:"done",url:S,thumbUrl:S,type:x.type,response:y}]),s.success(`${w} uploaded successfully`),t.setFieldValue("headerLogo",y.path),y.thumbnail&&t.setFieldValue("headerLogoThumbnail",y.thumbnail)}).catch(()=>{s.error(`${w} preview failed to load`),n([])})}else C==="error"?(s.error(`${w} upload failed.`),n([]),h(0)):C==="removed"&&(n([]),t.setFieldValue("headerLogo",null),t.setFieldValue("headerLogoThumbnail",null),h(0))},customRequest:async l=>{const{onProgress:C,onSuccess:w,onError:y,file:P,action:g,headers:d}=l;try{const x=new FormData;x.append("file",P);const S=new XMLHttpRequest;S.open("POST",g||"",!0),d&&Object.keys(d).forEach(u=>{S.setRequestHeader(u,d[u])}),S.upload.onprogress=u=>{u.lengthComputable&&C&&(C({percent:u.loaded/u.total*100}),h(Math.round(u.loaded/u.total*100)))},S.onload=()=>{if(S.status>=200&&S.status<300)try{const u=JSON.parse(S.response);w==null||w(u,P),h(0)}catch(u){y==null||y(u)}else y==null||y(new Error("Upload failed"))},S.onerror=()=>{h(0),y==null||y(new Error("Upload request failed"))},S.send(x)}catch(x){h(0),y==null||y(x)}},onRemove(){return n([]),t.setFieldValue("headerLogo",null),t.setFieldValue("headerLogoThumbnail",null),h(0),!0},onPreview:async l=>{if(!l.url)return;const C=window.open("");C&&(C.document.write(`
          <img src="${l.url}" style="max-width: 100%; height: auto;" 
               onload="this.style.marginTop = Math.max(0, (window.innerHeight - this.height) / 2) + 'px'"
          />
        `),C.document.head.innerHTML="<title>Image Preview</title>")}},j={name:"file",action:`${Se.defaults.baseURL}/exhibitions/upload/sponsors`,headers:{authorization:`Bearer ${localStorage.getItem("token")}`},accept:"image/*",fileList:a,listType:"picture-card",multiple:!0,showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0},onChange(l){const{status:C,name:w,response:y,uid:P}=l.file;if(C==="uploading"){o([...l.fileList]);return}if(C==="done"&&y&&y.paths&&y.paths.length>0){c(S=>{const u={...S};return delete u[P],u});const g=y.paths[0],{url:d,token:x}=I(g);fetch(d,{headers:{authorization:`Bearer ${x}`}}).then(S=>S.blob()).then(S=>{const u=URL.createObjectURL(S),A=[...a],L=A.findIndex(V=>V.uid===l.file.uid),R={uid:l.file.uid,name:w,status:"done",url:u,thumbUrl:u,type:S.type,response:{path:g}};L>-1?A[L]=R:A.push(R),o(A),s.success(`${w} uploaded successfully`);const H=A.filter(V=>{var b;return V.status==="done"&&((b=V.response)==null?void 0:b.path)}).map(V=>V.response.path);if(t.setFieldValue("sponsorLogos",H),y.thumbnails&&y.thumbnails.length>0){const V=t.getFieldValue("sponsorLogoThumbnails")||[];t.setFieldValue("sponsorLogoThumbnails",[...V,...y.thumbnails])}}).catch(()=>{s.error(`${w} preview failed to load`),o(S=>S.filter(u=>u.uid!==l.file.uid))})}else C==="error"?(s.error(`${w} upload failed.`),o(g=>g.filter(d=>d.uid!==l.file.uid)),c(g=>{const d={...g};return delete d[P],d})):C==="removed"&&c(g=>{const d={...g};return delete d[P],d})},customRequest:async l=>{const{onProgress:C,onSuccess:w,onError:y,file:P,action:g,headers:d}=l,x=typeof P=="object"&&"uid"in P?P.uid:String(Date.now());try{const S=new FormData;S.append("file",P);const u=new XMLHttpRequest;u.open("POST",g||"",!0),d&&Object.keys(d).forEach(A=>{u.setRequestHeader(A,d[A])}),u.upload.onprogress=A=>{if(A.lengthComputable&&C){const L=A.loaded/A.total*100;C({percent:L}),c(R=>({...R,[x]:Math.round(L)}))}},u.onload=()=>{if(u.status>=200&&u.status<300)try{const A=JSON.parse(u.response);w==null||w(A,P),c(L=>{const R={...L};return delete R[x],R})}catch(A){y==null||y(A)}else y==null||y(new Error("Upload failed"))},u.onerror=()=>{c(A=>{const L={...A};return delete L[x],L}),y==null||y(new Error("Upload request failed"))},u.send(S)}catch(S){c(u=>{const A={...u};return delete A[x],A}),y==null||y(S)}},onRemove(l){var P;const C=a.filter(g=>g.uid!==l.uid);o(C);const w=C.filter(g=>{var d;return g.status==="done"&&((d=g.response)==null?void 0:d.path)}).map(g=>g.response.path);t.setFieldValue("sponsorLogos",w);const y=t.getFieldValue("sponsorLogoThumbnails")||[];if(y.length>0&&(P=l.response)!=null&&P.path){const g=l.response.path.split("/"),d=g[g.length-1],x=y.filter(S=>!S.includes(d));t.setFieldValue("sponsorLogoThumbnails",x)}return c(g=>{const d={...g};return delete d[l.uid],d}),!0},onPreview:async l=>{if(!l.url)return;const C=window.open("");C&&(C.document.write(`
          <img src="${l.url}" style="max-width: 100%; height: auto;" 
               onload="this.style.marginTop = Math.max(0, (window.innerHeight - this.height) / 2) + 'px'"
          />
        `),C.document.head.innerHTML="<title>Image Preview</title>")}},k=e.jsx("div",{children:r>0?e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx(ft,{type:"circle",percent:r,width:80}),e.jsx("div",{style:{marginTop:8},children:"Uploading..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(qt,{}),e.jsx("div",{style:{marginTop:8},children:"Upload Logo"})]})}),v=e.jsxs("div",{children:[e.jsx(qt,{}),e.jsx("div",{style:{marginTop:8},children:"Upload Sponsor Logos"})]});return e.jsx("div",{style:{maxWidth:"1000px",margin:"0 auto"},children:e.jsxs(q,{className:"settings-card",children:[e.jsx(Rs,{level:4,children:"Header Settings"}),e.jsx(ns,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Configure how the exhibition header appears to visitors"}),e.jsxs(ie,{gutter:24,children:[e.jsx(F,{span:24,children:e.jsxs(E.Item,{name:"headerLogo",label:"Header Logo",tooltip:"Upload your exhibition logo (recommended size: 200x200px, max 2MB)",children:[e.jsx(Bt,{...m,children:i.length<1&&k}),i.length>0&&r>0&&e.jsx(ft,{percent:r,status:"active",style:{marginTop:8}})]})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"headerTitle",label:"Header Title",rules:[{required:!0,message:"Please enter a header title"},{max:100,message:"Title cannot be longer than 100 characters"}],tooltip:"This title will be prominently displayed at the top of your exhibition page",children:e.jsx(Z,{placeholder:"Enter a title for your exhibition header"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"headerSubtitle",label:"Header Subtitle",rules:[{max:200,message:"Subtitle cannot be longer than 200 characters"}],tooltip:"A brief tagline or subtitle to provide additional context",children:e.jsx(Z,{placeholder:"Enter a subtitle (optional)"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"headerDescription",label:"Header Description",rules:[{max:500,message:"Description cannot be longer than 500 characters"}],tooltip:"A detailed description that appears in the header section",children:e.jsx(Z.TextArea,{placeholder:"Enter a description for your exhibition header (optional)",rows:4,showCount:!0,maxLength:500})})}),e.jsxs(F,{span:24,children:[e.jsx(Ee,{}),e.jsx(Rs,{level:5,children:"Sponsor Logos"}),e.jsx(ns,{type:"secondary",style:{marginBottom:"16px",display:"block"},children:"Add sponsor logos that will be displayed in the exhibition header"}),e.jsxs(E.Item,{name:"sponsorLogos",tooltip:"Upload sponsor logos (recommended size: 150x150px, max 2MB each)",children:[e.jsx(Bt,{...j,children:v}),Object.entries(f).map(([l,C])=>{var w;return e.jsxs("div",{style:{marginTop:8,display:"flex",alignItems:"center"},children:[e.jsxs(ns,{style:{marginRight:10,width:150},ellipsis:!0,children:[((w=a.find(y=>y.uid===l))==null?void 0:w.name)||"File",":"]}),e.jsx(ft,{percent:C,status:"active",style:{flex:1}})]},l)})]})]})]})]})})},{Title:As,Text:Ps}=je,Si=({form:t})=>{const{message:s}=nt.useApp(),[i,n]=p.useState([]),a=r=>{const h=localStorage.getItem("token");return{url:`${Se.defaults.baseURL}/uploads/${r}`,token:h}};p.useEffect(()=>{const r=t.getFieldValue("footerLogo");if(r){const{url:h,token:f}=a(r);fetch(h,{headers:{authorization:`Bearer ${f}`}}).then(c=>c.blob()).then(c=>{const I=URL.createObjectURL(c);n([{uid:"-1",name:r.split("/").pop()||"logo",status:"done",url:I,thumbUrl:I,type:c.type,response:{path:r}}])}).catch(()=>{n([])})}},[t]);const o={name:"file",action:`${Se.defaults.baseURL}/exhibitions/upload/logos`,headers:{authorization:`Bearer ${localStorage.getItem("token")}`},maxCount:1,accept:"image/*",fileList:i,listType:"picture-card",showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0},onChange(r){const{status:h,name:f,response:c}=r.file;if(h==="uploading"){n([...r.fileList]);return}if(h==="done"&&c){const{url:I,token:m}=a(c.path);fetch(I,{headers:{authorization:`Bearer ${m}`}}).then(j=>j.blob()).then(j=>{const k=URL.createObjectURL(j);n([{uid:r.file.uid,name:f,status:"done",url:k,thumbUrl:k,type:j.type,response:c}]),s.success(`${f} uploaded successfully`),t.setFieldValue("footerLogo",c.path)}).catch(()=>{s.error(`${f} preview failed to load`),n([])})}else h==="error"?(s.error(`${f} upload failed.`),n([])):h==="removed"&&(n([]),t.setFieldValue("footerLogo",null))},onRemove(){return n([]),t.setFieldValue("footerLogo",null),!0},onPreview:async r=>{if(!r.url)return;const h=window.open("");h&&(h.document.write(`
          <img src="${r.url}" style="max-width: 100%; height: auto;" 
               onload="this.style.marginTop = Math.max(0, (window.innerHeight - this.height) / 2) + 'px'"
          />
        `),h.document.head.innerHTML="<title>Image Preview</title>")}};return e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto"},children:[e.jsxs(q,{className:"settings-card",children:[e.jsx(As,{level:4,children:"Footer Content"}),e.jsx(Ps,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Configure the footer content and contact information"}),e.jsxs(ie,{gutter:24,children:[e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"footerLogo",label:"Footer Logo",tooltip:"Upload your footer logo (recommended size: 200x200px, max 2MB)",children:e.jsx(Bt,{...o,children:i.length<1&&e.jsxs("div",{children:[e.jsx(qt,{}),e.jsx("div",{style:{marginTop:8},children:"Upload Logo"})]})})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"footerText",label:"Footer Text",rules:[{required:!0,message:"Please enter footer text"},{max:500,message:"Text cannot be longer than 500 characters"}],tooltip:"This text will appear in the footer section of your exhibition page",children:e.jsx(Z.TextArea,{rows:4,placeholder:"Enter footer text",showCount:!0,maxLength:500})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"contactEmail",label:"Contact Email",rules:[{type:"email",message:"Please enter a valid email"},{max:100,message:"Email cannot be longer than 100 characters"}],children:e.jsx(Z,{placeholder:"Enter contact email"})})}),e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"contactPhone",label:"Contact Phone",rules:[{pattern:/^[0-9-+()]*$/,message:"Please enter a valid phone number"},{max:20,message:"Phone number cannot be longer than 20 characters"}],children:e.jsx(Z,{placeholder:"Enter contact phone number"})})})]})]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(As,{level:4,children:"Footer Links"}),e.jsx(Ps,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Add useful links to the footer section"}),e.jsx(E.List,{name:"footerLinks",children:(r,{add:h,remove:f})=>e.jsxs(e.Fragment,{children:[r.map(({key:c,name:I,...m})=>e.jsxs(ie,{gutter:16,style:{marginBottom:"16px"},children:[e.jsx(F,{span:11,children:e.jsx(E.Item,{...m,name:[I,"label"],rules:[{required:!0,message:"Please enter link label"}],children:e.jsx(Z,{placeholder:"Link Label"})})}),e.jsx(F,{span:12,children:e.jsx(E.Item,{...m,name:[I,"url"],rules:[{required:!0,message:"Please enter URL"},{type:"url",message:"Please enter a valid URL"}],children:e.jsx(Z,{placeholder:"URL (e.g., https://example.com)"})})}),e.jsx(F,{span:1,style:{display:"flex",alignItems:"center"},children:e.jsx(tt,{onClick:()=>f(I)})})]},c)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>h(),block:!0,icon:e.jsx(Te,{}),children:"Add Footer Link"})})]})})]})]})},{Title:is,Text:as}=je,{TabPane:zs}=kt,ki=({form:t})=>e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto"},children:[e.jsxs(kt,{defaultActiveKey:"basic",type:"card",children:[e.jsx(zs,{tab:"Basic Amenities",children:e.jsxs(q,{className:"settings-card",children:[e.jsx(is,{level:4,children:"Basic Amenities"}),e.jsx(as,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Configure basic amenities that are included with all stall bookings based on stall size"}),e.jsx(E.List,{name:"basicAmenities",children:(s,{add:i,remove:n})=>e.jsxs(e.Fragment,{children:[s.map(({key:a,name:o,...r})=>e.jsxs(ie,{gutter:16,style:{marginBottom:"16px"},children:[e.jsx(F,{span:5,children:e.jsx(E.Item,{...r,name:[o,"type"],rules:[{required:!0,message:"Please select amenity type"}],children:e.jsxs(te,{placeholder:"Select type",children:[e.jsx(te.Option,{value:"facility",children:"Facility"}),e.jsx(te.Option,{value:"service",children:"Service"}),e.jsx(te.Option,{value:"equipment",children:"Equipment"}),e.jsx(te.Option,{value:"other",children:"Other"})]})})}),e.jsx(F,{span:6,children:e.jsx(E.Item,{...r,name:[o,"name"],rules:[{required:!0,message:"Please enter amenity name"},{max:100,message:"Name cannot be longer than 100 characters"}],children:e.jsx(Z,{placeholder:"Enter name (e.g. Tables)"})})}),e.jsx(F,{span:6,children:e.jsx(E.Item,{...r,name:[o,"description"],rules:[{required:!0,message:"Please enter amenity description"},{max:200,message:"Description cannot be longer than 200 characters"}],children:e.jsx(Z.TextArea,{placeholder:"Describe the amenity",rows:2,showCount:!0,maxLength:200})})}),e.jsx(F,{span:3,children:e.jsx(E.Item,{...r,name:[o,"perSqm"],label:e.jsxs(Q,{children:["Per sqm",e.jsx(Ve,{title:"How many square meters per 1 unit (e.g., 1 table per 9 sqm)",children:e.jsx(Qe,{})})]}),rules:[{required:!0,message:"Required"},{type:"number",min:1,message:"Must be ≥ 1"}],children:e.jsx(re,{style:{width:"100%"},placeholder:"9",min:1})})}),e.jsx(F,{span:3,children:e.jsx(E.Item,{...r,name:[o,"quantity"],label:e.jsxs(Q,{children:["Quantity",e.jsx(Ve,{title:"Default quantity to provide (e.g., 1 table for every 9 sqm)",children:e.jsx(Qe,{})})]}),rules:[{required:!0,message:"Required"},{type:"number",min:1,message:"Must be ≥ 1"}],children:e.jsx(re,{style:{width:"100%"},placeholder:"1",min:1})})}),e.jsx(F,{span:1,style:{display:"flex",alignItems:"center",paddingTop:"10px"},children:e.jsx(tt,{onClick:()=>n(o)})})]},a)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>i({type:"equipment",perSqm:9,quantity:1}),block:!0,icon:e.jsx(Te,{}),children:"Add Basic Amenity"})})]})})]})},"basic"),e.jsx(zs,{tab:"Extra Amenities",children:e.jsxs(q,{className:"settings-card",children:[e.jsx(is,{level:4,children:"Extra Amenities"}),e.jsx(as,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Configure additional amenities and facilities available at your exhibition for an extra charge"}),e.jsx(E.List,{name:"amenities",children:(s,{add:i,remove:n})=>e.jsxs(e.Fragment,{children:[s.map(({key:a,name:o,...r})=>e.jsxs(ie,{gutter:16,style:{marginBottom:"16px"},children:[e.jsx(F,{span:5,children:e.jsx(E.Item,{...r,name:[o,"type"],rules:[{required:!0,message:"Please select amenity type"}],children:e.jsxs(te,{placeholder:"Select type",children:[e.jsx(te.Option,{value:"facility",children:"Facility"}),e.jsx(te.Option,{value:"service",children:"Service"}),e.jsx(te.Option,{value:"equipment",children:"Equipment"}),e.jsx(te.Option,{value:"other",children:"Other"})]})})}),e.jsx(F,{span:6,children:e.jsx(E.Item,{...r,name:[o,"name"],rules:[{required:!0,message:"Please enter amenity name"},{max:100,message:"Name cannot be longer than 100 characters"}],children:e.jsx(Z,{placeholder:"Enter name (e.g. Power)"})})}),e.jsx(F,{span:8,children:e.jsx(E.Item,{...r,name:[o,"description"],rules:[{required:!0,message:"Please enter amenity description"},{max:200,message:"Description cannot be longer than 200 characters"}],children:e.jsx(Z.TextArea,{placeholder:"Describe the amenity",rows:2,showCount:!0,maxLength:200})})}),e.jsx(F,{span:4,children:e.jsx(E.Item,{...r,name:[o,"rate"],rules:[{required:!0,message:"Please enter rate"},{type:"number",min:0,message:"Rate must be greater than or equal to 0"}],children:e.jsx(re,{style:{width:"100%"},placeholder:"Enter rate",prefix:"₹",min:0,formatter:h=>`${h}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:h=>{const f=h?Number(h.replace(/\₹\s?|(,*)/g,"")):0;return isNaN(f)?0:f}})})}),e.jsx(F,{span:1,style:{display:"flex",alignItems:"center"},children:e.jsx(tt,{onClick:()=>n(o)})})]},a)),e.jsx(E.Item,{children:e.jsx(_,{type:"dashed",onClick:()=>i({type:"service"}),block:!0,icon:e.jsx(Te,{}),children:"Add Extra Amenity"})})]})})]})},"extra")]}),e.jsxs(q,{className:"settings-card",style:{marginTop:"24px"},children:[e.jsx(is,{level:4,children:"Special Requirements"}),e.jsx(as,{type:"secondary",style:{marginBottom:"24px",display:"block"},children:"Specify any special requirements or accessibility features"}),e.jsx(ie,{gutter:24,children:e.jsx(F,{span:24,children:e.jsx(E.Item,{name:"specialRequirements",rules:[{max:1e3,message:"Requirements cannot be longer than 1000 characters"}],children:e.jsx(Z.TextArea,{rows:4,placeholder:"Enter any special requirements or accessibility features",showCount:!0,maxLength:1e3})})})})]})]}),Os=({initialValues:t,onSubmit:s,submitText:i="Submit"})=>{const[n]=E.useForm(),a=r=>{s(r)},o=[{key:"general",label:"General",children:e.jsx(wi,{form:n})},{key:"header",label:"Header",children:e.jsx(vi,{form:n})},{key:"footer",label:"Footer",children:e.jsx(Si,{form:n})},{key:"amenities",label:"Amenities",children:e.jsx(ki,{form:n})}];return e.jsx(E,{form:n,layout:"vertical",initialValues:t,onFinish:a,style:{height:"100%"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:[e.jsx("div",{style:{flex:1,marginBottom:"24px"},children:e.jsx(kt,{defaultActiveKey:"general",items:o,type:"card"})}),e.jsx("div",{style:{textAlign:"right",borderTop:"1px solid #f0f0f0",paddingTop:"24px"},children:e.jsx(_,{type:"primary",htmlType:"submit",children:i})})]})})},Ci=()=>{const t=me(),s=Le(),i=async n=>{var a,o;try{const[r,h]=n.dateRange,f={name:n.name,description:n.description,venue:n.venue,startDate:r.toISOString(),endDate:h.toISOString(),status:n.status||"draft",isActive:n.isActive??!0,invoicePrefix:n.invoicePrefix,stallRates:n.stallRates||[],dimensions:{width:100,height:100},taxConfig:n.taxConfig||[],discountConfig:n.discountConfig||[],publicDiscountConfig:n.publicDiscountConfig||[],companyName:n.companyName,companyContactNo:n.companyContactNo,companyEmail:n.companyEmail,companyAddress:n.companyAddress,companyWebsite:n.companyWebsite,companyPAN:n.companyPAN,companyGST:n.companyGST,companySAC:n.companySAC,companyCIN:n.companyCIN,termsAndConditions:n.termsAndConditions,piInstructions:n.piInstructions,bankName:n.bankName,bankBranch:n.bankBranch,bankIFSC:n.bankIFSC,bankAccountName:n.bankAccountName,bankAccount:n.bankAccount,headerTitle:n.headerTitle,headerSubtitle:n.headerSubtitle,headerDescription:n.headerDescription,headerLogo:n.headerLogo,sponsorLogos:n.sponsorLogos||[],footerText:n.footerText,footerLogo:n.footerLogo,contactEmail:n.contactEmail,contactPhone:n.contactPhone,footerLinks:n.footerLinks||[],amenities:((a=n.amenities)==null?void 0:a.map(m=>({type:m.type,name:m.name,description:m.description,rate:m.rate})))||[],basicAmenities:((o=n.basicAmenities)==null?void 0:o.map(m=>({type:m.type,name:m.name,description:m.description,perSqm:m.perSqm,quantity:m.quantity})))||[],specialRequirements:n.specialRequirements},c=await s(Pt(f)).unwrap();ce.success("Exhibition created successfully");const I=c._id||c.id;I?t(pe({_id:I,id:I,name:f.name}),{state:{exhibitionId:I}}):(ce.error("Exhibition ID not found in response"),t("/exhibition"))}catch(r){ce.error(r.message||"Failed to create exhibition"),console.error("Error creating exhibition:",r)}};return e.jsx(q,{title:"Create New Exhibition",children:e.jsx(Os,{onSubmit:i,submitText:"Create Exhibition"})})},ha=Object.freeze(Object.defineProperty({__proto__:null,default:Ci},Symbol.toStringTag,{value:"Module"})),{Title:Fs,Text:fe,Paragraph:os}=je,rs=()=>{const t=me();return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>t("/exhibition"),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:"Back to List"})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},Ii=()=>{const{id:t}=We(),s=me(),i=Le(),{currentExhibition:n,halls:a,stalls:o,loading:r}=be(l=>l.exhibition),[h,f]=p.useState(0);p.useEffect(()=>{t&&(i(Ne(t)),i(Fe(t)),i(Ue({exhibitionId:t})))},[t,i]),p.useEffect(()=>{n&&I()},[n]);const c=()=>{if(!n)return{hallCount:0,stallCount:0,bookedStallCount:0,availableStallCount:0};const l=a.length||0;let C=o.length||0,w=o.filter(y=>y.status==="booked"||y.status==="reserved").length;return C===0&&(n.stalls&&n.stalls.length>0?(C=n.stalls.length,w=n.stalls.filter(y=>y.status==="booked"||y.status==="reserved").length):(C=n.stallCount||0,w=n.bookedStallCount||0)),{hallCount:l,stallCount:C,bookedStallCount:w,availableStallCount:C-w}},I=()=>{if(!n)return 0;const l=new Date,C=new Date(n.startDate),w=new Date(n.endDate);if(l<C)return f(0);if(l>w)return f(100);const y=w.getTime()-C.getTime(),P=l.getTime()-C.getTime();f(Math.round(P/y*100))},m=l=>{switch(l.toLowerCase()){case"published":return"#52c41a";case"draft":return"#faad14";case"completed":return"#1890ff";default:return"#d9d9d9"}},j=()=>{if(!n)return{text:"",count:0,isPast:!1};const l=new Date,C=new Date(n.startDate),w=new Date(n.endDate);return l>w?{text:"Ended",count:Math.ceil((l.getTime()-w.getTime())/864e5),isPast:!0}:l>=C&&l<=w?{text:"Days Remaining",count:Math.ceil((w.getTime()-l.getTime())/864e5),isPast:!1}:{text:"Days Until Start",count:Math.ceil((C.getTime()-l.getTime())/(1e3*60*60*24)),isPast:!1}},k=l=>{s(pe(n,l))};if(r)return e.jsxs("div",{style:{padding:"24px"},children:[e.jsx(rs,{}),e.jsx(q,{children:e.jsx(jn,{active:!0,avatar:!0,paragraph:{rows:6}})})]});if(!n)return e.jsxs("div",{style:{padding:"24px"},children:[e.jsx(rs,{}),e.jsx(q,{children:e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx(Qe,{style:{fontSize:"48px",color:"#d9d9d9",marginBottom:"16px"}}),e.jsx(Fs,{level:4,children:"Exhibition not found"}),e.jsx(os,{type:"secondary",children:"The exhibition you are looking for does not exist or has been removed."})]})})]});const v=j();return e.jsxs("div",{style:{padding:"24px",background:"#f5f7fa",minHeight:"calc(100vh - 64px)"},children:[e.jsx(rs,{}),e.jsx(q,{className:"exhibition-header-card",style:{marginBottom:"24px",borderRadius:"12px",overflow:"hidden"},bodyStyle:{padding:"0"},children:e.jsx("div",{style:{background:"linear-gradient(135deg, #1a365d 0%, #44337a 100%)",padding:"40px 24px",position:"relative"},children:e.jsxs(ie,{gutter:[24,24],align:"middle",children:[e.jsxs(F,{xs:24,md:16,children:[e.jsx(Fs,{level:2,style:{color:"white",marginBottom:"8px",marginTop:0},children:n.name}),e.jsx(os,{style:{color:"rgba(255, 255, 255, 0.8)",fontSize:"16px",marginBottom:"24px"},children:n.description}),e.jsxs(Q,{split:e.jsx(Ee,{type:"vertical",style:{background:"rgba(255,255,255,0.3)"}}),children:[e.jsxs(Q,{children:[e.jsx(Ge,{style:{color:"rgba(255,255,255,0.8)"}}),e.jsxs(fe,{style:{color:"rgba(255,255,255,0.8)"},children:[Ae(n.startDate).format("MMM D, YYYY")," - ",Ae(n.endDate).format("MMM D, YYYY")]})]}),n.venue&&e.jsxs(Q,{children:[e.jsx(St,{style:{color:"rgba(255,255,255,0.8)"}}),e.jsx(fe,{style:{color:"rgba(255,255,255,0.8)"},children:n.venue})]})]})]}),e.jsx(F,{xs:24,md:8,children:e.jsxs(q,{style:{borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",position:"relative",overflow:"visible"},children:[e.jsx("div",{style:{position:"absolute",top:"-12px",right:"-12px",zIndex:2,background:m(n.status),color:"white",padding:"4px 12px",borderRadius:"4px",fontSize:"12px",fontWeight:"bold",boxShadow:"0 2px 6px rgba(0,0,0,0.15)"},children:n.status.toUpperCase()}),e.jsx(Pe,{title:v.text,value:v.count,suffix:"days",valueStyle:{color:v.isPast?"#8c8c8c":"#1890ff",fontWeight:600},prefix:e.jsx(pt,{})}),e.jsx(Ee,{style:{margin:"16px 0"}}),e.jsx("div",{style:{marginBottom:"8px"},children:e.jsx(fe,{type:"secondary",children:"Exhibition Progress"})}),e.jsx(ft,{percent:h,status:h===100?"success":"active",strokeColor:{"0%":"#108ee9","100%":"#87d068"}})]})})]})})}),e.jsxs(ie,{gutter:[16,16],style:{marginBottom:"24px"},children:[e.jsx(F,{xs:24,sm:8,children:e.jsx(_,{type:"primary",icon:e.jsx(Ct,{}),onClick:()=>k(`${t}/layout`),block:!0,size:"large",style:{height:"48px"},children:"Manage Layout"})}),e.jsx(F,{xs:24,sm:8,children:e.jsx(_,{icon:e.jsx(ds,{}),onClick:()=>k(`${t}/edit`),block:!0,size:"large",style:{height:"48px"},children:"Edit Exhibition"})}),e.jsx(F,{xs:24,sm:8,children:e.jsx(_,{icon:e.jsx(At,{}),onClick:()=>window.open(ps(n),"_blank"),block:!0,size:"large",style:{height:"48px"},disabled:n.status!=="published",children:"View Public Page"})})]}),e.jsxs(ie,{gutter:[24,24],children:[e.jsx(F,{xs:24,lg:16,children:e.jsxs(q,{title:"Exhibition Details",style:{borderRadius:"12px",height:"100%"},children:[e.jsxs(ie,{gutter:[24,24],children:[e.jsxs(F,{xs:24,sm:12,children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Start Date"}),e.jsx(fe,{strong:!0,style:{fontSize:"16px"},children:Ae(n.startDate).format("MMMM D, YYYY")})]}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"End Date"}),e.jsx(fe,{strong:!0,style:{fontSize:"16px"},children:Ae(n.endDate).format("MMMM D, YYYY")})]}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Created At"}),e.jsx(fe,{strong:!0,style:{fontSize:"16px"},children:Ae(n.createdAt).format("MMMM D, YYYY")})]})]}),e.jsxs(F,{xs:24,sm:12,children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Status"}),e.jsx(he,{color:m(n.status),style:{padding:"4px 12px",borderRadius:"4px",fontSize:"14px"},children:n.status.toUpperCase()})]}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Active Status"}),e.jsx(he,{color:n.isActive?"#52c41a":"#f5222d",style:{padding:"4px 12px",borderRadius:"4px",fontSize:"14px"},children:n.isActive?"ACTIVE":"INACTIVE"})]}),n.venue&&e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Venue"}),e.jsx(fe,{strong:!0,style:{fontSize:"16px"},children:n.venue})]})]})]}),e.jsx(Ee,{}),e.jsxs("div",{children:[e.jsx(fe,{type:"secondary",style:{display:"block",marginBottom:"8px"},children:"Description"}),e.jsx(os,{children:n.description||"No description provided."})]})]})}),e.jsxs(F,{xs:24,lg:8,children:[e.jsx(q,{title:"Exhibition Stats",style:{borderRadius:"12px",marginBottom:"24px"},children:e.jsxs(ie,{gutter:[16,24],children:[e.jsx(F,{span:12,children:e.jsx(Pe,{title:"Halls",value:c().hallCount,prefix:e.jsx(It,{})})}),e.jsx(F,{span:12,children:e.jsx(Pe,{title:"Stalls",value:c().stallCount,prefix:e.jsx(Et,{})})}),e.jsx(F,{span:12,children:e.jsx(Pe,{title:"Booked Stalls",value:c().bookedStallCount,prefix:e.jsx(bt,{})})}),e.jsx(F,{span:12,children:e.jsx(Pe,{title:"Available Stalls",value:c().availableStallCount,prefix:e.jsx(_n,{})})})]})}),e.jsx(q,{title:"Created By",style:{borderRadius:"12px"},children:n.createdBy?e.jsxs(Q,{children:[e.jsx(wn,{icon:e.jsx(qn,{})}),e.jsx(fe,{children:n.createdByName||"Administrator"})]}):e.jsx(fe,{type:"secondary",children:"Information not available"})})]})]})]})},pa=Object.freeze(Object.defineProperty({__proto__:null,default:Ii},Symbol.toStringTag,{value:"Module"})),Ei=()=>{var k;const{message:t}=nt.useApp(),{id:s}=We(),n=(k=ut().state)==null?void 0:k.exhibitionId,a=me(),o=Le(),{currentExhibition:r,loading:h,error:f}=be(v=>v.exhibition),[c,I]=p.useState(!1);p.useEffect(()=>{(async()=>{if(!n){t.error("Exhibition ID not found"),a("/exhibition");return}try{await o(Ne(n)).unwrap()}catch(l){t.error(l.message||"Failed to fetch exhibition"),a("/exhibition")}finally{I(!0)}})()},[n,o,t,a]),p.useEffect(()=>{f&&t.error(f)},[f,t]);const m=async v=>{var l,C;if(!(!n||!r))try{const[w,y]=v.dateRange,P={name:v.name,description:v.description,venue:v.venue,startDate:w.toISOString(),endDate:y.toISOString(),status:v.status,isActive:v.isActive,invoicePrefix:v.invoicePrefix,stallRates:v.stallRates||[],dimensions:r.dimensions,taxConfig:v.taxConfig||[],discountConfig:v.discountConfig||[],publicDiscountConfig:v.publicDiscountConfig||[],companyName:v.companyName,companyContactNo:v.companyContactNo,companyEmail:v.companyEmail,companyAddress:v.companyAddress,companyWebsite:v.companyWebsite,companyPAN:v.companyPAN,companyGST:v.companyGST,companySAC:v.companySAC,companyCIN:v.companyCIN,termsAndConditions:v.termsAndConditions,piInstructions:v.piInstructions,bankName:v.bankName,bankBranch:v.bankBranch,bankIFSC:v.bankIFSC,bankAccountName:v.bankAccountName,bankAccount:v.bankAccount,headerTitle:v.headerTitle,headerSubtitle:v.headerSubtitle,headerDescription:v.headerDescription,headerLogo:v.headerLogo,sponsorLogos:v.sponsorLogos||[],footerText:v.footerText,footerLogo:v.footerLogo,contactEmail:v.contactEmail,contactPhone:v.contactPhone,footerLinks:v.footerLinks||[],amenities:((l=v.amenities)==null?void 0:l.map(g=>({type:g.type,name:g.name,description:g.description,rate:g.rate})))||[],basicAmenities:((C=v.basicAmenities)==null?void 0:C.map(g=>({type:g.type,name:g.name,description:g.description,perSqm:g.perSqm,quantity:g.quantity})))||[],specialRequirements:v.specialRequirements};await o(zt({id:n,data:P})).unwrap(),t.success("Exhibition updated successfully"),a(pe(r),{state:{exhibitionId:n}})}catch(w){t.error(w.message||"Failed to update exhibition")}};if(!c)return e.jsx(q,{loading:!0});if(!n)return e.jsx(vn,{to:"/exhibition",replace:!0});if(h||!r)return e.jsx(q,{loading:!0});const j={name:r.name,description:r.description,venue:r.venue,dateRange:[Ae(r.startDate),Ae(r.endDate)],status:r.status,isActive:r.isActive,invoicePrefix:r.invoicePrefix,stallRates:r.stallRates||[],taxConfig:r.taxConfig||[],discountConfig:r.discountConfig||[],publicDiscountConfig:r.publicDiscountConfig||[],companyName:r.companyName,companyContactNo:r.companyContactNo,companyEmail:r.companyEmail,companyAddress:r.companyAddress,companyWebsite:r.companyWebsite,companyPAN:r.companyPAN,companyGST:r.companyGST,companySAC:r.companySAC,companyCIN:r.companyCIN,termsAndConditions:r.termsAndConditions,piInstructions:r.piInstructions,bankName:r.bankName,bankBranch:r.bankBranch,bankIFSC:r.bankIFSC,bankAccountName:r.bankAccountName,bankAccount:r.bankAccount,headerTitle:r.headerTitle,headerSubtitle:r.headerSubtitle,headerDescription:r.headerDescription,headerLogo:r.headerLogo,sponsorLogos:r.sponsorLogos||[],footerText:r.footerText,footerLogo:r.footerLogo,contactEmail:r.contactEmail,contactPhone:r.contactPhone,footerLinks:r.footerLinks||[],amenities:r.amenities||[],basicAmenities:r.basicAmenities||[],specialRequirements:r.specialRequirements};return e.jsx(q,{title:"Edit Exhibition",extra:e.jsx("a",{onClick:()=>a(pe(r),{state:{exhibitionId:n}}),children:"Back to Details"}),children:e.jsx(Os,{initialValues:j,onSubmit:m,submitText:"Update Exhibition"})})},ua=Object.freeze(Object.defineProperty({__proto__:null,default:Ei},Symbol.toStringTag,{value:"Module"})),Ti=({exhibitionId:t,destination:s="layout",label:i="Back to Layout"})=>{const n=me(),{currentExhibition:a}=be(o=>o.exhibition);return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>n(pe(a,s),{state:{exhibitionId:t}}),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:i})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},Ni=()=>{var v;const{id:t}=We(),s=ut(),i=me(),n=Le(),a=((v=s.state)==null?void 0:v.exhibitionId)||t,{currentExhibition:o}=be(l=>l.exhibition),r=p.useRef(null),[h,f]=p.useState({width:100,height:100}),[c,I]=p.useState({width:0,height:0}),[m]=E.useForm();p.useEffect(()=>{if(!a){ce.error("Exhibition ID not found"),i("/exhibition");return}n(Ne(a))},[a,n,i]),p.useEffect(()=>{o!=null&&o.dimensions&&(f(o.dimensions),m.setFieldsValue(o.dimensions))},[o,m]),p.useEffect(()=>{const l=()=>{r.current&&I({width:r.current.clientWidth,height:r.current.clientHeight})};return l(),window.addEventListener("resize",l),()=>window.removeEventListener("resize",l)},[]);const j=async()=>{try{const l=await m.validateFields();await le.updateExhibition(a,{dimensions:l}),ce.success("Exhibition space saved successfully"),await n(Ne(a)).unwrap(),i(pe(o,"layout"),{state:{exhibitionId:a}})}catch{ce.error("Failed to save exhibition space")}},k=l=>{f(C=>({...C,...l})),m.setFieldsValue(l)};return e.jsxs("div",{style:{padding:"24px"},children:[e.jsx(Ti,{exhibitionId:a}),e.jsx(q,{title:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{children:"Exhibition Space Setup"}),e.jsx(_,{type:"primary",icon:e.jsx(cs,{}),onClick:j,children:"Save and Continue"})]}),children:e.jsxs("div",{style:{display:"flex",gap:"24px",height:"calc(100vh - 200px)"},children:[e.jsx("div",{style:{flex:"0 0 300px"},children:e.jsxs(E,{form:m,layout:"vertical",initialValues:h,children:[e.jsx(E.Item,{name:"width",label:"Width (meters)",rules:[{required:!0,message:"Please enter width"},{type:"number",min:10,message:"Width must be at least 10 meters"}],children:e.jsx(re,{min:10,max:1e3,style:{width:"100%"},onChange:l=>k({width:l||10})})}),e.jsx(E.Item,{name:"height",label:"Height (meters)",rules:[{required:!0,message:"Please enter height"},{type:"number",min:10,message:"Height must be at least 10 meters"}],children:e.jsx(re,{min:10,max:1e3,style:{width:"100%"},onChange:l=>k({height:l||10})})})]})}),e.jsx("div",{ref:r,style:{flex:"1",border:"1px solid #d9d9d9",borderRadius:"8px",position:"relative",overflow:"hidden"},children:e.jsx(Ut,{children:e.jsx(Tt,{width:c.width,height:c.height,exhibitionWidth:h.width,exhibitionHeight:h.height,onExhibitionChange:k})})})]})})]})},xa=Object.freeze(Object.defineProperty({__proto__:null,default:Ni},Symbol.toStringTag,{value:"Module"})),Di=({exhibitionId:t})=>{const s=me(),{currentExhibition:i}=be(n=>n.exhibition);return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>s(pe(i),{state:{exhibitionId:t}}),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:"Back to Exhibition"})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},Ri=()=>{var h,f,c,I,m;const{id:t}=We(),s=ut(),i=me(),n=Le(),a=((h=s.state)==null?void 0:h.exhibitionId)||t,{currentExhibition:o,halls:r}=be(j=>j.exhibition);return p.useEffect(()=>{a&&(n(Ne(a)),n(Fe(a)))},[a,n]),e.jsxs("div",{style:{padding:"24px"},children:[e.jsx(Di,{exhibitionId:a}),e.jsxs(ie,{gutter:[24,24],children:[e.jsx(F,{xs:24,sm:12,md:8,children:e.jsxs(q,{hoverable:!0,style:{height:"100%",background:"#fff",borderRadius:"8px"},bodyStyle:{padding:"24px"},children:[e.jsx("div",{style:{height:140,background:"#f0f2f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",marginBottom:"16px"},children:e.jsx(Ct,{style:{fontSize:"48px",color:"#1890ff"}})}),e.jsx(q.Meta,{title:"Exhibition Space",description:"Set up and manage the exhibition space dimensions",style:{marginBottom:"16px"}}),e.jsx(_,{type:"primary",onClick:()=>i(pe(o,"space"),{state:{exhibitionId:a}}),style:{background:"#7828C8",borderColor:"#7828C8"},children:"Manage"})]})}),e.jsx(F,{xs:24,sm:12,md:8,children:e.jsxs(q,{hoverable:!0,style:{height:"100%",background:"#fff",borderRadius:"8px"},bodyStyle:{padding:"24px"},children:[e.jsx("div",{style:{height:140,background:"#f0f2f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",marginBottom:"16px"},children:e.jsx(It,{style:{fontSize:"48px",color:"#1890ff"}})}),e.jsx(q.Meta,{title:"Hall Management",description:"Create and manage exhibition halls",style:{marginBottom:"16px"}}),e.jsx(_,{type:"primary",disabled:!((f=o==null?void 0:o.dimensions)!=null&&f.width)||!((c=o==null?void 0:o.dimensions)!=null&&c.height),onClick:()=>i(pe(o,"halls"),{state:{exhibitionId:a}}),style:{background:"#7828C8",borderColor:"#7828C8"},children:"Manage"})]})}),e.jsx(F,{xs:24,sm:12,md:8,children:e.jsxs(q,{hoverable:!0,style:{height:"100%",background:"#fff",borderRadius:"8px"},bodyStyle:{padding:"24px"},children:[e.jsx("div",{style:{height:140,background:"#f0f2f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",marginBottom:"16px"},children:e.jsx(Et,{style:{fontSize:"48px",color:"#1890ff"}})}),e.jsx(q.Meta,{title:"Stall Management",description:"Create and manage stalls within halls",style:{marginBottom:"16px"}}),e.jsx(_,{type:"primary",disabled:!r.length,onClick:()=>i(pe(o,"stalls"),{state:{exhibitionId:a}}),style:{background:"#7828C8",borderColor:"#7828C8"},children:"Manage"})]})}),e.jsx(F,{xs:24,sm:12,md:8,children:e.jsxs(q,{hoverable:!0,style:{height:"100%",background:"#fff",borderRadius:"8px"},bodyStyle:{padding:"24px"},children:[e.jsx("div",{style:{height:140,background:"#f0f2f5",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",marginBottom:"16px"},children:e.jsx(Bs,{style:{fontSize:"48px",color:"#1890ff"}})}),e.jsx(q.Meta,{title:"Fixture Management",description:"Add sofas, chairs, entrances and other fixtures to the layout",style:{marginBottom:"16px"}}),e.jsx(_,{type:"primary",disabled:!((I=o==null?void 0:o.dimensions)!=null&&I.width)||!((m=o==null?void 0:o.dimensions)!=null&&m.height),onClick:()=>i(pe(o,"fixtures"),{state:{exhibitionId:a}}),style:{background:"#7828C8",borderColor:"#7828C8"},children:"Manage"})]})})]})]})},ma=Object.freeze(Object.defineProperty({__proto__:null,default:Ri},Symbol.toStringTag,{value:"Module"})),Ai=({exhibitionId:t,destination:s="layout",label:i="Back to Layout"})=>{const n=me(),{currentExhibition:a}=be(o=>o.exhibition);return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>n(pe(a,s),{state:{exhibitionId:t}}),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:i})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},Pi=()=>{var d,x,S;const{id:t}=We(),s=ut(),i=me(),n=Le(),a=((d=s.state)==null?void 0:d.exhibitionId)||t,{currentExhibition:o,halls:r}=be(u=>u.exhibition),h=p.useRef(null),[f,c]=ce.useMessage(),[I,m]=p.useState(!1),[j,k]=p.useState(null),[v,l]=p.useState({width:0,height:0});p.useEffect(()=>{const u=()=>{if(h.current){const{clientWidth:L,clientHeight:R}=h.current;l({width:Math.max(L||400,400),height:Math.max(R||400,400)})}};u();const A=new ResizeObserver(u);return h.current&&A.observe(h.current),window.addEventListener("resize",u),()=>{A.disconnect(),window.removeEventListener("resize",u)}},[]),p.useEffect(()=>{if(!a){f.error("Exhibition ID not found"),i("/exhibition");return}n(Ne(a))},[a,n,i,f]),p.useEffect(()=>{var u,A;if(o){if(!((u=o.dimensions)!=null&&u.width)||!((A=o.dimensions)!=null&&A.height)){f.info("Please set up exhibition space first"),i(pe(o,"space"),{state:{exhibitionId:a}});return}n(Fe(a))}},[o,a,n,i,f]);const C=()=>{k(null),m(!0)},w=u=>{k(u),m(!!u)},y=async u=>{var A;try{u.id?(await le.updateHall(a,u.id,u),f.success("Hall updated successfully"),m(!1)):(await le.createHall(a,u),f.success("Hall created successfully"),m(!1)),n(Fe(a))}catch(L){console.error("Hall operation failed:",L),((A=L.response)==null?void 0:A.status)===409?f.warning({content:L.response.data.message,duration:6,style:{marginTop:"20vh"}}):(f.error(L.message||"Failed to save hall"),m(!1))}},P=async u=>{var A,L;try{const R=u._id||u.id;if(!R)throw new Error("Hall ID is required");await le.deleteHall(a,R),f.success("Hall deleted successfully"),m(!1),k(null),n(Fe(a))}catch(R){console.error("Failed to delete hall:",R),f.error(((L=(A=R.response)==null?void 0:A.data)==null?void 0:L.message)||"Failed to delete hall")}},g=async()=>{try{await le.saveLayout(a,r),f.success("Layout saved successfully")}catch{f.error("Failed to save layout")}};return e.jsxs("div",{style:{padding:"24px",height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsx(Ai,{exhibitionId:a}),c,e.jsx(q,{title:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs(Q,{children:[e.jsx("span",{children:"Hall Management"}),e.jsx(_,{icon:e.jsx(_s,{}),onClick:()=>i(pe(o,"space"),{state:{exhibitionId:a}}),children:"Back to Space Setup"})]}),e.jsxs(Q,{children:[e.jsx(_,{type:"primary",icon:e.jsx(Te,{}),onClick:C,children:"Add Hall"}),e.jsx(_,{type:"primary",icon:e.jsx(cs,{}),onClick:g,disabled:!r.length,children:"Save Layout"})]})]}),styles:{body:{flex:1,padding:0,overflow:"hidden",minHeight:"400px",position:"relative",background:"#fafafa"}},style:{flex:1,display:"flex",flexDirection:"column",height:"100%",minHeight:"500px"},children:e.jsx("div",{ref:h,style:{position:"absolute",top:0,left:0,right:0,bottom:0,overflow:"hidden"},children:e.jsx(Ut,{children:v.width>0&&v.height>0&&(o==null?void 0:o.dimensions)&&e.jsx(Tt,{width:v.width,height:v.height,exhibitionWidth:o.dimensions.width,exhibitionHeight:o.dimensions.height,halls:r,selectedHall:j,onSelectHall:w,onHallChange:y,onAddHall:C})})})}),e.jsx(Yn,{visible:I,hall:j,onCancel:()=>m(!1),onSubmit:y,onDelete:P,exhibitionWidth:((x=o==null?void 0:o.dimensions)==null?void 0:x.width)||100,exhibitionHeight:((S=o==null?void 0:o.dimensions)==null?void 0:S.height)||100})]})},ga=Object.freeze(Object.defineProperty({__proto__:null,default:Pi},Symbol.toStringTag,{value:"Module"})),zi=({exhibitionId:t,destination:s="layout",label:i="Back to Layout"})=>{const n=me(),{currentExhibition:a}=be(o=>o.exhibition);return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>n(pe(a,s),{state:{exhibitionId:t}}),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:i})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},Fi=()=>{var N,$,X;const{message:t}=nt.useApp(),{id:s}=We(),i=ut(),n=me(),a=Le(),[o,r]=Sn(),h=((N=i.state)==null?void 0:N.exhibitionId)||s,{currentExhibition:f,halls:c,stalls:I,loading:m}=be(D=>D.exhibition),j=p.useRef(null),[k,v]=p.useState(!1),[l,C]=p.useState(null),[w,y]=p.useState(null),[P,g]=p.useState({width:0,height:0}),[d,x]=p.useState(!1);p.useEffect(()=>{if(!h){t.error("Exhibition ID not found"),n("/exhibitions");return}},[h,n,t]),p.useEffect(()=>{if(!h){t.error("Exhibition ID not found"),n("/exhibition");return}(async()=>{try{await a(Ne(h)).unwrap(),await a(Fe(h)).unwrap(),x(!0)}catch{t.error("Failed to load data")}})()},[h,a,n]),p.useEffect(()=>{var D,B;!d||!f||(!((D=f.dimensions)!=null&&D.width)||!((B=f.dimensions)!=null&&B.height))&&(t.info("Please set up exhibition space first"),n(pe(f,"space"),{state:{exhibitionId:h}}))},[f,h,n,d]),p.useEffect(()=>{!d||m||c.length===0&&(t.info("Please create halls first"),n(pe(f,"halls"),{state:{exhibitionId:h}}))},[c,h,n,m,d]),p.useEffect(()=>{d&&f&&c.length>0&&(async()=>{try{const B=c.map(Y=>a(Ue({exhibitionId:h,hallId:Y.id})).unwrap());await Promise.all(B)}catch(B){console.error("Error fetching stalls:",B),t.error("Failed to load stalls")}})()},[f,h,c,a,d]);const S=I.filter(D=>D.hallId===((l==null?void 0:l.id)||(l==null?void 0:l._id)));p.useEffect(()=>{if(!d||c.length===0)return;const D=o.get("hallId");if(D){const B=c.find(Y=>Y.id===D||Y._id===D);if(B)C(B);else if(c.length>0){C(c[0]);const Y=c[0].id||c[0]._id;Y&&r({hallId:Y.toString()})}}else if(c.length>0){C(c[0]);const B=c[0].id||c[0]._id;B&&r({hallId:B.toString()})}},[c,o,d,r]),p.useEffect(()=>{const D=()=>{if(j.current){const{clientWidth:Y,clientHeight:M}=j.current;g({width:Math.max(Y||400,400),height:Math.max(M||400,400)})}};D();const B=new ResizeObserver(D);return j.current&&B.observe(j.current),window.addEventListener("resize",D),()=>{B.disconnect(),window.removeEventListener("resize",D)}},[]);const u=()=>{if(!l){t.warning("Please select a hall first");return}y(null),v(!0)},A=D=>{if(C(D),y(null),D){const B=D.id||D._id;r(B?{hallId:B.toString()}:{})}else r({})},L=D=>{var Y;const B=D?{...D,id:D.id||D._id,_id:D._id||D.id,stallTypeId:typeof D.stallTypeId=="string"?D.stallTypeId:((Y=D.stallTypeId)==null?void 0:Y._id)||D.stallTypeId,stallType:D.stallType}:null;console.log("Selected stall data:",B),y(B),v(!!B)},R=async D=>{var B,Y;try{if(!(l!=null&&l.id)&&!(l!=null&&l._id)){t.error("No hall selected");return}const M=l.id,z=l._id||l.id;if(D.hallId&&D.hallId!==z){t.error("Cannot move stall to a different hall");return}if(console.log("Submitting stall data:",D),D.id||D._id){const W={...D,id:D.id,_id:D._id,hallId:z,stallTypeId:D.stallTypeId};console.log("Update data:",W);const U=D.id||D._id;if(!U)throw new Error("Stall ID is missing");await le.updateStall(h,U,W),t.success("Stall updated successfully")}else{const{id:W,_id:U,...ee}=D,se={...ee,hallId:z,stallTypeId:D.stallTypeId};console.log("Creating new stall with data:",se),await le.createStall(h,se),t.success("Stall created successfully")}v(!1),a(Ue({exhibitionId:h,hallId:M}))}catch(M){console.error("Error saving stall:",M),t.error(((Y=(B=M.response)==null?void 0:B.data)==null?void 0:Y.message)||"Failed to save stall")}},H=async D=>{var B,Y;try{if(!h){t.error("Exhibition ID not found");return}const M=l;if(!M){t.error("No hall selected");return}const z=M.id||M._id;if(!z){t.error("Invalid hall ID");return}await le.deleteStall(h,D),v(!1),y(null),await a(Ue({exhibitionId:h,hallId:z})).unwrap(),t.success("Stall deleted successfully")}catch(M){console.error("Error deleting stall:",M),t.error(((Y=(B=M.response)==null?void 0:B.data)==null?void 0:Y.message)||"Failed to delete stall")}},V=async D=>{var z,W;if(!h){t.error("Exhibition ID not found");return}const B=D.id||D._id;if(!B){console.error("Stall data:",D),t.error("Stall ID not found");return}if(!(l!=null&&l.id)&&!(l!=null&&l._id)){t.error("No hall selected");return}const Y=l.id,M=l._id||l.id;try{await le.updateStall(h,B,{...D,id:B,hallId:M}),a(Ue({exhibitionId:h,hallId:Y}))}catch(U){console.error("Stall update error:",U),t.error(((W=(z=U.response)==null?void 0:z.data)==null?void 0:W.message)||"Failed to update stall position")}},b=()=>{v(!1),y(null)};return e.jsx(Ut,{children:e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx("div",{style:{padding:"24px 24px 0"},children:e.jsx(zi,{exhibitionId:h})}),e.jsx(q,{title:"Stall Manager",extra:e.jsxs(Q,{children:[e.jsx(_,{icon:e.jsx(_s,{}),onClick:()=>n(`/exhibition/${h}`,{state:{exhibitionId:h}}),children:"Back to Exhibition"}),e.jsx(_,{type:"primary",icon:e.jsx(Te,{}),onClick:u,disabled:!l,children:"Add Stall"})]}),style:{flex:1},bodyStyle:{height:"calc(100% - 57px)"},children:e.jsx("div",{ref:j,style:{width:"100%",height:"100%",minHeight:"400px",background:"#f0f2f5",borderRadius:"8px",overflow:"hidden"},children:f&&e.jsx(Tt,{width:P.width,height:P.height,exhibitionWidth:(($=f.dimensions)==null?void 0:$.width)||100,exhibitionHeight:((X=f.dimensions)==null?void 0:X.height)||100,halls:c,selectedHall:l,onSelectHall:A,isStallMode:!0,children:l&&S.map(D=>e.jsx(hs,{stall:D,isSelected:(w==null?void 0:w.id)===D.id||(w==null?void 0:w._id)===D._id,onSelect:()=>L(D),onChange:V,hallWidth:l.dimensions.width,hallHeight:l.dimensions.height,hallX:l.dimensions.x,hallY:l.dimensions.y},D.id||D._id))})})}),f&&e.jsx(Gn,{visible:k,stall:w,hall:l,exhibition:f,onCancel:b,onSubmit:R,onDelete:w?()=>H(w.id||w._id):void 0})]})})},fa=Object.freeze(Object.defineProperty({__proto__:null,default:Fi},Symbol.toStringTag,{value:"Module"})),Li=({exhibitionId:t,destination:s="layout",label:i="Back to Layout"})=>{const n=me(),{currentExhibition:a}=be(o=>o.exhibition);return e.jsxs("div",{style:{marginBottom:"24px",position:"sticky",top:"16px",zIndex:10},children:[e.jsx(_,{icon:e.jsx(xt,{}),onClick:()=>n(pe(a,s),{state:{exhibitionId:t}}),type:"default",size:"large",style:{borderRadius:"8px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)",background:"white",borderColor:"transparent",fontWeight:500,padding:"0 16px",height:"42px",display:"flex",alignItems:"center",transition:"all 0.3s ease"},className:"back-button-hover",children:e.jsx("span",{style:{marginLeft:8},children:i})}),e.jsx("style",{children:`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `})]})},$i=[{value:"all",label:"All Types"},{value:"sofa",label:"Sofas"},{value:"chair",label:"Chairs"},{value:"table",label:"Tables"},{value:"desk",label:"Desks"},{value:"plant",label:"Plants"},{value:"entrance",label:"Entrances"},{value:"exit",label:"Exits"},{value:"info",label:"Information"},{value:"restroom",label:"Restrooms"},{value:"food",label:"Food Areas"},{value:"custom",label:"Custom"}],Mi=()=>{var R,H,V;const{message:t}=nt.useApp(),{id:s}=We(),i=ut(),n=me(),a=Le(),o=((R=i.state)==null?void 0:R.exhibitionId)||s,{currentExhibition:r,fixtures:h,halls:f,stalls:c,loading:I}=be(b=>b.exhibition),m=p.useRef(null),[j,k]=p.useState(!1),[v,l]=p.useState(null),[C,w]=p.useState({width:0,height:0}),[y,P]=p.useState("all"),[g,d]=p.useState([]);p.useEffect(()=>{if(!o){t.error("Exhibition ID not found"),n("/exhibitions");return}},[o,n,t]),p.useEffect(()=>{(async()=>{try{await a(Ne(o)).unwrap(),await a(wt({exhibitionId:o})).unwrap(),await a(Fe(o)).unwrap(),await a(Ue({exhibitionId:o})).unwrap()}catch{t.error("Failed to load data")}})()},[o,a,t]),p.useEffect(()=>{d(y==="all"?h:h.filter(b=>b.type===y))},[h,y]),p.useEffect(()=>{const b=()=>{if(m.current){const{clientWidth:$,clientHeight:X}=m.current;w({width:Math.max($||400,400),height:Math.max(X||400,400)})}};b();const N=new ResizeObserver(b);return m.current&&N.observe(m.current),window.addEventListener("resize",b),()=>{N.disconnect(),window.removeEventListener("resize",b)}},[]);const x=()=>{l(null),k(!0)},S=b=>{l(b),k(!!b)},u=async b=>{try{b.id||b._id?(await a(Lt({exhibitionId:o,id:b.id||b._id||"",data:b})).unwrap(),t.success("Fixture updated successfully")):(await a(Ft({exhibitionId:o,data:b})).unwrap(),t.success("Fixture created successfully")),await a(wt({exhibitionId:o})).unwrap(),k(!1)}catch(N){console.error("Failed to save fixture:",N),t.error(N.message||"Failed to save fixture")}},A=async b=>{try{const N=b.id||b._id;if(!N)throw new Error("Fixture ID is required");await a($t({exhibitionId:o,id:N})).unwrap(),t.success("Fixture deleted successfully"),k(!1),l(null)}catch(N){console.error("Failed to delete fixture:",N),t.error(N.message||"Failed to delete fixture")}},L=b=>{P(b)};return e.jsxs("div",{style:{padding:"24px",height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsx(Li,{exhibitionId:o}),e.jsxs(q,{title:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(Q,{children:e.jsx("span",{children:"Fixture Management"})}),e.jsxs(Q,{children:[e.jsx(te,{style:{width:180},value:y,onChange:L,options:$i}),e.jsx(_,{type:"primary",icon:e.jsx(Te,{}),onClick:x,children:"Add Fixture"})]})]}),styles:{body:{flex:1,padding:0,overflow:"hidden",minHeight:"400px",position:"relative",background:"#fafafa"}},style:{flex:1,display:"flex",flexDirection:"column",height:"100%",minHeight:"500px"},children:[e.jsx("div",{style:{padding:"8px 16px",background:"#f0f7ff",borderBottom:"1px solid #d6e8ff",color:"#0050b3",fontSize:"14px"},children:"Halls and stalls are shown for reference. Place fixtures relative to these elements to enhance visitor navigation."}),e.jsx("div",{ref:m,style:{position:"absolute",top:33,left:0,right:0,bottom:0,overflow:"hidden"},children:e.jsx(Ut,{children:C.width>0&&C.height>0&&(r==null?void 0:r.dimensions)&&e.jsx(Tt,{width:C.width,height:C.height,exhibitionWidth:r.dimensions.width,exhibitionHeight:r.dimensions.height,halls:f,stalls:c,fixtures:g,selectedFixture:v,onSelectFixture:S,onFixtureChange:u,onAddFixture:x,isFixtureMode:!0})})})]}),e.jsx(ei,{visible:j,fixture:v,onCancel:()=>k(!1),onSubmit:u,onDelete:A,exhibitionWidth:((H=r==null?void 0:r.dimensions)==null?void 0:H.width)||100,exhibitionHeight:((V=r==null?void 0:r.dimensions)==null?void 0:V.height)||100})]})},ba=Object.freeze(Object.defineProperty({__proto__:null,default:Mi},Symbol.toStringTag,{value:"Module"}));export{ia as P,Ne as a,Ue as b,na as c,sa as d,da as e,Xe as f,ps as g,ha as h,ca as i,pa as j,ua as k,xa as l,ma as m,ga as n,fa as o,ba as p};
