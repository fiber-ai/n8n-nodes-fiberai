# n8n-nodes-fiberai

This is an n8n community node. It lets you use [Fiber AI](https://fiber.ai) in your n8n workflows.

Fiber AI is a B2B data platform for finding companies and people, enriching them, and revealing verified emails and phone numbers.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation and install `n8n-nodes-fiberai`.

## Operations

| Resource | Operation | Fiber endpoint | Cost |
|---|---|---|---|
| Search | Natural Language | `POST /v1/nlp-search/run` | 2 credits per query + 1 per result |
| Search | Companies | `POST /v1/company-search` | per result |
| Search | People | `POST /v1/people-search` | per result |
| Company | Enrich (by domain, LinkedIn URL or name) | `POST /v1/kitchen-sink/company` | 2 credits |
| Person | Enrich (by LinkedIn URL, email, or name + domain) | `POST /v1/kitchen-sink/person` | 2 credits (+2 with live fetch) |
| Contact | Reveal (work email, personal email, phone) | `POST /v1/contact-details/single` | 2 to 5 credits |
| Account | Get Credits | `GET /v1/get-org-credits` | free |

Search results are split into one item per company or person. Turn off **Split Results Into Items** to get the raw response with `nextCursor` / `nextPageToken`, then pass it back in **Options → Next Page Cursor**.

The node is marked `usableAsTool`, so it also works inside n8n AI Agent workflows.

## Credentials

1. Create an API key at [fiber.ai/app/api](https://fiber.ai/app/api). Keys start with `sk_live_`.
2. In n8n, add a **Fiber AI API** credential and paste the key.

The key is sent as the `x-api-key` header. The credential test calls the free credits endpoint.

## Compatibility

Built with `@n8n/node-cli` 0.56 (n8nNodesApiVersion 1).

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Fiber AI API docs for agents](https://api.fiber.ai/llms.txt)
* [Fiber AI operation index](https://api.fiber.ai/ai-docs/index.md)

## Version history

### 0.1.0

First version: search, company and person enrichment, contact reveal, credit balance.
