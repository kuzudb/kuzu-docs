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
pdf documents, or internal html pages in an enterprise. I will refer to these as RAG-U Systems
or RAG-U for short.

To remind readers, I decided to
write these two posts after doing a lot of reading in the space to understand the role
knowlege graph (KGs) and graph DBMSs play in LLM applications. I am by no means
an expert in this area. My goals are (i) to overview the field to readers who are not 
familiar and intimidated by the area; and (ii) point to several future work directions that I find 
important and technically deep.[^1]

[^1]: In this post I'm only covering approaches
that ultimately use retrieve some unstructured text or a transformation of it and put it 
into LLM prompts. I am not covering approaches that query a pre-existing KG directly and use the records
in it as additional data into a prompt. According to my organization of RAG approaches, 
that would fall under RAG using structured data, since KGs are structured records.
I have also read several material on this but will not cover them. See [this post](https://gradientflow.com/boosting-llms-with-external-knowledge-the-case-for-knowledge-graphs/) by Ben Lorica 
for an example. The 3 point bullet point after the "Knowledge graphs significantly 
enhance RAG models" describes the overall approach. 

:::tip TL;DR: The key takeaways from this post are:
- **2 design decisions when preparing a RAG-u pipeline are (i) "What additional data" to put in prompts; and (ii) "How to fetch" this data.**: Explored options for types of additional data include chunks of texts, full documents, or automatically extracted triples from documents. There are different ways to store and fetch this additional data, such as use of vector indices. Many combinations of this design space are not yet explored.
- **Standard RAG-u**: A common design point, which I will call the standard RAG-u, is to add chunks of documents as additional data and store them in a vector index. As a core DBMS researcher, I found some of the most technically deep and intersting future work directions in this space, e.g., extending vectors to matrices. 
- **KGs envisioned role in RAG-u is as a means to link chunks of text:** If chunks can be linked to entities in a KG, then one can hope to exploit this to do better, i.e., more relevant, retrieval of chunks. This is a promising direction but to popularize this idea, studies need to answer this question: How much can improve accuracy of LLM answers over vanilla RAG-u? This question should be answered rigorously as done in major SIGIR publications, to push this agenda forward.
- The major practical problem for using KGs is for enterprises that don't have a pre-existing knowledge graph:  This raises the never ending quest of automatic knowledge graph construction.
- Use of LLMs for knowledge graph construction is actively studied. Some of the most technically deep material I ran into was in this space. Here, not surprisingly the focus is on quality and LLMs are not yet there to do this job as well as specialized models. Important questions are studying the economics of this: how costly would this be? If/when LLMs are competitive, will their use make sense economically?
:::

I will skip the overview of RAG systems, which I covered in the previous post.
The picture of RAG systems that use unstructured data looks as follows:
<div class="img-center">
<img src={RAGUsingUnstructuredData} width="600"/>
</div>
