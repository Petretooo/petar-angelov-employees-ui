import React, { useState } from 'react';
import "../../src/css/EmployeeMatcher.css"

function EmployeeMatcher() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMatches([]);
    setError(null);
  };

  const onUpload = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/v1/employee/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed. Please check the file and server.');
      }

      const data = await response.json();
      const resultList = Array.isArray(data) ? data : [data];
      setMatches(resultList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Employee Project Matcher</h2>

      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="fileInput"
        aria-label="Upload CSV file"
      />
      <button
        onClick={onUpload}
        disabled={loading}
        className="button"
        aria-busy={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <p className="errorMessage">Error: {error}</p>}

      {matches.length > 0 && (
        <table className="table" aria-label="Matches table">
          <thead>
            <tr>
              <th>Employee ID #1</th>
              <th>Employee ID #2</th>
              <th>Project ID</th>
              <th>Days Worked Together</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(({ firstEmployeeId, secondEmployeeId, projectId, workedDays }, idx) => (
              <tr key={idx}>
                <td>{firstEmployeeId}</td>
                <td>{secondEmployeeId}</td>
                <td>{projectId}</td>
                <td>{workedDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeMatcher;