document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const openNewTab = document.getElementById('openNewTab').checked;
    
    formData.append('file', fileInput.files[0]);
    formData.append('openNewTab', openNewTab);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.text();
    document.getElementById('result').value = result;

    Prism.highlightAll();


});
