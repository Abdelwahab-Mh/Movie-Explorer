const getShowsContainer = document.querySelector(".Container");
const inputField = document.querySelector(".searchField");
const icoSearchShows = document.querySelector(".ico-searchField");
// api Key
const apiTMDB = "5a01498a2aff4e827be477e0fd2734ae";

window.onload = function()
{
    inputField.focus();
    FetchAndCreatElement(getFavorit());
}
icoSearchShows.onclick = GetMovies;

inputField.addEventListener("input", function () {
    if(inputField.value.length === 0){
        RemoveAll();
        FetchAndCreatElement(getFavorit());
        inputField.focus();
    }
});
// Get Movie when search
function GetMovies()
{
    const text = inputField.value;
    if(text.length > 0)
    {
        RemoveAll();
        FetchAndCreatElementByName(text);
        // checkFavorit();
        inputField.focus();
    }
}
async function FetchAndCreatElementByName(text)
{
      try 
      {
        const myData = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiTMDB}&query=${text}`)
        if(!myData.ok){
            return { results: [] };
        }
        const FullFetchData = await myData.json();
        const Info = getFavorit();
        await Promise.all(Info.map(async function(item) {

            FullFetchData.results.forEach(function(show){
                if(String(show.id) === item.ID)
                {
                    if(item.Type === "movie"){
                        creatHTMLElement(show.title,show.vote_average.toFixed(1),item.ID,"https://image.tmdb.org/t/p/w500"+show.poster_path,"movie"); 
                    }else{
                        creatHTMLElement(show.name,show.vote_average.toFixed(1),item.ID,"https://image.tmdb.org/t/p/w500"+show.poster_path,"tv");
                    }
                }
            });
        }));
        checkFavorit();
        RemoveFromFavorit();
      } 
      catch (results) 
      {        
        return { results: [] };
      } 
}
// fetch the data from api and return data
async function FetchAndCreatElement(Info)
{
      try 
      {
        await Promise.all(Info.map(async function(item) {
            if(item.Type === "movie"){
                const myData =  await fetch(`https://api.themoviedb.org/3/movie/${item.ID}?api_key=${apiTMDB}`);
                if(!myData.ok){
                    return { results: [] };
                }
                const FullFetchData = await myData.json();
                creatHTMLElement(FullFetchData.title,FullFetchData.vote_average.toFixed(1),item.ID,"https://image.tmdb.org/t/p/w500"+FullFetchData.poster_path,"movie"); 
            }else{
                const myData =  await fetch(`https://api.themoviedb.org/3/tv/${item.ID}?api_key=${apiTMDB}`);
                if(!myData.ok){
                    return { results: [] };
                }
                const FullFetchData = await myData.json();
                creatHTMLElement(FullFetchData.name,FullFetchData.vote_average.toFixed(1),item.ID,"https://image.tmdb.org/t/p/w500"+FullFetchData.poster_path,"tv");
            } 
        }));
        checkFavorit();
        RemoveFromFavorit();
      } 
      catch (results) 
      {        
        console.log(`Reason: ${results}`);
        return false;
      } 
}
function checkFavorit()
{
    let hearts = document.querySelectorAll(".btnFavorite");
    hearts.forEach(function (heart){
        heart.style.backgroundColor = "red";
    });
}
// remove All
function RemoveAll()
{
    getShowsContainer.innerHTML = "";
    getShowsContainer.style.color = "";
    getShowsContainer.style.fontWeight = "";
}
// creat element if data correct
function creatHTMLElement(NameShow,rateShow,ID,img,Type)
{
    const theShow = document.createElement("div");
    const theBtnFavorite = document.createElement("div")
    const theicoFavorite = document.createElement("i")
    theicoFavorite.classList.add("bi-heart")
    theBtnFavorite.classList.add("btnFavorite");
    theShow.classList.add("Show");
    const aTag = document.createElement("a");
    

    const theimg = document.createElement("img");
    theimg.setAttribute("src",img)

    const theInfo = document.createElement("div");
    theInfo.classList.add("info");

    const theNameShow = document.createElement("p");
    theNameShow.textContent = NameShow;
    const therateShow = document.createElement("span");
    therateShow.textContent = rateShow;

    theInfo.appendChild(theNameShow);
    theInfo.appendChild(therateShow);

    aTag.appendChild(theimg);
    aTag.appendChild(theInfo);

    theBtnFavorite.appendChild(theicoFavorite);

    theShow.appendChild(theBtnFavorite);
    // theMovie.appendChild(theimg);
    // theMovie.appendChild(theInfo);
    theShow.appendChild(aTag);
    
    getShowsContainer.appendChild(theShow);

    aTag.onclick = async function (){
        const NewFetch = await fetch(`https://api.themoviedb.org/3/movie/${ID}/videos?api_key=${apiTMDB}`);
        const NewFullData = await NewFetch.json();
        const theVideo = NewFullData.results.find(function (Video){
            return Video.site === "YouTube" && Video.type === "Trailer" && Video.official === true;
        })
        if(theVideo){
            // console.log(theVideo);
            window.open(`https://www.youtube.com/watch?v=${theVideo.key}`,"_self");
        }
    }
    theBtnFavorite.dataset.id = ID;
    theBtnFavorite.dataset.Name = NameShow;
    theBtnFavorite.dataset.type = Type;
}
function RemoveFromFavorit()
{
    let AllInfo = JSON.parse(localStorage.getItem("All_Info")) || [];
    let hearts = document.querySelectorAll(".btnFavorite");
    hearts.forEach(function(heart){
        heart.onclick = function(){

            AllInfo = AllInfo.filter(function(Show){
                    return Show.ID !== heart.dataset.id;  
            });
            heart.style.backgroundColor = "rgba(0,0,0,.6)";
            localStorage.setItem("All_Info",JSON.stringify(AllInfo));
            RemoveAll();
            FetchAndCreatElement(AllInfo);
        }
    })
}
function getFavorit()
{
    let AllInfo = JSON.parse(localStorage.getItem("All_Info")) || [];
    return AllInfo;
}