const getMoviesContainer = document.querySelector(".MoviesContainer");
const inputField = document.querySelector(".searchMovies");
const icoSearchMovies = document.querySelector(".ico-searchMovies");
// api Key
const apiTMDB = "5a01498a2aff4e827be477e0fd2734ae";
const LinkFetch_MainPage = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiTMDB}`;
window.onload = function()
{
    inputField.focus();
    theMovies_MainPage();
}

icoSearchMovies.onclick = GetMovies;
// inputField.addEventListener("input", function () {
//     GetMovies();
// });
inputField.addEventListener("input", function () {
    if(inputField.value.length === 0){
        RemoveAll();
        theMovies_MainPage();
        inputField.focus();
    }
});

// get the 10 movies dayle
async function theMovies_MainPage(){
    const myData = await fetch(LinkFetch_MainPage);
    const FullData = await myData.json();
    console.log(FullData);
    FullData.results.forEach(function (Movie){
        console.log("Name = "+Movie.title)
        creatHTMLElement(Movie.title,Movie.vote_average.toFixed(1),Movie.id,"https://image.tmdb.org/t/p/w500"+Movie.poster_path,Movie.media_type);
    });
    AddToFavorit();
    checkFavorit();
}
// Get Movie when search
function GetMovies()
{
    const text = inputField.value;
    if(text.length > 0)
    {
        RemoveAll();
        ExtractNameMovie(text);
        // checkFavorit();
        inputField.focus();
    }
}
// remove All
function RemoveAll()
{
    getMoviesContainer.innerHTML = "";
    getMoviesContainer.style.color = "";
    getMoviesContainer.style.fontWeight = "";
}
// fetch the data from api and return data
async function fetchData(Name)
{
      try 
      {
        const myData = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiTMDB}&query=${Name}`)
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
async function ExtractNameMovie(Name)
{
    const AllData = await fetchData(Name);
    console.log("length = "+ AllData.results.length);
    if(AllData.results.length > 0)
    {
        AllData.results.forEach(function (Movie){
                if(Movie.vote_average  > 1 && Movie.poster_path !== null)
                {
                    creatHTMLElement(Movie.title,Movie.vote_average.toFixed(1),Movie.id,"https://image.tmdb.org/t/p/w500"+Movie.poster_path,"movie");
                }
        });
        AddToFavorit();
        checkFavorit();
    }else
    {
        getMoviesContainer.appendChild(document.createTextNode("Movie Not found !"))
        getMoviesContainer.style.color = "GRAY";
        getMoviesContainer.style.fontWeight = "bold";
    }
}
// creat element if data correct
function creatHTMLElement(NameMove,rateMovie,ID,img,Type)
{
    const theMovie = document.createElement("div");
    const theBtnFavorite = document.createElement("div")
    const theicoFavorite = document.createElement("i")
    theicoFavorite.classList.add("bi-heart")
    theBtnFavorite.classList.add("btnFavorite");
    theMovie.classList.add("Movie");
    const aTag = document.createElement("a");
    

    const theimg = document.createElement("img");
    theimg.setAttribute("src",img)

    const theInfo = document.createElement("div");
    theInfo.classList.add("info");

    const theNameMove = document.createElement("p");
    theNameMove.textContent = NameMove;
    const therateMovie = document.createElement("span");
    therateMovie.textContent = rateMovie;

    theInfo.appendChild(theNameMove);
    theInfo.appendChild(therateMovie);

    aTag.appendChild(theimg);
    aTag.appendChild(theInfo);

    theBtnFavorite.appendChild(theicoFavorite);

    theMovie.appendChild(theBtnFavorite);
    // theMovie.appendChild(theimg);
    // theMovie.appendChild(theInfo);
    theMovie.appendChild(aTag);
    
    getMoviesContainer.appendChild(theMovie);

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
    theBtnFavorite.dataset.Name = NameMove;
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
    let Info_Movies = JSON.parse(localStorage.getItem("All_Info")) || [];
    hearts.forEach(function (heart){
        let checkMovie = Info_Movies.find(item=>item.ID === heart.dataset.id);
        if(checkMovie){
            heart.style.backgroundColor = "red";
        }
    });
}
// Save The Name Movie