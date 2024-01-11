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
these systems as *RAG systems using structured data*. In this post, I cover RAG systems 
that use unstructured data, such as text files,
pdf documents, or internal html pages in an enterprise. I will refer to these as RAG-U systems
or sometimes simpley as RAG-U (should have used the term RAG-S in the previous post!).

To remind readers, I decided to
write these two posts after doing a lot of reading in the space to understand the role of
knowlege graph (KGs) and graph DBMSs in LLM applications. I am by no means
an expert in this area. My goals are (i) to overview the field to readers who want to get started
but are intimidated by the area; and (ii) point to several future work directions that I find 
important.[^1]

[^1]: In this post I'm only covering approaches
that ultimately use retrieve some unstructured data (or a transformation of it) to put it 
into LLM prompts. I am not covering approaches that query a pre-existing KG directly and use the records
in it as additional data into a prompt. According to my organization of RAG approaches, 
the latter approach would fall under RAG using structured data, since KGs are structured records.
I have also read several material on this but will not cover them. See [this post](https://gradientflow.com/boosting-llms-with-external-knowledge-the-case-for-knowledge-graphs/) by Ben Lorica 
for an example. The 3 point bullet point after the "Knowledge graphs significantly 
enhance RAG models" describes such an approach. 

:::tip TL;DR: The key takeaways from this post are:
- **Two design decisions when preparing a RAG-U system are (i) "What additional data" to put in prompts; and (ii) "How to fetch" this data.**: Explored options for types of additional data include chunks of texts, full documents, or automatically extracted triples from documents. There are different ways to store and fetch this additional data, such as use of vector indices. Many combinations of this design space are not yet explored.
- **Standard RAG-U**: A common design point, which I will call the standard RAG-U, is to add chunks of documents as additional data and store them in a vector index. I found some of the most technically deep and intersting future work directions in this space, e.g., extending vectors to matrices.
- **KGs' envisioned role in a RAG-U system is as a means to link chunks of text:** If chunks can be linked to entities in a KG, then one can connect chunks to each other through the relationships in KG.
These connections can be exploited to do better, i.e., more relevant, retrieval of chunks. This is a promising direction but to popularize this idea, studies need to answer this question: How much can this improve the accuracy of LLMs over standard RAG-U? This question should be answered rigorously to push this agenda forward, e.g., as major SIGIR publications evaluate their new retrieval techniques.
- **What if an enterprise does not have a KG?** This is probably the most obvious practical problem for adopting KGs in enterprises. The hope of using KGs to do better retrieval in absence of a pre-existing KG raises the question and never ending quest of *automatic knowledge graph construction*.
- **LLMs seem behind in extracting quality knowledge graph facts and we need to understand their economic feasibility:** I found several studies using LLMs for knowledge graph construction. This topic seems very active and contains some of the most technically deep material I ran into. Here, not surprisingly the focus is on quality and LLMs are not yet there to do this job as well as specialized models. Another important question is studying the economics of this: how costly would their use in knowledge graph construction be at scale?
:::

## RAG-U Overview
I will skip the overview of RAG systems, which I covered in the previous post.
The picture of RAG systems that use unstructured data looks as follows:
<div class="img-center">
<img src={RAGUsingUnstructuredData} width="600"/>
</div>
