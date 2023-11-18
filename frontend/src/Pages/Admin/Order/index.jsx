import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Popup from 'reactjs-popup'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CategoryNav from '../../../components/features/CategoryNav'
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'user', headerName: 'Người mua', width: 130 },
    { field: 'orderDate', headerName: 'Ngày đặt hàng', width: 130 },
    { field: 'status', headerName: 'Thanh toán', width: 130 },
    { field: 'shipping', headerName: 'Trạng thái', width: 130 },

    {
        field: 'address',
        headerName: 'Địa chỉ',
        width: 150
    },
    {
        field: 'phone',
        headerName: 'Số điện thoại',
        // description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 130
        // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    },
    { field: 'total', headerName: 'Tổng tiền', width: 130 },
    { field: 'updateAt', headerName: 'Ngày chỉnh sửa', width: 130 },
    { field: 'note', headerName: 'Ghi chú', width: 130 }
]

export default function Order() {
    const [openPopup, setOpenPopup] = useState(false)
    const [cards, setCards] = useState([])
    const [order, setOrder] = useState('')
    const [orderItem, setOrderItem] = useState([])
    const [rows, setRows] = useState([])
    const [btnState, setBtnState] = useState('')

    const handleRowClick = async (id) => {
        console.log(id)
        const order = await getAnOrder(id)
        const detail = await fetchOrderItems(id)
        setOrder(order)
        setOrderItem(detail)
        setOpenPopup(true)
    }

    async function getAnOrder(id) {
        const response = await axios.get(`http://localhost:3000/order/${id}`)
        return response.data
    }
    async function fetchOrderItems(id) {
        const response = await axios.get(`http://localhost:3000/order/list/${id}`)
        return response.data
    }
    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/order`)
        if (response.data) {
            const jsonData = response.data
            const ordersWithItems = []

            for (const order of jsonData) {
                const items = await fetchOrderItems(order.Id)
                const orderWithItems = { ...order, items }
                ordersWithItems.push(orderWithItems)
            }
            setCards(ordersWithItems)
        }
    }

    async function changeState(orderId, status) {
        await axios.post(`http://localhost:3000/shipper/change`, {
            orderId: orderId,
            status: status
        })
        if (status == "Đã giao"){
            await axios.get(`http://localhost:3000/order/paidstatus/`+orderId)

        }

        alert('Order is updated')
        fetchOrder()
    }
    useEffect(() => {
        fetchOrder()
    }, [])

    useEffect(() => {
        const data = []
        cards.map((card) => {
            data.push({
                id: card.OrderId,
                user: card.Name,
                orderDate: card.OrderDate ? card.OrderDate.substr(0, 10) : '',
                status: card.Status_Paid,
                shipping: card.Status_Shipping,
                address: card.Address,
                phone: card.PhoneNumber,
                total: card.TotalAmount,
                note: card.Note,
                updateAt: card.UpdateAt ? card.UpdateAt.substr(0, 10) : ''
            })
        })
        setRows(data)
    }, [cards])

    //step
    const buttonState = ['Duyệt', 'Đã bàn giao cho Shipper', 'Giao hoàn tất']
    const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }

    function getButtonStatus(status) {
        return buttonState[steps.indexOf(status)]
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    ///active button
    const [activeButton, setActiveButton] = useState(null)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }

    return (
        <div className="px-2 py-2 w-full mb-96">
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                current="Đơn hàng"
                margin={0}
            />
            <div className="mt-8 mb-8 font-bold text-2xl">Thông tin đơn hàng</div>
            <div className="pb-10 h-screen">
                <div className="flex">
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 'choDuyet' ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick('choDuyet')}
                        >
                            Chờ duyệt
                        </button>
                    </div>
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 'dangChuanBi' ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick('dangChuanBi')}
                        >
                            Đang chuẩn bị
                        </button>
                    </div>
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 'dangGiao' ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick('dangGiao')}
                        >
                            Đang giao
                        </button>
                    </div>
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 'daGiao' ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick('daGiao')}
                        >
                            Đã giao
                        </button>
                    </div>
                </div>
                <div>
                    <TableContainer className="" component={Paper}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="w-12">ID</TableCell>
                                <TableCell className="w-1/6">Người mua</TableCell>
                                <TableCell>Ngày đặt hàng</TableCell>
                                <TableCell>Thanh toán</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Tổng số tiền</TableCell>
                                <TableCell>Ghi chú</TableCell>
                                <TableCell>...</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards
                                .filter((card) => {
                                    if (activeButton === 'choDuyet') {
                                        return card.Status_Shipping === 'Chờ duyệt'
                                    }
                                    if (activeButton === 'dangChuanBi') {
                                        return card.Status_Shipping === 'Đang chuẩn bị'
                                    }
                                    if (activeButton === 'dangGiao') {
                                        return card.Status_Shipping === 'Đang giao'
                                    }
                                    if (activeButton === 'daGiao') {
                                        return card.Status_Shipping === 'Đã giao'
                                    }
                                    return true // Show all by default
                                })
                                .map((card) => (
                                    <TableRow
                                        key={card.OrderId}
                                        onClick={() => {
                                            handleRowClick(card.OrderId)
                                        }}
                                    >
                                        <TableCell className="w-12">{card.OrderId}</TableCell>
                                        <TableCell className="w-1/6">{card.Name}</TableCell>
                                        <TableCell>{card.OrderDate ? card.OrderDate.substr(0, 10) : ''}</TableCell>
                                        <TableCell>{card.Status_Paid}</TableCell>
                                        {/* <TableCell>{card.Status_Shipping}</TableCell> */}
                                        <TableCell>{card.Address}</TableCell>
                                        <TableCell>{card.PhoneNumber}</TableCell>
                                        <TableCell>{card.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                        <TableCell>{card.Note}</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))}
                            <Popup
                            
                                open={openPopup}
                                onClose={() => setOpenPopup(false)}
                                position="right center"
                                closeOnDocumentClick={false}
                                closeOnEscape={false}
                                modal
                            >
                                {(close) => (
                                    <div>
                                        {order && (
                                            <div>
                                                <div className="flex place-content-between align-middle">
                                                    <div className="flex m-2">
                                                        <div className="px-2">Mã đơn hàng: {order.Id} </div>
                                                        <div>|</div>
                                                        <div className="px-2">Ngày đặt mua: {(order.OrderDate + '').substr(0, 10)} </div>
                                                    </div>
                                                    <div className="m-2">
                                                        {/* <TextField className="w-64" select label="Trạng thái" variant="filled">
                                            <MenuItem value={'Chờ duyệt'}>Chờ Duyệt</MenuItem>
                                            <MenuItem value={'Đang chuẩn bị'}>Đang chuẩn bị</MenuItem>
                                            <MenuItem value={'Đang giao'}>Đang giao</MenuItem>
                                            <MenuItem value={'Đã giao'}>Đã giao</MenuItem>
                                        </TextField> */}
                                                        <Stepper activeStep={getActiveStep(order.Status_Shipping)}>
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
                                                    </div>
                                                </div>
                                                <div className="overflow-y-scroll h-96">
                                                {orderItem.map((item) => (
                                                    <div key={item.Id}>
                                                        <hr />
                                                        <div className="flex my-2 place-content-between">
                                                            <div className="flex">
                                                                <img className="h-30 w-20 mx-4" src={item.Url} alt={item.Name} />
                                                                <div className="">
                                                                    <div className="font-bold">{item.Name}</div>
                                                                    <div className="pl-2">Phân loại: {item.Shape}</div>
                                                                    <div className="pl-2">x{item.Quantity}</div>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                {/* <div className="mx-8 my-4 text-right line-through text-gray-400 ">
                                                        {parseInt((item.Price * 100) / (100 - item.discount)).toLocaleString('vi', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}
                                                    </div> */}
                                                                <div className="mx-8 text-right  text-red-500 ">
                                                                    {' '}
                                                                    {item.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                                </div>
                                                <div className="text-right mx-8 my-4  flex justify-end ">
                                                    <div className="text-xl font-bold   ">Tổng cộng:</div>
                                                    <div className="mx-2"></div>
                                                    <div className="text-red-500 text-xl">
                                                        {order.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                    </div>
                                                </div>
                                                <div className="flex mx-2 place-content-between">
                                                    <div className="flex gap-4">
                                                        {getActiveStep(order.Status_Shipping) < 3 && (
                                                            <Button
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    changeState(order.Id, steps[parseInt(getActiveStep(order.Status_Shipping)) + 1])
                                                                    close()
                                                                }}
                                                            >
                                                                {getButtonStatus(order.Status_Shipping)}
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Button variant="contained" onClick={close}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Popup>
                        </TableBody>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}
