const config = require("../config/db.config");
const sql = require("mssql");

const changeShippingState = async(id, status) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection
        .request()
        .input('Status_Shipping', sql.NVarChar, status)
        .input('id', sql.Int, id)
        .query(`
          UPDATE dbo.Orders
          SET Status_Shipping = @Status_Shipping, View_Status = 0
          WHERE id = @id;
        `);
      
      return result.recordset;
      
    }catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    changeShippingState
}