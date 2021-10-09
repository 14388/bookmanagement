package com.bookapp.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class JSONUtil {
    private ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode getJSONFromRequest(HttpServletRequest request) {
        try {
            // Get JSON from POST request
            String line = null;
            StringBuffer stringBuffer = new StringBuffer();
            BufferedReader reader = request.getReader();
            while((line = reader.readLine()) != null) {
                stringBuffer.append(line);
            }
            JsonNode readJSON = objectMapper.readTree(stringBuffer.toString());
            return readJSON;
        } catch (IOException exception) {
            exception.printStackTrace();
            return null;
        }
    }

    // Convert given Java object to a JSON string then write that string to given response
    public void writeObjectAsJSONResponse(HttpServletResponse response, Object object) {
        try {
            String objectJSON = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
            PrintWriter printWriter = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Access-Control-Allow-Origin", "*");
            printWriter.write(objectJSON);
            printWriter.close();
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }

    // Write given created JSON string to given response
    public void writeCreatedJSONToResponse(HttpServletResponse response, String createdJSON) {
        try {
            PrintWriter printWriter = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Access-Control-Allow-Origin", "*");
            printWriter.write(createdJSON);
            printWriter.close();
        } catch(IOException exception) {
            exception.printStackTrace();
        }
    }
}
