<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src ="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <title>Проверка точки на плоскости</title>
    <link rel="stylesheet" href="styles.css">

</head>
<body>
    <div class="background"></div>


<header>
    <h1>Автор: Метель Леонард Валерьевич</h1>
    <p>Группа: P3212</p>
    <p>Вариант: 409127</p>
</header>

<main>
    <form id="pointForm" onsubmit="submitForm(event)">
        <table>
            <tr id="gr">
                <td colspan="2">
                    <canvas id="graphCanvas" width="200px" height="200px"></canvas>
                </td>
            </tr>
            <tr id="xxx">
                <td><label for="x">Изменение X:</label></td>
                <td id="wh"><input type="text" id="x" name="x" placeholder="-3 ... 5"></td>
            </tr>
            <tr id="yyy">
                <td><label>Изменение Y:</label></td>
                <td>
                    <label><input type="radio" name="y" value="-3"> -3</label>
                    <label><input type="radio" name="y" value="-2"> -2</label>
                    <label><input type="radio" name="y" value="-1"> -1</label>
                    <label><input type="radio" name="y" value="0"> 0</label>
                    <label><input type="radio" name="y" value="1"> 1</label>
                    <label><input type="radio" name="y" value="2"> 2</label>
                    <label><input type="radio" name="y" value="3"> 3</label>
                    <label><input type="radio" name="y" value="4"> 4</label>
                    <label><input type="radio" name="y" value="5"> 5</label>
                </td>
            </tr>
            <tr id="rrr">
                <td><label>Изменение R:</label></td>
                <td>
                    <label><input type="radio" name="r" value="1"> 1</label>
                    <label><input type="radio" name="r" value="1.5"> 1.5</label>
                    <label><input type="radio" name="r" value="2"> 2</label>
                    <label><input type="radio" name="r" value="2.5"> 2.5</label>
                    <label><input type="radio" name="r" value="3"> 3</label>
                </td>
            </tr>
        </table>
        <button id="check" type="submit" style="text-align: center">Проверить</button>
<script>
    function submitForm(event) {
        event.preventDefault();

        // Получение значений формы
        let x = document.getElementById('x').value.trim();
        if (!isValidX(x)) {
            showToastError('Значение X должно быть числом от -3 до 5.');
            return;
        }
        let y = document.querySelector('input[name="y"]:checked');
        if (!y) {
            showToastError('Пожалуйста, выберите значение для Y.');
            return;
        }
        else{
            y = y.value;
        }
        let r = document.querySelector('input[name="r"]:checked');
        if (!r) {
            showToastError('Пожалуйста, выберите значение для R.');
            return;
        }
        else{
            r = r.value
        }
        const formData = new URLSearchParams();

        formData.append('action', 'pointsData');
        formData.append('x', x);
        formData.append('y', y);
        formData.append('r', r);


        fetch('${pageContext.request.contextPath}/controller', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const newRow = `
                    <tr>
                        <td>${sessionScope.x}</td>
                        <td>${sessionScope.y}</td>
                        <td>${sessionScope.r}</td>
                        <td>${sessionScope.result}</td>
                        <td>${sessionScope.executionTime}</td>
                        <td>${sessionScope.currentTime} ms</td>
                    </tr>
                `;

                $('#result tbody').prepend(newRow);
                // Если статус ответа 200, перенаправляем пользователя
                window.location.href = '${pageContext.request.contextPath}/result.jsp';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

        // Проверка X (должно быть числом от -3 до 5)
        function isValidX(value) {
            const x = parseFloat(value);
            return !isNaN(x) && x >= -3 && x <= 5;
        }


        function showToastError(message) {
            toastr.error(message, 'Ошибка', {timeOut: 5000});
        }

        // Показать сообщение об успехе через Toastr
        function showToastSuccess(message) {
            toastr.success(message, 'Успех', {timeOut: 3000});
        }
</script>
        <table id="result">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Result</th>
                <th>Time</th>
                <th>Execution time</th>
            </tr>
            </thead>
            <tbody id="tbody">
            <c:forEach var="item" items="${sessionScope.xValues}" varStatus="status">
                <tr>
                    <td id="xV">${item}</td>
                    <td id="yV">${sessionScope.yValues[status.index]}</td>
                    <td id="rV">${sessionScope.rValues[status.index]}</td>
                    <td id="resV">${sessionScope.results[status.index]}</td>
                    <td>${sessionScope.executionTimes[status.index]} ms</td>
                    <td>${sessionScope.currentTimes[status.index]}</td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </form>
</main>
<script>

</script>
<script src ="${pageContext.request.contextPath}/main.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
</body>
</html>
