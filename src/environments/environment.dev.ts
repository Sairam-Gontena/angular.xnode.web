export const environment = {
  name: 'DEV',
  production: false,
  apiUrl: 'https://xnode-us-apim-dev.xnode.ai/',
  apimSubscriptionKey: 'dfa5a9e0fbfa43809ea3e6212647dd53',
  endpoints: {
    navi: 'navi-api',
    auth: 'auth-api',
    conversation: 'conversations-api',
    spec: 'spec-api',
    userUtil: 'userutil-api/',
    common: 'common-api',
    naviData: 'navi-data',
    publish: 'ui-gen/ui/angular',
    notification: 'notification-api',
    uiGen: 'ui-gen',
    xflows: 'xflows-api'
  },
  xnodeAppUrl: 'https://dev-xnode.azurewebsites.net/',
  naviAppUrl: 'https://app-navi-in.xnode.ai/',
  designStudioAppUrl: 'https://dev-ui-gen.azurewebsites.net/dashboard/',
  publishApiUrl: 'https://dev-frontend-builder.azurewebsites.net/ui/angular/',
  uigenApiUrl: 'https://dev-frontend-builder.azurewebsites.net/',
  webSocketUrl: 'https://notify-now.azurewebsites.net',
  webSocketNotifier: 'dev-xnode-notifier',
  branchName: 'dev',
  projectName: 'xnode-dev',
  homeUrl: 'https://dev.xnode.ai/',
  XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
  XNODE_TIMEOUT_PERIOD_SECONDS: 30
}
