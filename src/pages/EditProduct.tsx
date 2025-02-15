import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, ScanBarcode, X } from 'lucide-react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
}

interface FormData {
    name: string;
    productCode: string;
    slug: string;
    shopId?: string;
    categoryId: string;
    brandId?: string;
    image: string;
    barcode?: string;
    unitTypes: string[];
    assured?: boolean;
}

function EditProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};
    console.log("prodect for edit", product);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Control visibility of the category modal
    const [isBrandModalOpen, setBrandModalOpen] = useState(false); // Control visibility of the brand modal
    const [newCategory, setNewCategory] = useState('');
    const [newBrand, setNewBrand] = useState('');
    const [searchCategory, setSearchCategory] = useState(''); // Search for category
    const [searchBrand, setSearchBrand] = useState(''); // Search for brand
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // Selected category
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null); // Selected brand
    const [imageUrl, setImageUrl] = useState<string>(product.image);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(product.unitTypes);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: product.name,
        productCode: product.productCode,
        slug: product.slug,
        shopId: product.shopId,
        categoryId: product.category.id,
        image: product.image,
        barcode: product.barcode,
        unitTypes: product.unitTypes,
        assured: product.assured,
    });

    const options = ["kilogram", "gram", "count"];

    const handleOptionToggle = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const generateSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '-');

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category);
        setFormData({ ...formData, categoryId: category.id });
        setIsModalOpen(false);
    };

    const handleSelectBrand = (brand: Brand) => {
        setSelectedBrand(brand);
        setFormData({ ...formData, brandId: brand.id });
        setBrandModalOpen(false);
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            const slug = generateSlug(newCategory);
            const data = { name: newCategory, slug };

            axios.post(`https://ipos-api-1.onrender.com/api/v1/categories`, data)
                .then((res) => {
                    setCategories([...categories, res.data]);
                    setNewCategory('');
                    setIsModalOpen(false);
                    handleSelectCategory(res.data);
                })
                .catch((error) => {
                    console.error('Error creating category:', error);
                    alert('Failed to create category. Please try again.');
                });
        }
    };

    const handleAddBrand = () => {
        if (newBrand.trim()) {
            const slug = generateSlug(newBrand);
            const data = { name: newBrand, slug };

            axios.post('https://ipos-api-1.onrender.com/api/v1/brands', data)
                .then((res) => {
                    setBrands([...brands, res.data]);
                    setNewBrand('');
                    setBrandModalOpen(false);
                    handleSelectBrand(res.data);
                })
                .catch((error) => {
                    console.error('Error creating brand:', error);
                    alert('Failed to create brand. Please try again.');
                });
        }
    };

    const handleAddGProduct = () => {
        const productSlug = generateSlug(formData.name);
        const updatedFormData = {}

        if (formData.barcode !== product.barcode) { updatedFormData.barcode = formData.barcode; }
        if (formData.categoryId !== product.category.id) { updatedFormData.categoryId = formData.categoryId; }
        if (formData.brandId !== product.brand.id) { updatedFormData.brandId = formData.brandId; }
        // if (formData.image !== product.image) { updatedFormData.image = [imageUrl]; }
        if (formData.name !== product.name) { updatedFormData.name = formData.name; }
        if (formData.slug !== product.slug) { updatedFormData.slug = productSlug; }
        if (selectedOptions !== product.unitTypes) { updatedFormData.unitTypes = selectedOptions; }
        if (formData.productCode !== product.productCode) { updatedFormData.productCode = productSlug; }
        if (formData.assured !== product.assured) { updatedFormData.assured = false; }
        
        
        console.log("data for submit", updatedFormData);

        axios.put("https://barter-docker-607836465200.asia-south1.run.app/api/v1/gproducts", updatedFormData)
            .then((res) => {
                console.log("gproducts submitted successfully", res);
                navigate(-1);
            })
            .catch((error) => {
                console.error('Error creating GPRODUCT:', error);
                alert('Failed to update GPRODUCT. Please try again.');
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, brandRes] = await Promise.all([
                    axios.get('https://ipos-api-1.onrender.com/api/v1/categories'),
                    axios.get('https://ipos-api-1.onrender.com/api/v1/brands'),
                ]);
                setCategories(categoryRes.data.data);
                setBrands(brandRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleScan = (_error: any, result: any) => {
        if (result) {
            setFormData({ ...formData, barcode: result.text });
            setScannerOpen(false); // Close the scanner after scanning
        }
    };

    return (
        <div className='flex'>
            <Sidebar activeTab="products" />

            <section className="mt-3 flex w-full flex-col items-center justify-center rounded-md">
                <div className="flex justify-between items-center w-full px-5 my-5">
                    <Link to={'/products'} className='btn btn-sm btn-secondary'> <ChevronLeft /> </Link>
                    <h1 className="text-3xl font-bold ">{product.name}</h1>
                </div>
                <div className="text-xs text-gray-500">
                    <img src={imageUrl || '/placeholder.svg'} alt="" className='h-20 w-20 mx-auto my-3 rounded-md' />
                    <div className="m-auto flex flex-col gap-3">
                        <div className="flex flex-col px-2 gap-1">
                            <label> Image Link </label>
                            <input
                                type="text"
                                className="input w-[100vw] max-w-[90vw] md:max-w-[50vw] xl:max-w-[30vw]"
                                placeholder="https://image.link"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col px-2 gap-1">
                            <label> Name </label>
                            <input
                                type="text"
                                className="input w-[100vw] max-w-[90vw] md:max-w-[50vw] xl:max-w-[30vw]"
                                placeholder="Product name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className='flex flex-col px-2 gap-1'>
                            <label> Quantity type </label>
                            <div className="flex gap-2 flex-wrap">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        className={`flex btn btn-sm p-2 items-center gap-2  
                                            ${selectedOptions.includes(option)
                                                ? "btn-secondary"
                                                : "btn-solid-secondary"
                                            }`}
                                        onClick={() => handleOptionToggle(option)}
                                    >
                                        <span className="capitalize">{option}</span>
                                        <span>
                                            {selectedOptions.includes(option) ? (
                                                <X className='h-4 w-4' />
                                            ) : (
                                                <Plus className='h-4 w-4' />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col px-2 gap-1">
                            <label> Category </label>
                            <button
                                className="btn btn-outline font-normal text-gray-400 flex justify-start w-[100vw] max-w-[90vw] md:max-w-[50vw] xl:max-w-[30vw]"
                                onClick={() => setIsModalOpen(true)}
                            >
                                {selectedCategory ? selectedCategory.name : 'Select Category'}
                            </button>
                        </div>
                        <div className="flex flex-col px-2 gap-1">
                            <label> Brand / Company </label>
                            <button
                                className="btn btn-outline font-normal text-gray-400 flex justify-start w-[100vw] max-w-[90vw] md:max-w-[50vw] xl:max-w-[30vw]"
                                onClick={() => setBrandModalOpen(true)}
                            >
                                {selectedBrand ? selectedBrand.name : 'Select Brand'}
                            </button>
                        </div>

                        {/* Barcode */}
                        <div className="flex flex-col px-2 gap-1 mt-3">
                            <span className="text-xs">Barcode / QR Code (optional)</span>
                            <div className="flex gap-1">
                                <button onClick={() => setScannerOpen(!scannerOpen)} className="btn p-2  btn-solid-secondary border-2 border-secondary">
                                    <ScanBarcode className="h-5" />
                                </button>
                                <input
                                    className="input w-full max-w-[90%]"
                                    placeholder="Enter or scan code"
                                    onChange={(e) =>
                                        setFormData({ ...formData, barcode: e.target.value })
                                    }
                                    value={formData.barcode}
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Barcode scanner */}
                        {scannerOpen && (
                            <div className="w-full max-w-md p-4 rounded-md">
                                <BarcodeScannerComponent
                                    width={400}
                                    height={200}
                                    onUpdate={handleScan}
                                    delay={300}
                                    facingMode="environment" // Use rear camera
                                />
                            </div>
                        )}

                        <div className="flex flex-col px-2 mb-4 gap-1">
                            <button
                                className="btn btn-secondary w-[100vw] max-w-[90vw] md:max-w-[50vw] xl:max-w-[30vw]"
                                onClick={() => handleAddGProduct()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for Categories */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-backgroundPrimary rounded-lg shadow-lg w-[90vw] md:w-[50vw] xl:w-[30vw] p-6">
                        <h2 className="text-lg font-semibold mb-4">Select Category</h2>
                        <input
                            type="text"
                            className="input mb-4"
                            placeholder="Search category"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        />
                        <ul className="mb-4">
                            {categories?.filter((category) =>
                                category.name.toLowerCase().includes(searchCategory.toLowerCase())
                            )
                                .map((category) => (
                                    <li
                                        key={category.id}
                                        className="py-2 px-4 rounded-md bg-backgroundSecondary hover:bg-backgroundSecondary/50 cursor-pointer mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
                                        onClick={() => handleSelectCategory(category)}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                        </ul>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="New category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button className="btn btn-secondary" onClick={handleAddCategory}>
                                Add
                            </button>
                        </div>
                        <div className="mt-4 text-right">
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Brands */}
            {isBrandModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-backgroundPrimary rounded-lg shadow-lg w-[90vw] md:w-[50vw] xl:w-[30vw] p-6">
                        <h2 className="text-lg font-semibold mb-4">Select Brand</h2>
                        <input
                            type="text"
                            className="input mb-4"
                            placeholder="Search brand"
                            value={searchBrand}
                            onChange={(e) => setSearchBrand(e.target.value)}
                        />
                        <ul className="mb-4">
                            {brands
                                .filter((brand) =>
                                    brand.name.toLowerCase().includes(searchBrand.toLowerCase())
                                )
                                .map((brand) => (
                                    <li
                                        key={brand.id}
                                        className="py-2 px-4 rounded-md bg-backgroundSecondary hover:bg-backgroundSecondary/50 cursor-pointer mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
                                        onClick={() => handleSelectBrand(brand)}
                                    >
                                        {brand.name}
                                    </li>
                                ))}
                        </ul>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="New brand name"
                                value={newBrand}
                                onChange={(e) => setNewBrand(e.target.value)}
                            />
                            <button className="btn btn-secondary" onClick={handleAddBrand}>
                                Add
                            </button>
                        </div>
                        <div className="mt-4 text-right">
                            <button className="btn btn-primary" onClick={() => setBrandModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProduct;