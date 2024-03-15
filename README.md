# Kùzu Documentation

The documentation site is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.
Clone this repo and run the commands below for installation, local development, and building
from the `kuzu-docs` directory.

### Requirements
Node.js 16.14 or above.

### Installation

```bash
$ npm i
```

### Local Development

Start a local development server and opens up a browser window as follows.

```bash
$ npm start
```

Most changes are reflected live without having to restart the server.

### Build

Generate static content into the `build` directory and for serving static content via a hosting service
using the below command.

```bash
$ npm build
```

### Deployment

A CI pipeline is configured to deploy the documentation to the server. The pipeline is triggered
when a commit is pushed to the `main` branch. The CI pipeline will automatically build the
documentation and deploy the documentation to https://docs.kuzudb.com.
