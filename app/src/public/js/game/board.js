let startSector = 0; //0 = 1st sector
const sectors = document.getElementsByClassName("half-circle");
const covers = document.getElementsByClassName("cover");
const nums = document.getElementsByClassName("num");
const darkSector = document.getElementsByClassName("dark-sector")[0];
const board = document.querySelector(".board");
const centerCircle = document.querySelector(".circle");

function initialize() {
    darkSector.style.zIndex = 20;
    centerCircle.style.zIndex = 21;
    setCover();
}

function moveSector(sector = 1) {
    startSector = (startSector + sector) % 12;
    setCover();
    darkSector.style.transform = `rotate(${startSector * 30}deg)`;
}

function getLightSectors() {
    result = [];
    for (let i = 0; i < 6; i++) {
        result.push((startSector + i) % 12);
    }
    return result;
}

function setCover() {
    const lightSectors = getLightSectors();
    // console.log(lightSectors);
    for (let i = 0; i < 6; i++) {
        const idx = (startSector + i) % 12;
        sectors[idx].style.zIndex = i * 2 + 2;
        sectors[idx].style.display = "block";
        sectors[idx].style.transform = `rotate(${lightSectors[i] * 30}deg)`;
        covers[(idx + 11) % 12].style.zIndex = i * 2 + 1;
        covers[(idx + 11) % 12].style.display = "block";
        covers[(idx + 11) % 12].style.transform = `rotate(${lightSectors[i] * 30}deg)`;
    }
    for (let i = 6; i < 12; i++) {
        const idx = (startSector + i) % 12;
        sectors[idx].style.display = "none";
        covers[(idx + 11) % 12].style.display = "none";
    }
}

for (let i = 0; i < 12; i++) {
    sectors[i].addEventListener("click", () => {
        console.log("click");
        nums[i].style.color = "cyan";
    });
}
