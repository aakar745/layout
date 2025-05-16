import{r as e,j as t,a5 as r,d as o,b as s,i as a}from"./vendor-others-aeGeD6f-.js";import{c as n,u as i,a as l}from"./vendor-react-i7tvbPTl.js";import{d as c}from"./store-D4NI4RZ9.js";import{a as d,b as m}from"./services-DHEt1Qtz.js";import{n as p,k as x}from"./vendor-ui-BOD89xu8.js";import{F as f}from"./vendor-antd-form-DJHhvp8w.js";import{T as h,A as u,P as g,k as b,s as y,I as j,y as v}from"./vendor-antd-core-CLD06I8y.js";import{B as w}from"./vendor-antd-buttons-wjEWA2x8.js";import"./vendor-canvas-BOVIu3pe.js";import"./vendor-utils-CTzFqUk0.js";import"./component-exhibition-CuwlJtEU.js";import"./vendor-editor-HOXaQDhO.js";import"./vendor-antd-modal-1GBGM2fb.js";import"./component-layout-BTsCaDZB.js";import"./component-auth-ClRi3ofU.js";import"./vendor-antd-table-CA0XBoxE.js";const{Title:k,Text:S,Paragraph:$}=h,I=x`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`,Y=x`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`,E=x`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`,L=x`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`,z=x`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`,C=x`
  0% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(25deg) translateY(-260px) scaleY(1.2); opacity: 0; }
`,N=x`
  0% { transform: rotate(-25deg) translateY(260px) scaleY(1.2); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
`,T=x`
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
`,M=p.div`
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,U=p.div`
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
  animation: ${Y} 0.8s ease-out forwards;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`,P=p.div`
  position: absolute;
  width: 2px;
  height: 600px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, ${e=>.1+e.index%3*.05}), transparent);
  left: ${e=>20+10*e.index}%;
  top: 0;
  z-index: 1;
  opacity: 0;
  transform-origin: top;
  animation: ${e=>e.isHovered?C:N} ${e=>1.5+.2*e.index}s ease-out;
  animation-delay: ${e=>.1*e.index}s;
  animation-fill-mode: forwards;
`,A=p.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
  animation: ${E} 0.8s ease-out forwards;
`,R=p.div`
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`,B=p.svg`
  width: 40px;
  height: 40px;
  
  .path {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    animation: ${T} 2s linear infinite;
  }
  
  .dot {
    fill: #1890ff;
    animation: ${L} 2s ease-in-out infinite;
  }
`,F=p.span`
  margin-left: 10px;
  animation: ${I} 0.5s ease-out;
`,X=p.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`,q=p.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`,D=p.div`
  position: absolute;
  top: 25px;
  left: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  animation: ${I} 0.8s ease-out forwards;
`,H=p.div`
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
`,O=p.img`
  width: 140px;
  height: auto;
  animation: ${z} 6s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
`;p.div({fontSize:"1.25rem",fontWeight:600,marginLeft:"14px",color:"#1a3e72",letterSpacing:"0.5px"});const G=p.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${I} 0.8s ease-out forwards;
`,J=p.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  color: #ffffff;
  letter-spacing: 1px;
`,V=p(k)`
  color: #ffffff !important;
  font-weight: 400 !important;
  text-align: center;
  margin-top: 0 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`,W=p($)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 500px;
  margin: 1.5rem auto 0;
`,Z=p.div`
  width: 100%;
  max-width: 400px;
  animation: ${I} 0.6s ease-out;
`,_=p(j)`
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
`,K=p(j.Password)`
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
`,Q=p(w)`
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
    animation: ${L} 0.5s ease-in-out;
  }
`,ee=p.div`
  margin-bottom: 2rem;
  text-align: center;
`,te=p(f.Item)`
  margin-bottom: 24px;
`,re=p.div`
  margin-top: 8px;
`,oe=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`,se=p(v)`
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
`,ae=p.div`
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
  animation: ${I} 0.3s ease-out;
  
  svg {
    font-size: 80px;
    color: #52c41a;
    animation: ${L} 0.5s ease-in-out;
  }
`,ne=()=>t.jsxs(R,{children:[t.jsxs(B,{viewBox:"0 0 50 50",children:[t.jsx("path",{className:"path",d:"M10,10 L40,10 L40,40 L10,40 L10,10 Z M10,25 L40,25 M20,10 L20,40 M30,10 L30,40"}),t.jsx("circle",{className:"dot",cx:"15",cy:"15",r:"2"}),t.jsx("circle",{className:"dot",cx:"25",cy:"15",r:"2"}),t.jsx("circle",{className:"dot",cx:"35",cy:"15",r:"2"}),t.jsx("circle",{className:"dot",cx:"15",cy:"35",r:"2"}),t.jsx("circle",{className:"dot",cx:"25",cy:"35",r:"2"}),t.jsx("circle",{className:"dot",cx:"35",cy:"35",r:"2"})]}),t.jsx(F,{children:"Signing in..."})]}),ie=p.div`
  position: absolute;
  width: ${e=>e.size}px;
  height: ${e=>e.size}px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  animation: ${z} ${e=>e.duration}s ease-in-out infinite;
  animation-delay: ${e=>e.delay}s;
  top: ${e=>e.top}%;
  left: ${e=>e.left}%;
  z-index: 1;
`,le=["At least 8 characters long","Contains uppercase letters","Contains lowercase letters","Contains numbers","Contains special characters"],ce=()=>{const p=n(),x=i(),[h,j]=e.useState(null),[v,$]=e.useState(!1),[I,Y]=e.useState(!1),[E,L]=e.useState(""),[z,C]=e.useState(!1),N=l((e=>e.auth.isAuthenticated)),T=e.useRef(null),[R,B]=e.useState({x:0,y:0}),[F,ce]=e.useState(!1),[de,me]=e.useState(!1),[pe]=f.useForm(),[xe,fe]=e.useState("/logo.png"),[he,ue]=e.useState("EXHIBITION MANAGER");e.useEffect((()=>{const e=localStorage.getItem("cachedLogoUrl"),t=localStorage.getItem("logoTimestamp"),r=(new Date).getTime();if(e&&t&&r-parseInt(t)<36e5)fe(e);else{const e=`${d.defaults.baseURL}/public/logo`;fe(e),localStorage.setItem("cachedLogoUrl",e),localStorage.setItem("logoTimestamp",r.toString());(new Image).src=e}fetch(`${d.defaults.baseURL}/public/site-info`).then((e=>e.json())).then((e=>{e.siteName&&ue(e.siteName)})).catch((e=>{}))}),[]),e.useEffect((()=>{const e=localStorage.getItem("rememberedUser");if(e)try{const t=JSON.parse(e);pe.setFieldsValue({username:t.username,password:t.password,remember:!0})}catch(t){localStorage.removeItem("rememberedUser")}}),[pe]),e.useEffect((()=>{const e=setTimeout((()=>{ce(!0)}),100);return()=>clearTimeout(e)}),[]),e.useEffect((()=>{N&&p("/dashboard")}),[N,p]),e.useEffect((()=>{const e=e=>{if(T.current){const t=T.current.getBoundingClientRect(),r=e.clientX-t.left,o=e.clientY-t.top;r>=0&&r<=t.width&&o>=0&&o<=t.height&&B({x:r,y:o})}};return window.addEventListener("mousemove",e),()=>{window.removeEventListener("mousemove",e)}}),[]);const ge=(e=>{if(!e)return 0;const t=[e.length>=8,/[A-Z]/.test(e),/[a-z]/.test(e),/\d/.test(e),/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(e)];return t.filter((e=>e)).length/t.length*100})(E),be=(ye=ge)<30?"#ff4d4f":ye<60?"#faad14":ye<80?"#1890ff":"#52c41a";var ye;const je=(e=>e<30?"Weak":e<60?"Fair":e<80?"Good":"Strong")(ge),ve="true"===localStorage.getItem("rememberUser");if(N)return t.jsxs("div",{style:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",background:"#f0f5ff"},children:[t.jsx(ne,{}),t.jsx(S,{style:{marginTop:16},children:"Redirecting to dashboard..."})]});const we=e=>{me(e)};return t.jsxs(M,{style:{opacity:F?1:0,transition:"opacity 0.3s ease-out"},children:[I&&t.jsx(ae,{children:t.jsx(r,{})}),t.jsxs(U,{onMouseEnter:()=>we(!0),onMouseLeave:()=>we(!1),children:[t.jsx(D,{children:t.jsx(H,{children:t.jsx(O,{src:xe,alt:"Exhibition Manager Logo",onError:()=>fe("/logo.png")})})}),t.jsxs(X,{ref:T,children:[(e=>{const r=[];for(let o=0;o<e;o++){const e=20*Math.random()+8,s=3*Math.random(),a=10*Math.random()+6,n=100*Math.random(),i=100*Math.random();r.push(t.jsx(ie,{size:e,delay:s,duration:a,top:n,left:i,style:{transform:`translate(${R.x/50*(o%5-2)}px, ${R.y/50*(o%5-2)}px)`,opacity:de?0:1,transition:"opacity 0.5s ease-out",backgroundColor:"rgba(255, 255, 255, 0.07)"}},o))}return r})(12),(e=>{const r=[];for(let o=0;o<e;o++)r.push(t.jsx(P,{index:o,isHovered:de},o));return r})(8)]}),t.jsxs(q,{children:[t.jsx(G,{children:t.jsx(J,{children:he})}),t.jsx(V,{level:4,children:"Your complete solution for managing exhibitions, stalls, and exhibitors"}),t.jsx(W,{children:"Create floor plans, manage exhibitors, handle bookings, and generate invoices - all in one platform."})]})]}),t.jsx(A,{children:t.jsxs(Z,{children:[t.jsxs(ee,{children:[t.jsx(k,{level:2,style:{marginBottom:"0.5rem"},children:"Admin Login"}),t.jsx(S,{type:"secondary",children:"Enter your credentials to access the admin dashboard"})]}),h&&t.jsx(u,{message:h.title,description:h.message,type:"error",showIcon:!0,style:{marginBottom:24,borderRadius:8,boxShadow:"0 2px 8px rgba(0, 0, 0, 0.05)"},action:t.jsx(w,{size:"small",type:"text",onClick:()=>j(null),children:"Dismiss"})}),t.jsxs(f,{form:pe,name:"login",initialValues:{remember:ve},onFinish:async e=>{try{j(null),$(!0);const t=await m.login({username:e.username,password:e.password}),{user:r,token:o}=t.data;if(!r||!o)throw new Error("Invalid response from server");e.remember?(localStorage.setItem("rememberedUser",JSON.stringify({username:e.username,password:e.password})),localStorage.setItem("rememberUser","true")):(localStorage.removeItem("rememberedUser"),localStorage.removeItem("rememberUser")),Y(!0),setTimeout((()=>{x(c({user:r,token:o})),y.success("Login successful!"),p("/dashboard")}),1200)}catch(t){let e="Authentication Error",r="Invalid username or password.";if(t.response&&"object"==typeof t.response){const{status:o,data:s}=t.response;401===o?(e="Invalid Credentials",r="The username or password you entered is incorrect."):403===o?(e="Access Denied",r="You do not have permission to access this resource."):400===o?(e="Invalid Request",r="Please check your input and try again."):500===o&&(e="Server Error",r="A server error occurred. Please try again later."),s&&"object"==typeof s&&s.message&&(r=s.message)}else t.request?(e="Connection Error",r="Unable to connect to the server. Please check your internet connection."):t.message&&(r=t.message);j({title:e,message:r})}finally{$(!1)}},layout:"vertical",children:[t.jsx(te,{name:"username",rules:[{required:!0,message:"Please input your username!"}],label:"Username",children:t.jsx(_,{prefix:t.jsx(o,{style:{color:"#bfbfbf"}}),placeholder:"Enter your username",disabled:v,autoComplete:"username"})}),t.jsx(te,{name:"password",rules:[{required:!0,message:"Please input your password!"}],label:"Password",help:z&&t.jsxs(re,{children:[t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"},children:[t.jsx(S,{type:"secondary",children:"Password Strength:"}),t.jsx(S,{strong:!0,style:{color:be},children:je})]}),t.jsx(g,{percent:ge,showInfo:!1,strokeColor:be,size:"small"}),t.jsx("div",{style:{marginTop:"8px"},children:t.jsx(b,{title:t.jsx("ul",{style:{paddingLeft:"20px",margin:"0"},children:le.map(((e,r)=>t.jsx("li",{children:e},r)))}),children:t.jsxs(S,{type:"secondary",style:{display:"flex",alignItems:"center",cursor:"pointer"},children:[t.jsx(a,{style:{marginRight:"4px"}}),"Password requirements"]})})})]}),children:t.jsx(K,{prefix:t.jsx(s,{style:{color:"#bfbfbf"}}),placeholder:"Enter your password",disabled:v,autoComplete:"current-password",onChange:e=>L(e.target.value),onFocus:()=>C(!0),onBlur:()=>C(!1)})}),t.jsx(oe,{children:t.jsx(te,{name:"remember",valuePropName:"checked",noStyle:!0,children:t.jsx(se,{children:"Remember me"})})}),t.jsx(te,{children:v?t.jsx(ne,{}):t.jsx(Q,{type:"primary",htmlType:"submit",block:!0,className:I?"success":"",children:"Sign in"})})]})]})})]})};export{ce as default};
