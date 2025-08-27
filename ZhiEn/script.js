// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
const page = window.location.pathname.split('/').pop().replace('.html', '');
const fontCookieName = `${page}FontSize`;
// Function to change font size
function changeFontSize(change) {
    let fontSize = parseInt(getCookie(fontCookieName)) || 16; // Default size is 16px
    fontSize += change;
    const minFontSize = 10; 
    const maxFontSize = 22; 
    
    if (fontSize < minFontSize) fontSize = minFontSize;
    if (fontSize > maxFontSize) fontSize = maxFontSize;
    
    setCookie(fontCookieName, fontSize, 365);
    applyFontSize();
}

// Function to apply the font size
function applyFontSize() {
    const fontSize = getCookie(fontCookieName);
    if (fontSize) {
        document.documentElement.style.fontSize = fontSize + "px";
    }
}

// Apply font size on page load
window.onload = applyFontSize;

function updateTime() {
  fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kuala_Lumpur")
    .then(response => response.json())
    .then(data => {
      const date = new Date(data.dateTime);
      const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      document.getElementById("local-time").textContent = "🕒 " + date.toLocaleString("en-GB", options);
    });
}
setInterval(updateTime, 60000);
updateTime();

// Show Malaysia local time
function updateTime() {
  fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kuala_Lumpur")
    .then(response => response.json())
    .then(data => {
      const date = new Date(data.dateTime);
      const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      document.getElementById("local-time").textContent = "🕒 " + date.toLocaleString("en-GB", options);
    });
}
setInterval(updateTime, 60000);
updateTime();
const themeCookie = "siteTheme";

function applyTheme(theme) {
  const t = theme || getCookie(themeCookie) || "light";
  document.documentElement.setAttribute("data-theme", t);
  document.getElementById("themeToggle").textContent = t==="dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current==="dark" ? "light" : "dark";
  setCookie(themeCookie, next, 365);
  applyTheme(next);
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  document.getElementById("themeToggle").onclick = toggleTheme;
});
async function loadWeather() {
  const apiKey = "2cfd43855f99e910f0202148f940ef0b";
  const lat = 3.139;   // Kuala Lumpur latitude
  const lon = 101.6869; // Kuala Lumpur longitude

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;       // e.g. "Clouds"
    const description = data.weather[0].description; // e.g. "broken clouds"

    // Weather icon mapping
    const weatherIcons = {
      Clear: "☀️",
      Clouds: "☁️",
      FewClouds: "🌤",
      ScatteredClouds: "🌥",
      BrokenClouds: "☁️",
      Rain: "🌧",
      Drizzle: "🌦",
      Thunderstorm: "⛈",
      Snow: "❄️",
      Mist: "🌫",
      Haze: "🌫",
      Smoke: "💨",
      Dust: "🌪",
      Fog: "🌫",
      Sand: "🏜",
      Ash: "🌋",
      Squall: "💨",
      Tornado: "🌪"
    };

    // Pick icon based on condition
    const icon = weatherIcons[condition] || "🌤";

    // Display with icon + temp + description
    document.getElementById("local-weather").textContent =
      `${icon} ${temp}°C, ${description}`;
  } catch (err) {
    console.error("Weather fetch error:", err);
    document.getElementById("local-weather").textContent = "Weather unavailable";
  }
}

// Load once
loadWeather();
// Refresh every 10 minutes
setInterval(loadWeather, 600000);


function race_scrollToContent() {
    const contentSection = document.getElementById("foodContent");
    contentSection.scrollIntoView({ behavior: 'smooth' });
} 
// Object to store current index for each carousel
const carouselIndices = {};

// Function to change the image in the carousel
function changeImage(carouselId, direction) {
    // If carouselId is a number (backward compatibility for first carousel)
    if (typeof carouselId === 'number') {
        direction = carouselId;
        carouselId = 'default';
    }
    
    // Find the correct carousel container
    let carouselContainer;
    if (carouselId === 'default') {
        carouselContainer = document.querySelector('.carousel-container');
    } else {
        carouselContainer = document.getElementById(carouselId).parentElement;
    }
    
    const carousel = carouselContainer.querySelector('.carousel');
    const images = carousel.querySelectorAll('.carousel-image');
    const totalImages = images.length;
    
    // Initialize index if it doesn't exist
    if (!(carouselId in carouselIndices)) {
        carouselIndices[carouselId] = 0;
    }
    
    // Update currentIndex based on the direction
    carouselIndices[carouselId] += direction;
    
    // Handle wrapping around: if we go past the last image, go to first
    // If we go before the first image, go to last
    if (carouselIndices[carouselId] >= totalImages) {
        carouselIndices[carouselId] = 0;
    } else if (carouselIndices[carouselId] < 0) {
        carouselIndices[carouselId] = totalImages - 1;
    }

    // Move the carousel to the new image
    const newTranslateX = -carouselIndices[carouselId] * 100;
    carousel.style.transform = `translateX(${newTranslateX}%)`;

    // Update the active dot
    updateDots(carouselId, carouselContainer);
}

// Function to set the current image when clicking on a dot
function currentImage(carouselId, index) {
     if (typeof carouselId === 'number') {
        index = carouselId;
        carouselId = 'default';
    }
    
    // Find the correct carousel container
    let carouselContainer;
    if (carouselId === 'default') {
        carouselContainer = document.querySelector('.carousel-container');
    } else {
        carouselContainer = document.getElementById(carouselId).parentElement;
    }
    
    const carousel = carouselContainer.querySelector('.carousel');
    const images = carousel.querySelectorAll('.carousel-image');
    const totalImages = images.length;
    
    // Ensure index is within bounds
    if (index >= 0 && index < totalImages) {
        carouselIndices[carouselId] = index;
        const newTranslateX = -carouselIndices[carouselId] * 100;
        carousel.style.transform = `translateX(${newTranslateX}%)`;

        updateDots(carouselId, carouselContainer);
    }
}

// Function to update the active dot indicator
function updateDots(carouselId, carouselContainer) {
    if (!carouselContainer) {
        if (carouselId === 'default') {
            carouselContainer = document.querySelector('.carousel-container');
        } else {
            carouselContainer = document.getElementById(carouselId).parentElement;
        }
    }
    
    const dots = carouselContainer.querySelectorAll('.dot');
    const currentIndex = carouselIndices[carouselId] || 0;
    
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}
// Object to keep track of intervals for each carousel
const carouselIntervals = {};

// Function to start auto-sliding images
function startAutoSlide(carouselId, interval = 3000) {
    if (carouselIntervals[carouselId]) {
        clearInterval(carouselIntervals[carouselId]);
    }

    // Start auto slide
    carouselIntervals[carouselId] = setInterval(() => {
        changeImage(carouselId, 1); 
    }, interval);
}

// Start auto slide for all carousels on page load
document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel");
    carousels.forEach(carousel => {
        startAutoSlide(carousel.id, 3000); 
    });
});

const translations = {
    'char-kway-teow': {
        bm: "Char Kway Teow adalah hidangan mi goreng yang terkenal dari komuniti Cina (khususnya Hokkien) di Malaysia. Ia terdiri daripada mi beras lebar yang digoreng bersama udang, telur, sosej Cina, taugeh, dan daun bawang dengan gaya goreng wok yang berasap dan campuran sos soya. Hidangan ini sering dimasak dengan sedikit cili dan dihidangkan panas.",
        bc: "炒粿条是马来西亚华人（特别是福建人）著名的炒面。它由宽米面、虾、鸡蛋、广东腊肠、豆芽和韭菜炒制而成，加入酱油，味道香浓，常带有一点辣味，最后用大火炒至微焦，热腾腾地上桌。"
    },
    'hokkien-mee': {
        bm: "Hokkien Mee adalah hidangan mi yang berasal dari komuniti Cina Hokkien di Malaysia. Ia diperbuat daripada mi kuning tebal yang digoreng bersama udang, sotong, dan daging babi, sering kali dimasak dalam sos soya gelap yang memberikan rasa yang dalam. Hidangan ini biasanya dihidangkan dengan sambal cili untuk rasa pedas tambahan.",
        bc: "福建面是一道起源于马来西亚福建华人的经典面条。它由粗黄面、虾、鱿鱼和猪肉炒制而成，通常用黑酱油炒制，带有浓郁的咸香味。吃的时候常常会配上一点辣椒酱，增加风味。"
    },
     
    'chee-cheong-fun': {
        bm: "Chee Cheong Fun adalah hidangan dari kaum Cina Kantonis yang terdiri daripada gulungan mi beras kukus yang diisi dengan pelbagai bahan seperti udang, ayam, atau cendawan. Hidangan ini sering disajikan dengan sos soya manis dan bijan, memberikan rasa yang lembut dan penuh cita rasa.",
        bc: "猪肠粉是一道广东的传统美食，主要由蒸米粉卷组成，内里可以加入虾、鸡肉或蘑菇等馅料。它常常配上甜酱油和芝麻，口感细腻且非常有味道。"
    },
    'dim-sum': {
        bm: "Dim Sum adalah koleksi hidangan kecil yang disajikan dalam bakul buluh kecil, termasuk dumpling, bun, dan makanan ringan yang lazat atau manis. Ia adalah makanan utama dalam masakan Kantonis dan pilihan popular untuk sarapan pagi atau brunch.",
        bc: "点心是一系列小份量的菜肴，通常在小竹蒸笼中呈现，包括饺子、包子和其他咸的或甜的小吃。它是广东菜的代表，并且常作为早餐或早午餐的选择。"
    },
    'lok-lok': {
        bm: "Lok Lok adalah makanan jalanan yang popular, merupakan gabungan pengaruh Cina dan tempatan, di mana pelbagai bahan seperti daging, sayur-sayuran, dan makanan laut dicucuk dengan lidi dan kemudian dicelupkan dalam periuk sup atau minyak yang mendidih. Setelah dimasak, ia dicelup dalam pelbagai sos seperti sos kacang atau cili untuk menambah rasa.",
        bc: "Lok Lok 是一道非常受欢迎的街头小吃，融合了中国和本地的风味。各种食材如肉类、蔬菜和海鲜被串在签子上，然后放入热汤或热油中煮熟。煮熟后，食物会被蘸上各种酱料，如花生酱或辣椒酱，增添风味。"
    },
    'lor-mee': {
        bm: "Lor Mee adalah hidangan mi Cina yang popular dalam kalangan komuniti Teochew dan Hokkien di Malaysia. Hidangan ini terdiri daripada mi kuning tebal yang dihidangkan dalam kuah pekat yang enak, biasanya dibuat dengan daging babi yang diperap, bersama cuka dan bawang putih.",
        bc: "卤面是一道在马来西亚潮州和福建华人中非常受欢迎的传统面条。它由粗黄面和浓郁的卤肉汤组成，通常用卤制过的猪肉，配上醋和大蒜。"
    },
    'wantan-mee': {
        bm: "Wantan Mee adalah hidangan mi yang terdiri daripada mi telur halus yang disajikan dengan dumpling kukus atau goreng (wantan), char siu (daging babi panggang), dan kadang-kadang sayur-sayuran. Hidangan ini sangat popular dalam kalangan masyarakat Cina yang berbahasa Kantonis, terutamanya di kawasan bandar.",
        bc: "云吞面是一道由细面条、蒸或炸的云吞、叉烧（烤猪肉）和有时还会加一些蔬菜组成的面条。它在讲粤语的华人社区，尤其是在城市地区非常受欢迎。"
    },
    'popiah': {
        bm: "Popiah adalah gulungan spring segar yang diisi dengan sayur-sayuran, udang, telur, dan kadang-kadang sosej Cina. Ia adalah snek popular dalam kalangan komuniti Cina, terutamanya di Pulau Pinang dan selatan Malaysia, dan sering dihidangkan dengan sos manis dan savoury.",
        bc: "薄饼是一道清新的春卷，里面包裹着切细的蔬菜、虾、鸡蛋，有时还会加入中国香肠。它在华人社区特别是槟城和马来西亚南部地区非常受欢迎，通常配上甜美的酱汁。"
    },
    'chicken-rice': {
        bm: "Nasi Ayam adalah hidangan yang terdiri daripada ayam rebus atau panggang yang dihidangkan bersama nasi wangi yang dimasak dalam stok ayam, dan biasanya disertai dengan sos cili dan pes halia. Ia adalah hidangan popular dalam kalangan komuniti Cina, terutamanya dalam kalangan kumpulan dialek Hainan.",
        bc: "海南鸡饭是一道由白切鸡或烤鸡搭配用鸡肉高汤煮的香米饭组成的菜肴，通常会配有辣椒酱和姜蓉。这道菜在华人社区中非常受欢迎，尤其是海南话的群体。"
    },
    'asam-laksa': {
        bm: "Asam Laksa adalah sup mi yang masam dan pedas dari komuniti Melayu dan Peranakan, yang dibuat dengan kuah berasaskan asam jawa, mi nasi, dan ditambah dengan ikan kembung, daun pudina, timun, dan sedikit pes cili. Ia terkenal dengan rasa masam dan kaya.",
        bc: "亚参叻沙是一道来自马来和峇峇社区的酸辣面条汤，由基于黄姜的汤底、米线、鲭鱼、薄荷、黄瓜和辣椒酱等配料组成。它以其酸爽而丰富的味道而闻名。"
    },
    "nasi-lemak": {
    bm: "Nasi Lemak sering dianggap sebagai hidangan kebangsaan Malaysia, terutamanya digemari oleh masyarakat Melayu. Ia terdiri daripada nasi yang dimasak dengan santan yang kaya dan berkrim, disertai dengan sambal, ikan bilis goreng, hirisan timun, dan telur rebus. Ia juga boleh disajikan bersama hidangan sampingan seperti ayam, daging rendang, atau sambal sotong.",
    bc: "椰浆饭被誉为马来西亚的国民美食，特别受到马来族群的喜爱。它由用浓郁椰浆煮制的米饭组成，通常搭配辣椒酱（sambal）、炸小鱼、黄瓜片和水煮蛋。有时还会配上额外的菜肴，如炸鸡、牛肉仁当或辣椒鱿鱼。"
},

"nasi-kandar": {
    bm: "Nasi Kandar adalah hidangan popular di Malaysia yang berasal dari kaum India Muslim (mamas). Ia terdiri daripada nasi kukus yang disajikan dengan pelbagai jenis kari dan hidangan sampingan seperti ayam goreng, daging, atau makanan laut. Nasi ini sering disirami dengan campuran kuah kari yang berbeza, memberikan rasa yang unik dan penuh cita rasa.",
    bc: "印度米饭是马来西亚印度穆斯林（Mamas）群体的经典菜肴。它由蒸米饭和各种咖喱、配菜组成，如炸鸡、牛肉或海鲜。米饭通常会淋上多种不同的咖喱汁，创造出独特且美味的餐点。"
},

"roti-canai": {
    bm: "Roti Canai adalah roti pipih yang dipengaruhi oleh masakan India, rangup di luar dan lembut di dalam. Ia dibuat daripada adunan yang diregangkan dan dibaling hingga menjadi nipis, kemudian digoreng. Ia sering disajikan dengan dhal (kari lentil) atau kari ayam. Komuniti Melayu telah menerima hidangan ini sebagai snek popular untuk sarapan atau minum petang.",
    bc: "印度煎饼是一道受印度影响的平面饼，外脆内软。它是由面团制成，通过拉伸和抛扔使其变薄，然后煎炸。通常与黄豆咖喱（dhal）或鸡肉咖喱一起食用。马来族群将其作为流行的早餐或下午茶小吃。"
},

"mee-rebus": {
    bm: "Mee Rebus adalah hidangan mi yang disajikan dengan kuah pekat yang diperbuat daripada kentang, kacang, dan rempah. Dihiasi dengan telur rebus, bawang goreng, dan perahan limau, ia adalah hidangan yang menyenangkan dan popular dalam kalangan masyarakat Melayu, terutamanya untuk sarapan atau makan tengahari.",
    bc: "卤面是一道用黄面条搭配浓厚的由土豆、豆类和香料制成的卤汁的面条。上面放有水煮蛋、炸葱头，并加入青柠汁，成为一道非常受欢迎的马来族群早餐或午餐。"
},

"laksam": {
    bm: "Laksam adalah hidangan mi tradisional Melayu yang berasal dari kawasan utara Malaysia. Ia terdiri daripada mi beras tebal yang disajikan dengan kuah berkrim berasaskan santan. Kuah ini diadun dengan herba, dan hidangan ini biasanya dihiasi dengan ikan, timun, dan sedikit sambal untuk menambah rasa pedas.",
    bc: "拉沙是一道传统的马来米粉菜肴，起源于马来西亚北部地区。它由厚米粉和浓郁的椰浆汤组成，汤底用草药调味，通常上面放有鱼片、黄瓜和一点辣椒酱增添辛辣味。"
},

"satay": {
    bm: "Satay adalah hidangan daging yang disiaskan di lidi dan diperap dengan campuran rempah, kemudian dibakar dan dihidangkan dengan sos kacang yang kaya. Ia adalah hidangan yang berasal dari masyarakat Melayu, tetapi telah diterima oleh pelbagai kumpulan etnik di Malaysia. Satay biasanya dibuat dengan ayam, daging lembu, atau kambing, dan disajikan bersama ketupat.",
    bc: "沙爹是一个流行的烤肉串菜肴，肉串经过香料腌制后烤制，并搭配浓郁的花生酱。这个菜肴起源于马来社区，但在马来西亚各个族群中广泛流行。沙爹通常使用鸡肉、牛肉或羊肉制成，并配有米饼。"
},

"roti-john": {
    bm: "Roti John adalah sandwic popular yang berasal dari Malaysia, diperbuat daripada roti baguette yang diisi dengan daging cincang (biasanya daging lembu atau ayam), telur, bawang, dan campuran rempah. Ia sering dihidangkan dengan sos tomato dan mayonis, dan merupakan snek popular dalam kalangan masyarakat Melayu, terutamanya di gerai-gerai makanan dan penjuru jalan.",
    bc: "约翰面包是一个流行的三明治，起源于马来西亚，由法棍面包填充牛肉或鸡肉末、鸡蛋、洋葱和香料混合而成。它通常搭配番茄酱和美乃滋，是马来族群中受欢迎的小吃，尤其在小吃摊和街角非常常见。"
},

"mee-goreng": {
    bm: "Mee Goreng adalah hidangan mi goreng yang popular dalam kalangan rakyat Malaysia dari pelbagai latar belakang etnik. Ia dibuat dengan mi kuning yang digoreng bersama sayur-sayuran, telur, tauhu, dan pilihan daging (ayam, daging lembu, atau makanan laut), yang dibumbui dengan sos soya dan cili untuk rasa tambahan.",
    bc: "炒面是马来西亚各族群喜爱的炒面。它由黄面、蔬菜、鸡蛋、豆腐以及鸡肉、牛肉或海鲜等食材炒制而成，加入酱油和辣椒增添风味。"
},

"kuih-lapis": {
    bm: "Kuih Lapis adalah kek lapis tradisional yang dibuat daripada tepung beras, gula, santan, dan jus pandan. Kek berwarna-warni ini adalah hidangan utama dalam perayaan Melayu dan terkenal dengan penampilannya yang ceria serta tekstur lembut dan kenyal.",
    bc: "千层糕是由米粉、糖、椰浆和香兰汁制成的传统马来糕点。它色彩鲜艳，是马来节庆中的必备食品，以其明亮的外观和柔软、弹性的口感著称。"
},

"roti-jala": {
    bm: "Roti Jala adalah hidangan seperti pancake Melayu yang dibuat daripada adunan tepung, telur, dan santan. Ia dimasak di atas kuali rata dalam bentuk jaring unik yang menyerupai corak renda. Hidangan ini sering disajikan dengan kari pekat seperti kari ayam atau dal.",
    bc: "网状面包是用面粉、鸡蛋和椰浆混合而成的马来煎饼。它在平底锅上以独特的网状形状烹制，像蕾丝花纹。通常与浓郁的咖喱，如鸡肉咖喱或黄豆咖喱一起食用。"
},

  "vada": {
    bm: "Vadai adalah snek popular India yang dibuat daripada lentil atau kacang kuda yang dikisar menjadi pes, dibentuk seperti donat, dan digoreng hingga keemasan dan rangup. Ia biasanya disajikan dengan chutney kelapa atau sambar (sup lentil).",
    bc: "瓦达是一道流行的印度小吃，由扁豆或鹰嘴豆磨成糊状，做成类似甜甜圈的形状，深炸至金黄酥脆。通常搭配椰子酸辣酱或黄豆汤（sambar）一起食用。"
  },
  "murtabak": {
    bm: "Murtabak adalah pancake gurih yang diisi dengan daging cincang, biasanya daging lembu atau ayam, dan kadang-kadang telur serta bawang. Ia digoreng hingga rangup dan biasanya disajikan bersama sos kari.",
    bc: "印度馅料煎饼是一种咸味煎饼，里面填充有绞肉，通常是牛肉或鸡肉，有时还会加入鸡蛋和洋葱。它被煎至外脆内软，通常搭配咖喱酱一起食用。"
  },
  "teh-tarik": {
    bm: "Teh Tarik adalah teh India Malaysia yang popular, diseduh dengan teh hitam yang kuat dan susu pekat manis, kemudian “ditarik” untuk menghasilkan tekstur berbuih. Ia sering disajikan di kedai-kedai tempatan dan dinikmati sepanjang hari.",
    bc: "拉茶是一道流行的马来西亚印度茶，由浓黑茶和甜炼乳泡制而成，然后通过“拉茶”工艺使其产生泡沫。它常常在当地餐馆供应，全天都可以享用。"
  },
  "banana-leaf-rice": {
    bm: "Nasi Daun Pisang adalah hidangan tradisional India Selatan di mana nasi dan pelbagai kari, acar, dan sayur-sayuran disajikan di atas daun pisang. Ia biasanya dimakan dengan tangan, membolehkan rasa bercampur bersama.",
    bc: "蕉叶饭是传统的南印度菜肴，将米饭、各类咖喱、泡菜和蔬菜放在香蕉叶上食用。通常用手吃，这样不同的味道可以融合在一起。"
  },
  "pani-puri": {
    bm: "Pani Puri adalah snek jalanan yang popular, terdiri daripada puri yang rangup dan berongga yang diisi dengan air pedas dan masam (pani), bersama kentang, kacang kuda, dan chutney tamarind. Ia adalah hidangan popular di India dan Malaysia.",
    bc: "巴尼布里是一道流行的街头小吃，由脆皮空心的 puri 填充有辛辣又酸的水（pani），以及土豆、鹰嘴豆和罗望子酸辣酱。它是印度和马来西亚都非常喜爱的街头小吃。"
  },
  "chapati": {
    bm: "Chapati adalah roti pipih yang tidak beragi, diperbuat daripada tepung gandum penuh. Ia lembut, bulat, dan nipis, dan biasanya disajikan sebagai pelengkap kepada kari atau hidangan sayur dalam masakan India.",
    bc: "洽帕提是一种不发酵的平面饼，由全麦面粉制成。它柔软、圆形且薄，通常作为印度餐中咖喱或蔬菜菜肴的配菜。"
  },
  "samosa": {
    bm: "Samosa adalah pastri yang digoreng, diisi dengan kentang berempah, kacang pea, atau daging seperti ayam atau kambing. Ia biasanya disajikan dengan chutney dan merupakan snek atau pembuka selera yang popular di kedai-kedai India.",
    bc: "萨莫萨是一种油炸点心，里面填充有调味土豆、豌豆或鸡肉、羊肉等肉类。它通常搭配酸辣酱食用，是印度餐馆中非常流行的开胃小吃。"
  },
  "idli": {
    bm: "Idli adalah kek nasi kukus yang dibuat daripada beras yang diperam dan urad dal (lentil hitam). Ia biasanya disajikan dengan sambar (kari lentil) dan chutney kelapa, menjadikannya hidangan sarapan yang ringan dan berkhasiat yang popular di India Selatan dan Malaysia.",
    bc: "蒸米浆糕是由发酵的米和黑豆（urad dal）蒸制而成的米糕。它通常与黄豆咖喱（sambar）和椰子酸辣酱一起食用，是一道在南印度和马来西亚非常受欢迎的轻盈且营养的早餐。"
  },
  "kothu-roti": {
    bm: "Kothu Roti adalah hidangan jalanan popular yang dibuat dengan memotong roti canai dan menggorengnya dengan kari, sayur-sayuran, dan kadang-kadang daging seperti ayam atau daging lembu. Ia adalah hidangan pedas yang nikmat, dinikmati sebagai hidangan berat atau snek lewat malam.",
    bc: "碎面饼是一道流行的街头小吃，将煎饼切碎并与咖喱、蔬菜，有时还会加入鸡肉或牛肉一起炒制。它是一个美味的辛辣菜肴，常作为丰富的主餐或宵夜食用。"
  },
  "dosa": {
    bm: "Dosa adalah pancake nipis dan rangup yang dibuat daripada adunan beras dan lentil yang diperam. Ia biasanya disajikan dengan sambar (kari lentil) dan chutney kelapa, dan merupakan hidangan sarapan popular di rumah-rumah India.",
    bc: "印度薄饼是一种由发酵的米和豆类面糊制成的薄煎饼。它通常与黄豆咖喱（sambar）和椰子酸辣酱一起食用，是印度家庭非常流行的早餐菜肴。"
  },
  "tuhau": {
    bm: "Tuhau adalah hidangan tradisional Kadazandusun yang dibuat daripada tumbuhan halia liar, sering dicampur dengan cili, limau, dan rempah tempatan yang lain. Ia biasanya dimakan sebagai hidangan sampingan atau salad dalam masakan Kadazandusun.",
    bc: "Tuhau 是一道传统的Kadazandusun菜肴，由野生姜植物制成，通常与辣椒、柠檬和其他本地香料混合。它常作为Kadazandusun菜肴中的配菜或沙拉食用。"
},

"ambuyat": {
    bm: "Ambuyat adalah hidangan melekit yang diperbuat daripada pokok sagu. Ia dimakan dengan sos khas yang dibuat daripada buah masam, dan sering disajikan bersama daging atau sayur-sayuran. Ia adalah makanan utama dalam kalangan masyarakat Iban dan Brunei.",
    bc: "Ambuyat 是由木薯树制成的粘稠淀粉食品。它与由酸果制成的特制酱料一起食用，通常搭配肉类或蔬菜。它是Iban和文莱人民的主食。"
},

"hinava": {
    bm: "Hinava adalah hidangan Kadazandusun yang dibuat daripada ikan mentah yang diperap dalam jus limau, cili, dan bawang kecil yang dihiris. Ia mirip dengan ceviche dan sering disajikan sebagai pembuka selera atau hidangan sampingan.",
    bc: "Hinava 是一道Kadazandusun菜肴，由腌制的生鱼、酸橙汁、辣椒和切片的红葱制成。它类似于腌鱼沙拉，通常作为开胃菜或配菜食用。"
},

"kacang-pool": {
    bm: "Kacang Pool adalah hidangan jalanan yang popular di Johor, berasal dari komuniti Arab. Ia terdiri daripada kacang fava yang dimasak dengan rempah dan disajikan bersama roti, sering ditambah dengan telur.",
    bc: "Kacang Pool 是一道流行于柔佛的街头小吃，起源于阿拉伯社区。它由煮熟的蚕豆和香料制成，常与面包一起食用，通常上面加一个鸡蛋。"
},

"cincaluk": {
    bm: "Cincaluk adalah hidangan tradisional Melaka yang dibuat daripada udang yang diperam. Ia biasanya dimakan dengan nasi dan kadang-kadang disajikan dengan cili dan limau untuk rasa tambahan.",
    bc: "Cincaluk 是一道传统的马六甲菜肴，由发酵的虾制成。它通常与米饭一起食用，有时配上辣椒和柠檬以增加风味。"
},

'pinasakan': {
             bm: 'Pinasakan adalah hidangan tradisional Kadazandusun yang dibuat daripada ikan yang dimasak dengan rempah, asam, dan bahan-bahan seperti daun ubi. Ia disajikan dengan nasi dan sering dimakan sebagai hidangan utama.',
            bc: 'Pinasakan 是一道传统的Kadazandusun菜肴，由鱼与香料、酸味食材和如木薯叶等配料一起烹煮。它通常与米饭一起食用，常作为主菜。'
        },

"tinumis": {
    bm: "Tinumis adalah hidangan manisan Kadazandusun yang diperbuat daripada ubi kayu atau pisang yang dikukus bersama gula dan santan. Ia biasanya dimakan sebagai pencuci mulut atau snek ringan.",
    bc: "Tinumis 是一道Kadazandusun甜点，由木薯或香蕉与糖和椰浆蒸制而成。它通常作为甜点或小吃食用。"
},

"nasi-kuning": {
    bm: "Nasi Kuning adalah hidangan nasi wangi yang biasanya disajikan pada majlis perayaan dan festival dalam kalangan masyarakat Bugis. Nasi ini dimasak dengan kunyit, memberikan warna kuning yang cerah, dan biasanya disajikan dengan pelbagai hidangan sampingan seperti ayam goreng atau telur rebus.",
    bc: "Nasi Kuning 是一种芬芳的米饭菜肴，通常在Bugis社区的庆祝活动和节日中食用。米饭用姜黄煮制，呈现鲜艳的黄色，通常搭配多种配菜，如炸鸡或煮蛋。"
},

"tapioca-cake": {
    bm: "Kuih Ubi Kayu adalah pencuci mulut tradisional yang dibuat daripada ubi kayu yang diparut dan santan, sering disajikan dengan sirap gula perang. Ia adalah hidangan popular dalam kalangan masyarakat Temuan, sebuah komuniti orang asli di Malaysia.",
    bc: "木薯糕是传统的甜点，由木薯和椰浆制成，通常配上红糖浆。它是马来西亚Temuan人（一个原住民社区）中非常受欢迎的菜肴。"
},

"sago-gula-melaka": {
    bm: "Sago Gula Melaka adalah pencuci mulut tradisional dari Sarawak yang dibuat daripada mutiara sago, disajikan dengan sirap gula nipah (Gula Melaka) dan santan. Ia adalah hidangan manis yang menyegarkan dan sering dinikmati dalam kalangan masyarakat Melanau.",
    bc: "Sago Gula Melaka 是来自沙捞越的传统甜点，由木薯珍珠制成，搭配棕糖浆（Gula Melaka）和椰浆。它是一个清爽甜美的点心，常在Melanau社区中享用。"
}


};
 
 

// Function to toggle translation visibility
function toggleTranslation(foodId) {
    const translationDiv = document.getElementById(`translation-${foodId}`);
    const translateLink = document.querySelector(`[data-food-id="${foodId}"]`);
    
    if (translationDiv.style.display === 'none' || translationDiv.style.display === '') {
        // Show translation
        translationDiv.style.display = 'block';
        translateLink.textContent = '[Hide Translation]';
        
        // Load translation content if not already loaded
        if (!translationDiv.innerHTML.trim()) {
            loadTranslation(foodId);
        }
    } else {
        // Hide translation
        translationDiv.style.display = 'none';
        translateLink.textContent = '[Translate]';
    }
}

// Function to load translation content
function loadTranslation(foodId) {
    const translationDiv = document.getElementById(`translation-${foodId}`);
    const translation = translations[foodId];
    
    if (translation) {
        translationDiv.innerHTML = `
            <div class="translation-content">
                <div class="translation-section">
                    <h4>Bahasa Malaysia:</h4>
                    <p>${translation.bm}</p>
                </div>
                <div class="translation-section">
                    <h4>中文 (Chinese):</h4>
                    <p>${translation.bc}</p>
                </div>
            </div>
        `;
    } else {
        translationDiv.innerHTML = `
            <div class="translation-content">
                <p><em>Translation not available for this item.</em></p>
            </div>
        `;
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,           // Scroll to the top
        behavior: 'smooth' // Smooth scroll
    });
}

// Initialize all carousels when the page loads
window.onload = function() {
    applyFontSize(); // Apply saved font size
    
    // Initialize all carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel, index) => {
        let carouselId;
        if (carousel.id) {
            carouselId = carousel.id;
        } else {
            carouselId = index === 0 ? 'default' : `carousel-${index}`;
        }
        
        carouselIndices[carouselId] = 0;
        updateDots(carouselId);
    });
};

/*full screen image*/
let currentFullscreenCarousel = null;
let currentFullscreenIndex = 0;
let fullscreenImages = [];

function openFullscreen(carouselId, imageIndex) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-image');
    
    currentFullscreenCarousel = carouselId;
    currentFullscreenIndex = imageIndex;
    fullscreenImages = Array.from(images);
    
    const fullscreenImg = document.getElementById('fullscreenImage');
    const modal = document.getElementById('fullscreenModal');
    
    fullscreenImg.src = images[imageIndex].src;
    fullscreenImg.alt = images[imageIndex].alt;
    
    updateImageCounter();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';  
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';  
    
    currentFullscreenCarousel = null;
    currentFullscreenIndex = 0;
    fullscreenImages = [];
}

function navigateFullscreen(direction) {
    if (!currentFullscreenCarousel || !fullscreenImages.length) return;
    
    currentFullscreenIndex += direction;
    
    if (currentFullscreenIndex >= fullscreenImages.length) {
        currentFullscreenIndex = 0;
    } else if (currentFullscreenIndex < 0) {
        currentFullscreenIndex = fullscreenImages.length - 1;
    }
    
    const fullscreenImg = document.getElementById('fullscreenImage');
    fullscreenImg.src = fullscreenImages[currentFullscreenIndex].src;
    fullscreenImg.alt = fullscreenImages[currentFullscreenIndex].alt;
    
    updateImageCounter();
    
    carouselIndices[currentFullscreenCarousel] = currentFullscreenIndex;
    const carousel = document.getElementById(currentFullscreenCarousel);
    const newTranslateX = -currentFullscreenIndex * 100;
    carousel.style.transform = `translateX(${newTranslateX}%)`;
    updateDots(currentFullscreenCarousel);
      
}

function updateImageCounter() {
    const counter = document.getElementById('imageCounter');
   
}

document.addEventListener('keydown', function(event) {
    if (document.getElementById('fullscreenModal').style.display === 'block') {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                navigateFullscreen(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                navigateFullscreen(1);
                break;
            case 'Escape':
                event.preventDefault();
                closeFullscreen();
                break;
        }
    }
});

document.getElementById('fullscreenModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeFullscreen();
    }
});

 
