import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingModule from './LoadingModule';

const BatchReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [batchIdInput, setBatchIdInput] = useState('');
  const [glnInput, setGlnInput] = useState('');
  const [tableData, setTableData] = useState([]);
  const [fullTableData, setFullTableData] = useState([]);
  const [authToken, setAuthToken] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [pageSize, setPageSize] = useState(10000);
  const [currentPage, setCurrentPage] = useState(1);
  const displayPageSize = 1000;
  const [totalData, setTotalData] = useState(0);
  const [selectedRange, setSelectedRange] = useState('');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setAuthToken(token);
    const user = sessionStorage.getItem('user');

    if (!user) {
      setShowTimeoutModal(true);
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000); // Delay to show the modal for 2 seconds before redirecting
      return;
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken, fromDate, toDate, pageSize]);

  const fetchData = () => {
    let url = `http://20.244.10.93:3003/getBatchDetailsByTimestampRange`;
    if (fromDate && toDate) {
      const fromTimestamp = new Date(fromDate).getTime();
      const toTimestamp = new Date(toDate).setHours(23, 59, 59, 999);
      url += `/${fromTimestamp}/${toTimestamp}/${pageSize}`;
    } else {
      const fromTimestamp = new Date().setFullYear(1970); // Setting a default start timestamp
      const toTimestamp = new Date().getTime(); // Current timestamp
      url += `/${fromTimestamp}/${toTimestamp}/${pageSize}`;
    }
  
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(response => {
      let data = response.data.details;
      data = data.sort((a, b) => b.recordedTimestamp - a.recordedTimestamp); // Sort in descending order by recordedTimestamp
      const processedData = data.map(event => ({
        batch: event.batch || '',
        department: event.department || '',
        create_date: event.create_date || '',
        gln: event.gln || '',
        recordedTimestamp: event.recordedTimestamp || '',
        event: event
      }));
      setTableData(processedData);
      setFullTableData(processedData);
      setTotalData(processedData.length);
      setCurrentPage(1);
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

  const handleGlnInputChange = (e) => {
    setGlnInput(e.target.value);
  };

  const handleBatchIdInputChange = (e) => {
    setBatchIdInput(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  const handleSearch = () => {
    let filteredData = [...fullTableData];
    if (batchIdInput) {
      filteredData = filteredData.filter(item => item.batch.includes(batchIdInput));
    }
    if (glnInput) {
      filteredData = filteredData.filter(item => item.gln.includes(glnInput));
    }
    setTableData(filteredData);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setBatchIdInput('');
    setGlnInput('');
    setPageSize(1000);
    setTableData(fullTableData);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
    const [start, end] = e.target.value.split('-').map(Number);
    const filteredData = fullTableData.slice(start, end);
    setTableData(filteredData);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * displayPageSize;
  const endIndex = startIndex + displayPageSize;
  const currentData = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / displayPageSize);

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const getRanges = () => {
    const ranges = [];
    for (let i = 0; i < totalData; i += 500) {
      ranges.push(`${i}-${Math.min(i + 500, totalData)}`);
    }
    return ranges;
  };

  return (
    <div className="p-4 fs">
       {showTimeoutModal && <LoadingModule message="Session Timed Out. Redirecting to Login Page..." />}
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          className="border p-2 rounded"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          className="border p-2 rounded"
          placeholder="End Date"
        />
        <input
          type="text"
          value={glnInput}
          onChange={handleGlnInputChange}
          placeholder="GLN"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={batchIdInput}
          onChange={handleBatchIdInputChange}
          placeholder="Batch ID"
          className="border p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white p-1 rounded">
          Search
        </button>
        <button onClick={handleReset} className="bg-gray-500 text-white p-1 rounded">
          Reset
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <select
          onChange={handleRangeChange}
          value={selectedRange}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
        >
          <option value="">Select Range</option>
          {getRanges().map((range, index) => (
            <option key={index} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">S.no</th>
              <th className="border px-4 py-2">Batch</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">CreateDate</th>
              <th className="border px-4 py-2">GLN</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="cursor-pointer hover:bg-gray-100">
                <td className="border px-3 py-2">{startIndex + index + 1}</td>
                <td className="border px-3 py-2">{item.batch}</td>
                <td className="border px-3 py-2">{item.department}</td>
                <td className="border px-3 py-2">{new Date(item.recordedTimestamp).toLocaleString()}</td>
                <td className="border px-3 py-2">{item.gln}</td>
                <td className="border eventBut py-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => setSelectedRowData(item)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md mr-1"
        >
          Previous
        </button>
        {getPaginationRange().map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md ml-1"
        >
          Next
        </button>
      </div>

      {selectedRowData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Batch Details</h2>
            <pre className="bg-gray-100 p-2 rounded-md">{JSON.stringify(selectedRowData.event, null, 2)}</pre>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => setSelectedRowData(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchReport;
    