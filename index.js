const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoose } = require("./connect");
const URL = require("./models/url")
const path = require("path")

const app = express();
const PORT = 8001;


// connecting to monodb
connectToMongoose("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

// middleware
app.use(express.json());


app.get("/test", async (req, res) =>{
    const allUrls = await URL.find({})
    return res.render('home')
})

// route
app.use("/url", urlRoute);


// taking to the particular website
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});


// to open in localport-8001
app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));
