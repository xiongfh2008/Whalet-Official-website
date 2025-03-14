document.addEventListener('DOMContentLoaded', function() {
    // 用户中心下拉菜单
    const userCenterBtn = document.getElementById('userCenterBtn');
    const userCenterDropdown = document.getElementById('userCenterDropdown');
    const passwordModal = document.getElementById('passwordModal');
    const passwordInputs = document.querySelectorAll('.payment-password-input input');
    const passwordError = document.getElementById('passwordError');
    let currentPhotoContainer = null;

    // 模拟支付密码
    const PAYMENT_PASSWORD = '123456';
    let isPhotosVerified = false;

    userCenterBtn.addEventListener('click', function() {
        userCenterDropdown.classList.toggle('hidden');
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(event) {
        if (!userCenterBtn.contains(event.target)) {
            userCenterDropdown.classList.add('hidden');
        }
    });

    // 模拟数据
    const userData = {
        idNumber: '110101199001011234',
        validFrom: '2020-01-01',
        validUntil: '2030-12-31',
        idAddress: '北京市朝阳区某某街道',
        residenceAddress: '北京市海淀区某某小区'
    };

    // 证件号码脱敏处理 - 只显示最后一位
    const maskIdNumber = (idNum) => {
        return idNum.slice(0, -1).replace(/\d/g, '*') + idNum.slice(-1);
    };

    // 地址脱敏处理 - 只显示前两个汉字
    const maskAddress = (address) => {
        return address.slice(0, 2) + '*'.repeat(24);
    };

    // 更新页面数据
    document.getElementById('idNumber').textContent = maskIdNumber(userData.idNumber);
    document.getElementById('validFrom').textContent = userData.validFrom;
    document.getElementById('validUntil').textContent = userData.validUntil;
    document.getElementById('idAddress').textContent = maskAddress(userData.idAddress);
    document.getElementById('residenceAddress').textContent = maskAddress(userData.residenceAddress);

    // 显示所有照片
    function showAllPhotos() {
        document.querySelectorAll('.photo-container').forEach(container => {
            const mask = container.querySelector('.photo-mask');
            const img = container.querySelector('img');
            mask.classList.add('hidden');
            img.classList.remove('hidden');
        });
        isPhotosVerified = true;
    }

    // 处理照片点击事件
    document.querySelectorAll('.photo-mask').forEach(mask => {
        mask.addEventListener('click', function() {
            if (isPhotosVerified) {
                // 如果已经验证过，直接显示所有照片
                showAllPhotos();
                return;
            }
            currentPhotoContainer = this.parentElement;
            passwordModal.classList.remove('hidden');
            passwordModal.classList.add('flex');
            resetPasswordInputs();
            passwordInputs[0].focus();
        });
    });

    // 处理密码输入
    passwordInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value) {
                if (index < passwordInputs.length - 1) {
                    passwordInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                passwordInputs[index - 1].focus();
            }
        });
    });

    // 确认密码
    document.getElementById('confirmPassword').addEventListener('click', function() {
        const enteredPassword = Array.from(passwordInputs).map(input => input.value).join('');
        
        if (enteredPassword === PAYMENT_PASSWORD) {
            showAllPhotos(); // 显示所有照片
            closePasswordModal();
        } else {
            passwordError.classList.remove('hidden');
            resetPasswordInputs();
            passwordInputs[0].focus();
        }
    });

    // 取消按钮
    document.getElementById('cancelPassword').addEventListener('click', closePasswordModal);

    // 关闭密码弹窗
    function closePasswordModal() {
        passwordModal.classList.add('hidden');
        passwordModal.classList.remove('flex');
        passwordError.classList.add('hidden');
        resetPasswordInputs();
        currentPhotoContainer = null;
    }

    // 重置密码输入框
    function resetPasswordInputs() {
        passwordInputs.forEach(input => {
            input.value = '';
        });
        passwordError.classList.add('hidden');
    }

    // 图片加载错误处理
    const handleImageError = (img) => {
        img.onerror = null;
        img.src = '../assets/images/placeholder.png';
        img.parentElement.querySelector('p').textContent += ' (加载失败)';
    };

    // 为所有证件照片添加错误处理
    document.querySelectorAll('#idPhotos img').forEach(img => {
        img.onerror = () => handleImageError(img);
    });
}); 