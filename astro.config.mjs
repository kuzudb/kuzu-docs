import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const site = 'https://docs.kuzudb.com';

// https://astro.build/config
export default defineConfig({
    site: site,
    integrations: [
        sitemap(),
        starlight({
            favicon: '/src/assets/favicon.ico',
            title: 'Kùzu',
            logo: {
                light: '/src/assets/logo/kuzu-logo.png',
                dark: '/src/assets/logo/kuzu-logo-inverse.png',
                replacesTitle: true,
            },
            social: {
                github: 'https://github.com/kuzudb/kuzu',
                discord: 'https://discord.gg/jw7xN2ZhJB',
                twitter: 'https://twitter.com/kuzudb',
                linkedin: 'https://www.linkedin.com/company/101059770',
                youtube: 'https://youtube.com/@kuzudb',
            },
            editLink: {
                baseUrl: 'https://github.com/kuzudb/kuzu-docs/edit/main',
            },
            customCss: ['./src/styles/custom.css'],
            expressiveCode: true,
            head: [
                {
                    tag: 'meta',
                    attrs: { property: 'og:image', content: site + '/og.png' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'twitter:image', content: site + '/og.png' },
                },
            ],
            sidebar: [
                {
                    label: 'Home',
                    link: '/',
                },
                {
                    label: 'Install Kùzu',
                    link: '/installation',
                },
                {
                    label: 'Get started',
                    collapsed: false,
                    items: [
                        { label: 'Create your first graph', link: '/get-started' },
                        { label: 'Query & visualize your graph', link: '/get-started/cypher-intro' },
                        { label: 'Run graph algorithms', link: '/get-started/graph-algorithms' },
                    ]
                },
                {
                    label: 'Visualize graphs',
                    link: '/visualization',
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
                    label: 'Use client APIs',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/client-apis/' },
                        { label: 'CLI', link: '/client-apis/cli' },
                        { label: 'Python', link: '/client-apis/python' },
                        { label: 'Node.js', link: '/client-apis/nodejs' },
                        { label: 'Java', link: '/client-apis/java' },
                        { label: 'Rust', link: '/client-apis/rust' },
                        { label: 'C++', link: '/client-apis/cpp' },
                        { label: 'C', link: '/client-apis/c' },
                        { label: '.NET', link: '/client-apis/net', badge: { text: 'Community', variant: 'caution'}},
                    ],
                },
                {
                    label: 'Tutorials',
                    link: '/tutorials',
                },
                {
                    label: 'Cypher manual',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/cypher'},
                        { label: 'Data types', link: '/cypher/data-types'},
                        { label: 'Query clauses', link: '/cypher/query-clauses' },
                        { label: 'Functions, expressions & operators', link: '/cypher/expressions' },
                        { label: 'Data definition language (DDL)', link: '/cypher/data-definition' },
                        { label: 'Data manipulation clauses', link: '/cypher/data-manipulation-clauses' },
                        { label: 'Subquery', link: '/cypher/subquery' },
                        { label: 'Macros', link: '/cypher/macro' },
                        { label: 'Transactions', link: '/cypher/trnpm ansaction' },
                        { label: 'Connection configuration', link: '/cypher/configuration' },
                    ],
                    autogenerate: { directory: 'reference' },
                },
                {
                    label: 'Developer guide',
                    collapsed: true,
                    items: [
                        { label: 'Build Kùzu from source', link: '/developer-guide' },
                        { label: 'Performance debugging', link: '/developer-guide/performance-debugging' },
                        { label: 'Testing framework', link: '/developer-guide/testing-framework' },
                        { 
                            label: 'Database internals',
                            items: [
                                { label: 'Overview', link: '/developer-guide/database-internal' },
                                { label: 'Data types', link: '/developer-guide/database-internal/datatype' },
                                { label: 'Vector types', link: '/developer-guide/database-internal/vector' },
                                { label: 'Execution', link: '/developer-guide/database-internal/execution' },
                            ]
                        }
                    ]
                },
                {
                    label: 'System requirements',
                    link: '/system-requirements',
                },
                {
                    label: 'Extensions',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/extensions'},
                        { label: 'httpfs (HTTP File System)', link: '/extensions/httpfs'},
                    ],
                    autogenerate: { directory: 'reference' },
                },
                {
                    label: 'Read our blog 🔗',
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
            lastUpdated: true,
        }),
    ],
});

