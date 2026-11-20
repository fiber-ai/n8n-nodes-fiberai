import type { INodeProperties } from 'n8n-workflow';

const showForCompany = { resource: ['company'] };
const showForLookup = (lookupBy: string) => ({ ...showForCompany, lookupBy: [lookupBy] });

export const companyDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForCompany },
		options: [
			{
				name: 'Enrich',
				value: 'enrich',
				action: 'Enrich a company',
				description: 'Look up a company by domain, LinkedIn URL or name',
				routing: {
					request: { method: 'POST', url: '/v1/kitchen-sink/company', timeout: 30000 },
				},
			},
		],
		default: 'enrich',
	},
	{
		displayName: 'Lookup By',
		name: 'lookupBy',
		type: 'options',
		default: 'domain',
		displayOptions: { show: showForCompany },
		options: [
			{ name: 'Domain', value: 'domain' },
			{ name: 'LinkedIn URL', value: 'linkedinUrl' },
			{ name: 'Name', value: 'name' },
		],
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. stripe.com',
		displayOptions: { show: showForLookup('domain') },
		routing: { send: { type: 'body', property: 'companyDomain.value' } },
	},
	{
		displayName: 'LinkedIn URL',
		name: 'linkedinUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://www.linkedin.com/company/stripe',
		displayOptions: { show: showForLookup('linkedinUrl') },
		routing: {
			send: {
				type: 'body',
				property: 'companyIdentifier',
				value: '={{ { identifier: "linkedinUrl", value: $value } }}',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Stripe',
		displayOptions: { show: showForLookup('name') },
		routing: { send: { type: 'body', property: 'companyName.value' } },
	},
	{
		displayName: 'Max Results',
		name: 'numCompanies',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1, maxValue: 10 },
		description: 'Max number of matches to return, best match first',
		displayOptions: { show: showForCompany },
		routing: { send: { type: 'body', property: 'numCompanies' } },
	},
];
