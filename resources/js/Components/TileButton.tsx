import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'

interface TileProps {
  className: string;
  text: string; // Düzeltme: String yerine string
  ikon: IconProp;
  link: string; // Düzeltme: String yerine string
}

const TileButton: React.FC<TileProps> = ({ className, text, ikon, link }) => {
  return (

    <div className={className}>
      <div className="flex-shrink-0 p-2 m-2 shadow-sm sm:rounded-lg place-content-stretch text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-900 hover:ring-purple-900 focus:outline-2 focus:ring-6 focus:ring-purple-900 focus:ring-opacity-20">
        <a href={link} className=''>
          <FontAwesomeIcon className='place-self-center' icon={ikon} size='4x' />
          <h4 className='text-xl text-align:center'>{text}</h4>
          <div className="text-button text-gray-800 dark:text-gray-200" >
            Continue... <FontAwesomeIcon icon={faArrowAltCircleRight} size='1x' />
          </div>
        </a>
      </div>
    </div>
  );
};

export default TileButton;
