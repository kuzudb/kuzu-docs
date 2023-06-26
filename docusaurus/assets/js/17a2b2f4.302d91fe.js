"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[4394],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>m});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),l=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=l(e.components);return r.createElement(i.Provider,{value:t},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),c=l(a),d=n,m=c["".concat(i,".").concat(d)]||c[d]||h[d]||o;return a?r.createElement(m,s(s({ref:t},u),{},{components:a})):r.createElement(m,s({ref:t},u))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,s=new Array(o);s[0]=d;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p[c]="string"==typeof e?e:n,s[1]=p;for(var l=2;l<o;l++)s[l]=a[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},6776:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>u});var r=a(7462),n=(a(7294),a(3905)),o=a(5973);const s={title:"Where",sidebar_position:3,description:"WHERE clause is where you specify predicates/constraints on a previous part of your query."},p="Database",i={unversionedId:"cypher/query-clauses/where",id:"cypher/query-clauses/where",title:"Where",description:"WHERE clause is where you specify predicates/constraints on a previous part of your query.",source:"@site/docs/cypher/query-clauses/where.md",sourceDirName:"cypher/query-clauses",slug:"/cypher/query-clauses/where",permalink:"/docusaurus/cypher/query-clauses/where",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cypher/query-clauses/where.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Where",sidebar_position:3,description:"WHERE clause is where you specify predicates/constraints on a previous part of your query."},sidebar:"tutorialSidebar",previous:{title:"Optional Match",permalink:"/docusaurus/cypher/query-clauses/optional-match"},next:{title:"With",permalink:"/docusaurus/cypher/query-clauses/with"}},l={},u=[],c={toc:u},h="wrapper";function d(e){let{components:t,...a}=e;return(0,n.kt)(h,(0,r.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"database"},"Database"),(0,n.kt)("p",null,"We will use the database, whose schema and data import commands are given ",(0,n.kt)("a",{parentName:"p",href:"/docusaurus/cypher/query-clauses/example-database"},"here"),":"),(0,n.kt)("img",{src:o.Z,style:{width:800}}),(0,n.kt)("p",null,"You can import this database by copy pasting the commands on that page. "),(0,n.kt)("h1",{id:"where"},"WHERE"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"WHERE")," clause is where you specify predicates/constraints on a previous part of your query.\nRegardless of what comes before WHERE, the semantics of WHERE is this two step computation: "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"(i) WHERE take the tuples  that the previous parts of your query has generated (up to the WHERE clause);"),(0,n.kt)("li",{parentName:"ul"},"(ii) and runs the boolean predicate specified in the WHERE clause and outputs those that pass the predicates to\nthe next part of your query.")),(0,n.kt)("p",null,"For example:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},'MATCH (a:User)\nWHERE a.age > 45 OR starts_with(a.name, "Kar")\nRETURN *;\n')),(0,n.kt)("p",null,"Output:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"---------------------------------------------\n| a                                         |\n---------------------------------------------\n| (label:User, 0:1, {name:Karissa, age:40}) |\n---------------------------------------------\n| (label:User, 0:2, {name:Zhang, age:50})   |\n---------------------------------------------\n")),(0,n.kt)("p",null,"View example in ",(0,n.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=D_u4RtEbsDv8"},"Colab"),"."),(0,n.kt)("p",null,'The boolean predicate/expression specified above can be understood as it reads: Users "a" whose ages are\ngreater than 45 OR whose names start with "Kar". It combines several means to construct expressions\nin high-level database query languages, such as as boolean operator (OR), a numeric comparison operator (>),\nand a string function (starts_with). You can learn more about the operators and functions K\xf9zu supports\nin the documentation on ',(0,n.kt)("a",{parentName:"p",href:"../expressions"},"functions and expressions")," and there. "),(0,n.kt)("p",null,'Note on checking if an expression is NULL or not: There is a special syntax, IS NULL or IS NOT NULL,\nin openCypher to check if the result of an expression is NULL. For example, the following\npredicate in the WHERE clause filters User nodes whose name start with "Kar" and whose age\nproperties are not NULL (in our database all age values are not null, so this part\nof the predicate is true for each User node in the database).'),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},'MATCH (a:User)\nWHERE a.age IS NOT NULL AND starts_with(a.name, "Kar")\nRETURN *;\n')),(0,n.kt)("p",null,"Output:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"---------------------------------------------\n| a                                         |\n---------------------------------------------\n| (label:User, 0:1, {name:Karissa, age:40}) |\n---------------------------------------------\n")),(0,n.kt)("p",null,"Please refer to these links for details on query semantics when using\n",(0,n.kt)("a",{parentName:"p",href:"/docusaurus/cypher/expressions/logical-operators"},"logical operators")," and ",(0,n.kt)("a",{parentName:"p",href:"/docusaurus/cypher/data-types/null"},"comparison operators on NULLs"),"."),(0,n.kt)("h1",{id:"where-exists--subqueries"},"WHERE EXISTS (...) Subqueries"),(0,n.kt)("p",null,"One special and powerful use of predicates in the WHERE clause is to check\nif a subquery SubQ that depends on the input tuples to WHERE\nis empty or not. You can use the ",(0,n.kt)("inlineCode",{parentName:"p"},"WHERE EXISTS (SubQ)")," syntax. For example,\nthe following query searches for all Users's who have at least one 3-hop Follows\npath starting from them."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"MATCH (a:User)\nWHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User)} \nRETURN a.name, a.age;\n")),(0,n.kt)("p",null,"Output:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"------------------\n| a.name | a.age |\n------------------\n| Adam   | 30    |\n------------------\n")),(0,n.kt)("p",null,"View example in ",(0,n.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=12JMqYmA3Iol"},"Colab"),"."),(0,n.kt)("p",null,"Note that in openCypher sub-queries are not arbitrary openCypher queries. They can only contain ",(0,n.kt)("em",{parentName:"p"},"a single MATCH clause")," optionally\nfollowed by a WHERE clause, e.g., no OPTIONAL MATCH, WITH or RETURN clauses."),(0,n.kt)("p",null,"You can also form nested sub-queries, i.e., a WHERE EXISTS sub-query inside another WHERE EXISTS. For example:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"MATCH (a:User)\nWHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)-[:Follows]->(c:User)} } \nRETURN a.name, a.age;\n")),(0,n.kt)("p",null,"Output:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"------------------\n| a.name | a.age |\n------------------\n")),(0,n.kt)("p",null,'This query returns an empty result because in our example database, only User node Adam has a 3-hop Follows path and the destination\n"b" node of that path is the User node Noura. However, Noura does not have an outgoing Follows relationship, which is the predicate in the\ninner WHERE EXISTS sub-query. If we instead specified that the destination b node has an incoming edge, by swapping the direction\nof the relationship in the inner ',(0,n.kt)("inlineCode",{parentName:"p"},"(b)-[:Follows]->(c:User)")," pattern to (b)<-","[:Follows]","-(c:User)",(0,n.kt)("inlineCode",{parentName:"p"},", we would get the\n"),"(Adam, 30)` tuple back because Noura has incoming Follows relationships."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"MATCH (a:User)\nWHERE a.age < 100 AND EXISTS { MATCH (a)-[:Follows*3..3]->(b:User) WHERE EXISTS {MATCH (b)<-[:Follows]-(c:User)} } \nRETURN a.name, a.age;\n")),(0,n.kt)("p",null,"Output:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"------------------\n| a.name | a.age |\n------------------\n| Adam   | 30    |\n------------------\n")),(0,n.kt)("p",null,"View example in ",(0,n.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=iuHDzuVu3g7A"},"Colab"),"."))}d.isMDXComponent=!0},5973:(e,t,a)=>{a.d(t,{Z:()=>r});const r=a.p+"assets/images/running-example-db76aa393fd70d29c831f1527455440a.png"}}]);