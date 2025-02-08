---
title: "Rust tutorial: Social Network"
---

This tutorial will get you started using Kùzu's Rust API to analyze a community of users on a social network.

# Rust tutorial:
Please first follow the instructions in our [installation documentation](/installation.mdx) to install kuzu in Rust.

Next, create a directory under the src rust directory called `data`, [download the zipped data](https://rgw.cs.uwaterloo.ca/kuzu-test/tutorial/tutorial_data.zip) and unzip the csvs into the `data` directory.

Replace `main.rs` with the following code snippet:
```Rust
use kuzu::{Connection, Database, Error, SystemConfig};

// We will be using this function to print results to the terminal
fn print_result(result: Vec<Vec<&str>>) {
    for row in result {
        let row_str = row.iter()
            .map(|col| col.to_string())  
            .collect::<Vec<String>>()    
            .join(", ");              

        println!("{}", row_str);
    }
}

fn main() -> Result<(), Error> {
    // This is where our queries will be inputted and executed.

}
```

We are now ready to start the tutorial.

## Creating an instance of the database:
In order to create the graph in Kùzu, we first need to create a new Kùzu database. We do this by using the following commands in Rust:
```Rust
    // Create an empty on-disk database and connect to it
    let db = Database::new("./demo_db", SystemConfig::default())?;
    let conn = Connection::new(&db)?;
```
This will create a database directory called `./demo_db`, where our data will be stored. Kùzu also supports `in-memory mode` in which case the lifetime of the database will be only during the execution of the Rust program.
For more information, please refer to our docs on [Create your first graph](/get-started/index.mdx)

## Creating Tables
The first step in building any Kùzu graph is schema definition. We will define the node and relationships tables as per our desired schema as follows:
```Rust
    conn.query("CREATE NODE TABLE User(user_id INT64 PRIMARY KEY, username STRING, account_creation_date DATE)")?;
    conn.query("CREATE NODE TABLE Post(post_id INT64 PRIMARY KEY, post_date DATE, like_count INT64, retweet_count INT64)")?;
    conn.query("CREATE REL TABLE FOLLOWS(FROM User TO User)")?;
    conn.query("CREATE REL TABLE POSTS(FROM User TO Post)")?;
    conn.query("CREATE REL TABLE LIKES(FROM User TO Post)")?;
```
For more information on the syntax of table creation, please refer to our documentation on [Syntax](/cypher/syntax.md)

## Checking table information
We can check information on the tables we have in the database with the following commands:
```Rust
    let result = conn.query("CALL SHOW_TABLES() RETURN *")?;
```

Alternatively, we can also export the data into csv files for external processing.
``` Rust
    conn.query("COPY (CALL SHOW_TABLES() RETURN *) TO 'tables.csv' (header=true")?;
```
For more information on data exporting, please referring to our documentation on [Export data](/export/index.mdx);

## Importing Data
After creating the tables, we can import the data. We do so by using the `COPY FROM` commands, like this:
```Rust
    conn.query("COPY User FROM './data/tutorial_user.csv'")?;
    conn.query("COPY Post FROM './data/tutorial_posts.csv'")?;
    conn.query("COPY FOLLOWS FROM './data/TUTORIAL_FOLLOWS.csv'")?;
    conn.query("COPY POSTS FROM './data/TUTORIAL_POSTS.csv'")?;
    conn.query("COPY LIKES FROM './data/TUTORIAL_LIKES.csv'")?;
```
For more information on loading in data, please refer to our documentation on  [import data](/import/csv.md)

## Querying queries
We can now proceed to querying the database to answer some questions about the social network. Here are some examples of what queries can be answered with ease using Kùzu:

### Q1: Which user has the most followers? And how many followers do they have?
We can break the query down into a few steps:
1. We can first use the `MATCH` query to find the relationship specified, in this case, we want to look at `User` node at the end of the relation `FOLLOWS`:
```Rust
conn.query("MATCH (u1:User)-[f:FOLLOWS]->(u2:User) RETURN u2.username")?;
```
For more information on `MATCH`, please refer to our documentation in [Cypher Manual](/cypher/index.md).

For each relation `FOLLOWS`, this will return the followee's username of that relation. While this doesn't provide much useful information yet, we may improve on this query by using aggregation.

2. We can then use aggregation function to count the number of appearnces of a followee, by adding `count(u2) as follower_count` to the `RETURN` statement:
```Rust
    let result = conn.query("MATCH (u1:User)-[f:FOLLOWS]->(u2:User) RETURN u2.username, count(u2) as follower_count LIMIT 5")?;
    print_result(result);
```
Which returns:
```
coolwolf752, 3
stormfox762, 5
darkdog878, 6
brightninja683, 5
stormcat597, 2
```
This is a lot more useful! we can now clearly see how many follower each user has.
3. Lastly, we use `ORDER BY` and `LIMIT` to order the usernames by their amount of followers, and return only the first entry. This is the user we are looking for, and how many followers that user has:
```Rust
    let result = conn.query("MATCH (u1:User)-[f:FOLLOWS]->(u2:User) RETURN u2.username, count(u2) as follower_count ORDER BY follower_count DESC LIMIT 1")?;
    print_result(result);
```
Returning:
```
darkdog878, 6
```

### Q2: What is the shortest path between two users?
Another question which we might be interested in answering is finding the shortest path between two users. For example, how many follows does it take to get from user `silentguy245` to `epicwolf202`?
1. We may start off the query with a simple `MATCH` query followed by a `WHERE` query to specify the results we want:
```Rust
    result = conn.query("""
        MATCH p = (u1:user)-[f:FOLLOWS]->(u2:User)
        WHERE u1.username = 'silentguy245' AND u2.username = 'epicwolf202'
        RETURN p;
    """)?;
    print_result(result);
```
This will return us whether `silentguy245` follows `epicwolf202`, which they don't. 
2. We can then build off this query using [recursive match](/cypher/query-clauses/match.md) to find path instead:
```Rust
    result = conn.query("""
        MATCH p = (u1:user)-[f:FOLLOWS* SHORTEST 1..4]->(u2:User)
        WHERE u1.username = 'silentguy245' AND u2.username = 'epicwolf202'
        RETURN p;
    """)?;
    print_result(result);
```
This will return us a result in `RECURSIVE_REL` datatype, which is not as useful to interpret.
3. We will then simplify the result using some [recursive relationship functions](/cypher/expressions/recursive-rel-functions.md)
```Rust
    result = conn.query("""
        MATCH p = (u1:user)-[f:FOLLOWS* SHORTEST 1..4]->(u2:User)
        WHERE u1.username = 'silentguy245' AND u2.username = 'epicwolf202'
        RETURN properties(nodes(p), 'username');
    """)?;
    print_result(result);
```

### Q3: How many 3-hop paths exist between userA and userB that passes through userC?
To answer this query, we should do something similar to Q1. We first match all 3-hop queries:
```Rust
    result = conn.query("""
        MATCH (u1:User)-[f1:FOLLOWS]->(u2:User)-[f2:Follows]->(u3:User)-[f3:FOLLOWS]->(u4:User)
        RETURN count(u4);
    """)?;
    print_result(result);
```
Next, we add to the query to match only cases concerning with userA, userB, and userC. In this case, we want to introduce the idea of perpared statements, so that we can easily swap out elements of the query for other users. We arbitrarily choose userA to be `epicwolf202`, userB to be `stormcat597`, and userC to be `stormfox762`
```Rust
    let u1 = "epicwolf202";
    let u2 = "stormcat597";
    let u3 = "stormfox762";
    let query = format!("""
        MATCH (u1:User)-[f1:FOLLOWS]->(u2:User)-[f2:Follows]->(u3:User)-[f3:FOLLOWS]->(u4:User)
        WHERE u1.username= {}, AND u4.username= {} AND (u2.username= {} OR u3.username= {})
        RETURN count(u4);
    """, u1, u2, u3, u3);
    result = conn.query(query)?;
    print_result(result);
```

In summary, we've shown how to use Kùzu's Rust API to view our data as a graph, query it in Cypher, and output the results in various formats. Try these methods out on your own datasets, and have fun using Kùzu!

Entire `main.rs`:
```Rust
use kuzu::{Connection, Database, Error, SystemConfig};

// We will be using this function to print results to the terminal
fn print_result(result: Vec<Vec<&str>>) {
    for row in result {
        let row_str = row.iter()
            .map(|col| col.to_string())  
            .collect::<Vec<String>>()    
            .join(", ");              

        println!("{}", row_str);
    }
}

fn main() -> Result<(), Error> {
    // This is where our queries will be inputted and executed.
    conn.query("CREATE NODE TABLE User(user_id INT64 PRIMARY KEY, username STRING, account_creation_date DATE)")?;
    conn.query("CREATE NODE TABLE Post(post_id INT64 PRIMARY KEY, post_date DATE, like_count INT64, retweet_count INT64)")?;
    conn.query("CREATE REL TABLE FOLLOWS(FROM User TO User)")?;
    conn.query("CREATE REL TABLE POSTS(FROM User TO Post)")?;
    conn.query("CREATE REL TABLE LIKES(FROM User TO Post)")?;

    // Call Table information
    let result = conn.query("CALL SHOW_TABLES() RETURN *")?;
    print_result(result);
    conn.query("COPY (CALL SHOW_TABLES() RETURN *) TO 'tables.csv' (header=true)")?;

    // Importing Data
    conn.query("COPY User FROM './data/tutorial_user.csv'")?;
    conn.query("COPY Post FROM './data/tutorial_posts.csv'")?;
    conn.query("COPY FOLLOWS FROM './data/TUTORIAL_FOLLOWS.csv'")?;
    conn.query("COPY POSTS FROM './data/TUTORIAL_POSTS.csv'")?;
    conn.query("COPY LIKES FROM './data/TUTORIAL_LIKES.csv'")?;

    // Question 1 query:
    let result = conn.query(
        "MATCH (u1:User)-[f:FOLLOWS]->(u2:User) \
        RETURN u2.username, count(u2) as follower_count \
        ORDER BY follower_count DESC \
        LIMIT 1"
    )?;
    print_result(result);

    // Question 2 query:
    let result = conn.query(
        "MATCH p = (u1:User)-[f:FOLLOWS* SHORTEST 1..4]->(u2:User) \
        WHERE u1.username = 'silentguy245' AND u2.username = 'epicwolf202' \
        RETURN properties(nodes(p), 'username')"
    )?;
    print_result(result);

    // Question 3 query:
    let u1 = "epicwolf202";
    let u2 = "stormcat597";
    let u3 = "stormfox762";
    let query = format!(
        "MATCH (u1:User)-[f1:FOLLOWS]->(u2:User)-[f2:FOLLOWS]->(u3:User)-[f3:FOLLOWS]->(u4:User) \
        WHERE u1.username = '{}' AND u4.username = '{}' AND (u2.username = '{}' OR u3.username = '{}') \
        RETURN count(u4)",
        u1, u2, u3, u3
    );
    let result = conn.query(&query)?;
    print_result(result);
}
```