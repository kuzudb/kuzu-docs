---
slug: iamgraphviz
authors: 
  - semih
tags: [use-case]
---

import QAOverEnterpriseData from './qa-over-enterprise-data.png';
import RAGUsingStructuredData from './rag-using-structured-data.png';
import TwoSQLGenerationApproaches from './two-sql-generation-approaches.png';


# LLMs and Graphs Part 1: RAG Using Structured Data

During the holiday season, I did some reading on
LLMs and specifically on the techniques that use LLMs together with graph databases and knowledge graphs.
If you are new to the area like me, the amount of activity on this topic on social
media as well as in research publications may have intimidated you. 
If so, you're exactly my target audiece for this new blog post series I am starting. 
My goals are twofolds: 
1. *Overview the area*: I want to present what I learned with a simple and consistent terminology and at
a more technical depth than you might find in other blog posts. I am aiming a depth similar to what I aim when preparing
a lecture. I will link to many quality and technically satisfying content (mainly papers since the area is very researchy).
2. *Overview important future work*: I want to cover several important future work in the space. I don't
necessarily mean work for research contributions but also simple approaches to experiment with if you are
building question answering (Q&A) applications using LLMs and graph technology.

## Let's Review the Killer App: Retrieval Augmented Generation

The killer application of LLMs that is keeping the database community busy
is Q&A over private enterprise data. Think of a chatbot to which you 
can ask natural language questions ($Q_{NL}$), such as: "Who is our top paying customer from Waterloo?",
or "What are data privacy regulations in Canada we need to comply with?"
and get back natural language answers ($A_{NL}$).
LLMs, out of the box, cannot answer these questions because it has a *knowledge gaph*.
For example, LLMs never had any access to your sales records when they were trained. 
Therefore, they need to retrieve or be provided with 
extra information from private data sources of the enterprise.

**A note on a term you heard a lot -- Retrieval Augmented Generation:** 
There is a term that is used for systems that combines traditional 
information retrieval component, e.g., one that looks up some documents from
an index, with a natural language generator component, such as an LLM: 
*retrieval augmented generation* (RAG).
The term is coined in [this paper](https://arxiv.org/pdf/2005.11401.pdf) to refer
to the method of fine-tuning an LLM with additional information, i.e.,
using this additional data to train a new variant of the LLM. 
The term was used
in the original paper as "RAG models". Nowadays it is used in a variety of ways, 
such as, "RAG system", "RAG-based system", "RAG does X", or 
"Building RAG with Y". RAG no longer seems to refer to fine-tuning LLMs. Instead, it 
refers to providing LLMs with private data along with the question to fix the knowledge gap.
Even systems that simply use an LLM to convert a 
$Q_{NL}$ to SQL or Cypher query and simply return the results of the query
are called "RAG systems" in some documentations. I'll use it in this broader sense.

You can build RAG-based Q&A systems by using structured and/or unstructured
data. The high-level view of these systems look like this: 

<div class="img-center">
<img src={QAOverEnterpriseData} width="600"/>
</div>

In this blog post series I will cover the following approaches:
1. RAG using structured data: Uses structured records in the enterprise, e.g.,
records stored in relational or graph DBMSs. 
2. RAG using unstructured data: Uses text files, pdfs, or other unstructured documents, such as html pages.
3. RAG using a mix of structured and unstructured data.

This post covers RAG using structured data. I will cover RAG using unstructured data in a follow-up post, where
I will also mention a few ways people are building RAG-based Q&A systems that use both structured and unstructured data.

## RAG Using Structured Data: Text-to-High-level Query

### Overview
Many blog posts and several papers concern Q&A systems that simply convert
$Q_{NL}$ to a high-level query languge, such as SQL, Cypher, or SPARQL, using an LLM.
The figure below describes the overall approach:

<div class="img-center">
<img src={RAGUsingStructuredData} width="600"/>
</div>

$Q_{NL}$, the schema of a database, and optionally
some example natural language question and high-level query examples, are given
to the LLM as a prompt. 
The terms no shot, one shot, or few shot refers to the number of examples provided
in the prompt. Depending on the underlying database, the schema may contain
columns of relational tables and their descriptions, or labels of nodes and edges
of a graph database. Using $Q_{NL}$, the database schema, and optionally
some examples, the LLM generates 
a database query, such as SQL or Cypher. The system runs this query against the
DBMS and returns back the query result or using the LLM again, converts 
the query result back to a natural language answer $A_{NL}$. 

Let us pause here to appreciate one thing. For many decades, the database community has studied the problem
of converting $Q_{NL}$ to SQL (aka "text-to-SQL"). Here is a good recent [survey paper](https://link.springer.com/article/10.1007/s00778-022-00776-8)
that covers only the deep network-based approaches and [a more extensive survey/book](https://www.nowpublishers.com/article/Details/DBS-078)
on the broader topic of natural language interfaces to databases.
Neither of these surveys cover any work that directly uses LLMs such as GPT models, 
which are quite recent developments. Take any of the work covered in these surveys and 
you'll find an approach that requires significant engineering to build the pipeline shown in the above figure. 
For example, most of the pre-LLM approaches that use deep learning requires
hard work *to teach a model how to "speak" SQL* using large 
corpuses of tables, such as [WikiSQL](https://arxiv.org/abs/1709.00103) or [Spider](https://github.com/taoyds/spider).
Post-LLM approaches
requires none of this effort because LLMs already speak SQL, Cypher, or SPARQL out of the box. Same datasets
are now being used not for training models but simply for evaluating LLMs in many recent papers.
Instead the hard problem now is for developers *to learn how to prompt LLMs* so that 
LLMs generate correct queries. I'll say more about this problem. In contrast, building the above pipeline requires much less effort as
I'll review next.

###  LangChain and LlamaIndex Frameworks: Simplicity of Developing RAG Systems
If you have been following the area, you will not be surprised to hear that nowadays people build 
Q&A systems that convert $Q_{NL}$ to a high-level query language using two common tools:
(i) [LangChain](https://www.langchain.com/); and (ii) [LlamaIndex](https://www.llamaindex.ai/).
To give you one concrete example of using these tools, 
let me review the [Kùzu-LangChain integration](https://python.langchain.com/docs/use_cases/graph/graph_kuzu_qa)
(other GDBMSs have identical integrations). You as a programmer have very little to do: you prepare your Kùzu
database `db`, wrap it around a `KuzuGraph` and `KuzuQAChain` objects in Python and you have
a text-to-Cypher pipeline:

```
import kuzu
from langchain.chains import KuzuQAChain
from langchain_community.chat_models import ChatOpenAI
from langchain_community.graphs import KuzuGraph

db = kuzu.Database("test_db")
... // create your graph if needed
graph = KuzuGraph(db)
chain = KuzuQAChain.from_llm(ChatOpenAI(temperature=0), graph=graph, verbose=True)
chain.run("Who played in The Godfather: Part II?")
```
I am following the example application in this [documentation](https://python.langchain.com/docs/use_cases/graph/graph_kuzu_qa), 
which uses a database of movies, actors, and directors. 
```
Output:
> Entering new  chain...
Generated Cypher:
MATCH (p:Person)-[:ActedIn]->(m:Movie {name: 'The Godfather: Part II'}) RETURN p.name
Full Context:
[{'p.name': 'Al Pacino'}, {'p.name': 'Robert De Niro'}]

> Finished chain.

'Al Pacino and Robert De Niro both played in The Godfather: Part II.'
```
The "chain" first generated a Cypher query using $Q_{NL}$. 
Behind the curtain, i.e., inside the KuzuQAChain code, 
a GPT model was given the following prompt:
```
Generate Cypher statement to query a graph database.
Instructions:
Use only the provided relationship types and properties in the schema.
Do not use any other relationship types or properties that are not provided.

Schema:
Node properties: [{'properties': [('name', 'STRING')], 'label': 'Movie'}, {'properties': [('name', 'STRING'), ('birthDate', 'STRING')], 'label': 'Person'}]
Relationships properties: [{'properties': [], 'label': 'ActedIn'}]
Relationships: ['(:Person)-[:ActedIn]->(:Movie)']

Note: Do not include any explanations or apologies in your responses.
Do not respond to any questions that might ask anything else than for you to construct a Cypher statement.
Do not include any text except the generated Cypher statement.

The question is:
Who played in The Godfather: Part II?
```
Indeed if you copy this prompt and paste it in [chatGPT's browser interface](https://chat.openai.com/), 
you will get the same or very similar Cypher query. The important point is: that's all
the coding you have to do to build a natural language interface that can query your database. 
You ultimately construct a string prompt that contains $Q_{NL}$, some
instructions, and schema of the database, and the LLM will generate a query for you. 
The `KuzuGraph` and `KuzuQAChain`, along with many other similar interfaces, are simple wrappers to do just that.
If you want to play around with how well this works on other datasets,
we have this pipeline implemented in Kùzu's browser frontend [KùzuExplorer](https://kuzudb.com/docusaurus/kuzuexplorer/). 
That is, for any database you have in Kùzu, you get a natural language interface over it in
KùzuExplorer. Checkout the "robot icon" on the left (you need to provide your GPT API Key in the Settings tab). 
You can develop similar pipelines with other GDBMSs using similar interfaces.
If you instead want to build Q&A systems over your RDBMSs, you can use
LangChain's [SQLDatabaseChain](https://python.langchain.com/docs/use_cases/qa_structured/sql#case-2-text-to-sql-query-and-execution) and 
[SQLAgent](https://python.langchain.com/docs/use_cases/qa_structured/sql#case-3-sql-agents) or
LlamaIndex's [NLSQLTableQueryEngine](https://docs.llamaindex.ai/en/stable/examples/index_structs/struct_indices/SQLIndexDemo.html#part-1-text-to-sql-query-engine). The level of simplicity is similar to the example I presented.

###  LangChain and LlamaIndex Agents: More Advanced RAG Systems

In practice, it is unlikely that your chatbot or search engine will be as simple
as the above example where the application interacts with the LLM only once. If you want
to interact with the LLM multiple times and conditionally take one action over another action etc.,
LangChain and LlamaIndex also provide ways to do that through their `Agents' (see [LangChain Agents](https://docs.llamaindex.ai/en/v0.8.25/core_modules/agent_modules/agents/root.html) and [Llama Index Agents](https://docs.llamaindex.ai/en/stable/use_cases/agents.html).
You can use these interfaces to develop manual "Agents" but there are also existing Agents that can be used
out-of-the box. For example, the
[LangChain SQLAgent](https://python.langchain.com/docs/use_cases/qa_structured/sql#case-3-sql-agents), 
takes only the $Q_{NL}$ and uses the LLM 2 times (I'm simplifying a bit): (i) First, the LLM is prompted to
decide which tables' schema should be read by giving $Q_{NL}$ and the names of the tables
in the database (output of the 
'show tables' in SQL). The LLM then gives back a query to read a subset of the tables' schemas.
(ii) Then, using the schema information of the set of tables, the LLM now generates a 
SQL query to answer $Q_{NL}$. These are good interfaces to use to develop more realistic Q&A systems
and I will briefly revisit these in the next blog post.

###  How Good Are LLMs in Generating High-Level Queries
Again, if you want 
to appreciate the simplicity of solving text-to-high-level query problem with LLMs, 
I urge you to take a peek at the literature and check out how people would develop
the same functionality in pre-LLM text-to-SQL systems (e.g., [ATHENA](https://www.vldb.org/pvldb/vol9/p1209-saha.pdf)
or [BELA](https://download.hrz.tu-darmstadt.de/pub/FB20/Dekanat/Publikationen/UKP/76500354.pdf)). People
had to solve many other technical problems for the same functionality, such as parsing the question,
entity detection, synonym finding, string similarity, among others. Yet, simplicity does not mean quality.
Indeed people are now studying the following two (related) questions: 

1. *How accurate are the high-level queries that LLMs generate?*
2. *How, e.g., through what types of prompts or data modeling, can we increase the accuracy of the
queries generated by LLMs?*

Here are several papers that I suggest reading on this:
1. *[A comprehensive evaluation of ChatGPT’s zero-shot Text-to-SQL capability](https://arxiv.org/pdf/2303.13547.pdf)* from Tsinghua University and University of Illinois at Chicago. 
2. *[Evaluating the Text-to-SQL Capabilities of Large Language Models](https://arxiv.org/pdf/2204.00498.pdf)* from researchers from Cambridge and universties and institutes from Montréal.
3. *[Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation](https://arxiv.org/pdf/2308.15363.pdf)* from Alibaba Group.
4. *[Enhancing Few-shot Text-to-SQL Capabilities of Large Language Models: A Study on Prompt Design Strategies](https://arxiv.org/pdf/2305.12586.pdf)* from Yale, Columbia, and Allen Institute for AI.
5. *[How to Prompt LLMs for Text-to-SQL: A Study in Zero-shot, Single-domain, and Cross-domain Settings](https://arxiv.org/pdf/2305.11853.pdf)* from Ohio State
6. *[A Benchmark to Understand the Role of Knowledge Graphs on LLM's Accuracy for Q&A on Enterprise SQL Databases](https://arxiv.org/pdf/2311.07509.pdf)* from data.world.

These papers are either entirelly or almost entirely evaluation-only papers that experiment with very detailed approaches of prompting LLMs
to generate SQL queries. Except for the last one, they have all "repurposed" Spider or WikiSQL dataset
to evaluate LLMs with different prompting approaches. First let me say that the general message many of these
papers give (maybe except the last one) is that LLMs are pretty good. With right prompting (or even with basic prompting)
they do well on these benchmarks. That should be impressive to many.
Second, the set of techniques are too detailed to cover here but briefly include
many heuristics for: the syntax used for providing the schema 
(apparently putting `the pound sign “#” to differentiate prompt from response in examples yields impressive performance gains` 😀 go figure) or
the number and selection of example (question, SQL) pairs, e.g., apparently most work finds there is a sweet spot in the number
of examples to provide or even the effects of standardizing the text in the prompt, e.g., indenting and using all lower case letters consistently
(apparently has minor but effect). Yes, as interesting and important it is to learn how to use LLMs better, I still 
of the following thought before going to bed: somewhere out there, some advisor might be torturing some graduate student
to check if this magical box produces better SQL if we put pound sign vs double slashes in LLM prompts!

Most work I found is on generating SQL.
In contrast, I found no papers that do similar prompting study for query languages
of GDBMS though I ran into two papers that are providing benchmarks for query languages of GDBMSs: 
(i) [SPARQL](https://arxiv.org/abs/2309.16248); and (ii) [Cypher](https://dl.acm.org/doi/pdf/10.1145/3511808.3557703)).
So a low-hanging fruit future work is:

*Important Future Work 1: Perform similar prompting studies for query languages of graph DBMSs.*: Given the new benchmarks
people are providing for SPARQL and Cypher, the infrastructure for this type of evaluation may be available.
In contrast to SQL queries, here one should study various recursive queries that the query languages of GDBMSs are particularly good
at and queries that omit 

## Review of the [data.world Paper](https://arxiv.org/pdf/2311.07509.pdf)
In the remainder of the post I want to review the paper from data.world. Similar to the other papers there,
this paper is a text-to-SQL using LLMs but is closely related to GDBMSs. Unlike other papers which 
study the effects of different prompting heuristics, this paper studies the *effects of data modeling of the 
same set of records on the accuracy of SQL queries generated by LLMs*. As explained momentarily, one modeling
choice experimented with uses a graph model (called "knowledge graph" in the paper). 

Specifically, this paper is an evaluation of the performance of LLMs in generating SQL using no examples, i.e., zero-shot,
with basic prompting over a reference and standardized insurance database schema 
called The [OMG Property and Casualty Data Model](https://www.omg.org/spec/PC/1.0/About-PC). 
See Figure 1 in the paper (omitted here) for the conceptual schema, which consists of classes such as 
Policy, Account, Claims, Insurable Object, among others, and their relatinships.
The paper has a benchmark of 43 natural langauge questions and compares 2 approaches to generate the SQL query.
The below figure shows an overview of these approaches for reference:

<div class="img-center">
<img src={TwoSQLGenerationApproaches} width="600"/>
</div>

1. Direct SQL Generation:
2. Indirect SQL Generation via Graph Modeling/SPARQL: 


<---
[^3]: A  plug here is that Kùzu is embeddable and requires no server set ups
or usernames and password configurations. If you want to develop variants of these systems,
it is the easiest system to use to get going. Indeed one of our primary goals is to make Kùzu 
the easiest to use GDBMS available for developers.
--->


These are common tools to develop many different LLM-based systems including RAG-based ones.
Instead of covering example applications in detail, I will just refer you to a few documentation pages.


I will not cover these in detail but for example, 




As a result, the several post-LLM work I read  
are evaluation-only papers 
that experiment with LLMs on suites of queries and publish their observations.
In constrast, these papers require much less effort to 
engineer the pipeline in the above figure so there is not much to write about that.


