import { agentName } from "src/app/pages/agent-hub/agent-hub.constant"

interface AgentHubFormConstants {
  [key: string]: {
    [key: string]: {
      controls: {
        name: string;
        label: string;
        placeholder: string;
        value: string;
        type: string;
        validators: {
          required: boolean;
          minLength?: number;
        };
      }[];
    };
  };
}
export const AgentHubFormConstant: AgentHubFormConstants = {
  [agentName.topic]: {
    instruction: {
      controls: [
        {
          name: "Instructions",
          label: "Instructions",
          placeholder: "Enter Instruction",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },
        {
          name: "Guideline",
          label: "Guideline",
          placeholder: "Enter Guidelines",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },
        {
          name: "Responsibilities",
          label: "Responsibilities",
          placeholder: "Enter Responsibilities",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },

        {
          name: "Context",
          label: "Context",
          placeholder: "Enter Context",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },

        {
          name: "Example",
          label: "Example",
          placeholder: "Enter Example",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },
      ]
    },

    overview: {
      controls: [
        {
          name: "name",
          label: "name",
          placeholder: "Enter Name",
          value: "",
          type: "text",
          validators: {
            required: true,
            minLength: 200
          }
        },
        {
          name: "description",
          label: "description",
          placeholder: "Enter Description",
          value: "",
          type: "textarea",
          validators: {
            required: true,
            minLength: 200
          }
        },
        {
          name: "parent_topic",
          label: "Parent Topic",
          placeholder: "Enter Topic",
          value: "",
          type: "text",
          validators: {
            required: true,
            minLength: 200
          }
        },
      ]
    }
  },
  // [agentName.prompt]: {
  //   overview: {
  //     controls: [
  //       {
  //         name: "name",
  //         label: "Name",
  //         placeholder: "Enter Name",
  //         value: "",
  //         type: "text",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "description",
  //         label: "Description",
  //         placeholder: "Enter Description",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "parent_topic",
  //         label: "Parent Topic",
  //         placeholder: "Enter Parent",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       }
  //     ]
  //   },
  //   instruction: {
  //     controls: [
  //       {
  //         name: "instructions",
  //         label: "Instructions",
  //         placeholder: "Enter Instructions",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "guideline",
  //         label: "Guideline",
  //         placeholder: "Enter Guideline",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "responsibilties",
  //         label: "Responsibilities",
  //         placeholder: "Enter Responsibilities",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "context",
  //         label: "Context",
  //         placeholder: "Enter context",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //       {
  //         name: "example",
  //         label: "Example",
  //         placeholder: "Enter Example",
  //         value: "",
  //         type: "textarea",
  //         validators: {
  //           required: true,
  //           minLength: 200
  //         }
  //       },
  //     ]
  //   }
  // }
}