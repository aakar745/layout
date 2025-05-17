import{k as D,r as a,j as e,R as Fe}from"./vendor-react-core-GL8v-krj.js";import{c as Oe,a as Ce,u as we,b as Te}from"./vendor-redux-9XI87JsB.js";import{k as Le,j as Se,l as U}from"./app-core-BUxrPMxd.js";import{n as m}from"./vendor-ui-utils-C1xmPZI8.js";import{T as ce,I,B as v,F as r,d as Be,m as Y,P as qe,g as Ye,s as C,n as de,M as xe,D as oe,R as Ue,C as ve}from"./vendor-antd-core-1s5t57SE.js";import{u as De}from"./vendor-react-router-BoDVXa_L.js";import{f as Ve,i as Ee,o as Z,p as _e,q as ye,r as We,s as Je}from"./vendor-antd-icons-C-4QrCZ0.js";const Ie=localStorage.getItem("token"),pe=localStorage.getItem("user");let Me=null;try{Me=pe&&pe!=="undefined"?JSON.parse(pe):null}catch(t){console.error("Failed to parse user data from localStorage",t),localStorage.removeItem("user")}const He={isAuthenticated:!!Ie,user:Me,token:Ie,loading:!1,error:null},he=Oe("auth/refreshUser",async(t,{rejectWithValue:o})=>{var u,x;try{return(await Le.getProfile()).data}catch(R){return o(((x=(u=R.response)==null?void 0:u.data)==null?void 0:x.message)||"Failed to refresh user data")}}),$e=Ce({name:"auth",initialState:He,reducers:{setCredentials:(t,o)=>{t.user=o.payload.user,t.token=o.payload.token,t.isAuthenticated=!0,localStorage.setItem("token",o.payload.token),localStorage.setItem("user",JSON.stringify(o.payload.user))},logout:t=>{t.user=null,t.token=null,t.isAuthenticated=!1,localStorage.removeItem("token"),localStorage.removeItem("user")}},extraReducers:t=>{t.addCase(he.pending,o=>{o.loading=!0,o.error=null}).addCase(he.fulfilled,(o,u)=>{o.loading=!1,o.user=u.payload,localStorage.setItem("user",JSON.stringify(u.payload))}).addCase(he.rejected,(o,u)=>{o.loading=!1,o.error=u.payload})}}),{setCredentials:Xe,logout:Ut}=$e.actions,Dt=$e.reducer,ke=localStorage.getItem("exhibitor_token"),Ge=localStorage.getItem("exhibitor")?JSON.parse(localStorage.getItem("exhibitor")):null,Ze={isAuthenticated:!!ke,exhibitor:Ge,token:ke,showLoginModal:!1,showForgotPasswordModal:!1,loginContext:null},Ne=Ce({name:"exhibitorAuth",initialState:Ze,reducers:{setExhibitorCredentials:(t,o)=>{t.exhibitor=o.payload.exhibitor,t.token=o.payload.token,t.isAuthenticated=!0,localStorage.setItem("exhibitor_token",o.payload.token),localStorage.setItem("exhibitor",JSON.stringify(o.payload.exhibitor))},exhibitorLogout:t=>{t.exhibitor=null,t.token=null,t.isAuthenticated=!1,localStorage.removeItem("exhibitor_token"),localStorage.removeItem("exhibitor")},showLoginModal:(t,o)=>{t.showLoginModal=!0,t.showForgotPasswordModal=!1,t.loginContext=o.payload||null},hideLoginModal:t=>{t.showLoginModal=!1,t.loginContext=null},showForgotPasswordModal:t=>{t.showForgotPasswordModal=!0,t.showLoginModal=!1},hideForgotPasswordModal:t=>{t.showForgotPasswordModal=!1}}}),{setExhibitorCredentials:Vt,exhibitorLogout:_t,showLoginModal:le,hideLoginModal:ne,showForgotPasswordModal:Wt,hideForgotPasswordModal:ge}=Ne.actions,Jt=Ne.reducer,{Title:ze,Text:re,Paragraph:Ke}=ce,ae=D`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`,Qe=D`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`,et=D`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`,be=D`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`,Ae=D`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`,tt=D`
  0% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(25deg) translateY(-260px) scaleY(1.2); opacity: 0; }
`,st=D`
  0% { transform: rotate(-25deg) translateY(260px) scaleY(1.2); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); opacity: 0; }
`,rt=D`
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
`,ot=m.div`
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`,at=m.div`
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
  animation: ${Qe} 0.8s ease-out forwards;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`,nt=m.div`
  position: absolute;
  width: 2px;
  height: 600px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, ${t=>.1+t.index%3*.05}), transparent);
  left: ${t=>20+t.index*10}%;
  top: 0;
  z-index: 1;
  opacity: 0;
  transform-origin: top;
  animation: ${t=>t.isHovered?tt:st} ${t=>1.5+t.index*.2}s ease-out;
  animation-delay: ${t=>t.index*.1}s;
  animation-fill-mode: forwards;
`,it=m.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
  animation: ${et} 0.8s ease-out forwards;
`,lt=m.div`
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`,ct=m.svg`
  width: 40px;
  height: 40px;
  
  .path {
    stroke: #1890ff;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    animation: ${rt} 2s linear infinite;
  }
  
  .dot {
    fill: #1890ff;
    animation: ${be} 2s ease-in-out infinite;
  }
`,dt=m.span`
  margin-left: 10px;
  animation: ${ae} 0.5s ease-out;
`,mt=m.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`,ut=m.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`,pt=m.div`
  position: absolute;
  top: 25px;
  left: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  animation: ${ae} 0.8s ease-out forwards;
`,ht=m.div`
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
`,gt=m.img`
  width: 140px;
  height: auto;
  animation: ${Ae} 6s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
`;m.div({fontSize:"1.25rem",fontWeight:600,marginLeft:"14px",color:"#1a3e72",letterSpacing:"0.5px"});const ft=m.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${ae} 0.8s ease-out forwards;
`,xt=m.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  color: #ffffff;
  letter-spacing: 1px;
`,yt=m(ze)`
  color: #ffffff !important;
  font-weight: 400 !important;
  text-align: center;
  margin-top: 0 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`,wt=m(Ke)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  max-width: 500px;
  margin: 1.5rem auto 0;
`,bt=m.div`
  width: 100%;
  max-width: 400px;
  animation: ${ae} 0.6s ease-out;
`,jt=m(I)`
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
`,Pt=m(I.Password)`
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
`,St=m(v)`
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
    animation: ${be} 0.5s ease-in-out;
  }
`,vt=m.div`
  margin-bottom: 2rem;
  text-align: center;
`,ie=m(r.Item)`
  margin-bottom: 24px;
`,It=m.div`
  margin-top: 8px;
`,kt=m.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`,Rt=m(Be)`
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
`,Ft=m.div`
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
  animation: ${ae} 0.3s ease-out;
  
  svg {
    font-size: 80px;
    color: #52c41a;
    animation: ${be} 0.5s ease-in-out;
  }
`,Re=()=>e.jsxs(lt,{children:[e.jsxs(ct,{viewBox:"0 0 50 50",children:[e.jsx("path",{className:"path",d:"M10,10 L40,10 L40,40 L10,40 L10,10 Z M10,25 L40,25 M20,10 L20,40 M30,10 L30,40"}),e.jsx("circle",{className:"dot",cx:"15",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"25",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"35",cy:"15",r:"2"}),e.jsx("circle",{className:"dot",cx:"15",cy:"35",r:"2"}),e.jsx("circle",{className:"dot",cx:"25",cy:"35",r:"2"}),e.jsx("circle",{className:"dot",cx:"35",cy:"35",r:"2"})]}),e.jsx(dt,{children:"Signing in..."})]}),Ct=m.div`
  position: absolute;
  width: ${t=>t.size}px;
  height: ${t=>t.size}px;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  animation: ${Ae} ${t=>t.duration}s ease-in-out infinite;
  animation-delay: ${t=>t.delay}s;
  top: ${t=>t.top}%;
  left: ${t=>t.left}%;
  z-index: 1;
`,Tt=t=>{if(!t)return 0;const o=t.length>=8,u=/[A-Z]/.test(t),x=/[a-z]/.test(t),R=/\d/.test(t),f=/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(t),T=[o,u,x,R,f];return T.filter(w=>w).length/T.length*100},Lt=t=>t<30?"#ff4d4f":t<60?"#faad14":t<80?"#1890ff":"#52c41a",Et=t=>t<30?"Weak":t<60?"Fair":t<80?"Good":"Strong",Mt=["At least 8 characters long","Contains uppercase letters","Contains lowercase letters","Contains numbers","Contains special characters"],Ht=()=>{const t=De(),o=we(),[u,x]=a.useState(null),[R,f]=a.useState(!1),[T,p]=a.useState(!1),[w,O]=a.useState(""),[y,M]=a.useState(!1),F=Te(i=>i.auth.isAuthenticated),L=a.useRef(null),[$,N]=a.useState({x:0,y:0}),[B,b]=a.useState(!1),[K,V]=a.useState(!1),[_]=r.useForm(),[H,q]=a.useState("/logo.png"),[z,X]=a.useState("EXHIBITION MANAGER");a.useEffect(()=>{const i=localStorage.getItem("cachedLogoUrl"),h=localStorage.getItem("logoTimestamp"),n=new Date().getTime();if(i&&h&&n-parseInt(h)<36e5)q(i);else{const c=`${Se.defaults.baseURL}/public/logo`;q(c),localStorage.setItem("cachedLogoUrl",c),localStorage.setItem("logoTimestamp",n.toString());const s=new Image;s.src=c}fetch(`${Se.defaults.baseURL}/public/site-info`).then(c=>c.json()).then(c=>{c.siteName&&X(c.siteName)}).catch(c=>{console.error("Error fetching site info:",c)})},[]),a.useEffect(()=>{const i=localStorage.getItem("rememberedUser");if(i)try{const h=JSON.parse(i);_.setFieldsValue({username:h.username,password:h.password,remember:!0})}catch{localStorage.removeItem("rememberedUser")}},[_]),a.useEffect(()=>{const i=setTimeout(()=>{b(!0)},100);return()=>clearTimeout(i)},[]),a.useEffect(()=>{F&&t("/dashboard")},[F,t]),a.useEffect(()=>{const i=h=>{if(L.current){const n=L.current.getBoundingClientRect(),c=h.clientX-n.left,s=h.clientY-n.top;c>=0&&c<=n.width&&s>=0&&s<=n.height&&N({x:c,y:s})}};return window.addEventListener("mousemove",i),()=>{window.removeEventListener("mousemove",i)}},[]);const G=async i=>{var h;try{x(null),f(!0);const n=await Le.login({username:i.username,password:i.password}),{user:c,token:s}=n.data;if(!c||!s)throw new Error("Invalid response from server");i.remember?(localStorage.setItem("rememberedUser",JSON.stringify({username:i.username,password:i.password})),localStorage.setItem("rememberUser","true")):(localStorage.removeItem("rememberedUser"),localStorage.removeItem("rememberUser")),p(!0),setTimeout(()=>{o(Xe({user:c,token:s})),C.success("Login successful!"),t("/dashboard")},1200)}catch(n){console.error("Login Error:",n),console.error("Response Data:",(h=n.response)==null?void 0:h.data);let c="Authentication Error",s="Invalid username or password.";if(n.response&&typeof n.response=="object"){const{status:g,data:d}=n.response;g===401?(c="Invalid Credentials",s="The username or password you entered is incorrect."):g===403?(c="Access Denied",s="You do not have permission to access this resource."):g===400?(c="Invalid Request",s="Please check your input and try again."):g===500&&(c="Server Error",s="A server error occurred. Please try again later."),d&&typeof d=="object"&&d.message&&(s=d.message)}else n.request?(c="Connection Error",s="Unable to connect to the server. Please check your internet connection."):n.message&&(s=n.message);x({title:c,message:s})}finally{f(!1)}},l=Tt(w),j=Lt(l),P=Et(l),k=localStorage.getItem("rememberUser")==="true";if(F)return e.jsxs("div",{style:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",background:"#f0f5ff"},children:[e.jsx(Re,{}),e.jsx(re,{style:{marginTop:16},children:"Redirecting to dashboard..."})]});const E=i=>{const h=[];for(let n=0;n<i;n++){const c=Math.random()*20+8,s=Math.random()*3,g=Math.random()*10+6,d=Math.random()*100,S=Math.random()*100;h.push(e.jsx(Ct,{size:c,delay:s,duration:g,top:d,left:S,style:{transform:`translate(${$.x/50*(n%5-2)}px, ${$.y/50*(n%5-2)}px)`,opacity:K?0:1,transition:"opacity 0.5s ease-out",backgroundColor:"rgba(255, 255, 255, 0.07)"}},n))}return h},me=i=>{const h=[];for(let n=0;n<i;n++)h.push(e.jsx(nt,{index:n,isHovered:K},n));return h},Q=i=>{V(i)};return e.jsxs(ot,{style:{opacity:B?1:0,transition:"opacity 0.3s ease-out"},children:[T&&e.jsx(Ft,{children:e.jsx(Ve,{})}),e.jsxs(at,{onMouseEnter:()=>Q(!0),onMouseLeave:()=>Q(!1),children:[e.jsx(pt,{children:e.jsx(ht,{children:e.jsx(gt,{src:H,alt:"Exhibition Manager Logo",onError:()=>q("/logo.png")})})}),e.jsxs(mt,{ref:L,children:[E(12),me(8)]}),e.jsxs(ut,{children:[e.jsx(ft,{children:e.jsx(xt,{children:z})}),e.jsx(yt,{level:4,children:"Your complete solution for managing exhibitions, stalls, and exhibitors"}),e.jsx(wt,{children:"Create floor plans, manage exhibitors, handle bookings, and generate invoices - all in one platform."})]})]}),e.jsx(it,{children:e.jsxs(bt,{children:[e.jsxs(vt,{children:[e.jsx(ze,{level:2,style:{marginBottom:"0.5rem"},children:"Admin Login"}),e.jsx(re,{type:"secondary",children:"Enter your credentials to access the admin dashboard"})]}),u&&e.jsx(Y,{message:u.title,description:u.message,type:"error",showIcon:!0,style:{marginBottom:24,borderRadius:8,boxShadow:"0 2px 8px rgba(0, 0, 0, 0.05)"},action:e.jsx(v,{size:"small",type:"text",onClick:()=>x(null),children:"Dismiss"})}),e.jsxs(r,{form:_,name:"login",initialValues:{remember:k},onFinish:G,layout:"vertical",children:[e.jsx(ie,{name:"username",rules:[{required:!0,message:"Please input your username!"}],label:"Username",children:e.jsx(jt,{prefix:e.jsx(Ee,{style:{color:"#bfbfbf"}}),placeholder:"Enter your username",disabled:R,autoComplete:"username"})}),e.jsx(ie,{name:"password",rules:[{required:!0,message:"Please input your password!"}],label:"Password",help:y&&e.jsxs(It,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"},children:[e.jsx(re,{type:"secondary",children:"Password Strength:"}),e.jsx(re,{strong:!0,style:{color:j},children:P})]}),e.jsx(qe,{percent:l,showInfo:!1,strokeColor:j,size:"small"}),e.jsx("div",{style:{marginTop:"8px"},children:e.jsx(Ye,{title:e.jsx("ul",{style:{paddingLeft:"20px",margin:"0"},children:Mt.map((i,h)=>e.jsx("li",{children:i},h))}),children:e.jsxs(re,{type:"secondary",style:{display:"flex",alignItems:"center",cursor:"pointer"},children:[e.jsx(_e,{style:{marginRight:"4px"}}),"Password requirements"]})})})]}),children:e.jsx(Pt,{prefix:e.jsx(Z,{style:{color:"#bfbfbf"}}),placeholder:"Enter your password",disabled:R,autoComplete:"current-password",onChange:i=>O(i.target.value),onFocus:()=>M(!0),onBlur:()=>M(!1)})}),e.jsx(kt,{children:e.jsx(ie,{name:"remember",valuePropName:"checked",noStyle:!0,children:e.jsx(Rt,{children:"Remember me"})})}),e.jsx(ie,{children:R?e.jsx(Re,{}):e.jsx(St,{type:"primary",htmlType:"submit",block:!0,className:T?"success":"",children:"Sign in"})})]})]})})]})},{Step:fe}=de,{Text:$t}=ce,Xt=({loginModalVisible:t,registerModalVisible:o,setRegisterModalVisible:u,setExhibitorCredentials:x,onForgotPassword:R})=>{const f=we(),T=Te(s=>s.exhibitorAuth),[p,w]=a.useState(!1),[O,y]=a.useState(null),[M]=r.useForm(),[F]=r.useForm(),[L]=r.useForm(),[$,N]=a.useState(0),[B,b]=a.useState(""),[K,V]=a.useState(!1),[_,H]=a.useState(!1),[q,z]=a.useState(0),[X,G]=a.useState({companyName:"",contactPerson:""}),l=a.useRef(null),j=async s=>{var g,d,S,A,W,ee,ue,je,Pe;try{y(null),w(!0);const J=await U.login(s),{exhibitor:te,token:se}=J.data;if(!te||!se)throw new Error("Invalid response from server");x({exhibitor:te,token:se}),f(ne()),M.resetFields(),C.success("Login successful!")}catch(J){if(((g=J.response)==null?void 0:g.status)===403){const te=(S=(d=J.response)==null?void 0:d.data)==null?void 0:S.status;if(te==="pending")y("Your account is pending approval. You will be able to log in after admin approval.");else if(te==="rejected"){const se=(W=(A=J.response)==null?void 0:A.data)==null?void 0:W.rejectionReason;y(se?`Your registration has been rejected. Reason: ${se}`:"Your registration has been rejected. Please contact the administrator for more details.")}else y(((ue=(ee=J.response)==null?void 0:ee.data)==null?void 0:ue.message)||"Access denied. Please contact administrator.")}else y(((Pe=(je=J.response)==null?void 0:je.data)==null?void 0:Pe.message)||"Login failed. Please try again.")}finally{w(!1)}},P=async()=>{var s,g;try{const d=await F.validateFields(["email","companyName","contactPerson"]);w(!0),y(null),b(d.email),G({companyName:d.companyName,contactPerson:d.contactPerson}),await U.sendRegistrationOTP(d.email),V(!0),C.success("OTP sent to your email address"),z(60),k(),N(1)}catch(d){if(d.name==="ValidationError")return;const S=((g=(s=d.response)==null?void 0:s.data)==null?void 0:g.message)||"Failed to send OTP. Please try again.";y(S),C.error(S)}finally{w(!1)}},k=()=>{l.current&&clearInterval(l.current),l.current=setInterval(()=>{z(s=>s<=1?(l.current&&clearInterval(l.current),0):s-1)},1e3)},E=async()=>{var s,g;try{w(!0),y(null),await U.sendRegistrationOTP(B),C.success("New OTP sent to your email address"),z(60),k()}catch(d){const S=((g=(s=d.response)==null?void 0:s.data)==null?void 0:g.message)||"Failed to resend OTP. Please try again.";y(S),C.error(S)}finally{w(!1)}},me=async s=>{var g,d;try{w(!0),y(null);const S={email:B,otp:s.otp};await U.verifyOTP(S),H(!0),C.success("Email verified successfully"),l.current&&clearInterval(l.current),N(2)}catch(S){const A=((d=(g=S.response)==null?void 0:g.data)==null?void 0:d.message)||"Invalid OTP. Please try again.";y(A),C.error(A)}finally{w(!1)}},Q=()=>{V(!1),H(!1),b(""),z(0),N(0),G({companyName:"",contactPerson:""}),l.current&&clearInterval(l.current),L.resetFields()},i=async s=>{var g,d,S;try{if(y(null),w(!0),!_){y("Email verification required");return}const{confirmPassword:A,...W}=s,ee={...W,email:B,companyName:X.companyName,contactPerson:X.contactPerson};console.log("Sending registration data:",ee);const ue=await U.register(ee);C.success("Registration successful! You can log in and book a stall only after admin approval."),u(!1),F.resetFields(),Q(),setTimeout(()=>{f(le(void 0))},500)}catch(A){console.error("Registration error:",A),console.error("Response data:",(g=A.response)==null?void 0:g.data);const W=((S=(d=A.response)==null?void 0:d.data)==null?void 0:S.message)||"Registration failed. Please try again.";y(W),C.error(W)}finally{w(!1)}};Fe.useEffect(()=>()=>{l.current&&clearInterval(l.current)},[]);const h=()=>{u(!1),y(null),F.resetFields(),Q()},n=()=>{f(ne()),u(!0),M.resetFields()},c=()=>{u(!1),f(le(void 0)),F.resetFields()};return e.jsxs(e.Fragment,{children:[e.jsxs(xe,{title:"Exhibitor Login",open:t,onCancel:()=>{f(ne()),y(null),M.resetFields()},footer:null,width:400,children:[T.loginContext==="stall-booking"&&e.jsx(Y,{message:"Login Required for Stall Booking",description:"Please log in to your exhibitor account to select and book stalls for this exhibition.",type:"info",showIcon:!0,style:{marginBottom:16}}),O&&e.jsx(Y,{message:O,type:"error",showIcon:!0,style:{marginBottom:16}}),e.jsxs(r,{form:M,name:"exhibitor_login_modal",onFinish:j,layout:"vertical",children:[e.jsx(r.Item,{name:"email",rules:[{required:!0,message:"Please input your email!"},{type:"email",message:"Please enter a valid email address!"}],children:e.jsx(I,{prefix:e.jsx(ye,{}),placeholder:"Email",size:"large",disabled:p})}),e.jsx(r.Item,{name:"password",rules:[{required:!0,message:"Please input your password!"}],children:e.jsx(I.Password,{prefix:e.jsx(Z,{}),placeholder:"Password",size:"large",disabled:p})}),e.jsxs(r.Item,{children:[e.jsx("div",{style:{textAlign:"right",marginBottom:10},children:e.jsx(v,{type:"link",onClick:()=>{f(ne()),R()},style:{padding:0},children:"Forgot password?"})}),e.jsx(v,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:p,children:"Login"})]})]}),e.jsx(oe,{children:e.jsx("span",{style:{fontSize:"14px",color:"#888"},children:"Don't have an account?"})}),e.jsx(v,{type:"default",block:!0,onClick:n,children:"Register as Exhibitor"})]}),e.jsxs(xe,{title:"Exhibitor Registration",open:o,onCancel:h,footer:null,width:500,children:[e.jsxs(de,{current:$,style:{marginBottom:24},children:[e.jsx(fe,{title:"Basic Info"}),e.jsx(fe,{title:"Verify Email"}),e.jsx(fe,{title:"Complete"})]}),O&&e.jsx(Y,{message:O,type:"error",showIcon:!0,style:{marginBottom:16}}),$===0&&e.jsxs(e.Fragment,{children:[e.jsx(Y,{message:"Email Verification Required",description:"We'll send a one-time password (OTP) to verify your email before completing registration.",type:"info",showIcon:!0,style:{marginBottom:16}}),e.jsxs(r,{form:F,name:"exhibitor_register_step1",layout:"vertical",children:[e.jsx(r.Item,{name:"companyName",rules:[{required:!0,message:"Please input your company name!"}],children:e.jsx(I,{prefix:e.jsx(We,{}),placeholder:"Company Name",size:"large",disabled:p})}),e.jsx(r.Item,{name:"contactPerson",rules:[{required:!0,message:"Please input contact person name!"}],children:e.jsx(I,{prefix:e.jsx(Ee,{}),placeholder:"Contact Person",size:"large",disabled:p})}),e.jsx(r.Item,{name:"email",rules:[{required:!0,message:"Please input your email!"},{type:"email",message:"Please enter a valid email address!"}],children:e.jsx(I,{prefix:e.jsx(ye,{}),placeholder:"Email",size:"large",disabled:p})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",onClick:P,block:!0,size:"large",loading:p,children:"Continue & Verify Email"})})]}),e.jsx(oe,{children:e.jsx("span",{style:{fontSize:"14px",color:"#888"},children:"Already have an account?"})}),e.jsx(v,{type:"default",block:!0,onClick:c,children:"Login"})]}),$===1&&e.jsxs(e.Fragment,{children:[e.jsx(Y,{message:"Email Verification",description:`We've sent a verification code to ${B}. Please enter it below to continue.`,type:"info",showIcon:!0,style:{marginBottom:16}}),e.jsxs(r,{form:L,name:"verify_otp",onFinish:me,layout:"vertical",children:[e.jsx(r.Item,{name:"otp",rules:[{required:!0,message:"Please enter the verification code!"}],children:e.jsx(I,{size:"large",placeholder:"Enter OTP",maxLength:6,style:{textAlign:"center",letterSpacing:"8px",fontSize:"20px"},disabled:p})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:p,children:"Verify & Continue"})})]}),e.jsxs(Ue,{justify:"space-between",align:"middle",style:{marginTop:16},children:[e.jsx(ve,{children:e.jsx(v,{type:"link",disabled:q>0||p,onClick:E,children:"Resend Code"})}),e.jsx(ve,{children:q>0&&e.jsxs($t,{type:"secondary",children:["Resend in ",q,"s"]})})]}),e.jsx(oe,{}),e.jsx(v,{type:"default",block:!0,onClick:()=>N(0),children:"Back"})]}),$===2&&e.jsxs(e.Fragment,{children:[e.jsx(Y,{message:"Email Verified Successfully",description:"Please complete your registration by providing the remaining details.",type:"success",showIcon:!0,style:{marginBottom:16}}),e.jsxs(r,{form:F,name:"exhibitor_register_step2",onFinish:i,layout:"vertical",children:[e.jsx(r.Item,{name:"phone",rules:[{required:!0,message:"Please input your phone number!"}],children:e.jsx(I,{prefix:e.jsx(Je,{}),placeholder:"Phone Number",size:"large",disabled:p})}),e.jsx(r.Item,{name:"address",rules:[{required:!0,message:"Please input your address!"}],children:e.jsx(I.TextArea,{placeholder:"Address",rows:3,disabled:p})}),e.jsx(r.Item,{name:"password",rules:[{required:!0,message:"Please input your password!"},{min:6,message:"Password must be at least 6 characters!"}],children:e.jsx(I.Password,{prefix:e.jsx(Z,{}),placeholder:"Password",size:"large",disabled:p})}),e.jsx(r.Item,{name:"confirmPassword",dependencies:["password"],rules:[{required:!0,message:"Please confirm your password!"},({getFieldValue:s})=>({validator(g,d){return!d||s("password")===d?Promise.resolve():Promise.reject(new Error("The two passwords do not match!"))}})],children:e.jsx(I.Password,{prefix:e.jsx(Z,{}),placeholder:"Confirm Password",size:"large",disabled:p})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",block:!0,size:"large",loading:p,children:"Complete Registration"})})]})]})]})]})},{Step:Gt}=de,{Text:Zt}=ce,Kt=({visible:t})=>{const o=we(),[u,x]=a.useState(!1),[R,f]=a.useState(null),[T,p]=a.useState(0),[w,O]=a.useState(""),[y,M]=a.useState(!1),[F,L]=a.useState(0),$=r.useForm()[0],N=r.useForm()[0],B=r.useForm()[0],b=a.useRef(null),K=async l=>{var j,P;try{x(!0),f(null);const k=await U.requestPasswordReset(l);O(l.email),M(!0),p(1),C.success("Password reset code sent to your email"),L(60),V()}catch(k){const E=((P=(j=k.response)==null?void 0:j.data)==null?void 0:P.message)||"Failed to send password reset code. Please try again.";f(E)}finally{x(!1)}},V=()=>{b.current&&clearInterval(b.current),b.current=setInterval(()=>{L(l=>l<=1?(b.current&&clearInterval(b.current),0):l-1)},1e3)},_=async()=>{var l,j;try{x(!0),f(null),await U.requestPasswordReset({email:w}),C.success("New password reset code sent to your email"),L(60),V()}catch(P){const k=((j=(l=P.response)==null?void 0:l.data)==null?void 0:j.message)||"Failed to resend password reset code. Please try again.";f(k)}finally{x(!1)}},H=async l=>{var j,P;try{x(!0),f(null),p(2),b.current&&clearInterval(b.current)}catch(k){const E=((P=(j=k.response)==null?void 0:j.data)==null?void 0:P.message)||"Invalid code. Please try again.";f(E)}finally{x(!1)}},q=async l=>{var j,P;try{x(!0),f(null);const k=N.getFieldValue("otp"),E={email:w,otp:k,newPassword:l.newPassword};await U.resetPassword(E),C.success("Password reset successful. You can now log in with your new password."),z(),o(ge()),o(le())}catch(k){const E=((P=(j=k.response)==null?void 0:j.data)==null?void 0:P.message)||"Failed to reset password. Please try again.";f(E)}finally{x(!1)}},z=()=>{p(0),O(""),M(!1),L(0),b.current&&clearInterval(b.current),$.resetFields(),N.resetFields(),B.resetFields()},X=()=>{z(),o(ge())},G=()=>{z(),o(ge()),o(le())};return Fe.useEffect(()=>()=>{b.current&&clearInterval(b.current)},[]),e.jsxs(xe,{title:"Forgot Password",open:t,onCancel:X,footer:null,width:400,children:[R&&e.jsx(Y,{message:R,type:"error",style:{marginBottom:16}}),e.jsx(de,{current:T,size:"small",style:{marginBottom:20},items:[{title:"Email"},{title:"Verify"},{title:"Reset"}]}),T===0&&e.jsxs(r,{form:$,onFinish:K,layout:"vertical",children:[e.jsx(r.Item,{name:"email",label:"Email",rules:[{required:!0,message:"Please enter your email"},{type:"email",message:"Please enter a valid email"}],children:e.jsx(I,{prefix:e.jsx(ye,{}),placeholder:"Email"})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",block:!0,loading:u,children:"Send Reset Code"})}),e.jsx(oe,{style:{margin:"12px 0"},children:e.jsx("span",{style:{fontSize:"12px",color:"#8c8c8c"},children:"Remember your password?"})}),e.jsx(v,{type:"link",onClick:G,block:!0,children:"Back to Login"})]}),T===1&&e.jsxs(r,{form:N,onFinish:H,layout:"vertical",children:[e.jsxs("p",{children:["We've sent a verification code to ",e.jsx("strong",{children:w}),". Please check your email and enter the code below."]}),e.jsx(r.Item,{name:"otp",rules:[{required:!0,message:"Please enter the verification code"},{pattern:/^\d{6}$/,message:"Please enter a valid 6-digit code"}],children:e.jsx(I,{placeholder:"Enter 6-digit code",maxLength:6,style:{letterSpacing:"0.5em",textAlign:"center",fontWeight:"bold"}})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",block:!0,loading:u,children:"Verify Code"})}),e.jsx("div",{style:{textAlign:"center",marginTop:8},children:F>0?e.jsxs(ce.Text,{type:"secondary",children:["Resend code in ",F,"s"]}):e.jsx(v,{type:"link",onClick:_,disabled:u,children:"Resend Code"})}),e.jsx(oe,{style:{margin:"12px 0"},children:e.jsx("span",{style:{fontSize:"12px",color:"#8c8c8c"},children:"Back to beginning"})}),e.jsx(v,{type:"link",onClick:()=>{p(0),b.current&&(clearInterval(b.current),L(0))},block:!0,children:"Change Email"})]}),T===2&&e.jsxs(r,{form:B,onFinish:q,layout:"vertical",children:[e.jsx(r.Item,{name:"newPassword",label:"New Password",rules:[{required:!0,message:"Please enter your new password"},{min:6,message:"Password must be at least 6 characters"}],hasFeedback:!0,children:e.jsx(I.Password,{prefix:e.jsx(Z,{}),placeholder:"New Password"})}),e.jsx(r.Item,{name:"confirmPassword",label:"Confirm Password",dependencies:["newPassword"],hasFeedback:!0,rules:[{required:!0,message:"Please confirm your password"},({getFieldValue:l})=>({validator(j,P){return!P||l("newPassword")===P?Promise.resolve():Promise.reject(new Error("The two passwords do not match"))}})],children:e.jsx(I.Password,{prefix:e.jsx(Z,{}),placeholder:"Confirm Password"})}),e.jsx(r.Item,{children:e.jsx(v,{type:"primary",htmlType:"submit",block:!0,loading:u,children:"Reset Password"})})]})]})};export{Xt as E,Kt as F,Ht as L,le as a,Wt as b,Jt as c,Dt as d,_t as e,Xe as f,Ut as l,he as r,Vt as s};
