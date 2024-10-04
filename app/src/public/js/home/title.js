const startButton = document.getElementById("new-game");
const backButton = document.getElementById("back");
const titleDiv = document.getElementsByClassName("title")[0];
const difficultyDiv = document.getElementsByClassName("difficulty")[0];
const difficultyEasy = document.getElementById("easy");
const difficultyNormal = document.getElementById("normal");
const difficultyHard = document.getElementById("hard");
const difficultyVeryHard = document.getElementById("very-hard");

startButton.addEventListener("click", () => {
    titleDiv.style.display = "none";
    difficultyDiv.style.display = "block";
});

backButton.addEventListener("click", () => {
    titleDiv.style.display = "block";
    difficultyDiv.style.display = "none";
});

function set_difficulty(difficulty) {
    const req = {
        difficulty: difficulty,
    };
    // const code = Math.floor(Math.random() * 4446);
    // localStorage.setItem("code", code.toString());
    // location.href = `startinfo/?difficulty=${difficulty}`;
    // location.href = `startinfo/?code=${code}&difficulty=${difficulty}`;
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            localStorage.setItem("hints", JSON.stringify(res.hints));
            localStorage.setItem("researches", JSON.stringify(res.researches));
            location.href = "/game";
        })
        .catch((err) => {
            console.error(new Error(err));
        });
}

difficultyEasy.addEventListener("click", () => {
    set_difficulty("easy");
});

difficultyNormal.addEventListener("click", () => {
    set_difficulty("normal");
});

difficultyHard.addEventListener("click", () => {
    set_difficulty("hard");
});

difficultyVeryHard.addEventListener("click", () => {
    set_difficulty("very-hard");
});
