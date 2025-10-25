async function onClickLogin() {
    try {
        const form = document.querySelector('.form-group.active');
        if (!form) return;

        const formId = form.id; 
        const userInput = form.querySelector('input[type="text"], input[type="email"]');
        const passInput = form.querySelector('input[type="password"]');
        const username = (userInput && userInput.value || '').trim();
        const password = (passInput && passInput.value || '').trim();

        if (!username || !password) {
            showToast('❌ Please enter username and password', true);
            return;
        }

        const btn = form.querySelector('.login-btn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Signing in...';
        }

        if (formId === 'teacher') {
            if (username === 'teacher@123' && password === '123456') {
                showToast('✅ Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'https://teacher-site.onrender.com/';
                }, 1500);
                return;
            } else {
                showToast('❌ Invalid username or password', true);
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Login';
                }
                return;
            }
        }

        if (formId === 'student') {
            if (username === 'student@123' && password === '123456') {
                showToast('✅ Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'https://student-site-mpgh.onrender.com/';
                }, 1500);
                return;
            } else {
                showToast('❌ Invalid username or password', true);
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Login';
                }
                return;
            }
        }

        const res = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json().catch(() => ({}));

        if (!data || data.success !== true) {
            const msg = (data && data.error) ? data.error : 'Login failed.';
            showToast('❌ ' + msg, true);
            if (btn) {
                btn.disabled = false;
                btn.textContent = (formId === 'institute-signin') ? 'Sign In' : 'Login';
            }
            return;
        }

        const role = (data.role || '').toLowerCase();
        if (role === 'student') {
            window.location.assign('../student_site.html');
        } else if (role === 'teacher') {
            window.location.assign('../teacher_site.html');
        } else if (role === 'institute' || role === 'admin') {
            window.location.assign('../admin_site.html');
        } else {
            window.location.assign('../student_site.html');
        }
        return;
    } catch (err) {
        showToast('❌ Unexpected error. Please try again.', true);
        console.error(err);
    }
}

function instituteLogin() {
    const emailInput = document.getElementById('instituteSigninEmail');
    const passwordInput = document.getElementById('instituteSigninPassword');
    
    const email = (emailInput && emailInput.value || '').trim();
    const password = (passwordInput && passwordInput.value || '').trim();
    
    if (!email || !password) {
        showToast('❌ Please enter email and password', true);
        return;
    }
    
    const storedEmail = localStorage.getItem('instituteEmail');
    const storedPassword = localStorage.getItem('institutePassword');
    
    if (email === storedEmail && password === storedPassword) {
        showToast('✅ Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'https://admin-site-08sb.onrender.com/';
        }, 1500);
    } else {
        showToast('❌ Invalid email or password', true);
    }
}

function switchRole(role) {
    const slider = document.querySelector('.slider');
    const buttons = document.querySelectorAll('.toggle-button');
    const forms = document.querySelectorAll('.form-group');
    const loginBox = document.querySelector('.login_box');

    buttons.forEach(btn => btn.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));

    if (role === 'student') {
        slider.className = 'slider student-active';
        buttons[0].classList.add('active');
        document.getElementById('student').classList.add('active');
        loginBox.classList.remove('slide-center', 'slide-right');
        loginBox.classList.add('slide-left');
    }
    else if (role === 'teacher') {
        slider.className = 'slider teacher-active';
        buttons[1].classList.add('active');
        document.getElementById('teacher').classList.add('active');
        loginBox.classList.remove('slide-left', 'slide-right');
        loginBox.classList.add('slide-center');
    }
    else if (role === 'institute') {
        slider.className = 'slider institute-active';
        buttons[2].classList.add('active');
        showInstituteSignin();
        loginBox.classList.remove('slide-left', 'slide-center');
        loginBox.classList.add('slide-right');
    }
}

function showInstituteSignin() {
    document.getElementById('institute-signin').classList.add('active');
    document.getElementById('institute-step1').classList.remove('active');
    document.getElementById('institute-step2').classList.remove('active');
    document.getElementById('institute-step3').classList.remove('active');
}

function showInstituteSignup() {
    document.getElementById('institute-signin').classList.remove('active');
    document.getElementById('institute-step1').classList.add('active');
    document.getElementById('institute-step2').classList.remove('active');
    document.getElementById('institute-step3').classList.remove('active');
}

function goToStep(step) {
    const steps = [1, 2, 3];
    steps.forEach(i => {
        document.getElementById(`institute-step${i}`).classList.remove('active');
    });
    document.getElementById(`institute-step${step}`).classList.add('active');
}

function togglePassword(btn) {
    const input = btn.previousElementSibling;
    const icon = btn.querySelector('i');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Global variables for OTP
let otpTimer = null;
let otpTimeLeft = 30;
let currentEmail = '';

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.style.display = 'block';
    toast.style.background = isError ? '#f44336' : '#4CAF50';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

// Start 30-second countdown timer
function startOTPTimer() {
    otpTimeLeft = 30;
    const timerText = document.getElementById('timerText');
    const timerCount = document.getElementById('timerCount');
    const resendBtn = document.getElementById('resendBtn');
    
    if (timerText) timerText.style.display = 'inline';
    if (resendBtn) resendBtn.style.display = 'none';
    
    if (otpTimer) clearInterval(otpTimer);
    
    otpTimer = setInterval(() => {
        otpTimeLeft--;
        if (timerCount) timerCount.textContent = otpTimeLeft;
        
        if (otpTimeLeft <= 0) {
            clearInterval(otpTimer);
            if (timerText) timerText.style.display = 'none';
            if (resendBtn) resendBtn.style.display = 'inline-block';
        }
    }, 1000);
}

// Send OTP to email
async function sendOTP(email) {
    try {
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            currentEmail = email;
            showToast('✅ OTP sent successfully! Check your email.');
            startOTPTimer();
            return true;
        } else {
            showToast('❌ ' + (data.error || 'Failed to send OTP'), true);
            return false;
        }
    } catch (err) {
        console.error('Send OTP error:', err);
        showToast('❌ Network error. Please try again.', true);
        return false;
    }
}

// Resend OTP
async function resendOTP() {
    if (!currentEmail) {
        showToast('❌ Email not found. Please go back.', true);
        return;
    }
    
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
    }
    
    const success = await sendOTP(currentEmail);
    
    if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend OTP';
    }
}

// Verify OTP
async function verifyOTP() {
    const otpInput = document.getElementById('otpInput');
    const otp = (otpInput && otpInput.value || '').trim();
    
    if (!otp || otp.length !== 6) {
        showToast('❌ Please enter a valid 6-digit OTP', true);
        return;
    }
    
    if (!currentEmail) {
        showToast('❌ Email not found. Please go back.', true);
        return;
    }
    
    const verifyBtn = document.querySelector('#institute-step3 .login-btn');
    const originalText = verifyBtn.innerHTML;
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    
    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentEmail, otp })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            showToast('✅ Email verified successfully!');
            if (otpTimer) clearInterval(otpTimer);
            
            if (data.awaitingApproval && data.approvalToken) {
                showApprovalWaiting(data.approvalToken);
            } else {
                setTimeout(() => {
                    alert('Registration successful! You can now sign in.');
                    showInstituteSignin();
                }, 1500);
            }
        } else {
            showToast('❌ ' + (data.error || 'Invalid OTP'), true);
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = originalText;
        }
    } catch (err) {
        console.error('Verify OTP error:', err);
        showToast('❌ Network error. Please try again.', true);
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = originalText;
    }
}

function showApprovalWaiting(approvalToken) {
    const step3 = document.getElementById('institute-step3');
    if (!step3) return;
    
    step3.innerHTML = `
        <h2>⏳ Waiting for Admin Approval</h2>
        <div style="text-align: center; padding: 15px;">
            <div style="font-size: 60px;">⏱️</div>
            <p class="info-text">Your email has been verified successfully!</p>
            <p style="margin: 20px 0; font-size: 16px;">
                An approval request has been sent to the administrator.<br>
                Please wait while your registration is being reviewed.
            </p>
            <div style="margin-top: 20px;">
                <div class="spinner" style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    checkApprovalStatus(approvalToken);
}

function checkApprovalStatus(token) {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(`/api/check-approval/${token}`);
            const data = await response.json();
            
            if (data.ok) {
                if (data.status === 'approved') {
                    clearInterval(interval);
                    
                    const step3 = document.getElementById('institute-step3');
                    if (step3) {
                        step3.innerHTML = `
                            <div style="text-align: center; padding: 40px 20px;">
                                <div style="font-size: 80px; margin: 20px 0;">✅</div>
                                <h2 style="color: #28a745; margin: 20px 0;">Approved!</h2>
                                <div style="
                                    background: #d4edda; 
                                    border: 2px solid #28a745; 
                                    padding: 20px; 
                                    margin: 20px auto;
                                    border-radius: 10px;
                                    max-width: 500px;
                                ">
                                    <p style="font-size: 18px; margin: 0; color: #155724;">
                                        Your application has been approved. Redirecting to login page...
                                    </p>
                                </div>
                            </div>
                        `;
                    }
                    
                    showToast('✅ You have been approved by admin!');
                    setTimeout(() => {
                        showInstituteSignin();
                    }, 3000);
                } else if (data.status === 'rejected') {
                    clearInterval(interval);
                    if (statusDiv) {
                        statusDiv.style.background = '#f8d7da';
                        statusDiv.style.borderColor = '#dc3545';
                        statusDiv.innerHTML = '<strong>Status:</strong> ❌ Registration Rejected';
                    }
                    showToast('❌ Your registration was rejected', true);
                    setTimeout(() => {
                        showInstituteSignin();
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Error checking approval status:', error);
        }
    }, 3000);
}

function dummyVerify() {
    verifyOTP();
}
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function filled(){
    const continueBtn = document.getElementById('signBtn1');
    const inputs = document.querySelectorAll('#institute-step1 input');
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }  
    });
    if (allFilled) {
        continueBtn.disabled = false;
        continueBtn.classList.add('enabled');
    } else {
        continueBtn.disabled = true;
        continueBtn.classList.remove('enabled');
    }


}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = Array.from(document.querySelectorAll('#institute-step1 input'));
    const continueBtn = document.getElementById('signBtn1');
    if (!continueBtn) return;

    
    filled();

    inputs.forEach(i => i.addEventListener('input', filled));

    
    continueBtn.addEventListener('click', (e) => {
        
        filled();
        if (continueBtn.disabled) {
            e.preventDefault();
            alert('Please fill all required fields');
            return;
        }
        
        goToStep(2);
    });

    
    const emailInput = document.getElementById('instEmail');
    const phoneInput = document.getElementById('instPhone');
    const pwdInput = document.getElementById('instPassword');
    const pwdConfirm = document.getElementById('instPasswordConfirm');
    const signBtn2 = document.getElementById('signBtn2');
    
    
    const pwdFill = document.getElementById('pwdFill');
    const pwdText = document.getElementById('pwdText');

    if (!signBtn2) return;

    function scorePassword(pwd) {
        let score = 0;
        if (!pwd) return 0;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        return score; 
    }

    function updatePwdUI() {
        const val = pwdInput.value || '';
        const score = scorePassword(val);
        const pct = Math.min(100, (score / 4) * 100);
        
        const strengthEl = pwdFill && pwdFill.parentElement && pwdFill.parentElement.parentElement ? pwdFill.parentElement.parentElement : null;
        if (strengthEl) {
            strengthEl.style.display = val ? 'flex' : 'none';
        }
        if (pwdFill) pwdFill.style.width = pct + '%';
        if (score <= 1) {
            pwdText.textContent = 'Too weak';
        } else if (score === 2) {
            pwdText.textContent = 'Weak';
        } else if (score === 3) {
            pwdText.textContent = 'Good';
        } else {
            pwdText.textContent = 'Strong';
        }
    }

    function validateStep2() {
        let ok = true;
        
        const emailVal = (emailInput && emailInput.value || '').trim();
        if (!emailInput || !validateEmail(emailVal)) {
            if (emailInput) emailInput.classList.add('input-invalid');
            ok = false;
        } else {
            if (emailInput) emailInput.classList.remove('input-invalid');
        }

        
        const phoneDigits = (phoneInput && phoneInput.value || '').replace(/\D/g, '');
        if (!phoneInput || !phoneInput.value.trim() || phoneDigits.length !== 10) {
            if (phoneInput) phoneInput.classList.add('input-invalid');
            ok = false;
        } else {
            if (phoneInput) phoneInput.classList.remove('input-invalid');
        }

        
        const pwd = (pwdInput && pwdInput.value) || '';
        const conf = (pwdConfirm && pwdConfirm.value) || '';
        const score = scorePassword(pwd);
        if (!pwd || score < 3) {
            if (pwdInput) pwdInput.classList.add('input-invalid');
            ok = false;
        } else {
            if (pwdInput) pwdInput.classList.remove('input-invalid');
        }
        if (pwd && conf && pwd !== conf) {
            if (pwdConfirm) pwdConfirm.classList.add('input-invalid');
            ok = false;
        } else {
            if (pwdConfirm) pwdConfirm.classList.remove('input-invalid');
        }

        
        if (signBtn2) signBtn2.classList.toggle('enabled', ok);
        return ok;
    }

    
    [emailInput, phoneInput, pwdInput, pwdConfirm].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => {
            updatePwdUI();
            validateStep2();
        });
    });

    
    if (signBtn2) {
        
        signBtn2.disabled = false;
        signBtn2.addEventListener('click', async (e) => {
            const ok = validateStep2();
            if (!ok) {
                
                const firstInvalid = document.querySelector('.input-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            
            const emailVal = (emailInput && emailInput.value || '').trim();
            const passwordVal = (pwdInput && pwdInput.value || '').trim();
            
            if (!emailVal) {
                showToast('❌ Email is required', true);
                return;
            }
            
            localStorage.setItem('instituteEmail', emailVal);
            localStorage.setItem('institutePassword', passwordVal);
            
            signBtn2.disabled = true;
            signBtn2.textContent = 'Sending OTP...';
            
            const success = await sendOTP(emailVal);
            
            signBtn2.disabled = false;
            signBtn2.textContent = 'Continue';
            
            if (success) {
                goToStep(3);
            }
        });
    }
})