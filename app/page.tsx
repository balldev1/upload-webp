'use client';
import { useState } from 'react';

type ImageUploadType = {
    id: number;
    preview: string;
    file: File;
};

interface FormData {
    name: string;
    status: string;
    visibility: string;
    publishOn: string;
    catalogVisibility: string;
    description: string;
    regularPrice: number;
    salePrice: number;
    taxStatus: string;
    taxClass: string;
    productLayout: string;
    productStyle: string;
    sku: string;
    stockManagement: boolean;
    quantity: number;
    allowBackorders: string;
    lowStockThreshold: number;
    stockStatus: string;
    soldIndividually: boolean;
    totalStockQuantity: number;
    weight: number;
    shippingClass: string;
    specifications: string[][];
    categories: any[];
}

export default function Home() {
    const [images, setImages] = useState<ImageUploadType[]>([]);
    const [message, setMessage] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        status: 'Published',
        visibility: 'Public',
        publishOn: '',
        catalogVisibility: 'Shop and search results',
        description: '',
        regularPrice: 0,
        salePrice: 0,
        taxStatus: 'Taxable',
        taxClass: 'Standard',
        productLayout: 'Default',
        productStyle: 'Default',
        sku: '',
        stockManagement: true,
        quantity: 0,
        allowBackorders: 'Do not allow',
        lowStockThreshold: 0,
        stockStatus: '',
        soldIndividually: false,
        totalStockQuantity: 0,
        weight: 0,
        shippingClass: 'No shipping class',
        specifications: [['', '']],
        categories: []
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages: ImageUploadType[] = Array.from(e.target.files).map((file, index) => {
                return {
                    id: Date.now() + index,
                    preview: URL.createObjectURL(file),
                    file
                };
            });
            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleUpload = async () => {
        if (images.length === 0) {
            setMessage('Please select a file to upload');
            return;
        }
        const uploadFormData = new FormData();
        images.forEach(image => {
            uploadFormData.append('files', image.file);
        });
        // Replace with actual userId
        uploadFormData.append('userId', 'yourUserId');

        const res = await fetch('http://localhost:3000/api/webp', {
            method: 'POST',
            body: uploadFormData,
        } as RequestInit); // Ensure correct typing

        const result = await res.json();
        if (res.ok) {
            setMessage(result.message);
        } else {
            setMessage(result.error);
        }
    };

    return (
        <div>
            <h1>Upload Images</h1>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                id="file-input"
                className="hidden"
            />
            <button onClick={() => document.getElementById('file-input')?.click()}>Select Images</button>
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
            <div>
                {images.map(image => (
                    <img key={image.id} src={image.preview} alt="preview" width="100" />
                ))}
            </div>
        </div>
    );
}
