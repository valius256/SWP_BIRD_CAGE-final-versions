const config = require("../config/db.config");
const sql = require("mssql");

const getAllProducts = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT DISTINCT p.*,i.Url,c.name as Shape
            FROM Products p, Image i, Category c
            WHERE i.ProductId = p.id AND p.Category = c.id AND p.isDeleted = 0`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}


const getImgsOfProduct = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT *
            FROM Image 
            WHERE productID = @Id
            `;
        const result = await poolConnection.request()
            .input('Id', sql.Int, id)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};

const getProductsByCategory = async (code) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('code', code)
        .query(
            `SELECT p.*, i.Url, c.name AS Shape
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE Category = @code AND material != 'Custom' AND p.isDeleted = 0`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const getProductById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('ProductId', id)
        .query(
            `SELECT p.*, i.Url, c.name AS Shape
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE i.ProductId = ${id}`
        );
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error);
    }

};
const getProductByName = async (name) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT p.*, i.Url, c.name AS Shape
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE material != 'Custom'
            WHERE p.Name LIKE '%' + @Name + '%' AND p.isDeleted = 0
        `;
        const result = await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};

const addNewProductToDB = async (Name, Description, Price, Category, Material, SuitableBird, Discount, Size, Stock, Status, Urls) => {
    try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request();

        request.input('Name', sql.NVarChar, Name);
        request.input('Description', sql.NVarChar, Description);
        request.input('Price', sql.Int, Price);
        request.input('Stock', sql.Int, Stock);
        request.input('Status', sql.NVarChar, Status);
        request.input('Category', sql.NVarChar, Category);
        request.input('Size', sql.NVarChar, Size);
        request.input('Material', sql.NVarChar, Material);
        request.input('SuitableBird', sql.NVarChar, SuitableBird);
        request.input('Discount', sql.NVarChar, Discount);

        const result = await request.query(`
            INSERT INTO dbo.Products
            (
            [Name]
            ,[Description]
            ,[Price]
            ,[Stock]
            ,[Status]
            ,[Category]
            ,[Size]
            ,[material]
            ,[isDeleted]
            ,[CreatedAt]
            ,[UpdateAt]
            ,[SuitableBird]
            ,[discount]
            )
            VALUES
            (
                @Name, 
                @Description, 
                @Price,
                @Stock, 
                @Status, 
                @Category, 
                @Size, 
                @Material, 
                0, 
                GETDATE(), 
                GETDATE(),
                @SuitableBird, 
                @Discount
            );
        `);

        const productIdQuery = `SELECT TOP 1 Id FROM Products ORDER BY Id DESC`;
        const productIdResult = await poolConnection.request().query(productIdQuery);
        const productId = productIdResult.recordset[0].Id;

        for (const url of Urls) {
            const imageRequest = poolConnection.request(); // Create a new Request object for each iteration
            const query = `
                    INSERT INTO Image (ProductId, Url, isDeleted)
                    VALUES (@ProductId, @Url, 0)
                `;
            await imageRequest
                .input("ProductId", sql.Int, productId)
                .input("Url", sql.NVarChar, url)
                .query(query);
        }
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const updateProduct = async (Id, Name, Description, Price, Stock, Category, material, Size, SuitableBird, discount, Status,Urls) => {
    try {
        const poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id', sql.Int, Id)
            .input('Name', sql.NVarChar, Name)
            .input('Description', sql.NVarChar, Description)
            .input('Price', sql.Int, Price)
            .input('Stock', sql.Int, Stock)
            .input('Status', sql.NVarChar, Status)
            .input('Size', sql.NVarChar, Size)
            .input('Material', sql.NVarChar, material)
            .input('SuitableBird', sql.NVarChar, SuitableBird)
            .input('Discount', sql.Int, discount)
            .query(`
        UPDATE dbo.Products 
        SET
        [Name] = @Name,
        [Description] = @Description,
        [Price] = @Price,
        [Stock] = @Stock,
        [Status] = @Status,
        [Category] = '${Category}',
        [Size] = @Size,
        [Material] = @Material,
        [UpdateAt] = GETDATE(),
        [SuitableBird] = @SuitableBird,
        [Discount] = @Discount 
        WHERE [Id] = @Id
      `);

      //Reset images
        let deleteImages = await sql.connect(config)
        await deleteImages.request().query(
            `DELETE FROM Image WHERE ProductId=${Id}`
        )


        for (const url of Urls) {
            const imageRequest = poolConnection.request(); // Create a new Request object for each iteration
            const query = `
                   INSERT INTO Image (ProductId, Url, isDeleted)
                    VALUES (@ProductId, @Url, 0)

                `;
            await imageRequest
                .input("ProductId", sql.Int, Id)
                .input("Url", sql.NVarChar, url)
                .query(query);
        }
        return result.recordset;
    } catch (error) {
        console.log("error:", error);
    }
}

const getRatingByProductId = async (ProductId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('ProductId', ProductId)
        .query(
            `SELECT 
            f.userid,
            f.productID,
            u.Picture, 
            u.Name AS Name, 
            f.StarPoint, 
            f.Content,
            f.createAt,
            f.replyContent,
            f.replyDate,
            r.Name AS ReplierName,
            r.Picture AS ReplierPicture
        FROM 
            Feedback f
            INNER JOIN [User] u ON f.UserId = u.id
            LEFT JOIN [User] r ON f.Replier = r.id
        WHERE 
            f.ProductId = @ProductId;
`
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error)

    }
}

const deleteProduct = async (Id) => {
    try {
        const poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Id', sql.Int, Id)
            .query(`
        UPDATE dbo.Products 
        SET isDeleted = 1
        WHERE [Id] = @Id
      `);
        return result.recordset;
    } catch (error) {
        console.log("error:", error);
    }
}

const addRating = async (UserId, ProductId, StarPoint, Content) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserId', UserId)
        .input('ProductId', ProductId)
        .input('StarPoint', StarPoint)
        .input('Content', Content)
        .query(
            `INSERT INTO dbo.Feedback
                (
                    UserId,
                    ProductId,
                    StarPoint,
                    Content,
                    CreateAt
                )
                VALUES
                (   @UserId,    
                    @ProductId, 
                    @StarPoint, 
                    @Content, 
                    GETDATE() 
                    )
                    `
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error)

    }
}

const addReply = async (UserId, ProductId, StarPoint, Content) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserId', UserId)
        .input('ProductId', ProductId)
        .input('StarPoint', StarPoint)
        .input('Content', Content)
        .query(
            `UPDATE INTO dbo.Feedback
                (
                    UserId,
                    ProductId,
                    StarPoint,
                    Content,
                    CreateAt
                )
                VALUES
                (   @UserId,    
                    @ProductId, 
                    @StarPoint, 
                    @Content, 
                    GETDATE() 
                    )
                    `
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error)

    }
}

const paging = async (page, cate) => {
    try {
        const perPage = 15; // so phan tu hien thi trong 1 lan
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('cate', cate)
        .query(
            `
            SELECT p.*, i.Url, c.name AS Shape
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE Category = @cate AND material != 'Custom' AND p.isDeleted = 0
            ORDER BY p.CreatedAt DESC
          `
        );
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE Category = @cate AND material != 'Custom' AND p.isDeleted = 0
        `;

        const linesResult = await poolConnection.request()
        .input('cate', cate)
        .query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (e) {
        console.log("error: ", e)
    }
}


const filterProduct = async (id, name, category, upper_price, lower_price, upper_stock, lower_stock, status, page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        if (id) conditions.push(`p.id = ${id}`);
        if (name) conditions.push(`p.Name LIKE N'%${name}%'`);
        if (category && category !== "All") conditions.push(`c.id = N'${category}'`);
        if (status && status !== "All") conditions.push(`p.Status = '${status}'`);
        if (upper_price) conditions.push(`p.Price <= ${upper_price}`);
        if (lower_price) conditions.push(`p.Price >= ${lower_price}`);
        if (upper_stock) conditions.push(`p.Stock <= ${upper_stock}`);
        if (lower_stock) conditions.push(`p.Stock >= ${lower_stock}`);

        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT DISTINCT p.*, i.Url, c.name as Shape
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            ${conditionString}
            AND p.isDeleted = 0
            ORDER BY p.Id ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            ${conditionString}
            AND p.isDeleted = 0;
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
};

const pagingSearchBar = async (name, page) => {
    try {
        const perPage = 15;
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .query(`
                SELECT p.*, i.Url, c.name AS Shape
                FROM Products p
                JOIN (
                    SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                    FROM Image
                ) i ON i.ProductId = p.id AND i.RowNum = 1
                JOIN Category c ON p.Category = c.id
                WHERE material != 'Custom'
                AND p.Name LIKE '%' + @Name + '%' AND p.isDeleted = 0
                ORDER BY p.createdAt DESC
                `);

        const json = { data: result.recordset };

        const linesQuery = `
            SELECT COUNT(*) AS Count
            FROM Products p
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            JOIN Category c ON p.Category = c.id
            WHERE material != 'Custom'
            AND p.Name LIKE '%' + @Name + '%' AND p.isDeleted = 0
        `;

        const linesResult = await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .query(linesQuery);

        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
}



module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getProductByName,
    addNewProductToDB,
    updateProduct,
    getRatingByProductId,
    addRating,
    deleteProduct,
    paging,
    filterProduct,
    pagingSearchBar,
    getImgsOfProduct,
}

