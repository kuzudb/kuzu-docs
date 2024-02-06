# Kùzu Documentations

This documentation is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.
The commands below for installation, local development, and build should be run
from the `kuzu-docs` directory after cloning.


### Requirements
Node.js 16.14 or above.

### Installation
```
$ npm i
```

### Local Development
```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build
```
$ npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

A CI pipeline is configured to deploy the documentation to the server. The pipeline is triggered when a commit is pushed to the `main` branch. The CI pipeline will automatically build the documentation and create a pull request in the [kuzudb.github.io repository](https://github.com/kuzudb/kuzudb.github.io). Merging the pull request will automatically deploy the documentation to the server.
