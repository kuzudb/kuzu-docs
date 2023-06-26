"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[9291],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,f=p["".concat(l,".").concat(d)]||p[d]||m[d]||o;return n?a.createElement(f,i(i({ref:t},u),{},{components:n})):a.createElement(f,i({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4842:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const o={layout:"default",title:"Transaction",parent:"Client APIs"},i="Overview",s={unversionedId:"client-apis/transactions",id:"client-apis/transactions",title:"Transaction",description:"K\xf9zu is a transactional system. Specifically, it implements a transaction management",source:"@site/docs/client-apis/transactions.md",sourceDirName:"client-apis",slug:"/client-apis/transactions",permalink:"/docusaurus/client-apis/transactions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/client-apis/transactions.md",tags:[],version:"current",frontMatter:{layout:"default",title:"Transaction",parent:"Client APIs"},sidebar:"tutorialSidebar",previous:{title:"Value",permalink:"/docusaurus/client-apis/cpp-api/value"},next:{title:"Data Import",permalink:"/docusaurus/data-import/"}},l={},c=[{value:"Important Properties of K\xf9zu Transactions:",id:"important-properties-of-k\xf9zu-transactions",level:2}],u={toc:c},p="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"overview"},"Overview"),(0,r.kt)("p",null,"K\xf9zu is a transactional system. Specifically, it implements a transaction management\nsub-system that is atomic, durable and supports serializability (satisfying these\nproperties is traditionally known as being ACID-compliant in database terminology). That is, every\nquery, data manipulation command, every DDL (i.e., new node/rel table schema definitions),",(0,r.kt)("br",{parentName:"p"}),"\n","or `COPY FROM' commands to K\xf9zu is part of a transaction. Therefore they depict all-or-nothing\nbehavior, so after these commands or a set of them execute and committed successfully, you are guaranteed\nthat all of their changes will persist entirely. If they do not execute successfully or are\nrolled back, you are guaranteed that none of their changes will persist. These conditions hold,\neven if your system crashes at any point during a transaction. That is, after committing successfully,\nall your changes will persist even if there is an error after committing. Similarly, if your\nsystem crashes before committing or rolling back, then none of your updates will persist."),(0,r.kt)("h2",{id:"important-properties-of-k\xf9zu-transactions"},"Important Properties of K\xf9zu Transactions:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Each transaction is identified as a write or read transaction (see below for how this is done)."),(0,r.kt)("li",{parentName:"ul"},"At any point in time, there can be multiple read transactions but one write transaction."),(0,r.kt)("li",{parentName:"ul"},"There are two ways to use transactions: (i) manually beginning and committing/rolling back transactions;\nor (ii) auto-committing. These are reviewed below."),(0,r.kt)("li",{parentName:"ul"},"Currently you can only use transactions from the .")),(0,r.kt)("h1",{id:"manually-beginning-and-committingrollingback"},"Manually Beginning and Committing/Rollingback"),(0,r.kt)("p",null,"When you access K\xf9zu programmatically through its ",(0,r.kt)("a",{parentName:"p",href:"../client-apis/cpp-api"},"C++ client API")," (but not through its CLI or Python API",(0,r.kt)("sup",{parentName:"p",id:"fnref-1"},(0,r.kt)("a",{parentName:"sup",href:"#fn-1",className:"footnote-ref"},"1")),"),\nyou can start a write transaction, or a read only transaction manually as follows (in C++):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'  auto systemConfig = make_unique<SystemConfig>();\n  auto databaseConfig = make_unique<DatabaseConfig>("/tmp/dir-storing-kuzu-db-files/");\n  auto database = make_unique<Database>(*databaseConfig, *systemConfig);\n  auto conn = make_unique<Connection>(database.get());\n  conn->beginWriteTransaction();\n  auto result = conn->query("CREATE (a:User {name: 5, age: 72})");\n  if (!result->isSuccess()) {\n     throw RuntimeException("CREATE command failed.");\n  }\n  result = conn->query("MATCH (a:User) RETURN *");\n  while (result->hasNext()) \n    auto tuple = result->getNext();\n    // some code to print the tuple;\n  }\n  conn->commit();\n')),(0,r.kt)("p",null,"The above code starts a manual writeTransaction, adds a new node, and within the same transaction\nalso reads all of the tuples in User table (which includes the (5, 72) node record). Finally, the\ntransaction commits."),(0,r.kt)("p",null,"You can also start a read-only transaction. For example in the C++ client API, this can be done\nby calling ",(0,r.kt)("inlineCode",{parentName:"p"},"conn->beginReadOnlyTransaction()"),". Read only transactions are not allowed to write to the database.\nYou should start a read-only transaction for two main reasons: (i) if you want to run multiple read queries\nensuring that the database does not change in-between those transactions; and/or (ii) you don't want\nto block a write transaction from writing to the database in parallel (recall that at any point in\ntime K\xf9zu allows 1 write transaction in the system)."),(0,r.kt)("p",null,"If you call ",(0,r.kt)("inlineCode",{parentName:"p"},"conn->rollback()")," instead of ",(0,r.kt)("inlineCode",{parentName:"p"},"conn->commit()"),", the added (5, 72) node record will not\npersist in the database."),(0,r.kt)("h1",{id:"auto-committing"},"Auto-Committing:"),(0,r.kt)("p",null,"If you send a command without manually beginning a transaction and it will automatically\nbe wrapped around a transaction. For example, the following ",(0,r.kt)("inlineCode",{parentName:"p"},"CREATE")," command will be\nautomatically wrapped around a transaction that will be executed in a serializable manner."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'  // Construct the Database object as above \n  auto conn = make_unique<Connection>(database.get());\n  auto result = conn->query("CREATE (a:User {name: 5, age: 72})");\n')),(0,r.kt)("p",null,"Note: All queries/commands sent from ",(0,r.kt)("a",{parentName:"p",href:"/docusaurus/client-apis/cli"},"CLI")," and ",(0,r.kt)("a",{parentName:"p",href:"python-api"},"Python API")," are in auto-commit mode.\nYou do not have to commit at the end of auto-committed transactions (and you cannot rollback)."),(0,r.kt)("div",{className:"footnotes"},(0,r.kt)("hr",{parentName:"div"}),(0,r.kt)("ol",{parentName:"div"},(0,r.kt)("li",{parentName:"ol",id:"fn-1"},"We will be addressing these limitations soon.",(0,r.kt)("a",{parentName:"li",href:"#fnref-1",className:"footnote-backref"},"\u21a9")))))}m.isMDXComponent=!0}}]);