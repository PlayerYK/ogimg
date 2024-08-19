let strDownloadUrl = "";

/**
 * Split long url
 * @param {string} url - Origin URL
 * @param {number} maxLength - URL max length
 */
function truncateUrl(url, maxLength = 50) {
    let displayUrl = url;

    if (url.length > maxLength) {
        const excessLength = url.length - maxLength;
        const truncateIndex = Math.floor(url.length / 3);
        displayUrl = url.substring(0, truncateIndex) +
            "..." +
            url.substring(truncateIndex + excessLength);
    }

    return displayUrl;
}

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
        const response = await new Promise((resolve) => {
            chrome.tabs.sendMessage(tabs[0].id, "getShareInfo", resolve);
        });
        const { imageUrl, title, description } = response.shareInfo;

        // console.log(imageUrl, title, description);
        document.getElementById("page-title").textContent = title;
        document.getElementById("page-desc").textContent = description;

        document.getElementById("img-tips").textContent = '';

        strDownloadUrl = imageUrl;
        document.getElementById("img-preview").src = imageUrl;
        document.getElementById("img-url").href = imageUrl;

        document.getElementById("img-url").textContent = truncateUrl(imageUrl);
    } catch (error) {
        document.getElementById("img-preview").style.display = "none";
        document.getElementById("img-tips").textContent = 'No image found.'
        console.error(error);
    }
});

document.getElementById("img-preview").onclick = download;

function download() {
    if (strDownloadUrl !== "") {
        chrome.downloads.download({
            url: strDownloadUrl,
            filename: strDownloadUrl.split("/").pop().replace(/\?.*/, '')
        }).catch(err => {
            console.error(err)
        });
    }
}
