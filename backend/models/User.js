const config = require("../config/db.config");
const sql = require("mssql");

const getAllUser = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request().query(
            `SELECT * FROM [dbo].[User]`
        );
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

const getUserByEmail = async (email) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            SELECT *
            FROM [dbo].[User]
            WHERE email = @Email;
        `;
        const result = await poolConnection.request()
            .input('Email', sql.NVarChar, email)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.log("error: ", error);
    }
};

const newUser = async (name, email, picture) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            INSERT INTO [User] (Name, email, picture, Role, point, Status, CreatedAt) 
            VALUES (@Name, @Email, @Picture, 'User', 0, 'Active', GETDATE());
        `;
        await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.NVarChar, email)
            .input('Picture', sql.NVarChar, picture)
            .query(query);
    } catch (error) {
        console.log("error: ", error);
    }
};

const updateUser = async (name, email, phone, dateOfBirth) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `
            UPDATE [User]
            SET Name = @Name, PhoneNumber = @Phone, DateOfBirth = @DateOfBirth
            WHERE Email = @Email;
        `;
        await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .input('Phone', sql.NVarChar, phone)
            .input('DateOfBirth', sql.NVarChar, dateOfBirth)
            .input('Email', sql.NVarChar, email)
            .query(query);
        return getUserByEmail(email);
    } catch (error) {
        console.log("error: ", error);
    }
};

const getPointForUser = async(id, point) => {
    try {
        let poolConnection = await sql.connect(config);
        const response = await poolConnection.request()
        .input('id', id)
        .input('point', point)
        .query(`
            UPDATE dbo.[User]
            SET Point = Point + @point 
            WHERE Id = @id

            SELECT *
            FROM [dbo].[User]
            WHERE Id = @id;
        `)
        return response.recordset[0]
    } catch (error) {
        console.log("error: ", error);
    }
}

const filterUser = async (name, email, phone, dob, lower_point, upper_point, create, status, role, page) => {
    try {
        const perPage = 10;
        const poolConnection = await sql.connect(config);

        const conditions = [];
        if (email) conditions.push(`email LIKE '%${email}%'`);
        if (name) conditions.push(`Name LIKE N'%${name}%'`);
        if (phone) conditions.push(`Name LIKE N'%${phone}%'`);
        if (dob) conditions.push(`DateOfBirth LIKE '%${dob}%'`);
        if (role) conditions.push(`role LIKE '%${role}%'`);
        if (status && status !== "All") conditions.push(`Status = '${status}'`);
        if (upper_point) conditions.push(`Point <= ${upper_point}`);
        if (lower_point) conditions.push(`Point >= ${lower_point}`);
        if (create) conditions.push(`CreatedAt LIKE '%${create}%'`);

        const conditionString = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT * FROM [User] 
            ${conditionString}
            ORDER BY Id ASC
            OFFSET ${(page - 1) * perPage} ROWS
            FETCH NEXT ${perPage} ROWS ONLY;
        `;

        const result = await poolConnection.request().query(query);
        const json = { data: result.recordset };

        const linesQuery = `
            SELECT * FROM [User]
            ${conditionString}
        `;

        const linesResult = await poolConnection.request().query(linesQuery);
        json.lines = linesResult.recordset[0];
        return json;
    } catch (error) {
        console.log("error: ", error);
    }
};

const  addVoucher = async (UserID, discount) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserID', UserID)
        .input('discount', discount)
        .query(`
        insert into Voucher(
            [UserID],
            [discount],
            [CreatedAt],
            [UsedAt],
            [ExpireAt]
        )
        values(
            @UserID,
            @discount,
            GETDATE(),
            NULL,
            DATEADD(MONTH, 1, GETDATE())
        )
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const updateVoucher = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        await poolConnection.request()
            .input('Id', Id)
            .query(`
        update Voucher
            set [UsedAt] = GETDATE()
        WHERE Id = @Id
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const getVoucherByUserID = async (Id) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
            .input('UserID', Id)
            .query(`
        select * from Voucher
        where UserID = @UserID
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}


const exchangePoint = async(UserID, Point) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('UserID', UserID)
        .input('Point', Point)
        .query(`
            UPDATE dbo.[User]
            SET Point = Point - @Point
            WHERE id = @UserID

            SELECT *
            FROM [dbo].[User]
            WHERE Id = @UserID;
        `)
        return result.recordset[0]
    } catch (error) {
        console.log("error: ", error);
    }
}

const replyFeedBack = async(id, ReplyContent, Replier) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('id', id)
        .input('ReplyContent', ReplyContent)
        .input('Replier', Replier)
        .query(`
            UPDATE dbo.Feedback
            SET ReplyContent = @ReplyContent , ReplyDate = GETDATE(), Replier = @Replier
            WHERE id =@id
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const addNotifications = async(content, userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('content', content)
        .input('userId', userId)
        .query(`
        INSERT INTO dbo.Notification
        (
            content,
            userId
        )
        VALUES
        (   @content,
            @userId
            )
        `)
    } catch (error) {
        console.log("error: ", error);
    }
}

const loadNotifications = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const result = await poolConnection.request()
        .input('userId', userId)
        .query(`
        SELECT * FROM dbo.Notification
	    WHERE userId = @userId
        `)
        return result.recordset;
    } catch (error) {
        console.log("error: ", error);
    }
}

module.exports = {
    getAllUser,
    getUserByEmail,
    newUser,
    updateUser,
    getPointForUser,
    filterUser,
    addVoucher,
    getVoucherByUserID,
    exchangePoint,
    replyFeedBack,
    addNotifications,
    loadNotifications,
    updateVoucher
};
