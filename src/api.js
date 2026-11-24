export async function request(url, method = 'GET', body) {
    const response = await fetch(url, {
        method,
        headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body)
    })
    const data = await response.json()
    if (!response.ok || data.status === 'error') {
        throw new Error(data.error || data.message || 'Something went wrong')
    }
    return data
}
