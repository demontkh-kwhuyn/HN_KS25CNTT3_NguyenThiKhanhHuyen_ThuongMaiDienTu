const form = document.getElementById('signupForm');
const userNameInput = document.getElementById('userName');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('requiredPasword');
const termsCheckbox = document.getElementById('terms');

function showError(input, errorId, message) {
    input.classList.add('invalid');
   const errorElement = document.getElementById(errorId);
   if (errorElement) errorElement.innerText = message;

}

function clearErrors() {
    const inputs = document.querySelectorAll('input');
    const errorMsgs = document.querySelectorAll('.error-msg');
    inputs.forEach(input => input.classList.remove('invalid'));
    errorMsgs.forEach(msg => msg.innerText = '');
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    
    let isValid = true;

    if (!userNameInput.value.trim()) {
        showError(userNameInput, 'error-userName', 'Họ và tên đệm không được để trống');
        isValid = false;
    }
    if (!nameInput.value.trim()) {
        showError(nameInput, 'error-name', 'Tên không được để trống');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = emailInput.value.trim();
    if (!emailInput.value.trim()) {
        showError(emailInput, 'error-email', 'Email không được để trống');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'error-email', 'Email không đúng định dạng');
        isValid = false;
    }

    if (!passwordInput.value) {
        showError(passwordInput, 'error-password', 'Mật khẩu không được để trống');
        isValid = false;
    } else if (passwordInput.value.length < 8) {
        showError(passwordInput, 'error-password', 'Mật khẩu tối thiểu 8 ký tự');
        isValid = false;
    }

    if (!confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'error-requiredPasword', 'Vui lòng xác nhận mật khẩu');
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'error-requiredPasword', 'Mật khẩu không trùng khớp');
        isValid = false;
    }

    if (!termsCheckbox.checked) {
        document.getElementById('error-terms').innerText = 'Bạn phải đồng ý với điều khoản';
        isValid = false;
    }

       if (isValid) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const isEmailUsed = users.some(user => user.email === emailValue);
        
        if(isEmailUsed){
            showError(emailInput,'error-email','Email này đã tồn tại');
            return;

        }
        const newUser = {
            userName: userNameInput.value.trim(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value 
        };

        users.push(newUser);
       
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng ký thành công !",
        showConfirmButton: false,
        timer: 1500
        });

        setTimeout(()=>{
             window.location.href = "../dangnhap/index.html";
        },1500);
        }

});

    