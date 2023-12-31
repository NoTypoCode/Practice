(() => {
    const link = document.getElementById('vidurl')
    const btn = document.getElementById('thebtn')
    const body = document.body;

    let currentIframe;

    btn.addEventListener('click', e => {
        e.preventDefault();
        const theurl = link.value;

        //remove old iframe
        removeOldIframe();


        //make the iframe
        let video = document.createElement("iframe");
        video.width = 600;
        video.height = 400;
        video.allowFullscreen = true;

        //make sure there is a link there
        if (link.value === '') return alert("Please enter a URL");

        //change the "watch" youtube link to embed link
        if (link.value.startsWith('https://')) {
            const embedlink = theurl.substring(0, 23);
            const vidid = extractYouTubeVideoId(theurl)
            const fullembed = `${embedlink}/embed/` + vidid;

            //set the iframe source and make the iframe appear on the screen
            video.src = fullembed;
            currentIframe = video;
            document.body.appendChild(video)
        }else{
            video.src = `https://www.youtube.com/embed/`+link.value;
            currentIframe = video;
            document.body.appendChild(video)
        }
        
    })

    //not sure how this works but it does
    function extractYouTubeVideoId(url) {
        var match = url.match(/[?&]v=([^&]+)/);
        return match && match[1] ? match[1] : null;
    }

    //removing the old iframe
    function removeOldIframe() {
        if (currentIframe && currentIframe.parentNode) {
            currentIframe.parentNode.removeChild(currentIframe);
        }
    }

})();