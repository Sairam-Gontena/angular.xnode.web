import axios from "axios";


export class CommonService {
  path = ''

  constructor(path: string) {
    this.path = path;
  }

  getDummyList() {
    return fetch((window as any)._env_.API_URL + "data/" + this.path + ".json")
      .then((res) => {
        return res.json()
      })
      .then((d) => {
        return d.data
      });
  }

  getList(params: any = {}, path: string = this.path) {
    return axios.get((window as any)._env_.API_URL + path, { params: params })
      .then((res) => {
        return res.data
      });
  }

  post(data: any, path: string = this.path) {
    const headers = {
      // 'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json'
    }
    return axios.post((window as any)._env_.API_URL + path, data, { headers })
      .then((res) => {
        return res.data
      });
  }

  upload(files: any[], data: any = {}, path: string = this.path) {
    const formData = new FormData();
    formData.append('file', files[0])
    const headers = { headers: { 'content-type': 'multipart/form-data' } }
    return axios.post((window as any)._env_.API_URL + path, formData, headers)
      .then((res) => {
        return res.data
      });
  }

  put(data: any, id: any, path: string = this.path) {
    const headers = {
      // 'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json'
    }
    return axios.put((window as any)._env_.API_URL + path + '/' + id, data, { headers })
      .then((res) => {
        return res.data
      });
  }

  delete(id: any, path: string = this.path) {
    return axios.delete((window as any)._env_.API_URL + path + '/' + id)
      .then((res) => {
        return res.data
      });
  }

}
