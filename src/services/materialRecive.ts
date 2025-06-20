import api from './api';

export const getPersonByLoginId = async (loginId: string) => {
  const url =
    '/maximo/oslc/os/oslcwmsperson?lean=1&oslc.select=*&oslc.where=maxuser{loginid="' +
    loginId +
    '"}';
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ScanPo = async (id: string) => {
  const url =
    '/maximo/oslc/os/WMS_MXRECEIPT?savedQuery=PO:POREV&oslc.select=ponum,status,poid,orderdate,vendor,siteid,orgid,revisionnum,poline{itemnum,description,orderqty,orderunit,wmsissueunit,conversion,polinenum,conditioncode},wms_matrectrans{itemnum,description,receiptquantity,rejectqty,wmsmatrectransid,orderunit,polinenum,positeid,orgid}&oslc.where=siteid="BJPHO" and poline.linetype="ITEM" and ponum="' +
    id +
    '"&lean=1';
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
