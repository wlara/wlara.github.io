const homePath = '/newm'
const apiBaseUrl = 'https://staging-newm-server.herokuapp.com'

function onLoadHome() {
    if (localStorage.getItem('token') == null) {
        document.getElementById('loggedOutDiv').style.display = 'initial';
    } else {
        document.getElementById('loggedInDiv').style.display = 'initial';
    }
}

function onLogin() {
    axios.post(apiBaseUrl + '/v1/auth/login', {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    })
    .then(function (response) {
        localStorage['token'] = response.data['accessToken']
        console.log(response);
        location.reload();
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onGoogleLogin(googleUser) {
    axios.post(apiBaseUrl + '/v1/auth/login/google', {
        accessToken: googleUser.getAuthResponse().access_token
    })
    .then(function (response) {
        gapi.auth2.getAuthInstance().signOut();
        localStorage['token'] = response.data['accessToken']
        console.log(response);
        location.reload();
    })
    .catch(function (error) {
        gapi.auth2.getAuthInstance().signOut();
        console.log(error);
        alert(error);
    });
}

function onFacebookLogin() {
   FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            axios.post(apiBaseUrl + '/v1/auth/login/facebook', {
                accessToken: response.authResponse.accessToken
            })
            .then(function (response) {
                localStorage['token'] = response.data['accessToken']
                console.log(response);
                location.reload();
            })
            .catch(function (error) {
                console.log(error);
                alert(error);
            });
        } else {
            alert('Login failed, status: ' + response.status)
        }
    });
}

function onLogout() {
    localStorage.removeItem('token')
    location.reload();
}

function onJoin() {
    axios.put(apiBaseUrl + '/v1/users', {
        firstName: document.getElementById('firstName').value.nullIfEmpty(),
        lastName: document.getElementById('lastName').value.nullIfEmpty(),
        nickname: document.getElementById('nickname').value.nullIfEmpty(),
        pictureUrl: document.getElementById('pictureUrl').value.nullIfEmpty(),
        role: document.getElementById('role').value.nullIfEmpty(),
        genre: document.getElementById('genre').value.nullIfEmpty(),
        email: document.getElementById('email').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        authCode: document.getElementById('authCode').value
    })
    .then(function (response) {
        console.log(response);
        alert('Successfully Joined!!!')
        window.location.href = homePath;
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onDelete() {
    axios.delete(apiBaseUrl + '/v1/users/me', {
        withCredentials: true,
        headers: {
            'Authorization': getBearerAuth()
        }
    })
    .then(function (response) {
        console.log(response);
        localStorage.removeItem('token')
        alert('Account Deleted!!!')
        location.reload();
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onRecover() {
    axios.put(apiBaseUrl + '/v1/users/password', {
        email: document.getElementById('email').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        authCode: document.getElementById('authCode').value
    })
    .then(function (response) {
        console.log(response);
        alert('Successfully Recovered!!!')
        window.location.href = homePath;
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onVerificationCode() {
    const email = document.getElementById('email').value
    axios.get(apiBaseUrl + '/v1/auth/code', {
        params: { email: email }
    })
    .then(function (response) {
        console.log(response);
        alert('Verification Code successfully send to: ' + email)
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onLoadProfile() {
    axios.get(apiBaseUrl + '/v1/users/me', {
        withCredentials: true,
        headers: {
            'Authorization': getBearerAuth()
        }
    })
    .then(function (response) {
        console.log(response);
        loadJsonTable('profileTable', response.data)
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onLoadJwt() {
    axios.get(apiBaseUrl + '/v1/auth/jwt', {
        withCredentials: true,
        headers: {
            'Authorization': getBearerAuth()
        }
    })
    .then(function (response) {
        console.log(response);
        loadJsonTable('jwtTable', response.data)
    })
    .catch(function (error) {
        console.log(error);
        alert(error);
    });
}

function onLoadSongs() {
    axios.get(apiBaseUrl + '/v1/songs', {
        withCredentials: true,
        headers: {
            'Authorization': getBearerAuth()
        },
        transformResponse: body => body     // disable json parsing
    })
    .then(function (response) {
        console.log(response);
        document.getElementById('songsDiv').innerHTML = response.data
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getBearerAuth() {
    return 'Bearer ' + localStorage.getItem('token');
}

function loadJsonTable(tableId, jsonData) {
    const table = document.getElementById(tableId);
    var row, cell1, cell2;
    for (let key in jsonData) {
        row = table.insertRow();
        cell1 = row.insertCell();
        cell2 = row.insertCell();
        cell1.innerHTML = key;
        cell2.innerHTML = jsonData[key];
    }
}

String.prototype.nullIfEmpty = function() {
    return this.length > 0 ? this : null;
}

Array.prototype.nullIfEmpty = function() {
    return this.length > 0 ? this : null;
}
