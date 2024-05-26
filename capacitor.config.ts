import type { CapacitorConfig } from '@capacitor/cli';
import { MobileProject, MobileProjectConfig } from '@trapezedev/project';




const env = process.env.NODE_ENV || 'development';
const envConfig = {
  appId: env === 'development' ? 'ai.xnode.sandbox' : 'ai.xnode.xnode',
  appName: env === 'development' ? 'xnodesandbox' : 'xnode'
}


const config: CapacitorConfig = {
  appId: envConfig.appId,
  appName: envConfig.appName,
  webDir: 'dist/xnode',
  bundledWebRuntime: true,
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

    await project.android?.setAppName(envConfig.appName);
    await project.android?.setPackageName(envConfig.appId);

    const gradleFile = project.android?.getAppBuildGradle();
    await gradleFile?.setApplicationId(envConfig.appId);
    await gradleFile?.setNamespace(envConfig.appId);

    const buildGradle = project.android?.getBuildGradle();
    await buildGradle?.setApplicationId(envConfig.appId);
    await buildGradle?.setNamespace(envConfig.appId);


  } catch (error) {
    console.log(error);
  }

  try {
    const appTarget = project.ios?.getAppTarget();
    project.ios?.setBundleId(appTarget?.name ?? "App", null, envConfig.appId);
    await project.ios?.setDisplayName(appTarget?.name ?? "App", null, envConfig.appName);
  } catch (error) {
    console.log(error);
  }
  await project.commit();
}
updateProject().then((result) => { console.log('updated project') });

export default config;
