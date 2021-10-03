package com.bookapp.util;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DBUtil {
    //Configs at initialization
    public Connection getConnection() {
        try {
            Context initContext = new InitialContext();
            Context envContext = (Context) initContext.lookup("java:comp/env");
            DataSource ds = (DataSource) envContext.lookup("jdbc/bookapplication");
            return ds.getConnection();
        } catch (SQLException sqlException) {
            sqlException.printStackTrace();
            return null;
        } catch (NamingException namingException) {
            namingException.printStackTrace();
            return null;
        }
    }
}
