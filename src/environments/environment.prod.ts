export const environment = {
    name: 'PROD',
    production: false,
    apiUrl: 'https://xnode-in-apim.xnode.ai/',
    apimSubscriptionKey: '71ea046eccd542ab82e81f9bc7cf2358',
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
    xnodeAppUrl: 'https://app-in.xnode.ai/',
    naviAppUrl: 'https://app-navi-in.xnode.ai/',
    designStudioAppUrl: 'https://prod-ui-gen-in.azurewebsites.net/dashboard/',
    webSocketUrl: 'https://app-notify-in.xnode.ai',
    webSocketNotifier: 'prod-xnode-notifier',
    branchName: 'prod',
    projectName: 'xnode-in',
    homeUrl: 'https://xnode.ai/',
    XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
    XNODE_TIMEOUT_PERIOD_SECONDS: 30
}
