
export class CommonService {
  path = ''

  constructor(path) {
    this.path = path;
  }

  getList() {
    return fetch(window._env_.API_URL + "data/" + this.path + ".json")
      .then((res) => {
        return res.json()
      })
      .then((d) => {
        return d.data
      });
  }
}
