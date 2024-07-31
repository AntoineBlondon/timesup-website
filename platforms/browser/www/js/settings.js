function edit_settings() {
    settings_screen();
    document.getElementById('edit-gametime').value = localStorage.getItem('max_time');

    document.getElementById('edit-gametime-set').onclick = () => {
        localStorage.setItem('max_time', document.getElementById('edit-gametime').value);
        edit_settings();
    }
}