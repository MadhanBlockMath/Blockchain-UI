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

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken, fromDate, toDate]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const januaryFirst = new Date(currentYear, 0, 1);
    setFromDate(januaryFirst.toISOString().substr(0, 10));

    const today = new Date().toISOString().substr(0, 10);
    setToDate(today);
  }, []);

  const fetchAuthToken = () => {
    setAuthToken(sessionStorage.getItem('token'));
  };

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
        const processedData = data.map(event => {
          const epcis = event.epcis.epcisBody.eventList[0];
          const batch = epcis['extention:batch'] ? epcis['extention:batch'][0] : '';
          const department = epcis['extention:gcp'] || '';
          const eventtype = epcis.bizStep || '';
          const location = epcis.bizLocation && epcis.bizLocation.id ? epcis.bizLocation.id.split('/')[4] : '';
          const mongoid = event.epcis._id.$oid || '';
          const recordedTimestamp = event.recordedTimestamp || '';
          return {
            batch,
            department,
            eventtype,
            location,
            mongoid,
            recordedTimestamp,
            event: event.epcis
          };
        });
        processedData.sort((a, b) => b.recordedTimestamp - a.recordedTimestamp); // Sort in descending order by recordedTimestamp
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
    if (glnInput) {
      filteredData = filteredData.filter(item => item.location.includes(glnInput));
    }
    setTableData(filteredData);
  };

  const handleReset = () => {
    const currentYear = new Date().getFullYear();
    const januaryFirst = new Date(currentYear, 0, 1);
    setFromDate(januaryFirst.toISOString().substr(0, 10));

    const today = new Date().toISOString().substr(0, 10);
    setToDate(today);

    setBatchIdInput('');
    setGlnInput('');
    fetchData();
  };

  const handleViewEventClick = (e, rowData) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedRowData(rowData.event);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const handleClosePopup = () => {
    setSelectedRowData(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="p-4 fs">
      <div className="flex space-x-4 mb-4">
        <input type="date" value={fromDate} onChange={handleFromDateChange} className="border p-2 rounded" placeholder="Start Date" />
        <input type="date" value={toDate} onChange={handleToDateChange} className="border p-2 rounded" placeholder="End Date" />
        <input type="text" value={glnInput} onChange={handleGlnInputChange} placeholder="GLN" className="border p-2 rounded" />
        <input type="text" value={batchIdInput} onChange={handleBatchIdInputChange} placeholder="Batch ID" className="border p-2 rounded" />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-1 rounded">Search</button>
        <button onClick={handleReset} className="bg-gray-500 text-white p-1 rounded">Reset</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Batch</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">BizStep</th>
              <th className="border px-4 py-2">GLN</th>
              <th className="border px-4 py-2">Object id</th>
              <th className="border px-4 py-2">RecordedTimestamp</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index} className="cursor-pointer hover:bg-gray-100">
                <td className="border px-3 py-2">{item.batch}</td>
                <td className="border px-3 py-2">{item.department}</td>
                <td className="border px-3 py-2">{item.eventtype}</td>
                <td className="border px-3 py-2">{item.location}</td>
                <td className="border px-3 py-2">{item.mongoid}</td>
                <td className="border px-3 py-2">{new Date(item.recordedTimestamp).toLocaleString()}</td>
                <td className="border eventBut py-2">
                  <button 
                    className="bg-blue-500 text-white p-1 rounded" 
                    onClick={(e) => handleViewEventClick(e, item)}
                  >
                    View Event
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRowData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md max-w-[65vw] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <pre className="bg-gray-100 p-2 rounded-md">{JSON.stringify(selectedRowData, null, 2)}</pre>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventReport;
