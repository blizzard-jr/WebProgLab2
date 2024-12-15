<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="blablabla" content="width=device-width, initial-scale=1.0">
    <title>Calculation result</title>
</head>
<body>
<div id="header" class="blured-container round-container margin">
    <h1>Calculation results</h1>
</div>
<div id="result-table-container" class="blured-container margin">
    <table>
        <tr>
            <th>Parameter</th>
            <th>Received Value</th>
        </tr>
        <tr>
            <td>X</td>
            <td>${sessionScope.xValues[0]}</td>
        </tr>
        <tr>
            <td>Y</td>
            <td>${sessionScope.yValues[0]}</td>
        </tr>
        <tr>
            <td>R</td>
            <td>${sessionScope.rValues[0]}</td>
        </tr>
        <tr>
            <td>ExecutionTime</td>
            <td>${sessionScope.executionTimes[0]}</td>
        </tr>
        <tr>
            <td>CurrentTime</td>
            <td>${sessionScope.currentTimes[0]}</td>
        </tr>
    </table>
</div>
<div class="blured-container round-container fit-content-container margin">
    <p>Result: ${sessionScope.results[0]}</p>
</div>
<div class="blured-container round-container fit-content-container margin">
    <p><a href="${pageContext.request.contextPath}/">Return to homepage</a></p>
</div>
</body>
</html>