---
title: Preloaded RDFGraphs
sidebar_position: 3

---



# Pre-loaded Kùzu RDFGraphs Repository

Below are a few examples of popular RDF datasets that have been imported to Kùzu and readily usable. 
You can download these databases and without any additional setup, start querying them in Cypher with Kùzu. 
Below are the datasets and their several properties. Clicking on the dataset name will start downloading the Kùzu database:

**Note on the Kùzu version:** The below databases have been pre-loaded to work with Kùzu [version 0.2.0](https://github.com/kuzudb/kuzu/releases/tag/v0.2.0).

**Note on sharing databases:** In general, you can share your Kùzu databases with others by zipping the database directory and simply sharing the zip file
and ensuring that both parties use the same Kùzu version.

| Name & Download Link | Description                                                                                                                                         | Database Size<br/>zipped/uncompressed | # Resources | # Literals | # Triples | License                                                                                                                                                                         | Details                                                                                                                                  |                                                                                                                                                                                                         
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|-------------|------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| [DBPedia](s3:xyz)       | Entire DBPedia knowledge graph. See: [here](https://www.dbpedia.org/)                                                                                                              | XX                                   | XX          | XX         | XX        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/) and [GNU Free Doc](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_GNU_Free_Documentation_License). See [here](https://www.dbpedia.org/about/). | XXYY                                                                                                                                     |
| [EWordnet](s3:xyz)      | English Wordnet lexical database. See: [WordNet](https://wordnet.princeton.edu/)                                                                                                   | 68MB/367MB                           | 987816      | 494916     | 2892034   | [CC 4.0](https://creativecommons.org/licenses/by/4.0/)                                                                                                                          | Converted from this [english-wordnet-2023.ttl.gz file](https://en-word.net).                                                             |
| [Geonames](s3:xyz)      | Popular geographical database. See: [here](https://www.geonames.org/)                                                                                                              | 3.7GB/20GB                           | 49213751    | 63882790   | 181846462 | [CC 4.0](https://creativecommons.org/licenses/by/4.0/)                                                                                                                          | Converted from this [all-geonames-rdf.zip file](http://download.geonames.org/all-geonames-rdf.zip).                                      |
| [OpenCyc](s3:xyz)       | Popular common sense knowledge graph.  <br/> See: [Cyc project](https://en.wikipedia.org/wiki/Cyc).                                                                                | 70MB/359MB                           | 608573      | 1083192    | 2413894   | [CC](https://opendefinition.org/licenses/cc-by/)                                                                                                                                | Converted from this [opencyc-latest.owl.gz file](https://old.datahub.io/dataset/opencyc). Skipped 43755 triples with malformed integers. |
| [WKLexemes](s3:xyz)     | [Wikidata](https://www.wikidata.org/wiki/Wikidata:Introduction) lexicographical information. See: [here](https://www.wikidata.org/wiki/Wikidata:Lexicographical_data/Documentation) | 2.5GB/15GB                           | 23477554    | 42780808   | 162821310 | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from this [wikidata-20240209-lexemes-BETA.ttl.gz file](https://dumps.wikimedia.org/wikidatawiki/entities/20240209/).           |
| [YagoSchema](s3:xyz)    | Upper taxonomy, constraints, & property definitions of Yago. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                            | 81KB/16MB                            | 668         | 48         | 1085      | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-schema.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).           |
| [YagoTaxonomy](s3:xyz)  | Full taxonomy of Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                                                              | 7.7MB/50MB                           | 132883      | 0          | 166366    | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-taxonomy.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).         |
| [YagoFacts](s3:xyz)     | Facts about entities that have an English Wikipedia page in Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                   | 4.7GB/31BB                           | 11138914    | 284724159  | 312652091 | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-facts.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/).            |
| [YagoBWk](s3:xyz)       | Facts about entities that do not have an English Wikipedia page in Yago 4.5. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                            | 136GB                                | 89522405          | 1322909879         | 1472516819        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Converted from the yago-beyond-wikipedia.ttl file extracted from this [yago-4.5.0.2.zip file](https://yago-knowledge.org/data/yago4.5/). |
| [Yago](s3:xyz)          | Entire Yago 4.5 knowledge graph. See: [here](https://yago-knowledge.org/downloads/yago-4-5)                                                                                        | XX                                   | XX          | XX         | XX        | [CC 3.0](https://creativecommons.org/licenses/by-sa/3.0/)                                                                                                                       | Union of the above 4 Yago files.                                                                                                         |

The names shown in the first column above are the RDFGraph names the RDFGraphs in Kùzu you will see when you  
download these databases. 

If you would like to see another popular RDF dataset in Kùzu hosted here, please contact us over email
or Discord.

## Getting Started With a Preloaded Kùzu RDFGraph

Below are the instructions for the English Wordnet that is stored as EWordnet RDFGraph. 
The same instructions apply to all other RDFGraphs.

**Download the zip file of the Kùzu database and unzip it.** 

Pick a location to download the Kùzu database. Let `${KZ-DB-BASE-DIR}` be that location. 
Below are the commands
for doing this from your terminal but you can download it to `${KZ-DB-BASE-DIR}` directory 
by clicking on the above link and double clicking on the zip file.
```bash
> cd ${KZ-DB-BASE-DIR}
> wget s3:xyz-e-wordnet-kz.zip
> unzip s3:xyz-e-wordnet-kz.zip
> ls 
e-wordnet
```
You should see the `e-wordnet` directory when you run the `ls` command in `${KZ-DB-BASE-DIR}`.

Now you are ready to query and explore the database in Kùzu. 
Below we show how you query database with [Kùzu CLI](../getting-started/cli.md) but you can also use
[Kùzu Explorer](../kuzuexplorer/index.md) or any of Kùzu's [client libraries](../client-apis/index.md).

**Using the CLI**

Follow the instructions [here](../getting-started/cli#downloading)
to download the CLI compatible with Kùzu [version 0.2.0](https://github.com/kuzudb/kuzu/releases/tag/v0.2.0).
Then run the following command on your shell to start the CLI and issue a query:
```bash
./kuzu ${KZ-DB-BASE-DIR}/e-wordnet
kuzu> MATCH (s:EWordnet_r)-[p:EWordnet]->(o)
      RETURN COUNT(*);
----------------
| COUNT_STAR() |
----------------
| 2892034      |
----------------
```
