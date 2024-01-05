---
slug: what-every-gdbms-should-do-and-vision
authors: [semih]
tags: [vision]
---

# RAG Using Unstructured Data: Overview & Important Questions

[In my previous post](https://kuzudb.com/docusaurus/blog/llms-graphs-part-1), I gave an overview of question answering (Q&A) systems that use LLMs
over private enterprise data. I covered the architectures, and common tools, developers
use to build these systems when the private data they would like questions to be answered from
is structured, i.e., records stored in some DBMS, relational or graph. I was referring to
these systems as *RAG Systems using structured data*. In this post, I cover RAG systems that
answer questions using LLMs enhanced with private unstructured data, such as text files,
pdf documents, or internal html pages in an enterprise.

tl;dr...

