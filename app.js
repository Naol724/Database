// =================================
// 1: Create Database Connection
// =================================
let express = require("express");
let mysql2 = require("mysql2");

const cors = require("cors");
const bodyParser = require("body-parser");

let app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection setup
let db = mysql2.createConnection({
    host: "localhost",
    user: "myDBuser",  
    password: "",      
    database: "mydb"  
});
// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log(" Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database successfully!");
    }
});



// ==================================
// QUESTION 2: Create Tables (via Node.js Script)
// ===================================

// 1.Products Table
const createTables = () => {
    const products = `
CREATE TABLE IF NOT EXISTS Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_url VARCHAR(255),
    product_name VARCHAR(255)
)
`;

db.query(products, (err, results) => {
    if (err) {
        console.error("Error creating Products table:", err.message);
        process.exit(1);
    }
    console.log("Products table created successfully!");
});

//  Product Description Table
const createProductDescription = `
CREATE TABLE IF NOT EXISTS ProductDescription (
    description_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_brief_description VARCHAR(255),
    product_description TEXT,
    product_img VARCHAR(255),
    product_link VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)
`;

db.query(createProductDescription, (err, results) => {
    if (err) {
        console.error(" Error creating ProductDescription table:", err.message);
        process.exit(1);
    }
    console.log(" ProductDescription table created successfully!");
});

// 3. Product Price Table
const createProductPrice = `
CREATE TABLE IF NOT EXISTS ProductPrice (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    starting_price VARCHAR(255),
    price_range VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)
`;

db.query(createProductPrice, (err, results) => {
    if (err) {
        console.error(" Error creating ProductPrice table:", err.message);
        process.exit(1);
    }
    console.log(" ProductPrice table created successfully!");
});

// 4 .Users Table
const createUsers = `
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    user_password VARCHAR(255)
)
`;

db.query(createUsers, (err, results) => {
    if (err) {
        console.error(" Error creating Users table:", err.message);
        process.exit(1);
    }
    console.log("Users table created successfully!");
});

// 5.Orders Table
const createOrders = `
CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
)
`;

db.query(createOrders, (err, results) => {
    if (err) {
        console.error(" Error creating Orders table:", err.message);
        process.exit(1);
    }
    console.log(" Orders table created successfully!");
});
}
createTables();



// =====================================
// QUESTION 3: RECEIVE FORM DATA & INSERT INTO TABLES
// =====================================


app.post("/add-product", (req, res) => {
const {
    product_name,
    product_url,
    product_brief_description,
    product_description,
    product_img,
    product_link,
    starting_price,
    price_range,
} = req.body;

  //  Insert into Products table
    const insertProduct =
    "INSERT INTO Products (product_name, product_url) VALUES (?, ?)";
    db.query(insertProduct, [product_name, product_url], (err, result) => {
    if (err) {
        console.error(" Error inserting product:", err.message);
        return res.status(500).send("Error inserting product");
    }

    const product_id = result.insertId; // Get the newly created product_id

    //  Insert into ProductDescription
    const insertDescription = `
        INSERT INTO ProductDescription 
        (product_id, product_brief_description, product_description, product_img, product_link) 
        VALUES (?, ?, ?, ?, ?)`;
    db.query(
        insertDescription,
        [
        product_id,
        product_brief_description,
        product_description,
        product_img,
        product_link,
        ],
        (err) => {
        if (err) {
            console.error(" Error inserting product description:", err.message);
            return res.status(500).send("Error inserting description");
        }

        //  Insert into ProductPrice
        const insertPrice = `
            INSERT INTO ProductPrice 
            (product_id, starting_price, price_range) 
            VALUES (?, ?, ?)`;
        db.query(
            insertPrice,
            [product_id, starting_price, price_range],
            (err) => {
            if (err) {
                console.error("Error inserting product price:", err.message);
                return res.status(500).send("Error inserting price");
            }

            console.log("New product added successfully!");
            res.send("Product added successfully!");
            }
        );
        }
        );
    });
});

// ==================================
// Start the Server
// ==================================
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3001");
});
