---
title: Import Panel
---

The Import Panel allows you to import data into your database from CSV or Parquet files via the UI.
You can create new node/relationship or import data into existing tables via the imported
files. Once you click on the "Import" tab on the top right, you will see the following widget.

<img src="/img/visualization/import-panel-intro.png" />

The requirement is that the files be organized into node and relationship files. Node files
are files that contain data for nodes, and relationship files are files that contain data for relationships.
See the documentation on [importing from files](/import/) to learn about the structure of node and relationship files.
The supported formats for import are CSV and Parquet.

Either drag-drop your desired files into the drop zone, or click "Browse Files" to
multi-select files from your local file system. Once you have selected the files, they will
be inspected for their schema, and if it is valid, you can proceed to the file setup page, as shown
below. Note that you can continue to add more files from the file setup page using the "Add More Files"
button on the top left.

## File setup

Once the file parsing is successful, you will be taken to the file setup page. Once set up, it looks
like the following:

<img src="/img/visualization/import-panel-file-setup.png" />

The key steps in the file setup page are listed below.

### Step 1: Choose node and relationship files

The first step is to specify which files are node files and which are relationship files.

From the above example, we choose the following options from the dropdown on the left of the UI:
- `city.csv`: Node file
- `user.csv`: Node file
- `follows.csv`: Relationship file
- `lives-in.csv`: Relationship file

### Step 2: Specify schema and import options

The schema and import options tell the importer what the structure of the data is and how to import it.
The following table lists some of the options available in the schema and import options:

Option | Type | Description
--- | --- | ---
**Create new table** | Dropdown | Create a new table to import data into
**Use existing table** | Dropdown | Import data into an existing table
**Table name** | Text | Name of the table to import data into
**Primary key** | Dropdown | Column to use as the primary key for a given table

In the example shown, we are importing all data from their respective files into new tables and
setting the tables names as follows:

- `City`: Table name of cities
- `User`: Table name of users
- `Follows`: Table name of the follows relationship between `User` and `User` nodes
- `LivesIn`: Table name of the lives-in relationship between `User` and `City` nodes

The naming convention for node tables is generally to capitalize the first letter, e.g., `City`. For relationship tables,
it's recommended to use capitalized words separated by underscores (e.g., `LIVES_IN`) or `LivesIn`
to clearly separate words in a readable fashion. The naming convention you follow is totally up to
you, but it's recommended to be consistent in your naming across all database tables.

## Import the data

Begin the import by clicking the "Start Import" button on the top of the UI. This will first display
a summary of all the tables that are going to be copied into the database. Click on the "Execute"
button to confirm execution.

Upon success, this will look as follows:

<img src="/img/visualization/import-panel-success.png" />

You can head over to the Schema tab to see the graph schema that was created from the imported data.

<img src="/img/visualization/import-panel-schema.png" />

That's it! You can now begin querying the data by heading over to the query editor in the
[shell panel](/visualization/shell-panel/).

## Troubleshooting

Sometimes, you may encounter errors during the import process. The most common errors are due to
incorrectly specifying the order of the `FROM` and `TO` columns in the relationship files, and
issues with missing or duplicate primary keys in the data. The error messages during import should be
descriptive enough and point you to the source of the issue. The tables that were successfully
imported will be retained in the database, and you can retry the import after fixing the issues.

The following workflow should be helpful in completing the import process:

- Fix the underlying issue with the file that wasn't correctly imported
- Re-import only the pending files that weren't imported successfully into the import UI
- Set up the schema and import options as before
  - Remember to choose "Use existing table" for the table that failed to import earlier
- Click on "Start Import" to re-import the data
- Verify that the data was imported successfully

If you continue to encounter issues that are hard to resolve with the above described import process,
please reach out to us on [Discord](https://kuzudb.com/chat).
