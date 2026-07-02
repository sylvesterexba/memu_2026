const ResumeApp = (() => {
    const storageKey = "memuResumeData";

    // API 或 LocalStorage 沒有資料時使用的完整預設資料結構。
    const defaultData = {
        contentVersion: 5,
        summary: "不限年齡與程度，提供貝斯、吉他、爵士鼓、烏克麗麗、木箱鼓與樂團指導。依照你的目標與練習時間安排進度，從零基礎入門、技巧提升到舞台演出，都能找到適合自己的學習方式。",
        photo: "IMG_5952.JPG",
        photos: ["IMG_5952.JPG"],
        photoCaption: "陳聖典老師｜樂器教學與樂團指導",
        profile: {
            name: "陳 聖 典",
            gender: "",
            birthday: "",
            address: "雙北",
            phone: "0982569510",
            facebook: "陳 聖 典",
            line: "Sylvesterex"
        },
        career: [
            "MileStone 樂團 貝斯手",
            "民生社區管樂團 貝斯手",
            "絲竹空青年團 貝斯手",
            "拉丁信差樂團 貝斯手",
            "天火客樂團 貝斯手",
            "斯卡變異體樂團 貝斯手",
            "輕日記樂團 貝斯手",
            "五股教會豐盛堂 鼓手",
            "磐石現代樂團 貝斯手",
            "八角塔男聲合唱團 第二男高音",
            "聖約翰科技大學 Dream 音樂創作研究社 創辦人",
            "國防大學 音控講師",
            "雅痞書店 音控",
            "Clash New Taipei 音控",
            "Oldie Goodie Live Music House 音控"
        ],
        performance: {
            main: "天作之合劇場《寂寞瑪奇朵》音樂劇樂手",
            performances: [
                "天作之合劇場《寂寞瑪奇朵》音樂劇樂手",
                "躍演《勸世三姊妹》中文音樂劇 樂手"
            ],
            sub: "曾於國家音樂廳、河岸留言等知名 Live House 與音樂場館演出，累積劇場、樂團、流行音樂與現場支援經驗。",
            artists: "紀文惠、古皓、簡愛、李玖哲、倪子鈞、辛龍、吳海文、倪安東、陳品伶、盧學叡、吳蓓雅、連燕秋、林芯儀、馬蹄楊、正皓玄、黃宣、楊奇煜、搖滾東方、Cozy Diary、教練、施少庸、小護士、Whiskey River",
            artistList: [
                "黃宣",
                "紀文惠",
                "古皓",
                "簡愛",
                "李玖哲",
                "倪子鈞",
                "辛龍",
                "吳海文",
                "倪安東",
                "陳品伶",
                "盧學叡",
                "吳蓓雅",
                "連燕秋",
                "林芯儀",
                "馬蹄楊",
                "正皓玄",
                "楊奇煜",
                "搖滾東方",
                "Cozy Diary",
                "教練",
                "施少庸",
                "小護士",
                "Whiskey River"
            ],
            awards: [
                "第十八屆 YAMAHA 熱音大賽北區地區賽 冠軍",
                "第十八屆 YAMAHA 熱音大賽全國總決賽 未來之星獎",
                "第一屆捷運盃熱音大賽優選樂團"
            ],
            judge: "各大專院校等多項歌唱比賽評審"
        },
        teaching: {
            musicRooms: [
                "台北「阿通伯樂器」貝斯教師",
                "台北「玩家樂器」貝斯教師",
                "萬華「拍譜音樂」貝斯教師",
                "永和「久大樂器行」貝斯、吉他教師",
                "中和「米蘭樂器」貝斯、吉他教師",
                "板橋「米蘭樂器」貝斯、吉他、爵士鼓教師",
                "石牌「上宜樂器」貝斯、吉他教師",
                "淡水「蓉蓉音樂天地」貝斯、吉他教師",
                "八里「玩音樂」貝斯教師",
                "永和「小布音樂」吉他教師",
                "淡水「鉉籈行」貝斯、吉他、爵士鼓、烏克麗麗、木箱鼓教師",
                "新莊「音樂家」貝斯、吉他、爵士鼓、烏克麗麗、木箱鼓教師",
                "台北「皇家音樂」貝斯、吉他、爵士鼓、烏克麗麗、木箱鼓教師",
                "台北「賦格音樂」貝斯、吉他、烏克麗麗教師"
            ],
            clubs: [
                "台北「公館國小」烏克麗麗教師",
                "新莊「新莊高中」爵士鼓教師",
                "台北「中山社大」烏克麗麗教師",
                "木柵「明道國小」爵士鼓教師",
                "三重「碧華國小」烏克麗麗教師",
                "天母「蘭雅教會」爵士鼓教師",
                "三重「永福國小」烏克麗麗教師",
                "宜蘭「碧候教會」樂團教師",
                "南投「紅香教會」樂團教師",
                "新竹「泰崗教會」樂團教師",
                "台中「哈崙台教會」樂團教師",
                "士林「士林承恩堂」樂團教師",
                "永和「永和福和堂」樂團教師"
            ]
        }
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function mergeDeep(base, override) {
        const result = clone(base);
        if (!override || typeof override !== "object") {
            return result;
        }

        Object.keys(override).forEach((key) => {
            const value = override[key];
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                result[key] &&
                typeof result[key] === "object" &&
                !Array.isArray(result[key])
            ) {
                result[key] = mergeDeep(result[key], value);
            } else {
                result[key] = value;
            }
        });

        return result;
    }

    function normalizeData(data) {
        const source = data && typeof data === "object" ? clone(data) : {};

        // 逐版補齊舊資料，避免已儲存的後台內容因欄位新增而壞掉。
        if ((source.contentVersion || 1) < 2) {
            source.performance = source.performance || {};
            source.performance.performances = Array.isArray(source.performance.performances)
                ? source.performance.performances
                : [];
            if (!source.performance.performances.length && source.performance.main) {
                source.performance.performances.push(source.performance.main);
            }
            const newPerformance = "躍演《勸世三姊妹》中文音樂劇 樂手";
            if (!source.performance.performances.includes(newPerformance)) {
                source.performance.performances.push(newPerformance);
            }
            source.contentVersion = 2;
        }

        if ((source.contentVersion || 1) < 3) {
            const artistList = source.performance?.artistList;
            if (Array.isArray(artistList) && artistList.includes("黃宣")) {
                source.performance.artistList = [
                    "黃宣",
                    ...artistList.filter((artist) => artist !== "黃宣")
                ];
            }
            source.contentVersion = 3;
        }

        if ((source.contentVersion || 1) < 4) {
            const soundEngineeringExperience = [
                "雅痞書店 音控",
                "Clash New Taipei 音控",
                "Oldie Goodie Live Music House 音控"
            ];
            const existingCareer = Array.isArray(source.career) ? source.career : [];
            source.career = [
                ...existingCareer.filter((item) => !soundEngineeringExperience.includes(item)),
                ...soundEngineeringExperience
            ];
            source.contentVersion = 4;
        }

        if ((source.contentVersion || 1) < 5) {
            const soundEngineeringExperience = [
                "雅痞書店 音控",
                "Clash New Taipei 音控",
                "Oldie Goodie Live Music House 音控"
            ];
            const existingCareer = Array.isArray(source.career) ? source.career : [];
            source.career = [
                ...existingCareer.filter((item) => !soundEngineeringExperience.includes(item)),
                ...soundEngineeringExperience
            ];
            source.contentVersion = 5;
        }

        // 最後再與預設資料合併，確保前台渲染需要的巢狀欄位都存在。
        const normalized = mergeDeep(defaultData, source);
        normalized.photos = normalized.photos?.length ? normalized.photos : [normalized.photo].filter(Boolean);
        normalized.performance.performances = normalized.performance.performances?.length
            ? normalized.performance.performances
            : [normalized.performance.main].filter(Boolean);
        normalized.performance.artistList = normalized.performance.artistList?.length
            ? normalized.performance.artistList
            : normalized.performance.artists.split(/[、,，]/).map((item) => item.trim()).filter(Boolean);
        return normalized;
    }

    function getLocalData() {
        // 先讀本機快取，讓前台在 API 尚未回應或失敗時仍可顯示內容。
        const saved = localStorage.getItem(storageKey);
        if (!saved) {
            return clone(defaultData);
        }

        try {
            return normalizeData(JSON.parse(saved));
        } catch (error) {
            return clone(defaultData);
        }
    }

    function saveLocalData(data) {
        localStorage.setItem(storageKey, JSON.stringify(normalizeData(data)));
    }

    function canUseApi() {
        // GitHub Pages 與直接開檔不支援 PHP API，直接交給既有 fallback 處理。
        return location.protocol !== "file:" && !location.hostname.endsWith("github.io");
    }

    async function getDataFromApi() {
        // API 回傳後仍走 normalizeData，讓 MySQL 內的舊 JSON 自動升級。
        if (!canUseApi()) {
            throw new Error("目前環境不支援 API");
        }

        const response = await fetch("api/resume.php", {
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("API 載入資料失敗");
        }

        const payload = await response.json();
        if (!payload.ok || !payload.data) {
            throw new Error("API 回傳格式不正確");
        }

        return normalizeData(payload.data);
    }

    async function saveDataToApi(data) {
        // 後台送出前先正規化，讓 LocalStorage 與 MySQL 保存相同資料形狀。
        if (!canUseApi()) {
            throw new Error("目前環境不支援 API");
        }

        const response = await fetch("api/resume.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(normalizeData(data))
        });
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
            throw new Error(payload.message || "儲存失敗");
        }
    }

    async function uploadPhotoToApi(file) {
        if (!canUseApi()) {
            throw new Error("目前環境不支援 API");
        }

        const formData = new FormData();
        formData.append("photo", file);

        const response = await fetch("api/upload_photo.php", {
            method: "POST",
            body: formData
        });
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
            throw new Error(payload.message || "照片上傳失敗");
        }

        return payload;
    }

    function fileToCompressedDataUrl(file) {
        // 圖片 API 失敗時使用：壓縮成 Data URL 暫存在本機資料中。
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error("讀取照片失敗"));
            reader.onload = () => {
                const image = new Image();
                image.onerror = () => reject(new Error("照片格式無法讀取"));
                image.onload = () => {
                    const maxSide = 1400;
                    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.round(image.width * scale);
                    canvas.height = Math.round(image.height * scale);

                    const context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.82));
                };
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function setText(selector, value) {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.textContent = value;
        }
    }

    function setLabelValue(selector, label, value) {
        const element = document.querySelector(selector);
        if (!element || value === undefined) {
            return;
        }

        element.textContent = "";
        const strong = document.createElement("strong");
        strong.textContent = label;
        element.append(strong, value);
    }

    return {
        storageKey,
        defaultData,
        normalizeData,
        getLocalData,
        saveLocalData,
        getDataFromApi,
        saveDataToApi,
        uploadPhotoToApi,
        fileToCompressedDataUrl,
        setText,
        setLabelValue
    };
})();

