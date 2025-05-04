import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ParallizerApi implements ICredentialType {
	name = 'parallizerApi';
	displayName = 'Parallizer API';
	documentationUrl = 'https://www.chatwoot.com/docs/contributing-guide/chatwoot-apis';
	properties: INodeProperties[] = [];
}
