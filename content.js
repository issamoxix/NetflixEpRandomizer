if (location.host == "www.netflix.com") {

    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        await netflixEpRandomizer()
    });

    async function getEpisodes() {
        // https://www.netflix.com/title/70281562
        // https://www.netflix.com/browse?jbv=80176893
        var showId
        var referrer = location.href
        if (window.location.search) {
            var url = new URL(referrer);
            var showId = url.searchParams.get("jbv");
        } else {
            showId = location.pathname.split('/')[2] // 70281562
        }

        var episodes = []


        var reqPath = `path=["videos",${showId},["availability","inRemindMeList","queue"]]&path=["videos",${showId},"seasonList","summary"]&path=["videos",${showId},"seasonList",[0,1,2,3,4,5,6,7,8,9,"current"],"summary"]&path=["videos",${showId},"seasonList","current","episodes","summary"]&path=["videos",${showId},"seasonList","current","episodes",{"from":0,"to":30},["availability","bookmarkPosition","contextualSynopsis","displayRuntime","interactiveBookmark","runtime","summary","title"]]&path=["videos",${showId},"seasonList","current","episodes","current","summary"]&path=["videos",${showId},"seasonList","current","episodes",{"from":0,"to":30},"ancestor","summary"]&path=["videos",${showId},"seasonList","current","episodes",{"from":0,"to":30},"interestingMoment","_342x192","webp"]&authURL=1692472357090.g99DXquCF6Xid5Dl7FvfGe5qHns=`

        var data = await getResponse(reqPath, showId, referrer)
        var sessionsKeys = Object.keys(data.jsonGraph.seasons)
        for (let sessionCode of sessionsKeys) {
            var _reqPath = `path=["seasons",${sessionCode},"episodes",{"from":0,"to":22},["availability","bookmarkPosition","contextualSynopsis","displayRuntime","interactiveBookmark","runtime","summary","title"]]&path=["seasons",${sessionCode},"episodes","current","summary"]&path=["seasons",${sessionCode},"episodes",{"from":0,"to":22},"ancestor","summary"]&path=["seasons",${sessionCode},"episodes",{"from":0,"to":22},"interestingMoment","_342x192","webp"]&authURL=1692556352939.TtDUz6lnSJWuKP8iiecIjx2X2nU=`
            var _data = await getResponse(_reqPath, showId, referrer)
            const videos = _data.jsonGraph.videos
            episodes.push(...Object.values(videos))

        }

        return episodes
    }

    async function getResponse(reqPath, showId, referrer) {
        var response = await fetch("https://www.netflix.com/nq/website/memberapi/v9cd5f768/pathEvaluator?avif=false&webp=true&drmSystem=widevine&isVolatileBillboardsEnabled=true&routeAPIRequestsThroughFTL=false&isTop10Supported=true&isTop10KidsSupported=true&hasVideoMerchInBob=true&hasVideoMerchInJaw=true&persoInfoDensity=false&enableMultiLanguageCatalog=false&falcor_server=0.1.0&withSize=true&materialize=true&original_path=%2Fshakti%2Fmre%2FpathEvaluator", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",

            },
            "referrer": referrer,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": reqPath,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        const data = await response.json()
        return data
    }

    async function netflixEpRandomizer() {

        return (async () => {
            const Episodes = await getEpisodes()
            // Generating random number & picking the episode from arr 
            var randomNumber = Math.floor(Math.random() * Episodes.length + 1)
            var randomEpisode = Episodes[randomNumber]
            window.location.replace(`https://www.netflix.com/watch/${randomEpisode.summary.value.id}`)
            return randomEpisode
        })();

    }

}
