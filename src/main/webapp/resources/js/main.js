let clickedPoints = [];
const canvas = document.getElementById("graphCanvas")
const ctx = canvas.getContext("2d");
let hasUserInputR;

window.onload = function () {
        setCanvasDPI();
        drawGraph(3);
        drawPoint();
    }
    const rOptions = document.querySelectorAll('input[name="r"]');
    // Функция для проверки, выбрано ли значение
    function checkSelectedR() {

        rOptions.forEach((option) => {
            if (option.checked) {
                hasUserInputR = option.value;
                drawGraph(option.value);
            }
        });

    }

    // Добавляем обработчик события change на каждый элемент
    rOptions.forEach((option) => {
        option.addEventListener("change", checkSelectedR);
    });

canvas.addEventListener("click", handleClick);

function handleClick(event) {
    if(hasUserInputR) {
        const rect = canvas.getBoundingClientRect();
        // Смещение относительно верхнего левого угла canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Перевод координат в систему координат с центром в середине canvas
        const centerX = x - canvas.width / 2;
        const centerY = canvas.height / 2 - y; // инвертируем Y для положительного направления вверх
        // Масштабирование на основе радиуса, если R
        const scaledX = centerX / 66.6666;
        const scaledY = centerY / 66.6666;
        // Проверка, находится ли точка в нужной области, с учетом радиуса
        isPointInsideDesiredArea(scaledX, scaledY, hasUserInputR);
    }
    else{
        showToastError("Выберите значение r");
        return;
    }
}


    let dynamicScalingFactor;

    function setCanvasDPI() {
        let dpi = window.devicePixelRatio;
        let canvasElement = document.getElementById('graphCanvas');
        let style = {
            height() {
                return +getComputedStyle(canvasElement).getPropertyValue('height').slice(0, -2);
            },
            width() {
                return +getComputedStyle(canvasElement).getPropertyValue('width').slice(0, -2);
            }
        };

        canvasElement.setAttribute('width', style.width() * dpi);
        canvasElement.setAttribute('height', style.height() * dpi);
    }

    function drawGraph(R) {
        let width = canvas.width;
        let height = canvas.height;

        let baseScaling = width / 6;
        dynamicScalingFactor = baseScaling * R;
        let yAxisOffset = 15;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.font = "15px Arial";

        // Draw x and y axes
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        ctx.beginPath();
        drawAxis(ctx, 0, height / 2, width, height / 2);  // X-axis
        drawAxis(ctx, width / 2, height, width / 2, 0); // Y-axis
        ctx.stroke();

        // Drawing the areas

        // Triangle (upper right)
        ctx.fillStyle = "#0000FF10"; // blue with 10% opacity
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width / 2, height / 2 - 3 * baseScaling);
        ctx.lineTo(width / 2 + 3 * baseScaling, height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#0000FF";
        ctx.stroke();
        // Rectangle (lower right)
        ctx.fillStyle = "#FFFF0010"; // yellow with 10% opacity
        ctx.fillRect(width / 2, height / 2, 3 * baseScaling/2, 3 * baseScaling);
        ctx.strokeStyle = "#FFFF00";
        ctx.strokeRect(width / 2, height / 2, 3 * baseScaling/2, 3 * baseScaling);

        // Semi-circle (lower left)
        ctx.fillStyle = "#39FF1410"; // green with 10% opacity
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 3 * baseScaling, 0.5 * Math.PI,  Math.PI);
        ctx.lineTo(width / 2, height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#39FF14";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 3 * baseScaling, 0.5 * Math.PI, Math.PI);
        ctx.stroke();
        // Draw labels
        ctx.fillStyle = "white";
        const labelR = hasUserInputR ? R.toString() : "R";
        const labelRHalf = hasUserInputR ? (R / 2).toString() : "R/2";

        // X-axis labels
        ctx.fillText(labelR, width / 2 + 3 * baseScaling, height / 2 + 30);
        ctx.fillText(labelRHalf, width / 2 + 3 * baseScaling/2, height / 2 + 30);
        ctx.fillText('-' + labelR, width / 2 - 3 * baseScaling, height / 2 + 30);
        ctx.fillText('-' + labelRHalf, width / 2 - 3 * baseScaling/2, height / 2 + 30);

        // Y-axis labels
        ctx.fillText(labelR, width / 2 + yAxisOffset, height / 2 - 3 * baseScaling);
        ctx.fillText(labelRHalf, width / 2 + yAxisOffset, height / 2 - 3 * baseScaling/2);
        ctx.fillText('-' + labelR, width / 2 + yAxisOffset, height / 2 + 3 * baseScaling);
        ctx.fillText('-' + labelRHalf, width / 2 + yAxisOffset, height / 2 + 3 * baseScaling/2);

        // Draw ticks
        ctx.fillStyle = "white";
        // X-axis tics
        const tickLength = 10; // Length of the tick marks
        for (let tickValue = -R; tickValue <= R; tickValue += R / 2) {
            const xTickPosition = width / 2 + tickValue * 3 * baseScaling;
            ctx.beginPath();
            ctx.moveTo(xTickPosition, height / 2 - tickLength / 2);
            ctx.lineTo(xTickPosition, height / 2 + tickLength / 2);
            ctx.stroke();
        }

        // Y-axis tics
        for (let tickValue = -R; tickValue <= R; tickValue += R / 2) {
            const yTickPosition = height / 2 - tickValue * 3 * baseScaling;
            ctx.beginPath();
            ctx.moveTo(width / 2 - tickLength / 2, yTickPosition);
            ctx.lineTo(width / 2 + tickLength / 2, yTickPosition);
            ctx.stroke();
        }
        if (hasUserInputR) {
            // console.log("drawing points");
            drawAllPoints();
        }
    }

    function drawAxis(context, fromX, fromY, toX, toY) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        context.moveTo(toX, toY);
        context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        context.stroke();
    }

    function drawPoint() {
        const table = document.getElementById("result");
        // Получить все строки таблицы (тег <tr>)
        const rows = table.querySelectorAll("tr");
        let x;
        let y;
        let res;
// Пройтись по каждой строке, пропуская заголовки, если они есть
        rows.forEach((row, index) => {
            // Найти все ячейки в строке
            const cells = row.querySelectorAll("td");
            // Сохранять данные только если строка содержит ячейки
            if (cells.length > 0) {
                // Извлечь текстовое содержимое из ячеек
                x = cells[0].textContent.trim();
                y= cells[1].textContent.trim();
                res = cells[3].textContent.trim();
                }
            if (res == "Luck"){
                ctx.fillStyle = "green";
            }
            else{
                ctx.fillStyle ="red";
            }
            ctx.beginPath();
            ctx.arc(canvas.width/2 + x * 66, canvas.height/2 - y * 66, 5, 0, Math.PI * 2);
            ctx.fill();
            clickedPoints.push(canvas.width/2 + x * 66, canvas.height/2 - y * 66);
            clickedPoints.push({
                x: canvas.width / 2 + x * 66,
                y: canvas.height / 2 - y * 66,
                c: res ? "green" : "red"
            });
        });
    }

    async function drawAllPoints() {
        clickedPoints.forEach(point => {
            ctx.fillStyle = point.c;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            //ctx.fillStyle = "blue"; // Цвет точки
            ctx.fill();
        });
    }
async function isPointInsideDesiredArea(x, y, r) {
    try {
        const response = await fetch("/WebProgLab2-1.0-SNAPSHOT/controller", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "action": "pointsData",
                "x": x,
                "y": y,
                "r": r
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                drawPoint();
                window.location.href = '../../result.jsp';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    } catch (error) {
        showToastError(`There was an error processing your request: ${error.message}`);
        return null;
    }
}

    // function updateTableAndGraph(data) {
    //
    //     let parsedX = parseInt(data.x);
    //     let parsedY = parseFloat(data.y);
    //     let parsedR = parseFloat(data.r);
    //
    //     // Draw the new point directly
    //     drawPoint(parsedX, parsedY, data.isHit);
    //
    //     // Push it to clickedPoints
    //     clickedPoints.push({x: parsedX, y: parsedY, r: parsedR, isHit: data.isHit});
    //
    //     // Update Table
    //     const table = document.getElementById('result');
    //     const newRow = table.insertRow();
    //     const cell1 = newRow.insertCell(0);
    //     const cell2 = newRow.insertCell(1);
    //     const cell3 = newRow.insertCell(2);
    //     const cell4 = newRow.insertCell(3);
    //
    //     cell1.innerHTML = data.x;
    //     cell2.innerHTML = data.y;
    //     cell3.innerHTML = data.r;
    //     cell4.innerHTML = data.isHit ? 'Hit' : 'Didn\'t hit';
    // }


// let y;
// const formWithData = document.getElementById("pointForm");
// formWithData.addEventListener('submit', submitHandler);
// const canvas = document.getElementById("graphCanvas");
// const ctx = canvas.getContext("2d");
// const scale = (Math.min(canvas.width, canvas.height) / 3);
// const xCenter = canvas.width / 2;
// const yCenter = canvas.height / 2;
// console.log(ctx);
// canvas.addEventListener("click", function (event) {
//     let r = getR(new FormData(formWithData));
//     if (isNaN(r)){
//         invalidR();
//     } else {
//         let curr_x = event.offsetX;
//         let curr_y = event.offsetY;
//         curr_x -= xCenter;
//         curr_y -= yCenter;
//         curr_x /= scale;
//         curr_y /= scale;
//         let x = curr_x * r;
//         y = -curr_y * r;
//         sendRequest(x, y, r);
//     }
// });
// drawGraphic(ctx);
//
// const rSelect = document.getElementsByName("r");
// rSelect.addEventListener("change", (event) => {
//     drawGraphic(ctx);
// })
//
// function yButtonHandler(value){
//     let yButtonList = document.getElementsByName("y");
//     for (let i = 0; i < yButtonList.length; i++){
//         if (yButtonList[i].getAttribute("value") == value) {
//             yButtonList[i].style.background = "#888";
//         }
//         else {
//             yButtonList[i].style.background = "#333";
//             yButtonList[i].style.color = "white";
//         }
//     }
//     y = value;
// }
//
// function drawGraphic(ctx){
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = "2";
//     console.log(xCenter, yCenter, scale);
//
//     ctx.beginPath();
//     ctx.arc(xCenter, yCenter, scale, 0, -Math.PI / 2, true);
//     ctx.lineTo(xCenter, yCenter);
//     ctx.closePath();
//
//     ctx.fillStyle = "lightblue"
//     ctx.fill();
//
//     ctx.fillRect(xCenter - scale, yCenter, scale, scale / 2);
//
//     ctx.beginPath();
//     ctx.moveTo(xCenter, yCenter);
//     ctx.lineTo(xCenter + scale / 2, yCenter);
//     ctx.lineTo(xCenter, yCenter + scale);
//     ctx.closePath();
//
//     ctx.fill();
//
//     ctx.beginPath();
//     ctx.moveTo(0, yCenter);
//     ctx.lineTo(canvas.width, yCenter);
//     ctx.stroke();
//
//     ctx.beginPath();
//     ctx.moveTo(xCenter, 0);
//     ctx.lineTo(xCenter, canvas.height);
//     ctx.stroke();
//
//     ctx.textAlign = "left";
//     ctx.textBaseline = "middle";
//     ctx.fillStyle = "black";
//     ctx.font = "14px Arial";
//     let r = getR(new FormData(formWithData));
//     if (isNaN(r)) {
//         ctx.fillText("-R", xCenter + 7, yCenter + scale);
//         ctx.fillText("R", xCenter + 7, yCenter - scale);
//         ctx.fillText("-R/2", xCenter + 7, yCenter + scale / 2);
//         ctx.fillText("R/2", xCenter + 7, yCenter - scale / 2);
//
//         ctx.fillText("-R", xCenter - scale, yCenter - 10);
//         ctx.fillText("R", xCenter + scale, yCenter - 10);
//         ctx.fillText("-R/2", xCenter - scale / 2, yCenter - 10);
//         ctx.fillText("R/2", xCenter + scale / 2, yCenter - 10);
//     } else {
//         ctx.fillText(-r, xCenter + 7, yCenter + scale);
//         ctx.fillText(r, xCenter + 7, yCenter - scale);
//         ctx.fillText(-r / 2, xCenter + 7, yCenter + scale / 2);
//         ctx.fillText(r / 2, xCenter + 7, yCenter - scale / 2);
//
//         ctx.fillText(-r, xCenter - scale, yCenter + 10);
//         ctx.fillText(r, xCenter + scale, yCenter + 10);
//         ctx.fillText(-r / 2, xCenter - scale / 2, yCenter + 10);
//         ctx.fillText(r / 2, xCenter + scale / 2, yCenter + 10);
//
//         let points = document.getElementsByClassName("table-line");
//         for (let point of points){
//             let xTable = point.querySelectorAll(".x-table")[0].innerText;
//             let yTable = point.querySelectorAll(".y-table")[0].innerText;
//             let rTable = point.querySelectorAll(".r-table")[0].innerText;
//             let hittingTable = point.querySelectorAll(".hitting-table")[0].innerText;
//             if (parseFloat(rTable) === r) {
//                 if (hittingTable === "true") {
//                     drawPoint(ctx, parseFloat(xTable), parseFloat(yTable), r, "green");
//                 } else {
//                     drawPoint(ctx, parseFloat(xTable), parseFloat(yTable), r, "red");
//                 }
//             }
//         }
//     }
// }
//
// function invalidR(){
//     let errDiv = document.getElementById("rError-message");
//     errDiv.style.display = "inline";
// }
//
// function invalidX (){
//     let errDiv = document.getElementById("xError-message");
//     errDiv.style.display = "inline";
// }
//
// function invalidY() {
//     let errDiv = document.getElementById("yError-message");
//     errDiv.style.display = "inline";
// }
//
// function getR(formData){
//     return parseFloat(formData.get("r"))
// }
//
// function clearFull(){
//     let XerrDiv = document.getElementById("xError-message")[0];
//     XerrDiv.style.display = "none";
//     let YerrDiv = document.getElementById("yError-message")[0];
//     YerrDiv.style.display = "none";
//     let RerrDiv = document.getElementById("rError-message")[0];
//     RerrDiv.style.display = "none";
//     document.getElementById("X").value = "";
//     clearY();
// }
//
// function clearY(){
//     y = null;
//     let yButtonList = document.getElementById("Y-button").getElementsByTagName("input");
//     for (let i = 0; i < yButtonList.length; i++){
//         yButtonList[i].style.background = "#333";
//         yButtonList[i].style.color = "white";
//     }
// }
//
// function getX(formData){
//     let value = formData.get("x");
//     if (value!= null && value.match(/^-?\d+(\.\d+)?$/) && -3 <= value && value <= 5) return parseFloat(value);
//     else {
//         return null;
//     }
// }
//
// function submitHandler(event){
//     event.preventDefault();
//     let formData = new FormData(formWithData);
//     let x = getX(formData);
//     let r = getR(formData);
//     if (!isNaN(r) && y!= undefined  && y != null && x != null) sendRequest(x, y, r);
//     else {
//         console.log(false);
//         if (typeof(r) != "number") invalidR();
//         if (y === null || y === undefined) invalidY();
//         if (x === null) invalidX();
//     }
// }
//
// async function sendRequest(x, y, r){
//     let data = {x: x, y: y, r: r};
//     console.log(data);
//     let response = await fetch("../controller", {
//         method: "POST",
//         headers: {
//             "Content-type": "application/json",
//         },
//         body: JSON.stringify(data)
//     });
//     if (response.ok){
//         document.body.innerHTML = await response.text();
//     } else {
//         console.log(response.status);
//     }
//     clearFull();
// }
//
// function drawPoint(ctx, x, y, r, color){
//     ctx.fillStyle = color;
//     if (!isNaN(r)) {
//         let scaleX = xCenter + (x / r) * scale;
//         let scaleY = yCenter - (y / r) * scale;
//         console.log(scaleX, scaleY);
//         ctx.beginPath();
//         ctx.arc(scaleX, scaleY, 5, 0, Math.PI * 2);
//         ctx.fill();
//     }
//}