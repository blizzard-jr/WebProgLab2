package org.example.webproglab2;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;

import org.jboss.logging.Logger;



@WebServlet(name = "ControllerServlet", urlPatterns = {"/controller"})
public class ControllerServlet extends HttpServlet{
    static public Instant startTime;

    static public Instant getStartTime() {
        return startTime;
    }

    private static final Logger logger = Logger.getLogger(ControllerServlet.class);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.info("Запрос принят постом");
        processRequest(req, resp);
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.info("Запрос принят гетом");
        processRequest(req, resp);
    }

    protected void processRequest(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        startTime = Instant.now();
        logger.info("Запрос прошёл на стадию обработки");
        String action = req.getParameter("action");
        logger.info("Action is " + action);
        RequestDispatcher dispatcher;
        switch (action) {
            case "pointsData":
                logger.info("Тут всё ок");
                dispatcher = req.getRequestDispatcher("/check");
                dispatcher.forward(req, resp);
                break;
            case "someThing":
                logger.info("Вот ты и попался");
                dispatcher = req.getRequestDispatcher("src/main/webapp/index.jsp");
                dispatcher.forward(req, resp);
                break;
        }
    }
}
