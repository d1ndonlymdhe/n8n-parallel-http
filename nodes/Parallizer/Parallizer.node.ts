import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Parallizer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Parallizer',
		name: 'parallizer',
		icon: 'file:parallizer.svg',
		group: ['transform'],
		version: 1,
		description: 'Parallize the execution of the workflow',
		defaults: {
			name: 'Parallizer',
		},
		credentials:[
			{
				name: 'parallizerApi',
				required: false,
			},
		],
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Requests',
				name: 'resource',
				type: 'json',
				default: '',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const requests = this.getNodeParameter('resource', 0) as string;
		const parsedRequests = JSON.parse(requests) as {
			url: string;
			body: string;
			method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		}[];
		const returnItems = [];
		for (const _ of items) {
			const results: INodeExecutionData[] = await Promise.all(
				parsedRequests.map(async (req) => {
					return this.helpers.httpRequest({
						url: req.url,
						method: req.method,
						body: req.body,
					});
				}),
			);
			returnItems.push({
				results: results,
			});
		}

		return [this.helpers.returnJsonArray(returnItems)];
	}
}
