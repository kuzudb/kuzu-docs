# Schema Panel
If you click on the `Schema` tab on the top right corner of KùzuExplorer, you get to the Schema Panel,
where you can see the existing node and relationship tables in your database in a graph view.
The screenshot below shows the default schema you would see if you loaded the `demo-db` database that is bundled
with KùzuExplorer.

TODO(Semih): Insert the schema-panel.png.

As shown in the figure, the right panel, when you have not clicked on a node or relationship, shows the set of
node and relationship tables under `Node Tables` and `Rel Tables` headings. Let's call this the "main right panel".
In the main right panel, there are two `Add` buttons to add new node and relationship tables. The screenshot below shows the
right panel you would see if you clicked on the `Add` button next to the `Node Tables` heading. In the screenshot,
we are adding a new node table called `Organization` with two properties: (i) a string `name` property; and 
(ii) a date `foundationDate` property.

TODO(Semih): Insert the new-node-table.png

You can also edit the schema of your existing tables, specifically 
add or remove properties from them as follows. When you click on a node or relationship in the 
graph view or the edit icon next to table, the properties of the corresponding table is shown 
in the right panel as shown below. This panel contains buttons to add/remove/rename properties of an existing table.
There is also a `Drop Table` button to drop the entire table. 


TODO(Semih): Insert the table-editing.png
