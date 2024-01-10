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
- Two important steps in RAG-u pipelines are: (i) "What data" question: What additional data to put into prompts (explored options are chunks of texts, full documents, or automatically extracted triples); and (2) "How to fetch" question: How is this additional data stored and fetched, for which there are many approaches, such as use of vector indices or even using a structured query language. Many combinations of this space are not explored, so there is some good work to do here.
- Vanilla RAG-u choise for these two questions are: (1) chunks documents; and (2) use a vector index. There are some technically satisfying directions here that are worth exploring, specifically questions about replacing vectors with matrices as done in COLBERT-like models, and scaling these.
- Primary envisioned role of knowledge graphs in unstructured RAG is connecting chunks of text in the unstructurd documents. This is promising but to popularize this idea, studies need to answer this question: How much can improve accuracy of LLM answers over vanilla RAG-u? This question should be answered rigorously as done in major SIGIR publications, to push this agenda forward.
- The major practical problem for using KGs is for enterprises that don't have a pre-existing knowledge graph:  This raises the never ending quest of automatic knowledge graph construction.
- Use of LLMs for knowledge graph construction is actively studied. Some of the most technically deep material I ran into was in this space. Here, not surprisingly the focus is on quality and LLMs are not yet there to do this job as well as specialized models. Important questions are studying the economics of this: how costly would this be? If/when LLMs are competitive, will their use make sense economically?
:::

I will skip the overview of RAG systems, which I covered in the previous post.
The picture of RAG systems that use unstructured data looks as follows:
<div class="img-center">
<img src={RAGUsingUnstructuredData} width="600"/>
</div>
