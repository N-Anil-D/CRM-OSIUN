import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { User } from '@/types';

interface TicketItemInterface {
    className: string;
    user : User;
    text: string; // Düzeltme: String yerine string
    link: string; // Düzeltme: String yerine string
  }
  