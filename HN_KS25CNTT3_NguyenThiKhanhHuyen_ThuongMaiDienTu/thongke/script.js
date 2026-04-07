document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logOut');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Đăng xuất?',
                text: "Bạn có chắc chắn muốn rời khỏi hệ thống không?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#f54545',
                cancelButtonColor: '#45f58b',
                confirmButtonText: 'Đăng xuất',
                cancelButtonText: 'Ở lại',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {

                    localStorage.removeItem('userToken');
                    sessionStorage.clear();

                    Swal.fire({
                        icon: 'success',
                        title: 'Đã đăng xuất!',
                        text: 'Hệ thống sẽ chuyển về trang đăng nhập.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    }).then(() => {
                      
                        window.location.href = "http://127.0.0.1:5500/dangnhap/index.html"; 
                    });
                }
            });
        });
    }
});
