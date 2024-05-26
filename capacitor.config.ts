import type { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment';
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';

const config: CapacitorConfig = {
  appId: environment.mobileApp.appId,
  appName: environment.mobileApp.name,
  webDir: 'dist/xnode',
  bundledWebRuntime: false,
};

const projectConfig: MobileProjectConfig = {
  ios: {
    path: 'ios'
  },
  android: {
    path: 'android'
  }
};
const updateProject = async () => {
  const project = new MobileProject('./', projectConfig);
  await project.load();
  try {

    await project.android?.setAppName(environment.mobileApp.name);
    await project.android?.setPackageName(environment.mobileApp.appId); 
    
    const gradleFile = project.android?.getAppBuildGradle();
    await gradleFile?.setApplicationId(environment.mobileApp.appId);
    await gradleFile?.setNamespace(environment.mobileApp.appId);

    const buildGradle = project.android?.getBuildGradle();
    await buildGradle?.setApplicationId(environment.mobileApp.appId);
    await buildGradle?.setNamespace(environment.mobileApp.appId);

   
  } catch (error) {
    console.log(error);
  }

  try {
    const appTarget = project.ios?.getAppTarget();
    project.ios?.setBundleId(appTarget?.name ?? "App", null, environment.mobileApp.appId);
    await project.ios?.setDisplayName(appTarget?.name ?? "App", null, environment.mobileApp.name);
  } catch (error) {
    console.log(error);
  }
  await project.commit();
}
updateProject().then((result)=>{console.log('updated project')});
export default config;
