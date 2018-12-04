import {
    basePath,
    headers,
    concatParams
} from "./config"
var url = basePath + '/log'
const logApi = {
    init: function () {
        return fetch(url)
    },
    create: function (param) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(param),
            headers,
        })
    },
    modify: function (param) {
        return fetch(url+'/'+param.id, {
            method: 'PUT',
            body: JSON.stringify(param),
            headers,
        })
    },
    remove: function (id) {
        return fetch(url+'/'+id, {
            method: 'DELETE',
            // body: JSON.stringify(param),
            headers,
        })
    }


}



export default logApi