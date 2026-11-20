import type { INodeProperties } from 'n8n-workflow';

const showForPerson = { resource: ['person'] };
const showForLookup = (lookupBy: string) => ({ ...showForPerson, lookupBy: [lookupBy] });

export const personDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForPerson },
		options: [
			{
				name: 'Enrich',
				value: 'enrich',
				action: 'Enrich a person',
				description: 'Look up a person by LinkedIn URL, email, or name and company',
				routing: {
					request: { method: 'POST', url: '/v1/kitchen-sink/person', timeout: 60000 },
				},
			},
		],
		default: 'enrich',
	},
	{
		displayName: 'Lookup By',
		name: 'lookupBy',
		type: 'options',
		default: 'linkedinUrl',
		displayOptions: { show: showForPerson },
		options: [
			{ name: 'LinkedIn URL', value: 'linkedinUrl' },
			{ name: 'Email', value: 'email' },
			{ name: 'Name and Company Domain', value: 'nameAndDomain' },
		],
	},
	{
		displayName: 'LinkedIn URL',
		name: 'linkedinUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://www.linkedin.com/in/williamhgates',
		displayOptions: { show: showForLookup('linkedinUrl') },
		routing: {
			send: {
				type: 'body',
				property: 'profileIdentifier',
				value: '={{ { identifier: "linkedinUrl", value: $value } }}',
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: showForLookup('email') },
		routing: { send: { type: 'body', property: 'emailAddress' } },
	},
	{
		displayName: 'Full Name',
		name: 'personName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. Jane Doe',
		displayOptions: { show: showForLookup('nameAndDomain') },
		routing: { send: { type: 'body', property: 'personName.value' } },
	},
	{
		displayName: 'Company Domain',
		name: 'companyDomain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. fiber.ai',
		displayOptions: { show: showForLookup('nameAndDomain') },
		routing: { send: { type: 'body', property: 'companyDomain.value' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showForPerson },
		options: [
			{
				displayName: 'Live Fetch',
				name: 'liveFetch',
				type: 'boolean',
				default: false,
				description: 'Whether to fetch the profile from LinkedIn in real time. Costs 2 extra credits.',
				routing: { send: { type: 'body', property: 'liveFetch' } },
			},
			{
				displayName: 'Detailed Work Experience',
				name: 'getDetailedWorkExperience',
				type: 'boolean',
				default: false,
				description: 'Whether to add company domain, size and revenue to each job',
				routing: { send: { type: 'body', property: 'getDetailedWorkExperience' } },
			},
			{
				displayName: 'Detailed Education',
				name: 'getDetailedEducation',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'getDetailedEducation' } },
			},
			{
				displayName: 'Max Results',
				name: 'numProfiles',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1, maxValue: 10 },
				description: 'Max number of matches to return',
				routing: { send: { type: 'body', property: 'numProfiles' } },
			},
		],
	},
];
