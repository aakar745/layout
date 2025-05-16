import{r as e,j as s,H as i,D as n,s as t,ah as r,d as a,A as l,m as o,F as d,ai as c,k as x,G as h}from"./vendor-others-aeGeD6f-.js";import{n as p}from"./vendor-ui-BOD89xu8.js";import{G as g,a as m}from"./component-layout-BTsCaDZB.js";import{p as j,a as b}from"./services-DHEt1Qtz.js";import{a as u}from"./component-exhibition-CuwlJtEU.js";import{c as y,u as f}from"./vendor-react-i7tvbPTl.js";import{s as v}from"./store-D4NI4RZ9.js";import{T as w,L as k,c as C,o as N,R as S,C as z,e as D,H as E,z as W,K as A,u as B}from"./vendor-antd-core-CLD06I8y.js";import{B as R}from"./vendor-antd-buttons-wjEWA2x8.js";const{Title:F,Paragraph:I,Text:L}=w,{Content:T}=k,Y=e=>{if(!e)return"/exhibition-placeholder.jpg";if(e.startsWith("/")||e.startsWith("http"))return e;const s=e.startsWith("/")?e.substring(1):e;return s.includes("logos/")||s.includes("sponsors/")?`${b.defaults.baseURL}/public/images/${s}`:"/exhibition-placeholder.jpg"},G=p(T)`
  padding-top: 64px;
`,M=p.div`
  background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  padding: 80px 0;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`,H=p.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
`,q=p.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`,O=p(C)`
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
`,P=p(C)`
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
`,U=p(F)`
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
`,V=p.div`
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
`,$=p.div`
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
`,J=p.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`,K=p(N)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 50px;
`,_=p(R)`
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
`,Q=p.div`
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
`;p.div`
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
`;const X=()=>{const p=y(),b=f(),[w,T]=e.useState([]),[X,Z]=e.useState(!0);e.useEffect((()=>{(async()=>{try{Z(!0);const e=await j.getExhibitions();T(e.data.slice(0,4))}catch(e){}finally{Z(!1)}})()}),[]);const ee=e=>new Date(e).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"}),se=()=>{b(v(void 0))};return s.jsxs(k,{children:[s.jsx(g,{}),s.jsxs(G,{children:[s.jsxs(M,{children:[s.jsx(H,{}),s.jsx(q,{children:s.jsxs(S,{gutter:[48,48],align:"middle",children:[s.jsxs(z,{xs:24,lg:14,children:[s.jsx(F,{level:1,style:{fontSize:"3.5rem",marginBottom:24,color:"white",fontWeight:700},children:"Book Your Exhibition Space with Ease"}),s.jsx(I,{style:{fontSize:"1.2rem",marginBottom:40,color:"rgba(255, 255, 255, 0.9)"},children:"Explore upcoming exhibitions, select your perfect stall, and secure your spot all in one place. Manage your exhibition presence effortlessly."}),s.jsx(D,{size:16,wrap:!0,children:s.jsx(_,{type:"primary",size:"large",onClick:()=>p("/exhibitions"),icon:s.jsx(i,{}),children:"Explore Exhibitions"})})]}),s.jsx(z,{xs:24,lg:10,children:s.jsx("img",{src:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",alt:"Exhibition Space",style:{width:"100%",borderRadius:"12px",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)",border:"4px solid rgba(255, 255, 255, 0.2)",objectFit:"cover",height:"300px"},onError:e=>{const s=e.target;s.src="https://images.unsplash.com/photo-1559223607-a43f990c43d5?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3",s.onerror=()=>{s.style.height="300px",s.style.background="linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",s.onerror=null;const e=s.parentElement;if(e){const s=document.createElement("div");s.style.position="absolute",s.style.top="50%",s.style.left="50%",s.style.transform="translate(-50%, -50%)",s.style.color="white",s.style.fontSize="18px",s.style.fontWeight="bold",s.style.textAlign="center",s.textContent="Exhibition Venue",e.appendChild(s)}}}})})]})})]}),s.jsx(Q,{children:s.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[s.jsx(U,{level:2,children:"Featured Exhibitions"}),X?s.jsx(S,{gutter:[24,24],children:[1,2,3,4].map((e=>s.jsx(z,{xs:24,sm:12,lg:6,children:s.jsx(C,{style:{borderRadius:"12px"},children:s.jsx(E,{active:!0,avatar:!0,paragraph:{rows:3}})})},e)))}):w.length>0?s.jsx(S,{gutter:[24,24],children:w.map(((e,r)=>{const{status:a,color:l}=((e,s)=>{const i=new Date,n=new Date(e),t=new Date(s);return i<n?{status:"Upcoming",color:"#722ED1"}:i>t?{status:"Completed",color:"#8C8C8C"}:{status:"Active",color:"#52C41A"}})(e.startDate,e.endDate);return s.jsx(z,{xs:24,sm:12,lg:6,children:s.jsxs(P,{onClick:()=>p(u(e)),cover:s.jsxs("div",{style:{height:200,overflow:"hidden",position:"relative"},children:[s.jsx("img",{alt:e.name,src:e.headerLogo?Y(e.headerLogo):"/exhibition-placeholder.jpg",style:{width:"100%",height:"100%",objectFit:"contain",filter:"brightness(0.95)"}}),s.jsx(N,{color:l,style:{position:"absolute",top:12,left:12,borderRadius:"50px",padding:"2px 12px"},children:a}),0===r&&s.jsx(K,{color:"#f50",children:"Featured"})]}),hoverable:!0,children:[s.jsx(F,{level:5,ellipsis:{rows:1},style:{marginBottom:8},children:e.name}),s.jsxs("div",{style:{marginBottom:12,display:"flex",alignItems:"center",gap:8},children:[s.jsx(n,{style:{color:"#4158D0"}}),s.jsxs(L,{type:"secondary",style:{fontSize:13},children:[ee(e.startDate)," - ",ee(e.endDate)]})]}),e.venue&&s.jsxs("div",{style:{marginBottom:16,display:"flex",alignItems:"center",gap:8},children:[s.jsx(t,{style:{color:"#C850C0"}}),s.jsx(L,{type:"secondary",style:{fontSize:13},ellipsis:!0,children:e.venue})]}),s.jsx(R,{type:"link",style:{padding:0,height:"auto"},icon:s.jsx(i,{}),children:"View Details"})]})},e._id)}))}):s.jsx("div",{style:{textAlign:"center",padding:40},children:s.jsx(I,{children:"No exhibitions available at the moment. Check back soon!"})}),s.jsx("div",{style:{textAlign:"center",marginTop:40},children:s.jsx(R,{type:"primary",size:"large",onClick:()=>p("/exhibitions"),icon:s.jsx(r,{}),children:"View All Exhibitions"})})]})}),s.jsx(Q,{className:"how-it-works",children:s.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[s.jsx(U,{level:2,children:"How to Book Stall"}),s.jsx("div",{style:{textAlign:"center",maxWidth:"800px",margin:"0 auto 40px"},children:s.jsx(I,{style:{fontSize:"18px",color:"#666",fontWeight:500},children:"Secure your exhibition space in just a few simple steps. Our streamlined booking process makes it easy to showcase your business at premier events."})}),s.jsxs("div",{className:"booking-steps",children:[s.jsx("div",{className:"step-indicator",children:s.jsxs("div",{className:"step-dots",children:[[1,2,3,4,5,6,7].map((e=>s.jsxs("div",{className:"step-dot-container",children:[s.jsx("div",{className:"step-dot",children:e}),s.jsx("div",{className:"step-label",children:`Step ${e}`})]},e))),s.jsx("div",{className:"step-progress-line"})]})}),s.jsxs(S,{gutter:[24,24],style:{marginTop:40},children:[s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"1"}),s.jsx("div",{className:"step-icon",children:s.jsx(a,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Register"}),s.jsx(I,{children:"The exhibitor must first register on the platform with company details and contact information."})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"2"}),s.jsx("div",{className:"step-icon",children:s.jsx(l,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Admin Approval"}),s.jsx(I,{children:"After registration, the admin will review and approve your account. You'll receive a notification."})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"3"}),s.jsx("div",{className:"step-icon",children:s.jsx(o,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Login & Book Stall"}),s.jsx(I,{children:"Once approved, log in and select a stall from the interactive layout map."})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"4"}),s.jsx("div",{className:"step-icon",children:s.jsx(d,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Stall Goes to Reserved"}),s.jsx(I,{children:'After booking, the stall status changes to "Reserved" and will be temporarily held for you.'})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"5"}),s.jsx("div",{className:"step-icon",children:s.jsx(l,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Admin Final Approval"}),s.jsx(I,{children:"The admin will review your reservation request and approve it based on availability."})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"6"}),s.jsx("div",{className:"step-icon",children:s.jsx(l,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Stall Becomes Booked"}),s.jsx(I,{children:'After admin approval, the stall status changes to "Booked" and an invoice is generated.'})]})]})}),s.jsx(z,{xs:24,md:12,lg:8,xl:6,children:s.jsxs("div",{className:"step-card",children:[s.jsxs("div",{className:"step-card-header",children:[s.jsx("div",{className:"step-number",children:"7"}),s.jsx("div",{className:"step-icon",children:s.jsx(c,{})})]}),s.jsxs("div",{className:"step-card-body",children:[s.jsx(F,{level:5,children:"Make Payment in 3 Days"}),s.jsx(I,{children:"Complete your payment within 3 days of booking to confirm your stall reservation."})]})]})})]}),s.jsx("style",{children:"\n                  .booking-steps {\n                    margin-top: 20px;\n                  }\n                  \n                  .step-indicator {\n                    margin-bottom: 30px;\n                    padding: 0 40px;\n                  }\n                  \n                  .step-dots {\n                    display: flex;\n                    justify-content: space-between;\n                    position: relative;\n                    max-width: 800px;\n                    margin: 0 auto;\n                  }\n                  \n                  .step-progress-line {\n                    position: absolute;\n                    top: 25px;\n                    left: 50px;\n                    right: 50px;\n                    height: 3px;\n                    background: linear-gradient(90deg, #4158D0, #C850C0);\n                    z-index: 0;\n                  }\n                  \n                  .step-dot-container {\n                    display: flex;\n                    flex-direction: column;\n                    align-items: center;\n                    position: relative;\n                    z-index: 1;\n                  }\n                  \n                  .step-dot {\n                    width: 50px;\n                    height: 50px;\n                    border-radius: 50%;\n                    background: linear-gradient(135deg, #4158D0, #C850C0);\n                    color: white;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    font-weight: bold;\n                    font-size: 20px;\n                    margin-bottom: 8px;\n                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);\n                  }\n                  \n                  .step-label {\n                    font-size: 14px;\n                    font-weight: 500;\n                    color: #666;\n                  }\n                  \n                  .step-card {\n                    background: white;\n                    border-radius: 12px;\n                    overflow: hidden;\n                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);\n                    height: 100%;\n                    transition: all 0.3s ease;\n                    display: flex;\n                    flex-direction: column;\n                    border: 1px solid #f0f0f0;\n                  }\n                  \n                  .step-card:hover {\n                    transform: translateY(-5px);\n                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);\n                  }\n                  \n                  .step-card-header {\n                    background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%);\n                    padding: 16px;\n                    display: flex;\n                    align-items: center;\n                    gap: 16px;\n                    border-bottom: 1px solid #f0f0f0;\n                  }\n                  \n                  .step-number {\n                    width: 36px;\n                    height: 36px;\n                    border-radius: 50%;\n                    background: linear-gradient(135deg, #4158D0, #C850C0);\n                    color: white;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    font-weight: bold;\n                    font-size: 16px;\n                  }\n                  \n                  .step-icon {\n                    width: 36px;\n                    height: 36px;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    font-size: 20px;\n                    color: #4158D0;\n                  }\n                  \n                  .step-card-body {\n                    padding: 16px;\n                    flex: 1;\n                  }\n                  \n                  .step-card-body h5 {\n                    margin-bottom: 8px;\n                  }\n                  \n                  .step-card-body p {\n                    margin-bottom: 0;\n                    color: #666;\n                  }\n                  \n                  @media (max-width: 768px) {\n                    .step-progress-line {\n                      display: none;\n                    }\n                    \n                    .step-dots {\n                      display: none;\n                    }\n                  }\n                "})]}),s.jsx("div",{style:{textAlign:"center",marginTop:60},children:s.jsx(_,{type:"primary",size:"large",onClick:se,icon:s.jsx(a,{}),children:"Register as Exhibitor"})})]})}),s.jsx(Q,{children:s.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:[s.jsx(U,{level:2,children:"Why Choose Us"}),s.jsxs(S,{gutter:[24,24],children:[s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(65, 88, 208, 0.1)",color:"#4158D0"},children:s.jsx(x,{})}),s.jsx(F,{level:4,children:"Interactive Layouts"}),s.jsx(I,{style:{fontSize:16},children:"Explore detailed exhibition floor plans with interactive maps to find your perfect spot."})]})}),s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(200, 80, 192, 0.1)",color:"#C850C0"},children:s.jsx(o,{})}),s.jsx(F,{level:4,children:"Real-time Availability"}),s.jsx(I,{style:{fontSize:16},children:"See stall availability in real-time and book instantly without any delays or confusion."})]})}),s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(255, 204, 112, 0.1)",color:"#FFCC70"},children:s.jsx(c,{})}),s.jsx(F,{level:4,children:"Secure Payments"}),s.jsx(I,{style:{fontSize:16},children:"Complete your bookings with our secure payment gateway and receive instant confirmation."})]})}),s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(82, 196, 26, 0.1)",color:"#52c41a"},children:s.jsx(h,{})}),s.jsx(F,{level:4,children:"Exhibitor Dashboard"}),s.jsx(I,{style:{fontSize:16},children:"Manage all your bookings, payments, and exhibition details through our user-friendly dashboard."})]})}),s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(250, 140, 22, 0.1)",color:"#fa8c16"},children:s.jsx(n,{})}),s.jsx(F,{level:4,children:"Schedule Management"}),s.jsx(I,{style:{fontSize:16},children:"Keep track of important dates, setup times, and exhibition schedules all in one place."})]})}),s.jsx(z,{xs:24,sm:12,lg:8,children:s.jsxs(O,{children:[s.jsx(V,{style:{background:"rgba(24, 144, 255, 0.1)",color:"#1890ff"},children:s.jsx(l,{})}),s.jsx(F,{level:4,children:"Support & Assistance"}),s.jsx(I,{style:{fontSize:16},children:"Get expert assistance throughout the booking process and during the exhibition."})]})})]})]})}),s.jsx(Q,{className:"gray-bg",children:s.jsx("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 24px"},children:s.jsxs(S,{gutter:[48,48],children:[s.jsxs(z,{xs:24,lg:12,children:[s.jsx(U,{level:2,children:"Our Impact"}),s.jsxs(S,{gutter:[24,24],children:[s.jsx(z,{xs:12,children:s.jsx($,{children:s.jsx(W,{title:"Exhibitions",value:100,suffix:"+",valueStyle:{color:"#4158D0",fontWeight:"bold"}})})}),s.jsx(z,{xs:12,children:s.jsx($,{children:s.jsx(W,{title:"Exhibitors",value:5e3,suffix:"+",valueStyle:{color:"#C850C0",fontWeight:"bold"}})})}),s.jsx(z,{xs:12,children:s.jsx($,{children:s.jsx(W,{title:"Stalls Booked",value:12e3,suffix:"+",valueStyle:{color:"#FFCC70",fontWeight:"bold"}})})}),s.jsx(z,{xs:12,children:s.jsx($,{children:s.jsx(W,{title:"Cities",value:25,suffix:"+",valueStyle:{color:"#52c41a",fontWeight:"bold"}})})})]})]}),s.jsxs(z,{xs:24,lg:12,children:[s.jsx(U,{level:2,children:"What Exhibitors Say"}),s.jsxs(A,{autoplay:!0,dots:{className:"custom-carousel-dots"},children:[s.jsx("div",{children:s.jsxs(J,{children:[s.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[s.jsx(B,{size:64,icon:s.jsx(a,{}),style:{backgroundColor:"#4158D0"}}),s.jsxs("div",{children:[s.jsx(F,{level:5,style:{margin:0},children:"Sarah Johnson"}),s.jsx(L,{type:"secondary",children:"Tech Innovations Inc."})]})]}),s.jsx(I,{style:{fontSize:16},children:'"The booking process was seamless! I could view the layout, select my preferred spot, and complete payment all in one go. Will definitely use again for our next exhibition."'})]})}),s.jsx("div",{children:s.jsxs(J,{children:[s.jsxs("div",{style:{display:"flex",gap:16,marginBottom:20},children:[s.jsx(B,{size:64,icon:s.jsx(a,{}),style:{backgroundColor:"#C850C0"}}),s.jsxs("div",{children:[s.jsx(F,{level:5,style:{margin:0},children:"Michael Chen"}),s.jsx(L,{type:"secondary",children:"Global Exhibits Ltd"})]})]}),s.jsx(I,{style:{fontSize:16},children:'"As a regular exhibitor, this platform has made my life so much easier. I love how I can see all my bookings and manage everything from one dashboard."'})]})})]})]})]})})}),s.jsx(Q,{style:{padding:"60px 0"},children:s.jsxs("div",{style:{maxWidth:"1000px",margin:"0 auto",padding:"40px 24px",background:"linear-gradient(135deg, #4158D0 0%, #C850C0 100%)",borderRadius:"16px",color:"white",textAlign:"center",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.1)"},children:[s.jsx(F,{level:2,style:{color:"white",marginBottom:16},children:"Ready to Showcase Your Business?"}),s.jsx(I,{style:{fontSize:"1.2rem",marginBottom:32,color:"rgba(255, 255, 255, 0.9)"},children:"Join thousands of successful exhibitors and book your perfect stall today"}),s.jsxs(D,{size:16,wrap:!0,style:{justifyContent:"center"},children:[s.jsx(R,{size:"large",style:{height:"50px",background:"white",color:"#4158D0",border:"none",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:()=>p("/exhibitions"),icon:s.jsx(o,{}),children:"Browse Exhibitions"}),s.jsx(R,{size:"large",style:{height:"50px",background:"rgba(255, 255, 255, 0.2)",color:"white",border:"2px solid white",borderRadius:"8px",fontWeight:500,paddingLeft:24,paddingRight:24,display:"flex",alignItems:"center"},onClick:se,icon:s.jsx(a,{}),children:"Register as Exhibitor"})]})]})})]}),s.jsx(m,{})]})};export{X as H};
