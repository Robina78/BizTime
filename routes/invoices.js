const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get('/', async(req, res, next) => {
    try {
        const result = await db.query(
            `SELECT id, comp_code 
             FROM invoices
             ORDER BY id`);

        return res.json({"invoices": result.rows});
    } catch(e) {
        return next(e)
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
    const result = await db.query(
        `SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date,
        c.name, c.description
        FROM invoices AS i INNER JOIN companies AS c ON (i.comp_code = c.code)
        WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
    }    
    
    const data = result.rows[0];
    const invoice = {
        id: data.id,
        company: {
            code: data.comp_code,
            name: data.name,
            description: data.description
        },
        amt:data.amt,
        paid: data.paid,
        add_date: data.add_date,
        paid_date: data.paid_date
    };

    return res.json({"invoice": invoice});

    } catch (e) {
        next (e)
    }    
});


module.exports = router;