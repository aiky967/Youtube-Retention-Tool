import React from 'react';

interface TextHeaderProps {
    title: string;
}

const TextHeader: React.FC<TextHeaderProps> = ({ title }) => {
    return (
        <div className='py-3'>
            <h1 className='text-3xl font-extrabold text-almostBlack'>{title}</h1>
        </div>
    );
};

export default TextHeader;
