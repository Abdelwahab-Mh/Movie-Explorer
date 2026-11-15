let getMode = document.querySelector(".mode");

let theme = localStorage.getItem("theme") || "Dark";

function ApplyTheme()
{
    if(theme === "Dark")
    {
        getMode.innerHTML = "Light";
        document.body.style.backgroundColor = "black";
        document.body.style.color = "darkgray";
    }
    else
    {
        getMode.innerHTML = "Dark";
        document.body.style.backgroundColor = "darkgray";
        document.body.style.color = "black";
    }
}

ApplyTheme();

getMode.onclick = function()
{
    theme = theme === "Light" ? "Dark" : "Light";

    localStorage.setItem("theme", theme);

    ApplyTheme();
};
