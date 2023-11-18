import React, { useState, useEffect } from 'react'
import './styles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Rating } from '@mui/material'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Popup from 'reactjs-popup'

const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
const OrderList = (props) => {
    const [cards, setCards] = useState([])
    const [vouchers, setVouchers] = useState([])
    const [rating, setRating] = useState(0)
    const [feedbackContent, setFeedbackContent] = useState('')
    const [openPopup, setOpenPopup] = useState(false)

    const navigate = useNavigate()

    const handleStarPoint = (event) => {
        setRating(event.target.value)
    }
    const handleFeedbackContent = (event) => {
        setFeedbackContent(event.target.value)
    }
    const handleRebuy = (productId) => {
        navigate('/products/' + productId)
    }
    //step
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }
    async function fetchOrderItems(id) {
        const response = await axios.get(`http://localhost:3000/order/list/${id}`)
        return response.data
    }
    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${props.user.Id}`)
        setVouchers(response.data)
    }
    const fetchRatings = async (id) => {
        const response = await axios.get(`http://localhost:3000/products/rating/${id}`)
        return response.data
    }
    async function submitFeedback(productId, close) {
        const json = {
            UserId: props.user.Id,
            ProductId: productId,
            StarPoint: rating,
            Content: feedbackContent
        }
        if (json.StarPoint > 0) {
            await axios.post(`http://localhost:3000/products/rating/`, json)
            alert('Chúng tôi đã ghi nhận. Chân thành cảm ơn bạn!')
            close()
        } else {
            alert('Xin vui lòng đánh giá số sao')
        }
    }
    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/order/user/${props.user.Id}`)
        if (response.data) {
            const jsonData = response.data;
            const ordersWithItems = [];

            for (const order of jsonData) {
                const items = await fetchOrderItems(order.Id);
                const itemWithRatings = [];

                for (const item of items) {
                    const ratings = await fetchRatings(item.Id);
                    const itemWithRating = { ...item, ratings };
                    itemWithRatings.push(itemWithRating);
                }

                const orderWithItems = { ...order, items: itemWithRatings };
                ordersWithItems.push(orderWithItems);
            }
            setCards(ordersWithItems);
        }
    }

    const handleFeedbackButtonClick = (card, item) => {
        if (item.ratings.some((rating) => rating.userid === props.user.Id)) {
            handleRebuy(item.Id);
        } else {
            setOpenPopup(true);
        }
    };


    useEffect(() => {
        fetchOrder();
        fetchVouchers();
    }, []);


    return (
        <>
            <div className="form-header">
                <h1>Đơn Hàng Của Tôi</h1>
                <p>Những đơn hàng bạn đã đặt</p>
            </div>
            <hr />
            {/*Loop*/}

            {cards.map((card) => (
                <div className=" flex-col bg-slate-50 m-2 p-2 rounded-lg" key={card.Id}>
                    <div className=" flex place-content-between px-4 my-4">
                        <div className="flex">
                            <div className="px-2">Mã đơn hàng: {card.Id} </div>
                            <div>|</div>
                            <div className="px-2">Ngày đặt mua: {(card.OrderDate + '').substr(0, 10)} </div>
                        </div>
                        <div className="flex">
                            <Stepper activeStep={getActiveStep(card.Status_Shipping)}>
                                {steps.map((label, index) => {
                                    const stepProps = {}
                                    const labelProps = {}

                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    )
                                })}
                            </Stepper>
                            {/* <div>|</div> */}
                            {/* <div className="px-2"> Trạng thái đơn hàng: {card.Status} </div> */}
                        </div>
                    </div>
                    <hr className="border  border-slate-300 my-2 w-full " />

                    <div className="flex-row w-full">
                        {card.items.map((item) => (
                            <div key={item.Id}>
                                <div className="flex-row w-full">
                                    <div className="flex place-content-between">
                                        <div className="flex">
                                            <Button onClick={() => handleRebuy(item.Id)}>
                                                <img className="h-30 w-20 mx-4  " src={item.Url}></img>
                                            </Button>
                                            <div className="">
                                                <div className="font-bold">{item.Name}</div>
                                                <div className="pl-2">Phân loại: {item.Shape}</div>
                                                <div className="pl-2">x{item.Quantity}</div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="mx-8 my-4 text-right line-through text-gray-400 ">
                                                {parseInt((item.Price * 100) / (100 - item.discount)).toLocaleString('vi', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </div>
                                            <div className="mx-8 text-right text-red-500 ">
                                                {' '}
                                                {item.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <Button
                                            className=""
                                            variant="contained"
                                            onClick={() => handleFeedbackButtonClick(card, item)}
                                        >
                                            {item.ratings.some((rating) => rating.userid === props.user.Id)
                                                ? 'Xem đánh giá'
                                                : 'Đánh giá'}
                                        </Button>

                                        <Popup
                                            open={openPopup}
                                            position="right center"
                                            closeOnDocumentClick={false}
                                            closeOnEscape={false}
                                            modal
                                            onClose={() => setOpenPopup(false)}
                                        >
                                            {(close) => (
                                                <div className="p-4">
                                                    <h2>ĐÁNH GIÁ SẢN PHẨM</h2>
                                                    <h3>{item.Name}</h3>
                                                    <div>
                                                        <Rating name="hover-feedback" precision={1} onChange={handleStarPoint} defaultValue={0} />

                                                        <TextField
                                                            className="text-left"
                                                            fullWidth
                                                            variant="standard"
                                                            label="Hãy cho chúng tôi biết cảm nghĩ của bạn về sản phẩm"
                                                            multiline
                                                            rows={6}
                                                            onChange={handleFeedbackContent}
                                                        ></TextField>
                                                    </div>
                                                    <div className="flex justify-end space-x-3">
                                                        <Button variant="outlined" onClick={close}>
                                                            Đóng
                                                        </Button>
                                                        <Button variant="contained" onClick={() => submitFeedback(item.Id, close)}>
                                                            Lưu
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                        <hr className="border  border-slate-300 my-2 mx-8" />
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="flex place-content-between ">
                        <div>
                            <div className="text-left mx-8 my-4 text-xl">{card.Status_Paid}</div>
                            <div className='flex'>
                                <div className='text-left ml-8 my-4'>Voucher áp dụng: </div>
                                <div className='text-left mx-2 my-4 text-red-500 font-bold'>{vouchers.find(voucher => voucher.ID == card.VoucherID) ? vouchers.find(voucher => voucher.ID == card.VoucherID).discount + '%' : "Không áp dụng"}</div>
                            </div>
                        </div>

                        <div className='flex m-6'>
                            <div className='text-right text-xl mr-2'>Tổng cộng: </div>
                            <div className="text-right text-red-500 text-xl">
                                {parseInt(card.TotalAmount).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default OrderList
