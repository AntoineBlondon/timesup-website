/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


const BASE_URL = 'https://octimesup.pythonanywhere.com';


document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    checkAuthStatus();
}


function checkAuthStatus() {
    const token = localStorage.getItem('jwt');
    if (token) {
        // Here, you could also validate the token's integrity or expiration if needed
        testToken().then(() => {
            console.log('User is logged in');
            menu_screen();
        }).catch(error => {
            console.error('Token test failed:', error);
            console.log('User is not logged in');
            login_screen();
        });
    } else {
        console.log('User is not logged in');
        login_screen();
    }
}



function testToken() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('jwt');
        cordova.plugin.http.sendRequest(`${BASE_URL}/test`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Explicitly set the Content-Type header
                
            },
        }, response => {
            console.log('Token test successful:', response.data);
            resolve(response.data);
        }, response => {
            console.error('Token test failed:', response.error);
            reject(response.error);
        })
    });
}



function registerUser(username, password) {
    cordova.plugin.http.setDataSerializer('json'); // Set the serializer to JSON
    cordova.plugin.http.sendRequest(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Explicitly set the Content-Type header
        },
        data: {
            username: username,
            password: password
        },
    }, response => {
        console.log('User registered:', response.data);
        loginUser(username, password);
    }, response => {
        console.error('Registration failed:', response.error);
    });
}

function loginUser(username, password) {
    cordova.plugin.http.setDataSerializer('json'); // Set the serializer to JSON
    cordova.plugin.http.sendRequest(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Explicitly set the Content-Type header
        },
        data: {
            username: username,
            password: password
        },
    }, response => {
        console.log('Login successful:', response.data);
        const data = JSON.parse(response.data);
        localStorage.setItem('jwt', data.access_token);
        checkAuthStatus();
    }, response => {
        console.error('Login failed:', response.error, {username: username, password: password});
        // Handle login error
    });
}

function logoutUser() {
    localStorage.removeItem('jwt');
    checkAuthStatus();
}



function createWordList(title, words) {
    return new Promise((resolve, reject) => {
        if(typeof(words) === "string") {
            words = words.split(',');
        }

        const token = localStorage.getItem('jwt');
        cordova.plugin.http.setDataSerializer('json'); // Set the serializer to JSON
        cordova.plugin.http.sendRequest(`${BASE_URL}/wordlists`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                title: title,
                words: words
            },
        }, response => {
            console.log('Word list created:', response.data);
            resolve(response.data);
        }, response => {
            console.error('Failed to create word list:', response.error);
            reject(response.error);
        });
    });
}

function getWordLists() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('jwt');
        cordova.plugin.http.setDataSerializer('json'); // This line might not be necessary for GET requests
        cordova.plugin.http.sendRequest(`${BASE_URL}/wordlists`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // This header might not be necessary for GET requests
            },
        }, response => {
            console.log('Word lists:', response.data);
            resolve(response.data); // Resolve the promise with the response data
        }, response => {
            console.error('Failed to retrieve word lists:', response.error);
            reject(response.error); // Reject the promise if there's an error
        });
    });
}


function getSharedWordLists() {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('jwt');
        cordova.plugin.http.setDataSerializer('json'); // This line might not be necessary for GET requests
        cordova.plugin.http.sendRequest(`${BASE_URL}/shared-wordlists`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // This header might not be necessary for GET requests
            },
        }, response => {
            console.log('Shared word lists:', response.data);
            resolve(response.data); // Resolve the promise with the response data
        }, response => {
            console.error('Failed to retrieve shared word lists:', response.error);
            reject(response.error); // Reject the promise if there's an error
        });
    });
}


function updateWordList(wordListId, title, words_to_add, words_to_remove, secret) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('jwt');
        cordova.plugin.http.setDataSerializer('json'); // Set the serializer to JSON
        cordova.plugin.http.sendRequest(`${BASE_URL}/wordlists/${wordListId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                title: title,
                add: words_to_add,
                remove: words_to_remove,
                secret: secret
            },
        }, response => {
            console.log('Word list updated:', response.data);
            resolve(response.data);
        }, response => {
            console.error('Failed to update word list:', response.error);
            reject(response.error);
        });
    });
}

function deleteWordList(wordListId) {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('jwt');
        cordova.plugin.http.setDataSerializer('json'); // This line might not be necessary for GET requests
        cordova.plugin.http.sendRequest(`${BASE_URL}/wordlists/${wordListId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }, response => {
            console.log('Word list deleted:', response.data);
            resolve(response.data);
        }, response => {
            console.error('Failed to delete word list:', response.error);
            reject(response.error);
        });
    });
}
