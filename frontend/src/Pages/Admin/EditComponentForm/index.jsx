import { ButtonBase, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Checkbox } from '@mui/material'
import { React, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import ImageUploader from '../../../components/features/ImageUploader/index'

export default function EditComponentForm({ ComponentId, close, handleFilter }) {
    const [typeList, setTypeList] = useState([])
    const [Component, setComponent] = useState({})
    const [images, setImages] = useState([]);
    //temp varible
    const [tmpName, setTempName] = useState('')
    const [categories, setCategories] = useState([])
    const [tmpDescription, setTempDescription] = useState('')
    const [tmpPrice, setTempPrice] = useState(0)
    const [tmpMaterial, setMaterial] = useState('')
    const [tmpColor, setColor] = useState('')
    const [tmpType, setTmpType] = useState('')
    const [tmpStock, setStock] = useState('')
    const [tmpUrl, setUrl] = useState('')
    const [tmpStatus, setStatus] = useState('')
    const [cateLoaded, setCateLoaded] = useState(false)
    const [appliedFor, setAppliedFor] = useState([])

    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/category/')
        if (response.data) {
            setCategories(response.data)
        }
    }
    async function fetchTypes() {
        setTypeList([
            "Móc", "Nắp", "Đáy", "Nan", "Bình nước", "Khung", "Cửa"
        ])
    }
    function getImageList(image) {
        const imagesFromUrls = { data_url: image }
        return [imagesFromUrls];
    }


    async function uploadToHost() {
        const API_key = "d924a9e7cb663c6ceaf42becb5b52542"
        const host = "https://api.imgbb.com/1/upload"
        const expiration = 1800000
        const urls = []
        await Promise.all(images.map(async (image) => {
            const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                image: image.data_url.substring(image.data_url.indexOf(',') + 1)
            })
            if (response.data) {
                urls.push(response.data.data.url)
            }
        }))
        console.log(urls)
        handleUpdate(urls)
    }

    async function fetchComponentDetails(id) {
        const response = await axios.get('http://localhost:3000/component/' + id)
        if (response.data) {
            setComponent(response.data)
            setImages(getImageList(response.data.Picture))
            fetchCatesOfComponent(response.data.ID)
        }
    }

    async function fetchCatesOfComponent(id) {
        const response = await axios.get('http://localhost:3000/component/cate/' + id)
        const list = []
        if (response.data) {
            response.data.map((cates) => {
                list.push(cates.Id)
            })
            setAppliedFor(list)
            setCateLoaded(true)
        }
    }

    async function handleUpdate(url) {
        const json = {
            Id: Component.ID,
            Name: tmpName ? tmpName : Component.Name,
            Category: tmpType ? tmpType : Component.Type,
            Color: tmpColor ? tmpColor : Component.Color,
            Material: tmpMaterial ? tmpMaterial : Component.Material,
            Description: tmpDescription ? tmpDescription : Component.Description,
            Price: tmpPrice ? tmpPrice : Component.Price,
            Stock: tmpStock ? tmpStock : Component.Stock,
            Status: tmpStatus ? tmpStatus : Component.Status,
            Application : appliedFor,
            Picture: url[0]
        }
        console.log(json)
        await axios.post(`http://localhost:3000/component/update`, json)
        alert('Component updated')
        close()
        handleFilter()
    }

    const handleApplyForChange = (event) => {
        const newCate = event.target.value;
        const isCategoryExists = appliedFor.includes(newCate);

        if (isCategoryExists) {
            setAppliedFor(appliedFor.filter((cate) => cate !== newCate));
        } else {
            setAppliedFor([...appliedFor, newCate]);
        }
        console.log(appliedFor)
    };

    const handleNameChange = (event) => {
        setTempName(event.target.value)
    }

    const handlePriceChange = (event) => {
        setTempPrice(event.target.value)
    }
    const handleDescriptionChange = (event) => {
        setTempDescription(event.target.value)
    }
    const handleMaterialChange = (event) => {
        setMaterial(event.target.value)
    }
    const handleStockChange = (event) => {
        setStock(event.target.value)
    }
    const handleTypeChange = (event) => {
        setTmpType(event.target.value)
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value)
    }
    const handleColorChange = (event) => {
        setColor(event.target.value)
    }

    useEffect(() => {
        fetchCategories()
        fetchTypes()
        fetchComponentDetails(ComponentId)
    }, [ComponentId])

    return (
        <form action="" className="w-full ">
            {/* <div className="m-4 font-bold text-lg">Chỉnh sửa sản phẩm </div> */}
            {Component && (
                <div className=" px-4 ">
                    <div className="">
                        {/* <div>name</div> */}
                        <TextField
                            fullWidth
                            label={'Name'}
                            variant="standard"
                            onChange={handleNameChange}
                            value={tmpName ? tmpName : Component.Name}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div className="flex place-content-around">
                        <div className="w-1/2 my-2  ">
                            <div className="">
                                {Component.Type && ( 
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    helperText="Please select category"
                                    variant="filled"
                                    onChange={handleTypeChange}
                                    value={tmpType ? tmpType : Component.Type}
                                >
                                    {typeList.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                )}
                            </div>
                            <div className="">
                                {/* <div>material</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={'Material'}
                                    variant="standard"
                                    onChange={handleMaterialChange}
                                    value={tmpMaterial ? tmpMaterial : Component.Material}
                                />
                            </div>
                            <div className="w-3/4">
                                {/* <div>material</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={'Màu sắc'}
                                    variant="standard"
                                    onChange={handleColorChange}
                                    value={tmpColor ? tmpColor : Component.Color}
                                />
                            </div>
                            <div className="">
                                {/* <div>price</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={' Price'}
                                    variant="standard"
                                    onChange={handlePriceChange}
                                    value={tmpPrice ? tmpPrice : Component.Price}
                                />
                            </div>
                            <div>
                                <div>Áp dụng cho</div>
                                {categories.map((cate) => (
                                    cate.Allow_customize && cateLoaded == true && (
                                        <div key={cate.id}>
                                            {appliedFor.includes(cate.id) ? (
                                                <>
                                                <Checkbox value={cate.id} onChange={handleApplyForChange} defaultChecked />{cate.name}
                                                </>
                                            ) : (
                                                <>
                                                <Checkbox value={cate.id} onChange={handleApplyForChange} />{cate.name}
                                                </>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                            <div className="">
                                {/* <div>description</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={'Description'}
                                    variant="standard"
                                    multiline
                                    rows={6}
                                    onChange={handleDescriptionChange}
                                    value={tmpDescription ? tmpDescription : Component.Description}
                                />
                            </div>
                        </div>
                        <div className="w-1/2 my-2  ">

                            <div className=" flex gap-8 ">
                                <div className="w-20 my-2">
                                    <div>Số Lượng</div>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        label={''}
                                        variant="standard"
                                        onChange={handleStockChange}
                                        value={tmpStock ? tmpStock : Component.Stock}
                                    />
                                </div>
                                <div className="my-2">
                                    <FormControl>
                                        <FormLabel id="status">
                                            <div className="font-bold">Status</div>
                                        </FormLabel>
                                        <RadioGroup
                                            className=""
                                            aria-labelledby="status"
                                            onChange={handleStatusChange}
                                            defaultValue={Component.Status == 'Enable' ? 'Enable' : 'Disable'}
                                        >
                                            <div>
                                                <FormControlLabel value="Enable" control={<Radio />} label="Enable" />
                                            </div>
                                            <div>
                                                <FormControlLabel value="Disable" control={<Radio />} label="Disable" />
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                            <div>
                                <ImageUploader images={images} setImages={setImages} maxNumber={1} />

                            </div>
                        </div>
                    </div>
                    <div className="my-2 text-right">
                        <Button onClick={uploadToHost} className="py-full" variant="contained">
                            update
                        </Button>
                    </div>
                </div>
            )}
        </form>
    )
}
