const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json());

const connection = mysql.createConnection ({
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "treesdb"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//@POST
//@ "/"
app.post("/medziai", (req, res)=>{
let sql = `INSERT INTO trees (name, height, type) VALUES (?,?,?);`;

connection.query(sql, [req.body.name, req.body.height, req.body.type], (err, result)=>{
  if (err) {
    console.error("Error insert data", err);
    return res
    .status(500)
    .json({message: "Error insertind data.", error: err.message});
  }
});

res.json({message: "Data inserted succesfully"});
})

// @ GET
// @ "/medziai"
app.get("/medziai",(req, res)=>{
  let sql = `SELECT * FROM trees;`

  connection.query(sql, function (err, result) {
    if (err) {
      throw err;
    }

    res.json(result);
  });
});

// @ GET :id
// @ "/medziai"
app.get("/medziai/:id", (req, res)=>{
  let sql = 
  `SELECT * FROM trees
  WHERE id = ?;`;

  connection.query(sql,[req.params.id],(err, result)=>{
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({message: "error: ", err: err.message});
    }
    if (result.length === 0) {
      return res.status(404).json({message: "TREE not found"});
    }

    res.json(result[0]);

  });

});

// @PUT :id
// @ "/medziai"
app.put("/medziai/:id", (req, res)=>{
  let sql =
  `UPDATE trees
  SET name = ?, height = ?, type = ?
  WHERE id = ?;`;

  connection.query(sql,[req.body.name, req.body.height, req.body.type, req.params.id],
  function(err, result) {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({ message: "error: ", err: err.message});
    }
    const selectSQL = `SELECT * FROM trees WHERE id = ?;`
    connection.query(
      selectSQL,
      [req.params.id],
      function (err, updatedResult) {
        if (err) {
          console.log("error: ", err);
          return res
            .status(500)
            .json({message: "error: ", err: err.message});
        }
        res.json({
          message: "Record updated",
          updatedRecord: updatedResult[0],
        });
      }
    );
  }
  )
})

// @DELETE :id
// @ "/medziai"
app.delete("/medziai/:id",(req, res)=>{
  let sql =
  `DELETE FROM trees
  WHERE id = ?;`;

  connection.query(sql,[req.params.id],(err, result)=>{
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({message: "error: ", err: err.message});
    }
    if (result.length === 0) {
      return res.status(404).json({message: "TREE not found"});
    }

    res.json({ message: "Record deleted", deleteRecord: {
      id: req.params.id,
      name: req.body.name,
      height: req.body.height,
      type: req.body.type,
    },
  });
});
});

// listening port:
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})