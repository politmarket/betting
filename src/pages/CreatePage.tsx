// HomePage.tsx
import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBet } from '../contracts/Senders';

const CreatePage: React.FC = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState<string>('Who would win?');
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTitle(value);
    };

    const [source, setSource] = useState<string>('Source of true?');
    const handleSource = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSource(value);
    };


    const [optionA, setOptionA] = useState<string>('Option A?');
    const handleOptionA = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setOptionA(value);
    };

    const [optionB, setOptionB] = useState<string>('Option B?');
    const handleOptionB = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setOptionB(value);
    };

    const [image, setImage] = useState<string>('Image url?');
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setImage(value);
    };

    return (
        <div className='app'>
            <h1>Create page</h1>
            <button onClick={() => navigate('/')}>GO BACK</button>

            <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitle}
                title="Enter title"
            />

            <input
                type="text"
                id="source"
                name="source"
                value={source}
                onChange={handleSource}
                title="Enter source"
            />

            <input
                type="text"
                id="optionA"
                name="optionA"
                value={optionA}
                onChange={handleOptionA}
                title="Enter option A"
            />


            <input
                type="text"
                id="optionB"
                name="optionB"
                value={optionB}
                onChange={handleOptionB}
                title="Enter option B"
            />

            <input
                type="text"
                id="image"
                name="image"
                value={image}
                onChange={handleImage}
                title="Enter image url"
            />


            <button onClick={() => {
                createBet(title, source, optionA, optionB, image)
            }}>Submit</button>
        </div >
    );
}

export default CreatePage;