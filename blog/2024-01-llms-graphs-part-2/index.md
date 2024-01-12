---
slug: what-every-gdbms-should-do-and-vision
authors: [semih]
tags: [vision]
---

import RAGUsingUnstructuredData from './rag-unstructured-overview.png';
import StandardRAGPreprocessing from './standard-rag-preprocessing.png';
import StandardRAGOverview from './standard-rag-overview.png';
import KGEnhancedRAGPreprocessing from './kg-enhanced-rag-preprocessing.pnt';
import KGEnhancedRAGOverview from './kg-enhanced-rag-overview.png';
import TriplesBasedRAGPreprocessing from './triples-based-rag-preprocessing.pnt';
import TriplesBasedRAGOverview from './triples-based-rag-overview.png';

# RAG Using Unstructured Data: Overview & Important Questions

[In my previous post](https://kuzudb.com/docusaurus/blog/llms-graphs-part-1), 
I gave an overview of question answering (Q&A) systems that use LLMs
over private enterprise data. I covered the architectures of these systems, the common tools
developers use to build these systems when the enterpise data used is structured, 
i.e., data is records stored in some DBMS, relational or graph. I was referring to
these systems as *RAG systems using structured data*. In this post, I cover *RAG systems 
that use unstructured data*, such as text files,
pdf documents, or internal html pages in an enterprise. I will refer to these as RAG-U systems
or sometimes simpley as RAG-U (should have used the term RAG-S in the previous post!).

To remind readers, I decided to
write these two posts after doing a lot of reading in the space to understand the role of
knowlege graph (KGs) and graph DBMSs in LLM applications. My goals are (i) to overview the field to readers who want to get started
but are intimidated by the area; and (ii) point to several future work directions that I find 
important.[^1]

[^1]: In this post I'm only covering approaches
that ultimately use retrieve some unstructured data (or a transformation of it) to put it 
into LLM prompts. I am not covering approaches that query a pre-existing KG directly and use the records
in it as additional data into a prompt. See [this post](https://gradientflow.com/boosting-llms-with-external-knowledge-the-case-for-knowledge-graphs/) by Ben Lorica 
for an example. The 3 point bullet point after the "Knowledge graphs significantly 
enhance RAG models" describes such an approach. According to my organization of RAG approaches, 
such approaches would fall under RAG using structured data, since KGs are structured records.

:::tip TL;DR: The key takeaways from this post are:
- **Two design decisions when preparing a RAG-U system are (i) "What additional data" to put in prompts; and (ii) "How to store and fetch" the additional data.**: Explored options for types of additional data include chunks of texts, full documents, or automatically extracted triples from documents. There are different ways to store and fetch this additional data, such as use of vector indices. Many combinations of this design space are not yet explored.
- **Standard RAG-U**: A common design point, which I will call the standard RAG-U, is to add chunks of documents as additional data and store them in a vector index. I found some of the most technically deep and intersting future work directions in this space, e.g., extending vectors to matrices.
- **An envisioned role for KGs in a RAG-U system is as a means to link chunks of text:** If chunks can be linked to entities in an existing KG, then one can connect chunks to each other through the relationships in KG.
These connections can be exploited to retrieve more relevant chunks. This is a promising direction but
its potential benefits should be subjected to rigorously evaluation, e.g., as major SIGIR publications evaluate a new retrieval technique. It won't pick up through commercial blog posts.
- **What if an enterprise does not have a KG?** The hope of using KGs to do better retrieval in absence of a pre-existing KG raises the question and never ending quest of *automatic knowledge graph construction*. This is a very interesting topic and most recent research here uses LLMs for this purpose but: (i) LLMs seem behind in extracting quality knowledge graph facts; and (ii) it's not clear if use of LLMs for this purpose at scale is economically feasible.
:::

## RAG-U Overview
I will skip the overview of RAG systems, which I covered in [the previous post](https://kuzudb.com/docusaurus/blog/llms-graphs-part-1#a-note-on-the-term-rag).
The picture of RAG systems that use unstructured data looks as follows:
<div class="img-center">
<img src={RAGUsingUnstructuredData} width="600"/>
</div>

An enterprise has a corpus of unstructured data, i.e., some documents with text.
As a preprocessing step (omitted from the figure), the information in these documents are indexed and 
stored in some storage system. The figure labels the 4 overall steps in a RAG-U system:
1. A natural language query $Q_{NL}$ comes into the RAG-U system.
2. Parts of the corpus of unstructured data that is expected to be helpful in answering $Q_{NL}$
   is fetched from some storage system.
3. The fetched data along with $Q_{NL}$ given to an LLM.
4. LLM produces a natural language answer $A_{NL}$ for $Q_{NL}$.
   
Any system built along these 4 high-level steps needs to make two design choices:

**Design Choice 1: What is the additional data?** Among the posts, documentation, and demonstations 
I have read, I have seen three designs:
  - Chunks of documents
  - Entire documents
  - Triples extracted from documents

**Design Choice 2: How to store and fetch the additional data?** Here, I have seen the following designs:
  - Vector Index
  - Vector Index + Knowledge Graph (stored in a GDBMS)
  - GDBMS (for storing triples)

Many combinations of these two choices are possible and can be tried. Each choice
can effectively be understood as a *retrieval heuristic* to fetch quality content that can
help LLMs answer $Q_{NL}$ more accurately. 
I will cover a few of the ones that I have seen but others are certainly possible and should be tried by people
developing RAG-U systems.

## Standard RAG-U: Chunks of Documents Stored in a Vector Index

Standard RAG-U is what you will read about in most places. Its design is as follows: (i) we split the text in the
documents into (possibly overlapping) "chunks"; (ii) we embed these chunks into vectors, i.e., high dimensional points, using
a text embedding model (many off-the-shelf open-source models exist from [OpenAI](https://platform.openai.com/docs/guides/embeddings), [Cohere](https://docs.cohere.com/reference/embed), and [Hugging Face](https://huggingface.co/blog/getting-started-with-embeddings));
and (iii) we store these vectors in a vector index. For example, see LangChain main documentation 
on "[Q&A with RAG](https://python.langchain.com/docs/use_cases/question_answering/)" or LlamaIndex's 
"[Building a RAG from Scratch](https://docs.llamaindex.ai/en/stable/examples/low_level/oss_ingestion_retrieval.html)" documentation.
The below figure shows the pre-processing and indexing steps of standard RAG-U:
<div class="img-center">
<img src={StandardRAGPreprocessing} width="600"/>
</div>

**First a note on vector indices:** A vector index is an index that indexes a
set of d-dimensional vectors and given a query vector w can answer several queries:
(i) *pure search*: does w exist in the index?; (ii) *k nearest neighbors*: return
the k vectors closest to w; or (iii) *range queries*: return vectors that are within
a radius r of w. There have been decades of work on this topic. 
If d is very small, say 3 or 4, there are "exact spatial indices" like [quad trees](https://en.wikipedia.org/wiki/Quadtree) (for 2D only), [r-trees](https://en.wikipedia.org/wiki/R-tree), or [k-d trees](https://en.wikipedia.org/wiki/K-d_tree).
These indices have good construction and query times when d is small but their performance degrades
fast when d increases and they quickly become impractical.
There have been some good work to index high-dimensinal vectors as well. 
[SA-trees](https://dl.acm.org/doi/10.1007/s007780200060) by Navarro is the core
technique that underlies the nowadays popular indices, such as [hieararchical navigable small-world graph (HNSW) indices](https://arxiv.org/abs/1603.09320), which are extensions of [navigable small world (NSW)
indices](https://www.sciencedirect.com/science/article/abs/pii/S0306437913001300).
Navarro's SA-tree index returns exact results as well[^2] but does not have good query times.
In Navarro's experiments, even for
relatively small dimensions such as 10-20, sa-tree can scan 10-100% of all vectors in the index
for queries that need to return less than 1% of the vectors. 
SNW and HSNW instead are not exact indices. They are called approximate indices but they are not
even approximate in the sense of having any approximation guarantees in their query results.
They are heuristic-based fast indices both in their construction and their query times
that can index very high-dimensional vectors. Further, empirically their results are shown to be quite accurate.
HNSW indices are nowadays used by vector database companies like [Pinecone](https://www.pinecone.io/learn/series/faiss/hnsw/).
To understand these indices, I highly suggest first reading the Navarro paper
paper, which is the foundation. It's also a great example of a well-written database paper: one that
makes a very clear contribution and is explained in a very clean technical language.

[^2]: The term sa-tree stands for "spatial approximation", which refers to the following fact. 
Exact spatial indices like kd-trees are balanced and divide a d-dimensional space into "equal" sub-spaces (not in volume but
in the number of vectors sub-spaces contain). Instead sa-trees divide the space approximately and are not
necessarily balanced but as-trees return exact answers. 

Back to RAG-U. After the preprocessing step, the vector index that contains the chunks of documents is used
in a RAG-U system as follows:

<div class="img-center">
<img src={StandardRAGOverview} width="600"/>
</div>

The step are as follows: (i) The question $Q_{NL}$ is first embedded into
the same d-dimensional vector space as the chunks were. Let's call this vector $v_{Q}$;
(ii) k-nearest neighbors $w_1, w_2, ..., w_k$ of $v_{Q}$ are searched in the vector index; and (iii) the chunks
$C_1, C_2, ..., C_k$ that correspond to $w_1, w_2, ..., w_k$ are retrieved and put into the LLM prompt along with $Q_{NL}$. The
hope is that the chunks whose vector representation were close to $v_{Q}$ contain
useful information for the LLM to answer $Q_{NL}$. In practice there could be more steps to rank those $k$ chunks
and maybe select a fewer number of them to give to the LLM.

Overall, my reading on standard RAG-U was quite technically deep as the success of these pipelines
depend on two core and technically deep problems:
1. How "good" are the embeddings that are inserted into the vector index, i.e., how well does it
capture the relatedness of $Q_{NL}$ to the chunks. This is a core problem in the neural IR.
2. How accurate is the vector index in finding top-k nearest neighbors to the vector embedding $v_{Q}$ of $Q_{NL}$.
This is a core database problem.

*Important Future Work 1*: I belive we should be seeing more exciting work coming up in this space. One
topic I saw was the use of matrices instead of vectors to embed chunks and questions.
This is done in the [ColBERT-style models](https://huggingface.co/colbert-ir/colbertv2.0) and are shown to
work well on some Q&A benchmarks. However, instead of expensive matrix-to-matrix multiplications, the distance
calculations here are based on faster computations. Indexing and retrieval of these matrices is an interesting
topic and I have even started seeing some off-the-shelf tools, e.g., the [RAGatouille package of LlamaIndex](https://llamahub.ai/l/llama_packs-ragatouille_retriever?from=llama_packs), that allows developers to replace the vectors in the
standard RAG-U figure above with matrices. Tons of good future work is possible in this space, improving the accuracy
and efficiency of the vector/matrix indices and the evaluation of RAG-U systems that use these vectors.

## First Role of Knowledge Graphs in RAG-U: Explicitly Linking Chunks

One limitation of standard RAG-U is that the chunks are treated as isolated pieces of text. To address this problem,
several posts
that I read ([1](https://medium.com/neo4j/implementing-advanced-retrieval-rag-strategies-with-neo4j-c968a002c513), [2](https://medium.com/neo4j/using-a-knowledge-graph-to-implement-a-devops-rag-application-b6ba24831b16)) envision linking these chunks to each other using a knowledge graph (or another form of graph). Compared to standard RAG-U,
the design choice for "what additional data" is still document chunks but "how to fetch" is different
and it is a mix of Vector Index and a Knowledge Graph stored in a GDBMS.   
This seems to be a relatively under-explored
approach and I will comment on this. The preprocessing over standard RAG-U (see the preprocessing figure above)
would be enhanced with an additional step as follows:

<div class="img-center">
<img src={KGEnhancedRAGPreprocessing} width="600"/>
</div>

That is, using some entity extraction mechanism, the chunks would be connected to the entities that
they mention and are explicitly linked to the KG. You can think of this linking done as the adding
new edges to the KG that relate entities to some chunkIDs that identify the chunks in the vector index. 
Then, the RAG system looks as follows:

<div class="img-center">
<img src={KGEnhancedRAGOverview} width="600"/>
</div>

Similar to the previous system we have a vector index and additionally a KG, say stored in a GDBMS.
Then upon finding the k-nearest chunks to $Q_{NL}$, we extract additional chunks based on some graph
traversal heuristic. A simple heuristic is to traverse from the top-k chunks to all entities,
say {$e_1$, $e_2$, ..., $e_m$}, they mention. Then optionally explore the neighborhood of these entities
further to extract other entities, say {$e_1$, ..., $e_m$, $e_{m+1}$, ..., $e_n$}, where $e_{m+1}$ to $e_n$
are the new entitites extracted. Then further find other chunks that mention these entities. Now through
another ranking, we can obtain another top-k chunks amongst this new set of chunks and put them into the prompt.

This vision is interesting and several prior papers also hint at similar related use of
KGs in Q&A applications. The most interesting paper I read that's related to this approach was this [ACL 2019 paper](https://aclanthology.org/P19-1598.pdf). This paper pre-dates the current LLMs and is not about RAG. Instead, it
maps the entities mentioned in a question to entitites in a KG, and then extracts the subgraph of relations between these
entities from the KG. Then, the rest of the relations and entities that are extracted in the KG are used as possible
answers to the question (specifially to change the probabilities of the LLM to produce output text). It's close to
what we would call RAG. It does not connect the chunks but connects the entities in the question. The envisioned
use of KG I'm covering here is similar to this, except the KG is now used to connect the chunks through the entitites that
they mention. Overall, I think the idea of linking chunks through the entities that they mention is promising
and I want to identify three important future work here to push this idea to its limits.

**Important Future Work 2:* The biggest question here is that this approach assumes that the enterprise already
has a knowledge graph. Although I am strong believer that enterprises
should invest in the construction of clean enterprise-level KGs with
well defined and consistent vocabularies that can integrate campany-wide structured information,
in practice many enterprises do not have readily-available KGs. Therefore the use of this style
of KG-enhanced RAG-U approaches rely on tools that can generate KGs. This is a never ending
quest in academic circles and I'll say more about this [below](xxxx).

*Important Future Work 3:* The heuristic to extract I mention is only one that can be explored amongst many others. 
There are many other retrieval heuristics one can try. For example, one can map the entities in the question
to entities in the KG, find shortest paths between them, and retrieve the chunks that mention the entities
in these chunks. These variants need to be systematically evaluated to optimize this approach.

*Important Future Work 4:* Although variants of this approach, such as  the ACL paper I mentioned have a lot of technical depth
and rigorous evaluations, this approach so far appears only in blog posts which don't present an in-depth study. This approach
needs to be subjected to a rigorous evaluation on Q&A benchmarks.

## Second role of Knowledge Graphs in RAG-U: Extracting Triples Out of Chunks
In the [LlamaIndex KnowledgeGraphIndex](https://docs.llamaindex.ai/en/stable/examples/index_structs/knowledge_graph/KnowledgeGraphDemo.html) package, there is one more usage of KGs in RAG-U applications.
In this approach, the answer to the "what additional data" question is "triples extracted from the unstructured documents".
The answer to the "how to fetch" question is to do a retrieval of these triples from a GDBMS (at least in its basic form). 
Here is the preprocessing step:

<div class="img-center">
<img src={TriplesBasedRAGPreprocessing} width="600"/>
</div>

Using some triple extraction, the unstructured document is pre-processed to generate a KG. I will discuss
this step further but overall you can use either a triple extraction model, such as [REBEL](https://huggingface.co/Babelscape/rebel-large) or another model, or an LLM directly. Both can be used off-the-shelf. Then, these triples, which form
a KG, are stored in a GDBMS and used in RAG in some form. I'm giving one example approach below but others
are possible. The approach I will show
is implemented in the examples used in LlamaIndex's documentations using [LlamaIndex KnowledgeGraphIndex](https://docs.llamaindex.ai/en/stable/examples/index_structs/knowledge_graph/KnowledgeGraphDemo.html):

<div class="img-center">
<img src={TriplesBasedRAGOverview} width="600"/>
</div>

The triples are stored in a GDBMS. You can use a [LlamaIndex GraphStore](https://docs.llamaindex.ai/en/stable/community/integrations/graph_stores.html) for this and Kùzu has an implementation; see the [KuzuGraphStore demo here](https://docs.llamaindex.ai/en/stable/examples/index_structs/knowledge_graph/KuzuGraphDemo.html). The system extract entities using $Q_{NL}$, using some
entity or keyword extractor. In the LLamaIndex demos this is done by default using an LLM through the following `[DEFAULT_QUERY_KEYWORD_EXTRACT_TEMPLATE_TMPL]`(https://github.com/run-llama/llama_index/blob/ce82bd42329b56bca2a6a44e0f690ebedaf1f002/llama_index/prompts/default_prompts.py#L147) prompt: `A question is provided below. Given the question, extract up to {max_keywords}
keywords from the text....` etc. These keywords are used
to extract triples from the GDBMS by using them in the query sent to the GDBMS as shown in the above figure.
Finally the returned triples are given to the the LLM prompt as additional data to help answer $Q_{NL}$.

LlamaIndex offer other ways to extract these triples that are also readily available to use. For example,
you can embed these triples into vectors and use a vector index to fetch them. So although the final
additional data is still triples, how they're fetched is through a vector index and not a GDBMS. Other options
are also possible.

I want to make two points here. First, obseve that in this approach, ultimately the triples are extracted
from unstructured documents during the preprocessing step. But over the standard RAG-U approach,
extracting triples also provides a mean to link the text in the unstructured text, which was a
shortcoming I had highlighted in standard RAG-U. By putting triples into prompts, you are also likely
to save on the tokens you are using in your LLM applications, because triples are like summaries
of the statements in the sentences in chunks. Second, the success of such RAG applications depends on the quality of the triples
extracted in the pre-processing step, which is the next future work direction I want to highlight:

*Important Future Work 5:* The success of RAG-U applications that use triples or the KG-enchanced stardard
RAG-U applications I covered above depend on the availability of a technology that can automatically
extract knowledge graphs from unstructured documents.

This is a fascinating topic and is a never ending quest in research. Here is
an [extensive survey](https://arxiv.org/pdf/2302.05019.pdf) with 358 citations that scared me so I decided to
skip it. But my point is that this has been a great quest for research. The more recent
work is on evaluating LLMs for this task. I read a few of these papers
and can recommend these two: [1](https://arxiv.org/abs/2208.11057) and [2](https://arxiv.org/pdf/2308.10168.pdf).
General conclusions so far are that LLMs are not yet competitive one extracting subjects, objects, and predicates,
with specialized ones. We'll see how far they will go but an important question for which I could not find
much material is this:

*Important Future Work 6:* How economical would be the use of LLMs to extract KGs at scale (when they're competitive with
specialized methods)? 

So could we ever dream of using LLMs to extract billions of triples from large unstructured corpuses? Probably not
if you're using OpenAI APIs or even if you're running your own model. So I am a bit pessimistic here. My instinct
is that you might be able to generate KGs from unstructured documents using the slightly older
techniques like designing your own models or using extractor-based approaches like
[DeepDive](http://deepdive.stanford.edu/). In DeepDive, you would write extractors for the type
of triples you wanted to extract manually and DeepDive would use them in combination as part of a model
to extract high quality triples. Or you can just default to thinking hard about what you want to extract,
so what type of questions you want to answer in your RAG system, and based on those give example documents
and triples and train a model. 
I know, not very exciting, but you're likely to extract much higher quality triples and much more cheaply.

## Note on Developing RAG Systems That Use Both Structured & Unstructured Data
In my last post and this one, I covered RAG systems using structured and unstructured data.
There are several tools you can use to develop RAG systems that retrieve data from both
structured records or conditionally from one or the other. [LangChain Agents](https://python.langchain.com/docs/modules/agents/)
and [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents.html)
make it easy to produce such pipelines. You can for example instruct the "Agent" things like: 
"if the question is about abc retrieve fact from the GDBMS by converting the question to a Cypher query
and otherwise follow the RAG-U pipeline to retrieve chunks from documents." These are essentially
tools to develop a control logic over your LLM applications. It reminds me of my PhD days when
there was a crazy hype around MapReduce-like "big data systems" and several initial works
immediately were attacking how to develop tools/languages over these systems to have advanced
control flows. These are all initial answers to "how do you program advanced LLM applications."

## Final Words
I want to conclude with two further points. First, there are many other applications that can
use LLMs and KGs beyond Q&A. I don't have space to cove
them but here is a [survey paper](https://arxiv.org/pdf/2306.08302.pdf) that attempts to organize
publications in this space. The topics include how KGs can be used to train better LLMs to
how LLMs can be used to construct KGs to how one could embed both text and KG triples together as vectors
in some applications.


Second, I listed 3 possible answers for the "what additional data"
design decision and 3 possible answers for "how to fetch" design decision. I further mentioned different
graph-based heuristics to extract chunks (or triples) once you can link the information in the unstructured
documents to each other through a KG. Many combinations of these design decisions and many other graph heuristics
are not yet explored. So there is quite a lot to explore in this space. The overall impression I was left
with was that we need more technically deep material in the space, which will only come through rigorous evaluations
of these RAG systems on standard benchmarks, as done in SIGIR or ACL type publications.
I went through SIGIR 2023 publications and did not find work on a Q&A system that uses LLMs + KGs
similar to the appraoches I covered here. I hope we can see such papers in 2024!





