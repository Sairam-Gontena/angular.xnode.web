export const environment = {
    name: 'DEV',
    production: false,
    apiUrl: 'https://xnode-us-apim-dev.azure-api.net/',
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
    authApiUrl: 'https://dev-xnode-auth-api.azurewebsites.net/',
    conversationApiUrl: 'https://dev-conversation-api.azurewebsites.net/',
    commentsApiUrl: 'https://dev-spec-api.azurewebsites.net/',
    notifyApiUrl: 'https://dev-notify-api.azurewebsites.net/',
    userUtilsApi: 'https://dev-user-util-api.azurewebsites.net/',
    commonApiUrl: 'https://dev-cmn-api.azurewebsites.net/',
    xnodeAppUrl: 'https://dev-xnode.azurewebsites.net/',
    naviAppUrl: 'https://dev-navi-web.azurewebsites.net/',
    designStudioAppUrl: 'https://dev-ui-gen.azurewebsites.net/dashboard/',
    publishApiUrl: 'https://dev-frontend-builder.azurewebsites.net/ui/angular/',
    uigenApiUrl: 'https://dev-frontend-builder.azurewebsites.net/',
    workFlowApiUrl: 'https://dev-xnode-xflows.azurewebsites.net/',
    webSocketUrl: 'https://notify-now.azurewebsites.net',
    webSocketNotifier: 'dev-xnode-notifier',
    branchName: 'dev',
    projectName: 'xnode-dev',
    homeUrl: 'https://dev.xnode.ai/',
    XNODE_IDLE_TIMEOUT_PERIOD_SECONDS: '30 * 60',
    XNODE_TIMEOUT_PERIOD_SECONDS: 30
}
