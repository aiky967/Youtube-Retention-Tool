import toast from 'react-hot-toast';

export const toastError = (message: string) => {
    return toast.error(message);
};

export const toastSuccess = (message: string) => {
    return toast.success(message);
};

export const toastrSettings = {
    style: {
        borderRadius: '8px',
        background: '#222222',
        color: '#fff',
    },
};
