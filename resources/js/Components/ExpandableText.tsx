import React, { useState } from 'react';

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => setIsExpanded(!isExpanded);

    if(text === undefined || text === '' || text === 'nomess') return null;

    if (text != '' && text.length <= maxLength) {
        return <p>{text}</p>;
    }

    return (
        <div>
            <p>
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
                <button onClick={toggleExpansion} style={{ marginLeft: '8px', color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}>
                    {isExpanded ? 'Verberg' : 'Lees meer'}
                </button>
            </p>
        </div>
    );
};

export default ExpandableText;
