/* eslint-disable camelcase */
'use strict'



export async function searchdevice(controler_type = "zwave") {
    const url = "http://localhost/adddevice/"
    const payload =
    {
        method: "POST",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: "shutter" })
    }

    console.log(payload.body)

    const response = await fetch(url, payload)
    
    /*const contentType = response.headers.get("content-type");
    let body
    if (contentType && contentType.indexOf("application/json") !== -1) {
        body = await response.json()
    } else {
        console.log("Oops, nous n'avons pas du JSON!");
    }*/

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

