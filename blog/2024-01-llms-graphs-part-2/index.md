---
slug: what-every-gdbms-should-do-and-vision
authors: [semih]
tags: [vision]
---

import RAGUsingUnstructuredData from './rag-unstructured-overview.png';

# RAG Using Unstructured Data: Overview & Important Questions

[In my previous post](https://kuzudb.com/docusaurus/blog/llms-graphs-part-1), 
I gave an overview of question answering (Q&A) systems that use LLMs
over private enterprise data. I covered the architectures of these systems, the common tools
developers use to build these systems when the enterpise data used is structured, 
i.e., data is records stored in some DBMS, relational or graph. I was referring to
these systems as *RAG Systems using structured data*. In this post, I cover RAG systems 
that use unstructured data, such as text files,
pdf documents, or internal html pages in an enterprise.

:::tip TL;DR: The key takeaways from this post are:
- **Knowledge graphs play the role of connecting chunks of text:**:
- **What if you don't have an existing knowledge graph?:**:
- **A never ending quest: Automatic knowledge graph construction:**:
- ****: 
:::

I will skip the overview of RAG systems, which I covered in the previous post.
The picture of RAG systems that use unstructured data looks as follows:
<div class="img-center">
<img src={RAGUsingUnstructuredData} width="600"/>
</div>
