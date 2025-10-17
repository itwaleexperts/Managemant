import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUpload } from "react-icons/fa";

const API_URL = 'https://apiyatraadda.jaspersoftwaresolutions.com/api/explore';
const NEW_FILE_PLACEHOLDER = 'NEW_FILE_UPLOADED'; 

const getBackendUrl = (path) => {
    return path && !path.startsWith('blob:') && !path.startsWith('http') ? `https://apiyatraadda.jaspersoftwaresolutions.com${path}` : path;
};

const ExploreForm = ({ exploreData, onSuccess, onCancel }) => {
    const initialState = {
        name: '', 
        banner: '',
        cities: [{ name: '', img: '' }]
    };

    const [formData, setFormData] = useState(exploreData || initialState);
    const [bannerFile, setBannerFile] = useState(null);
    const [cityImageFiles, setCityImageFiles] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const initialData = JSON.parse(JSON.stringify(exploreData || initialState));
        setFormData(initialData);
        setBannerFile(null);
        setCityImageFiles({});
    }, [exploreData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBannerChange = (file) => {
        setBannerFile(file);
        setFormData({ ...formData, banner: file ? URL.createObjectURL(file) : exploreData?.banner || '' });
    };

    const handleCityChange = (index, e) => {
        const { name, value } = e.target;
        const newCities = formData.cities.map((city, i) => i === index ? { ...city, [name]: value } : city);
        setFormData({ ...formData, cities: newCities });
    };

    const handleCityImageFileChange = (index, file) => {
        setCityImageFiles(prev => ({ ...prev, [index]: file }));
        const newCities = formData.cities.map((city, i) => i === index ? {
            ...city,
            img: file ? URL.createObjectURL(file) : city.img
        } : city);
        setFormData({ ...formData, cities: newCities });
    };

    const addCity = () => {
        setFormData({ ...formData, cities: [...formData.cities, { name: '', img: '' }] });
    };

    const removeCity = (index) => {
        const newCities = formData.cities.filter((_, i) => i !== index);
        setFormData({ ...formData, cities: newCities });
        setCityImageFiles(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);

        let finalBannerPath = formData.banner;
        if (bannerFile) {
            dataToSend.append("images", bannerFile);
            finalBannerPath = NEW_FILE_PLACEHOLDER; 
        }
        dataToSend.append("banner", finalBannerPath);


        const citiesForBackend = formData.cities.map((city, index) => {
            const newFile = cityImageFiles[index];
            return {
                name: city.name,
                img: newFile ? NEW_FILE_PLACEHOLDER : city.img
            };
        });

        dataToSend.append("cities", JSON.stringify(citiesForBackend));

        Object.values(cityImageFiles).forEach((file) => {
            if (file) {
                dataToSend.append("images", file);
            }
        });

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const endpoint = exploreData ? `${API_URL}/${exploreData._id}` : API_URL;
            const method = exploreData ? axios.put : axios.post;

            await method(endpoint, dataToSend, config);
            alert(`Explore data ${exploreData ? 'updated' : 'created'} successfully!`);
            onSuccess();
        } catch (err) {
            console.error("Submission Error:", err.response?.data || err);
            alert(`Failed to save data. Message: ${err.response?.data?.message || 'Server Error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCityImageSrc = (city, index) => {
        if (cityImageFiles[index]) return URL.createObjectURL(cityImageFiles[index]);
        return getBackendUrl(city.img);
    };

    return (
        <div className="bg-white p-8 shadow-2xl rounded-xl mb-8 border-t-8 border-purple-600">
            <h3 className="text-3xl font-bold mb-6 text-purple-800 border-b-2 border-purple-200 pb-3">
                {exploreData ? 'Edit Explore Data' : 'Add New Explore Data'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">Country Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">Banner Image:</label>
                    {formData.banner && (
                        <img
                            src={getBackendUrl(formData.banner)}
                            alt="Banner Preview"
                            className="w-40 h-24 object-cover rounded-lg mb-3 border-4 border-purple-500 shadow-lg"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBannerChange(e.target.files[0])}
                        required={!exploreData && !formData.banner} // Creation/Update check
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                </div>


                <h4 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Cities and Images</h4>

                <div className="space-y-6">
                    {formData.cities.map((city, index) => (
                        <div key={index} className="border border-purple-400 p-5 rounded-xl bg-purple-50 shadow-md">
                            <div className="flex justify-between items-center mb-4 border-b border-purple-200 pb-2">
                                <h5 className="font-bold text-xl text-purple-700">City #{index + 1}</h5>
                                {formData.cities.length > 1 && (
                                    <button type="button" onClick={() => removeCity(index)} className="text-red-500 hover:text-red-700 transition duration-150 p-1 rounded-full bg-white">
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-700 mb-1 font-medium">City Name:</label>
                                    <input type="text" name="name" value={city.name} onChange={(e) => handleCityChange(index, e)} required className="w-full p-3 border border-gray-300 rounded-lg" />
                                </div>

                                <div className="row-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">City Image:</label>
                                    {getCityImageSrc(city, index) && (
                                        <img src={getCityImageSrc(city, index)} alt={`City ${city.name} preview`} className="w-32 h-24 object-cover rounded-lg mb-3 border-4 border-green-500 shadow-lg" />
                                    )}

                                    <input type="file" accept="image/*" onChange={(e) => handleCityImageFileChange(index, e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" disabled={isSubmitting} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={addCity} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 flex items-center shadow-md">
                    <FaPlus className="h-4 w-4 mr-1" />
                    Add Another City
                </button>

                <div className="mt-8 flex justify-end space-x-3 border-t pt-4">
                    <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-150">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-150 disabled:opacity-50 flex items-center">
                        {isSubmitting ? 'Saving...' : exploreData ? 'Update Data' : 'Create Data'}
                        <FaUpload className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

const AdminExplore = () => {
    const [exploreItems, setExploreItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setExploreItems(response.data.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchData();
            } catch (err) {
                console.error("Error deleting item:", err);
            }
        }
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        fetchData();
    };

    if (loading) return <div className="p-8"><p className="text-lg text-purple-600 mt-10">Loading explore data...</p></div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-4 border-purple-500 pb-2">🗺️ Explore Data Management</h1>

            <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200 flex items-center">
                <FaPlus className="h-5 w-5 mr-2" />
                Add New Country
            </button>

            {isFormOpen && (
                <ExploreForm
                    exploreData={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">Current Explore Countries</h2>
            <div className="shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Country Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cities Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Banner Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exploreItems.map(item => (
                            <tr key={item._id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.cities.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={getBackendUrl(item.banner)} alt="Banner" className="w-16 h-10 object-cover rounded" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-3">
                                    <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-150 flex items-center">
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-150 flex items-center">
                                        <FaTrash className="mr-1" /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminExplore;