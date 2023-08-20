document.getElementById('sendMessage').addEventListener('click', function () {
    document.getElementById("loadingGif").classList.remove("hide");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "hallo" });
    });
});

