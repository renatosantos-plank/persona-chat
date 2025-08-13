import { AIMessage, HumanMessage } from "@langchain/core/messages";

export function deserializeMessagesToAISDK(langggraphMessages) {
	return langggraphMessages.map((m: any) => {
		let role = null;
		if (m instanceof HumanMessage) {
			role = "user";
		} else if (m instanceof AIMessage) {
			role = "assistant"
		}

		let agentName = null
		if (m.additional_kwargs?.agent) {
			agentName = m.additional_kwargs.agent
		} 

		return {
			id: m.id,
			role,
			content: m.content,
			agentName: agentName
		};
	});
}
