Install `node and npm` latest versions on your machine
Install angular-cli globally `npm install -g @angular/cli`
Run `npm i` to install all the dependacies
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`

To load navi-web-lib in local, add navi-web-lib .tgz path in package.json
"navi-web": "file:../../navi-web-lib/dist/navi-web/navi-web-0.0.220.tgz",

Delete/igonre navi-web local path url before pushing your changes to dev.

To connect and test in local
1. Delete/ignore .npmrc file
2. add navi-web-lib .tgz path in package.json
"navi-web": "file:../../navi-web-lib/dist/navi-web/navi-web-0.0.220.tgz",.
3. Next run the NPM install command.

To connect navi-web package hosted on azure artifact
1. Add a .npmrc to your project, in the same directory as your package.json (change registry url of artifact to connect different artifacts)
registry=https://pkgs.dev.azure.com/SalientMinds/xnode/_packaging/NaviWeb_Feed/npm/registry/ 
                        
always-auth=true
2. install vsts-service using this command
npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
3. Then, run vsts-npm-auth to get an Azure Artifacts token added to your user-level .npmrc file
vsts-npm-auth -config .npmrc
4. Next run the NPM install command.

