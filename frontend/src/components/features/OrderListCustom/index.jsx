import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Rating } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';



const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao'];

const OrderListCustom = (props) => {
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();
    const [vouchers, setVouchers] = useState([])

    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${props.user.Id}`)
        setVouchers(response.data)
        console.log(vouchers)
    }

    const getActiveStep = (status) => {
        return steps.indexOf(status);
    };

    async function fetchOrderItems(id) {
        const response = await axios.get(`http://localhost:3000/order/list/${id}`);
        return response.data;
    }

    async function fetchCustomComponents(orderId) {
        const response = await axios.get(`http://localhost:3000/order/getCustomComponentImageByOrderID?orderId=${orderId}`);
        return response.data;
    }

    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/order/user2/${props.user.Id}`);
        if (response.data.length > 0) {
            const order = response.data;
            const items = await fetchOrderItems(order.Id);
            const customComponents = await fetchCustomComponents(order.Id);

            const orderWithItems = { ...order, items, customComponents };
            setCards([orderWithItems]);
        }
    }

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
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </div>
                    <hr className="border  border-slate-300 my-2 w-full " />

                    <div className="flex-row w-full">
                        {card.customComponents.map((component) => (
                            <div key={component.Id}>
                                <div className="flex-row w-full">
                                    <div className="flex place-content-between">
                                        <div className="flex">
                                            <img className="h-30 w-20 mx-4" src={component.Picture} />
                                            <div className="">
                                                <div className="font-bold">{component.Name}</div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="mx-8 my-4 text-right ">
                                                {(component.Price).toLocaleString('vi', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <hr className="border  border-slate-300 my-2 mx-8" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-row w-full">
                        <div className="flex place-content-between">
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
                </div>
            ))}
        </>
    );
};

export default OrderListCustom;
