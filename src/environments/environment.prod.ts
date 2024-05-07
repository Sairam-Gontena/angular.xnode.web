export const environment = {
    name: 'PROD',
    production: false,
    apiUrl: 'https://xnode-in-apim.azure-api.net/',
    apimSubscriptionKey: '71ea046eccd542ab82e81f9bc7cf2358',
    endpoints: {
        navi: 'navi-api',
        auth: 'auth-api',
        conversation: 'conversations-api',
        spec: 'spec-api/',
        userUtil: 'userutil-api/',
        common: 'common-api',
        naviData: 'navi-data',
        publish: 'ui-gen/ui/angular',
        notification: 'notification-api'
    },
    xnodeAppUrl: 'https://app-in.xnode.ai/',
    naviAppUrl: 'https://prod-navi-web-in.azurewebsites.net/',
    designStudioAppUrl: 'https://prod-ui-gen-in.azurewebsites.net/dashboard/',
    publishApiUrl: 'https://prod-frontend-builder-in.azurewebsites.net/ui/angular/',
    uigenApiUrl: 'https://prod-frontend-builder-in.azurewebsites.net/',
    workFlowApiUrl: 'https://prod-xnode-xflows-in.azurewebsites.net/',
    webSocketUrl: 'https://notify-now-in.azurewebsites.net',
    webSocketNotifier: 'prod-xnode-notifier',
    branchName: 'prod',
    projectName: 'xnode-in',
    homeUrl: 'https://xnode.ai/',
    XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
    XNODE_TIMEOUT_PERIOD_SECONDS: 30
}
