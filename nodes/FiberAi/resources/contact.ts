import type { INodeProperties } from 'n8n-workflow';

const showForContact = { resource: ['contact'] };

export const contactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForContact },
		options: [
			{
				name: 'Reveal',
				value: 'reveal',
				action: 'Reveal emails and phone numbers for a person',
				description: 'Get work email, personal email and phone for a LinkedIn profile',
				routing: {
					request: { method: 'POST', url: '/v1/contact-details/single', timeout: 120000 },
				},
			},
		],
		default: 'reveal',
	},
	{
		displayName: 'LinkedIn URL',
		name: 'linkedinUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://www.linkedin.com/in/williamhgates',
		description: 'Profile URL, slug, Sales Navigator URN or numeric user ID',
		displayOptions: { show: showForContact },
		routing: { send: { type: 'body', property: 'linkedinUrl' } },
	},
	{
		displayName: 'Get Work Emails',
		name: 'getWorkEmails',
		type: 'boolean',
		default: true,
		displayOptions: { show: showForContact },
		routing: { send: { type: 'body', property: 'enrichmentType.getWorkEmails' } },
	},
	{
		displayName: 'Get Personal Emails',
		name: 'getPersonalEmails',
		type: 'boolean',
		default: false,
		displayOptions: { show: showForContact },
		routing: { send: { type: 'body', property: 'enrichmentType.getPersonalEmails' } },
	},
	{
		displayName: 'Get Phone Numbers',
		name: 'getPhoneNumbers',
		type: 'boolean',
		default: false,
		displayOptions: { show: showForContact },
		routing: { send: { type: 'body', property: 'enrichmentType.getPhoneNumbers' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showForContact },
		options: [
			{
				displayName: 'Validation Patience',
				name: 'patience',
				type: 'options',
				default: 'MEDIUM',
				description: 'How long to wait for email validation. Higher is slower but more accurate.',
				options: [
					{ name: 'Extreme', value: 'EXTREME' },
					{ name: 'High', value: 'HIGH' },
					{ name: 'Low', value: 'LOW' },
					{ name: 'Maximum', value: 'MAXIMUM' },
					{ name: 'Medium', value: 'MEDIUM' },
					{ name: 'Minimum', value: 'MINIMUM' },
				],
				routing: { send: { type: 'body', property: 'patience' } },
			},
			{
				displayName: 'Current Company Domain',
				name: 'companyDomain',
				type: 'string',
				default: '',
				placeholder: 'e.g. openai.com',
				description: 'Work emails that do not match this company go into unmatchedWorkEmails',
				routing: {
					send: {
						type: 'body',
						property: 'company',
						value: '={{ { identifier: "domain", value: $value } }}',
					},
				},
			},
		],
	},
];
