import {Dimensions, Platform} from 'react-native';
import {HistoryTypes} from './types';
import {TeamData} from './data';
import NetInfo from '@react-native-community/netinfo';
import {checkSerialNumber} from '../services/materialRecive';

const {width, height} = Dimensions.get('window');

export const isTablet = () => {
  const aspectRatio = height / width;
  return (
    (Platform.OS === 'ios' && (width >= 768 || height >= 768)) ||
    (Platform.OS === 'android' &&
      aspectRatio <= 1.6 &&
      Math.max(width, height) >= 900)
  ); //before 900
};

export const isMobile = () => {
  return !isTablet();
};

// Add orientation status function
export const getOrientationStatus = (): 'portrait' | 'landscape' => {
  const {width, height} = Dimensions.get('window');
  return height >= width ? 'portrait' : 'landscape';
};

export const getStatusAndColor = (value: number, min: number, max: number) => {
  if (value < min) {
    return {status: 'upnormal', color: 'orange'};
  } else if (value > max) {
    return {status: 'overload', color: 'red'};
  } else {
    return {status: 'normal', color: 'green'};
  }
};

export const getCurrentShift = (
  date: Date = new Date(),
): 'Morning' | 'Afternoon' | 'Night' => {
  const hours = date.getHours();

  if (hours >= 7 && hours < 15) {
    //15 is for testing only the default 15 - !!!need change soon
    return 'Morning';
  } else if (hours >= 15 && hours < 23) {
    return 'Afternoon';
  } else {
    return 'Night';
  }
};

// get shif with input date string
export const getShift = (
  dateString: string,
): 'Morning' | 'Afternoon' | 'Night' => {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Get the hours from the Date object
  const hours = date.getHours();

  // Determine the shift based on the hours
  if (hours >= 7 && hours < 15) {
    return 'Morning';
  } else if (hours >= 15 && hours < 23) {
    return 'Afternoon';
  } else {
    return 'Night';
  }
};

export const getTimeShift = (): string => {
  const now = new Date();

  // If the current time is between 00:00 and 07:00, subtract 1 day
  if (now.getHours() >= 0 && now.getHours() < 7) {
    now.setDate(now.getDate() - 1);
  }

  // Format the date as YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // Return formatted date
};

export const formatString = (str: string) => {
  return str
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, '') // Remove non-word characters except spaces
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};

export const isExpired = (unixTimestamp: number) => {
  // Get the current time in seconds (Unix time)
  const currentTime = Math.floor(Date.now() / 1000);

  // Compare the current time with the given Unix timestamp
  return currentTime > unixTimestamp;
};

export const isSameDate = (dateString: string) => {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Compare year, month, and day
  return (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getDate() === currentDate.getDate()
  );
};
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// to check in history all have pid or not if not, user cant submit and need to upload first
export const hasAllPids = (history: HistoryTypes[]): boolean => {
  return history.every(item => item.pid !== undefined && item.pid !== null);
};

// to check in history have status 2
export const hasAllUploaded = (history: HistoryTypes[]): boolean => {
  return history.every(item => item.status === 2);
};

// to check in history have status 1 or 3
export const cantSubmit = data => {
  return data.some(entry => entry.status === 3 || entry.status === 1);
};
// get team label from id or value
export const getTeamLabelById = (id: string): string | undefined => {
  const team = TeamData.find(item => item.value === id);
  return team ? team.label : undefined;
};

export const checkWifiConnection = async () => {
  const state = await NetInfo.fetch();
  return state.type === 'wifi' && state.isConnected;
};

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hour}:${min}`;
}

export const getReceiptQuantityByPoline = (
  wmsMatrectrans: any[] | undefined,
  polinenum: number,
): number => {
  // Validate wmsMatrectrans is an array and not empty
  if (!Array.isArray(wmsMatrectrans) || wmsMatrectrans.length === 0) {
    return 0;
  }
  // Sum receiptquantity for all entries with the same polinenum
  return wmsMatrectrans
    .filter(trans => trans.polinenum === polinenum)
    .reduce((sum, trans) => sum + (trans.receiptquantity ?? 0), 0);
};

export const getQuantityByPolineInspect = (
  wmsMatrectrans: any[],
  polinenum: number,
): number => {
  // Get acceptqty from the first entry with the same polinenum
  const match = wmsMatrectrans?.find(trans => trans.polinenum === polinenum);
  return match?.quantity ?? 0;
};

export const getAcceptQuantityByPoline = (
  wmsMatrectrans: any[],
  polinenum: number,
): number => {
  // Get acceptqty from the first entry with the same polinenum
  const match = wmsMatrectrans?.find(trans => trans.polinenum === polinenum);
  return match?.acceptqty ?? 0;
};

export const getRejectQuantityByPoline = (
  wmsMatrectrans: any[],
  polinenum: number,
): number => {
  // Get rejectqty from the first entry with the same polinenum
  const match = wmsMatrectrans?.find(trans => trans.polinenum === polinenum);
  return match?.rejectqty ?? 0;
};

export function generateSerialNumber(): string {
  const chars = '0123456789ABCDEF';
  let serial = '';
  for (let i = 0; i < 24; i++) {
    serial += chars[Math.floor(Math.random() * chars.length)];
  }
  return serial;
}
