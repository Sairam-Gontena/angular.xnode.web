Install `node and npm` latest versions on your machine
Install angular-cli globally `npm install -g @angular/cli`
Run `npm i` to install all the dependacies
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`

To load navi-web-lib in local, add navi-web-lib .tgz path in package.json
"navi-web": "file:../../navi-web-lib/dist/navi-web/navi-web-0.0.220.tgz",

Update navi-web local path url to registry url before pushing your changes to dev.
"navi-web": "registry=https://pkgs.dev.azure.com/SalientMinds/xnode/_packaging/NaviWeb_Feed/npm/registry/",
