---
slug: iamgraphviz
authors: 
  - name: Chris Norman
    title: Common Fate
    url: https://www.linkedin.com/in/chrnorm/?originalSubdomain=uk
    image_url: https://www.commonfate.io/_next/image?url=%2Fheadshots%2Fchris.jpg&w=3840&q=75
  - chang
tags: [use-case]
---
import SchemaImage from './schema.png';
import ReadOnlyVizImage from './readonlyviz.png';

# IAMGraphViz: Visualizing AWS IAM Identity Center Permission Data with Kùzu

## IAMGraphViz Overview

[Common Fate](https://www.commonfate.io/)  is a framework for managing complex cloud permissions. 
They provide tools to simplify access at scale to AWS, Azure, and Google Cloud accounts. 
You can learn about what you can do with Common Fate on the [their website](https://www.commonfate.io/). 
Here, we will talk about a recent proof of concept graph visualization tool called IAMGraphViz that 
[Chris Norman](https://www.linkedin.com/in/chrnorm/?originalSubdomain=uk) from Common Fate, 
who is co-authoring this post with [Chang Liu](https://www.linkedin.com/in/mewim/)), developed using Kùzu! 
IAMGraphViz is intended for infrastructure engineers to dig deep into the permission assignments 
in AWS IAM Identity Center using graph visualization. Using IAMGraphViz, 
one can easily visualize who has what type of access to different accounts on AWS 
as well as how they have access to these accounts. This is all done by analyzing the 
paths from users to accounts in a graph visualization, where the nodes and edges model 
users, accounts, groups, group memberships, Permission Sets and other entities in the 
AWS IAM Identity Center system are shown together.

<!--truncate-->

The IAMGraphViz project is designed and implemented as a web application using a graph DBMS (GDBMS) to store and retrieve data. 
Before landing on Kùzu, we surveyed using several other GDBMSs, such as Neo4j, but they were all harder to use. 
Neo4j, for example, requires hosting a separate database. We then discovered Kùzu, which only required a `pip install` and 
import statement and we could simply embed it into our application. In this project our datasets could fit entirely onto a single compute node,
 and so Kùzu was far simpler for us to work with than alternatives.

The actual IAMGraphViz is more complex than what we will present in this post.
For example, IAMGraphViz has drop down menus, e.g., to select an access level (e.g., `AdministratorAccess`), and enter
an AWS account or a user ID in a text box, and will generate Cypher queries on the fly to generate
visualizations. Instead, this post  follows 
the [Colab](https://colab.research.google.com/drive/1DwiXGKkusdZDkra44ifFaKwdkljBSEDl#scrollTo=PJiBfwhw0QYu) here. 
I demoed IAMGraphViz to Chang Liu from the Kùzu team and he kindly agreed to 
re-create a few similar visualizations on IAMGraphViz using [pyvis](https://pyviz.org/) and a synthethic 
data generator to write this post. And before we go on: IAMGraphViz 
was built as poc and if you're a Common Fate user reading this and would
like this feature launched give your feedback to [me here](mailto:chris@commonfate.io).  So let's get to it!

## Quick AWS IAM Overview

We will use the data model shown in the figure below that faithfully (but partially) models the
core concepts of AWS IAM permission management. Let's first review these concepts, all
of which will be modeled as nodes in Kùzu, as a background.
We will provide as simple definitions as we can to keep the post short and provide links
to necessary AWS IAM documentation: 

<div class="img-center">
<img src={SchemaImage} width="600"/>
</div>

1. **[User](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)** represents a 
user, e.g., an actual human user, who can get access to AWS accounts (and through accounts to AWS resources).

2. **[Group](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)** is a collection of IAM users and lets you specify permissions for multiple users at a time (e.g., you could have a user group called Admins with typical administrator permissions).
To follow the APIs we use, instead of linking Users to Groups through a direct edge, we will do this (a bit redundantly) through a GroupMembership node.

3. **[Account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html#account)**: An AWS account is the basic container for your AWS resources, such as s3 buckets,
Amazon Relational Database Service (Amazon RDS) databases, or Amazon Elastic Compute Cloud instances.
Using multiple AWS accounts is a common practice for many reasons, e.g., providing a natural billing boundary for costs or isolating resources for security. Common Fate customers have hundreds of 
accounts, which is not an extreme.

4. **[IAM Policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)**, and **[ManagedPolicy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html#aws-managed-policies)**: An IAM policy contains permissions for using some AWS resources. An AWS managed policy is a policy with a unique Amazon Resource Name (ARN), e.g., `arn:aws:iam::aws:policy/IAMReadOnlyAccess`, that is administered by AWS. Managed policies are common policies used by many enterprises. Managed policies are simpler to use than writing your custom policies. 
For simplicity, we will only model AWS managed policies in this post.

5. **[PermissionSet](https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html)** is a set of policies that can be attached to users or groups (through AccountAssignments which we explain momentarily). For example, you can create a Database Admin permission set that includes policies for administering Amazon RDS, DynamoDB, and Aurora services, and use that single permission set to grant access to a list of target AWS accounts. Similar to GroupMembership nodes, to follow the APIs we use, instead of linking ManagedPolicy nodes to PermissionSet nodes through a direct edge, we will link them through a ManagedPolicyAttachment node.

6. **[Account Assignment](https://aws.amazon.com/about-aws/whats-new/2020/09/aws-single-sign-on-adds-account-assignment-apis-and-aws-cloudformation-support-to-automate-multi-account-access-management/)**: We will connect user and/or groups to AWS accounts with a specific permission set through an `AccountAssignment` node (see the schema above). 

## Example Visualizations

### Data Generation
In the attached [Colab notebook](https://colab.research.google.com/drive/1DwiXGKkusdZDkra44ifFaKwdkljBSEDl#scrollTo=PJiBfwhw0QYu), we first generate some test data
containing Users, Groups, ManagedPolicies, PermissionSets etc. For simplicity, we assume that there are three fixed groups: "Admins", "Developers", and "Auditors" and three ManagedPolicies: "AdministratorAccess", "PowerUserAccess", and "ReadOnlyAccess". Users, Accounts, 
AccountAssignments, and PermissionSets are randomly generated and we randomly link different nodes to
other nodes according to our schema.

### Visualization 1: Draw all users with direct or indirect `ReadOnlyAccess` access to any account

In our first query, we are given a particular account we would like to investigate and find
all users who have `ReadOnlyAccess` to the resources of any account. The query we use is:
```
MATCH (u:User)<-[l*1..2]-(aa:AccountAssignment)-[l5]->(a:Account),
(aa:AccountAssignment)-[aaps]->(ps:PermissionSet)<-[psmpa]-(mpa:ManagedPolicyAttachment)-[mpap]->(p:ManagedPolicy)
WHERE p.id = 'arn:aws:iam::aws:policy/ReadOnlyAccess'
RETURN *;
```

In the actual IAMGraphViz implementation, we template this query with one parameter for the managed policy, which users pick interactively by selecting from
a dropdown menu.
Note also that the `[:*1..2]` binding is a variable-length path because we want to find
both the direct connections from a `User` to an `AccountAssignment` (that is further connected to
`foobar`) as well as 
indirect connections through a `Group` node. The visualization we generate is shown below:

<div class="img-center">
<img src={ReadOnlyVizImage}/>
</div>


Note the presence of both directly and indirectly connected users to the account.
The visualization in both the actual implementation and the [Colab notebook](https://colab.research.google.com/drive/1DwiXGKkusdZDkra44ifFaKwdkljBSEDl#scrollTo=PJiBfwhw0QYu) is generated simply 
by converting the results of the query into the node and link objects of the graph viz library,
e.g., pyviz in the case of the Colab notebook.

### Visualization 2: Draw all accounts a user has `AdministratorAccess` to

TODO (Chang): Complete in a similar way to Viz 1.

## Closing Words
Many other graph visualizations can be helpful for infrastructure engineers to analyze the 
IAM network of an enterprise. For example, to find inconsistent privileges given to users,
we might want to *find and plot multiple paths from a user to an account with different privileges*.
Or we might want to extend our model with more fine grained resources that are connected to accounts
and analyze paths from users to these resources (see the [PMapper](https://github.com/nccgroup/PMapper) project that models the IAM data in a more detailed way]. The key takeaway is this: graph visualizations can be very powerful to analyze cloud permission data and embedding Kùzu into your applications
to develop tools like IAMGraphViz is extremely easy and fun 🥳🙌💪!
