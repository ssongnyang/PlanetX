//base board
const sectors = document.getElementsByClassName("half-circle");
const covers = document.getElementsByClassName("cover");
const nums = document.getElementsByClassName("num");
const darkSector = document.getElementsByClassName("dark-sector")[0];
const board = document.querySelector(".board");
const centerCircle = document.querySelector(".circle");
const openObserveBtn = document.getElementById("observe");
//observe menu
const observeMenu = document.getElementById("observe-menu");

const selectObjectButton = document.getElementById("select-object-button");
const selectObjectMenu = document.getElementById("select-object-menu");
const selectedObjectButton = document.getElementById("selected-object-button");
const selectedObjectImg = document.getElementById("selected-object-img");
const selectedObjectText = document.getElementById("selected-object-text");
const objectButtons = document.getElementsByClassName("object-button");

const selectRangeMenu = document.getElementsByClassName("select-range-menu")[0];
const selectStartRangeBtn = document.getElementById("select-start-range-button");
const selectEndRangeBtn = document.getElementById("select-end-range-button");
const startRangeTable = document.getElementsByClassName("range-table-start")[0];
const endRangeTable = document.getElementsByClassName("range-table-end")[0];

const startSectorsBtns = document.getElementsByClassName("start-sectors");
const endSectorsBtns = document.getElementsByClassName("end-sectors");

const observeBtn = document.getElementById("confirm-observe-button");

const cancelBtn = document.getElementById("cancel");

const AsteroidBtn = objectButtons[2];
const DwarfBtn = objectButtons[0];
const CometBtn = objectButtons[1];
const GascloudBtn = objectButtons[3];
const EmptyBtn = objectButtons[4];

let startSector = 0; //0 = 1st sector
let selectedObject = undefined;
let observeStartSector = undefined;
let observeEndSector = undefined;

openObserveBtn.addEventListener("click", () => {
    observeMenu.style.display = "block";
});

[selectObjectButton, selectedObjectButton].forEach((btn) => {
    btn.addEventListener("click", () => {
        selectObjectMenu.style.display = "grid";
    });
});

for (let i = 0; i < 5; i++) {
    objectButtons[i].addEventListener("click", () => {
        selectedObject = i + 2;
        selectObjectMenu.style.display = "none";
        selectObjectButton.style.display = "none";
        selectedObjectImg.setAttribute("src", `images/object/${objectToString(selectedObject)}.png`);
        selectedObjectText.innerHTML = objectToStringKR(selectedObject);
        selectedObjectButton.style.display = "inline-flex";

        selectStartRangeBtn.style.backgroundColor = "black";
        selectRangeMenu.style.display = "block";
    });
}

selectStartRangeBtn.addEventListener("click", () => {
    startRangeTable.style.display = "grid";
    endRangeTable.style.display = "none";
});

Array.from(startSectorsBtns).forEach((btn) => {
    btn.addEventListener("click", () => {
        selectEndRangeBtn.disabled = false;
        selectEndRangeBtn.style.backgroundColor = "black";
        startRangeTable.style.display = "none";
        observeStartSector = parseInt(btn.innerHTML) - 1;
        selectStartRangeBtn.innerHTML = observeStartSector + 1;
        if (observeEndSector != undefined && observeStartSector < observeEndSector) {
            enableObserveBtn();
        } else {
            disableObserveBtn();
        }
        console.log("start sector : ", observeStartSector);
    });
});

selectEndRangeBtn.addEventListener("click", () => {
    startRangeTable.style.display = "none";
    endRangeTable.style.display = "grid";
    for (let i = 0; i < 6; i++) {
        if (i < observeStartSector - startSector) {
            endSectorsBtns[i].style.display = "none";
        } else {
            endSectorsBtns[i].style.display = "block";
        }
    }
});

Array.from(endSectorsBtns).forEach((btn) => {
    btn.addEventListener("click", () => {
        observeBtn.disabled = false;
        observeBtn.style.backgroundColor = "black";
        endRangeTable.style.display = "none";
        observeEndSector = parseInt(btn.innerHTML) - 1;
        selectEndRangeBtn.innerHTML = observeEndSector + 1;
        observeBtn.innerHTML = `관측(${observeCost()})`;
        console.log("end sector : ", observeEndSector);
    });
});

observeBtn.addEventListener("click", () => {
    const req = {
        object: selectedObject,
        start: observeStartSector,
        end: observeEndSector,
    }; //임시
    fetch("/game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            observeMenu.style.display = "none";
            moveSector(observeCost());
            observeMenuReset();
        })
        .catch((err) => {
            console.error(new Error(err));
        });
});

cancelBtn.addEventListener("click", () => {
    observeMenu.style.visibility = "hidden";
});

function objectToString(object_num) {
    switch (object_num) {
        case 2:
            return "dwarf";
        case 3:
            return "comet";
        case 4:
            return "asteroid";
        case 5:
            return "gascloud";
        case 6:
            return "empty";
    }
}

function objectToStringKR(object_num) {
    switch (object_num) {
        case 2:
            return "왜소행성";
        case 3:
            return "혜성";
        case 4:
            return "소행성";
        case 5:
            return "가스구름";
        case 6:
            return "빈 섹터";
    }
}

function observeCost() {
    if (observeStartSector <= observeEndSector) {
        if (observeEndSector - observeStartSector >= 3) {
            return 3;
        } else {
            return 4;
        }
    } else {
        if (observeStartSector + 12 - observeEndSector >= 3) {
            return 3;
        } else {
            return 4;
        }
    }
}

function observeMenuReset() {
    selectObjectButton.style.display = "block";
    selectedObjectButton.style.display = "none";
    selectRangeMenu.style.display = "none";
    selectStartRangeBtn.innerHTML = "(시작 섹터)";
    selectEndRangeBtn.innerHTML = "(끝 섹터)";
    selectEndRangeBtn.disabled = true;
    selectEndRangeBtn.style.backgroundColor = "darkgray";
    observeEndSector = undefined;
    observeStartSector = undefined;
    disableObserveBtn();
}

function initialize() {
    darkSector.style.zIndex = 20;
    centerCircle.style.zIndex = 21;
    setCover();
}

function enableObserveBtn() {
    observeBtn.disabled = false;
    observeBtn.innerHTML = `관측(${observeCost()})`;
    observeBtn.style.backgroundColor = "black";
}

function disableObserveBtn() {
    observeBtn.disabled = true;
    observeBtn.innerHTML = "관측";
    observeBtn.style.backgroundColor = "darkgray";
}

function moveSector(sector = 1) {
    startSector = (startSector + sector) % 12;
    for (let i = 0; i < 6; i++) {
        startSectorsBtns[i].innerHTML = ((startSector + i) % 12) + 1;
        endSectorsBtns[i].innerHTML = ((startSector + i) % 12) + 1;
    }
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

initialize();
