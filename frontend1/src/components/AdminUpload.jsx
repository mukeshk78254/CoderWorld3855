
import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import axiosClient from '../utils/axiosClient'
import { Video, Loader2, Info, CheckCircle, AlertCircle, FileText } from 'lucide-react';

function AdminUpload(){
    const { problemid } = useParams();
    
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        clearErrors
    } = useForm();
    
    const selectedFile = watch('videoFile')?.[0];
    
    const onSubmit = async (data) => {
        const file = data.videoFile[0];
        
        setUploading(true);
        setUploadProgress(0);
        setError(null);
        setSuccessMessage(null);
        clearErrors();
    
        try {
          
            const signatureResponse = await axiosClient.get(`/video/create/${problemid}`);
            const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);
    
          
            const uploadResponse = await axios.post(upload_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });
    
            const cloudinaryResult = uploadResponse.data;
    
            
            const metadataResponse = await axiosClient.post('/video/save', {
                problemid: problemid,
                cloudinaryPublicId: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url,
                duration: cloudinaryResult.duration,
            });
    
            setUploadedVideo(metadataResponse.data.videoSolution);
            setSuccessMessage('Video uploaded and saved successfully!');
            reset(); 
            
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };
    
  
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
 
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 transform transition-all duration-300 hover:shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold mb-6 text-primary-content flex items-center">
                        <Video className="w-7 h-7 mr-3 text-accent" /> Upload Video Solution
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                       
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-base-content text-lg">Choose video file</span>
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                {...register('videoFile', {
                                    required: 'Please select a video file',
                                    validate: {
                                        isVideo: (files) => {
                                            if (!files || !files[0]) return 'Please select a video file';
                                            const file = files[0];
                                            return file.type.startsWith('video/') || 'Please select a valid video file (e.g., .mp4, .mov).';
                                        },
                                        fileSize: (files) => {
                                            if (!files || !files[0]) return true;
                                            const file = files[0];
                                            const maxSize = 100 * 1024 * 1024; // 100MB
                                            return file.size <= maxSize || 'File size must be less than 100MB.';
                                        }
                                    }
                                })}
                                className={`file-input file-input-bordered file-input-primary w-full transition-all duration-200 ${errors.videoFile ? 'file-input-error' : ''}`}
                                disabled={uploading}
                            />
                            {errors.videoFile && (
                                <label className="label">
                                    <span className="label-text-alt text-error text-sm mt-1">{errors.videoFile.message}</span>
                                </label>
                            )}
                        </div>
            
                      
                        {selectedFile && (
                            <div role="alert" className="alert alert-info shadow-md animate-fade-in-down">
                                <Info className="w-5 h-5" />
                                <div>
                                    <h3 className="font-bold text-base-content">Selected File:</h3>
                                    <p className="text-sm text-base-content/80 flex items-center">
                                        <FileText className="w-4 h-4 mr-2" /> {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-base-content/80">Size: {formatFileSize(selectedFile.size)}</p>
                                </div>
                            </div>
                        )}
            
                       
                        {uploading && (
                            <div className="space-y-2 animate-pulse">
                                <div className="flex justify-between text-sm text-base-content">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <progress 
                                    className="progress progress-primary w-full" 
                                    value={uploadProgress} 
                                    max="100"
                                ></progress>
                            </div>
                        )}
            
                   
                        {error && (
                            <div role="alert" className="alert alert-error shadow-md animate-fade-in-down">
                                <AlertCircle className="w-6 h-6" />
                                <span>{error}</span>
                                <button onClick={() => setError(null)} className="btn btn-sm btn-ghost">Dismiss</button>
                            </div>
                        )}
            
                     
                        {successMessage && (
                            <div role="alert" className="alert alert-success shadow-md animate-fade-in-down">
                                <CheckCircle className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">Upload Successful!</h3>
                                    <p className="text-sm text-base-content/80">Duration: {formatDuration(uploadedVideo.duration)}</p>
                                    <p className="text-sm text-base-content/80">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSuccessMessage(null)} className="btn btn-sm btn-ghost">Dismiss</button>
                            </div>
                        )}
            
                     
                        <div className="card-actions justify-end mt-8">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`btn btn-primary btn-lg w-full transition-all duration-200 hover:scale-[1.02] ${uploading ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-5 h-5 mr-2" /> Upload Video
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminUpload;