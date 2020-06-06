const express = require('express');

//Initializing app
const app = express();

//Setting port to run app
// const PORT = process.env.PORT || 8000
const PORT = 5003

//test route
app.get(/root/, (req, res) => {
    console.log(req)
    console.log("reached");
    res.send("tested");
});

// app starts from here
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;