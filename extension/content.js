/**
 * Get page share info
 * @returns {{imageUrl: string, description: string, title: string}}
 */
function getShareInfo() {
    let shareInfo = {
        imageUrl: '',
        title: '',
        description: ''
    };

    // Get share image
    function getShareImage() {
        // 1. Check og:image
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;

        // 2. Check twitter:image
        let twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) return twitterImage.content;

        // 3. Check touch icons
        let touchIcons = [
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]',
            'link[rel="icon"]',
            'link[rel="shortcut icon"]'
        ];

        for (let selector of touchIcons) {
            let icon = document.querySelector(selector);
            if (icon) return icon.href;
        }

        // 4. Check first image on page
        let mainImage = document.querySelector('img[src]');
        if (mainImage) return mainImage.src;

        return '';
    }

    // Get page title
    function getTitle() {
        // 1. Check og:title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) return ogTitle.content;

        // 2. Check twitter:title
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) return twitterTitle.content;

        // 3. Use document.title
        return document.title;
    }

    // get page description
    function getDescription() {
        // 1. Check og:description
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) return ogDesc.content;

        // 2. Check twitter:description
        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) return twitterDesc.content;

        // 3. Check meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) return metaDesc.content;

        return '';
    }

    shareInfo.imageUrl = getShareImage();
    shareInfo.title = getTitle();
    shareInfo.description = getDescription();

    return shareInfo;
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log('content.js request',request)
    // get page info to fill shareInfo
    let shareInfo = getShareInfo();

    if (request === "getShareInfo") {
        // console.log('content.js shareInfo',shareInfo)
        sendResponse({shareInfo});
    }
});