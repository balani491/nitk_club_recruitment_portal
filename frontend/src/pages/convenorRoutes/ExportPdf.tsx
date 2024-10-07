import axios from "axios";

export default function ExportPdf() {
  const handleClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/convenor/exportPdf', {
        responseType: 'blob', // This ensures the response is treated as a binary data (Blob)
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create a link element to download the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.pdf'); // Set file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup after download
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Export PDF
      </button>
    </div>
  );
}
