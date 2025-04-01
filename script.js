document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');
    const uploadedFilesList = document.getElementById('uploaded-files');
    
    // Add event listeners for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Handle files from input
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            fileList.classList.add('active');
            uploadedFilesList.innerHTML = '';
            
            Array.from(files).forEach(file => {
                const li = document.createElement('li');
                const relativePath = file.webkitRelativePath || file.name;
                li.textContent = relativePath;
                uploadedFilesList.appendChild(li);
                
                // In a real application, you would handle file upload to server here
                console.log('File ready for processing:', file.name, file.type, file.size);
            });
        }
    }
    
    // Make the label work as a button for the hidden input
    const fileInputLabel = document.querySelector('.file-input-label');
    fileInputLabel.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Display message when files are being processed
    console.log('Workspace ready for file uploads');
});
