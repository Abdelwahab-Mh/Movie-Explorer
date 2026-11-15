
const getSeriesesContainer = document.querySelector(".SeriesesContainer");
const inputField = document.querySelector(".searchSerieses");
const icoSearchSerieses = document.querySelector(".ico-searchSerieses");
// api Key
const apiTMDB = "5a01498a2aff4e827be477e0fd2734ae";
const LinkFetch_MainPage = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiTMDB}`;
window.onload = function()
{
    inputField.focus();
    theSerieses_MainPage();
}

icoSearchSerieses.onclick = GetSerieses;

inputField.addEventListener("input", function () {
    if(inputField.value.length === 0){
        RemoveAll();
        theSerieses_MainPage();
        inputField.focus();
    }
});

// get the 10 Serieses dayle
async function theSerieses_MainPage(){
    const myData = await fetch(LinkFetch_MainPage);
    const FullData = await myData.json();
    console.log(FullData);
    FullData.results.forEach(function (Series){
        creatHTMLElement(Series.name,Series.vote_average.toFixed(1),Series.id,"https://image.tmdb.org/t/p/w500"+Series.poster_path,Series.media_type);
    });
    AddToFavorit();
    checkFavorit();
}
// Get Series when search
function GetSerieses()
{
    const text = inputField.value;
    if(text.length > 0)
    {
        RemoveAll();
        ExtractNameSeries(text);
        inputField.focus();
    }
}
// remove All
function RemoveAll()
{
    getSeriesesContainer.innerHTML = "";
    getSeriesesContainer.style.color = "";
    getSeriesesContainer.style.fontWeight = "";
}
// fetch the data from api and return data
async function fetchData(Name)
{
      try 
      {
        const myData = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiTMDB}&query=${Name}`)
        const FullFetchData = await myData.json();
        if(!myData.ok){
            return { results: [] };
        }
        return FullFetchData;
      } 
      catch (results) 
      {        
        console.log(`Reason: ${results}`);
        return { results: [] };
      } 
}
// use the data to extract title,vote_average,id,img and creat element if data correct
async function ExtractNameSeries(Name)
{
    const AllData = await fetchData(Name);
    console.log("length = "+ AllData.results.length);
    if(AllData.results.length > 0)
    {
        AllData.results.forEach(function (Series){
                if(Series.vote_average  > 1 && Series.poster_path !== null)
                {
                    creatHTMLElement(Series.name,Series.vote_average.toFixed(1),Series.id,"https://image.tmdb.org/t/p/w500"+Series.poster_path,"tv");
                }
        });
        AddToFavorit();
        checkFavorit();
    }else
    {
        getSeriesesContainer.appendChild(document.createTextNode("Seriese Not found !"))
        getSeriesesContainer.style.color = "GRAY";
        getSeriesesContainer.style.fontWeight = "bold";
    }
}
// creat element if data correct
function creatHTMLElement(NameSeries,rateSeries,ID,img,Type)
{
    const theSeries = document.createElement("div");
    const theBtnFavorite = document.createElement("div")
    const theicoFavorite = document.createElement("i")
    theicoFavorite.classList.add("bi-heart")
    theBtnFavorite.classList.add("btnFavorite");
    theSeries.classList.add("Series");
    const aTag = document.createElement("a");

    const theimg = document.createElement("img");
    theimg.setAttribute("src",img)

    const theInfo = document.createElement("div");
    theInfo.classList.add("info");

    const theNameSeries = document.createElement("p");
    theNameSeries.textContent = NameSeries;
    const therateSeries = document.createElement("span");
    therateSeries.textContent = rateSeries;

    theInfo.appendChild(theNameSeries);
    theInfo.appendChild(therateSeries);

    aTag.appendChild(theimg);
    aTag.appendChild(theInfo);


    theBtnFavorite.appendChild(theicoFavorite);

    theSeries.appendChild(theBtnFavorite);
    theSeries.appendChild(aTag);
    
    getSeriesesContainer.appendChild(theSeries);

    aTag.onclick = async function (){
        const NewFetch = await fetch(`https://api.themoviedb.org/3/tv/${ID}/videos?api_key=${apiTMDB}`);
        const NewFullData = await NewFetch.json();
        const theVideo = NewFullData.results.find(function (Video){
            return Video.site === "YouTube" && Video.type === "Trailer" && Video.official === true;
        })
        if(theVideo){
            window.open(`https://www.youtube.com/watch?v=${theVideo.key}`,"_self");
        }else{
            alert("Video Trailer Not Found !");
        }
    }
    theBtnFavorite.dataset.id = ID;
    theBtnFavorite.dataset.Name = NameSeries;
    theBtnFavorite.dataset.type = Type;
}
function AddToFavorit()
{
    let AllInfo = JSON.parse(localStorage.getItem("All_Info")) || [];
    let hearts = document.querySelectorAll(".btnFavorite");
    hearts.forEach(function(heart){
        heart.onclick = function(){
            if(heart.style.backgroundColor !== "red")
            {
                AllInfo.push({
                    ID:heart.dataset.id,
                    Name:heart.dataset.Name,
                    Type:heart.dataset.type
                });
                heart.style.backgroundColor = "red";
            }
            else
            {
                AllInfo = AllInfo.filter(function (info){
                    return info.ID !== heart.dataset.id;
                })   
                heart.style.backgroundColor = "rgba(0,0,0,.6)";
            }
            localStorage.setItem("All_Info",JSON.stringify(AllInfo));
        }
    })
}
function checkFavorit()
{
    let hearts = document.querySelectorAll(".btnFavorite");
    let ID_TvShows = JSON.parse(localStorage.getItem("All_Info")) || [];
    hearts.forEach(function (heart){
        let checkMovie = ID_TvShows.find(item=>item.ID === heart.dataset.id);
        if(checkMovie){
            heart.style.backgroundColor = "red";
        }
    });
}