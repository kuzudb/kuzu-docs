"use strict";(self.webpackChunkkuzu_docs=self.webpackChunkkuzu_docs||[]).push([[1733],{3905:(t,e,n)=>{n.d(e,{Zo:()=>u,kt:()=>k});var a=n(7294);function l(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){l(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e){if(null==t)return{};var n,a,l=function(t,e){if(null==t)return{};var n,a,l={},r=Object.keys(t);for(a=0;a<r.length;a++)n=r[a],e.indexOf(n)>=0||(l[n]=t[n]);return l}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(a=0;a<r.length;a++)n=r[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(l[n]=t[n])}return l}var p=a.createContext({}),o=function(t){var e=a.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},u=function(t){var e=o(t.components);return a.createElement(p.Provider,{value:e},t.children)},d="mdxType",m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},N=a.forwardRef((function(t,e){var n=t.components,l=t.mdxType,r=t.originalType,p=t.parentName,u=s(t,["components","mdxType","originalType","parentName"]),d=o(n),N=l,k=d["".concat(p,".").concat(N)]||d[N]||m[N]||r;return n?a.createElement(k,i(i({ref:e},u),{},{components:n})):a.createElement(k,i({ref:e},u))}));function k(t,e){var n=arguments,l=e&&e.mdxType;if("string"==typeof t||l){var r=n.length,i=new Array(r);i[0]=N;var s={};for(var p in e)hasOwnProperty.call(e,p)&&(s[p]=e[p]);s.originalType=t,s[d]="string"==typeof t?t:l,i[1]=s;for(var o=2;o<r;o++)i[o]=n[o];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}N.displayName="MDXCreateElement"},2233:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>o});var a=n(7462),l=(n(7294),n(3905));const r={title:"List Functions",description:"List functions are used to create and manipulate lists."},i="List Functions",s={unversionedId:"cypher/expressions/list-functions",id:"cypher/expressions/list-functions",title:"List Functions",description:"List functions are used to create and manipulate lists.",source:"@site/docs/cypher/expressions/list-functions.md",sourceDirName:"cypher/expressions",slug:"/cypher/expressions/list-functions",permalink:"/docusaurus/cypher/expressions/list-functions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/cypher/expressions/list-functions.md",tags:[],version:"current",frontMatter:{title:"List Functions",description:"List functions are used to create and manipulate lists."},sidebar:"tutorialSidebar",previous:{title:"Interval Functions",permalink:"/docusaurus/cypher/expressions/interval-functions"},next:{title:"Logical Operators",permalink:"/docusaurus/cypher/expressions/logical-operators"}},p={},o=[{value:"LIST_SORT Function",id:"list_sort-function",level:2},{value:"LIST_SORT IN DESCENDING ORDER",id:"list_sort-in-descending-order",level:4},{value:"LIST_SORT IN DESCENDING ORDER WITH NULL AT LAST",id:"list_sort-in-descending-order-with-null-at-last",level:4}],u={toc:o},d="wrapper";function m(t){let{components:e,...n}=t;return(0,l.kt)(d,(0,a.Z)({},u,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"list-functions"},"List Functions"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Function"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"),(0,l.kt)("th",{parentName:"tr",align:null},"Example"),(0,l.kt)("th",{parentName:"tr",align:null},"Result"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_creation(arg1, arg2, arg3..)"),(0,l.kt)("td",{parentName:"tr",align:null},"creates a LIST containing the argument values"),(0,l.kt)("td",{parentName:"tr",align:null},"list_creation(1,2,3,4,5,56,2)"),(0,l.kt)("td",{parentName:"tr",align:null},"[1,2,3,4,5,56,2]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"len(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"returns the length of the list"),(0,l.kt)("td",{parentName:"tr",align:null},"len(","[1,2,3]",")"),(0,l.kt)("td",{parentName:"tr",align:null},"3")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_extract(list, index)"),(0,l.kt)("td",{parentName:"tr",align:null},"extracts the indexth (1-based) value from the list"),(0,l.kt)("td",{parentName:"tr",align:null},"list_extract(","[1,2,3]",", 2)"),(0,l.kt)("td",{parentName:"tr",align:null},"2")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_element(list, index)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_extract"),(0,l.kt)("td",{parentName:"tr",align:null},"list_element(","[7,234,3]",", 1)"),(0,l.kt)("td",{parentName:"tr",align:null},"7")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_concat(list1, list2)"),(0,l.kt)("td",{parentName:"tr",align:null},"concatenates two lists"),(0,l.kt)("td",{parentName:"tr",align:null},"list_concat(","[7,234,3]",", ","[1,3]",")"),(0,l.kt)("td",{parentName:"tr",align:null},"[7,234,3,1,3]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_cat(list1, list2)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_concat"),(0,l.kt)("td",{parentName:"tr",align:null},"list_cat(","['7','3']",", ","['1']",")"),(0,l.kt)("td",{parentName:"tr",align:null},"['7','3','1']")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_concat(list1, list2)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_concat"),(0,l.kt)("td",{parentName:"tr",align:null},"array_concat([","['7','2']",",","['3']","], [","['1']","])"),(0,l.kt)("td",{parentName:"tr",align:null},"[","['7','2']",",","['3']",",","['1']","]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_cat(list1, list2)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_concat"),(0,l.kt)("td",{parentName:"tr",align:null},"array_cat(","[4.23,5.25]",", ","[4.1]",")"),(0,l.kt)("td",{parentName:"tr",align:null},"[4.23,5.25,4.1]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_append(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"appends the element to list"),(0,l.kt)("td",{parentName:"tr",align:null},"list_append(","[3,5,9]",",4)"),(0,l.kt)("td",{parentName:"tr",align:null},"[3,5,9,4]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_append(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_append"),(0,l.kt)("td",{parentName:"tr",align:null},"array_append(","[2,1]",",3)"),(0,l.kt)("td",{parentName:"tr",align:null},"[2,1,3]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_push_back(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_append"),(0,l.kt)("td",{parentName:"tr",align:null},"array_push_back(","[3,6]",",4)"),(0,l.kt)("td",{parentName:"tr",align:null},"[3,6,4]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_prepend(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"prepends the element to list"),(0,l.kt)("td",{parentName:"tr",align:null},"list_prepend(","[3,6]",",4)"),(0,l.kt)("td",{parentName:"tr",align:null},"[4,3,6]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_prepend(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_prepend"),(0,l.kt)("td",{parentName:"tr",align:null},"array_prepend(","[3,6]",",4)"),(0,l.kt)("td",{parentName:"tr",align:null},"[4,3,6]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_push_front(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_prepend"),(0,l.kt)("td",{parentName:"tr",align:null},"array_push_front(","[1,2]",",3)"),(0,l.kt)("td",{parentName:"tr",align:null},"[3,1,2]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_position(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"returns the position of element in the list"),(0,l.kt)("td",{parentName:"tr",align:null},"list_position(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"3")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_indexof(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_position"),(0,l.kt)("td",{parentName:"tr",align:null},"list_indexof(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"3")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_position(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_position"),(0,l.kt)("td",{parentName:"tr",align:null},"array_position(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"3")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_indexof(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_position"),(0,l.kt)("td",{parentName:"tr",align:null},"array_indexof(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"3")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_contains(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"returns true if the list contains the element"),(0,l.kt)("td",{parentName:"tr",align:null},"list_contains(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"true")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_has(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_contains"),(0,l.kt)("td",{parentName:"tr",align:null},"list_has(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"true")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_contains(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_contains"),(0,l.kt)("td",{parentName:"tr",align:null},"array_contains(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"true")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_has(list, element)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_contains"),(0,l.kt)("td",{parentName:"tr",align:null},"array_has(","[3,4,5]",", 5)"),(0,l.kt)("td",{parentName:"tr",align:null},"true")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_slice(list, begin, end)"),(0,l.kt)("td",{parentName:"tr",align:null},"extracts a sublist using slice conventions and negative values are accepted."),(0,l.kt)("td",{parentName:"tr",align:null},"list_slice(","[3,4,5]",", 2, 3)"),(0,l.kt)("td",{parentName:"tr",align:null},"[4]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"array_slice(list, begin, end)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_slice"),(0,l.kt)("td",{parentName:"tr",align:null},"array_slice(","[6,7,1]",", 1, 3)"),(0,l.kt)("td",{parentName:"tr",align:null},"[6,7]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_sort(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"sorts the elements of the list. More configurations available ",(0,l.kt)("a",{parentName:"td",href:"#list_sort-function"},"here")),(0,l.kt)("td",{parentName:"tr",align:null},"list_sort(","[3,10,4]",")"),(0,l.kt)("td",{parentName:"tr",align:null},"[3,4,10]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_reverse_sort(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"alias of list_sort(list, 'DESC')"),(0,l.kt)("td",{parentName:"tr",align:null},"list_reverse_sort(","[3,10,4]",")"),(0,l.kt)("td",{parentName:"tr",align:null},"[10,4,3]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_sum(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"sums the elements of the list."),(0,l.kt)("td",{parentName:"tr",align:null},"list_sum(1,2,3)"),(0,l.kt)("td",{parentName:"tr",align:null},"6")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_distinct(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"removes NULLs and duplicate values from the list."),(0,l.kt)("td",{parentName:"tr",align:null},"list_distinct(3,3,3,NULL)"),(0,l.kt)("td",{parentName:"tr",align:null},"[3]")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_unique(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"counts number of unique elements of the list. NULLs are ignored."),(0,l.kt)("td",{parentName:"tr",align:null},"list_unique(3,3,3,NULL)"),(0,l.kt)("td",{parentName:"tr",align:null},"1")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"list_any_value(list)"),(0,l.kt)("td",{parentName:"tr",align:null},"returns the first non-NULL value of the list"),(0,l.kt)("td",{parentName:"tr",align:null},"list_any_value(NULL, 'a', NULL)"),(0,l.kt)("td",{parentName:"tr",align:null},"'a'")))),(0,l.kt)("h2",{id:"list_sort-function"},"LIST_SORT Function"),(0,l.kt)("p",null,"LIST_SORT function takes can be configured to sort in ascending or descending order as well as whether ",(0,l.kt)("inlineCode",{parentName:"p"},"NULL")," values should be put at the beginning or at the end of the list. By default, LIST_SORT will sort in ascending order and put NULL values at first. User can change sort order with ",(0,l.kt)("inlineCode",{parentName:"p"},"ASC")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"DESC")," key word as the\nsecond argument and change ",(0,l.kt)("inlineCode",{parentName:"p"},"NULL")," values position with ",(0,l.kt)("inlineCode",{parentName:"p"},"NULLS FIRST")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"NULLS LAST")," as the third argument."),(0,l.kt)("h4",{id:"list_sort-in-descending-order"},"LIST_SORT IN DESCENDING ORDER"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"RETURN list_sort([3,10, NULL, 4], 'DESC') AS result;\n")),(0,l.kt)("p",null,"Output:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"-------------\n| result    |\n-------------\n| [,10,4,3] |\n-------------\n")),(0,l.kt)("h4",{id:"list_sort-in-descending-order-with-null-at-last"},"LIST_SORT IN DESCENDING ORDER WITH NULL AT LAST"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"RETURN list_sort([3,10, NULL, 4], 'DESC', 'NULLS LAST') AS result;\n")),(0,l.kt)("p",null,"Output:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"-------------\n| result    |\n-------------\n| [10,4,3,] |\n-------------\n")))}m.isMDXComponent=!0}}]);