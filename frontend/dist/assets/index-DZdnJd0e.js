const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-dashboard-OSBEAOF5.js","assets/vendor-react-core-B0uGejYc.js","assets/vendor-deps-DEOa4Mno.js","assets/vendor-ui-utils-CGs7t4cg.js","assets/vendor-canvas-CkLjwLEv.js","assets/vendor-antd-core-PMpIrrMR.js","assets/vendor-antd-icons-DK8C9GTH.js","assets/vendor-date-utils-3BRsAYU6.js","assets/vendor-redux-GR4hUpLs.js","assets/vendor-react-core-f_XpeFrr.css","assets/app-core-L3PgNZOI.js","assets/app-auth-Phoe3BrL.js","assets/vendor-http-t--hEgTQ.js","assets/app-admin-CoTkNL6t.js","assets/app-core-DU_-Labf.css","assets/app-dashboard-CUgo7HtP.css","assets/app-exhibitor-B2aggKuD.js","assets/app-invoice-DhWVRxD8.js","assets/app-exhibition-CF4MSB7I.js","assets/app-invoice-BaZgAriD.css","assets/Profile-DuMpadbZ.js","assets/index-BScFPyrQ.js","assets/app-stall-7G6qB5_2.js","assets/app-booking-XNzexAZp.js","assets/vendor-export-B1ZyNMsV.js","assets/index-BgRIJtv_.js","assets/index-XVcQs4cz.css"])))=>i.map(i=>d[i]);
import{b as ie,u as se,r as s,j as e,B as re,D as oe,H as i,N as O,a as Q,n as ne,J as ae,R as le,P as de}from"./vendor-react-core-B0uGejYc.js";import{_ as r,b as ce}from"./app-booking-XNzexAZp.js";import{G as xe,r as he,q as pe,j as je,E as T,w as v,M as n}from"./app-core-L3PgNZOI.js";import{a as me,L as ge,c as ue,d as be}from"./app-auth-Phoe3BrL.js";import{g as ye,P as fe,c as ve,d as _e,e as Ee}from"./app-exhibition-CF4MSB7I.js";import{n as g}from"./vendor-ui-utils-CGs7t4cg.js";import{T as we,w as K,a as V,h as Z,B as A,R as y,C as a,S as M,Q as ke,j as S,Y as Re,f as $,A as X,o as Ce,Z as Ae}from"./vendor-antd-core-PMpIrrMR.js";import{a9 as H,a8 as q,V as De,aM as Se,i as k,u as z,J as N,m as ze,aN as Y,_ as Ie,L as Le}from"./vendor-antd-icons-DK8C9GTH.js";import{f as Ne,h as Pe}from"./vendor-redux-GR4hUpLs.js";import{e as P,a as Fe}from"./app-exhibitor-B2aggKuD.js";import{a as Be,r as Te,s as Oe}from"./app-admin-CoTkNL6t.js";import{i as F}from"./app-invoice-DhWVRxD8.js";import"./vendor-deps-DEOa4Mno.js";import"./vendor-canvas-CkLjwLEv.js";import"./app-dashboard-OSBEAOF5.js";import"./vendor-http-t--hEgTQ.js";import"./vendor-date-utils-3BRsAYU6.js";import"./vendor-export-B1ZyNMsV.js";(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))D(h);new MutationObserver(h=>{for(const j of h)if(j.type==="childList")for(const f of j.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&D(f)}).observe(document,{childList:!0,subtree:!0});function u(h){const j={};return h.integrity&&(j.integrity=h.integrity),h.referrerPolicy&&(j.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?j.credentials="include":h.crossOrigin==="anonymous"?j.credentials="omit":j.credentials="same-origin",j}function D(h){if(h.ep)return;h.ep=!0;const j=u(h);fetch(h.href,j)}})();const{Title:x,Paragraph:c,Text:I}=we,{Content:Ve}=K,We=t=>{if(!t)return"/exhibition-placeholder.jpg";if(t.startsWith("/")||t.startsWith("http"))return t;const d=t.startsWith("/")?t.substring(1):t;return d.includes("logos/")||d.includes("sponsors/")?`${je.defaults.baseURL}/public/images/${d}`:"/exhibition-placeholder.jpg"},Me=g(Ve)`
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
`,He=g.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`,qe=g.div`
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
`;const Ge=()=>{const t=ie(),d=se(),[u,D]=s.useState([]),[h,j]=s.useState(!0);s.useEffect(()=>{(async()=>{try{j(!0);const p=await pe.getExhibitions();D(p.data.slice(0,4))}catch(p){console.error("Failed to fetch exhibitions:",p)}finally{j(!1)}})()},[]);const f=o=>{const p={year:"numeric",month:"short",day:"numeric"};return new Date(o).toLocaleDateString(void 0,p)},ee=(o,p)=>{const b=new Date,m=new Date(o),te=new Date(p);return b<m?{status:"Upcoming",color:"#722ED1"}:b>te?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}},W=()=>{d(me(void 0))};return e.jsxs(K,{children:[e.jsx(xe,{}),e.jsxs(Me,{children:[e.jsxs($e,{children:[e.jsx(He,{}),e.jsx(qe,{children:e.jsxs(y,{gutter:[48,48],align:"middle",children:[e.jsxs(a,{xs:24,lg:14,children:[e.jsx(x,{level:1,style:{fontSize:"3.5rem",marginBottom:24,color:"white",fontWeight:700},children:"Book Your Exhibition Space with Ease"}),e.jsx(c,{style:{fontSize:"1.2rem",marginBottom:40,color:"rgba(255, 255, 255, 0.9)"},children:"Explore upcoming exhibitions, select your perfect stall, and secure your spot all in one place. Manage your exhibition presence effortlessly."}),e.jsx(M,{size:16,wrap:!0,children:e.jsx(G,{type:"primary",size:"large",onClick:()=>t("/exhibitions"),icon:e.jsx(H,{}),children:"Explore Exhibitions"})})]}),e.jsx(a,{xs:24,lg:10,children:e.jsx("img",{src:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",alt:"Exhibition Space",style:{width:"100%",borderRadius:"12px",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)",border:"4px solid rgba(255, 255, 255, 0.2)",objectFit:"cover",height:"300px"},onError:o=>{const p=o.target;p.src="https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",p.onerror=()=>{p.style.height="300px",p.style.background="linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",p.onerror=null;const b=p.parentElement;if(b){const m=document.createElement("div");m.style.position="absolute",m.style.top="50%",m.style.left="50%",m.style.transform="translate(-50%, -50%)",m.style.color="white",m.style.fontSize="18px",m.style.fontWeight="bold",m.style.textAlign="center",m.textContent="Exhibition Venue",b.appendChild(m)}}}})})]})})]}),e.jsx(C,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"Featured Exhibitions"}),h?e.jsx(y,{gutter:[24,24],children:[1,2,3,4].map(o=>e.jsx(a,{xs:24,sm:12,lg:6,children:e.jsx(V,{style:{borderRadius:"12px"},children:e.jsx(ke,{active:!0,avatar:!0,paragraph:{rows:3}})})},o))}):u.length>0?e.jsx(y,{gutter:[24,24],children:u.map((o,p)=>{const{status:b,color:m}=ee(o.startDate,o.endDate);return e.jsx(a,{xs:24,sm:12,lg:6,children:e.jsxs(Ye,{onClick:()=>t(ye(o)),cover:e.jsxs("div",{style:{height:200,overflow:"hidden",position:"relative"},children:[e.jsx("img",{alt:o.name,src:o.headerLogo?We(o.headerLogo):"/exhibition-placeholder.jpg",style:{width:"100%",height:"100%",objectFit:"contain",filter:"brightness(0.95)"}}),e.jsx(Z,{color:m,style:{position:"absolute",top:12,left:12,borderRadius:"50px",padding:"2px 12px"},children:b}),p===0&&e.jsx(Ue,{color:"#f50",children:"Featured"})]}),hoverable:!0,children:[e.jsx(x,{level:5,ellipsis:{rows:1},style:{marginBottom:8},children:o.name}),e.jsxs("div",{style:{marginBottom:12,display:"flex",alignItems:"center",gap:8},children:[e.jsx(q,{style:{color:"#4158D0"}}),e.jsxs(I,{type:"secondary",style:{fontSize:13},children:[f(o.startDate)," - ",f(o.endDate)]})]}),o.venue&&e.jsxs("div",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[e.jsx(De,{style:{color:"#C850C0"}}),e.jsx(I,{type:"secondary",style:{fontSize:13},ellipsis:!0,children:o.venue})]}),e.jsx(A,{type:"link",style:{padding:0,height:"auto"},icon:e.jsx(H,{}),children:"View Details"})]})},o._id)})}):e.jsx("div",{style:{textAlign:"center",padding:40},children:e.jsx(c,{children:"No exhibitions available at the moment. Check back soon!"})}),e.jsx("div",{style:{textAlign:"center",marginTop:40},children:e.jsx(A,{type:"primary",size:"large",onClick:()=>t("/exhibitions"),icon:e.jsx(Se,{}),children:"View All Exhibitions"})})]})}),e.jsx(C,{className:"how-it-works",children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"How to Book Stall"}),e.jsx("div",{style:{textAlign:"center",maxWidth:"800px",margin:"0 auto 40px"},children:e.jsx(c,{style:{fontSize:"18px",color:"#666",fontWeight:500},children:"Secure your exhibition space in just a few simple steps. Our streamlined booking process makes it easy to showcase your business at premier events."})}),e.jsxs("div",{className:"booking-steps",children:[e.jsx("div",{className:"step-indicator",children:e.jsxs("div",{className:"step-dots",children:[[1,2,3,4,5,6,7].map(o=>e.jsxs("div",{className:"step-dot-container",children:[e.jsx("div",{className:"step-dot",children:o}),e.jsx("div",{className:"step-label",children:`Step ${o}`})]},o)),e.jsx("div",{className:"step-progress-line"})]})}),e.jsxs(y,{gutter:[24,24],style:{marginTop:40},children:[e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"1"}),e.jsx("div",{className:"step-icon",children:e.jsx(k,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Register"}),e.jsx(c,{children:"The exhibitor must first register on the platform with company details and contact information."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"2"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Admin Approval"}),e.jsx(c,{children:"After registration, the admin will review and approve your account. You'll receive a notification."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"3"}),e.jsx("div",{className:"step-icon",children:e.jsx(N,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Login & Book Stall"}),e.jsx(c,{children:"Once approved, log in and select a stall from the interactive layout map."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"4"}),e.jsx("div",{className:"step-icon",children:e.jsx(ze,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Stall Goes to Reserved"}),e.jsx(c,{children:'After booking, the stall status changes to "Reserved" and will be temporarily held for you.'})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"5"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Admin Final Approval"}),e.jsx(c,{children:"The admin will review your reservation request and approve it based on availability."})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"6"}),e.jsx("div",{className:"step-icon",children:e.jsx(z,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Stall Becomes Booked"}),e.jsx(c,{children:'After admin approval, the stall status changes to "Booked" and an invoice is generated.'})]})]})}),e.jsx(a,{xs:24,md:12,lg:8,xl:6,children:e.jsxs("div",{className:"step-card",children:[e.jsxs("div",{className:"step-card-header",children:[e.jsx("div",{className:"step-number",children:"7"}),e.jsx("div",{className:"step-icon",children:e.jsx(Y,{})})]}),e.jsxs("div",{className:"step-card-body",children:[e.jsx(x,{level:5,children:"Make Payment in 3 Days"}),e.jsx(c,{children:"Complete your payment within 3 days of booking to confirm your stall reservation."})]})]})})]}),e.jsx("style",{children:`
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
                `})]}),e.jsx("div",{style:{textAlign:"center",marginTop:60},children:e.jsx(G,{type:"primary",size:"large",onClick:W,icon:e.jsx(k,{}),children:"Register as Exhibitor"})})]})}),e.jsx(C,{children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[e.jsx(R,{level:2,children:"Why Choose Us"}),e.jsxs(y,{gutter:[24,24],children:[e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(65, 88, 208, 0.1)",color:"#4158D0"},children:e.jsx(Ie,{})}),e.jsx(x,{level:4,children:"Interactive Layouts"}),e.jsx(c,{style:{fontSize:16},children:"Explore detailed exhibition floor plans with interactive maps to find your perfect spot."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(200, 80, 192, 0.1)",color:"#C850C0"},children:e.jsx(N,{})}),e.jsx(x,{level:4,children:"Real-time Availability"}),e.jsx(c,{style:{fontSize:16},children:"See stall availability in real-time and book instantly without any delays or confusion."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(255, 204, 112, 0.1)",color:"#FFCC70"},children:e.jsx(Y,{})}),e.jsx(x,{level:4,children:"Secure Payments"}),e.jsx(c,{style:{fontSize:16},children:"Complete your bookings with our secure payment gateway and receive instant confirmation."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(82, 196, 26, 0.1)",color:"#52c41a"},children:e.jsx(Le,{})}),e.jsx(x,{level:4,children:"Exhibitor Dashboard"}),e.jsx(c,{style:{fontSize:16},children:"Manage all your bookings, payments, and exhibition details through our user-friendly dashboard."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(250, 140, 22, 0.1)",color:"#fa8c16"},children:e.jsx(q,{})}),e.jsx(x,{level:4,children:"Schedule Management"}),e.jsx(c,{style:{fontSize:16},children:"Keep track of important dates, setup times, and exhibition schedules all in one place."})]})}),e.jsx(a,{xs:24,sm:12,lg:8,children:e.jsxs(_,{children:[e.jsx(E,{style:{background:"rgba(24, 144, 255, 0.1)",color:"#1890ff"},children:e.jsx(z,{})}),e.jsx(x,{level:4,children:"Support & Assistance"}),e.jsx(c,{style:{fontSize:16},children:"Get expert assistance throughout the booking process and during the exhibition."})]})})]})]})}),e.jsx(C,{className:"gray-bg",children:e.jsx("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:e.jsxs(y,{gutter:[48,48],children:[e.jsxs(a,{xs:24,lg:12,children:[e.jsx(R,{level:2,children:"Our Impact"}),e.jsxs(y,{gutter:[24,24],children:[e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(S,{title:"Exhibitions",value:100,suffix:"+",valueStyle:{color:"#4158D0",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(S,{title:"Exhibitors",value:5e3,suffix:"+",valueStyle:{color:"#C850C0",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(S,{title:"Stalls Booked",value:12e3,suffix:"+",valueStyle:{color:"#FFCC70",fontWeight:"bold"}})})}),e.jsx(a,{xs:12,children:e.jsx(L,{children:e.jsx(S,{title:"Cities",value:25,suffix:"+",valueStyle:{color:"#52c41a",fontWeight:"bold"}})})})]})]}),e.jsxs(a,{xs:24,lg:12,children:[e.jsx(R,{level:2,children:"What Exhibitors Say"}),e.jsxs(Re,{autoplay:!0,dots:{className:"custom-carousel-dots"},children:[e.jsx("div",{children:e.jsxs(U,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx($,{size:64,icon:e.jsx(k,{}),style:{backgroundColor:"#4158D0"}}),e.jsxs("div",{children:[e.jsx(x,{level:5,style:{margin:0},children:"Sarah Johnson"}),e.jsx(I,{type:"secondary",children:"Tech Innovations Inc."})]})]}),e.jsx(c,{style:{fontSize:16},children:'"The booking process was seamless! I could view the layout, select my preferred spot, and complete payment all in one go. Will definitely use again for our next exhibition."'})]})}),e.jsx("div",{children:e.jsxs(U,{children:[e.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[e.jsx($,{size:64,icon:e.jsx(k,{}),style:{backgroundColor:"#C850C0"}}),e.jsxs("div",{children:[e.jsx(x,{level:5,style:{margin:0},children:"Michael Chen"}),e.jsx(I,{type:"secondary",children:"Global Exhibits Ltd"})]})]}),e.jsx(c,{style:{fontSize:16},children:'"As a regular exhibitor, this platform has made my life so much easier. I love how I can see all my bookings and manage everything from one dashboard."'})]})})]})]})]})})}),e.jsx(C,{style:{padding:"60px 0"},children:e.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto",padding:"40px 24px",background:"linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",borderRadius:"16px",color:"white",textAlign:"center",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.1)"},children:[e.jsx(x,{level:2,style:{color:"white",marginBottom:16},children:"Ready to Showcase Your Business?"}),e.jsx(c,{style:{fontSize:"1.2rem",marginBottom:32,color:"rgba(255, 255, 255, 0.9)"},children:"Join thousands of successful exhibitors and book your perfect stall today"}),e.jsxs(M,{size:16,wrap:!0,style:{justifyContent:"center"},children:[e.jsx(A,{size:"large",style:{height:"50px",background:"white",color:"#4158D0",border:"none",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:()=>t("/exhibitions"),icon:e.jsx(N,{}),children:"Browse Exhibitions"}),e.jsx(A,{size:"large",style:{height:"50px",background:"rgba(255, 255, 255, 0.2)",color:"white",border:"2px solid white",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:W,icon:e.jsx(k,{}),children:"Register as Exhibitor"})]})]})})]}),e.jsx(he,{})]})},Je=s.lazy(()=>r(()=>import("./app-dashboard-OSBEAOF5.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]))),Qe=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.D),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),Ke=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.B),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),Ze=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.b),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),Xe=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.P),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),et=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.I),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),tt=s.lazy(()=>r(()=>import("./Profile-DuMpadbZ.js"),__vite__mapDeps([20,1,2,3,4,5,6,7,8,9,11,10,12,13,0,15,14]))),it=s.lazy(()=>r(()=>import("./app-admin-CoTkNL6t.js").then(t=>t.S),__vite__mapDeps([13,1,2,3,4,5,6,7,8,9,0,10,11,12,14,15]))),st=s.lazy(()=>r(()=>import("./app-admin-CoTkNL6t.js").then(t=>t.i),__vite__mapDeps([13,1,2,3,4,5,6,7,8,9,0,10,11,12,14,15]))),rt=s.lazy(()=>r(()=>import("./app-admin-CoTkNL6t.js").then(t=>t.b),__vite__mapDeps([13,1,2,3,4,5,6,7,8,9,0,10,11,12,14,15]))),ot=s.lazy(()=>r(()=>import("./index-BScFPyrQ.js"),__vite__mapDeps([21,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),nt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.i),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),at=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.h),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),lt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.j),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),dt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.k),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),ct=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.l),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),xt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.m),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),ht=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.n),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),pt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.o),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),jt=s.lazy(()=>r(()=>import("./app-exhibition-CF4MSB7I.js").then(t=>t.p),__vite__mapDeps([18,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14]))),mt=s.lazy(()=>r(()=>import("./app-stall-7G6qB5_2.js").then(t=>t.i),__vite__mapDeps([22,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14]))),gt=s.lazy(()=>r(()=>import("./app-stall-7G6qB5_2.js").then(t=>t.a),__vite__mapDeps([22,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14]))),ut=s.lazy(()=>r(()=>import("./app-booking-XNzexAZp.js").then(t=>t.i),__vite__mapDeps([23,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14,17,19,24,16]))),bt=s.lazy(()=>r(()=>import("./app-booking-XNzexAZp.js").then(t=>t.a),__vite__mapDeps([23,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14,17,19,24,16]))),yt=s.lazy(()=>r(()=>import("./app-invoice-DhWVRxD8.js").then(t=>t.a),__vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,18,19]))),ft=s.lazy(()=>r(()=>import("./app-invoice-DhWVRxD8.js").then(t=>t.b),__vite__mapDeps([17,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,18,19]))),vt=s.lazy(()=>r(()=>import("./app-exhibitor-B2aggKuD.js").then(t=>t.i),__vite__mapDeps([16,1,2,3,4,5,6,7,8,9,10,11,12,13,0,15,14,17,18,19]))),_t=s.lazy(()=>r(()=>import("./index-BgRIJtv_.js"),__vite__mapDeps([25,23,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14,17,19,24,16,26]))),Et=()=>{const t=r(()=>import("./app-dashboard-OSBEAOF5.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])),d=r(()=>import("./app-booking-XNzexAZp.js").then(u=>u.i),__vite__mapDeps([23,1,2,3,4,5,6,7,8,9,18,10,11,12,13,0,15,14,17,19,24,16]));return{preloadDashboard:t,preloadBookingManager:d}};setTimeout(Et,3e3);const wt=()=>e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"},children:e.jsx(Ce,{size:"large",tip:"Loading..."})}),l=({children:t})=>Q(u=>u.auth.isAuthenticated)?t:e.jsx(O,{to:"/login"}),w=({children:t})=>Q(u=>u.exhibitorAuth.isAuthenticated)?t:e.jsx(O,{to:"/"}),J=t=>e.jsx(T,{children:t});function kt(){return e.jsx(X,{children:e.jsx(T,{children:e.jsx(re,{children:e.jsx(s.Suspense,{fallback:e.jsx(wt,{}),children:e.jsxs(oe,{children:[e.jsx(i,{path:"/",element:e.jsx(Ge,{})}),e.jsx(i,{path:"/login",element:e.jsx(ge,{})}),e.jsx(i,{path:"/exhibitions",element:e.jsx(fe,{})}),e.jsx(i,{path:"/exhibitions/:id",element:e.jsx(ve,{})}),e.jsx(i,{path:"/exhibitions/:id/layout",element:e.jsx(_e,{})}),e.jsx(i,{path:"/exhibitor/dashboard",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(T,{children:e.jsx(Qe,{})})})})}),e.jsx(i,{path:"/exhibitor/profile",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Xe,{})})})}),e.jsx(i,{path:"/exhibitor/bookings",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Ke,{})})})}),e.jsx(i,{path:"/exhibitor/bookings/:id",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(Ze,{})})})}),e.jsx(i,{path:"/exhibitor/support",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx("div",{children:"Help & Support"})})})}),e.jsx(i,{path:"/exhibitor/invoice/:id",element:e.jsx(w,{children:e.jsx(v,{children:e.jsx(et,{})})})}),e.jsx(i,{path:"/dashboard",element:e.jsx(l,{children:e.jsx(n,{children:J(e.jsx(Je,{}))})})}),e.jsx(i,{path:"/account",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(tt,{})})})}),e.jsx(i,{path:"/exhibition",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(nt,{})})})}),e.jsx(i,{path:"/exhibition/create",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(at,{})})})}),e.jsx(i,{path:"/exhibition/:id",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(lt,{})})})}),e.jsx(i,{path:"/exhibition/:id/space",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ct,{})})})}),e.jsx(i,{path:"/exhibition/:id/layout",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(xt,{})})})}),e.jsx(i,{path:"/exhibition/:id/halls",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ht,{})})})}),e.jsx(i,{path:"/exhibition/:id/stalls",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(pt,{})})})}),e.jsx(i,{path:"/exhibition/:id/fixtures",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(jt,{})})})}),e.jsx(i,{path:"/exhibition/:id/edit",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(dt,{})})})}),e.jsx(i,{path:"/stall/list",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(mt,{})})})}),e.jsx(i,{path:"/stall-types",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(gt,{})})})}),e.jsx(i,{path:"/bookings",element:e.jsx(l,{children:e.jsx(n,{children:J(e.jsx(ut,{}))})})}),e.jsx(i,{path:"/bookings/create",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(bt,{})})})}),e.jsx(i,{path:"/amenities",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(_t,{})})})}),e.jsx(i,{path:"/invoices",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ft,{})})})}),e.jsx(i,{path:"/invoice/:id",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(yt,{})})})}),e.jsx(i,{path:"/index",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(rt,{})})})}),e.jsx(i,{path:"/settings",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(it,{})})})}),e.jsx(i,{path:"/roles",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(st,{})})})}),e.jsx(i,{path:"/notifications",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(ot,{})})})}),e.jsx(i,{path:"/exhibitors",element:e.jsx(l,{children:e.jsx(n,{children:e.jsx(vt,{})})})}),e.jsx(i,{path:"*",element:e.jsx(O,{to:"/",replace:!0})})]})})})})})}const B=ne({reducerPath:"bookingApi",baseQuery:Ne({baseUrl:"/api"}),endpoints:t=>({getBookings:t.query({query:()=>"/bookings"}),getBooking:t.query({query:d=>`/bookings/${d}`}),createBooking:t.mutation({query:d=>({url:"/bookings",method:"POST",body:d})}),updateBookingStatus:t.mutation({query:({id:d,status:u})=>({url:`/bookings/${d}/status`,method:"PATCH",body:{status:u}})})})}),Rt=Pe({reducer:{auth:be,exhibitorAuth:ue,exhibition:Ee,booking:ce,exhibitor:Fe,settings:Oe,role:Te,user:Be,[B.reducerPath]:B.reducer,[F.reducerPath]:F.reducer,[P.reducerPath]:P.reducer},middleware:t=>t().concat(B.middleware).concat(F.middleware).concat(P.middleware)}),Ct={token:{colorPrimary:"#7C3AED",borderRadius:8,colorBgContainer:"#FFFFFF",colorBgLayout:"#F9FAFB",fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"},components:{Layout:{siderBg:"#FFFFFF",headerBg:"#FFFFFF"},Menu:{itemBg:"transparent",itemSelectedBg:"#F3F4F6",itemHoverBg:"#F3F4F6",itemSelectedColor:"#7C3AED",itemColor:"#6B7280"},Card:{boxShadow:"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"},Button:{borderRadius:8,primaryShadow:"0 1px 2px 0 rgb(124 58 237 / 0.05)"},Table:{borderRadius:8,headerBg:"#F9FAFB"}}};ae.createRoot(document.getElementById("root")).render(e.jsx(le.StrictMode,{children:e.jsx(de,{store:Rt,children:e.jsx(Ae,{theme:Ct,children:e.jsx(X,{children:e.jsx(kt,{})})})})}));
