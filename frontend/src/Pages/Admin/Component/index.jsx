/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import {
    Button,
    ButtonBase,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { Component, useEffect, useState, useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Axios from 'axios'
import Popup from 'reactjs-popup'
// import EditProductForm from '../EditProductForm/index'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import EditComponentForm from '../EditComponentForm'
import CategoryNav from '../../../components/features/CategoryNav'
import { UserContext } from '../../../UserContext'

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAlt from '@mui/icons-material/FilterAlt'

export default function Components() {
    const { user } = useContext(UserContext)

    const [Components, setComponents] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])

    const [cate, setCate] = useState([])
    const [cageCate, setCageCate] = useState([])
    const [selectedCageCate, setSelectedCageCate] = useState('All')

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [upperPrice, setUpperPrice] = useState('')
    const [lowerPrice, setLowerPrice] = useState('')
    const [upperStock, setUpperStock] = useState('')
    const [lowerStock, setLowerStock] = useState('')
    const [prostatus, setProStatus] = useState('')
    const handleIdChange = (event) => {
        setId(event.target.value)
        setPage(1)
    }
    const handleNameChange = (event) => {
        setName(event.target.value)
        setPage(1)
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value)
        setPage(1)
    }
    const handleCageCate = (cageCate) => {
        setSelectedCageCate(cageCate)
        setPage(1)
    }

    const handleUpperPriceChange = (event) => {
        setUpperPrice(event.target.value)
        setPage(1)
    }

    const handleLowerPriceChange = (event) => {
        setLowerPrice(event.target.value)
        setPage(1)
    }

    const handleUpperStockChange = (event) => {
        setUpperStock(event.target.value)
        setPage(1)
    }

    const handleLowerStockChange = (event) => {
        setLowerStock(event.target.value)
        setPage(1)
    }

    const handleStatusChange = (event) => {
        setProStatus(event.target.value)
        setPage(1)
    }
    const handleSwitchPage = (page) => {
        console.log(page)
        setPage(page)
    }
    async function handleDelete(id) {
        await axios.delete(`http://localhost:3000/component/` + id)
        alert('Component is deleted')
        handleFilter()
    }

    const handleFilter = async () => {
        const json = {
            id: id,
            name: name,
            category: category,
            upper_price: upperPrice,
            lower_price: lowerPrice,
            upper_stock: upperStock,
            lower_stock: lowerStock,
            status: prostatus,
            application: selectedCageCate,
            page: page
        }
        Axios.post('http://localhost:3000/component/filterComponent', json)
            .then((response) => {
                setComponents(response.data.data)
                setMaxPage(Math.ceil(response.data.lines.COUNT / 10))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }
    async function fetchCates() {
        setCate(['Móc', 'Nắp', 'Đáy', 'Nan', 'Bình nước', 'Khung', 'Cửa'])
    }
    async function fetchCageCates() {
        const response = await axios.get('http://localhost:3000/category/')
        setCageCate(response.data)
    }
    useEffect(() => {
        handleFilter()
    }, [selectedCageCate])

    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])

    useEffect(() => {
        handleFilter()
        fetchCates()
        fetchCageCates()
    })
    const status = [
        {
            value: 'All',
            label: 'All'
        },
        {
            value: 'Enable',
            label: 'Enable'
        },
        {
            value: 'Disable',
            label: 'Disable'
        }
    ]

    //
    ///active button
    const [activeButton, setActiveButton] = useState(null)

    const handleButtonClick = (buttonName, cateId) => {
        setActiveButton(buttonName)
        handleCageCate(cateId)
    }

    return (
        <div className="px-2 py-2 w-full  mb-96">
            <div className="flex-col">
                <CategoryNav
                    parents={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Bảng điều khiển', link: '/admin' }
                    ]}
                    margin={0}
                    current="Danh sách thành phần"
                />
                <div className="my-5 text-2xl font-bold">Danh sách thành phần lồng</div>
                {/* <Button onClick={() => '/admin/NewComponent'}>New Component</Button> */}
            </div>
            <div className="flex align-bottom ">
                {/* <div className="mx-2 ">Lồng</div> */}
                <div className="flex">
                    {cageCate.map(
                        (cate, index) =>
                            cate.Allow_customize == true && (
                                <div key={index}>
                                    <button
                                        className={`p-2 rounded-t-lg ${activeButton === cate.name ? 'bg-white' : 'bg-slate-300'}`}
                                        onClick={() => handleButtonClick(cate.name, cate.id)}
                                    >
                                        {cate.name}
                                    </button>
                                </div>
                            )
                    )}
                </div>
                {/* <div>
                    <FilterAlt />
                </div> */}
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="flex-row">
                                    {/* <div>Mã SP</div> */}
                                    <div>
                                        <TextField
                                            className="w-16"
                                            id="outlined-basic"
                                            placeholder="Mã SP"
                                            variant="standard"
                                            onChange={handleIdChange}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base">Image</div>
                                    {/* <div>Hình ảnh</div> */}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base">Name</div>
                                    <div>
                                        <TextField
                                            className="w-64"
                                            id="outlined-basic"
                                            placeholder="Tên sản phẩm"
                                            variant="standard"
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base">Giá</div>
                                    <div className="flex">
                                        <div className="w-16">
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="From"
                                                variant="standard"
                                                onChange={handleLowerPriceChange}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="To"
                                                variant="standard"
                                                onChange={handleUpperPriceChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base">Số lượng</div>
                                    <div className="flex">
                                        <div className="w-16">
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="From"
                                                variant="standard"
                                                onChange={handleLowerStockChange}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="To"
                                                variant="standard"
                                                onChange={handleUpperStockChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base">Phân loại</div>
                                    <div>
                                        <TextField
                                            className="w-64"
                                            select
                                            placeholder="Loại"
                                            variant="filled"
                                            onChange={handleCategoryChange}
                                            defaultValue="All"
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            {cate.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-base"> Trạng thái</div>
                                    <div>
                                        <TextField
                                            className="w-32 text-left"
                                            select
                                            placeholder="Status"
                                            variant="filled"
                                            onChange={handleStatusChange}
                                            defaultValue="All"
                                        >
                                            {status.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-sm text-right">Sửa/xóa</div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // cageCate.filter((cate) => {
                            //     if (activeButton === 'vuong') {
                            //         return cate.Id.trim() === 'LV'
                            //     }
                            //     if (activeButton === 'tron') {
                            //         return cate.Id.trim() === 'LT'
                            //     }
                            //     if (activeButton === 'lucgiac') {
                            //         return cate.Id.trim() === 'LG'
                            //     }
                            //     if (activeButton === 'singapore') {
                            //         return cate.Id.trim() === 'LS'
                            //     }
                            //     return true // Show all by default
                            // })
                            // const compo = await axios.get(`http://localhost:3000/getAllComponentByCate/${cageCate[0].Id.trim()}`)
                            // setComponents(compo.data)
                            Components.map((Component) => (
                                <TableRow>
                                    <TableCell>{Component.ID}</TableCell>
                                    <TableCell>
                                        <img className="w-16 h-16   " src={Component.Picture} />
                                    </TableCell>
                                    <TableCell>{Component.Name}</TableCell>
                                    <TableCell>{Component.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell>{Component.Stock}</TableCell>
                                    <TableCell>{Component.Type}</TableCell>
                                    <TableCell>{Component.Status}</TableCell>
                                    {user && user.Role == 'Admin' && (
                                        <TableCell>
                                            {' '}
                                            <div className="flex justify-end">
                                                <Popup
                                                    trigger={
                                                        <button className="">
                                                            <ModeEditIcon fontSize="medium" />
                                                        </button>
                                                    }
                                                    position="right center"
                                                    modal
                                                    closeOnDocumentClick={false}
                                                    closeOnEscape={false}
                                                >
                                                    {(close) => (
                                                        <div>
                                                            <div className="flex place-content-between ">
                                                                <div className="m-4 font-bold text-lg">Chỉnh sửa sản phẩm </div>
                                                                <div>
                                                                    <Button variant="outlined" className="" onClick={close}>
                                                                        X
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <EditComponentForm ComponentId={Component.ID} close={close} handleFilter={handleFilter} />
                                                        </div>
                                                    )}
                                                </Popup>
                                                <Popup
                                                    trigger={
                                                        <button onClick={() => handleDelete(Component.ID)}>
                                                            <DeleteIcon fontSize="medium" />
                                                        </button>
                                                    }
                                                    position="right center"
                                                    modal
                                                >
                                                    {(close) => (
                                                        <>
                                                            <div className="flex justify-center">
                                                                Bạn có chắc chắn muốn xóa thành phần lồng này không?
                                                            </div>
                                                            <div className="flex justify-center">
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        handleDelete(Component.ID)
                                                                        close()
                                                                    }}
                                                                >
                                                                    Có
                                                                </Button>
                                                                <Button variant="outlined" onClick={close}>
                                                                    Không
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </Popup>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-center my-4">
                {pageList.map((pg, index) => (
                    <td key={index}>
                        <div className="items-center">
                            <Button variant={index + 1 === page ? 'contained' : 'outlined'} onClick={() => handleSwitchPage(index + 1)}>
                                {index + 1}
                            </Button>
                        </div>
                    </td>
                ))}
            </div>
        </div>
    )
}
