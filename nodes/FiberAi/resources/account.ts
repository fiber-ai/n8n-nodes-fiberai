import type { INodeProperties } from 'n8n-workflow';

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get Credits',
				value: 'getCredits',
				action: 'Get credit balance',
				description: 'Get the remaining credit balance for your organization (free)',
				routing: { request: { method: 'GET', url: '/v1/get-org-credits' } },
			},
		],
		default: 'getCredits',
	},
];
