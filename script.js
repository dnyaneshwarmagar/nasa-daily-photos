let API_key = "p6aS5FoY8wtqyId3pHZgdNID4CPLYiwHOqOk3gV5";

// let API_URL = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_key}`

async function getCurrentImageOfTheDay() {
    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().split("T")[0];

    try {
        let response = await fetch(`https://api.nasa.gov/planetary/apod?date=${todaysDate}&api_key=${API_key}`);
        let data = await response.json();

        let dataDiv = document.getElementById("current-image-container");
        dataDiv.innerHTML =
            `
        <p>NASA Picture of the Day</p>
        <img src="${data.hdurl}" alt="img">
        <p>${data.title}</p>
        <p>${data.explanation}</p>
        `

    } catch (error) {
        console.log(error)
    }
}
getCurrentImageOfTheDay()

document.getElementById("search-form").addEventListener("submit", getImageOfTheDay)
async function getImageOfTheDay(e) {
    e.preventDefault();
    let date = document.getElementById("search-input").value;

    saveSearch(date)
    try {
        let response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_key}`);
        let data = await response.json();

        if (data.code !== 400) {
            let dataDiv = document.getElementById("current-image-container");
            dataDiv.innerHTML =
                `
            <p>Picture On ${data.date}</p>
            <img src="${data.hdurl}" alt="img">
            <p>${data.title}</p>
            <p>${data.explanation}</p>`
        }
        else {
            let dataDiv = document.getElementById("current-image-container");
            dataDiv.innerHTML = `
            <h1>${data.msg}</h1>
            <h1>Please choose valid Date.</h1>
            <h1>Error while laoding data.</h1>
            `
        }

    } catch (error) {
        console.log(error)
    }

}

function saveSearch(date) {
    let datesArray = JSON.parse(localStorage.getItem("searches")) || [];

    let flag = datesArray.find((obj) => obj.date === date);

    if (!flag) {
        let obj = { date }
        datesArray.push(obj);

        localStorage.setItem("searches", JSON.stringify(datesArray));
    }
    addSearchToHistory()
}

function addSearchToHistory() {
    let datesArray = JSON.parse(localStorage.getItem("searches"));

    let list = document.getElementById("search-history");
    list.innerHTML = "";
    datesArray?.forEach(obj => {
        let li = document.createElement("li");
        li.innerHTML = `<u style="color:blue">${obj.date}</u>`;
        li.addEventListener("click", async () => {
            try {

                let response = await fetch(`https://api.nasa.gov/planetary/apod?date=${obj.date}&api_key=${API_key}`);
                let data = await response.json();
                if (data.code !== 400) {
                    let dataDiv = document.getElementById("current-image-container");
                    dataDiv.innerHTML =
                        `
                    <p>Picture On ${data.date}</p>
                    <img src="${data.hdurl}" alt="img">
                    <p>${data.title}</p>
                    <p>${data.explanation}</p>
                    `
                }
                else {
                    let dataDiv = document.getElementById("current-image-container");
                    dataDiv.innerHTML = `
                    <h1>${data.msg}</h1>
                    <h1>Please choose valid Date.</h1>
                    <h1>Error while laoding data.</h1>
                    `
                }

            } catch (error) {
                console.log(error)
            }
        })
        list.append(li)
    });
}
addSearchToHistory()