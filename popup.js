chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    
    // document.addEventListener('contextmenu', function(e) {
    //     e.preventDefault();
    //   });
    // let tabincog = tabs[0].incognito

    // Variables that are global and used within multiple functions
    let urlArray = []; // List of urls in an array (var declaration)
    let storageObject = {}; // List of values to be set in local storage, for eg: title: "Duckduckgo" (var declaration)
    let url = tabs[0].url; // url of the current tab (var declaration)
    let title = tabs[0].title; // title of the current tab (var declaration)
    let favicon = "" // favicon from the tab (var declaration)

    // code for error handling when the favicons cannot load when its offline (only few exceptional cases)

    window.addEventListener('error', (e) => {
        let offLineErrorLink = e.path[1].childNodes[3].getAttribute("href")
        if (true) {
            e.path[1].childNodes[1].remove()
            e.path[1].childNodes[2].insertAdjacentHTML("beforeBegin", `<i class="fa fa-chrome offlinechrome" aria-hidden="true" title="${offLineErrorLink}"></i>`)
        }
    }, true);

    // main function starts where the core logic lies
     let gettabs = async () => {

        // awaiting till we get the favicon and running asynchronously

        favicon = await tabs[0].favIconUrl;
        let listOfBM = document.querySelector(".list"); // list of Bookmarks
        let addbm = document.querySelectorAll(".addbm");
        addbm.forEach((loop) => // looping for all the html classes with .addbm which means add bookmarks
            loop.addEventListener("click", () => {
                let classtohide = document.querySelectorAll(".addbm");
                document.querySelector(".sticky").style.display = "none";
                for (let i = 0; i < classtohide.length; i++) {
                    classtohide[i].style.display = "none";
                } // looping to hide add bookmark tabs after adding current url
                
                listOfBM.innerHTML = "";

                // if the urlArray doesn't include the current url then push the current url to urlArray
                if (!urlArray.includes(url)) {
                    urlArray.push(url);

                    // looping and assigning the values to the key. Keys are here the urls and values are object of data related to it

                    for (let i = 0; i < urlArray.length; i++) {
                        // localStorage.setItem(urlArray[i], urlArray[i]);
                        let d = new Date();
                        storageObject.value = urlArray[i];
                        storageObject.timestamp = d.getTime();
                        storageObject.title = title;
                        storageObject.favicon = favicon;
                        localStorage.setItem(urlArray[i], JSON.stringify(storageObject));
                        getlink(); // calling getlink for how to sort the list
                    }
                }
            })
        );

        // getlink gets the keys and its associated values, sorts them and lists them in the <ul> which is listOfBM here
        // getlink func also handles the tasks of editing and deleting
        
        let getlink = () => { 
            // storing the keys from local storage to the array newKeyArr
            let newKeyArr = [];
            for (let j = 0, len = localStorage.length; j < len; ++j) {
                newKeyArr.push(localStorage.getItem(localStorage.key(j)));
            }
            // after getting the string object from local storage, now converting it into object from string
            let webvaluesObj = []; // values as object from all the Bookmarked websites
            for (let k = 0; k < newKeyArr.length; k++) {
                let newj = JSON.parse(newKeyArr[k]);
                webvaluesObj.push(newj);
            }
            // sorting the array date wise so when the user clicks add new bookmark then its listed at the end of the list
            webvaluesObj.sort((a, b) => a.timestamp - b.timestamp);
            let webTitle = ""
            let newfavicon = ""

            // looping to check if there is no favicon stored and what to show if not as the favicon of the url, the default I used here is Chrome
            for (let l = 0; l < webvaluesObj.length; l++) {
                if (webvaluesObj[l].favicon) {
                    newfavicon = `<img class="faviconimg" src="${webvaluesObj[l].favicon}" title="${webvaluesObj[l].value}">`
                } else {
                    newfavicon = `<i class="fa fa-chrome" aria-hidden="true" title="${webvaluesObj[l].value}"></i>`
                }

                // checking if the title is too long, if it is then showing only limited characters

                webTitle = webvaluesObj[l].title;
                webTitle = webTitle.substr(0, 60);
                if (webTitle.length > 59) {
                    webTitle += "...";
                }
                // listing all the bookmarks inside ul
                listOfBM.innerHTML += `${l + 1} : <li>
                <div class="liclass">
                ${newfavicon}
                <a href="${webvaluesObj[l].value}" title="${webvaluesObj[l].value}" class="bm-list" target="_blank">${webTitle}</a></div><div class="show popup"><span class="edit"><i class="fa fa-pencil-square-o" title="Edit Title" aria-hidden="true"></i></span> / <span class="delete"><i class="fa fa-trash" title="Delete" aria-hidden="true"></i></span></div></li>
                <hr>`;
                // let aTagElement = document.querySelectorAll("a")
                // aTagElement.forEach((loop) =>
                //     loop.addEventListener("click", function () {
                //         chrome.windows.create({ "url": webvaluesObj[l].value, "incognito": tabincog });
                //     })
                // )
            }

            // if the current tab url is in the list of stored bookmarks then add bookmarked icon and hide add bookmark section
            for (let m = 0; m < webvaluesObj.length; m++) {
                if (webvaluesObj[m].value == url) {
                    document.querySelector(".thumbtag").innerHTML = `<i title="Bookmarked" class="fa fa-thumb-tack" aria-hidden="true" style="display: block;"></i>`
                    let classtohide = document.querySelectorAll(".addbm");
                    document.querySelector(".sticky").style.display = "none";
                    for (let i = 0; i < classtohide.length; i++) {
                        classtohide[i].style.display = "none";
                    }
                }
            }
            // for delete operation
            let deletion = document.querySelectorAll(".fa-trash")
            deletion.forEach((loop) =>
                loop.addEventListener("click", function () {
                    listOfBM.innerHTML = "";
                    let currentLink = this.parentNode.parentNode.parentNode.querySelector("a").getAttribute("href")
                    localStorage.removeItem(currentLink)
                    document.querySelector(".sticky").style.display = "block";
                    getlink() // calling it after removing the item from localstorage withing the same page
                    document.querySelector(".thumbtag").style.display = "none";
                    document.querySelector(".addbmfirst").style.display = "block"
                    let classtoshow = document.querySelectorAll(".addbm");
                    for (let i = 0; i < classtoshow.length; i++) {
                        classtoshow[i].style.display = "block";
                    }
                    listOfBM.innerHTML = "";
                    getlink()
                    // after deleting show the add bookmark section again and assign values like earlier
                    classtoshow.forEach((loop) =>
                        loop.addEventListener("click", function () {
                            let d = new Date();
                            for (let i = 0; i < urlArray.length; i++) {
                                document.querySelector(".thumbtag").style.display = "block";
                                let d = new Date();
                                storageObject.value = urlArray[i];
                                storageObject.timestamp = d.getTime();
                                storageObject.title = title;
                                storageObject.favicon = favicon;
                                localStorage.setItem(urlArray[i], JSON.stringify(storageObject));
                                listOfBM.innerHTML = "";
                                getlink();
                            }
                        })
                    )
                })
            );
            // for editing operation (only title)
            let edit = document.querySelectorAll(".fa-pencil-square-o");
            edit.forEach((loop) =>
                loop.addEventListener("click", function () {
                    // basically hiding and showing elements and adding input to get latest value
                    this.parentNode.parentNode.parentNode.querySelector("a").style.visibility = "hidden"
                    this.parentNode.parentNode.style.display = "none";
                    let linkname = this.parentNode.parentNode.parentNode.querySelector("a").innerHTML
                    this.parentNode.parentNode.parentNode.insertAdjacentHTML("beforeend", `<input class="inputcls" id="inpt" autofocus="autofocus" type="text" value="${linkname}"> <i title="Confirm Edit" class="fa fa-check" aria-hidden="true"></i>`)
                    // for clicking on check button when the user is sure about new title
                    let check = this.parentNode.parentNode.parentNode.querySelectorAll(".fa-check")
                    check.forEach((loop) =>
                        loop.addEventListener("click", function () {

                            this.parentNode.querySelector(".show").style.display = "block"
                            // when editing its again getting all the values like favicon, title, link
                            // but the timestamp is the older version when it was first added
                            let getlink = this.parentNode.querySelector("a").getAttribute("href")
                            let forTimestamp = JSON.parse(localStorage.getItem(getlink))
                            let forFavicon = JSON.parse(localStorage.getItem(getlink))
                            let timearr = [] // time array (will only assign one value inside)
                            let favicon = [] // favicon array // (will only assign one value inside)
                            timearr.push(forTimestamp)
                            favicon.push(forFavicon)
                            let faviconlink = favicon[0].favicon
                            let actualTime = timearr[0].timestamp
                            storageObject.timestamp = actualTime
                            storageObject.value = getlink;
                            storageObject.favicon = faviconlink;
                            storageObject.title = document.querySelector(".inputcls").value
                            localStorage.setItem(getlink, JSON.stringify(storageObject))
                            this.parentNode.querySelector("a").innerHTML = document.querySelector(".inputcls").value
                            this.parentNode.querySelector("a").style.visibility = "visible"
                            this.parentNode.querySelector(".inputcls").remove()
                            this.parentNode.querySelector(".fa-check").remove()
                        })
                    )
                })
            );

            let searchBtn = document.querySelectorAll('.fa-search');
            searchBtn.forEach((loop)=>{
                loop.addEventListener("click",function(){
                    document.querySelector('.search').style.display = "block";
                    if(document.querySelector('.search').classList.contains('seachanimation')){
                        console.log('true')
                        document.querySelector('.search').classList.remove("searchanimation");
                    } else{
                        console.log('false')
                        document.querySelector('.search').classList.add("searchanimation");
                    }
                    // document.querySelector('.search').toggle('searchanimation');

                })
                
            })
            console.log(document.querySelector('.search').innerHTML);
        }
        getlink();
    }
    gettabs()
});