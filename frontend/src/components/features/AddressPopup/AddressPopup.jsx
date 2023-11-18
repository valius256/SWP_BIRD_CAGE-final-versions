import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Button, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./AddressPopup.css"

function AddressPopup(props) {
    const [cityList, setCityList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])

    const [tinhTP, setTinhTP] = useState('')
    const [quanHuyen, setQuanHuyen] = useState('')
    const [phuongXa, setPhuongXa] = useState('')
    const [soNha, setSoNha] = useState('')

    const [districtIdx, setDistrictIdx] = useState(0)
    const [cityIdx, setCityIdx] = useState(0)

    const host = 'https://provinces.open-api.vn/api/?depth=3'

    async function fetchCity() {
        const response = await axios.get(host)
        setCityList(response.data)
    }

    async function fetchDistrict(city_code) {
        const response = await axios.get(host)
        setDistrictList(response.data[city_code].districts)
    }

    async function fetchWard(city_code, district_code) {
        const response = await axios.get(host)
        setWardList(response.data[city_code].districts[district_code].wards)
    }

    async function handleSubmit(event, fetchAddresses,close) {
        if (tinhTP != 'Chọn tỉnh thành' && quanHuyen != 'Chọn quận huyện' && phuongXa != 'Chọn phường xã' && soNha != '') {
            await axios.post(
                `http://localhost:3000/address/new?city=${tinhTP}&district=${quanHuyen}&ward=${phuongXa}&location=${soNha}&userid=${props.user.Id}`
            )
            toast.dismiss()
            toast.success('Thêm địa chỉ thành công', {
                position: 'bottom-left',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            })
            fetchAddresses()
            close()
        } else {
            alert('Xin vui lòng điền đầy đủ thông tin')
        }
    }

    function handleClose() {
        setDistrictList([])
        setWardList([])
        setTinhTP('Chọn tỉnh thành')
        setQuanHuyen('Chọn quận huyện')
        setPhuongXa('Chọn phường xã')
        setSoNha('')
    }

    useEffect(() => {
        fetchCity()
    }, [])

    return (
        <div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn tỉnh thành"
                    id="city"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    onChange={(event) => {
                        setCityIdx(event.target.selectedIndex - 1)
                        fetchDistrict(event.target.selectedIndex - 1)
                        setTinhTP(event.target.value)
                    }}
                >
                    <option value="" selected></option>
                    {cityList.map((city, index) => (
                        <option key={city.code} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn quận huyện"
                    id="district"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    onChange={(event) => {
                        setDistrictIdx(event.target.selectedIndex - 1)
                        fetchWard(cityIdx, event.target.selectedIndex - 1)
                        setQuanHuyen(event.target.value)
                    }}
                >
                    <option value="" selected></option>
                    {districtList.map((district, index) => (
                        <option key={district.code} value={district.name}>
                            {district.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn phường xã"
                    className="location"
                    id="ward"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    onChange={(event) => {
                        setPhuongXa(event.target.value)
                    }}
                >
                    <option value="" selected></option>
                    {wardList.map((ward, index) => (
                        <option key={ward.code} value={ward.name}>
                            {ward.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    className="location"
                    size="small"
                    type="text"
                    placeholder="Số nhà"
                    onChange={(event) => {
                        setSoNha(event.target.value)
                    }}
                ></TextField>
            </div>
            <div className="buttons">
                {/* <button className="decision" onClick={close}></button> */}
                <Button variant="contained" onClick={props.close}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={(event) => {
                        handleSubmit(event, props.fetchAddresses ,props.close, handleClose);
                    }}
                >
                    Ok
                </Button>
            </div>
        </div>
    )
}

export default AddressPopup
