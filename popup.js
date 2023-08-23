document.getElementById('sendMessage').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        document.getElementById("nloading").classList.add("hide");
        document.getElementById("loadingGif").classList.remove("hide");
        chrome.tabs.sendMessage(tabs[0].id, { message: 'hallo' }, function (response) {
            if (response.message == "done") {
                document.getElementById("loadingGif").classList.add("hide");
            }
        });
    });
});
