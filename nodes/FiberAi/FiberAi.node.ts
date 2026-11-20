import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { companyDescription } from './resources/company';
import { contactDescription } from './resources/contact';
import { personDescription } from './resources/person';
import { searchDescription } from './resources/search';

export class FiberAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fiber AI',
		name: 'fiberAi',
		icon: { light: 'file:fiberai.svg', dark: 'file:fiberai.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Search, enrich and find contact details for companies and people with Fiber AI',
		defaults: {
			name: 'Fiber AI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'fiberAiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.fiber.ai',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Person', value: 'person' },
					{ name: 'Search', value: 'search' },
				],
				default: 'search',
			},
			...searchDescription,
			...companyDescription,
			...personDescription,
			...contactDescription,
			...accountDescription,
		],
	};
}
