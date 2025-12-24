'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import Image from 'next/image'
import api from '@/lib/api'
import { toast } from 'sonner'

function Page() {
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        url: '',
        description: '',
        tags: [],
        priority: 1,
        active: true,
        link: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileUpload = (url) => {
        setFormData((prev) => ({ ...prev, url }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title || !formData.type || !formData.url) {
            alert('Title, Type, and URL are required!')
            return
        }
        console.log('Form Data:', formData)
        try {
            const res = await api.post('/util/resources', formData)
            toast.success('Resource created successfully!')
            setFormData({
                title: '',
                type: '',
                url: '',
                description: '',
                tags: [],
                priority: 1,
                active: true,
                link: '', // Reset link field
            })
        } catch (error) {
            console.error('Error creating resource:', error)
            toast.error(error.response?.data?.message || 'Failed to create resource. Please try again.')
        }
    }

    return (
        <div className="p-4">
            <Button
                variant="outline"
                className="w-full max-w-sm mx-auto mt-4 cursor-pointer"
                onClick={() => setShowUploadDialog(true)}
            >
                Create Resource
            </Button>
            {showUploadDialog && (
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogContent className="max-w-lg mx-auto">
                        <DialogHeader>
                            <DialogTitle>Create Resources</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to create a new resource.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                name="title"
                                placeholder="Title"
                                className="w-full"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            <Select
                                name="type"
                                value={formData.type}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="logo">Logo</SelectItem>
                                        <SelectItem value="carousel">Carousel</SelectItem>
                                        <SelectItem value="event-banner">Event-Banner</SelectItem>
                                        <SelectItem value="flyer">Flyer</SelectItem>
                                        <SelectItem value="poster">Poster</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FileUpload onFileUpload={handleFileUpload} folder="resources" />
                            {formData.url && (
                                <div className="mt-2 flex justify-center">
                                    <Image
                                        src={formData.url}
                                        alt="Uploaded Preview"
                                        className="rounded-md border"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                            )}
                            <Input
                                type="text"
                                name="description"
                                placeholder="Description (optional)"
                                className="w-full"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="tags"
                                placeholder="Tags (comma-separated, optional)"
                                className="w-full"
                                value={formData.tags.join(', ')}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tags: e.target.value.split(',').map((tag) => tag.trim()),
                                    }))
                                }
                            />
                            <Input
                                type="number"
                                name="priority"
                                placeholder="Priority (optional)"
                                className="w-full"
                                value={formData.priority}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="link"
                                placeholder="Link (optional)"
                                className="w-full"
                                value={formData.link}
                                onChange={handleInputChange}
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, active: e.target.checked }))
                                    }
                                />
                                <label htmlFor="active">Active</label>
                            </div>
                            <Button type="submit" className="w-full">
                                Submit
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default Page