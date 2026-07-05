package sba301.fe.controller;

import sba301.fu.pojo.Student;

public class SessionContext {
    private static Student loggedInStudent;

    public static Student getLoggedInStudent() {
        return loggedInStudent;
    }

    public static void setLoggedInStudent(Student student) {
        loggedInStudent = student;
    }

    public static void clear() {
        loggedInStudent = null;
    }
}
