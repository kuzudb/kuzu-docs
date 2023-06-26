"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[7808],{3905:(e,n,a)=>{a.d(n,{Zo:()=>p,kt:()=>m});var r=a(7294);function t(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function l(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?l(Object(a),!0).forEach((function(n){t(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function o(e,n){if(null==e)return{};var a,r,t=function(e,n){if(null==e)return{};var a,r,t={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],n.indexOf(a)>=0||(t[a]=e[a]);return t}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}var i=r.createContext({}),u=function(e){var n=r.useContext(i),a=n;return e&&(a="function"==typeof e?e(n):s(s({},n),e)),a},p=function(e){var n=u(e.components);return r.createElement(i.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},g=r.forwardRef((function(e,n){var a=e.components,t=e.mdxType,l=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=u(a),g=t,m=c["".concat(i,".").concat(g)]||c[g]||d[g]||l;return a?r.createElement(m,s(s({ref:n},p),{},{components:a})):r.createElement(m,s({ref:n},p))}));function m(e,n){var a=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var l=a.length,s=new Array(l);s[0]=g;var o={};for(var i in n)hasOwnProperty.call(n,i)&&(o[i]=n[i]);o.originalType=e,o[c]="string"==typeof e?e:t,s[1]=o;for(var u=2;u<l;u++)s[u]=a[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}g.displayName="MDXCreateElement"},4762:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>u,contentTitle:()=>o,default:()=>g,frontMatter:()=>s,metadata:()=>i,toc:()=>p});var r=a(7462),t=(a(7294),a(3905)),l=a(5973);const s={title:"Return",sidebar_position:5,description:"RETURN is similar to the `SELECT` clause of SQL. RETURN is where the final results of the query are specified."},o="Database",i={unversionedId:"cypher/query-clauses/return",id:"cypher/query-clauses/return",title:"Return",description:"RETURN is similar to the `SELECT` clause of SQL. RETURN is where the final results of the query are specified.",source:"@site/docs/cypher/query-clauses/return.md",sourceDirName:"cypher/query-clauses",slug:"/cypher/query-clauses/return",permalink:"/docusaurus/cypher/query-clauses/return",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cypher/query-clauses/return.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Return",sidebar_position:5,description:"RETURN is similar to the `SELECT` clause of SQL. RETURN is where the final results of the query are specified."},sidebar:"tutorialSidebar",previous:{title:"With",permalink:"/docusaurus/cypher/query-clauses/with"},next:{title:"Order By",permalink:"/docusaurus/cypher/query-clauses/order-by"}},u={},p=[{value:"Returning Node and Relationship Variables",id:"returning-node-and-relationship-variables",level:2},{value:"Returning All Variables",id:"returning-all-variables",level:2},{value:"Returning Node and Relationship Properties",id:"returning-node-and-relationship-properties",level:2},{value:"Using Distinct for Duplicate Elimination",id:"using-distinct-for-duplicate-elimination",level:2},{value:"Group By and Aggregations",id:"group-by-and-aggregations",level:2},{value:"Note on NULLs",id:"note-on-nulls",level:3}],c={toc:p},d="wrapper";function g(e){let{components:n,...a}=e;return(0,t.kt)(d,(0,r.Z)({},c,a,{components:n,mdxType:"MDXLayout"}),(0,t.kt)("h1",{id:"database"},"Database"),(0,t.kt)("p",null,"We will use the database, whose schema and data import commands are given ",(0,t.kt)("a",{parentName:"p",href:"/docusaurus/cypher/query-clauses/example-database"},"here"),":"),(0,t.kt)("img",{src:l.Z,style:{width:800}}),(0,t.kt)("p",null,"You can import this database by copy pasting the commands on that page. "),(0,t.kt)("h1",{id:"return"},"RETURN"),(0,t.kt)("p",null,(0,t.kt)("inlineCode",{parentName:"p"},"RETURN")," is similar to the ",(0,t.kt)("inlineCode",{parentName:"p"},"SELECT")," clause of SQL. RETURN is where the final results of the\nquery are specified, which can be listed as a list of expressions, e.g., variables that have\nbound to nodes or relationships, aliases, or more complex expressions. RETURN can also be used\nfor performing group-by and aggregations as well as duplication removing (using the ",(0,t.kt)("inlineCode",{parentName:"p"},"DISTINCT")," clause).\nWe discuss several common expressions used in RETURN."),(0,t.kt)("h2",{id:"returning-node-and-relationship-variables"},"Returning Node and Relationship Variables"),(0,t.kt)("p",null,"Returning variables in the query that are bound to node and relationships in the query\nis a syntactic sugar to return all properties of those variables. For example:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"MATCH (a:User)-[e:Follows]->(b:User)\nRETURN a, e;\n")),(0,t.kt)("p",null,"Output:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"---------------------------------------------------------------------------------------------------\n| a                                         | e                                                   |\n---------------------------------------------------------------------------------------------------\n| (label:User, 0:0, {name:Adam, age:30})    | (0:0)-[label:Follows, {_id:2:0, since:2020}]->(0:1) |\n---------------------------------------------------------------------------------------------------\n| (label:User, 0:0, {name:Adam, age:30})    | (0:0)-[label:Follows, {_id:2:1, since:2020}]->(0:2) |\n---------------------------------------------------------------------------------------------------\n| (label:User, 0:1, {name:Karissa, age:40}) | (0:1)-[label:Follows, {_id:2:2, since:2021}]->(0:2) |\n---------------------------------------------------------------------------------------------------\n| (label:User, 0:2, {name:Zhang, age:50})   | (0:2)-[label:Follows, {_id:2:3, since:2022}]->(0:3) |\n---------------------------------------------------------------------------------------------------\n")),(0,t.kt)("p",null,"View example in ",(0,t.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=gZ7zGvGQ0tZf"},"Colab"),"."),(0,t.kt)("h2",{id:"returning-all-variables"},"Returning All Variables"),(0,t.kt)("p",null,"Returning all variables in the query can be written as ",(0,t.kt)("inlineCode",{parentName:"p"},"RETURN *"),' as a syntactic sugar. Below query returns "a" and "b", relationship is omitted because no variable binds to it.'),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"MATCH (a:User)-[:Follows]->(b:User)\nRETURN *;\n")),(0,t.kt)("p",null,"Output:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"-----------------------------------------------------------------------------------------\n| b                                         | a                                         |\n-----------------------------------------------------------------------------------------\n| (label:User, 0:1, {name:Karissa, age:40}) | (label:User, 0:0, {name:Adam, age:30})    |\n-----------------------------------------------------------------------------------------\n| (label:User, 0:2, {name:Zhang, age:50})   | (label:User, 0:0, {name:Adam, age:30})    |\n-----------------------------------------------------------------------------------------\n| (label:User, 0:2, {name:Zhang, age:50})   | (label:User, 0:1, {name:Karissa, age:40}) |\n-----------------------------------------------------------------------------------------\n| (label:User, 0:3, {name:Noura, age:25})   | (label:User, 0:2, {name:Zhang, age:50})   |\n-----------------------------------------------------------------------------------------\n")),(0,t.kt)("p",null,"View example in ",(0,t.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=N1EK35S419JF"},"Colab"),"."),(0,t.kt)("h2",{id:"returning-node-and-relationship-properties"},"Returning Node and Relationship Properties"),(0,t.kt)("p",null,"You can also return properties of variables by explicitly specifying properties in the ",(0,t.kt)("inlineCode",{parentName:"p"},"RETURN")," clause."),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"MATCH (a:User)-[e:Follows]->(b:User)\nRETURN a.name, a.age, e.since;\n")),(0,t.kt)("p",null,"Output:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"-----------------------------\n| a.name  | a.age | e.since |\n-----------------------------\n| Adam    | 30    | 2020    |\n-----------------------------\n| Adam    | 30    | 2020    |\n-----------------------------\n| Karissa | 40    | 2021    |\n-----------------------------\n| Zhang   | 50    | 2022    |\n-----------------------------\n")),(0,t.kt)("p",null,"View example in ",(0,t.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=rYG1C5gj2KNA"},"Colab"),"."),(0,t.kt)("h2",{id:"using-distinct-for-duplicate-elimination"},"Using Distinct for Duplicate Elimination"),(0,t.kt)("p",null,"You can use RETURN DISTINCT to do duplicate elimination of the returned tuples.\nFor example, if we instead wrote ",(0,t.kt)("inlineCode",{parentName:"p"},"RETURN DISTINCT")," in the above query, we would\neliminate one of the 2 (Adam, 30, 2020) tuples above:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"MATCH (a:User)-[e:Follows]->(b:User)\nRETURN DISTINCT a.name, a.age, e.since;\n")),(0,t.kt)("p",null,"Output:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"-----------------------------\n| a.name  | a.age | e.since |\n-----------------------------\n| Adam    | 30    | 2020    |\n-----------------------------\n| Karissa | 40    | 2021    |\n-----------------------------\n| Zhang   | 50    | 2022    |\n-----------------------------\n")),(0,t.kt)("p",null,"View example in ",(0,t.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1NcR-xL4Rb7nprgbvk6N2dIP30oqyUucm#scrollTo=wvkKPDX22Wcl"},"Colab"),"."),(0,t.kt)("h2",{id:"group-by-and-aggregations"},"Group By and Aggregations"),(0,t.kt)("p",null,"You can group by one or more expression and perform one or more aggregations\nin a RETURN clause. For example:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"MATCH (a:User)-[:Follows]->(b:User)\nRETURN a, avg(b.age) as avgFriendAge;\n")),(0,t.kt)("p",null,"Output:"),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre"},"------------------------------------------------------------\n| a                                         | avgFriendAge |\n------------------------------------------------------------\n| (label:User, 0:0, {name:Adam, age:30})    | 45.000000    |\n------------------------------------------------------------\n| (label:User, 0:1, {name:Karissa, age:40}) | 50.000000    |\n------------------------------------------------------------\n| (label:User, 0:2, {name:Zhang, age:50})   | 25.000000    |\n------------------------------------------------------------\n")),(0,t.kt)("p",null,"View example in ",(0,t.kt)("a",{parentName:"p",href:"https://colab.research.google.com/drive/1kA0jFcPGSVLSE6B1FeNDs6htsAQ6jZXf#scrollTo=7cPrEPXI4C1e"},"Colab"),"."),(0,t.kt)("p",null,"The semantics is exactly the same as SQL's semantics, which is a\n3-step process:\n1) for each tuple  t in the previous part of the query, i.e., before the RETURN clause,\ngroup t according to (one or more) group by key expressions into a group. Let us refer\nto the result of these expressions as t's keys.\n2) For each group G, compute the (or or more) aggregations in the query.\n3) Output for each group G, G's key(s) and the result of the aggregations. "),(0,t.kt)("p",null,"You can find the list of aggregation functions supported in K\xf9zu ",(0,t.kt)("a",{parentName:"p",href:"/docusaurus/cypher/expressions/aggregate-functions"},"here"),"."),(0,t.kt)("h3",{id:"note-on-nulls"},"Note on NULLs"),(0,t.kt)("p",null,"The handling of NULLs in group by keys and values also follow the SQL semantics:"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},"All NULL keys are grouped into a single group."),(0,t.kt)("li",{parentName:"ul"},"NULL values are ignored in aggregations.")))}g.isMDXComponent=!0},5973:(e,n,a)=>{a.d(n,{Z:()=>r});const r=a.p+"assets/images/running-example-db76aa393fd70d29c831f1527455440a.png"}}]);