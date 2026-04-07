let products = JSON.parse(localStorage.getItem("products")) || [
    { id: "DM001", name: "Quần áo", status: true, createdAt: Date.now() - 10000 },
    { id: "DM002", name: "Kính mắt", status: false, createdAt: Date.now() - 20000 },
    { id: "DM003", name: "Giày dép", status: true, createdAt: Date.now() - 30000 },
    { id: "DM004", name: "Thời trang nam", status: false, createdAt: Date.now() - 40000 },
    { id: "DM005", name: "Thời trang nữ", status: false, createdAt: Date.now() - 50000 },
    { id: "DM006", name: "Hoa quả", status: false, createdAt: Date.now() - 60000 },
    { id: "DM007", name: "Rau", status: true, createdAt: Date.now() - 70000 },
    { id: "DM008", name: "Điện thoại", status: false, createdAt: Date.now() - 80000 },
];

const elements = {
    tableBody: document.querySelector(".data-table tbody"),
    popup: document.getElementById('categoryPopup'),
    form: document.getElementById('categoryForm'),
    popupTitle: document.getElementById('popupTitle'),
    catId: document.getElementById('catId'),
    catName: document.getElementById('catName'),
    editIdHidden: document.getElementById('editIndex'),
    searchInput: document.querySelector(".search-box input"),
    sortSelect: document.querySelector(".sort-select"),
    statusSelect: document.querySelector(".filter-row select:not(.sort-select)"),
    openPopupBtn: document.getElementById('openPopupBtn')
};

const notify = (icon, title) => {
    Swal.fire({
        icon, title, toast: true, position: 'top-end',
        showConfirmButton: false, timer: 2500, timerProgressBar: true
    });
};

const saveToStorage = () => localStorage.setItem("products", JSON.stringify(products));

const renderProducts = (data = products) => {
    if (!elements.tableBody) return;
    elements.tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td class="text-right">
                <span class="status ${item.status ? 'active' : 'inactive'}">
                    ${item.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </span>
            </td>
            <td class="text-right">
                <div class="actions">
                    <img src="./delete-icon.png" alt="Xóa" onclick="deleteProduct('${item.id}')" style="cursor:pointer; width:20px">
                    <img src="./edit-icon.png" alt="Sửa" onclick="editProduct('${item.id}')" style="cursor:pointer; width:20px; margin-left:10px">
                </div>
            </td>
        </tr>
    `).join("");
};

const handleFilterSort = () => {
    const searchVal = elements.searchInput.value.toLowerCase().trim();
    const statusVal = elements.statusSelect.value;
    const sortVal = elements.sortSelect.value;

    let filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchVal);
        const matchStatus = statusVal === "Tất cả" || 
            (statusVal === "Đang hoạt động" && p.status) || 
            (statusVal === "Ngừng hoạt động" && !p.status);
        return matchSearch && matchStatus;
    });

    const sorters = {
        "a-z": (a, b) => a.name.localeCompare(b.name),
        "z-a": (a, b) => b.name.localeCompare(a.name),
        "oldest": (a, b) => a.createdAt - b.createdAt,
        "newest": (a, b) => b.createdAt - a.createdAt
    };

    if (sorters[sortVal]) filtered.sort(sorters[sortVal]);
    renderProducts(filtered);
};

const clearSearch = () => {
    elements.searchInput.value = "";
    elements.statusSelect.value = "Tất cả";
    elements.sortSelect.value = "newest";
    handleFilterSort();
};

const togglePopup = (show = true) => {
    elements.popup.style.display = show ? 'flex' : 'none';
    if (!show) {
        elements.form.reset();
        elements.catId.disabled = false;
        elements.editIdHidden.value = "";
    }
};

window.editProduct = (id) => {
    const p = products.find(item => item.id === id);
    if (!p) return;
    elements.popupTitle.innerText = "Cập nhật danh mục";
    elements.editIdHidden.value = id;
    elements.catId.value = p.id;
    elements.catId.disabled = true;
    elements.catName.value = p.name;
    document.getElementById(p.status ? 'statusActive' : 'statusInactive').checked = true;
    togglePopup(true);
};

window.deleteProduct = (id) => {
    if (products.length <= 1) return notify('error', 'Phải có ít nhất 1 danh mục.');
    Swal.fire({
        title: 'Xác nhận xóa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#15f174',
        cancelButtonColor: '#f45555',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== id);
            saveToStorage();
            handleFilterSort();
            notify('success', 'Đã xóa thành công!');
        }
    });
};

elements.form.onsubmit = (e) => {
    e.preventDefault();
    const id = elements.catId.value.trim();
    const name = elements.catName.value.trim();
    const status = document.querySelector('input[name="status"]:checked').value === "true";
    const editId = elements.editIdHidden.value;

    if (!name) return notify('warning', 'Vui lòng nhập tên danh mục');
    if (products.some(p => p.id !== editId && p.name.toLowerCase() === name.toLowerCase())) {
        return notify('error', `Tên "${name}" đã tồn tại!`);
    }

    if (editId) {
        const idx = products.findIndex(p => p.id === editId);
        products[idx] = { ...products[idx], name, status };
        notify('success', 'Cập nhật thành công!');
    } else {
        if (!id) return notify('warning', 'Vui lòng nhập ID!');
        if (products.some(p => p.id === id)) return notify('error', `ID ${id} đã tồn tại!`);
        products.push({ id, name, status, createdAt: Date.now() });
        notify('success', 'Thêm mới thành công!');
    }

    saveToStorage();
    clearSearch();
    togglePopup(false);
};

const init = () => {
    elements.openPopupBtn.onclick = () => {
        elements.popupTitle.innerText = "Thêm mới danh mục";
        togglePopup(true);
    };

    [elements.searchInput, elements.statusSelect, elements.sortSelect].forEach(el => {
        el.addEventListener("input", handleFilterSort);
    });

    window.onclick = (e) => { if (e.target === elements.popup) togglePopup(false); };
    window.closePopup = () => togglePopup(false);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") elements.popup.style.display === 'flex' ? togglePopup(false) : clearSearch();
    });

    renderProducts();
};

init();
