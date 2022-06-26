import express from 'express'
import cors from 'cors'
import fs from 'fs'
const app = express()
app.use(cors())
app.use(express.json())


app.get("/*", (req, res, next) => {
    const url = req.url.substring(1)
    let rawdata = fs.readFileSync('links.json');
    let links = JSON.parse(rawdata);
    
    const link = links.datas.find(link => link.rel === url)

    if(!link) {
        res.send("Not found")
        return;
    }
    res.redirect(link.href)
})

app.post("/create", (req, res) => {
    let { href } = req.body

    href?.startsWith("http") || (href = "http://" + href)

    const rel = Array.from({ length: 3 }, () => {
        return Math.random().toString(36)[2]
    }).join("")


    let rawdata = fs.readFileSync('links.json');
    let links = JSON.parse(rawdata);
    links.datas.push({ rel, href })
    fs.writeFileSync('links.json', JSON.stringify(links))
    var url = req.protocol + '://' + req.get('host') + "/" +rel;
    res.json({
        url
    })
})


app.listen(process.env.PORT || 4010, () => {
    console.log("Server is running on port 4010")
})