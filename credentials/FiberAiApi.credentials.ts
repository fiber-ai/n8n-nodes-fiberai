import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FiberAiApi implements ICredentialType {
	name = 'fiberAiApi';

	displayName = 'Fiber AI API';

	icon = { light: 'file:../nodes/FiberAi/fiberai.svg', dark: 'file:../nodes/FiberAi/fiberai.dark.svg' } as const;

	documentationUrl = 'https://docs.fiber.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Fiber AI API key (starts with sk_live_). Create one at https://fiber.ai/app/api.',
		},
	];

	// Fiber accepts the key as an x-api-key header on every route.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Free endpoint, safe to hit for a credential check.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.fiber.ai',
			url: '/v1/get-org-credits',
		},
	};
}
