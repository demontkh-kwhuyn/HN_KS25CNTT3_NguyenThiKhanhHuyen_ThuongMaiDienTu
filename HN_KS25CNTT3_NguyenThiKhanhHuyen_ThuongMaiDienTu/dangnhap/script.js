function showError(input, errorId, message) {
    input.classList.add('invalid');
    const errorElement = document.getElementById(errorId);
    if (errorElement) errorElement.innerText = message;
}

function clearErrors(form) {
    const inputs = form.querySelectorAll('input');
    const errorMsgs = form.querySelectorAll('.error-msg');
    inputs.forEach(input => input.classList.remove('invalid'));
    errorMsgs.forEach(msg => msg.innerText = '');
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const emailInput = document.getElementById('userName');
    const passInput = document.getElementById('password');
    const emailValue = emailInput.value.trim();
    const passValue = passInput.value.trim();
    
    clearErrors(this);

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
        showError(emailInput, 'error-userName', 'Email không được để trống');
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError(emailInput, 'error-userName', 'Email không đúng định dạng');
        isValid = false;
    }

    if (!passValue) {
        showError(passInput, 'error-password', 'Mật khẩu không được để trống');
        isValid = false;
    }

    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userFound = users.find(user => user.email === emailValue);

    if (userFound) {
        if (userFound.password === passValue) {    
        Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng nhập thành công !",
        showConfirmButton: false,
        timer: 1500
            }).then(() => {
                window.location.href = "../danhmuc/";
            });
        } else {
            showError(passInput, 'error-password', 'Mật khẩu không chính xác');
        }
    } else {
        showError(emailInput, 'error-userName', 'Tài khoản email này không tồn tại');
    }
});

        