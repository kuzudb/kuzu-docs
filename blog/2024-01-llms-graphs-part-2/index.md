---
slug: what-every-gdbms-should-do-and-vision
authors: [semih]
tags: [vision]
---

import RAGUsingUnstructuredData from './rag-unstructured-overview.png';
import StandardRAGPreprocessing from './standard-rag-preprocessing.png';
import StandardRAGOverview from './standard-rag-overview.png';
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
- **Two design decisions when preparing a RAG-U system are (i) "What additional data" to put in prompts; and (ii) "How to store and fetch" the additional data.**: Explored options for types of additional data include chunks of texts, full documents, or automatically extracted triples from documents. There are different ways to store and fetch this additional data, such as use of vector indices. Many combinations of this design space are not yet explored.
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

An enterprise has a corpus of unstructured data. Let's refer to these simply as documents.
We can assume this data is stored in some storage system in some form. 
There are 4 overall steps labeled in the figure:
1. A natural language query $Q_{NL}$ comes into the RAG-U system.
2. Parts of the corpus of unstructured data that is expected to be helpful in answering $Q_{NL}$
   is fetched from some storage system.
3. The fetched data along with $Q_{NL}$ given to an LLM.
4. LLM  produces a natural language answer $A_{NL}$ for $Q_{NL}$.
   
Any system built along these 4 high-level steps needs to make two design choices:

**Design Choice 1: What is the additional data?** Among the posts, documentation, and demonstations 
I have read, I have seen three possibilities for this:
  - Chunks of documents
  - Entire documents
  - Triples extracted from documents

**Design Choice 2: How to store and fetch the additional data?** Here, I have seen four possibilities for this:
  - Vector Index
  - Vector Index + Document-Chunk Graph (stored in a GDBMS)
  - Vector Index + Knowledge Graph (stored in a GDBMS)
  - GDBMS (for storing triples)

Many combinations of these two choices are possible and can be tried. Each choice
can effectively be understood as a *retrieval heuristic* to fetch quality content that can
help LLMs answer $Q_{NL}$ more accurately. 
I will cover a few of the ones that I have seen but a broader exploration of this heuristic space.

## Standard RAG-U: Chunks of Documents Stored in a Vector Index

Standard RAG-U that you will read about in most places splits the text in the
documents into "chunks", embeds these chunks into vectors, i.e., high dimensional points, 
and stores these vectors in a vector index. For example, see LangChain main documentation 
on "[Q&A with RAG](https://python.langchain.com/docs/use_cases/question_answering/)" or LlamaIndex's 
"[Building a RAG from Scratch](https://docs.llamaindex.ai/en/stable/examples/low_level/oss_ingestion_retrieval.html)" documentation.
The below figure shows the pre-processing and indexing steps of standard RAG-U:
<div class="img-center">
<img src={StandardRAGPreprocessing} width="600"/>
</div>

A vector index is an index that can answer k "nearest neighbor" queries., i.e.,
given a vector $x$, find the vectors in the top-k index that are closest to $x$. 
For a core database researcher like me, this is a very good topic and decades of work
has gone into the space. First, if the vectors have very small number of dimensions, say 4 to 6,
there are "spatial indices" like quad trees (for 2D only), r-trees, or [k-d trees](https://en.wikipedia.org/wiki/K-d_tree) that have different runtimes for finding 
vectors within 
that have the guarantee to return the exact top-k nearest neighbors and have fast search
and construction time (I'll spare you the details). However, often the construction time
and/or search times will degrade fast when the number of dimensions of the vectors increases.
For higher dimensions, there has also been very good work. [SA-trees](https://dl.acm.org/doi/10.1007/s007780200060) by Navarro is a great read on this and the core
technique that underlies the popular indices you hear nowadays, such as [hieararchical navigable small-world graph (HNSW) indices](https://arxiv.org/abs/1603.09320), which are extensions of [navigable small world
graph indices](https://www.sciencedirect.com/science/article/abs/pii/S0306437913001300), which are used by 
vector database companies like [Pinecone](https://www.pinecone.io/learn/series/faiss/hnsw/).
To understand these indices, I highly suggest you read the papers in historical order starting with Navarro 
paper, which is the foundation. It's also a great example of a well-written database paper: one that
makes a very clear contribution and is explained in a very clean technical language. Navarro's 
sa-tree example, To get back
to my point, for high-dimensional vectors, the exact indices 

degrades fast thogh when 
I want to take 
a break to tell you a bit more about this space. Probably the best paper in the field
to understand the foundations of n
If you want to do
some good reading on this, I do recommend some of the seminal papers in this space

<div class="img-center">
<img src={StandardRAGOverview} width="600"/>
</div>


