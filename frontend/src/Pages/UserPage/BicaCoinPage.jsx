import React, { useContext, useEffect, useState } from 'react'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import UserUtilities from "../../components/common/UserUtilities";
import "./styles.css"
import { UserContext } from '../../UserContext';
import { UserProvider } from '../../UserContext';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import CategoryNav from '../../components/features/CategoryNav';
import Popup from 'reactjs-popup'
import { useWindowSize } from 'usehooks-ts'
import Confetti from 'react-confetti'
import axios from 'axios'



const BicaCoinPage = () => {
    const { user } = useContext(UserContext);
    const { width, height } = useWindowSize()
    const [openPopup, setOpenPopup] = useState(false)
    const [voucher, setVoucher] = useState(0)
    const point = 1000

    const handleClick = () => {
        if (user.Point >= point) {
            addVoucher(getAVoucher())
            window.scrollTo(0, 0)
            setOpenPopup(true)
        } else {
            alert('Tài khoản của bạn hiện chưa đủ Bica Coin. Hãy tích thêm thật nhiều và quay lại nhé ^^!')
        }
    }

    const addVoucher = async (discount) => {
        await axios.post('http://localhost:3000/users/addVoucher', {
            UserID: user.Id,
            discount: discount
        })
        const response = await axios.post('http://localhost:3000/users/exchangePoint', {
            UserID: user.Id,
            point: point
        })
        sessionStorage.setItem('loginedUser', JSON.stringify(response.data))
    }

    const handleClose = (value) => {
        setOpenPopup(false);
    };

    const getAVoucher = () => {
        const probability_distrubution = [
            { start: 5, end: 15, probability: 0 },
            { start: 16, end: 30, probability: 70 },
            { start: 31, end: 45, probability: 88 },
            { start: 46, end: 60, probability: 93 },
            { start: 61, end: 75, probability: 97 },
            { start: 76, end: 90, probability: 99 }

        ]
        const percentage = Math.round(Math.random() * 100)
        console.log(percentage)
        var randomNum;
        probability_distrubution.map((distribution, index) => {

            if (100 - percentage >= distribution.probability) {
                randomNum = Math.floor(Math.random() * (distribution.end - distribution.start + 1)) + distribution.start;
            }
        })
        setVoucher(randomNum);
        return randomNum;
    };

    return (

        <div className="user-page">

            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav
                parents={[
                    { "name": "Trang chủ", "link": "/" }
                ]}
                current="BicaCoin"></CategoryNav>
            <div className="user-container">
                {user != null ? (
                    <>
                        <UserUtilities user={user} />
                    <div className="user-view">
                        <div className="form-header">
                            <h1>Bica Coin</h1>
                            <p>Một loại &quot;đơn vị tiền tệ&quot; độc quyền của cửa hàng chúng tôi nhằm mục đích tri ân tất cả khách hàng.
                            Chúng có thể dùng để đổi lấy các phiếu giảm giá và có thể áp dụng cho mọi đơn hàng của bạn</p>
                            <hr></hr>
                            <div className="mt-8 text-2xl font-bold flex justify-center">CHỈ VỚI 1000 BICA COINS</div>
                            <div className="mt-8 text-3xl font-bold flex justify-center text-red-400">
                                SỞ HỮU NGAY CHO MÌNH PHIẾU GIẢM GIÁ LÊN ĐẾN 
                            </div>
                            <div className="mt-8 text-7xl font-extrabold flex justify-center text-red-500"> 90%</div>
                            <div className="flex justify-center mt-8">
                                <Button className="w-48 h-16" variant="contained" onClick={handleClick}>
                                    <div className="text-2xl font-bold">
                                        ĐỔI NGAY
                                    </div>
                                </Button>
                            </div>
                            <div className="mt-8 text-2xl flex justify-center">
                                Số Bica coin hiện có :
                                <div className="ml-2 font-bold text-4xl text-blue-500">{user.Point}</div>
                                </div>
                            <div className="text-xl mt-10 font-bold italic">HƯỚNG DẪN</div>
                                <ul className="text-lg italic mt-5 list-disc ml-5">
                                    <li>Tích thật nhiều BicaCoin bằng cách mua các sản phẩm của chúng tôi</li>
                                    <li>Ấn vào nút &quot;Đổi ngay&quot;, hãy chắc chắn rằng bạn đã đủ BicaCoin</li>
                                    <li>Bạn sẽ nhận được một Voucher ngẫu nhiên, giá trị dao động từ 5-90% hoàn toàn
                                        phụ thuộc vào nhân phẩm của bạn</li>
                                    <li>Sử dụng voucher này bằng cách chọn mục phiếu giảm giá ở trang thanh toán giỏ hàng hoặc
                                        mua ngay</li>
                                    <li>Sau khi mua hàng rồi bạn sẽ tiếp tục được tích điểm và có thể quay lại đây đổi tiếp nha!</li>
                                    <li>Voucher có hạn sử dụng 1 tháng nên hãy tranh thủ tận dụng nha^^!</li>

                                </ul>
                            </div>
                        </div>
                        <Popup
                            open={openPopup}
                            onClose={() => setOpenPopup(false)}
                            position="right center"
                            modal
                            closeOnDocumentClick={false}
                        >
                            {(close) => (
                                <div className="bg-red-600 p-8"
                                >
                                    <Confetti
                                        width={window.innerWidth}
                                        height={window.innerHeight}
                                        className="absolute top-0 left-0 z-10"
                                        numberOfPieces={500}
                                        recycle={false}
                                        style={{
                                            position: "fixed",
                                            top: 0,
                                            left: 0,
                                            width: "100vw",
                                            height: "100vh",
                                            zIndex: 100,
                                            pointerEvents: "none",
                                        }}
                                    />
                                    <div className="mt-8 text-2xl font-bold flex justify-center text-yellow-200">CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC VOUCHER TRỊ GIÁ</div>
                                    <div className="text-9xl font-extrabold flex justify-center text-orange-200">
                                    {voucher} %
                                    </div>
                                    <div className="flex justify-center mt-8">
                                        <Button className="w-48 h-16" variant="contained" onClick={() => {
                                            close();
                                            window.location.reload()
                                    }
                                                }>
                                            <div className="text-2xl font-bold">
                                                NHẬN
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            ) }
                        </Popup>
                    </>
                ) : (<div>Loading...</div>)}
            </div>
        </div>
    )
}

export default BicaCoinPage