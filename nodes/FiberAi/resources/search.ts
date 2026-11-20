import type {
	IDataObject,
	IExecuteSingleFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

const showForSearch = { resource: ['search'] };

// Natural-language search returns either companies or people under output.results.
async function splitNlpResults(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	if (!this.getNodeParameter('splitResults', true)) return items;

	const out: INodeExecutionData[] = [];
	for (const item of items) {
		const output = (item.json.output ?? {}) as IDataObject;
		const results = (output.results ?? {}) as IDataObject;
		const rows = (results.companies ?? results.people ?? []) as IDataObject[];
		for (const row of rows) out.push({ json: row });
	}
	return out;
}

const parseJson = '={{ typeof $value === "string" ? JSON.parse($value) : $value }}';

export const searchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForSearch },
		options: [
			{
				name: 'Natural Language',
				value: 'naturalLanguage',
				action: 'Search with a natural language query',
				description: 'Describe who you are looking for and Fiber turns it into filters',
				routing: {
					request: { method: 'POST', url: '/v1/nlp-search/run' },
					output: { postReceive: [splitNlpResults] },
				},
			},
			{
				name: 'Companies',
				value: 'companies',
				action: 'Search companies with filters',
				description: 'Filter-based company search',
				routing: {
					request: { method: 'POST', url: '/v1/company-search' },
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								enabled: '={{$parameter.splitResults}}',
								properties: { property: 'output.data' },
							},
						],
					},
				},
			},
			{
				name: 'People',
				value: 'people',
				action: 'Search people with filters',
				description: 'Filter-based people search',
				routing: {
					request: { method: 'POST', url: '/v1/people-search' },
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								enabled: '={{$parameter.splitResults}}',
								properties: { property: 'output.data' },
							},
						],
					},
				},
			},
		],
		default: 'naturalLanguage',
	},

	// Natural language
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Senior product managers at Series A fintech startups in New York',
		typeOptions: { rows: 3 },
		displayOptions: { show: { ...showForSearch, operation: ['naturalLanguage'] } },
		routing: { send: { type: 'body', property: 'query' } },
	},

	// Filter-based search
	{
		displayName: 'Search Params (JSON)',
		name: 'searchParams',
		type: 'json',
		required: true,
		default: '{\n  "industriesV2": { "anyOf": ["Software Development"] }\n}',
		description:
			'Filters as JSON. See https://api.fiber.ai/ai-docs/companySearch.md and https://api.fiber.ai/ai-docs/peopleSearch.md for every filter.',
		displayOptions: { show: { ...showForSearch, operation: ['companies', 'people'] } },
		routing: { send: { type: 'body', property: 'searchParams', value: parseJson } },
	},

	// Shared
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 25,
		typeOptions: { minValue: 1, maxValue: 1000 },
		description: 'Results per page. Fiber charges per result returned, so keep this small while testing.',
		displayOptions: { show: showForSearch },
		routing: { send: { type: 'body', property: 'pageSize' } },
	},
	{
		displayName: 'Split Results Into Items',
		name: 'splitResults',
		type: 'boolean',
		default: true,
		description:
			'Whether to output one item per result. Turn off to get the raw response, including the token for the next page.',
		displayOptions: { show: showForSearch },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showForSearch },
		options: [
			{
				displayName: 'Next Page Cursor',
				name: 'nextPageCursor',
				type: 'string',
				default: '',
				description:
					'Value of nextPageToken (natural language) or nextCursor (filter search) from the previous page',
				routing: {
					send: {
						type: 'body',
						property: '={{$parameter.operation === "naturalLanguage" ? "pageToken" : "cursor"}}',
					},
				},
			},
			{
				displayName: 'Company Exclusion List IDs',
				name: 'companyExclusionListIDs',
				type: 'string',
				default: '',
				description: 'Comma-separated exclusion list IDs',
				routing: {
					send: {
						type: 'body',
						property: 'companyExclusionListIDs',
						value: '={{ $value.split(",").map(s => s.trim()).filter(Boolean) }}',
					},
				},
			},
			{
				displayName: 'Detailed Work Experience',
				name: 'getDetailedWorkExperience',
				type: 'boolean',
				default: false,
				description: 'Whether to add employer details to people results (natural language only, slower)',
				routing: { send: { type: 'body', property: 'getDetailedWorkExperience' } },
			},
		],
	},
];
