const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db.js");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/index1.html");
});

//create
app.post("/create", (req, res) => {
  var id = req.body.id;  
  var name = req.body.name;
    var marks = req.body.marks; 
 
    try {
      connection.query(
        "INSERT into demo_table (id,name,marks) values(?,?,?)",
        [id,name, marks],
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            // res.json({ result });
            res.redirect("/data");
          }
        }
      );
    } catch (err) {
      res.send(err);
    }
  });

//read
app.get("/data", (req, res) => {
  const allData = "select * from demo_table";
  connection.query(allData, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      // res.json({ rows });
      res.render("read.ejs", { rows });
    }
  });
});



// //delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from demo_table where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});

//passing data to update page
app.get("/update-data", (req, res) => {
    const updateData = "select * from  demo_table where id=?";
    connection.query(updateData, req.query.id, (err, eachRow) => {
      if (err) {
        res.send(err);
      } else {
        console.log(eachRow[0]);
        result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
        res.render("edit.ejs", { data: eachRow[0] });
      }
    });
  });

  //final update
app.post("/update", (req, res) => {
    const id_data = req.body.hidden_id;
    const name_data = req.body.name;
    const marks_data = req.body.marks;
  
    console.log("id...", req.body.name, id_data);
  
    const updateQuery = "update demo_table set name=?, marks=? where id=?";
  
    connection.query(
      updateQuery,
      [name_data, marks_data, id_data],
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/data");
        }
      }
    );
  });

app.listen(process.env.PORT || 3000, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});