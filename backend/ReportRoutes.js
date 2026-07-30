const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // 1. Daily Report using tblsaleheader & tblcompany
    router.get('/report', (req, res) => {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Please provide a valid report date!' });
        }

        const query = `
            SELECT 
                s.headerId,
                s.OperatorId,
                IFNULL(c.companyname, 'Not Linked') AS companyName,
                s.invoiceNumber,
                s.vehicleNo,
                s.vehicleModel,
                s.destination,
                s.paymentType,
                s.noOfVehicle,
                s.invoiceAmount,
                s.TotalAmount,
                s.transactionDate,
                s.transactionTime
            FROM tblsaleheader s
            LEFT JOIN tblcompany c ON s.OperatorId = c.companyId
            WHERE DATE(s.transactionDate) = ?
            ORDER BY s.headerId DESC`;

        db.query(query, [date], (err, results) => {
            if (err) {
                console.error("SQL Report Error:", err.sqlMessage || err);
                return res.status(500).json({ message: 'Cant fetch daily report data from database' });
            }
            return res.json(results);
        });
    });

    // 2. Monthly Report using tblsaleheader
    router.get('/report-monthly', (req, res) => {
        const { month } = req.query; // Format: 'YYYY-MM'
        if (!month) {
            return res.status(400).json({ message: 'Please provide a valid report month!' });
        }

        const query = `
            SELECT 
                s.OperatorId,
                IFNULL(c.companyname, 'Not Linked') AS companyName,
                COUNT(s.headerId) AS totalInvoices,
                SUM(IFNULL(s.TotalAmount, 0.00)) AS saleAmount
            FROM tblsaleheader s
            LEFT JOIN tblcompany c ON s.OperatorId = c.companyId
            WHERE DATE_FORMAT(s.transactionDate, '%Y-%m') = ?
            GROUP BY s.OperatorId, c.companyname
            ORDER BY saleAmount DESC`;

        db.query(query, [month], (err, results) => {
            if (err) {
                console.error("SQL Monthly Report Error:", err);
                return res.status(500).json({ message: 'Cant fetch monthly report data' });
            }
            return res.json(results);
        });
    });

    // 3. Shop/Company-wise Monthly Summary
    router.get('/report-shop-monthly-summary', (req, res) => {
        const { shopId, month } = req.query; // shopId is treated as OperatorId
        if (!shopId || !month) {
            return res.status(400).json({ message: 'Please provide both a valid Shop/Operator ID and Target Month!' });
        }

        const query = `
            SELECT 
                DATE_FORMAT(s.transactionDate, '%Y-%m') AS reportMonth,
                s.OperatorId,
                IFNULL(c.companyname, 'Not Linked') AS companyName,
                MAX(s.invoiceNumber) AS lastInvoiceNo,
                DATE_FORMAT(MAX(s.transactionDate), '%Y-%m-%d') AS lastDate,
                SUM(IFNULL(s.TotalAmount, 0.00)) AS saleAmount
            FROM tblsaleheader s
            LEFT JOIN tblcompany c ON s.OperatorId = c.companyId
            WHERE s.OperatorId = ? AND DATE_FORMAT(s.transactionDate, '%Y-%m') = ?
            GROUP BY DATE_FORMAT(s.transactionDate, '%Y-%m'), s.OperatorId, c.companyname`;

        db.query(query, [shopId, month], (err, results) => {
            if (err) {
                console.error("SQL Summary Error:", err);
                return res.status(500).json({ message: 'Error fetching company monthly summary' });
            }
            return res.json(results);
        });
    });

    // 4. Monthly Invoice Count Report
    router.get('/report-monthly-invoice-count', (req, res) => {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ message: 'Please provide a valid report month!' });
        }

        const query = `
            SELECT 
                s.OperatorId,
                IFNULL(c.companyname, 'Not Linked') AS companyName,
                DATE_FORMAT(s.transactionDate, '%Y') AS reportYear,
                DATE_FORMAT(s.transactionDate, '%c') AS reportMonth,
                COUNT(s.invoiceNumber) AS invoiceCount,
                SUM(IFNULL(s.TotalAmount, 0.00)) AS saleAmount
            FROM tblsaleheader s
            LEFT JOIN tblcompany c ON s.OperatorId = c.companyId
            WHERE DATE_FORMAT(s.transactionDate, '%Y-%m') = ?
            GROUP BY s.OperatorId, c.companyname, DATE_FORMAT(s.transactionDate, '%Y'), DATE_FORMAT(s.transactionDate, '%c')
            ORDER BY s.OperatorId ASC`;

        db.query(query, [month], (err, results) => {
            if (err) {
                console.error("SQL Invoice Count Error:", err);
                return res.status(500).json({ message: 'Cant fetch invoice count data' });
            }
            return res.json(results);
        });
    });

    return router;
};