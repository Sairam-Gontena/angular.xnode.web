import type { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig;


const baseConfig: CapacitorConfig = {
  appId: 'ai.xnode.xnode',
  appName: 'xnode',
  webDir: 'dist/xnode',
  bundledWebRuntime: false
};

switch (process.env.NODE_ENV) {
  case 'prod':
    config = {
      ...baseConfig,
      ios: {
        scheme: 'App',
      },
      android: {
        flavor: 'dev',
      },
    };
    break;
  default:
    config = {
      ...baseConfig,
      ios: {
        scheme: 'App QA',
      },
      android: {
        flavor: 'qa',
      },
    };
    break;
}


export default config;
