---
slug: iamgraphviz
authors: 
  - semih
tags: [use-case]
---

import QAOverEnterpriseData from './qa-over-enterprise-data.png';
import RAGUsingStructuredData from './rag-using-structured-data.png';

# LLMs and Graphs Part 1: RAG Using Structured Data

During the holiday season, I did some reading on
LLMs and specifically on the techniques that use LLMs together with graph databases and knowledge graphs.
If you are new to the area like me, the amount of activity on this topic on social
media as well as in research publications may have intimidated you. 
If so, you're exactly my target audiece for this new blog post series I am starting. 
My goals are twofolds: 
1. *Overview the area*: I want to present what I learned with a simple and consistent terminology and at
a more technical depth than you might find in other blog posts. I am aiming a depth similar to what I aim when preparing
a lecture.
2. *Overview important future work*: I want to cover several important future work in the space. I don't
necessarily mean work for research contributions but also simple approaches to experiment with if you are
building question answering (Q&A) applications using LLMs and graph technology.

<!---
That said, most content that I read
are researchy even if they are published by engineers of commercial companies. This is inevitable since the area is so new.
--->

<!---Killer App: RAG for Question Answering Using Enterprise Data--->

The killer application of LLMs that is keeping the database community busy
is Q&A over private enterprise data. Think of a chatbot to which you 
can ask natural language questions ($Q_{NL}$), such as: "Who is our top paying customer from Waterloo?",
or "What are data privacy regulations in Canada we need to comply with?"
and get back natural language answers ($A_{NL}$).
LLMs, out of the box, cannot answer these questions, e.g.,
they never had any access to your sales records. 
Therefore, they need to retrieve or along $Q_{NL}$ be given 
extra information from private data sources of the enterprise.
The high-level view of these systems look like this: 

<div class="img-center">
<img src={QAOverEnterpriseData} width="600"/>
</div>

There is a term that is used for systems that combines traditional 
information retrieval component, e.g., one that looks up some documents from
an index, with a natural language generator component, such as an LLM: 
*retrieval augmented generation* (RAG).
The term is coined in [this paper](https://arxiv.org/pdf/2005.11401.pdf) to refer
to the method of fine-tuning an LLM with additional information. The term was used
in the original paper as "RAG models". Nowadays it is used in a variety of ways, 
such as, "RAG system", "RAG-based system", "RAG does X", or 
"Building RAG with Y". Even systems that simply use an LLM to convert a 
$Q_{NL}$ to SQL or Cypher are called "RAG systems" in some documentations. So the term
has a broader meaning now that encapsulates many Q&A approaches that use an LLM in conjunction with
private data sources.

You can build RAG-based Q&A systems by using structured and/or unstructured
data. In this blog post series I will cover 3 RAG approaches:
1. RAG using structured data: Uses structured records in the enterprise, e.g.,
records stored in relational or graph DBMSs. 
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

$Q_{NL}$ along with the schema of a database is given
to the LLM. Depending on the underlying database, the schema many contain
columnsof relational tables and their descriptions, or labels of nodes and edges
of a graph database. Using $Q_{NL}$ and the database schema, he LLM generates 
a database query, such as SQL or Cypher. The system runs this query against the
DBMS and returns back the query result or using the LLM again, converts 
the query result back to a natural language answer $A_{NL}$.

Let me pause here to appreciate one thing. For many decades, the database community has studied the problem
of converting $Q_{NL}$ to SQL (aka "text-to-SQL"). Here is a good recent [survey paper](https://link.springer.com/article/10.1007/s00778-022-00776-8)
that covers only the deep network-based approaches and [a more extensive survey](https://www.nowpublishers.com/article/Details/DBS-078)
on the broader topic of natural language interfaces to databases.
Neither of these surveys cover any work that that directly use LLMs such as chatGPT, 
which are quite recent developments. Take any of the work covered in these surveys and 
you'll find an approach that requires significant engineering to build the pipline shown in the above figure. 
For example, most of the pre-LLM approaches that use deep learning requires
hard work *to teach a model how to "speak" SQL* using large 
corpuses of tables, such as [WikiSQL](https://arxiv.org/abs/1709.00103) or [Spider](https://github.com/taoyds/spider).
Post-LLM approaches
requires none of this effort because LLMs already speak SQL, Cypher, or SPARQL out of the box.
Instead the hard work now is for developers *to learn how to use the LLM* so that 
LLMs generate correct queries. Instead, building the above pipeline requires much less effort.

Let me be more concrete. If you have been following the area, you will not be surprised to hear that people build 
Q&A systems that convert $Q_{NL}$ to a high-level query language using two common tools:
(i) [Langchain](https://www.langchain.com/); and (ii) [LlamaIndex](https://www.llamaindex.ai/).
To give you a concrete example of how to build the pipeline above especially with these tools, 
let me review the [Kùzu-Langchain integration](https://python.langchain.com/docs/use_cases/graph/graph_kuzu_qa)
(other GDBMSs have identical integrations). You as a programmer have very little to do: you prepare your Kùzu
database `db`, wrap it around a `KuzuGraph`, which implements the commong Graph  a `KuzuQAChain` object in Python:

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
I am following the example application here, which uses a movide database. 
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
My goal is merely to show how easy it is to build the pipelines with existing technology.
That should indeed by highly appreciated. You can develop similar pipelines with many
other GDBMSs. A minor plug here is that Kùzu is embeddable and requires no server set ups
or usernames and password configurations, so if you want to develop variants of these systems 

That however does not mean that LLMs as used
in these pipelines are generating correct queries. Indeed, that is the main question
people are trying to evaluate nowadays. I will 

If you want to develop similar pipelines with RDBMSs, you can use one of these
LangChain's [SQLDatabaseChain]([https://python.langchain.com/docs/use_cases/qa_structured/sql](https://python.langchain.com/docs/use_cases/qa_structured/sql#quickstart)),
LangChain's [SQLAgent](https://python.langchain.com/docs/use_cases/qa_structured/sql#case-3-sql-agents),
LlamaIndex's [NLSQLTableQueryEngine](https://docs.llamaindex.ai/en/stable/examples/index_structs/struct_indices/SQLIndexDemo.html#part-1-text-to-sql-query-engine). In some of these applications, for example, in SQLAgent, you don't necessarily have to provide
your prompth with the schema information. For example, Langchain's SQLAgent will query the database schema by issuing a 'show tables'
query underneath as one of its first actions once it gets a query. Then based on the names of tables, will 
query for the schemas of some of the tables. Finally, based the schemas it read, it will make a decision to generate a SQLQuery.
I could not yet find a similar LangChain agent for GDBMSs, all integrations so far give the schema
explicitly in the prompt but you as the user usually don't if you're using a GDBMSs' integration with 
LangChain or LlamaIndex.

These are common tools to develop many different LLM-based systems including RAG-based ones.
Instead of covering example applications in detail, I will just refer you to a few documentation pages.


I will not cover these in detail but for example, 




As a result, the several post-LLM work I read  
are evaluation-only papers ([1](https://arxiv.org/pdf/2204.00498.pdf), [2](https://arxiv.org/pdf/2311.07509.pdf))
that experiment with LLMs on suites of queries and publish their observations.
In constrast, these papers require much less effort to 
engineer the pipeline in the above figure so there is not much to write about that.


