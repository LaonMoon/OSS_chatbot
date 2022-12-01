const https = require('https')

function create(event, texts) {
    let messages = []
    for (let text of texts) {
        const message = {
            "type": "text",
            "text": text
        }
        messages.push(message)
    }
    const dataString = JSON.stringify({
        replyToken: event.replyToken,
        messages: messages
    })

    // Request header
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + 'n/FsngKwPgrLhglag8dqI994iPBAFGlWAZ049Hiq1F5tsguZbDxksyWj3zskC0TFsCOCGraTNp0yg7YLdTm+wOZeDuUKNuu/2Xvz9azWjqMyKy3t+68MjDEK50ytYmjcQFImAvBJ5hC1ZayLOqHcSwdB04t89/1O/w1cDnyilFU='
    }

    // Options to pass into the request
    const webhookOptions = {
        "hostname": "api.line.me",
        "path": "/v2/bot/message/reply",
        "method": "POST",
        "headers": headers,
        "body": dataString
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
            process.stdout.write(d)
        })
    })

    // Handle error
    request.on("error", (err) => {
        console.error(err)
    })

    return {request: request, dataString: dataString}
}

function send(request, dataString) {
    request.write(dataString)
    request.end()
}

module.exports.create = create
module.exports.send = send