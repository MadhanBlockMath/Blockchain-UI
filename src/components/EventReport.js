import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [batchIdInput, setBatchIdInput] = useState('');
  const [glnInput, setGlnInput] = useState('');
  const [tableData, setTableData] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    fetchAuthToken();
  }, []);

  const fetchAuthToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setAuthToken(accessToken);
    } else {
      console.error('Access token not found in localStorage');
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken, fromDate, toDate]);

  const fetchData = () => {
    let url = `http://20.244.10.93:3003/getEventsByTimestampRange`;
    if (fromDate && toDate) {
      const fromTimestamp = new Date(fromDate).getTime();
      const toTimestamp = new Date(toDate).setHours(23, 59, 59, 999);
      url += `/${fromTimestamp}/${toTimestamp}`;
    }
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(response => {
        const data = response.data.events;
        const processedData = data.map(event => ({
          batch: event.batch,
          department: event.department,
          eventtype: event.eventtype,
          location: event.location,
          mongoid: event.mongoid,
          recordedTimestamp: event.recordedTimestamp,
          event: event.epcis
        }));
        setTableData(processedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleBatchIdInputChange = (e) => {
    setBatchIdInput(e.target.value);
  };

  const handleGlnInputChange = (e) => {
    setGlnInput(e.target.value);
  };

  const handleSearch = () => {
    let filteredData = [...tableData];
    if (batchIdInput) {
      filteredData = filteredData.filter(item => item.batch.includes(batchIdInput));
    }
    setTableData(filteredData);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setBatchIdInput('');
    setGlnInput('');
    fetchData();
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData.event);
  };

  const handleClosePopup = () => {
    setSelectedRowData(null);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <input type="date" value={fromDate} onChange={handleFromDateChange} className="border p-2 rounded" placeholder="Start Date"/>
        <input type="date" value={toDate} onChange={handleToDateChange} className="border p-2 rounded" placeholder="End Date"/>
        <input type="text" value={glnInput} onChange={handleGlnInputChange} placeholder="GLN" className="border p-2 rounded" />
        <input type="text" value={batchIdInput} onChange={handleBatchIdInputChange} placeholder="Batch ID" className="border p-2 rounded" />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">Search</button>
        <button onClick={handleReset} className="bg-gray-500 text-white p-2 rounded">Reset</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Batch</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">BizStep</th>
              <th className="border px-4 py-2">GLN</th>
              <th className="border px-4 py-2">Mongoid</th>
              <th className="border px-4 py-2">RecordedTimestamp</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-gray-100">
                <td className="border px-4 py-2">{item.batch}</td>
                <td className="border px-4 py-2">{item.department}</td>
                <td className="border px-4 py-2">{item.eventtype}</td>
                <td className="border px-4 py-2">{item.location}</td>
                <td className="border px-4 py-2">{item.mongoid}</td>
                <td className="border px-4 py-2">{new Date(item.recordedTimestamp).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white p-2 rounded">View as event</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRowData && (
        <Popup rowData={selectedRowData} onClose={handleClosePopup} />
      )}
    </div>
  );
};

const Popup = ({ rowData, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-gray-600">&times;</button>
        <div className="max-w-md mx-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify(rowData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default EventReport;
