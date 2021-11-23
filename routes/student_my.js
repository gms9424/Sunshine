var express = require("express");
var app = express();
var router = express.Router();
var connection = require("../config/db");

router.get("/", function (req, res) {
  console.log(req.session);

  if (req.session.uid) {
    //res.render("student_my");

    connection.query(
      "select * from student where student_id=?",
      [req.session.uid],
      function (err, rows) {
        if (rows.length) {
          if (rows[0].student_id === req.session.uid) {
            var context = [rows[0].student_id, rows[0].student_name];
            //res.render("student_my", { data: context });

            const context1 = [];

            connection.query(
              "select date_format(course_date, '%Y-%m-%d') as course_date, degree, course_name from course join attendance on course.course_id = attendance.course_id and attendance.student_id=?",
              [req.session.uid],
              function (err, rows1) {
                if (err) {
                  throw err;
                }

                for (var i = 0; i < rows1.length; i++) {
                  context1[i] = [rows1[i]];
                }
                res.render("student_my", { data: context, data1: context1 });
              }
            );
          }
        }
      }
    );
  } else {
    res.write(
      "<script type='text/javascript'>alert('Please log in');</script>"
    );
    res.write("<script type='text/javascript'>location.href='/login'</script>");
  }
});

module.exports = router;