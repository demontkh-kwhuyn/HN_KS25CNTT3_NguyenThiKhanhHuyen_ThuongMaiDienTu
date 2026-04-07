
let products = JSON.parse(localStorage.getItem("products")) || [
    { id: "DM001", name: "Quần áo", status: true,  createdAt: Date.now() - 10000 },
    { id: "DM002", name: "Kính mắt", status: false,  createdAt: Date.now() - 20000 },
    { id: "DM003", name: "Giày dép", status: true,  createdAt: Date.now() - 30000 },
    { id: "DM004", name: "Thời trang nam", status: false,  createdAt: Date.now() - 40000 },
    { id: "DM005", name: "Thời trang nữ", status: false,  createdAt: Date.now() - 50000 },
    { id: "DM006", name: "Hoa quả", status: false,  createdAt: Date.now() - 60000 },
    { id: "DM007", name: "Rau", status: true,  createdAt: Date.now() - 70000 },
    { id: "DM008", name: "Điện thoại", status: false , createdAt: Date.now() - 80000 },
];


const notify = (icon, title) => {
    Swal.fire({
        icon: icon,
        title: title,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });
};

const saveToStorage = (data) => localStorage.setItem("products", JSON.stringify(data));


const renderProducts = (dataRender = products) => {
    const tableBody = document.querySelector(".data-table tbody");
    if (!tableBody) return;
    
    tableBody.innerHTML = dataRender.map((item) => `
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

//Popup
const popup = document.getElementById('categoryPopup');
const categoryForm = document.getElementById('categoryForm');
const popupTitle = document.getElementById('popupTitle');
const catIdInput = document.getElementById('catId');
const catNameInput = document.getElementById('catName');
const editIndexInput = document.getElementById('editIndex');

const openPopup = () => popup.style.display = 'flex';

const closePopup = () => {
    popup.style.display = 'none';
    categoryForm.reset();
    catIdInput.disabled = false;
    editIndexInput.value = ""; 
};

window.closePopup = closePopup;

document.getElementById('openPopupBtn').onclick = () => {
    popupTitle.innerText = "Thêm mới danh mục";
    openPopup();
};

// Sửa, Xóa
window.editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    popupTitle.innerText = "Cập nhật danh mục";
    editIndexInput.value = id;
    catIdInput.value = product.id;
    catIdInput.disabled = true; 
    catNameInput.value = product.name;
    
    document.getElementById(product.status ? 'statusActive' : 'statusInactive').checked = true;
    openPopup();
};

window.deleteProduct = (id) => {
    if (products.length <= 1) {
        notify('error', 'Hệ thống phải có ít nhất 1 danh mục.');
        return;
    }

    Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(21, 241, 116)', 
        cancelButtonColor: '#f45555',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== id);
            saveToStorage(products);
            renderProducts();
            notify('success', 'Đã xóa thành công!');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            notify('info', 'Đã hủy thao tác');
        }
    });
};


categoryForm.onsubmit = (e) => {
    e.preventDefault();
    
    const id = catIdInput.value.trim();
    const name = catNameInput.value.trim();
    const status = document.querySelector('input[name="status"]:checked').value === "true";
    const editingId = editIndexInput.value;

    if (!name) {
        notify('warning', 'Vui lòng nhập tên danh mục');
        return;
    }

    if (editingId) {
        const index = products.findIndex(p => p.id === editingId);
        const isNameExist = products.some(p => p.id !== editingId && p.name.toLowerCase() === name.toLowerCase());
        
        if (isNameExist) {
            notify('error', `Tên "${name}" đã tồn tại!`);
            return;
        }

        if (index !== -1) {
            products[index].name = name;
            products[index].status = status;
            notify('success', 'Cập nhật thành công!');
        }
    } else {
        if (!id) {
            notify('warning', 'Vui lòng nhập ID!');
            return;
        }

        if (products.some(p => p.id === id)) {
            notify('error', `ID ${id} đã tồn tại!`);
            return;
        }

        if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            notify('error', `Tên "${name}" đã tồn tại!`);
            return;
        }
        
        products.push({ id, name, status, createdAt: Date.now() }); 
        notify('success', 'Thêm mới thành công!');
    }

    saveToStorage(products);
    renderProducts();
    closePopup();
};

// Tìm kiếm & Lọc
const initFilter = () => {
    const searchInput = document.querySelector(".search-box input");
    const sortSelect = document.querySelector(".sort-select"); 
    const statusSelect = document.querySelector(".filter-row select:not(.sort-select)");

    const handleFilterAndSort = () => {
        let searchValue = searchInput.value.toLowerCase();
        let statusValue = statusSelect.value;
        let sortValue = sortSelect.value;

        let filtered = products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchValue);
            const matchStatus = 
                statusValue === "Tất cả" || 
                (statusValue === "Đang hoạt động" && p.status === true) || 
                (statusValue === "Ngừng hoạt động" && p.status === false);
            return matchSearch && matchStatus;
        });

        const sortMaps = {
            "a-z": (a, b) => a.name.localeCompare(b.name),
            "z-a": (a, b) => b.name.localeCompare(a.name),
            "oldest": (a, b) => a.createdAt - b.createdAt,
            "newest": (a, b) => b.createdAt - a.createdAt
        };

        if (sortMaps[sortValue]) filtered.sort(sortMaps[sortValue]);
        renderProducts(filtered);
    };

    [searchInput, statusSelect, sortSelect].forEach(el => el.addEventListener("input", handleFilterAndSort));
};


window.onclick = (e) => { if (e.target === popup) closePopup(); };
renderProducts();
initFilter();
