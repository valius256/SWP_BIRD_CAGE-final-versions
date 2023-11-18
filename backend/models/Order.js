const config = require("../config/db.config")
const sql = require("mssql");

const getAllOrder = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT dbo.Orders.Id AS OrderId,
            dbo.[User].Name,dbo.Orders.OrderDate,Orders.Status_Paid,
            dbo.Orders.Status_Shipping,
            CONCAT(dbo.UserAddress.SoNha,', ', dbo.UserAddress.PhuongXa,', ',dbo.UserAddress.QuanHuyen,', ', dbo.UserAddress.TinhTP ) AS Address,
            dbo.Orders.PhoneNumber, dbo.Orders.TotalAmount, dbo.Orders.UpdateAt, dbo.Orders.Note 
            FROM dbo.Orders 
            JOIN dbo.[User]
            ON [User].Id = Orders.UserID
            JOIN dbo.UserAddress
            ON UserAddress.ID = Orders.AddressID`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};

const getOrderByUserId = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("ID",sql.Int, id)
            .query(
            `select *
             from Orders
             where Orders.UserID = @ID
             and Orders.haveCustomProduct=0
             order by Id DESC`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};
const getOrderByUserId2 = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input("ID",sql.Int, id)
            .query(
            `select *
             from Orders
             where Orders.UserID = @ID
             and Orders.haveCustomProduct=1
             order by Id DESC`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};

const getOrderById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT *
            FROM Orders
            WHERE Orders.id = @Id
        `;
        const result = await poolConnection.request()
            .input('Id', sql.Int, id)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error);
    }
};

const addOrderToDB = async (UserID, OrderDate, PaymentDate, ShippingAddress, PhoneNumber, Note, TotalAmount, PaymentMethod, VoucherID, Items) => {
    try {
        let poolConnection = await sql.connect(config);
        const voucherIDValue = VoucherID !== "" ? VoucherID : null;

        const orderQuery = `
            INSERT INTO dbo.Orders
            (
                [UserID],
                [OrderDate],
                [PaymentDate],
                [AddressID],
                [PhoneNumber],
                [Note],
                [TotalAmount],
                [PaymentMethod],
                [IsDeleted],
                [UpdateAt],
                [View_Status],
                [Status_Shipping],
                [Status_Paid],
                [VoucherID],
                [haveCustomProduct]
            )
            OUTPUT INSERTED.Id
            VALUES
            (
                @UserID,
                @OrderDate,
                @PaymentDate,
                @AddressID,
                @PhoneNumber,
                @Note,
                @TotalAmount,
                @PaymentMethod,
                0,
                GETDATE(),
                0,
                N'Chờ duyệt',
                N'Chưa Thanh Toán',
                @VoucherID,
                0
            );
        `;
        const orderRequest = poolConnection.request()
            .input('UserID', sql.Int, UserID)
            .input('OrderDate', sql.DateTime, OrderDate)
            .input('PaymentDate', sql.DateTime, PaymentDate)
            .input('AddressID', sql.Int, ShippingAddress)
            .input('PhoneNumber', sql.NVarChar, PhoneNumber)
            .input('Note', sql.NVarChar, Note)
            .input('TotalAmount', sql.Int, TotalAmount)
            .input('PaymentMethod', sql.NVarChar, PaymentMethod)
            .input('VoucherID', sql.Int, voucherIDValue)

        const orderResult = await orderRequest.query(orderQuery);
        const orderId = orderResult.recordset[0].Id;
        for (const item of Items) {
            const itemQuery = `
                INSERT INTO OrderItem(
                    ProductId,
                    OrdersId,
                    Quantity,
                    Price,
                    CreatedAt
                ) VALUES (
                    @ProductId,
                    @OrderId,
                    @Quantity,
                    @Price,
                    GETDATE()
                );

                UPDATE Products
                SET Stock = Stock - @Quantity
                WHERE Id = @ProductId
            `;
            const itemRequest = poolConnection.request()
                .input('ProductId', sql.Int, item.id)
                .input('OrderId', sql.Int, orderId)
                .input('Quantity', sql.Int, parseInt(item.quantity))
                .input('Price', sql.Int, parseInt(item.price));
            await itemRequest.query(itemQuery);
        }
        return orderId;
    } catch (error) {
        console.log("error: ", error);
    }
};


const changeStatus_Paid = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .query(
            ` UPDATE dbo.Orders
              SET Status_Paid = N'Đã thanh toán', View_Status = 0, PaymentDate = GETDATE() 
              WHERE id = @id
              `
        )
    } catch (e) {
        console.log("error: ", e);
    }
};

const getAllOrderItemByOrderID = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT p.Id, p.Name, oi.CreatedAt, oi.Price, oi.Quantity, i.Url, c.name AS Shape, p.discount, p.material
            FROM OrderItem oi
            INNER JOIN Orders o ON o.Id = oi.OrdersId
            INNER JOIN Products p ON oi.ProductId = p.id
            INNER JOIN Category c ON p.Category = c.Id
            JOIN (
                SELECT Image.*, ROW_NUMBER() OVER (PARTITION BY ProductId ORDER BY Id) AS RowNum
                FROM Image
            ) i ON i.ProductId = p.id AND i.RowNum = 1
            WHERE o.Id = @OrderId;
        `;
        const result = await poolConnection.request()
            .input('OrderId', sql.Int, id)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
};


const loadUnSeen = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .query(
            `SELECT * FROM dbo.Orders 
             WHERE UserID = @id`

        )
        return result.recordset;
    } catch (error) {
        console.log("Error: " , error)
    }
}

const changeToSeen = async(id, userid) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .input('userid', userid)
        .query(
            ` 
            UPDATE dbo.Orders
            SET View_Status = 1
            WHERE UserID = @userid
            AND Id = @id
            `
        )
    } catch (error) {
        console.log("error: ", error);
    }
}

const pieChartData = async() => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .query(
            ` 
            SELECT Category.name, SUM(dbo.OrderItem.Quantity)AS Cages FROM dbo.Category
            JOIN dbo.Products
            ON Products.Category = Category.Id
            JOIN dbo.OrderItem
            ON OrderItem.ProductId = Products.Id
            GROUP BY Category.name
            `
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}


const addCustomProduct = async (productName, Description, Price, Category, Size, material, Quantity, userId, AddressID, PhoneNumber, TotalAmount, PaymentMethod, ComponentItems) => {
    try {
        let poolConnection = await sql.connect(config);
        const productQuery = await poolConnection.request()
            .input('Name', productName)
            .input('Description', Description)
            .input('Price', Price)
            .input('Category', Category)
            .input('Size', Size)
            .input('material', material)
            .query(`
                INSERT INTO dbo.Products
                (
                    Name,
                    Description,
                    Price,
                    Status,
                    Category,
                    Size,
                    material,
                    isDeleted,
                    CreatedAt,
                    UpdateAt
                )
                OUTPUT Inserted.Id
                VALUES
                (
                    @Name,
                    @Description,
                    @Price,
                    'Enable',
                    @Category,
                    @Size,
                    @material,
                    NULL,
                    GETDATE(),
                    GETDATE()
                )
            `);
        const productId = productQuery.recordset[0].Id;
        // console.log(productId);
        const orderQuery = await poolConnection.request()
            .input('UserID', userId)
            .input('AddressID', sql.Int, AddressID)
            .input('PhoneNumber', PhoneNumber)
            .input('TotalAmount', TotalAmount)
            .input('PaymentMethod', PaymentMethod)
            .query(`
                INSERT INTO dbo.Orders
                (
                    UserID,
                    OrderDate,
                    PaymentDate,
                    AddressID,
                    PhoneNumber,
                    TotalAmount,
                    PaymentMethod,
                    IsDeleted,
                    UpdateAt,
                    View_Status,
                    Status_Shipping,
                    Status_Paid,
                    [haveCustomProduct]
                )
                OUTPUT Inserted.Id
                VALUES
                (
                    @UserID,
                    GETDATE(),
                    GETDATE(),
                    @AddressID,
                    @PhoneNumber,
                    @TotalAmount,
                    @PaymentMethod,
                    NULL,
                    GETDATE(),
                    0,
                    N'Chờ duyệt',
                    N'Chưa Thanh Toán',
                    1
                )
            `);
        const orderId = orderQuery.recordset[0].Id;
        // console.log(orderId);
        const OrderItem = await poolConnection.request()
            .input('ProductId', productId)
            .input('OrdersId', orderId)
            .input('Quantity', Quantity) // Add a value for Quantity
            .input('Price', Price)
            .query(`
                INSERT INTO dbo.OrderItem
                (
                    ProductId,
                    OrdersId,
                    Quantity,
                    Price,
                    CreatedAt
                )
                VALUES
                (
                    @ProductId,
                    @OrdersId,
                    @Quantity,
                    @Price,
                    GETDATE()
                )
            `);

        for (const item of ComponentItems) {
            const itemQuery = `
                INSERT INTO dbo.CustomComponent
                (
                    ProductID,
                    ComponentID
                )
                VALUES
                (
                    @ProductID,
                    @ComponentID
                )
            `;
            const itemRequest = poolConnection.request()
                .input('ProductID', productId)
                .input('ComponentID',sql.Int, parseInt(item));
            await itemRequest.query(itemQuery);
        }
        return orderId;

    } catch (error) {
        console.log("error: ", error);
    }
}

const getCustomComponentImageByOrderID = async(Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('Id', Id)
        .query(
            ` 
            select cd.* from Orders o
            join OrderItem ot 
            on o.Id = ot.OrdersId
            join Products p
            on ot.ProductId  = p.Id
            join CustomComponent cp 
            on cp.ProductID = p.Id
            join ComponentDetail cd 
            on cd.ID = cp.ComponentID
            where o.Id = @Id
            `
        )
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    getAllOrder,
    getOrderById,
    addOrderToDB,
    changeStatus_Paid,
    getAllOrderItemByOrderID,
    getOrderByUserId,
    getOrderByUserId2,
    loadUnSeen,
    changeToSeen,
    pieChartData,
    addCustomProduct,
    getCustomComponentImageByOrderID
}