import { LocalStorageService } from 'src/app/components/services/local-storage.service';

export class CreateAgentModel {
  tabItems: { idx: number; title: string; value: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview' },
    { idx: 1, title: 'Agent Instructions', value: 'agen_instructions' },

    {
      idx: 2,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
    },
    { idx: 3, title: 'Topics', value: 'topic' },
    {
      idx: 4,
      title: 'Prompts',
      value: 'prompt_linked_topic',
    },
    {
      idx: 5,
      title: 'Knowledge',
      value: 'knowledge',
    },
    { idx: 6, title: 'Models', value: 'model' },
    { idx: 7, title: 'Tools', value: 'tool' },
  ];

  activeIndex: number = 0;

  constructor(private storageService: LocalStorageService) {}
}
