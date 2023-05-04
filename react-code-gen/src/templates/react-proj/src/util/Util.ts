export const getJSONData = (fileName: string) => {
    return fetch((window as any)._env_.WEB_URL + "config/" + fileName)
        .then((res) => { return res.json() });
}