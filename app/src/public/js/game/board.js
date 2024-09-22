let startSector = 0; //0 = 1st sector
const sectors = document.getElementsByClassName("half-circle");
const covers = document.getElementsByClassName("cover");
const nums = document.getElementsByClassName("num");
const darkSector = document.getElementsByClassName("dark-sector")[0];

for (let i = 0; i < 12; i++) {
    covers[i].addEventListener("mouseover", () => {
        nums[i].style.color = "yellow";
    });
}
function moveSector(sector = 1) {
    startSector = (startSector + sector) % 12;
    darkSector.style.transform = `rotate(${startSector * 30}deg)`;
    setCover();
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
    console.log(lightSectors);
    for (let i = 0; i < 6; i++) {
        const idx = (startSector + i) % 12;
        sectors[idx].style.display = "block";
        sectors[idx].style.transform = `rotate(${lightSectors[i] * 30}deg)`;
        covers[idx].style.display = "block";
        covers[idx].style.transform = `rotate(${lightSectors[i] * 30 + 30}deg)`;
    }
    for (let i = 6; i < 12; i++) {
        const idx = (startSector + i) % 12;
        sectors[idx].style.display = "none";
        covers[idx].style.display = "none";
    }
}
moveSector();
setCover();
