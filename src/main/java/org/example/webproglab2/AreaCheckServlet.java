package org.example.webproglab2;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "AreaCheckServlet", urlPatterns = {"/check"})
public class AreaCheckServlet extends HttpServlet {
    private static final Logger logger = Logger.getLogger(ControllerServlet.class);
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("Запрос принят");
        processRequest(request, response);
    } 
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        logger.info("Запрос прошёл на второй этап");
        double x = Double.parseDouble(request.getParameter("x"));
        BigDecimal bd = new BigDecimal(x).setScale(3, RoundingMode.HALF_UP); // Округляем до 3 знаков
        x = bd.doubleValue();
        double y = Double.parseDouble(request.getParameter("y"));
        BigDecimal bdY = new BigDecimal(y).setScale(3, RoundingMode.HALF_UP); // Округляем до 3 знаков
        y = bdY.doubleValue();
        double r = Double.parseDouble(request.getParameter("r"));
        // Логика проверки попадания точки в область
        boolean isInside = checkArea(x, y, r);
        final String homePath = this.getServletContext().getContextPath();
        HttpSession session = request.getSession();
        List<Double> xValues = (List<Double>) session.getAttribute("xValues");
        List<Double> yValues = (List<Double>) session.getAttribute("yValues");
        List<Double> rValues = (List<Double>) session.getAttribute("rValues");
        List<String> results = (List<String>) session.getAttribute("results");
        List<Long> executionTimes = (List<Long>) session.getAttribute("executionTimes");
        List<String> currentTimes = (List<String>) session.getAttribute("currentTimes");
        if (xValues == null) {
            xValues = new ArrayList<>();
            yValues = new ArrayList<>();
            rValues = new ArrayList<>();
            results = new ArrayList<>();
            executionTimes = new ArrayList<>();
            currentTimes = new ArrayList<>();
        }
        xValues.add(0, x);
        yValues.add(0, y);
        rValues.add(0, r);
        results.add(0, isInside ? "Luck" : "Unluck");
        Instant endTime = Instant.now();
        Duration duration = Duration.between(ControllerServlet.getStartTime(), endTime);
        executionTimes.add(0, duration.toMillis());
        currentTimes.add(0, String.valueOf(Instant.now()));

        session.setAttribute("xValues", xValues);
        session.setAttribute("yValues", yValues);
        session.setAttribute("rValues", rValues);
        session.setAttribute("results", results);
        session.setAttribute("executionTimes", executionTimes);
        session.setAttribute("currentTimes", currentTimes);


        request.getRequestDispatcher("/result.jsp").forward(request, response);

//        response.sendRedirect(request.getContextPath() + "/result.jsp");
//        dispatcher.forward(request, response);
//        response.setContentType("text/html;charset=UTF-8");
//        final PrintWriter out = response.getWriter();
//        out.println("<!DOCTYPE html>");
//        out.println("<html lang=\"en\">");
//        out.println("<head>");
//        out.println("    <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"UTF-8\" />");
//        out.println("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
//        out.println("    <title>Calculation result</title>");
//        out.println("</head>");
//        out.println("<body>");
//        out.println("    <div id=\"header\" class=\"blured-container round-container margin\">");
//        out.println("        <h1>Calculation results</h1>");
//        out.println("    </div>");
//        out.println("    <div id=\"result-table-container\" class=\"blured-container margin\">");
//        out.println("        <table>");
//        out.println("            <tr>");
//        out.println("                <th>Parameter</th>");
//        out.println("                <th>Received Value</th>");
//        out.println("            </tr>");
//        out.println("            <tr>");
//        out.println("                <td>X</td>");
//        out.println("                <td>" + x + "</td>");
//        out.println("            </tr>");
//        out.println("            <tr>");
//        out.println("                <td>Y</td>");
//        out.println("                <td>" + y + "</td>");
//        out.println("            </tr>");
//        out.println("            <tr>");
//        out.println("                <td>R</td>");
//        out.println("                <td>" + r + "</td>");
//        out.println("            </tr>");
//        out.println("        </table>");
//        out.println("    </div>");
//        out.println("    <div class=\"blured-container round-container fit-content-container margin\">");
//        out.println("        <p>Result: " + (isInside ? "Luck" : "Unluck") + "</p>");
//        out.println("    </div>");
//        out.println("    <div class=\"blured-container round-container fit-content-container margin\">"); // Здесь подставьте результат вычислений
//        out.println("        <p><a href=\"" + homePath + "/\">Return to homepage</a></p>");
//        out.println("    </div>");
//        out.println("</body>");
//        out.println("</html>");
//
//        out.close();
    }

    private boolean checkArea(double x, double y, double r) {
        if (x == 0 && y == 0) {
            return true;
        } else if (x < 0 && y > 0) {
            return false;
        } else if (x > 0 && y < 0) {
            return x <= r / 2 && Math.abs(y) <= r;
        } else if (x < 0 && y < 0) {
            return r * r >= x * x + y * y;
        } else if (x > 0 && y > 0) {
            double func = -4 * x - r;
            return func <= y;
        } else {
            return false;
        }

    }
}