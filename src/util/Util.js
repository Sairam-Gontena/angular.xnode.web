export const getJSONData = (fileName) => {
    return fetch(window._env_.API_URL + "config/" + fileName)
        .then((res) => { return res.json() });
}