import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import fs from "fs";

const site = "https://docs.kuzudb.com";

process.env.ASTRO_TELEMETRY_DISABLED = '1';

// https://astro.build/config
export default defineConfig({
    site,
    integrations: [
        sitemap(),
        starlight({
            favicon: '/img/favicon.ico',
            title: 'Kuzu',
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
                // Basic OG tags
                {
                    tag: 'meta',
                    attrs: { property: 'og:type', content: 'website' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:url', content: site },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:title', content: 'Kuzu - Graph Database' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:description', content: 'Documentation for Kuzu, an open source, embedded graph database' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'og:image', content: site + '/img/og.png' },
                },

                // Twitter specific tags
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:card', content: 'summary_large_image' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'twitter:domain', content: 'docs.kuzudb.com' },
                },
                {
                    tag: 'meta',
                    attrs: { property: 'twitter:url', content: site },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:title', content: 'Kuzu - Graph Database' },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:description', content: 'Documentation for Kuzu, an open source, embedded graph database' },
                },
                {
                    tag: 'meta',
                    attrs: { name: 'twitter:image', content: site + '/img/og.png' },
                },
                // Script
                {
                    tag: "script",
                    attrs: { src: "/reb2b.js", type: "text/javascript", async: true }
                },
            ],
            components: {
                Header: './src/components/overrides/Header.astro',
            },
            sidebar: [
                {
                    label: 'Home',
                    link: '/',
                },
                {
                    label: 'Install Kuzu',
                    collapsed: true,
                    items: [
                        { label: 'Install Kuzu', link: '/installation', },
                        { label: 'System requirements', link: '/system-requirements'},
                    ]
                },
                {
                    label: 'Get started',
                    collapsed: false,
                    items: [
                        { label: 'Create your first graph', link: '/get-started' },
                        { label: 'Query & visualize your graph', link: '/get-started/cypher-intro' },
                        { label: 'Run prepared Cypher statements', link: '/get-started/prepared-statements' },
                        { label: 'Scan data from various sources', link: '/get-started/scan'},
                        { label: 'Run graph algorithms', link: '/get-started/graph-algorithms' },
                    ]
                },
                {
                    label: 'Tutorials',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/tutorials' },
                        { label: 'Cypher', link: '/tutorials/cypher' },
                        { label: 'Python', link: '/tutorials#python' },
                        { label: 'Rust', link: '/tutorials/rust' },
                    ]
                },
                {
                    label: 'Import data',
                    collapsed: true,
                    items: [
                        {
                            label: 'Copy from files/formats',
                            items: [
                                { label: 'Overview', link: '/import' },
                                { label: 'Copy from CSV', link: '/import/csv' },
                                { label: 'Copy from Parquet', link: '/import/parquet' },
                                { label: 'Copy from NumPy', link: '/import/npy' },
                                { label: 'Copy from DataFrame', link: '/import/copy-from-dataframe' },
                                { label: 'Copy from subquery', link: '/import/copy-from-subquery' },
                                { label: 'Copy from JSON', link: '/import/copy-from-json' },
                            ]
                        },
                        { label: 'Merge', link: '/import/merge' },
                    ]
                },
                {
                    label: 'Export data',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/export' },
                        { label: 'Copy to CSV', link: '/export/csv' },
                        { label: 'Copy to Parquet', link: '/export/parquet' },
                        { label: 'Copy to JSON', link: '/export/json'},
                    ]
                },
                {
                    label: 'Migrate your database',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/migrate' },
                    ]
                },
                {
                    label: 'Visualize graphs',
                    collapsed: true,
                    items: [
                        {
                            label: 'Kuzu Explorer',
                            collapsed: true,
                            items: [
                                { label: 'Intro to Kuzu Explorer', link: '/visualization/kuzu-explorer'},
                                { label: 'Query panel', link: '/visualization/kuzu-explorer/query-panel'},
                                { label: 'Schema panel', link: '/visualization/kuzu-explorer/schema-panel' },
                                { label: 'Import panel', link: '/visualization/kuzu-explorer/import-panel' },
                                { label: 'Settings panel', link: '/visualization/kuzu-explorer/settings-panel' },
                            ],
                        },
                        {
                            label: 'Third-party integrations',
                            collapsed: true,
                            items: [
                                { label: 'G.V()', link: '/visualization/third-party-integrations/gdotv', badge: { text: 'New' }},
                                { label: 'yFiles Jupyter Graphs', link: '/visualization/third-party-integrations/yfiles', badge: { text: 'New' }},
                            ],
                        },
                    ],
                },
                {
                    label: 'Cypher manual',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/cypher'},
                        { label: 'Syntax', link: '/cypher/syntax'},
                        { label: 'Data types', link: '/cypher/data-types'},
                        { label: 'Query clauses', link: '/cypher/query-clauses' },
                        { label: 'Functions, expressions, & operators', link: '/cypher/expressions' },
                        { label: 'Data definition language (DDL)', link: '/cypher/data-definition' },
                        { label: 'Data manipulation clauses', link: '/cypher/data-manipulation-clauses' },
                        { label: 'Subqueries', link: '/cypher/subquery' },
                        { label: 'Macros', link: '/cypher/macro' },
                        { label: 'Transactions', link: '/cypher/transaction' },
                        { label: 'Attach/Detach to external databases', link: '/cypher/attach' },
                        { label: 'Configuration', link: '/cypher/configuration' },
                        { label: 'Differences with Neo4j', link: '/cypher/difference' },
                    ],
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
                        { label: 'Go', link: '/client-apis/go' },
                        { label: 'C++', link: '/client-apis/cpp' },
                        { label: 'C', link: '/client-apis/c' },
                        { label: '.NET', link: '/client-apis/net', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Elixir', link: '/client-apis/elixir', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Ruby', link: '/client-apis/ruby', badge: { text: 'Community', variant: 'caution'}},
                        { label: 'Nim', link: '/client-apis/nim', badge: { text: 'Community', variant: 'caution'}},
                    ],
                },
                { label: 'Kuzu-Wasm', link: '/client-apis/wasm' },
                { label: 'Connections & concurrency', link: '/concurrency' },
                {
                    label: 'Developer guide',
                    collapsed: true,
                    items: [
                        { label: 'Build Kuzu from source', link: '/developer-guide' },
                        { label: 'Performance debugging', link: '/developer-guide/performance-debugging' },
                        { label: 'Testing framework', link: '/developer-guide/testing-framework' },
                        { label: 'Join order hints', link: '/developer-guide/join-order-hint' },
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
                    label: 'Extensions',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/extensions'},
                        {
                            label: 'Graph algorithms',
                            collapsed: true,
                            badge: { text: 'New' },
                            items: [
                                { label: 'Overview', link: '/extensions/algo'},
                                { label: 'K-Core decomposition', link: '/extensions/algo/kcore'},
                                { label: 'Louvain', link: '/extensions/algo/louvain'},
                                { label: 'PageRank', link: '/extensions/algo/pagerank'},
                                { label: 'Strongly Connected Components', link: '/extensions/algo/scc'},
                                { label: 'Weakly Connected Components', link: '/extensions/algo/wcc'},
                                { label: 'Shortest path', link: '/extensions/algo/path'},
                            ]
                        },
                        { label: 'HTTPS file system', link: '/extensions/httpfs#https-file-system' },
                        { label: 'External Kuzu databases', link: '/extensions/attach/kuzu' },
                        { 
                            label: 'Cloud storage systems',
                            collapsed: true,
                            items: [
                                { label: 'Amazon S3', link: '/extensions/httpfs#aws-s3-file-system'},
                                { label: 'Google Cloud Storage', link: '/extensions/httpfs#gcs-file-system', badge: { text: 'New' }},
                            ]
                        },
                        { 
                            label: 'Relational databases',
                            collapsed: true,
                            items: [
                                { label: 'PostgreSQL', link: '/extensions/attach/postgres' },
                                { label: 'DuckDB', link: '/extensions/attach/duckdb' },
                                { label: 'SQLite', link: '/extensions/attach/sqlite' },
                            ]
                        },
                        {
                            label: 'Lakehouse formats',
                            collapsed: true,
                            items: [
                                { label: 'Iceberg', link: '/extensions/attach/iceberg' },
                                { label: 'Delta Lake', link: '/extensions/attach/delta' },
                                { label: 'Unity Catalog', link: '/extensions/attach/unity' },
                            ]
                        },
                        { label: 'Full-text search', link: '/extensions/full-text-search' },
                        { label: 'JSON', link: '/extensions/json' },
                        { label: 'Neo4j', link: '/extensions/neo4j', badge: { text: 'New' }},
                        { label: 'Vector search', link: '/extensions/vector'},
                    ],
                },
            ],
            plugins: process.env.CHECK_LINKS
                ? [
                        starlightLinksValidator({
                            errorOnFallbackPages: true,
                            errorOnInconsistentLocale: true,
                            exclude: ['http://localhost:8000'],
                        }),
                  ]
                : [],
            lastUpdated: true,
        }),
    ],
});
