import { AIMessage, HumanMessage } from "@langchain/core/messages";

export function deserializeMessagesToAISDK(langggraphMessages) {
	return langggraphMessages.map((m: any) => {
		let role = "assistant";
		if (m instanceof HumanMessage) {
			role = "user";
		}

		return {
			id: m.id,
			role,
			content: m.content,
		};
	});
}
