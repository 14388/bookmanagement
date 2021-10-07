package com.bookapp.util;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {
    //Configs at initialization
    public Connection getConnection() {
        String name,pass,url;  
        Connection con = null;  
        try {  
            Class.forName("com.mysql.jdbc.Driver");  
            url="jdbc:mysql://localhost:3306/bookapplication";  
            name="root";  
            pass="Congduy24396";  
            con = DriverManager.getConnection(url,name,pass);  
            return con;
            }  
            catch (Exception e) {  
            System.out.println(e.toString());  
            return null;
        }  
    }
}
