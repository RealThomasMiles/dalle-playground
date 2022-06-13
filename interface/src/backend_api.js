import JsonBigint from "json-bigint";

const REQUEST_TIMEOUT_SEC = 60000

export async function callDalleService(text) {
    const queryStartTime = new Date()
    const response = await Promise.race([
        (await fetch(`https://bf.dallemini.ai/generate`, {
                method: 'POST',
                mode: 'cors',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt: text})
            }
        ).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response
        })).json(), new Promise((_, reject) => setTimeout(
            () => reject(new Error('Timeout')), REQUEST_TIMEOUT_SEC))
    ]);

    console.log(response)
    return {
        'executionTime': Math.round(((new Date() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100,
        'generatedImgs': response["images"]
    }
}

export async function checkIfValidBackend(backendUrl) {
    return await fetch(backendUrl, {
        headers: {
            'Bypass-Tunnel-Reminder': "go",
            'mode': 'no-cors'
        }
    }).then(function (response) {
        return true
    }).catch(() => {
        return false
    })
}
