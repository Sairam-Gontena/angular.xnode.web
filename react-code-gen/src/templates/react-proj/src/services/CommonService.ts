
export class CommonService {
  path = ''

  constructor(path: string) {
    this.path = path;
  }

  getList() {
    return fetch((window as any)._env_.API_URL + "data/" + this.path + ".json")
      .then((res) => {
        return res.json()
      })
      .then((d) => {
        return d.data
      });
  }
}
