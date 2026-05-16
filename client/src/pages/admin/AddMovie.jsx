import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { fadeIn } from '../../animations/variants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ChevronLeft, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddMovie = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      duration: '',
      language: '',
      releaseDate: '',
      posterURL: '',
      bannerURL: '',
      cast: [{ name: '', role: '', image: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cast"
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await adminService.addMovie(data);
      toast.success('Movie added successfully!');
      navigate('/admin/movies');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to add movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link to="/admin/movies">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft size={24} />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Movie</h2>
          <p className="text-gray-500 text-sm">Fill in the details to list a new movie</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Save size={18} className="text-red-600" /> Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Movie Title" 
              placeholder="e.g. The Dark Knight"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
            />
            
            <Input 
              label="Genre" 
              placeholder="e.g. Action, Drama"
              {...register('genre', { required: 'Genre is required' })}
              error={errors.genre?.message}
            />

            <Input 
              label="Duration (minutes)" 
              type="number"
              placeholder="e.g. 150"
              {...register('duration', { required: 'Duration is required' })}
              error={errors.duration?.message}
            />

            <Input 
              label="Language" 
              placeholder="e.g. English, Hindi"
              {...register('language', { required: 'Language is required' })}
              error={errors.language?.message}
            />

            <Input 
              label="Release Date" 
              type="date"
              {...register('releaseDate', { required: 'Release date is required' })}
              error={errors.releaseDate?.message}
            />
            
            <Input 
              label="Rating (Optional)" 
              type="number"
              step="0.1"
              placeholder="e.g. 8.5"
              {...register('rating')}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              rows={4}
              className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white transition-all outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter movie synopsis..."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
            <ImageIcon size={18} className="text-red-600" /> Media & Visuals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Poster URL" 
              placeholder="https://..."
              {...register('posterURL', { required: 'Poster URL is required' })}
              error={errors.posterURL?.message}
            />
            <Input 
              label="Banner URL" 
              placeholder="https://..."
              {...register('bannerURL', { required: 'Banner URL is required' })}
              error={errors.bannerURL?.message}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Plus size={18} className="text-red-600" /> Cast & Crew
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ name: '', role: '', image: '' })}
              className="gap-1"
            >
              <Plus size={14} /> Add Cast
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl relative group">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input 
                    label="Name" 
                    placeholder="Actor Name"
                    {...register(`cast.${index}.name`, { required: 'Name is required' })}
                  />
                  <Input 
                    label="Role" 
                    placeholder="e.g. Lead"
                    {...register(`cast.${index}.role`)}
                  />
                  <Input 
                    label="Image URL" 
                    placeholder="https://..."
                    {...register(`cast.${index}.image`)}
                  />
                </div>
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="danger" 
                    className="mb-0.5 p-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-10">
          <Link to="/admin/movies">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isLoading} className="px-10">
            Create Movie
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddMovie;
