const API_URL = 'http://localhost:3000/api';

window.onload = function() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showProfile(user);
    }
};

async function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;
    
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (res.ok) {
        alert('Успешно! Теперь войдите.');
        showLogin();
    } else {
        document.getElementById('message').innerText = data.error || "Ошибка регистрации";
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        // СОХРАНЯЕМ В ПАМЯТЬ БРАУЗЕРА
        localStorage.setItem('user', JSON.stringify(data));
        showProfile(data);
    } else {
        document.getElementById('message').innerText = data.error || "Ошибка входа";
    }
}

async function updateProfile() {
    const userId = document.getElementById('user-id-hidden').value;
    const bio = document.getElementById('edit-bio').value;
    const avatarUrl = document.getElementById('edit-avatar').value;

    const res = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bio, avatarUrl })
    });

    const data = await res.json();

    if (res.ok) {
        alert('Данные обновлены!');

        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, bio: bio, avatar: avatarUrl };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        document.getElementById('user-avatar').src = avatarUrl;
    } else {
        alert('Ошибка обновления');
    }
}

function showProfile(user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('profile-view').style.display = 'block';
    
    document.getElementById('user-email').innerText = user.email;
    document.getElementById('user-avatar').src = user.avatar || "";
    document.getElementById('user-id-hidden').value = user.userId;
    
    document.getElementById('edit-bio').value = user.bio || "";
    document.getElementById('edit-avatar').value = user.avatar || "";

    document.getElementById('message').innerText = '';
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('message').innerText = '';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('message').innerText = '';
}

function logout() {
    localStorage.removeItem('user');
    location.reload();
}