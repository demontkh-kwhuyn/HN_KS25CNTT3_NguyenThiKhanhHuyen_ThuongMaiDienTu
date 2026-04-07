let products = JSON.parse(localStorage.getItem("products")) || [
    { id: "SP001", name: "Iphone 12 Pro", category: "Điện thoại", price: 12000000, quantity: 10, discount: "0%", status: true },
    { id: "SP002", name: "Samsung Galaxy X20", category: "Điện thoại", price: 21000000, quantity: 100, discount: "5%", status: false },
    { id: "SP003", name: "Phone 8 Plus", category: "Điện thoại", price: 5000000, quantity: 10, discount: "0%", status: true },
    { id: "SP004", name: "Iphone 14 Pro max", category: "Điện thoại", price: 25000000, quantity: 20, discount: "2%", status: false },
    { id: "SP005", name: "Oppo X3", category: "Điện thoại", price: 2000000, quantity: 10, discount: "5%", status: false },
    { id: "SP006", name: "IPhone 16", category: "Điện thoại", price: 20000000, quantity: 20, discount: "3%", status: false },
    { id: "SP007", name: "Iphone 7 plus", category: "Điện thoại", price: 4000000, quantity: 10, discount: "4%", status: true },
    { id: "SP008", name: "SamSung S20 Ultra", category: "Điện thoại", price: 30000000, quantity: 15, discount: "2%", status: false },
];

let isEditing = null; 


const saveToStorage = () => localStorage.setItem("products", JSON.stringify(products));

const notify = (icon, title) => {
    Swal.fire({
        icon: icon,
        title: title,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.parentElement.style.zIndex = '1000000';
        }
    });
};

function showError(input, errorId, message) {
    input.classList.add('invalid');
    const errorElement = document.getElementById(errorId);
    if (errorElement) errorElement.innerText = message;
}

function clearErrors() {
    const inputs = document.querySelectorAll('#productForm input, #productForm select');
    const errorMsgs = document.querySelectorAll('.error-msg');
    inputs.forEach(input => input.classList.remove('invalid'));
    errorMsgs.forEach(msg => msg.innerText = '');
}
const renderProducts = (data = products) => {
    const tableBody = document.getElementById("productTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td style="font-weight:600">${item.name}</td>
            <td>${(item.price || 0).toLocaleString()} đ</td>
            <td>${item.quantity || 0}</td>
            <td>${item.discount || '0%'}</td>
            <td>
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

const popup = document.getElementById('productPopup');
const productForm = document.getElementById('productForm');

const togglePopup = (show) => {
    popup.style.display = show ? 'flex' : 'none';
    clearErrors(); 
    if (!show) {
        isEditing = null;
        productForm.reset();
        document.getElementById('prodId').disabled = false;
        document.querySelector('.popupHeader h2').innerText = "Thêm mới sản phẩm";
        document.querySelector('.btn-submit').innerText = "Thêm";
    }
};

document.getElementById('openPopupBtn').onclick = () => togglePopup(true);
document.getElementById('closePopupBtn').onclick = () => togglePopup(false);
document.getElementById('cancelBtn').onclick = () => togglePopup(false);


window.editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    isEditing = id;
    togglePopup(true);

    document.querySelector('.popupHeader h2').innerText = "Cập nhật sản phẩm";
    document.querySelector('.btn-submit').innerText = "Cập nhật";

    document.getElementById('prodId').value = product.id;
    document.getElementById('prodId').disabled = true;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category || "Điện thoại";
    document.getElementById('prodQty').value = product.quantity;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodDiscount').value = parseInt(product.discount) || 0;
    document.getElementById('prodImg').value = product.image || "";
    document.getElementById('prodDesc').value = product.description || "";
    
    document.querySelector(`input[name="status"][value="${product.status}"]`).checked = true;
};


window.deleteProduct = (id) => {
    if (products.length <= 1) {
        notify('error', 'Hệ thống phải có ít nhất 1 sản phẩm.');
        return;
    }

    Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745', 
        cancelButtonColor: '#f45555',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(p => p.id !== id);
            saveToStorage();
            renderProducts();
            notify('success', 'Đã xóa thành công!');
        }
    });
};


productForm.onsubmit = (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;
    const prodIdInp = document.getElementById('prodId');
    const prodNameInp = document.getElementById('prodName');
    const prodPriceInp = document.getElementById('prodPrice');
    const prodQtyInp = document.getElementById('prodQty');
    const prodImgInp = document.getElementById('prodImg');

  
    if (!prodIdInp.value.trim()) {
        showError(prodIdInp, 'error-prodId', 'Mã sản phẩm không được để trống');
        isValid = false;
    } else if (!isEditing && products.some(p => p.id === prodIdInp.value.trim())) {
        showError(prodIdInp, 'error-prodId', 'Mã sản phẩm này đã tồn tại');
        isValid = false;
    }

    if (!prodNameInp.value.trim()) {
        showError(prodNameInp, 'error-prodName', 'Tên không được để trống');
        isValid = false;
    }

    if (!prodPriceInp.value || Number(prodPriceInp.value) <= 0) {
        showError(prodPriceInp, 'error-prodPrice', 'Giá phải lớn hơn 0');
        isValid = false;
    }
    if (prodQtyInp.value === "" || Number(prodQtyInp.value) < 0) {
        showError(prodQtyInp, 'error-prodQty', 'Số lượng không hợp lệ');
        isValid = false;
    }

    //  Ảnh
    // if (!prodImgInp.value.trim()) {
    //     showError(prodImgInp, 'error-prodImg', 'Vui lòng cung cấp link hình ảnh');
    //     isValid = false;
    // }

    if (!isValid) return;

    const productData = {
        id: prodIdInp.value.trim(),
        name: prodNameInp.value.trim(),
        category: document.getElementById('prodCategory').value,
        quantity: Number(prodQtyInp.value),
        price: Number(prodPriceInp.value),
        discount: (document.getElementById('prodDiscount').value || 0) + "%",
        image: prodImgInp.value.trim(),
        description: document.getElementById('prodDesc').value,
        status: document.querySelector('input[name="status"]:checked').value === "true"
    };

    if (isEditing) {
        const index = products.findIndex(p => p.id === isEditing);
        products[index] = productData;
        notify('success', 'Cập nhật thành công!');
    } else {
        products.push(productData);
        notify('success', 'Thêm mới thành công!');
    }

    saveToStorage();
    renderProducts();
    togglePopup(false);
};

const handleFilters = () => {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const statusVal = document.getElementById('filterStatus').value;
    const categoryVal = document.getElementById('filterCategory').value;

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchVal);
        const matchStatus = (statusVal === "Tất cả") || (p.status.toString() === statusVal);
        const matchCategory = (categoryVal === "Tất cả") || (p.category === categoryVal);
        return matchSearch && matchStatus && matchCategory;
    });
    renderProducts(filtered);
};

document.getElementById('searchInput').oninput = handleFilters;
document.getElementById('filterStatus').onchange = handleFilters;
document.getElementById('filterCategory').onchange = handleFilters;


window.onclick = (e) => { if (e.target === popup) togglePopup(false); };
renderProducts();
