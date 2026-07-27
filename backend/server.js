const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database successfully.');
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


db.connect(err => {
    if(err) console.error('Database connection failed:', err);
    else console.log('Connected to MySQL Database');
});
app.post('/api/login', (req, res) => {
    const { userName, password } = req.body;
    
    const sql = "SELECT * FROM tbllogin WHERE userName = ? AND password = ?";
    
    db.query(sql, [userName, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length > 0) {
            res.json({ success: true, user: result[0], message: "Login Successful" });
        } else {
            res.status(401).json({ success: false, message: "Username or password error!" });
        }
    })
});
app.get('/api/companies', (req, res) => {
    const sql = "SELECT * FROM tblcompany";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fetch Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/companies', (req, res) => {
    const { companyId, companyname, address, contact, email, fileCount, lastDocCount } = req.body;

    const sql = "INSERT INTO tblcompany (companyId, companyname, address, contact, email, fileCount, lastDocCount) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [companyId, companyname, address, contact, email, fileCount, lastDocCount], (err, result) => {
        if (err) {
            console.error("Insert Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: "Company added successfully!" });
    });
});

app.put('/api/companies/:id', (req, res) => {
    const { companyname, address, contact, email, fileCount, lastDocCount } = req.body;    
    
    const sql = "UPDATE tblcompany SET companyname=?, address=?, contact=?, email=?, fileCount=?, lastDocCount=? WHERE companyId=?";
    
    db.query(sql, [companyname, address, contact, email, fileCount, lastDocCount, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Company updated successfully!" });
    });
});

app.delete('/api/companies/:id', (req, res) => {
    const sql = "DELETE FROM tblcompany WHERE companyId=?";
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Company deleted successfully!" });
    });
});
app.post('/api/sales', (req, res) => {
    const {
        headerId, OperatorId, OperatorName, invoiceNumber,
        vehicleNo, vehicleModel, transactionDate, transactionTime,
        destination, paymentType, noOfVehicle, invoiceAmount,
        cancellation, TotalAmount, DateTime
    } = req.body;

    const query = `
        INSERT INTO tblsaleheader 
        (headerId, OperatorId, OperatorName, invoiceNumber, vehicleNo, vehicleModel, transactionDate, transactionTime, destination, paymentType, noOfVehicle, invoiceAmount, cancellation, TotalAmount, DateTime) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        headerId, OperatorId, OperatorName, invoiceNumber,
        vehicleNo, vehicleModel, transactionDate, transactionTime,
        destination, paymentType, noOfVehicle, invoiceAmount,
        cancellation, TotalAmount, DateTime
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Sale record saved successfully!" });
    });
});

app.get('/api/sales', (req, res) => {
    const { userType, operatorName } = req.query;

    let query = "SELECT * FROM tblsaleheader";
    let params = [];
    if (userType && userType !== 'admin' && operatorName) {
        query += " WHERE OperatorName = ?";
        params.push(operatorName);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(results);
    });
});
app.listen(5000, () => {
    console.log('Backend server running on port 5000');
});