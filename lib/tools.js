/* eslint-disable camelcase */
'use strict'

var domain = process.env.VUE_APP_DOMAIN

export var modules = {}


export async function searchdevice(controler_type = "zwave",devicetype) {
    const url = "http://"+ domain + "/adddevice/"
    const payload =
    {
        method: "POST",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: devicetype })
    }

    const response = await fetch(url, payload)

    const contentType = response.headers.get("content-type");
    let body
    if (contentType && contentType.indexOf("application/json") !== -1) {
        body = await response.json()
        console.log(body)
    } else {
        console.log("Oops, nous n'avons pas du JSON!");
    }

    return body.task_id
}

export async function getallnodes() {

    const url = "http://" + domain + "/nodes/"
    const payload =
    {
        method: "GET",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
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

export async function gettempdata(){
    const url = "http://" + domain +"/tempstat/?nodeuid=2-600-4237-3"
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

    const url = "http://" + domain +"/task/" + uuid
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
            resolve(null)
        }, 30000)
        
    })
    await promise
    return node_id
}


export async function fetchconfig(node_uuid) {
    const url = "http://" + domain +"/getnodeconfig/" + node_uuid
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

export async function sendconfig(config,node_uid) {
    
    const url = "http://" + domain + "/" + node_uid +"/config/"
    const payload =
    {
        method: "POST",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    }

    const response = await fetch(url, payload)

    return

}

export async function fetchcurtainlvl(node_uuid) {
    const url = "http://" + domain +"/curtainlevel/" + node_uuid
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

export async function senddata(data, node_uid) {

    const url = "http://" + domain + "/" + node_uid + "/data/"
    const payload =
    {
        method: "POST",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(url, payload)

    return

}

export async function getallmodules() {

    const url = "http://" + domain + "/modules/"
    const payload =
    {
        method: "GET",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
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

    modules = body

    return body

}


export async function getallports() {

    const url = "http://" + domain + "/usblist/"
    const payload =
    {
        method: "GET",
            cache: "default",
                headers: {
            'Content-Type': 'application/json'
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

export async function setmodule(type, port) {
    var data = {
        type: type,
        port: port
    }

    const url = "http://" + domain + "/addmodule/"
    const payload =
    {
        method: "POST",
        cache: "default",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(url, payload)

    return

}
