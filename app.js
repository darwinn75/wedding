const express = require("express")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.set("view engine", "ejs")
// Specify the directory where your views are located
app.set("views", __dirname + "/public")
const port = process.env.PORT || 3000
const db = new sqlite3.Database("wedding.db")

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// Create table
db.run(
	"CREATE TABLE IF NOT EXISTS guests (id INTEGER PRIMARY KEY AUTOINCREMENT, guestName TEXT, prenom TEXT, nombrePersonnes INTEGER, evenement TEXT, remarque TEXT )"
)

// Routes
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html")
})

app.post("/submit-form", (req, res) => {
	const { guestName, prenom, nombrePersonnes, evenement, remarque } = req.body
	db.run(
		"INSERT INTO guests (guestName, prenom, nombrePersonnes, evenement, remarque) VALUES (?, ?, ?, ?, ?)",
		[guestName, prenom, nombrePersonnes, evenement, remarque],
		(err) => {
			if (err) {
				return console.error(err.message)
			}
			// Redirect to the confirmation page instead of sending text
			res.redirect(
				`/confirmation?guestName=${guestName}&prenom=${prenom}&nombrePersonnes=${nombrePersonnes}&evenement=${evenement}&remarque=${remarque}`
			)
		}
	)
})

app.get("/confirmation", (req, res) => {
	const { guestName, prenom, nombrePersonnes, evenement, remarque } = req.query
	// Render the confirmation HTML page with guest information
	res.render("confirmation", { guestName, prenom, nombrePersonnes, evenement, remarque })
})

// Developer route to see all submissions
app.get("/view-guests", (req, res) => {
	db.all("SELECT * FROM guests", [], (err, rows) => {
		if (err) {
			throw err
		}

		// Construct HTML table dynamically
		let tableHtml =
			"<table border='1'><tr><th>Guest Name</th><th>First Name</th><th>Number of Guests</th><th>Event</th><th>Remarks</th></tr>"
		rows.forEach((row) => {
			tableHtml += `<tr><td>${row.guestName}</td><td>${row.prenom}</td><td>${row.nombrePersonnes}</td><td>${row.evenement}</td><td>${row.remarque}</td></tr>`
		})
		tableHtml += "</table>"

		// Send the HTML response
		res.send(tableHtml)
	})
})

// Start server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
