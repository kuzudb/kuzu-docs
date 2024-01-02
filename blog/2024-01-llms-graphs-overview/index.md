---
slug: iamgraphviz
authors: 
  - semih
tags: [use-case]
---

import QAOverEnterpriseData from './qa-over-enterprise-data.png';
import RAGUsingStructuredData from './rag-using-structured-data.png';

# LLMs and Graphs Part 1: RAG Using Structured Data 

During the holiday season, I spent some time learning about
LLMs and specifically about "LLMs+graphs". By that, I mean the techniques people are 
experimenting with that use LLMs together with graph databases and knowledge graphs (defined later). 
If you are new to the area like me, the high level of activity on this topic on social
media, blog posts, and research publications may have intimidated you. 
If so, you're exactly my target audiece for this new blog post series I am starting. 
My goals are twofolds: 
1. *Overview the area*: I want to present what I learned with a simple and consistent terminology and at
a more technical depth than you might find in other blog posts, similar to a depth I would aim when preparing a lecture.
2. *Overview important future work*: My second goal is to cover several future work that
I think is important. Here, I don't necessarily mean research contributions
but also approaches that should be tried out if you are building question answering applications using LLMs+graphs.
That said, most content that I read
are researchy even if they are published by engineers of commercial companies. This is inevitable since the area is so new.

## Killer App: RAG for Question Answering Using Enterprise Data
The killer application of LLMs that is keeping the database community busy
is question answering (Q&A) over private enterprise data. Think of a chatbot,
say similar to the chatGPT interface you get on the browser, to which you 
can ask natural language questions ($Q_{NL}$), such as: "Who is our top paying customer from Waterloo?",
or "What are data privacy regulations in Canada we need to comply with?"
and get back natural language answers ($A_{NL}).
LLMs out of the box won't know the answer to these questions. For example,
they never had any access to the sales records of the enterprise. 
Therefore, a Q&A system needs to use 
extra information from data sources that are private to the enterprise.
There are several different approaches to use LLMs in such Q&A systems but
the high-level view of these system look as the below figure. 

<div class="img-center">
<img src={QAOverEnterpriseData} width="600"/>
</div>

Amongst the reading I made, any approach that uses LLMs to answer
natural language questions using private data is called *retrieval augmented generation* (RAG),
This a term coined in [this paper](https://arxiv.org/pdf/2005.11401.pdf) for the technique of
fine-tuning LLMs using additional information retrieved from documents. However, in several
documntations RAG is also used even if the Q&A system simply converts $Q_{NL}$ to
SQL or Cypher and returns back the result. I will stick to this broader usage of term RAG.

As shown in the figure overall, you can use RAG application by using structured and/or unstructured
data. Based on this, in this blog post series I will cover 3 RAG approaches to develop Q&A systems:
1. RAG using structured data: Uses structured records in the enterprise, e.g.,
in relational or graph DBMSs. 
2. RAG using unstructured data: Uses text files, pdfs, or other unstructured documents, such as html pages.
3. RAG using a mix of structured and unstructured data.

This post covers RAG using structured data. I will cover RAG using unstructured data in a follow-up post. Finally, I will not
have much to say about mixing structured and unstructured data. Instead, I will mention a few tools
you can use to develop such "hybrid" RAG applications.

## RAG Using Structured Data: Text-to-High-level Query
Many blog posts and several papers concern Q&A systems that simply convert
$Q_{NL}$ to a high-level query languge, such as SQL, Cypher, or SPARQL, using an LLM.
The figure below describes the overall approach:

<div class="img-center">
<img src={RAGUsingStructuredData} width="600"/>
</div>
$Q_{NL}$ along with the schema of a database, e.g., columns of relational tables
or labels of nodes and relationships with their descriptions, is given
to the LLM to generate a database query, such as SQL or Cypher, that would answer $Q_{NL}$. 
The result of the query is then converted into the natural language answer $A_{NL}$.

Let me pause here to appreciate one thing. For many decades, the database community has studied the problem
of converting $Q_{NL}$ to SQL (aka "text-to-SQL"). Here is a good recent [survey paper](https://link.springer.com/article/10.1007/s00778-022-00776-8)
that covers only the deep network-based approaches and [a more extensive survey](https://www.nowpublishers.com/article/Details/DBS-078)
on the broader topic of natural language interfaces to databases.
Neither of these surveys cover any work that that directly use LLMs such as chatGPT, 
which are quite recent developments. Take any of the work in these surveys and 
you'll find approach that requires significant engineering to build the same pipline. 
For example, most of the pre-LLM approaches that use deep learning, requires
at the least teaching some model how to speak SQL. These models are trained on large cross-domain 
corpuses of tables, such as [WikiSQL](https://arxiv.org/abs/1709.00103) or [Spider](https://github.com/taoyds/spider).
Therefore papers on these approaches are devoted to many pages of technical content describing how 
a specific approach teaches taught a deep model SQL or how 

The pre- and post-LLM approaches contrast sharply on the amount of
engineering 
approach require significant engineering to get this
functionality. For example, even the quite recent but still pre-LLM deep-learning approaches would 
need to develop a pipeline to train a model on a database D and also evaluate on D. Post-LLM approach
requires non of these because LLMs already s 

The sharp contrast post-LLMs is the sheer simplicity of 

([1](https://arxiv.org/pdf/2204.00498.pdf), [2](https://arxiv.org/pdf/2311.07509.pdf))

, this problem has been studied primarily for SQL for decades
and is sometimes refered to as the "text-to-SQL" problem. Here is a great history
that covers and a recent paper 



