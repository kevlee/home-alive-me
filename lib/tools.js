/* eslint-disable camelcase */
'use strict'



export function searchdevice(controler_type = "zwave") {
    console.log('inside zwave add device')
    return
}

export async function gettempdata(){
    const url = "http://localhost/tempstat/?nodeuid=600-4237-3"
    const payload =
    {
        method: "GET",
        cache: "default",
        headers: {
            'Accept-Type': 'application/json'
        }
    }

    const response = await fetch(url, payload)
    const contentType = response.headers.get("content-type");
    let body
    if (contentType && contentType.indexOf("application/json") !== -1) {
        body = await response.json()
    } else {
        console.log("Oops, nous n'avons pas du JSON!");
    }

    return body

}

