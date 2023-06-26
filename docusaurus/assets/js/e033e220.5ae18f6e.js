"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[1684],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>g});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},d="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=p(a),b=r,g=d["".concat(s,".").concat(b)]||d[b]||c[b]||l;return a?n.createElement(g,i(i({ref:t},u),{},{components:a})):n.createElement(g,i({ref:t},u))}));function g(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=b;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[d]="string"==typeof e?e:r,i[1]=o;for(var p=2;p<l;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}b.displayName="MDXCreateElement"},9700:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var n=a(7462),r=(a(7294),a(3905));const l={},i="Database",o={unversionedId:"client-apis/nodejs-api/database",id:"client-apis/nodejs-api/database",title:"Database",description:"- Database",source:"@site/docs/client-apis/nodejs-api/database.md",sourceDirName:"client-apis/nodejs-api",slug:"/client-apis/nodejs-api/database",permalink:"/docusaurus/client-apis/nodejs-api/database",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/client-apis/nodejs-api/database.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Connection",permalink:"/docusaurus/client-apis/nodejs-api/connection"},next:{title:"Prepared Statement",permalink:"/docusaurus/client-apis/nodejs-api/prepared-statement"}},s={},p=[{value:"new Database(databasePath, bufferManagerSize)",id:"new-databasedatabasepath-buffermanagersize",level:3},{value:"database.init()",id:"databaseinit",level:3},{value:"database.setLoggingLevel(loggingLevel)",id:"databasesetlogginglevellogginglevel",level:3}],u={toc:p},d="wrapper";function c(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"database"},"Database"),(0,r.kt)("a",{name:"Database"}),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#database"},"Database"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#new-databasedatabasepath-buffermanagersize"},"new Database(databasePath, bufferManagerSize)")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#databaseinit"},"database.init()")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#databasesetlogginglevellogginglevel"},"database.setLoggingLevel(loggingLevel)"))))),(0,r.kt)("a",{name:"new_Database_new"}),(0,r.kt)("h3",{id:"new-databasedatabasepath-buffermanagersize"},"new Database(databasePath, bufferManagerSize)"),(0,r.kt)("p",null,"Initialize a new Database object. Note that the initialization is done\nlazily, so the database file is not opened until the first query is\nexecuted. To initialize the database immediately, call the ",(0,r.kt)("inlineCode",{parentName:"p"},"init()"),"\nfunction on the returned object."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Param"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Default"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"databasePath"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("code",null,"String")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"path to the database file.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bufferManagerSize"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("code",null,"Number")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("code",null,"0")),(0,r.kt)("td",{parentName:"tr",align:null},"size of the buffer manager in bytes.")))),(0,r.kt)("a",{name:"Database+init"}),(0,r.kt)("h3",{id:"databaseinit"},"database.init()"),(0,r.kt)("p",null,"Initialize the database. Calling this function is optional, as the\ndatabase is initialized automatically when the first query is executed."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Kind"),": instance method of ",(0,r.kt)("a",{parentName:"p",href:"#Database"},(0,r.kt)("code",null,"Database")),"  "),(0,r.kt)("a",{name:"Database+setLoggingLevel"}),(0,r.kt)("h3",{id:"databasesetlogginglevellogginglevel"},"database.setLoggingLevel(loggingLevel)"),(0,r.kt)("p",null,"Set the logging level for the database."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Kind"),": instance method of ",(0,r.kt)("a",{parentName:"p",href:"#Database"},(0,r.kt)("code",null,"Database")),"  "),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Param"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"loggingLevel"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("code",null,"kuzu.LoggingLevel")),(0,r.kt)("td",{parentName:"tr",align:null},"the logging level to set.")))))}c.isMDXComponent=!0}}]);