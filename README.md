Install `node and npm` latest versions on your machine
Install angular-cli globally `npm install -g @angular/cli`
Run `npm i` to install all the dependacies
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`

## navi-web-lib

To load navi-web-lib in local, add navi-web-lib .tgz path in package.json
"navi-web": "file:../../navi-web-lib/dist/navi-web/navi-web-0.0.220.tgz",

Update navi-web local path url to registry url before pushing your changes to dev.
"navi-web": "registry=https://pkgs.dev.azure.com/SalientMinds/xnode/_packaging/NaviWeb_Feed/npm/registry/",
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`

## CONNECT API LOCAL TO LOCAL

To connect api local to local, no changes are required in env file.
we have to replace the actual api url with local api url in perticular \*\*\*-api.service.ts file.

For example, if you want to connect Navi api in local, go to navi-api.service.ts in web repo. In that there is a line start with "return environment.apiUrl +environment.endpoint" in the above. Replace this with your local api url. Then It will point to local api.
