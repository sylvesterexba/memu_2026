const {
    defaultData,
    getLocalData,
    saveLocalData,
    getDataFromApi,
    saveDataToApi,
    uploadPhotoToApi,
    fileToCompressedDataUrl
} = ResumeApp;

const fields = {
    summary: document.querySelector("#summary"),
    photoCaption: document.querySelector("#photoCaption"),
    name: document.querySelector("#name"),
    gender: document.querySelector("#gender"),
    birthday: document.querySelector("#birthday"),
    address: document.querySelector("#address"),
    phone: document.querySelector("#phone"),
    facebook: document.querySelector("#facebook"),
    line: document.querySelector("#line"),
    performanceSub: document.querySelector("#performanceSub"),
    judge: document.querySelector("#judge")
};

const listEditors = {
    photoItems: document.querySelector("#photoItems"),
    careerItems: document.querySelector("#careerItems"),
    performanceItems: document.querySelector("#performanceItems"),
    artistItems: document.querySelector("#artistItems"),
    awardsItems: document.querySelector("#awardsItems"),
    musicRoomItems: document.querySelector("#musicRoomItems"),
    clubItems: document.querySelector("#clubItems")
};

let activeDrag = null;

function setStatus(message) {
    const status = document.querySelector("#statusText");
    status.textContent = message;
    window.setTimeout(() => {
        status.textContent = "";
    }, 2600);
}

function updateOrderButtons(editor) {
    const rows = Array.from(editor.children);
    rows.forEach((row, index) => {
        const upButton = row.querySelector("[data-move='up']");
        const downButton = row.querySelector("[data-move='down']");
        if (upButton) {
            upButton.disabled = index === 0;
        }
        if (downButton) {
            downButton.disabled = index === rows.length - 1;
        }
    });
}

function getDragAfterElement(container, y) {
    const rows = [...container.querySelectorAll(".sortable-row:not(.dragging)")];
    return rows.reduce((closest, row) => {
        const box = row.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: row };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

function moveDraggedRow(clientY) {
    if (!activeDrag) {
        return;
    }

    const { row, editor } = activeDrag;
    const afterElement = getDragAfterElement(editor, clientY);
    if (afterElement) {
        editor.insertBefore(row, afterElement);
    } else {
        editor.appendChild(row);
    }
    updateOrderButtons(editor);
}

function finishDrag() {
    if (!activeDrag) {
        return;
    }

    const { row, editor, handle, pointerId } = activeDrag;
    row.classList.remove("dragging");
    handle.releasePointerCapture?.(pointerId);
    updateOrderButtons(editor);
    activeDrag = null;
}

function moveRow(row, direction) {
    if (direction < 0 && row.previousElementSibling) {
        row.parentElement.insertBefore(row, row.previousElementSibling);
        row.querySelector("input, button")?.focus();
    }

    if (direction > 0 && row.nextElementSibling) {
        row.parentElement.insertBefore(row.nextElementSibling, row);
        row.querySelector("input, button")?.focus();
    }

    updateOrderButtons(row.parentElement);
}

function createDragHandle(row) {
    const handle = document.createElement("button");
    handle.className = "drag-handle";
    handle.type = "button";
    handle.textContent = "拖拉";
    handle.title = "按住拖拉調整順序";
    handle.setAttribute("aria-label", "拖拉調整順序");

    handle.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) {
            return;
        }

        event.preventDefault();
        activeDrag = {
            row,
            editor: row.parentElement,
            handle,
            pointerId: event.pointerId
        };
        row.classList.add("dragging");
        handle.setPointerCapture?.(event.pointerId);
    });

    handle.addEventListener("pointermove", (event) => {
        if (!activeDrag || activeDrag.handle !== handle) {
            return;
        }

        event.preventDefault();
        moveDraggedRow(event.clientY);
    });

    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);

    return handle;
}

function createRowControls(row) {
    const controls = document.createElement("div");
    controls.className = "row-controls";

    const upButton = document.createElement("button");
    upButton.className = "button small";
    upButton.type = "button";
    upButton.textContent = "上移";
    upButton.dataset.move = "up";
    upButton.addEventListener("click", () => moveRow(row, -1));

    const downButton = document.createElement("button");
    downButton.className = "button small";
    downButton.type = "button";
    downButton.textContent = "下移";
    downButton.dataset.move = "down";
    downButton.addEventListener("click", () => moveRow(row, 1));

    const removeButton = document.createElement("button");
    removeButton.className = "button danger small";
    removeButton.type = "button";
    removeButton.textContent = "刪除";
    removeButton.addEventListener("click", () => {
        const editor = row.parentElement;
        row.remove();
        updateOrderButtons(editor);
    });

    controls.append(upButton, downButton, removeButton);
    return controls;
}

function createItemRow(value = "") {
    const row = document.createElement("div");
    row.className = "item-row sortable-row";

    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.placeholder = "請輸入一筆內容";

    row.append(createDragHandle(row), input, createRowControls(row));
    return row;
}

function createPhotoRow(value = "", name = "") {
    const row = document.createElement("div");
    row.className = "photo-row sortable-row";
    row.dataset.photoValue = value;

    const preview = document.createElement("img");
    preview.className = "photo-preview";
    preview.src = value;
    preview.alt = name || "照片預覽";

    const label = document.createElement("div");
    label.className = "photo-name";
    label.textContent = name || (value.startsWith("data:image/") ? "本機暫存照片" : value);

    row.append(createDragHandle(row), preview, label, createRowControls(row));
    return row;
}

function fillListEditor(editorId, items) {
    const editor = listEditors[editorId];
    editor.textContent = "";
    const values = Array.isArray(items) && items.length ? items : [""];
    values.forEach((item) => {
        editor.appendChild(createItemRow(item));
    });
    updateOrderButtons(editor);
}

function collectListEditor(editorId) {
    return Array.from(listEditors[editorId].querySelectorAll("input"))
        .map((input) => input.value.trim())
        .filter(Boolean);
}

function fillPhotoEditor(items) {
    const editor = listEditors.photoItems;
    editor.textContent = "";
    const values = Array.isArray(items) && items.length ? items : ["IMG_5952.JPG"];
    values.filter(Boolean).forEach((item) => {
        editor.appendChild(createPhotoRow(item));
    });
    updateOrderButtons(editor);
}

function collectPhotoEditor() {
    return Array.from(listEditors.photoItems.querySelectorAll(".photo-row"))
        .map((row) => row.dataset.photoValue)
        .filter(Boolean);
}

function fillForm(data) {
    fields.summary.value = data.summary;
    fillPhotoEditor(data.photos);
    fields.photoCaption.value = data.photoCaption;
    fields.name.value = data.profile.name;
    fields.gender.value = data.profile.gender;
    fields.birthday.value = data.profile.birthday;
    fields.address.value = data.profile.address;
    fields.phone.value = data.profile.phone;
    fields.facebook.value = data.profile.facebook;
    fields.line.value = data.profile.line;
    fillListEditor("careerItems", data.career);
    fillListEditor("performanceItems", data.performance.performances);
    fields.performanceSub.value = data.performance.sub;
    fillListEditor("artistItems", data.performance.artistList);
    fillListEditor("awardsItems", data.performance.awards);
    fields.judge.value = data.performance.judge;
    fillListEditor("musicRoomItems", data.teaching.musicRooms);
    fillListEditor("clubItems", data.teaching.clubs);
}

function collectForm() {
    const performances = collectListEditor("performanceItems");
    const artists = collectListEditor("artistItems");
    const photos = collectPhotoEditor();

    return {
        summary: fields.summary.value.trim(),
        photo: photos[0] || "",
        photos,
        photoCaption: fields.photoCaption.value.trim(),
        profile: {
            name: fields.name.value.trim(),
            gender: fields.gender.value.trim(),
            birthday: fields.birthday.value.trim(),
            address: fields.address.value.trim(),
            phone: fields.phone.value.trim(),
            facebook: fields.facebook.value.trim(),
            line: fields.line.value.trim()
        },
        career: collectListEditor("careerItems"),
        performance: {
            main: performances[0] || "",
            performances,
            sub: fields.performanceSub.value.trim(),
            artists: artists.join("、"),
            artistList: artists,
            awards: collectListEditor("awardsItems"),
            judge: fields.judge.value.trim()
        },
        teaching: {
            musicRooms: collectListEditor("musicRoomItems"),
            clubs: collectListEditor("clubItems")
        }
    };
}

async function loadFormData() {
    try {
        const data = await getDataFromApi();
        saveLocalData(data);
        fillForm(data);
        setStatus("已從 MySQL 載入");
    } catch (error) {
        fillForm(getLocalData());
        setStatus("API 無法使用，已改用本機資料");
    }
}

document.querySelector("#saveButton").addEventListener("click", async () => {
    const data = collectForm();
    saveLocalData(data);

    try {
        await saveDataToApi(data);
        setStatus("已儲存到 MySQL 與本機");
    } catch (error) {
        setStatus("已儲存到本機；API 尚未連線");
    }
});

document.querySelector("#loadButton").addEventListener("click", async () => {
    await loadFormData();
});

document.querySelector("#resetButton").addEventListener("click", () => {
    localStorage.removeItem(ResumeApp.storageKey);
    fillForm(defaultData);
    saveLocalData(defaultData);
    setStatus("已恢復預設資料");
});

document.querySelectorAll("[data-add-list]").forEach((button) => {
    button.addEventListener("click", () => {
        const editorId = button.dataset.addList;
        const editor = listEditors[editorId];
        editor.appendChild(createItemRow());
        updateOrderButtons(editor);
        editor.lastElementChild.querySelector("input").focus();
    });
});

document.querySelector("#choosePhotoButton").addEventListener("click", () => {
    document.querySelector("#photoFileInput").click();
});

document.querySelector("#photoFileInput").addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
        return;
    }

    setStatus("正在加入照片...");
    for (const file of files) {
        try {
            const uploaded = await uploadPhotoToApi(file);
            listEditors.photoItems.appendChild(createPhotoRow(uploaded.url, uploaded.name));
        } catch (error) {
            const dataUrl = await fileToCompressedDataUrl(file);
            listEditors.photoItems.appendChild(createPhotoRow(dataUrl, file.name));
        }
    }
    updateOrderButtons(listEditors.photoItems);
    event.target.value = "";
    setStatus("照片已加入，記得儲存內容");
});

document.addEventListener("pointerup", finishDrag);
document.addEventListener("pointercancel", finishDrag);

loadFormData();
