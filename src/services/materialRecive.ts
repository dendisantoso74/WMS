import {getData} from '../utils/store';
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
  const site = await getData('site');
  console.log('ScanPo id', id);
  console.log('get data async site ', site);

  const url = `/maximo/oslc/os/WMS_MXRECEIPT?savedQuery=PO:POREV&oslc.select=ponum,status,poid,orderdate,vendor,siteid,orgid,revisionnum,poline{itemnum,description,orderqty,orderunit,wmsissueunit,conversion,polinenum,conditioncode},wms_matrectrans{itemnum,description,receiptquantity,rejectqty,wmsmatrectransid,orderunit,polinenum,positeid,orgid}&oslc.where=siteid="${site}" and poline.linetype="ITEM" and ponum="${id}"&lean=1`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ListRejectCode = async () => {
  const url =
    '/maxrest/oslc/os/mxdomain/_V01TX0lOU1BSRUpFQ1RDT0RF/alndomainvalue?lean=1&oslc.select=value';
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ListPoWINSP = async (id: string) => {
  const site = await getData('site');

  const url = `/maximo/oslc/os/WMS_MXRECEIPT?lean=1&oslc.select=poid,ponum,vendor,orderdate,status,revisionnum,orgid,siteid,wms_matrectrans{issuetype,rowstamp,receiptquantity,itemnum,description,polinenum,packingslipnum,orderunit,issueunit,quantity,wms_matrectransid,conditioncode,status,rejectqty,acceptqty}&oslc.where=siteid=${site} and ponum=${id}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST
// export const ReceivePo = async (id: string) => {
//   const site = await getData('site');

//   const url = '/maximo/oslc/os/WMS_MXMATRECTRANS?lean=1';
//   try {
//     const response = await api.get(url);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const ReceivePo = async (payload: any[]) => {
  const url = '/maximo/oslc/os/WMS_MXMATRECTRANS?lean=1';
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'BULK',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignInspectPo = async (poid: string, assignedTo: string) => {
  const url = `/maximo/oslc/os/MXPO/${poid}`;
  const payload = {
    wms_inspectassignedstatus: 'ASSIGNED/OPEN',
    wms_inspectassignedto: assignedTo,
    status: 'APPR',
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const inspectPo = async (payload: any) => {
  const url = '/maximo/oslc/os/MXRECEIPT?lean=1';
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'SYNC',
        properties: '*',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listPoWtag = async (siteId: string, poNum: string) => {
  const url = `/maximo/oslc/os/WMS_MXWTAG?lean=1&oslc.select=poid,ponum,siteid,orgid,vendor,orderdate,wms_serializeditem&oslc.where=wms_tagsiteid="${siteId}" and receipts!="NONE" and wms_serializeditem.serialnumber!="*" and wms_serializeditem.tagcode!="*" and status="APPR" and ponum="%${poNum}%"`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const detailPoWtag = async (poNum: string) => {
  const url = `/maximo/oslc/os/WMS_MXWTAG?lean=1&oslc.select=*&oslc.where=ponum="${poNum}" and status="APPR"`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const taggingPo = async (
  itemId: string,
  serialNumber: string,
  tagCode: string,
) => {
  const url = `/maximo/oslc/os/WMS_MXSERIALIZEDITEM/${itemId}?lean=1`;
  const payload = {
    serialnumber: serialNumber,
    tagcode: tagCode,
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listRfid = async (siteId: string) => {
  const url = `/maximo/oslc/os/WMS_MXRFID?lean=1&oslc.select=*&oslc.where=siteid="${siteId}" and status="Blank"&oslc.pageSize=10`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkSerialNumber = async (
  siteId: string,
  serialNumber: string,
) => {
  const url = `/maxrest/oslc/script/WMS_CHECKSERIALNUMBER?siteid=${siteId}&serialnumber=${serialNumber}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listMyTransferInstruction = async (invOwner: string) => {
  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=*&oslc.where=status="ENTERED" and usetype="TRANSFER" and wms_status="Assigned" and wms_isgenerated=1 and invowner="${invOwner}"`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const detailTransferInstruction = async (
  siteId: string,
  poNum: string,
) => {
  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=*&oslc.where=siteid="${siteId}" and wms_ponum="${poNum}"`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignTransferInstruction = async (
  invuseId: string,
  invOwner: string,
) => {
  const url = `/maximo/oslc/os/MXINVUSE/${invuseId}?lean=1`;
  const payload = {
    invowner: invOwner,
    wms_status: 'Assigned',
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putAway = async (invuselineId: string, toBin: string) => {
  const url = `/maximo/oslc/os/MXINVUSELINE/${invuselineId}?_lean=1`;
  const payload = {
    tobin: toBin,
    wms_status: 'COMPLETE',
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeTi = async (invuseId: string) => {
  const url = `/maximo/oslc/os/mxinvuse/${invuseId}?action=CHANGESTATUS&lean=1&status=COMPLETE&memo=`;
  try {
    const response = await api.post(url, null, {
      headers: {
        'x-method-override': 'PATCH',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
