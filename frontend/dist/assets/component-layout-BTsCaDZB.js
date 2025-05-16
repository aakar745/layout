import{r as e,j as i,d as t,I as o,J as r,K as s,L as a,M as n,m as l,N as d,O as x,P as c,Q as h,s as p,e as g,a as m,S as b}from"./vendor-others-aeGeD6f-.js";import{L as j,c as f,u,a as y}from"./vendor-react-i7tvbPTl.js";import{n as w}from"./vendor-ui-BOD89xu8.js";import{a as k}from"./services-DHEt1Qtz.js";import{L as v,u as C,M as E,s as S,v as L,e as z,w as D,T as M,I as F,D as I,R as T,C as R}from"./vendor-antd-core-CLD06I8y.js";import{B as A}from"./vendor-antd-buttons-wjEWA2x8.js";import{F as U}from"./vendor-antd-form-DJHhvp8w.js";import{b as N,e as P,s as B,c as Y}from"./store-D4NI4RZ9.js";import{E as $,F as _}from"./component-auth-ClRi3ofU.js";const{Header:Q}=v,V=w(Q)`
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
`,K=w.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`,O=w.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: flex-start;
  }
`,q=w.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`,G=w.img`
  height: auto;
  width: 100%;
  max-width: 140px;
  max-height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 120px;
  }
`,H=w(C)`
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
`,J=w(E)`
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
`,W=w(E)`
  border: none;
  display: flex;
  justify-content: center;
  font-size: 15px;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`,X=w(A)`
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
`,Z=w.div`
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
`,ee=w(j)`
  display: block;
  padding: 16px 8px;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    color: #1890ff;
  }
`,ie=w(A)`
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
`,te=w.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`,oe=w.span`
  margin-right: 8px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`,re=()=>{var d;const x=f(),c=u(),[h,p]=e.useState(!1),[g,m]=e.useState(!1),[b,w]=e.useState(!1),[v,C]=e.useState("/logo.png"),[E,M]=e.useState("Exhibition Manager"),F=y((e=>e.exhibitorAuth)),{exhibitor:I,isAuthenticated:T,showLoginModal:R,showForgotPasswordModal:A}=F;e.useEffect((()=>{const e=localStorage.getItem("cachedLogoUrl"),i=localStorage.getItem("logoTimestamp"),t=(new Date).getTime();if(e&&i&&t-parseInt(i)<36e5)C(e);else{const e=`${k.defaults.baseURL}/public/logo`;C(e),localStorage.setItem("cachedLogoUrl",e),localStorage.setItem("logoTimestamp",t.toString());(new Image).src=e}fetch(`${k.defaults.baseURL}/public/site-info`).then((e=>e.json())).then((e=>{e.siteName&&M(e.siteName)})).catch((e=>{}))}),[]),e.useEffect((()=>(S.config({top:84,duration:3,maxCount:1}),()=>{S.destroy()})),[]);const U=()=>{c(P()),S.success("Successfully logged out"),x("/"),p(!1),m(!1)},Q=()=>{c(B(void 0)),p(!1),m(!1)},re=()=>{w(!0),p(!1),m(!1)},se=[{key:"exhibitions",label:"Exhibitions",path:"/exhibitions"},{key:"about",label:"About",path:"/about"},{key:"contact",label:"Contact",path:"/contact"}],ae=i.jsx(J,{items:[{key:"exhibitor-login",icon:i.jsx(a,{}),label:i.jsx("a",{onClick:Q,children:"Exhibitor Login"})},{key:"exhibitor-register",icon:i.jsx(n,{}),label:i.jsx("a",{onClick:re,children:"Register as Exhibitor"})}]}),ne=i.jsx(J,{items:[{key:"exhibitor-dashboard",icon:i.jsx(r,{}),label:i.jsx(j,{to:"/exhibitor/dashboard",children:"Dashboard"})},{key:"exhibitor-profile",icon:i.jsx(t,{}),label:i.jsx(j,{to:"/exhibitor/profile",children:"My Profile"})},{key:"exhibitor-bookings",icon:i.jsx(l,{}),label:i.jsx(j,{to:"/exhibitor/bookings",children:"My Bookings"})},{key:"divider",type:"divider"},{key:"exhibitor-logout",icon:i.jsx(s,{}),label:i.jsx("a",{onClick:U,children:"Logout"})}]});return i.jsxs(i.Fragment,{children:[i.jsx(V,{children:i.jsxs(K,{children:[i.jsx(O,{children:i.jsx(j,{to:"/",style:{display:"flex",alignItems:"center",textDecoration:"none"},children:i.jsx(q,{children:i.jsx(G,{src:v,alt:"Logo",onError:()=>C("/logo.png")})})})}),i.jsx(W,{mode:"horizontal",selectedKeys:[],style:{flex:1,display:"flex",justifyContent:"center"},items:se.map((e=>({key:e.key,label:i.jsx(j,{to:e.path,children:e.label})})))}),i.jsx(te,{children:i.jsx(L,{overlay:F.isAuthenticated?ne:ae,trigger:["click"],placement:"bottomRight",open:h,onOpenChange:p,overlayStyle:{minWidth:"150px",marginTop:"10px"},children:F.isAuthenticated?i.jsxs(z,{style:{cursor:"pointer"},children:[i.jsx(oe,{children:(null==(d=F.exhibitor)?void 0:d.companyName)||"Exhibitor"}),i.jsx(H,{icon:i.jsx(t,{}),size:"large"})]}):i.jsx(H,{icon:i.jsx(t,{}),size:"large"})})}),i.jsx(X,{icon:i.jsx(o,{}),onClick:()=>m(!0)})]})}),i.jsx(Z,{children:i.jsxs(D,{title:"Exhibition Management System",placement:"right",onClose:()=>m(!1),open:g,width:280,closeIcon:i.jsx("span",{style:{fontSize:"16px"},children:"×"}),children:[i.jsx("div",{style:{marginBottom:24},children:se.map((e=>i.jsx(ee,{to:e.path,onClick:()=>m(!1),children:e.label},e.key)))}),i.jsx("div",{style:{marginTop:40},children:F.isAuthenticated?i.jsxs(i.Fragment,{children:[i.jsx(ie,{type:"primary",icon:i.jsx(r,{}),onClick:()=>{x("/exhibitor/dashboard"),m(!1)},children:"Dashboard"}),i.jsx(ie,{type:"default",icon:i.jsx(s,{}),onClick:U,children:"Logout"})]}):i.jsxs(i.Fragment,{children:[i.jsx(ie,{type:"primary",style:{background:"#7E57C2",borderColor:"#7E57C2"},icon:i.jsx(a,{}),onClick:()=>{Q(),m(!1)},children:"Exhibitor Login"}),i.jsx(ie,{type:"default",icon:i.jsx(n,{}),onClick:()=>{re(),m(!1)},children:"Register as Exhibitor"})]})})]})}),i.jsx($,{loginModalVisible:R,registerModalVisible:b,setRegisterModalVisible:w,setExhibitorCredentials:e=>c(N(e)),onForgotPassword:()=>{c(Y())}}),i.jsx(_,{visible:A})]})},{Footer:se}=v,{Title:ae,Paragraph:ne,Text:le}=M,de=w(se)`
  background: linear-gradient(to right, #242a38, #1a1f2c);
  padding: 60px 0 20px;
  color: rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`,xe=w.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,ce=w(ae)`
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
`,he=w.div`
  margin-bottom: 20px;
`,pe=w.img`
  height: auto;
  width: 100%;
  max-width: 160px;
  margin-bottom: 16px;
`,ge=w(j)`
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`,me=w.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`,be=w.div`
  margin-right: 10px;
  color: #4158D0;
`,je=w.a`
  font-size: 24px;
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateY(-3px);
  }
`,fe=w(F)`
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
`,ue=w(A)`
  background: linear-gradient(90deg, #4158D0, #C850C0);
  border: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`,ye=w(le)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  font-size: 14px;
`,we=w(I)`
  background: rgba(255, 255, 255, 0.1);
  margin: 30px 0;
`,ke=()=>{const[t,o]=e.useState("/logo.png"),[r,s]=e.useState("Exhibition Manager"),a=(new Date).getFullYear();return e.useEffect((()=>{const e=`${k.defaults.baseURL}/public/logo`;o(e),fetch(`${k.defaults.baseURL}/public/site-info`).then((e=>e.json())).then((e=>{e.siteName&&s(e.siteName)})).catch((e=>{}))}),[]),i.jsx(de,{children:i.jsxs(xe,{children:[i.jsxs(T,{gutter:[48,40],children:[i.jsxs(R,{xs:24,sm:24,md:8,lg:7,children:[i.jsx(he,{children:i.jsx(j,{to:"/",children:i.jsx(pe,{src:t,alt:r,onError:()=>o("/logo.png")})})}),i.jsx(ne,{style:{color:"rgba(255, 255, 255, 0.7)",marginBottom:24},children:"The premier platform for exhibition stall booking. Connect exhibitors with event organizers and simplify the booking process."}),i.jsxs(z,{children:[i.jsx(je,{href:"#",target:"_blank",rel:"noopener noreferrer",children:i.jsx(d,{})}),i.jsx(je,{href:"#",target:"_blank",rel:"noopener noreferrer",children:i.jsx(x,{})}),i.jsx(je,{href:"#",target:"_blank",rel:"noopener noreferrer",children:i.jsx(c,{})}),i.jsx(je,{href:"#",target:"_blank",rel:"noopener noreferrer",children:i.jsx(h,{})})]})]}),i.jsxs(R,{xs:24,sm:12,md:5,lg:5,children:[i.jsx(ce,{level:4,children:"Quick Links"}),i.jsx(ge,{to:"/exhibitions",children:"Exhibitions"}),i.jsx(ge,{to:"/about",children:"About Us"}),i.jsx(ge,{to:"/contact",children:"Contact Us"}),i.jsx(ge,{to:"/privacy-policy",children:"Privacy Policy"}),i.jsx(ge,{to:"/terms",children:"Terms & Conditions"})]}),i.jsxs(R,{xs:24,sm:12,md:5,lg:5,children:[i.jsx(ce,{level:4,children:"For Exhibitors"}),i.jsx(ge,{to:"/exhibitor/login",children:"Login"}),i.jsx(ge,{to:"/exhibitor/register",children:"Register"}),i.jsx(ge,{to:"/exhibitor/dashboard",children:"Dashboard"}),i.jsx(ge,{to:"/exhibitor/bookings",children:"My Bookings"}),i.jsx(ge,{to:"/faq",children:"FAQ"})]}),i.jsxs(R,{xs:24,sm:24,md:6,lg:7,children:[i.jsx(ce,{level:4,children:"Contact Us"}),i.jsxs(me,{children:[i.jsx(be,{children:i.jsx(p,{})}),i.jsx("div",{children:"123 Exhibition Street, New Delhi, India"})]}),i.jsxs(me,{children:[i.jsx(be,{children:i.jsx(g,{})}),i.jsx("div",{children:"+91 98765 43210"})]}),i.jsxs(me,{children:[i.jsx(be,{children:i.jsx(m,{})}),i.jsx("div",{children:"info@exhibitionmanager.com"})]}),i.jsxs("div",{style:{marginTop:24},children:[i.jsx(ce,{level:4,children:"Newsletter"}),i.jsx(U,{children:i.jsxs(z.Compact,{style:{width:"100%"},children:[i.jsx(fe,{placeholder:"Your email address"}),i.jsx(ue,{type:"primary",icon:i.jsx(b,{}),children:"Subscribe"})]})})]})]})]}),i.jsx(we,{}),i.jsxs(ye,{children:["© ",a," ",r,". All rights reserved."]})]})})};export{re as G,ke as a};
