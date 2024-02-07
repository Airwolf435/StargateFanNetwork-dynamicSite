
function createSuperCard(root, img, alt, header, subheader, body, href){
    let newCard = document.createElement("article");
    newCard.classList.add("super-card");

    let imgElement = document.createElement("img");
    imgElement.classList.add("episode-img");
    imgElement.setAttribute("src", img);
    imgElement.setAttribute("alt", alt);
    imgElement.setAttribute("title", alt);
    imgElement.setAttribute("width", 540);
    imgElement.setAttribute("height", 320);
    newCard.appendChild(imgElement);

    let textSect = document.createElement("section");
    textSect.classList.add("super-text");
    newCard.appendChild(textSect);

    let cardHeader = document.createElement("h3");
    cardHeader.innerText = header;
    textSect.appendChild(cardHeader);

    let cardSubHeader = document.createElement("h4");
    cardSubHeader.innerText = subheader;
    textSect.appendChild(cardSubHeader);

    let cardBody = document.createElement("p");
    cardBody.innerText = body;
    textSect.appendChild(cardBody);

    let cardLink = document.createElement("a");
    cardLink.setAttribute("href", href);
    cardLink.innerText = "Read More";
    cardLink.classList.add("read-more");
    textSect.appendChild(cardLink);
    
    root.appendChild(newCard);
}

function createImageCard(root, img, alt, header, href, subheader){
    let anchorWrapper = document.createElement("a");
    anchorWrapper.setAttribute("href", href);

    let card = document.createElement("article");
    card.classList.add("img-card");
    anchorWrapper.appendChild(card);

    let image = document.createElement("img");
    image.setAttribute("src", img);
    image.setAttribute("alt", alt);
    image.setAttribute("title", alt);
    card.appendChild(image);

    let textSect = document.createElement("div");
    textSect.classList.add("text-container");
    card.appendChild(textSect);

    let cardHeader = document.createElement("h3");
    cardHeader.innerText = header;
    textSect.appendChild(cardHeader);

    if(subheader){
        let cardSubHeader = document.createElement("h4");
        cardSubHeader.innerText = subheader;
        textSect.appendChild(cardSubHeader);
    }
    root.appendChild(anchorWrapper);
}

function hidePages(){
    $("main").hide();
}

function revealPage(name, pageID){
    revealFunctions[name](pageID);
    $(`#${name}`).show();
    window.scroll(0,0)
}

function createSliders(){
    document.querySelectorAll(".super-slider").forEach((element)=>{
        if(!element.classList.contains("slick-slider")){
            $(element).slick({
                dots: true,
                infinite: true,
                responsive: [
                    {
                        breakpoint: 800,
                        settings:{
                            arrows: false
                        }
                    }
                ]
            });
        }
    })

    document.querySelectorAll(".normal-slider").forEach((element)=>{
        if(!element.classList.contains("slick-slider")){
            $(element).slick({
                dots: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 1700,
                        settings:{
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 1150,
                        settings:{
                            slidesToShow: 1,
                        }
                    },
                    {
                        breakpoint: 800,
                        settings:{
                            slidesToShow: 1,
                            variableWidth: true,
                            arrows: false
                        }
                    }
                ]
            });
        }
    })
    
    document.querySelectorAll(".movie-slider").forEach((element)=>{
        if(!element.classList.contains("slick-slider")){
            $(element).slick({
                dots: true,
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: false,
                responsive: [
                    {
                        breakpoint: 1700,
                        settings:{
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 1150,
                        settings:{
                            slidesToShow: 1,
                        }
                    },
                    {
                        breakpoint: 800,
                        settings:{
                            slidesToShow: 1,
                            centerMode: true,
                            variableWidth: true,
                            arrows: false
                        }
                    }
                ]
            });
            
        }
    })

    document.querySelectorAll(".small-movie-slider").forEach((element)=>{
        if(!element.classList.contains("slick-slider")){
            $(element).slick({
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                centerMode: true,
                responsive: [
                    {
                        breakpoint: 800,
                        settings:{
                            variableWidth: true,
                            arrows: false
                        }
                    }
                ]
            });
        }
    })
}

function destroySliders(){
    document.querySelectorAll([".super-slider", ".normal-slider", ".movie-slider", ".small-movie-slider"]).forEach((element)=>{
        if(element.classList.contains("slick-slider")){
            $(element).slick("unslick");
        }
        element.innerHTML = "";
    })
}

async function createMovieCard(id, root){
    let promise = new Promise((resolve, reject)=>{
        fetch("./services/get_episode.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"requestedEpisode": id})
        }).then((res)=>res.json()).then((movieObj)=>{
            createImageCard(root,
                `./uploads/${movieObj.coverID}/${movieObj.coverName}`,
                "",
                movieObj.name,
                `#/movie/${movieObj.id}`,
                ""
            );
            resolve(true);
        })
    })
    return promise;
}

async function renderSplash(){
    let promises = []
    // Fetching collection of random ID's to use for creating the splash cards.
    await fetch("./services/get_randEpisodes.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({numRecords: 4}),
    }).then((res)=>res.json()).then(({episodes})=>{
        let episodeSlider = document.querySelector(".featured-episodes");
        // Fetch full episode details to construct each card.
        for(let id of episodes){
            fetch("./services/get_episode.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"requestedEpisode": id})
            }).then((res)=>res.json()).then((episodeObj)=>{
                if(episodeObj){
                    let modifiedDescript = episodeObj.descript;
                    if(modifiedDescript.length > 200){
                        modifiedDescript = `${modifiedDescript.slice(0,198)}...`;
                    }
                    createSuperCard(episodeSlider,
                        `./uploads/episodeImages/${episodeObj.coverName}`,
                        "",
                        episodeObj.name,
                        `Season ${episodeObj.season} - Episode ${episodeObj.episode}`,
                        modifiedDescript,
                        `#/episode/${episodeObj.id}`);
                }
            }).catch((err)=>console.log(err));
        }
    });
    // ! End of Logic to render episode slider
    // ! *** Start of logic to render movie posters ***
    let movieSlider = document.querySelector(".movie-slider");
    let {movies} = await fetch("./services/get_randMovies.php", {method: "GET"}).then((res)=>res.json());
    for(let id of movies){
        promises.push(
            createMovieCard(id, movieSlider)
        );
    }

    return Promise.all(promises);
}

async function renderEpisode(episodeID){
    let promises = [];
    let pageRoot = document.querySelector("#episodePage");
    // This promise handles loading the episode detail section, cast will be handled seperately.
    promises.push(new Promise((resolve, reject)=>{
        fetch("./services/get_episode.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"requestedEpisode": episodeID})
        }).then((res)=>res.json()).then((episodeObj)=>{
            let episodeHeader = pageRoot.querySelector(".episode-text h1");
            episodeHeader.innerText = episodeObj.name;
            let episodePlot = pageRoot.querySelector(".episode-text p");
            episodePlot.innerText = episodeObj.descript;

            let epImage = pageRoot.querySelector(".teaser-img .episode-img");
            epImage.setAttribute("src", `./uploads/episodeImages/${episodeObj.coverName}`);

            let seasonNumber = pageRoot.querySelector(".details-sect .season-number");
            seasonNumber.innerText = episodeObj.season;
            let episodeNumber = pageRoot.querySelector(".details-sect .episode-number");
            episodeNumber.innerText = episodeObj.episode;
            let nextEpsiode = pageRoot.querySelector(".details-sect .next-episode");
            if(episodeObj.next_ep !== "0"){
                fetch("./services/get_episode.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"requestedEpisode": episodeObj.next_ep})
                }).then((res)=>res.json()).then((episode)=>{
                    nextEpsiode.innerText = episode.name;
                    nextEpsiode.setAttribute("href", `#/${episode.isMovie === "1" ? "movie" : "episode"}/${episode.id}`)
                })
            }else{
                nextEpsiode.innerText = "None";
                nextEpsiode.setAttribute("href", `#/episode/${episodeObj.movieID}`)
            }
            // let nextEpsiode = pageRoot.querySelector(".details-sect .next-episode");
            // nextEpsiode.innerText = episodeObj.next_ep;
            let previousEpisode = pageRoot.querySelector(".details-sect .previous-episode");
            if(episodeObj.previous_ep !== "0"){
                fetch("./services/get_episode.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"requestedEpisode": episodeObj.previous_ep})
                }).then((res)=>res.json()).then((episode)=>{
                    previousEpisode.innerText = episode.name;
                    previousEpisode.setAttribute("href", `#/${episode.isMovie === "1" ? "movie" : "episode"}/${episode.id}`);
                })
            }else{
                previousEpisode.innerText = "None"
                previousEpisode.setAttribute("href", `/#/episode/${episodeObj.id}`);
            }
            
            let airDate = pageRoot.querySelector(".details-sect .air-date");
            airDate.innerText = episodeObj.date_me;
            resolve(true);
        });
    }));
    // This promise handles the main and guest casts
    promises.push(new Promise((resolve, reject)=>{
        fetch("./services/get_relatedCast.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"movieID": episodeID})
        }).then((res)=>res.json()).then((castList)=>{
            let mainSlider = pageRoot.querySelector(".main-cast");
            let guestSlider = pageRoot.querySelector(".guest-cast");;

            let mainCast = castList.filter((cast)=>{
                if(cast.isGuest === "0"){
                    return true;
                }else{
                    return false;
                }
            });
            let guestCast = castList.filter((cast)=>{
                if(cast.isGuest === "1"){
                    return true;
                }else{
                    return false;
                }
            });
            // Main cast loop
            for(let castMember of mainCast){
                createImageCard(mainSlider,
                    `./uploads/castImages/${castMember.imageName}`,
                    castMember.imageDescript,
                    castMember.characterName,
                    `#/cast/${castMember.characterID}`);
            }
            // Guest cast loop
            for(let castMember of guestCast){
                createImageCard(guestSlider,
                    `./uploads/castImages/${castMember.imageName}`,
                    castMember.imageDescript,
                    castMember.characterName,
                    `#/cast/${castMember.characterID}`);
            }
            resolve(true);
        })
    }))
    return Promise.all(promises);
}

async function renderMovie(movieID){
    let promises = [];
    let pageRoot = document.querySelector("#moviePage");
    promises.push(new Promise((resolve, reject)=>{
        fetch("./services/get_episode.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"requestedEpisode": movieID})
        }).then((res)=>res.json()).then((movieObj)=>{
            let movieHeader = pageRoot.querySelector(".episode-text h1");
            movieHeader.innerText = movieObj.name;
            let moviePlot = pageRoot.querySelector(".episode-text p");
            moviePlot.innerText = movieObj.descript;
        
            let movieImg = pageRoot.querySelector(".teaser-img .movie-img");
            movieImg.setAttribute("src", `./uploads/movieImages/${movieObj.coverName}`);
        
            let airDate = pageRoot.querySelector(".details-sect .air-date");
            airDate.innerText = movieObj.date_me;

            let runTime = pageRoot.querySelector(".details-sect .run-time");
            runTime.innerText = `${movieObj.hour_me} Hour - ${movieObj.minute_me} Minutes`;

            resolve(true);
        })
    }));
    // This promise handles the cast slider
    promises.push(new Promise((resolve, reject)=>{
        fetch("./services/get_relatedCast.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"movieID": movieID})
        }).then((res)=>res.json()).then((castList)=>{
            let mainSlider = pageRoot.querySelector(".main-cast");
            for(let castMember of castList){
                createImageCard(mainSlider,
                    `./uploads/castImages/${castMember.imageName}`,
                    castMember.imageDescript,
                    castMember.characterName,
                    `#/cast/${castMember.characterID}`);
            }
            resolve(true);
        });
    }))
    // This loop will add in the other movies
    promises.push(new Promise((resolve, reject)=>{
        fetch("./services/get_onlyMovies.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"movieID": movieID})
        }).then((res)=>res.json()).then((movieList)=>{
            let movieSlider = pageRoot.querySelector(".other-movies");
            for(let movie of movieList){
                createImageCard(movieSlider,
                    `./uploads/movieImages/${movie.imageName}`,
                    movie.imageDescript,
                    movie.movieName,
                    `#/movie/${movie.movieID}`);
            }
            resolve(true);
        })
    }));
    return Promise.all(promises);
}

async function renderCharacter(characterID){
    let promises = [];
    let pageRoot = document.querySelector("#characterPage");
    promises.push( new Promise((resolve, reject)=>{
        fetch("./services/get_character.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"characterID": characterID})
        }).then((res)=>res.json()).then((characterObj)=>{
            let characterName = pageRoot.querySelector(".cast-text h1");
            characterName.innerText = characterObj.characterName;
            let characterBackground = pageRoot.querySelector(".cast-text p");
            characterBackground.innerText = characterObj.characterDescript;
        
            let characterImg = pageRoot.querySelector(".teaser-img .character-img");
            characterImg.setAttribute("src", `./uploads/castImages/${characterObj.imageName}`);
            resolve(true);
        })
    }))
    // This promise will handle the two sliders
    promises.push(new Promise((resolve,reject)=>{
        fetch("./services/get_castMovies.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"castID": characterID})
        }).then((res)=>res.json()).then((apperanceList)=>{
            pageRoot.querySelector(".apperance-count").innerText = ` ${apperanceList.length}`
            apperanceList = apperanceList.sort((a,b)=>Number(a.movieID) - Number(b.movieID));
            let firstApperance = pageRoot.querySelector(".first-apperance");
            firstApperance.setAttribute("href", `#/${apperanceList[0].isMovie ? "movie" : "episode"}/${apperanceList[0].movieID}`);
            firstApperance.innerText = apperanceList[0].movieName;

            let episodeSlider = pageRoot.querySelector(".episodes");
            let movieSlider = pageRoot.querySelector(".movies");
            let episodes = apperanceList.filter((apperance)=>{
                if(apperance.isMovie === "0"){
                    return true;
                }else{
                    return false;
                }
            })
            
            let movies = apperanceList.filter((apperance)=>{
                if(apperance.isMovie === "1"){
                    return true;
                }else{
                    return false;
                }
            })
            
            if(episodes.length > 0){
                for(let episode of episodes){
                    pageRoot.querySelector(".episode-header").innerText = "Episodes:"
                    createImageCard(episodeSlider,
                        `./uploads/episodeImages/${episode.imageName}`,
                        episode.imageDescript,
                        episode.movieName,
                        `#/episode/${episode.movieID}`,
                        `Season ${episode.season} - Episode ${episode.episode}`);
                }
            }else{
                pageRoot.querySelector(".episode-header").innerText = "No episode apperances found for this character";
            }
            
            
            if(movies.length > 0){
                pageRoot.querySelector(".movie-header").innerText = "Movies:";
                for(let movie of movies){
                    createImageCard(movieSlider,
                        `./uploads/movieImages/${movie.imageName}`,
                        movie.imageDescript,
                        movie.movieName,
                        `#/episode/${movie.movieID}`);
                }
            }else{
                pageRoot.querySelector(".movie-header").innerText = "No movie apperances found for this character";
            }
            
            resolve(true);
        })
    }));
    return Promise.all(promises);
}

let revealFunctions = {
    "splash": function (){
        renderSplash().then(()=>{
            createSliders();
        });
    },
    "episodePage": function(episodeID){
        renderEpisode(episodeID).then(()=>{
            createSliders();
        });
    },
    "moviePage": function(movieID){
        renderMovie(movieID).then(()=>{
            createSliders();
        });
    },
    "characterPage": function(characterID){
        renderCharacter(characterID).then(()=>{
            createSliders();
        });
    }
}



function routeToPage(page){
    return(pageID) =>{
        hidePages();
        destroySliders();
        revealPage(page, pageID);
    }
}

function searchDB(searchText){
    let root = document.querySelector("#searchResults");
    root.innerHTML = "";
    fetch("./services/get_search.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "searchText": searchText,
            "searchCount": 3
        })
    }).then((res)=>res.json()).then((data)=>{
        console.log(data);
        for(let record of data){
            let articleWrapper = document.createElement("article");
            articleWrapper.classList.add("search-item");

            let linkRef = `#/${record.isMovie === "1" ? "movie" : "episode"}/${record.id}`
            let link = document.createElement("a");
            link.setAttribute("href", linkRef);
            articleWrapper.appendChild(link);

            let episodeName = document.createElement("h4");
            episodeName.innerText = record.episodeName;
            articleWrapper.appendChild(episodeName);

            if(record.isMovie === "0"){
                let subText = document.createElement("p");
                subText.innerText = `Season ${record.seasonNum} - Episode ${record.episodeNum}`;
                articleWrapper.appendChild(subText);
            }

            root.appendChild(articleWrapper);
        }
    })
}

for(let element of document.querySelectorAll(".toggle-citation")){
    element.addEventListener("mousedown", function(){
        document.querySelector("#citationModal").classList.toggle("hidden")
    });
}

document.querySelector("#crYear").innerText = new Date().getFullYear();

$(document).foundation();
$.sammy(function(){
    this.get("#/", ()=>{
        routeToPage("splash")();
    })
    this.get("#/episode/:episodeID", function(){
        let episodeID = this.params["episodeID"];
        routeToPage("episodePage")(episodeID);
    })
    this.get("#/movie/:movieID", function(){
        let movieID = this.params["movieID"];
        routeToPage("moviePage")(movieID);
    })
    this.get("#/cast/:castID", function(){
        let characterID = this.params["castID"];
        routeToPage("characterPage")(characterID);
    })
}).run("#/")

document.querySelector("#searchText").addEventListener("keyup", (e)=>{
    console.log(e.target.value.length)
    if(e.target.value.length > 3){
        console.log("firing");
        searchDB(e.target.value);
    }else{
        let root = document.querySelector("#searchResults");
        root.innerHTML = "";
    }
})

document.querySelector("#searchResults").addEventListener("click", (e)=>{
    document.querySelector("#searchResults").innerHTML = "";
})