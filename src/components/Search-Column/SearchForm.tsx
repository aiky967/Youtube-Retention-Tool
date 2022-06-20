import { Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import useYoutubeApi from '../../hooks/useYoutubeApi';

interface SearchFormProps {}

const searchFormSchema = Yup.object().shape({
    videoIds: Yup.string().required('VideoIds are required'),
});

const SearchForm: React.FC<SearchFormProps> = ({}) => {
    const { getVideos } = useYoutubeApi();
    return (
        <Formik
            enableReinitialize
            initialValues={{ videoIds: '' }}
            validationSchema={searchFormSchema}
            onSubmit={async (values: any) => {
                const input = values.videoIds.replace(/\s+/g, '');
                await getVideos(input);
            }}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className='w-full'>
                    <div>
                        <div className='flex items-center justify-between'>
                            <label htmlFor='videoIds' className='ml-1 mb-1 block text-sm font-medium text-almostBlack'>
                                Video Ids
                            </label>
                            <span className='text-xs text-almostBlack'>separated by comma</span>
                        </div>
                        <Field
                            id='videoIds'
                            name='videoIds'
                            type='text'
                            className={`appearance-none block w-full px-3 py-2 border ${
                                errors.videoIds ? 'border-red-400' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                            placeholder='314OLE6mKOo, JgdP7oWP0_0'
                        />
                        {errors.videoIds && touched.videoIds && (
                            <div className='mt-0.5 ml-1'>
                                <span className='text-red-400 text-xs'>{errors.videoIds}</span>
                            </div>
                        )}
                    </div>
                    <button
                        type='submit'
                        className='mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-almostBlack hover:bg-black focus:outline-none sm:text-sm'
                        disabled={isSubmitting}
                    >
                        Search
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default SearchForm;
