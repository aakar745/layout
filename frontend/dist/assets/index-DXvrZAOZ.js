const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-dashboard-DAvQsPhE.js","assets/vendor-react-core-GL8v-krj.js","assets/vendor-ui-utils-C1xmPZI8.js","assets/vendor-canvas-DygNVcxM.js","assets/vendor-deps-j0W__MH0.js","assets/vendor-react-dom-22Ywsp5_.js","assets/vendor-antd-core-1s5t57SE.js","assets/vendor-antd-icons-C-4QrCZ0.js","assets/vendor-date-utils-CEjhVsrT.js","assets/vendor-react-core-f_XpeFrr.css","assets/app-core-BUxrPMxd.js","assets/vendor-redux-9XI87JsB.js","assets/app-auth-pav3ebXF.js","assets/vendor-react-router-BoDVXa_L.js","assets/vendor-http-t--hEgTQ.js","assets/app-admin-iCKr2TyV.js","assets/app-core-DU_-Labf.css","assets/app-dashboard-CUgo7HtP.css","assets/app-exhibitor-CjvJHpDU.js","assets/app-invoice-D3-oPHO9.js","assets/app-exhibition-Vu8xGXtg.js","assets/app-invoice-BaZgAriD.css","assets/Profile-Bo5Xa6cY.js","assets/index-BSyVroit.js","assets/app-stall-Bo1-c6b4.js","assets/app-booking-E9aWubKZ.js","assets/vendor-export-UJ8MX7yK.js","assets/index-Si21LjQx.js","assets/index-XVcQs4cz.css"])))=>i.map(i=>d[i]);
import{r as s,j as e,R as ie}from"./vendor-react-core-GL8v-krj.js";import{c as se}from"./vendor-react-dom-22Ywsp5_.js";import{u as re,b as Q,d as oe,f as ne,e as ae,P as le}from"./vendor-redux-9XI87JsB.js";import{_ as r,b as de}from"./app-booking-E9aWubKZ.js";import{u as ce,B as xe,R as he,d as i,N as O}from"./vendor-react-router-BoDVXa_L.js";import{G as pe,r as me,q as je,j as ge,E as T,w as v,M as n}from"./app-core-BUxrPMxd.js";import{a as ue,L as be,c as ye,d as fe}from"./app-auth-pav3ebXF.js";import{g as ve,P as _e,c as Ee,d as we,e as ke}from"./app-exhibition-Vu8xGXtg.js";import{n as g}from"./vendor-ui-utils-C1xmPZI8.js";import{T as Re,w as K,a as V,h as Z,B as A,R as y,C as a,S as M,Q as Ce,j as D,Y as Ae,f as $,A as X,o as Se,Z as De}from"./vendor-antd-core-1s5t57SE.js";import{a9 as q,a8 as H,V as ze,aM as Ie,i as k,u as z,J as N,m as Le,aN as Y,_ as Ne,L as Pe}from"./vendor-antd-icons-C-4QrCZ0.js";import{e as P,a as Fe}from"./app-exhibitor-CjvJHpDU.js";import{a as Be,r as Te,s as Oe}from"./app-admin-iCKr2TyV.js";import{i as F}from"./app-invoice-D3-oPHO9.js";import"./vendor-canvas-DygNVcxM.js";import"./vendor-deps-j0W__MH0.js";import"./app-dashboard-DAvQsPhE.js";import"./vendor-http-t--hEgTQ.js";import"./vendor-date-utils-CEjhVsrT.js";import"./vendor-export-UJ8MX7yK.js";(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))S(h);new MutationObserver(h=>{for(const m of h)if(m.type==="childList")for(const f of m.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&S(f)}).observe(document,{childList:!0,subtree:!0});function u(h){const m={};return h.integrity&&(m.integrity=h.integrity),h.referrerPolicy&&(m.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?m.credentials="include":h.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function S(h){if(h.ep)return;h.ep=!0;const m=u(h);fetch(h.href,m)}})();const{Title:x,Paragraph:c,Text:I}=Re,{Content:Ve}=K,We=t=>{if(!t)return"/exhibition-placeholder.jpg";if(t.startsWith("/")||t.startsWith("http"))return t;const d=t.startsWith("/")?t.substring(1):t;return d.includes("logos/")||d.includes("sponsors/")?`${ge.defaults.baseURL}/public/images/${d}`:"/exhibition-placeholder.jpg"},Me=g(Ve)`
  padding-top: 64px;
`,$e=g.div`
  background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  padding: 80px 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`,qe=g.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`,He=g.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,_=g(V)`
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
`,Ye=g(V)`
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
`,R=g(x)`
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
`,E=g.div`
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
`,L=g.div`
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
`,U=g.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`,Ue=g(Z)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 50px;
`,G=g(A)`
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
`,C=g.div`
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
`;g.div`
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
`;const Ge=()=>{const t=ce(),d=re(),[u,S]=s.useState([]),[h,m]=s.useState(!0);s.useEffect(()=>{(async()=>{try{m(!0);const p=await je.getExhibitions();S(p.data.slice(0,4))}catch(p){console.error("Failed to fetch exhibitions:",p)}finally{m(!1)}})()},[]);const f=o=>{const p={year:"numeric",month:"short",day:"numeric"};return new Date(o).toLocaleDateString(void 0,p)},ee=(o,p)=>{const b=new Date,j=new Date(o),te=new Date(p);return b<j?{status:"Upcoming",color:"#722ED1"}:b>te?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},W=()=>{d(ue(void 0))};return e.jsxs(K,{children:[e.jsx(pe,{}),e.jsxs(Me,{children:[e.jsxs($e,{children:[e.jsx(qe,{}),e.jsx(He,{children:e.jsxs(y,{gutter:[48,48],align:"middle",children:[e.jsxs(a,{xs:24,lg:14,children:[e.jsx(x,{level:1,style:{fontSize:"3.5rem",marginBottom:24,color:"white",fontWeight:700},children:"Book Your Exhibition Space with Ease"}),e.jsx(c,{style:{fontSize:"1.2rem",marginBottom:40,color:"rgba(255, 255, 255, 0.9)"},children:"Explore upcoming exhibitions, select your perfect stall, and secure your spot all in one place. Manage your exhibition presence effortlessly."}),e.jsx(M,{size:16,wrap:!0,children:e.jsx(G,{type:"primary",size:"large",onClick:()=>t("/exhibitions"),icon:e.jsx(q,{}),children:"Explore Exhibitions"})})]}),e.jsx(a,{xs:24,lg:10,children:e.jsx("img",{src:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",alt:"Exhibition Space",style:{width:"100%",borderRadius:"12px",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)",border:"4px solid rgba(255, 255, 255, 0.2)",objectFit:"cover",height:"300px"},onError:o=>{const p=o.target;p.src="https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",p.onerror=()=>{p.style.height="300px",p.style.background="linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",p.onerror=null;const b=p.parentElement;if(b){const j=document.createElement("div");j.style.position="absolute",j.style.top="50%",j.style.left="50%",j.style.transform="translate(-50%, -50%)",j.style.color="white",j.style.fontSize="18px",j.style.fontWeight="bold",j.style.textAlign="center",j.textContent="Exhibition Venue",b.appendChild(j)}}}})})]})})]}),e.jsx(C,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"Featured Exhibitions"}),h?e.jsx(y,{gutter:[24,24],children:[1,2,3,4].map(o=>e.jsx(a,{xs:24,sm:12,lg:6,children:e.jsx(V,{style:{borderRadius:"12px"},children:e.jsx(Ce,{active:!0,avatar:!0,paragraph:{rows:3}})})},o))}):u.length>0?e.jsx(y,{gutter:[24,24],children:u.map((o,p)=>{const{status:b,color:j}=ee(o.startDate,o.endDate);return e.jsx(a,{xs:24,sm:12,lg:6,children:e.jsxs(Ye,{onClick:()=>t(ve(o)),cover:e.jsxs("div",{style:{height:200,overflow:"hidden",position:"relative"},children:[e.jsx("img",{alt:o.name,src:o.headerLogo?We(o.headerLogo):"/exhibition-placeholder.jpg",style:{width:"100%",height:"100%",objectFit:"contain",filter:"brightness(0.95)"}}),e.jsx(Z,{color:j,style:{position:"absolute",top:12,left:12,borderRadius:"50px",padding:"2px 12px"},children:b}),p===0&&e.jsx(Ue,{color:"#f50",children:"Featured"})]}),hoverable:!0,children:[e.jsx(x,{level:5,ellipsis:{rows:1},style:{marginBottom:8},children:o.name}),e.jsxs("div",{style:{marginBottom:12,display:"flex",alignItems:"center",gap:8},children:[e.jsx(H,{style:{color:"#4158D0"}}),e.jsxs(I,{type:"secondary",style:{fontSize:13},children:[f(o.startDate)," - ",f(o.endDate)]})]}),o.venue&&e.jsxs("div",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[e.jsx(ze,{style:{color:"#C850C0"}}),e.jsx(I,{type:"secondary",style:{fontSize:13},ellipsis:!0,children:o.venue})]}),e.jsx(A,{type:"link",style:{padding:0,height:"auto"},icon:e.jsx(q,{}),children:"View Details"})]})},o._id)})}):e.jsx("div",{style:{textAlign:"center",padding:40},children:e.jsx(c,{children:"No exhibitions available at the moment. Check back soon!"})}),e.jsx("div",{style:{textAlign:"center",marginTop:40},children:e.jsx(A,{type:"primary",size:"large",onClick:()=>t("/exhibitions"),icon:e.jsx(Ie,{}),children:"View All Exhibitions"})})]})}),e.jsx(C,{className:"how-it-works",children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"How to Book Stall"}),e.jsx("div",{style:{textAlign:"center",maxWidth:"800px",margin:"0 auto 40px"},children:e.jsx(c,{style:{fontSize:"18px",color:"#666",fontWeight:500},children:"Secure your exhibition space in just a few simple steps. Our streamlined booking process makes it easy to showcase your business at premier events."})}),e.jsxs("div",{className:"booking-steps",children:[e.jsx("div",{className:"step-indicator",children:e.jsxs("div",{className:"step-dots",children:[[1,2,3,4,5,6,7].map(o=>e.jsxs("div",{className:"step-dot-container",children:[e.jsx("div",{className:"step-dot",children:o}),e.jsx("div",{className:"step-label",children:`Step ${o}`})]},o)),e.jsx("div",{className:"step-progress-line"})]})}),e.jsxs(y,{gutter:[24,24],style:{marginTop:40},children:[e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsx("div",{className:"step-icon",children:e.jsx(k,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Register"}),e.jsx(c,{children:"The exhibitor must first register on the platform with company details and contact information."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Admin Approval"}),e.jsx(c,{children:"After registration, the admin will review and approve your account. You'll receive a notification."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("div",{className:"step-icon",children:e.jsx(N,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Login & Book Stall"}),e.jsx(c,{children:"Once approved, log in and select a stall from the interactive layout map."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"4"}),e.jsx("div",{className:"step-icon",children:e.jsx(Le,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Stall Goes to Reserved"}),e.jsx(c,{children:'After booking, the stall status changes to "Reserved" and will be temporarily held for you.'})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"5"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Admin Final Approval"}),e.jsx(c,{children:"The admin will review your reservation request and approve it based on availability."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"6"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Stall Becomes Booked"}),e.jsx(c,{children:'After admin approval, the stall status changes to "Booked" and an invoice is generated.'})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"7"}),e.jsx("div",{className:"step-icon",children:e.jsx(Y,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Make Payment in 3 Days"}),e.jsx(c,{children:"Complete your payment within 3 days of booking to confirm your stall reservation."})]})]})})]}),e.jsx("style",{children:`
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
                `})]}),e.jsx("div",{style:{textAlign:"center",marginTop:60},children:e.jsx(G,{type:"primary",size:"large",onClick:W,icon:e.jsx(k,{}),children:"Register as Exhibitor"})})]})}),e.jsx(C,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"Why Choose Us"}),e.jsxs(y,{gutter:[24,24],children:[e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(65, 88, 208, 0.1)",color:"#4158D0"},children:e.jsx(Ne,{})}),e.jsx(x,{level:4,children:"Interactive Layouts"}),e.jsx(c,{style:{fontSize:16},children:"Explore detailed exhibition floor plans with interactive maps to find your perfect spot."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(200, 80, 192, 0.1)",color:"#C850C0"},children:e.jsx(N,{})}),e.jsx(x,{level:4,children:"Real-time Availability"}),e.jsx(c,{style:{fontSize:16},children:"See stall availability in real-time and book instantly without any delays or confusion."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(255, 204, 112, 0.1)",color:"#FFCC70"},children:e.jsx(Y,{})}),e.jsx(x,{level:4,children:"Secure Payments"}),e.jsx(c,{style:{fontSize:16},children:"Complete your bookings with our secure payment gateway and receive instant confirmation."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(82, 196, 26, 0.1)",color:"#52c41a"},children:e.jsx(Pe,{})}),e.jsx(x,{level:4,children:"Exhibitor Dashboard"}),e.jsx(c,{style:{fontSize:16},children:"Manage all your bookings, payments, and exhibition details through our user-friendly dashboard."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(250, 140, 22, 0.1)",color:"#fa8c16"},children:e.jsx(H,{})}),e.jsx(x,{level:4,children:"Schedule Management"}),e.jsx(c,{style:{fontSize:16},children:"Keep track of important dates, setup times, and exhibition schedules all in one place."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(24, 144, 255, 0.1)",color:"#1890ff"},children:e.jsx(z,{})}),e.jsx(x,{level:4,children:"Support & Assistance"}),e.jsx(c,{style:{fontSize:16},children:"Get expert assistance throughout the booking process and during the exhibition."})]})})]})]})}),e.jsx(C,{className:"gray-bg",children:e.jsx("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:e.jsxs(y,{gutter:[48,48],children:[e.jsxs(a,{xs:24,lg:12,children:[e.jsx(R,{level:2,children:"Our Impact"}),e.jsxs(y,{gutter:[24,24],children:[e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(D,{title:"Exhibitions",value:100,suffix:"+",valueStyle:{color:"#4158D0",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(D,{title:"Exhibitors",value:5e3,suffix:"+",valueStyle:{color:"#C850C0",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(D,{title:"Stalls Booked",value:12e3,suffix:"+",valueStyle:{color:"#FFCC70",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(D,{title:"Cities",value:25,suffix:"+",valueStyle:{color:"#52c41a",fontWeight:"bold"}})})})]})]}),e.jsxs(a,{xs:24,lg:12,children:[e.jsx(R,{level:2,children:"What Exhibitors Say"}),e.jsxs(Ae,{autoplay:!0,dots:{className:"custom-carousel-dots"},children:[e.jsx("div",{children:e.jsxs(U,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx($,{size:64,icon:e.jsx(k,{}),style:{backgroundColor:"#4158D0"}}),e.jsxs("div",{children:[e.jsx(x,{level:5,style:{margin:0},children:"Sarah Johnson"}),e.jsx(I,{type:"secondary",children:"Tech Innovations Inc."})]})]}),e.jsx(c,{style:{fontSize:16},children:'"The booking process was seamless! I could view the layout, select my preferred spot, and complete payment all in one go. Will definitely use again for our next exhibition."'})]})}),e.jsx("div",{children:e.jsxs(U,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx($,{size:64,icon:e.jsx(k,{}),style:{backgroundColor:"#C850C0"}}),e.jsxs("div",{children:[e.jsx(x,{level:5,style:{margin:0},children:"Michael Chen"}),e.jsx(I,{type:"secondary",children:"Global Exhibits Ltd"})]})]}),e.jsx(c,{style:{fontSize:16},children:'"As a regular exhibitor, this platform has made my life so much easier. I love how I can see all my bookings and manage everything from one dashboard."'})]})})]})]})]})})}),e.jsx(C,{style:{padding:"60px 0"},children:e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto",padding:"40px 24px",background:"linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",borderRadius:"16px",color:"white",textAlign:"center",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.1)"},children:[e.jsx(x,{level:2,style:{color:"white",marginBottom:16},children:"Ready to Showcase Your Business?"}),e.jsx(c,{style:{fontSize:"1.2rem",marginBottom:32,color:"rgba(255, 255, 255, 0.9)"},children:"Join thousands of successful exhibitors and book your perfect stall today"}),e.jsxs(M,{size:16,wrap:!0,style:{justifyContent:"center"},children:[e.jsx(A,{size:"large",style:{height:"50px",background:"white",color:"#4158D0",border:"none",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:()=>t("/exhibitions"),icon:e.jsx(N,{}),children:"Browse Exhibitions"}),e.jsx(A,{size:"large",style:{height:"50px",background:"rgba(255, 255, 255, 0.2)",color:"white",border:"2px solid white",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:W,icon:e.jsx(k,{}),children:"Register as Exhibitor"})]})]})})]}),e.jsx(me,{})]})},Je=s.lazy(()=>r(()=>import("./app-dashboard-DAvQsPhE.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]))),Qe=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.D),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),Ke=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.B),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),Ze=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.b),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),Xe=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.P),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),et=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.I),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),tt=s.lazy(()=>r(()=>import("./Profile-Bo5Xa6cY.js"),__vite__mapDeps([22,1,2,3,4,5,6,7,8,9,11,12,10,14,13,15,0,17,16]))),it=s.lazy(()=>r(()=>import("./app-admin-iCKr2TyV.js").then(t=>t.S),__vite__mapDeps([15,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,16,17]))),st=s.lazy(()=>r(()=>import("./app-admin-iCKr2TyV.js").then(t=>t.i),__vite__mapDeps([15,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,16,17]))),rt=s.lazy(()=>r(()=>import("./app-admin-iCKr2TyV.js").then(t=>t.b),__vite__mapDeps([15,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,16,17]))),ot=s.lazy(()=>r(()=>import("./index-BSyVroit.js"),__vite__mapDeps([23,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,17,16]))),nt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.i),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),at=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.h),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),lt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.j),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),dt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.k),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),ct=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.l),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),xt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.m),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),ht=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.n),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),pt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.o),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),mt=s.lazy(()=>r(()=>import("./app-exhibition-Vu8xGXtg.js").then(t=>t.p),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16]))),jt=s.lazy(()=>r(()=>import("./app-stall-Bo1-c6b4.js").then(t=>t.i),__vite__mapDeps([24,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16]))),gt=s.lazy(()=>r(()=>import("./app-stall-Bo1-c6b4.js").then(t=>t.a),__vite__mapDeps([24,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16]))),ut=s.lazy(()=>r(()=>import("./app-booking-E9aWubKZ.js").then(t=>t.i),__vite__mapDeps([25,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16,19,21,26,18]))),bt=s.lazy(()=>r(()=>import("./app-booking-E9aWubKZ.js").then(t=>t.a),__vite__mapDeps([25,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16,19,21,26,18]))),yt=s.lazy(()=>r(()=>import("./app-invoice-D3-oPHO9.js").then(t=>t.a),__vite__mapDeps([19,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16,20,21]))),ft=s.lazy(()=>r(()=>import("./app-invoice-D3-oPHO9.js").then(t=>t.b),__vite__mapDeps([19,1,2,3,4,5,6,7,8,9,11,10,12,13,14,15,0,17,16,20,21]))),vt=s.lazy(()=>r(()=>import("./app-exhibitor-CjvJHpDU.js").then(t=>t.i),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,11,13,10,12,14,15,0,17,16,19,20,21]))),_t=s.lazy(()=>r(()=>import("./index-Si21LjQx.js"),__vite__mapDeps([27,25,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16,19,21,26,18,28]))),Et=()=>{const t=r(()=>import("./app-dashboard-DAvQsPhE.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])),d=r(()=>import("./app-booking-E9aWubKZ.js").then(u=>u.i),__vite__mapDeps([25,1,2,3,4,5,6,7,8,9,11,20,10,12,13,14,15,0,17,16,19,21,26,18]));return{preloadDashboard:t,preloadBookingManager:d}};setTimeout(Et,3e3);const wt=()=>e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},children:e.jsx(Se,{size:"large",tip:"Loading..."})}),l=({children:t})=>Q(u=>u.auth.isAuthenticated)?t:e.jsx(O,{to:"/login"}),w=({children:t})=>Q(u=>u.exhibitorAuth.isAuthenticated)?t:e.jsx(O,{to:"/"}),J=t=>e.jsx(T,{children:t});function kt(){return e.jsx(X,{children:e.jsx(T,{children:e.jsx(xe,{children:e.jsx(s.Suspense,{fallback:e.jsx(wt,{}),children:e.jsxs(he,{children:[e.jsx(i,{path:"/",element:e.jsx(Ge,{})}),e.jsx(i,{path:"/login",element:e.jsx(be,{})}),e.jsx(i,{path:"/exhibitions",element:e.jsx(_e,{})}),e.jsx(i,{path:"/exhibitions/:id",element:e.jsx(Ee,{})}),e.jsx(i,{path:"/exhibitions/:id/layout",element:e.jsx(we,{})}),e.jsx(i,{path:"/exhibitor/dashboard",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(T,{children:e.jsx(Qe,{})})})})}),e.jsx(i,{path:"/exhibitor/profile",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Xe,{})})})}),e.jsx(i,{path:"/exhibitor/bookings",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Ke,{})})})}),e.jsx(i,{path:"/exhibitor/bookings/:id",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Ze,{})})})}),e.jsx(i,{path:"/exhibitor/support",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx("div",{children:"Help & Support"})})})}),e.jsx(i,{path:"/exhibitor/invoice/:id",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(et,{})})})}),e.jsx(i,{path:"/dashboard",element:e.jsx(l,{children:e.jsx(n,{children:J(e.jsx(Je,{}))})})}),e.jsx(i,{path:"/account",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(tt,{})})})}),e.jsx(i,{path:"/exhibition",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(nt,{})})})}),e.jsx(i,{path:"/exhibition/create",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(at,{})})})}),e.jsx(i,{path:"/exhibition/:id",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(lt,{})})})}),e.jsx(i,{path:"/exhibition/:id/space",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ct,{})})})}),e.jsx(i,{path:"/exhibition/:id/layout",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(xt,{})})})}),e.jsx(i,{path:"/exhibition/:id/halls",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ht,{})})})}),e.jsx(i,{path:"/exhibition/:id/stalls",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(pt,{})})})}),e.jsx(i,{path:"/exhibition/:id/fixtures",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(mt,{})})})}),e.jsx(i,{path:"/exhibition/:id/edit",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(dt,{})})})}),e.jsx(i,{path:"/stall/list",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(jt,{})})})}),e.jsx(i,{path:"/stall-types",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(gt,{})})})}),e.jsx(i,{path:"/bookings",element:e.jsx(l,{children:e.jsx(n,{children:J(e.jsx(ut,{}))})})}),e.jsx(i,{path:"/bookings/create",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(bt,{})})})}),e.jsx(i,{path:"/amenities",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(_t,{})})})}),e.jsx(i,{path:"/invoices",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ft,{})})})}),e.jsx(i,{path:"/invoice/:id",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(yt,{})})})}),e.jsx(i,{path:"/index",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(rt,{})})})}),e.jsx(i,{path:"/settings",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(it,{})})})}),e.jsx(i,{path:"/roles",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(st,{})})})}),e.jsx(i,{path:"/notifications",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ot,{})})})}),e.jsx(i,{path:"/exhibitors",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(vt,{})})})}),e.jsx(i,{path:"*",element:e.jsx(O,{to:"/",replace:!0})})]})})})})})}const B=oe({reducerPath:"bookingApi",baseQuery:ne({baseUrl:"/api"}),endpoints:t=>({getBookings:t.query({query:()=>"/bookings"}),getBooking:t.query({query:d=>`/bookings/${d}`}),createBooking:t.mutation({query:d=>({url:"/bookings",method:"POST",body:d})}),updateBookingStatus:t.mutation({query:({id:d,status:u})=>({url:`/bookings/${d}/status`,method:"PATCH",body:{status:u}})})})}),Rt=ae({reducer:{auth:fe,exhibitorAuth:ye,exhibition:ke,booking:de,exhibitor:Fe,settings:Oe,role:Te,user:Be,[B.reducerPath]:B.reducer,[F.reducerPath]:F.reducer,[P.reducerPath]:P.reducer},middleware:t=>t().concat(B.middleware).concat(F.middleware).concat(P.middleware)}),Ct={token:{colorPrimary:"#7C3AED",borderRadius:8,colorBgContainer:"#FFFFFF",colorBgLayout:"#F9FAFB",fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"},components:{Layout:{siderBg:"#FFFFFF",headerBg:"#FFFFFF"},Menu:{itemBg:"transparent",itemSelectedBg:"#F3F4F6",itemHoverBg:"#F3F4F6",itemSelectedColor:"#7C3AED",itemColor:"#6B7280"},Card:{boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"},Button:{borderRadius:8,primaryShadow:"0 1px 2px 0 rgb(124 58 237 / 0.05)"},Table:{borderRadius:8,headerBg:"#F9FAFB"}}};se.createRoot(document.getElementById("root")).render(e.jsx(ie.StrictMode,{children:e.jsx(le,{store:Rt,children:e.jsx(De,{theme:Ct,children:e.jsx(X,{children:e.jsx(kt,{})})})})}));
