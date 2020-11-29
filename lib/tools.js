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

    return
}

export async function gettempdata(){
    const url = "http://localhost/tempstat/?nodeuid=4-600-4237-3"
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

export async function fetchsynctask(uuid) {
    var polling
    var timeout
    var node_id
    var response

    const url = "http://localhost/task/" + uuid
    const payload =
    {
        method: "GET",
        cache: "default",
        headers: {
            'Accept-Type': 'application/json'
        }
    }
    const interval = 5000;

    let promise = new Promise(async (resolve) => {
        response = await fetch(url, payload)
        response = await response.json()
        if (response && response.status == "Completed") {
            clearTimeout(timeout)
            clearInterval(polling)
            node_id = response.result.node_uid
            resolve(node_id)
        }
        polling = setInterval(async () => {
            response = await fetch(url, payload)
            response = await response.json()
            if (response && response.status == "Completed") {
                clearTimeout(timeout)
                clearInterval(polling)
                node_id = response.result.node_uid
                resolve(node_id)
            }
        }, interval)
        timeout = setTimeout(() => {
            this.spinner = false
            clearInterval(polling)
            alert('no device find')
            resolve(null)
        }, 30000)
        
    })
    await promise
    return node_id
}



