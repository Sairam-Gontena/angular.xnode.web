export const environment = {
    name: 'DEV',
    production: false,
    apiUrl: 'https://xnode-us-apim-dev.xnode.ai/',
    apimSubscriptionKey: 'dfa5a9e0fbfa43809ea3e6212647dd53',
    endpoints: {
        navi: 'navi-api/',
        auth: 'auth-api/',
        conversation: 'conversations-api/',
        spec: 'spec-api/',
        userUtil: 'userutil-api/',
        common: 'common-api/',
        naviData: 'navi-data/',
        publish: 'ui-gen/ui/angular',
        notification: 'notification-api/',
        uiGen: 'ui-gen/',
        xflows: 'xflows-api/',
        translate: 'translator-api/'
    },
    xnodeAppUrl: 'http://localhost:4200/',
    naviAppUrl: 'https://app-navi-us-dev.xnode.ai/',
    designStudioAppUrl: 'http://localhost:4201/dashboard/',
    webSocketUrl: 'https://notify-now.azurewebsites.net/',
    webSocketNotifier: 'dev-xnode-notifier',
    branchName: 'dev',
    projectName: 'xnode-dev',
    homeUrl: 'https://dev.xnode.ai/',
    XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
    XNODE_TIMEOUT_PERIOD_SECONDS: 30,
    speechServiceKey: '32265e321fc94997abb436f9a835633e',
    serviceRegion: 'eastus',
    translateServiceKey: '2237ae1e061542378d28638ea98492e6',
    NAVI_IDLE_TIMEOUT_PERIOD_MILLISECONDS: '30 * 60 * 60 * 1000',
    SPEECH_SDK_TOKEN_REFRESH_TIME_MILLISECONDS: '15 * 60 * 1000',
    defaultPerPageLimit: 10
}
