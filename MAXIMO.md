# Maximo WMS Mobile App API Guide

## 1. Introduction

Welcome, Frontend Developer! This document is your guide to interacting with the Maximo Warehouse Management System (WMS) API from a mobile application. It outlines the key endpoints, authentication methods, and data formats required to successfully read (GET) and write (POST) data to Maximo.

The API is based on the **OSLC (Open Services for Lifecycle Collaboration)** framework. While you don't need to be an OSLC expert, understanding a few core concepts will make development much smoother.

The primary workflows covered are:

- **Receiving**: Handling incoming materials against Purchase Orders (POs).
- **Issuing**: Picking and issuing materials for Work Orders (WOs).
- **Returning**: Processing materials returned to the storeroom.

---

## 2. Core Concepts

### 2.1. Authentication

Every request to the Maximo API must be authenticated. The API uses **Basic Authentication**.

You must include an `Authorization` header with every request.

- **Header Key**: `Authorization`
- **Header Value**: `Basic {credentials}`

Where `{credentials}` is the Base64-encoded string of `username:password`.

**Example:**

1.  Username: `maximo_user`
2.  Password: `maximo_password`
3.  Combine them: `maximo_user:maximo_password`
4.  Base64 Encode it: `bWF4aW1vX3VzZXI6bWF4aW1vX3Bhc3N3b3Jk`
5.  Final Header:
    `   Authorization: Basic bWF4aW1vX3VzZXI6bWF4aW1vX3Bhc3N3b3Jk`
    _(Note: The collection sometimes uses a custom `maxauth` header. `Authorization` is the standard and preferred method, but be aware `maxauth` might be required by some environments.)_

### 2.2. Base URL

The API endpoints in this guide use a placeholder for the host and port. You should store this as a configurable variable in your application.

- **Placeholder**: `http://{MAXIMO_HOST}:{PORT}`
- **Example**: `http://192.168.200.9:9080`

### 2.3. Essential Query Parameters

You will see these parameters on almost every request. **Always include them.**

- `lean=1`: This is critical! It tells Maximo to return a simplified, clean JSON response without extra metadata, which is perfect for mobile apps.

### 2.4. Fetching Data (GET Requests)

You can control the data you receive using `oslc.select` and `oslc.where`.

- `oslc.select={fields}`: Specifies which fields to return, similar to SQL `SELECT`.

  - `oslc.select=*`: Get all available fields.
  - `oslc.select=ponum,status,vendor`: Get only the PO number, status, and vendor.
  - For related data: `oslc.select=ponum,poline{itemnum,orderqty}`

- `oslc.where={query}`: Filters the results, similar to SQL `WHERE`.
  - `oslc.where=siteid="TJB56"`: Get records for site "TJB56".
  - `oslc.where=ponum="BJS-PO-1234"`: Get a specific PO.
  - Combine with `and`: `oslc.where=siteid="TJB56" and status="APPR"`

### 2.5. Pushing Data (POST Requests)

Creating or updating data is done via `POST`, but you must specify the intended operation in the headers using `x-method-override`.

- **To Update a Record**: Use `PATCH`. This updates only the fields you send in the body.

  - `x-method-override`: `PATCH`
  - `patchtype`: `MERGE`

- **To Create Multiple Records**: Use `BULK`. The body should be a JSON array of objects.

  - `x-method-override`: `BULK`

- **To Change a Record's Status**: Use a special `action` in the URL.
  - Example: `.../os/mxinvuse/9667?action=CHANGESTATUS&status=COMPLETE`

---

## 3. API Endpoints by Workflow

### Workflow: RECEIVING

#### 3.1. Get Purchase Order Details

Use this when the user scans or enters a PO number to begin the receiving process.

- **Method**: `GET`
- **Endpoint**: `/maximo/oslc/os/WMS_MXRECEIPT`
- **Query Parameters**:
  - `lean=1`
  - `oslc.select=ponum,status,vendor,poline{itemnum,description,orderqty,orderunit}`
  - `oslc.where=siteid="{YOUR_SITE_ID}" and ponum="{PO_NUMBER}"`
- **Use Case**: Fetch the details of a PO to show the user what items and quantities to expect.

#### 3.2. Receive Items Against a PO

Use this to submit the quantities of items that have been physically received.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/WMS_MXMATRECTRANS`
- **Headers**:
  - `x-method-override`: `BULK`
- **Body**: An array of received items.
  ```json
  [
    {
      "ponum": "PO-BJS-22-1038-EMT",
      "polinenum": 1,
      "porevisionnum": 0,
      "siteid": "TJB56",
      "orgid": "BJS",
      "receiptquantity": 5.0,
      "orderunit": "ROLL",
      "inspected": 0
    }
  ]
  ```
- **Use Case**: The user enters the quantity for each PO line item and submits. This creates a material receipt transaction in Maximo.

#### 3.3. Tag a Received Item

After receiving, some items need to be tagged with an RFID or serial number.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/WMS_MXSERIALIZEDITEM/{ITEM_ID}`
- **Headers**:
  - `x-method-override`: `PATCH`
  - `patchtype`: `MERGE`
- **Body**:
  ```json
  {
    "serialnumber": "USER_SCANNED_SERIAL_NUMBER",
    "tagcode": "USER_SCANNED_RFID_TAG"
  }
  ```
- **Use Case**: After an item is received, the user scans a serial number and/or an RFID tag to associate it with the item record in Maximo. The `{ITEM_ID}` is retrieved from the PO details.

#### 3.4. Put Away (Transfer Instruction)

Move a received item from the receiving bay to its final storage bin.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/MXINVUSELINE/{INVUSELINE_ID}`
- **Headers**:
  - `x-method-override`: `PATCH`
  - `patchtype`: `MERGE`
- **Body**:
  ```json
  {
    "tobin": "USER_SCANNED_BIN_LOCATION",
    "wms_status": "COMPLETE"
  }
  ```
- **Use Case**: The user scans the item and then scans the destination bin location. This API call updates the item's location and completes the put-away process.

---

### Workflow: ISSUE

#### 3.5. Get Work Order Details

Use this when a user scans a Work Order to begin picking materials.

- **Method**: `GET`
- **Endpoint**: `/maximo/oslc/os/WMS_MXWOISSUE`
- **Query Parameters**:
  - `lean=1`
  - `oslc.select=*` (or select specific fields like `wonum,description,wms_materialplan{itemnum,description,quantity,storeloc}`)
  - `oslc.where=siteid="{YOUR_SITE_ID}" and wonum="{WO_NUMBER}"`
- **Use Case**: Fetch the list of required materials for a specific Work Order.

#### 3.6. Pick an Item

Use this to record that an item has been picked from a bin for a Work Order. This is a complex transaction that adds a line to an `INVUSE` record.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/MXINVUSE/{INVUSE_ID}`
- **Headers**:
  - `x-method-override`: `PATCH`
  - `patchtype`: `MERGE`
- **Body**: An array named `invuseline` containing the item details.
  ```json
  {
    "invuseline": [
      {
        "frombin": "USER_SCANNED_BIN",
        "fromstoreloc": "INDOOR",
        "itemnum": "ITEM_TO_PICK",
        "quantity": 1.0,
        "refwo": "BJS-7010",
        "usetype": "ISSUE"
      }
    ]
  }
  ```
- **Use Case**: The user scans the item/bin and confirms the quantity. This adds the item to the "picking list" for the WO. The `INVUSE_ID` is typically generated by a script when the process starts.

#### 3.7. Complete an Issue

After all items are picked and staged, this completes the process.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/mxinvuse/{INVUSE_ID}?action=CHANGESTATUS&status=COMPLETE`
- **Body**: Empty
- **Use Case**: The user confirms that all picked items have been handed over. This changes the status of the inventory usage record to COMPLETE.

---

### Workflow: RETURN

#### 3.8. Get Work Order Details for Return

Fetches details of items that were previously issued to a Work Order and can be returned.

- **Method**: `GET`
- **Endpoint**: `/maximo/oslc/os/WMS_MXRETURN`
- **Query Parameters**:
  - `lean=1`
  - `oslc.select=*`
  - `oslc.where=siteid="{YOUR_SITE_ID}" and wonum="{WO_NUMBER}"`
- **Use Case**: The user scans a WO to see a list of materials they can return to the storeroom.

#### 3.9. Receive a Returned Item

Records the return of a specific item to the storeroom.

- **Method**: `POST`
- **Endpoint**: `/maximo/oslc/os/MXINVUSE/{INVUSE_ID}`
- **Headers**:
  - `x-method-override`: `PATCH`
  - `patchtype`: `MERGE`
- **Body**: An `invuseline` array specifying the item being returned.
  ```json
  {
    "invuseline": [
      {
        "itemnum": "ITEM_BEING_RETURNED",
        "quantity": 1.0,
        "refwo": "BJS-7012",
        "usetype": "RETURN",
        "wms_usetype": "RETURN_TO_STOREROOM"
      }
    ]
  }
  ```
- **Use Case**: The user selects an item from the issue list and confirms the quantity being returned.

---
