"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[187],{3905:(t,e,n)=>{n.d(e,{Zo:()=>m,kt:()=>g});var a=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function p(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var u=a.createContext({}),o=function(t){var e=a.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},m=function(t){var e=o(t.components);return a.createElement(u.Provider,{value:e},t.children)},d="mdxType",k={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},N=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,l=t.originalType,u=t.parentName,m=p(t,["components","mdxType","originalType","parentName"]),d=o(n),N=r,g=d["".concat(u,".").concat(N)]||d[N]||k[N]||l;return n?a.createElement(g,i(i({ref:e},m),{},{components:n})):a.createElement(g,i({ref:e},m))}));function g(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=n.length,i=new Array(l);i[0]=N;var p={};for(var u in e)hasOwnProperty.call(e,u)&&(p[u]=e[u]);p.originalType=t,p[d]="string"==typeof t?t:r,i[1]=p;for(var o=2;o<l;o++)i[o]=n[o];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}N.displayName="MDXCreateElement"},3315:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>u,contentTitle:()=>i,default:()=>k,frontMatter:()=>l,metadata:()=>p,toc:()=>o});var a=n(7462),r=(n(7294),n(3905));const l={title:"Numeric Functions",description:"Numeric functions are used to perform numeric operations."},i="Numeric Operators",p={unversionedId:"cypher/expressions/numeric-functions",id:"cypher/expressions/numeric-functions",title:"Numeric Functions",description:"Numeric functions are used to perform numeric operations.",source:"@site/docs/cypher/expressions/numeric-functions.md",sourceDirName:"cypher/expressions",slug:"/cypher/expressions/numeric-functions",permalink:"/docusaurus/cypher/expressions/numeric-functions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cypher/expressions/numeric-functions.md",tags:[],version:"current",frontMatter:{title:"Numeric Functions",description:"Numeric functions are used to perform numeric operations."},sidebar:"tutorialSidebar",previous:{title:"NULL Operators",permalink:"/docusaurus/cypher/expressions/null-operators"},next:{title:"Pattern Matching Functions",permalink:"/docusaurus/cypher/expressions/pattern-matching"}},u={},o=[],m={toc:o},d="wrapper";function k(t){let{components:e,...n}=t;return(0,r.kt)(d,(0,a.Z)({},m,n,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"numeric-operators"},"Numeric Operators"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Operator"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"),(0,r.kt)("th",{parentName:"tr",align:null},"Example"),(0,r.kt)("th",{parentName:"tr",align:null},"Result"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"+"),(0,r.kt)("td",{parentName:"tr",align:null},"addition"),(0,r.kt)("td",{parentName:"tr",align:null},"2 + 3.5"),(0,r.kt)("td",{parentName:"tr",align:null},"5.5")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"subtraction"),(0,r.kt)("td",{parentName:"tr",align:null},"4.5 - 2"),(0,r.kt)("td",{parentName:"tr",align:null},"2.5")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"*"),(0,r.kt)("td",{parentName:"tr",align:null},"multiplication"),(0,r.kt)("td",{parentName:"tr",align:null},"3.2 * 2"),(0,r.kt)("td",{parentName:"tr",align:null},"6.4")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"/"),(0,r.kt)("td",{parentName:"tr",align:null},"division"),(0,r.kt)("td",{parentName:"tr",align:null},"9 / 5"),(0,r.kt)("td",{parentName:"tr",align:null},"1")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"%"),(0,r.kt)("td",{parentName:"tr",align:null},"module(remainder)"),(0,r.kt)("td",{parentName:"tr",align:null},"9 % 5"),(0,r.kt)("td",{parentName:"tr",align:null},"4")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"^"),(0,r.kt)("td",{parentName:"tr",align:null},"power"),(0,r.kt)("td",{parentName:"tr",align:null},"4 ^ 5"),(0,r.kt)("td",{parentName:"tr",align:null},"1024.0")))),(0,r.kt)("p",null,"Unsupported numeric operators:\n",(0,r.kt)("inlineCode",{parentName:"p"},"**"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"&"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"|"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"<<"),", ",(0,r.kt)("inlineCode",{parentName:"p"},">>"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"!")),(0,r.kt)("h1",{id:"numeric-functions"},"Numeric Functions"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Function"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"),(0,r.kt)("th",{parentName:"tr",align:null},"Example"),(0,r.kt)("th",{parentName:"tr",align:null},"Result"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"abs(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the absolute value of x"),(0,r.kt)("td",{parentName:"tr",align:null},"abs(-25.2)"),(0,r.kt)("td",{parentName:"tr",align:null},"25.2")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"acos(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the arccosine of x"),(0,r.kt)("td",{parentName:"tr",align:null},"acos(0.43)"),(0,r.kt)("td",{parentName:"tr",align:null},"1.126304")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"asin(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the arcsine of x"),(0,r.kt)("td",{parentName:"tr",align:null},"asin(0.4)"),(0,r.kt)("td",{parentName:"tr",align:null},"0.411517")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"atan(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the arctangent of x"),(0,r.kt)("td",{parentName:"tr",align:null},"atan(0.221)"),(0,r.kt)("td",{parentName:"tr",align:null},"0.217504")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"atan2(x, y)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the arctangent of x, y"),(0,r.kt)("td",{parentName:"tr",align:null},"atan2(0.4, 0.2)"),(0,r.kt)("td",{parentName:"tr",align:null},"0.342411")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"bitwise_xor(x, y)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the bitwise xor of x and y"),(0,r.kt)("td",{parentName:"tr",align:null},"bitwise_xor(2, 3)"),(0,r.kt)("td",{parentName:"tr",align:null},"1")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ceil(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"rounds up x to the next nearest integer"),(0,r.kt)("td",{parentName:"tr",align:null},"ceil(4.2)"),(0,r.kt)("td",{parentName:"tr",align:null},"5.0")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ceiling(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"alias of ceil"),(0,r.kt)("td",{parentName:"tr",align:null},"ceiling(3.27)"),(0,r.kt)("td",{parentName:"tr",align:null},"4.0")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"cos(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the cosine value of x"),(0,r.kt)("td",{parentName:"tr",align:null},"cos(2.79)"),(0,r.kt)("td",{parentName:"tr",align:null},"-0.938825")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"cot(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the cotangent of x"),(0,r.kt)("td",{parentName:"tr",align:null},"cot(0.78)"),(0,r.kt)("td",{parentName:"tr",align:null},"1.010855")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"degrees(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"converts radians to degree"),(0,r.kt)("td",{parentName:"tr",align:null},"degrees(1.2534)"),(0,r.kt)("td",{parentName:"tr",align:null},"71.814530")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"even(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"rounds to next even number by rounding away from 0"),(0,r.kt)("td",{parentName:"tr",align:null},"even(3.4)"),(0,r.kt)("td",{parentName:"tr",align:null},"4")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"factorial(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the factorial of x"),(0,r.kt)("td",{parentName:"tr",align:null},"factorial(4)"),(0,r.kt)("td",{parentName:"tr",align:null},"24")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"floor(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"rounds down x to the nearest integer"),(0,r.kt)("td",{parentName:"tr",align:null},"floor(3.3)"),(0,r.kt)("td",{parentName:"tr",align:null},"True")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"gamma(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"interpolation of (x-1) factorial"),(0,r.kt)("td",{parentName:"tr",align:null},"gamma(2.4)"),(0,r.kt)("td",{parentName:"tr",align:null},"1.242169")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"lgamma(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the log of gamma(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"lgamma(1.4)"),(0,r.kt)("td",{parentName:"tr",align:null},"-0.119613")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ln(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the natural logarithm of x"),(0,r.kt)("td",{parentName:"tr",align:null},"ln(2.11)"),(0,r.kt)("td",{parentName:"tr",align:null},"0.746688")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"log(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the 10-log of x"),(0,r.kt)("td",{parentName:"tr",align:null},"log(2.11)"),(0,r.kt)("td",{parentName:"tr",align:null},"0.324282")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"log2(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the 2-log of x"),(0,r.kt)("td",{parentName:"tr",align:null},"log2(3)"),(0,r.kt)("td",{parentName:"tr",align:null},"1.584963")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"log10(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"alias of log(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"log10(100)"),(0,r.kt)("td",{parentName:"tr",align:null},"2")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"negate(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the opposite number of x"),(0,r.kt)("td",{parentName:"tr",align:null},"negate(100)"),(0,r.kt)("td",{parentName:"tr",align:null},"-100")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"pi()"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the value of pi"),(0,r.kt)("td",{parentName:"tr",align:null},"pi()"),(0,r.kt)("td",{parentName:"tr",align:null},"3.141593")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"pow(x, y)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the value of x to the power of y"),(0,r.kt)("td",{parentName:"tr",align:null},"pow(4, 5)"),(0,r.kt)("td",{parentName:"tr",align:null},"1024")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"radians(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"converts the degree to radians"),(0,r.kt)("td",{parentName:"tr",align:null},"radians(89)"),(0,r.kt)("td",{parentName:"tr",align:null},"1.553343")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"round(x, s)"),(0,r.kt)("td",{parentName:"tr",align:null},"rounds x to s decimal places"),(0,r.kt)("td",{parentName:"tr",align:null},"round(42.651, 1)"),(0,r.kt)("td",{parentName:"tr",align:null},"42.700000")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"sin(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the sin of x"),(0,r.kt)("td",{parentName:"tr",align:null},"sin(413.31)"),(0,r.kt)("td",{parentName:"tr",align:null},"-0.981897")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"sign(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the sign of x"),(0,r.kt)("td",{parentName:"tr",align:null},"sign(-451)"),(0,r.kt)("td",{parentName:"tr",align:null},"-1")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"sqrt(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the square root of x"),(0,r.kt)("td",{parentName:"tr",align:null},"sqrt(4.25)"),(0,r.kt)("td",{parentName:"tr",align:null},"2.061553")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"tan(x)"),(0,r.kt)("td",{parentName:"tr",align:null},"returns the tangent of x"),(0,r.kt)("td",{parentName:"tr",align:null},"tan(75)"),(0,r.kt)("td",{parentName:"tr",align:null},"-0.420701")))))}k.isMDXComponent=!0}}]);