export const agentName = {
    agent: "agent",
    capability: "capability",
    topic: "topic",
    prompt: "prompt",
    knowledge: "knowledge",
    model: "model",
    tool: "tool"
}

/**
 * Stats key Description:
 * 
 * label: To show label on the screen.
 * key: to get the count,
 * count: default count value,
 * value: to get list of all agent/capabilities/topics/prompt.
 * identifier: will be used to identify agent/capability etc all over the application.
 */
export const Constant = {
    dashboard: {
        stats: [{
            label: "Agent",
            imgPath: "../../../assets/agent-hub/agent.svg",
            key: "agent_count",
            count: 0,
            value: 'agents',
            identifier: agentName.agent
        }, {
            label: "Capabilities",
            imgPath: "../../../assets/agent-hub/capabilities.svg",
            key: "capability_count",
            count: 0,
            value: 'capabilities_linked_agents',
            identifier: agentName.capability
        }, {
            label: "Topics",
            imgPath: "../../../assets/agent-hub/topics.svg",
            key: "topic_count",
            count: 0,
            value: "topic",
            identifier: agentName.topic
        }, {
            label: "Prompt",
            imgPath: "../../../assets/agent-hub/prompt.svg",
            key: "prompt_count",
            count: 0,
            value: 'prompt_linked_topic',
            identifier: agentName.prompt
        }]
    },
    agentDetail: {
        stats: [
            {
                label: "Capabilities",
                imgPath: "../../../assets/agent-hub/capabilities.svg",
                key: "capability_count",
                count: 0,
                value: 'capabilities_linked_agents',
                identifier: agentName.capability
            }, {
                label: "Topics",
                imgPath: "../../../assets/agent-hub/topics.svg",
                key: "topic_count",
                count: 0,
                value: "topic",
                identifier: agentName.topic
            }, {
                label: "Prompt",
                imgPath: "../../../assets/agent-hub/prompt.svg",
                key: "prompt_count",
                count: 0,
                value: 'prompt_linked_topic',
                identifier: agentName.prompt
            },

            {
                label: "Knowledge",
                imgPath: "../../../assets/agent-hub/knowledge.svg",
                key: "knowledge_count_count",
                count: 0,
                value: 'prompt_linked_topic',
                identifier: agentName.knowledge
            },

            {
                label: "Model",
                imgPath: "../../../assets/agent-hub/tools.svg",
                key: "model_count",
                count: 0,
                value: 'prompt_linked_topic',
                identifier: agentName.model
            },

            {
                label: "Tools",
                imgPath: "../../../assets/agent-hub/tools.svg",
                key: "tool_count",
                count: 0,
                value: 'prompt_linked_topic',
                identifier: agentName.tool
            },
        ]
    }
}