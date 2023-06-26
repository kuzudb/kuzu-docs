"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[3717],{3905:(t,e,n)=>{n.d(e,{Zo:()=>p,kt:()=>g});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var l=r.createContext({}),c=function(t){var e=r.useContext(l),n=e;return t&&(n="function"==typeof t?t(e):s(s({},e),t)),n},p=function(t){var e=c(t.components);return r.createElement(l.Provider,{value:e},t.children)},u="mdxType",m={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},d=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,o=t.originalType,l=t.parentName,p=i(t,["components","mdxType","originalType","parentName"]),u=c(n),d=a,g=u["".concat(l,".").concat(d)]||u[d]||m[d]||o;return n?r.createElement(g,s(s({ref:e},p),{},{components:n})):r.createElement(g,s({ref:e},p))}));function g(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in e)hasOwnProperty.call(e,l)&&(i[l]=e[l]);i.originalType=t,i[u]="string"==typeof t?t:a,s[1]=i;for(var c=2;c<o;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8626:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={title:"Casting Functions",description:"Casting functions are used to cast values from one type to another."},s="Casting Functions",i={unversionedId:"cypher/expressions/casting",id:"cypher/expressions/casting",title:"Casting Functions",description:"Casting functions are used to cast values from one type to another.",source:"@site/docs/cypher/expressions/casting.md",sourceDirName:"cypher/expressions",slug:"/cypher/expressions/casting",permalink:"/docusaurus/cypher/expressions/casting",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cypher/expressions/casting.md",tags:[],version:"current",frontMatter:{title:"Casting Functions",description:"Casting functions are used to cast values from one type to another."},sidebar:"tutorialSidebar",previous:{title:"Case Expression",permalink:"/docusaurus/cypher/expressions/case-expression"},next:{title:"Comparison Operators",permalink:"/docusaurus/cypher/expressions/comparison-operators"}},l={},c=[],p={toc:c},u="wrapper";function m(t){let{components:e,...n}=t;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"casting-functions"},"Casting Functions"),(0,a.kt)("p",null,"K\xf9zu supports casting  through explicit casting functions. An exception will be thrown if the casting fails."),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Functions"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"),(0,a.kt)("th",{parentName:"tr",align:null},"Example"),(0,a.kt)("th",{parentName:"tr",align:null},"Result"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"date"),(0,a.kt)("td",{parentName:"tr",align:null},"cast STRING to DATE"),(0,a.kt)("td",{parentName:"tr",align:null},"DATE('2022-11-12')"),(0,a.kt)("td",{parentName:"tr",align:null},"2022-11-12 (DATE)")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"timestamp"),(0,a.kt)("td",{parentName:"tr",align:null},"cast STRING to timestamp"),(0,a.kt)("td",{parentName:"tr",align:null},"TIMESTAMP('2021-10-12 15:21:33')"),(0,a.kt)("td",{parentName:"tr",align:null},"2021-10-12 15:21:33 (TIMESTAMP)")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"interval"),(0,a.kt)("td",{parentName:"tr",align:null},"cast STRING to INTERVAL"),(0,a.kt)("td",{parentName:"tr",align:null},"INTERVAL('5 DAYS 2 YEARS')"),(0,a.kt)("td",{parentName:"tr",align:null},"2 years 4 days (INTERVAL)")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"string"),(0,a.kt)("td",{parentName:"tr",align:null},"cast ANY to STRING"),(0,a.kt)("td",{parentName:"tr",align:null},"STRING(561)"),(0,a.kt)("td",{parentName:"tr",align:null},"'561'")))))}m.isMDXComponent=!0}}]);