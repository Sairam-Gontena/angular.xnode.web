export const environment = {
    name: 'BETA',
    production: false,
    apiUrl: 'https://xnode-us-apim.xnode.ai/',
    apimSubscriptionKey: '64182f1412f74e0fb4402f476e10d567',
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
    xnodeAppUrl: 'https://app-us.xnode.ai/',
    naviAppUrl: 'https://app-navi-us.xnode.ai/',
    designStudioAppUrl: 'https://beta-ui-gen.azurewebsites.net/dashboard/',
    webSocketUrl: 'https://app-notify-us.xnode.ai/',
    webSocketNotifier: 'beta-xnode-notifier',
    branchName: 'beta',
    projectName: 'xnode-beta',
    homeUrl: 'https://xnode.ai/',
    XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
    XNODE_TIMEOUT_PERIOD_SECONDS: 30
}
