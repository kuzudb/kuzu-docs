---
title: Preloaded RDFGraphs
sidebar_position: 3
---

# Preloaded RDFGraphs

To make getting started with RDF graphs simpler, we've uploaded ready-made databases for a few
examples of popular RDF datasets that have already been imported to Kùzu.
You can download these databases without any additional setup and start querying them in Cypher with Kùzu. 

**Note on database versions**: The below databases have been preloaded to work with Kùzu [version 0.2.0](https://github.com/kuzudb/kuzu/releases/tag/v0.2.0).
Because Kùzu's storage continually evolves, it's important to use the same version of Kùzu as was used to create the database, in this case, v0.2.0.

:::tip
In general, you can easily share your Kùzu databases with others by zipping the database directory and send them the zip file
via conventional means like object stores or shared drives. All you have to do is to ensure that both parties use the **same** Kùzu version.
:::

## Preloaded RDFGraphs

The names shown in the first column below are the RDFGraph names the RDFGraphs in Kùzu you will see when you  
download these databases.

**Note**: Scroll to the right to see the full table.

<div class="scroll-table">

| Download URL | Description | Database Size<br/>zipped/uncompressed | # Resources | # Literals | # Triples | License                                                                                                                                                                         | Details                                                                                                                                  |                                                                                                                                                                                                         
|:----------------------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|-------------|------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| [DBPedia](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/dbpedia.zip)      | Entire DBPedia knowledge graph. See: [dbpedia.org](https://www.dbpedia.org/)                                                                                       |  25GB/100GB                      | 129037240                                   | 344778409          | 867469010        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/) and [GNU Free Doc](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_GNU_Free_Documentation_License). See [here](https://www.dbpedia.org/about/). | Converted from latest core DBPedia dump on Feb 15-2024 from [here](https://databus.dbpedia.org/dbpedia/collections/latest-core).                                                                                                                                     |
| [EWordnet](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/e-wordnet-kz.zip)     | English Wordnet lexical database. See: [WordNet](https://wordnet.princeton.edu/)                                                                                                   | 68MB/367MB                           | 987816      | 494916     | 2892034   | [CC 4.0](https://creativecommons.org/licenses/by/4.0/)                                                                                                                          | Converted from this [english-wordnet-2023.ttl.gz file](https://en-word.net).                                                             |
| [Geonames](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/geonames-kz.zip)     | Popular geographical database. See: [geonames.org](https://www.geonames.org/)                                                                                                              | 3.7GB/20GB                           | 49213751    | 63882790   | 181846462 | [CC 4.0](https://creativecommons.org/licenses/by/4.0/)                                                                                                                          | Converted from this [all-geonames-rdf.zip file](http://download.geonames.org/all-geonames-rdf.zip).                                      |
| [OpenCyc](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/opencyc-kz.zip)      | Popular common sense knowledge graph. See: [Cyc project](https://en.wikipedia.org/wiki/Cyc).                                                                                | 70MB/359MB                           | 608573      | 1083192    | 2413894   | [CC](https://opendefinition.org/licenses/cc-by/)                                                                                                                                | Converted from this [opencyc-latest.owl.gz file](https://old.datahub.io/dataset/opencyc). Skipped 43755 triples with malformed integers. |
| [WKLexemes](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/wikidata-lexemes-kz.zip)    | Wikidata lexicographical information. See: [here](https://www.wikidata.org/wiki/Wikidata:Lexicographical_data/Documentation) | 2.5GB/15GB                           | 23477554    | 42780808   | 162821310 | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from this [wikidata-20240209-lexemes-BETA.ttl.gz file](https://dumps.wikimedia.org/wikidatawiki/entities/20240209/).           |
| [YagoSchema](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/yago-4.5-schema-kz.zip)   | Upper taxonomy, constraints, & property definitions of Yago. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                            | 81KB/16MB                            | 668         | 48         | 1085      | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-schema.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).           |
| [YagoTaxonomy](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/yago-4.5-taxonomy-kz.zip) | Full taxonomy of Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                                                              | 7.7MB/50MB                           | 132883      | 0          | 166366    | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-taxonomy.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).         |
| [YagoFacts](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/yago-4.5-facts-kz.zip)    | Facts about entities that have an English Wikipedia page in Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                   | 4.7GB/31GB                           | 11138914    | 284724159  | 312652091 | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-facts.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).            |
| [YagoBWk](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/yago-4.5-beyond-wikipedia-kz.zip)      | Facts about entities that do not have an English Wikipedia page in Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                            | 20GB/136GB                                | 89522405          | 1322909879         | 1472516819        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-beyond-wikipedia.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/). |
| [Yago](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/yago-all-kz.zip)         | Entire Yago 4.5 knowledge graph. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                                                        | 25GB/166GB                                   | 99313897          | 1607634086         | 1785336361        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Union of the above 4 Yago files.                                                                                                         |

</div>

To verify your download, please use the MD5 checksums [here](https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/md5.txt).

If you would like to see another popular RDF dataset in Kùzu hosted here, please [email us](mailto:contact@kuzudb.com)
or chat with our team on [Discord](https://discord.gg/jw7xN2ZhJB).

## Getting Started With a Preloaded Kùzu RDFGraph

Below are the instructions for the English Wordnet that is stored as EWordnet RDFGraph. 
The same instructions apply to all other RDFGraphs.

### Download the zip file

Pick a location to download the Kùzu database from. Let `${KZ-DB-BASE-DIR}` be the address of that location. 
The commands for doing this from your terminal are showb below, but you also can download it to `${KZ-DB-BASE-DIR}` directory 
by just clicking on the above link and double clicking on the zip file.

```bash
> cd ${KZ-DB-BASE-DIR}
> wget https://rgw.cs.uwaterloo.ca/kuzu-rdf-database/0.2.0/zips/e-wordnet-kz.zip
> unzip e-wordnet-kz.zip
> ls 
e-wordnet
```

If the download was successful, you should see the `e-wordnet` directory when you run the `ls` command in `${KZ-DB-BASE-DIR}`.

Now you are ready to query and explore the database in Kùzu via Cypher! Below, we show how you
query the database with [Kùzu CLI](../getting-started/cli.md) but you can also use
[Kùzu Explorer](../visualization/index.md) or any of Kùzu's [client libraries](../client-apis/index.md).

### Visualize the data in KùzuExplorer

To get familiar with the database and its schema, you can use KùzuExplorer, our visualization tool.
See the download instructions [here](https://github.com/kuzudb/explorer?tab=readme-ov-file#option-1-using-an-existing-database)
(note that you need Docker installed and running on your machine first).

You can visualize the EWordnet RDFGraph schema from the Explorer by clicking on the "Schema" tab
on the top right.

![](./rdf-wordnet-schema.png)

Run the following query in the editor to see 20 random triples as follows:

```sql
MATCH (s:EWordnet_r)-[p:EWordnet]->(o)
RETURN * LIMIT 20;
```

![](./rdf-wordnet-viz.png)

### Query the database using the CLI

If you prefer to work in the terminal, you can just as well use the Kùzu CLI to query the database.

Follow the instructions [here](../getting-started/cli#downloading)
to download the CLI compatible with Kùzu [version 0.2.0](https://github.com/kuzudb/kuzu/releases/tag/v0.2.0).

First, connect to the downloaded database's directory via the terminal.

```bash
./kuzu ${KZ-DB-BASE-DIR}/e-wordnet
```

Then run the following command on your shell to start the CLI and issue a query:

Display the available tables in the database as follows:

```bash
kuzu> CALL show_tables() return *;
------------------------------------
| name        | type     | comment |
------------------------------------
| EWordnet_r  | NODE     |         |
------------------------------------
| EWordnet_l  | NODE     |         |
------------------------------------
| EWordnet_rt | REL      |         |
------------------------------------
| EWordnet_lt | REL      |         |
------------------------------------
| EWordnet    | RDFGraph |         |
------------------------------------
(5 tuples)
```

You can also run a count query to see the number of triples that match a specific condition:
```bash
kuzu> MATCH (s:EWordnet_r)-[p:EWordnet]->(o)
      RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 2892034      |
----------------
```
