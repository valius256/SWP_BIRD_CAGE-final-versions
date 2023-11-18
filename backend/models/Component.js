const config = require("../config/db.config");
const sql = require("mssql");

const getByComponentCate = async (CateID) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('CateId', sql.VarChar, CateID)
        .query(`
            select * from ComponentDetail
            JOIN dbo.ComponentDetail_Category 
            ON ComponentDetail_Category.ComponentID = ComponentDetail.ID
            WHERE CateID = @CateID
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error)
    }
}

const getAllComponent = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .query(`
            select * from ComponentDetail
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error)
    }
}
const getAComponent = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id',sql.Int,id)
            .query(`
            select * from ComponentDetail
            WHERE Id = @Id
        `)
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error)
    }
}

const getCateByComponent = async (id) => {
    try {
    let poolConnection = await sql.connect(config)
    const response = await poolConnection.request()
        .input('Id',sql.Int, id)
        .query(`
            select distinct c.* 
            from ComponentDetail cd, ComponentDetail_Category cc , Category c 
            WHERE cd.Id = @Id and cd.ID = cc.ComponentID and cc.CateID = c.Id
        `)
        return response.recordset
    } catch (error) {
        console.log("error: ", error)
    }
}

const filterComponents = async (id, name, category, upper_price, lower_price, upper_stock, lower_stock, status,application, page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        conditions.push(`cc.ComponentID = cd.ID`)
        if (id) conditions.push(`cd.id = ${id}`);
        if (name) conditions.push(`cd.Name LIKE N'%${name}%'`);
        if (category && category !== "All") conditions.push(`cd.Type = N'${category}'`);
        if (status && status !== "All") conditions.push(`cd.Status = '${status}'`);
        if (upper_price) conditions.push(`cd.Price <= ${upper_price}`);
        if (lower_price) conditions.push(`cd.Price >= ${lower_price}`);
        if (upper_stock) conditions.push(`cd.Stock <= ${upper_stock}`);
        if (lower_stock) conditions.push(`cd.Stock >= ${lower_stock}`);
        if (application && application !== "All") conditions.push(`cc.CateID = '${application}'`);


        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            select distinct cd.* 
            from ComponentDetail cd, ComponentDetail_Category cc 
            ${conditionString}
            ORDER BY Id ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `            
             select COUNT(*) AS COUNT  
            from ( select distinct cd.* 
                 from ComponentDetail cd, ComponentDetail_Category cc 
                 ${conditionString}) r
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
};

const addNewComponent = async (Name, Type, Material, Color, Description, Price, Stock, Status, Urls, Application) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request();
        const unit = Material == "Nan" ? "Cái" : "Bộ"
        request.input('Name', sql.NVarChar, Name);
        request.input('Description', sql.NVarChar, Description);
        request.input('Price', sql.Int, Price);
        request.input('Stock', sql.Int, Stock);
        request.input('Status', sql.NVarChar, Status);
        request.input('Type', sql.NVarChar, Type);
        request.input('Material', sql.NVarChar, Material);
        request.input('Color', sql.NVarChar, Color);
        request.input('Picture', sql.NVarChar, Urls);
        request.input('Unit', sql.NVarChar, unit)
        const result = await request.query(`
            INSERT INTO dbo.ComponentDetail
            (
            [Name]
            ,[Description]
            ,[Price]
            ,[Stock]
            ,[Status]
            ,[Type]
            ,[Material]
            ,[Color]
            ,[Picture]
            ,[Unit]
            )
            VALUES
            (
                @Name, 
                @Description, 
                @Price,
                @Stock, 
                @Status, 
                @Type, 
                @Material,
                @Color, 
                @Picture,
                @Unit
            );
        `);

        const createdIdRs = await poolConnection.request().query(`SELECT TOP 1 Id FROM ComponentDetail ORDER BY Id DESC`);
        const createdId = createdIdRs.recordset[0].Id;

        for (const cate of Application) {
            const cateRequest = poolConnection.request(); // Create a new Request object for each iteration
            const query = `
                    INSERT INTO ComponentDetail_Category (ComponentID, cateID)
                    VALUES (@ComponentID, @CateID)
                `;
            await cateRequest
                .input("ComponentID", sql.Int, createdId)
                .input("CateID", sql.NVarChar, cate)
                .query(query);
        }
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const updateComponent = async (Id, Name, Type, Material, Color, Description, Price, Stock, Status, Url, Application) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request();
        const unit = Material == "Nan" ? "Cái" : "Bộ"
        request.input('Id', sql.Int, Id);
        request.input('Name', sql.NVarChar, Name);
        request.input('Description', sql.NVarChar, Description);
        request.input('Price', sql.Int, Price);
        request.input('Stock', sql.Int, Stock);
        request.input('Status', sql.NVarChar, Status);
        request.input('Type', sql.NVarChar, Type);
        request.input('Material', sql.NVarChar, Material);
        request.input('Color', sql.NVarChar, Color);
        request.input('Picture', sql.NVarChar, Url);
        request.input('Unit', sql.NVarChar, unit)
        const result = await request.query(`
            UPDATE ComponentDetail SET           
                [Name] = @Name, 
                [Description] = @Description, 
                [Price] = @Price,
                [Stock] = @Stock, 
                [Status] = @Status, 
                [Type] = @Type, 
                [Material] = @Material,
                [Color] = @Color, 
                [Picture] = @Picture,
                [Unit] = @Unit
            WHERE ID = @Id;
        `);

        let refreshQuery = await sql.connect(config);
        await refreshQuery.request()
            .input("Id", sql.Int, Id)
            .query(`
                DELETE FROM ComponentDetail_Category WHERE ComponentID = @Id
            `);

        for (const cate of Application) {
            const cateRequest = poolConnection.request(); // Create a new Request object for each iteration
            const query = `
                   INSERT INTO ComponentDetail_Category (ComponentID, cateID)
                    VALUES (@ComponentID, @CateID)
                `;
            await cateRequest
                .input("ComponentID", sql.Int, Id)
                .input("CateID", sql.NVarChar, cate)
                .query(query);
        }
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}
const deleteComponent = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request();
        request.input('Id', sql.Int, Id);
        const result = await request.query(`
             DELETE FROM ComponentDetail_Category WHERE ComponentID = @Id
                DELETE FROM Component
                WHERE ID = @Id;
        `);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}




module.exports  = {
    getAllComponent,
    getByComponentCate,
    filterComponents,
    addNewComponent,
    getAComponent,
    getCateByComponent,
    updateComponent,
    deleteComponent
}