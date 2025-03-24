// const API_SCRET = "m2erhjzo"
const API_HOST = "http://localhost" //Including Protocol
const API_PORT = 26538
const UPDATE_FREQUENCY = 1000
var songLock = false
let songData



document.querySelectorAll(".pb").forEach(el => {
    el.addEventListener('click', apiLogic)
}
)

async function apiLogic(event_endpoint) {
    const endpoint = typeof (event_endpoint) === "object" ? event_endpoint.target.id : event_endpoint

    switch (endpoint) {
        case "song":
            if (!songLock) {
                try {
                    songLock = true
                    songData = await apiReq("GET", "v1/song")
                    document.querySelector("#silly_p").innerHTML = "You're listening to: <strong>" + songData.title + " - " + songData.artist + "</strong>"
                    document.querySelector("#thumbnail").src = songData.imageSrc
                } finally {
                    songLock = false
                }
            }
            break
        case "toggle-play":
            const playData = await apiReq("POST", "v1/toggle-play")
            console.log(playData)
            break
        case "previous":
            const songPrevious = await apiReq("POST", "v1/previous")
            console.log(songPrevious)
            break
        case "next":
            const songNext = await apiReq("POST", "v1/next")
            console.log(songNext)
            break
        case "like":
            const songLike = await apiReq("POST", "v1/like")
            console.log(songLike)
            break
        case "dislike":
            const songDislike = await apiReq("POST", "v1/dislike")
            console.log(songDislike)
            break
        case "search":
            const body = JSON.stringify({ "query": "Condemned Stain the canvas" })
            const songSearch = await apiReq("POST", "v1/search", body)
            for (const [searchCategorieIndex, searchCategorieObject] of songSearch.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.entries()) {
                if (searchCategorieIndex == 0) {
                    console.log(searchCategorieObject.musicCardShelfRenderer.title.runs[0].navigationEndpoint.watchEndpoint.videoId)
                    let fullArtist = ""
                    for (const part of searchCategorieObject.musicCardShelfRenderer.subtitle.runs.slice(2, -2)) {
                        fullArtist += part.text
                    }
                    console.log(fullArtist)
                    console.log(searchCategorieObject.musicCardShelfRenderer.title.runs[0].text)
                } else if (searchCategorieIndex == 1) {
                    for (const [songIndex, songObject] of searchCategorieObject.musicShelfRenderer.contents.entries()) {
                        console.log(songObject.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.watchEndpoint.videoId)
                        //console.log(songSearch.contents.tabbedSearchResultsmusicResponsiveListItemFlexColumnRendererRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[1].musicShelfRenderer.contents[0].musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.watchEndpoint.videoId)
                        console.log(songObject.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text)
                        console.log(songObject.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text)
                        console.log(songObject.musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text)
                        songIndex
                    }
                }
            }
            break

        default:
            throw new Error("Invalid button")
    }
}

async function apiReq(method, path, body) {
    let dataJson
    let dataResponse
    switch (method) {
        case "GET":
            dataResponse = await fetch(`${API_HOST}:${API_PORT}/api/${path}`, {
                body: body,
                signal: AbortSignal.timeout(500)
            })
            dataJson = dataResponse.statusText === "No Content" ? {} : await dataResponse.json()
            return (dataJson)

        case "POST":
            dataResponse = await fetch(`${API_HOST}:${API_PORT}/api/${path}`, {
                method: "POST",
                body: body,
                signal: AbortSignal.timeout(5000),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            dataJson = dataResponse.statusText === "No Content" ? {} : await dataResponse.json()
            return (dataJson)

        case "PATCH":

        case "DELETE":

        default:
            throw new Error("Invalid method")
    }
}

setInterval(() => apiLogic("song"), UPDATE_FREQUENCY);
