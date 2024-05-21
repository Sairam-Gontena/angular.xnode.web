Install `node and npm` latest versions on your machine
Install angular-cli globally `npm install -g @angular/cli`
Run `npm i` to install all the dependacies
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`

## CONNECT API LOCAL TO LOCAL

To connect api local to local, no changes are required in env file.
we have to replace the actual api url with local api url in perticular \*\*\*-api.service.ts file.

For example, if you want to connect Navi api in local, go to navi-api.service.ts in web repo. In that there is a line start with "return environment.apiUrl +environment.endpoint" in the above. Replace this with your local api url. Then It will point to local api.
