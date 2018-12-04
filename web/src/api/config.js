export const basePath = 'http://127.0.0.1:7001'

export const headers = new Headers({
    'Content-Type': 'application/json',

})
export const credentials = new Headers({
    // 'credentials': 'include',
})

export const concatParams = function (url, params) {
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' +
            params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return url
}

