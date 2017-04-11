require('../styles/main.css');

if(module.hot) module.hot.accept();

const config = {
    apiKey: 'AIzaSyC5OpunsJdVqQfGRssTKWWPPx-HsNp2vcc',
    authDomain: 'mockups-aa5ce.firebaseapp.com',
    databaseURL: 'https://mockups-aa5ce.firebaseio.com',
    projectId: 'mockups-aa5ce',
    storageBucket: 'mockups-aa5ce.appspot.com',
    messagingSenderId: '105538656346'
};

firebase.initializeApp(config);
const database = firebase.database();

const devices = [{
        name: 'iMac',
        prettyName: 'iMac',
        image: {
            fileName: 'Apple%20iMac.png',
            width: 2788,
            height: 2351,
            format: 'png'
        },
        screen: {
            top: 6.5,
            right: 4,
            bottom: 32.1,
            left: 4
        }
    }, {
        name: 'MacbookPro15',
        prettyName: 'Macbook Pro 15"',
        image: {
            fileName: 'Apple%20Macbook%20Pro%2015%22.png',
            width: 3783,
            height: 2268,
            format: 'png'
        },
        screen: {
            top: 7.8,
            right: 12,
            bottom: 12.6,
            left: 12
        }
    }, {
        name: 'Nokia230',
        prettyName: 'Nokia 230',
        image: {
            fileName: 'Nokia%20230%20Black.png',
            width: 297,
            height: 705,
            format: 'png'
        },
        screen: {
            top: 9.4,
            right: 9.5,
            bottom: 45.1,
            left: 10
        }
    }, {
        name: 'iPhone6sGray',
        prettyName: 'iPhone 6s Space Gray',
        image: {
            fileName: 'Apple%20iPhone%206s%20Space%20Gray.png',
            width: 990,
            height: 1934,
            format: 'png'
        },
        screen: {
            top: 15.5,
            right: 12,
            bottom: 15.5,
            left: 12
        }
    }, {
        name: 'SurfaceBook',
        prettyName: 'Microsoft Surface Book',
        image: {
            fileName: 'Microsoft%20Surface%20Book.png',
            width: 4143,
            height: 2456,
            format: 'png'
        },
        screen: {
            top: 7.6,
            right: 13.7,
            bottom: 11,
            left: 13.9
        }
    },
    {
        name: 'AppleWatch',
        prettyName: 'Apple Watch 42mm Edition',
        image: {
            fileName: 'Apple%20Watch%2042mm%20Edition%20Closed.png',
            width: 512,
            height: 950,
            format: 'png'
        },
        screen: {
            top: 29.5,
            right: 19.3,
            bottom: 29.5,
            left: 19.4
        }
    }
];

const state = {
    device: {},
    url: ''
};

const urlParams = new URLSearchParams(window.location.search);

const getDeviceData = (deviceName) => {
    for(const i in devices) {
        const thisDevice = devices[i];
        if(thisDevice.name === deviceName)
            return thisDevice;
    }
};

const resizeScreen = () => {
    const screenEl = document.querySelector('.device--screen');
    const deviceEl = document.querySelector('.device');
    const deviceWidth = deviceEl.getBoundingClientRect().width;
    const deviceHeight = deviceEl.getBoundingClientRect().height;
    if(deviceWidth / deviceEl.getBoundingClientRect().height > state.device.image.width / state.device.image.height) {
        // height is bound
        const imageWidth = deviceHeight * (state.device.image.width / state.device.image.height);
        const imageHeight = deviceHeight;
        const margin = (deviceWidth - imageWidth) / 2;
        screenEl.style.top = `${state.device.screen.top * 0.01 * imageHeight}px`;
        screenEl.style.right = `calc(${margin}px + ${state.device.screen.right * 0.01 * imageWidth}px)`;
        screenEl.style.bottom = `${state.device.screen.bottom * 0.01 * imageHeight}px`;
        screenEl.style.left = `calc(${margin}px + ${state.device.screen.left * 0.01 * imageWidth}px)`;
    } else {
        // width is bound
        const imageWidth = deviceWidth;
        const imageHeight = deviceWidth * (state.device.image.height / state.device.image.width);
        const margin = (deviceHeight - imageHeight) / 2;
        screenEl.style.top = `calc(${margin}px + ${state.device.screen.top * 0.01 * imageHeight}px)`;
        screenEl.style.right = `${state.device.screen.right * 0.01 * imageWidth}px`;
        screenEl.style.bottom = `calc(${margin}px + ${state.device.screen.bottom * 0.01 * imageHeight}px)`;
        screenEl.style.left = `${state.device.screen.left * 0.01 * imageWidth}px`;
    }
};

const setScreenImage = (url, update = true) => {
    state.url = url;
    document.querySelector('.device--screen-image').setAttribute('src', url);
    urlParams.set('image', url);
    if(update)
        window.history.pushState(state, '', `?${urlParams.toString()}`);
};

const setDevice = (deviceName, update = true) => {
    state.device = getDeviceData(deviceName);
    const deviceEl = document.querySelector('.device');
    deviceEl.style.backgroundImage = `url(assets/images/${state.device.image.fileName}`;
    urlParams.set('device', deviceName);
    if(update)
        window.history.pushState(state, '', `?${urlParams.toString()}`);
    resizeScreen();
};

const populateSettings = () => {
    const urlInput = document.querySelector('.device--url');
    const deviceInput = document.querySelector('.device--selector');
    for(const i in devices) {
        const thisDevice = devices[i];
        const thisOpt = document.createElement('option');
        thisOpt.value = thisDevice.name;
        thisOpt.innerText = thisDevice.prettyName;
        if(thisOpt.value === state.device.name)
            thisOpt.selected = true;
        deviceInput.appendChild(thisOpt);
    }

    if(urlParams.get('image').length > 0)
        urlInput.value = urlParams.get('image');
};


const getIdFromState = () => {
    const data = JSON.stringify(state);
    const id = Math.random().toString(36).substring(2, 8);
    database.ref(`urls/${id}`).set(data);
    return id;
};

const shortenUrl = () => {
    const id = getIdFromState();
    const urlInput = document.querySelector('.dropdown--url');
    const shortenButton = document.querySelector('.dropdown--shorten');
    window.history.pushState(state, '', `?id=${id}`);
    urlInput.value = window.location;
    urlInput.select();
    document.execCommand('copy');
    shortenButton.innerText = '✓ Copied to clipboard';
    shortenButton.classList.add('button--action');
    window.setTimeout(() => {
        shortenButton.innerText = 'Shorten URL';
        shortenButton.classList.remove('button--action');
    }, 2000);
};

const restoreState = (id) => {
    database.ref(`urls/${id}`).once('value').then((data) => {
        const storedState = JSON.parse(data.val());
        urlParams.delete('id');
        setDevice(storedState.device.name, false);
        setScreenImage(storedState.url, false);
        populateSettings();
    });
};

const bindFormEvents = () => {
    const urlInput = document.querySelector('.device--url');
    const deviceInput = document.querySelector('.device--selector');
    const shortenButton = document.querySelector('.dropdown--shorten');

    urlInput.addEventListener('change', () => {
        setScreenImage(urlInput.value);
    });

    deviceInput.addEventListener('change', () => {
        setDevice(deviceInput.value);
    });

    shortenButton.addEventListener('click', () => {
        shortenUrl();
    });
};

const dropdownHandler = () => {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList = (
        dropdown.classList.contains('is-active') ? 'dropdown' : 'dropdown is-active'
    );
};

const bindDropdownClick = () => {
    const toggle = document.querySelector('.dropdown--icon');
    const dropdown = document.querySelector('.dropdown');
    toggle.addEventListener('click', dropdownHandler);
    document.addEventListener('click', () => {
        if(dropdown.classList.contains('is-active'))
            dropdown.classList.remove('is-active');
    });
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const deviceName = urlParams.get('device');
    const url = urlParams.get('image');
    if(urlParams.get('id')) {
        restoreState(urlParams.get('id'));
    } else {
        setDevice(deviceName || devices[0].name);
        setScreenImage(url || '');
        populateSettings();
    }
    bindFormEvents();
    bindDropdownClick();
});

window.addEventListener('resize', () => {
    resizeScreen();
});