import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            // site: 'https://docs.kuzudb.com',
            favicon: '/src/assets/favicon.ico',
            title: 'Kùzu',
            logo: {
                light: '/src/assets/logo/kuzu-logo.png',
                dark: '/src/assets/logo/kuzu-logo-inverse.png',
                replacesTitle: true,
            },
            social: {
                github: 'https://github.com/withastro/starlight',
                discord: 'https://discord.gg/jw7xN2ZhJB',
                twitter: 'https://twitter.com/kuzudb',
                linkedin: 'https://www.linkedin.com/company/101059770',
                youtube: 'https://youtube.com/@kuzudb',
            },
            customCss: ['./src/styles/custom.css'],
            expressiveCode: true,
            sidebar: [
                {
                    label: 'Home',
                    link: '/',
                },
                {
                    label: 'Install Kùzu',
                    link: '/installation/',
                },
                {
                    label: 'Get started',
                    collapsed: true,
                    items: [
                        { label: 'Query your first graph', link: '/get-started' },
                        // { label: 'Create a database', link: '/get-started/create-database' },
                    ]
                },
                {
                    label: 'Model RDF databases',
                    badge: 'New',
                    collapsed: true,
                    items: [
                        { label: 'Motivation', link: '/rdf-graphs' },
                        { label: 'RDF basics', link: '/rdf-graphs/rdf-basics' },
                        { label: 'Example RDFGraph', link: '/rdf-graphs/example-rdfgraph' },
                        { label: 'Overview & Cypher clauses', link: '/rdf-graphs/rdfgraphs-overview' },
                        { label: 'RDF data import', link: '/rdf-graphs/rdf-import' },
                        { label: 'Preloaded RDFGraphs', link: '/rdf-graphs/rdfgraphs-repo' },
                    ],
                    autogenerate: { directory: 'reference' },
                },
                {
                    label: 'Cypher manual',
                    collapsed: false,
                    items: [
                        { label: 'Overview', link: '/cypher'},
                        { label: 'Data types', link: '/cypher/data-types'},
                        { label: 'Query clauses', link: '/cypher/query-clauses' },
                        { label: 'Functions, expressions & operators', link: '/cypher/expressions' },
                        { label: 'Data definition language (DDL)', link: '/cypher/data-definition' },
                        { label: 'Data manipulation clauses', link: '/cypher/data-manipulation-clauses' },
                        { label: 'Subquery', link: '/cypher/subquery' },
                        { label: 'Macros', link: '/cypher/macro' },
                        { label: 'Transactions', link: '/cypher/transaction' },
                        { label: 'Connection configuration', link: '/cypher/configuration' },
                    ],
                    autogenerate: { directory: 'reference' },
                },
                {
                    label: 'Using client libraries',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/client-libraries/' },
                        { label: 'CLI', link: '/client-libraries/cli' },
                        { label: 'Python', link: '/client-libraries/python' },
                        { label: 'Node.js', link: '/client-libraries/nodejs' },
                        { label: 'Java', link: '/client-libraries/java' },
                        { label: 'Rust', link: '/client-libraries/rust' },
                        { label: 'C++', link: '/client-libraries/cpp' },
                        { label: 'C', link: '/client-libraries/c' },
                        { label: '.NET', link: '/client-libraries/net', badge: { text: 'Community', variant: 'caution'}},
                    ],
                },
                {
                    label: 'Read the blog 🔗',
                    link: 'https://blog.kuzudb.com',
                    attrs: { target: '_blank' },
                },
            ],
            plugins: process.env.CHECK_LINKS
                ? [
                        starlightLinksValidator({
                            errorOnFallbackPages: true,
                            errorOnInconsistentLocale: true,
                        }),
                  ]
                : [],
        }),
    ],
});

