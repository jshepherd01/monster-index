/* csrf */
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

/* collect references to the various modal objects */
const tagFormModal = new bootstrap.Modal(document.getElementById('tagFormModal'));
const categoryFormModal = new bootstrap.Modal(document.getElementById('categoryFormModal'));
const sourceFormModal = new bootstrap.Modal(document.getElementById('sourceFormModal'));
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

/* copy the global monster information */
const deepCopyInfo = (info)=>{
    return {
        name: info.name,
        xp: info.xp,
        pk: info.pk,
        description: info.description,
        tags: new Set(info.tags),
        source: info.source,
        page: info.page,
    }
}

/* global information about the monster currently being edited */
const info_default = {
    name: null,
    xp: null,
    pk: null,
    description: null,
    tags: new Set(),
    source: null,
    page: null,
}
let information = deepCopyInfo(info_default);
let info_backup = deepCopyInfo(info_default);

/* generate() methods make the modal pop up with some data in it */
tagFormModal.generate = (tagdata) => {
    setValid('tagFormName');
    setValid('tagFormCategory');
    setValid('tagFormInfo');
    document.getElementById('tagFormModalTitle').textContent = tagdata.name ? tagdata.name : "New Tag";
    document.getElementById('tagFormPk').value = tagdata.pk ? tagdata.pk : -1;
    document.getElementById('tagFormName').value = tagdata.name ? tagdata.name : "";
    document.getElementById('tagFormCategory').value = tagdata.catpk ? tagdata.catpk : -1;
    document.getElementById('tagFormInfo').value = tagdata.info ? tagdata.info : "";
    document.getElementById('tagFormDelete').classList[tagdata.pk ? 'remove' : 'add']('hidden');
    tagFormModal.show();
}

categoryFormModal.generate = (categoryData) => {
    setValid('categoryFormName');
    document.getElementById('categoryFormModalTitle').textContent = categoryData.name ? categoryData.name : "New Category";
    document.getElementById('categoryFormPk').value = categoryData.pk ? categoryData.pk : -1;
    document.getElementById('categoryFormName').value = categoryData.name ? categoryData.name : "";
    document.getElementById('categoryFormDelete').classList[categoryData.pk ? 'remove' : 'add']('hidden');
    categoryFormModal.show();
}

sourceFormModal.generate = (sourceData) => {
    setValid('sourceFormName');
    setValid('sourceFormOfficial');
    document.getElementById('sourceFormModalTitle').textContent = sourceData.name ? sourceData.name : "New Source";
    document.getElementById('sourceFormPk').value = sourceData.pk ? sourceData.pk : -1;
    document.getElementById('sourceFormName').value = sourceData.name ? sourceData.name : "";
    document.getElementById('sourceFormOfficial').checked = !!sourceData.official;
    document.getElementById('sourceFormAbbr').value = sourceData.abbr ? sourceData.abbr : "";
    document.getElementById('sourceFormPages').value = (sourceData.pages && sourceData.pages < Infinity) ? sourceData.pages : "";
    document.getElementById('sourceFormPageInf').checked = (sourceData.pages && sourceData.pages === Infinity);
    document.getElementById('sourceFormPages').disabled = (sourceData.pages && sourceData.pages === Infinity);
    document.getElementById('sourceFormDelete').classList[sourceData.pk ? 'remove' : 'add']('hidden');
    sourceFormModal.show();
}

/* general purpose modals */
confirmModal.generate = (msg, cb) => {
    document.getElementById('confirmModalMessage').textContent = msg ? msg : 'Are you sure you want to do that?';
    let cbWrapper = (e)=>{
        e.preventDefault();
        cb(e);
        document.getElementById('confirmModalButton').removeEventListener('click',cbWrapper);
    }
    document.getElementById('confirmModalButton').addEventListener('click',cbWrapper);
    confirmModal.show();
}

errorModal.generate = (msg) => {
    document.getElementById('errorModalMessage').textContent = msg ? msg : 'An unexpected error has occurred.';
    errorModal.show();
}

/* set an input to either valid or invalid until it's changed */
const setValid = (id, valid=true)=>{
    let elem = document.getElementById(id);
    elem.classList[valid ? 'remove' : 'add']('is-invalid');
    elem[valid ? 'removeEventListener' : 'addEventListener']('change',()=>setValid(id,!valid));
}

/* activate all the tooltips on the page, needs to run each time they're re-added to the DOM */
const resetTooltips = ()=>{
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/* add or remove a tag from the global monster */
const btnChooseTagHandle = (e) => {
    let tagpk = e.currentTarget.getAttribute('data-tag');
    if (e.currentTarget.checked) {
        information.tags.add(tagpk);
    } else {
        information.tags.delete(tagpk);
    }
}

/* create a modal to edit a chosen tag */
const btnEditTagHandle = (e) => {
    let tagpk = e.currentTarget.getAttribute('data-tag');
    let tagname = document.getElementById(`tag-${tagpk}-name`).value;
    let tagcategorypk = document.getElementById(`tag-${tagpk}-categorypk`).value;
    let taginfo = document.getElementById(`tag-${tagpk}-info`).value;
    tagFormModal.generate({
        pk: tagpk,
        name: tagname,
        catpk: tagcategorypk,
        info: taginfo,
    });
}

/* create a modal for adding a new tag in a given category */
const btnAddTagHandle = (e) => {
    let catpk = e.currentTarget.getAttribute('data-cat');
    tagFormModal.generate({ catpk: catpk });
}

/* create a modal for editing a chosen category */
const btnEditCategoryHandle = (e) => {
    let catpk = e.currentTarget.getAttribute('data-cat');
    let catname = document.getElementById(`category-${catpk}-name`).value;
    categoryFormModal.generate({
        pk: catpk,
        name: catname,
    })
}

/* create a modal for making a new category */
const btnAddCategoryHandle = (e) => {
    categoryFormModal.generate({});
}

/* set the values of a variety of input fields, checkboxes, etc. */
/* this is for when the DOM is changed, or for when a monster is selected */
const setPageContent = (info)=>{

    document.getElementById('monsterName').value = info.name ? info.name : "";
    document.getElementById('monsterXP').value = info.xp ? info.xp : "-1";
    document.getElementById('monsterInfo').value = info.description ? info.description : "",

    document.getElementById('sourceChoosePk').value = info.source ? info.source : "-1";
    document.getElementById('sourceChoosePage').value = info.page ? info.page : "";

    document.getElementById('sourceChoosePk').dispatchEvent(new Event('input'));
    document.getElementById('sourceChoosePk').dispatchEvent(new Event('change'));
    document.getElementById('sourceChoosePage').dispatchEvent(new Event('input'));
    document.getElementById('sourceChoosePage').dispatchEvent(new Event('change'));

    for (let btn of document.getElementsByClassName('btn-choose-tag')) {
        btn.checked = false;
        btn.dispatchEvent(new Event('change'));
    }

    information.name = info.name;
    information.pk = info.pk;
    information.xp = info.xp;
    information.description = info.description;
    information.tags = new Set();

    info.tags.forEach((item)=>{
        let checkbox = document.getElementById(`tag-${item}`);
        if (checkbox) {
            document.getElementById(`tag-${item}`).checked = true;
            document.getElementById(`tag-${item}`).dispatchEvent(new Event('change'));
        }
    });

    for (let elem of document.getElementsByClassName('edit-only')) {
        elem.classList[information.pk ? 'remove' : 'add']('hidden');
    }
}

/* for when some part of the DOM needs to be updated to match the server */
const reRender = (idlist, cb=null)=>{
    if (idlist.length == 0) return;
    let id = idlist.shift();
    fetch(document.getElementById(id).getAttribute('data-render')).then((res)=>{
        if (res.ok) return res.text();
        throw new Error(`Response was ${res.status}`);
    }).then((data)=>{
        document.getElementById(id).innerHTML = data;
        resetTooltips();
        if (idlist.length > 0) {
            reRender(idlist);
        } else {
            window.requestAnimationFrame(()=>{
                setPageContent(deepCopyInfo(information));
                if (cb) cb();
            })
        }
    }).catch((err)=>{
        console.error(err);
        errorModal.generate(err.message);
    })
}

/* send a POST request to update something on the server */
const makeRequestSimple = (url, data, modalTrigger, renderList, cb=null) => {
    fetch(url, {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        body: data,
    }).then((res)=>{
        if (!res.ok) {
            throw new Error(`Response was ${res.status}`);
        }
        reRender(renderList, cb);
        if (modalTrigger) modalTrigger.hide();
    }).catch((err)=>{
        console.error(err);
        errorModal.generate(err.message);
        if (modalTrigger) modalTrigger.hide();
    });
}

/* edit/add a tag using the modal */
const tagFormSubmitHandle = (e) => {
    e.preventDefault();

    let data = new URLSearchParams();

    let pk = document.getElementById('tagFormPk').value;
    let name = document.getElementById('tagFormName').value;
    let catpk = document.getElementById('tagFormCategory').value;
    let info = document.getElementById('tagFormInfo').value;

    let url = (pk >= 0) ? `/tag/${pk}/edit/` : '/tag/add/';
    let valid = true;
    if (!name) {
        setValid('tagFormName',false);
        valid = false;
    }
    if (catpk < 0) {
        setValid('tagFormCategory',false);
        valid = false;
    }
    if (!valid) {
        return false;
    }

    data.append('name',name);
    data.append('catpk',catpk);
    data.append('info',info);

    makeRequestSimple(url,data,tagFormModal,['tagContainer']);
}

/* delete a tag using the modal */
const tagFormDeleteHandle = (e)=>{
    e.preventDefault();

    tagFormModal.hide();

    confirmModal.generate(null, (e)=>{
        let pk = document.getElementById('tagFormPk').value;
        let url = `/tag/${pk}/delete/`;

        information.tags.delete(pk);

        makeRequestSimple(url,null,confirmModal,['tagContainer']);
    });
}

/* deselects every tag */
const deselectAllHandle = (e) => {
    information.tags = new Set();
    setPageContent(deepCopyInfo(information));
}

/* edit/add a category using the modal */
const categoryFormSubmitHandle = (e) => {
    e.preventDefault();

    let data = new URLSearchParams();

    let pk = document.getElementById('categoryFormPk').value;
    let name = document.getElementById('categoryFormName').value;

    let url = (pk >= 0) ? `/category/${pk}/edit/` : '/category/add/';
    let valid = true;
    if (!name) {
        setValid('categoryFormName',false);
        valid = false;
    }

    if (!valid) {
        return false;
    }

    data.append('name',name);

    makeRequestSimple(url,data,categoryFormModal,['tagContainer','tagFormModal']);
}

/* delete a category using the modal */
const categoryFormDeleteHandle = (e) => {
    e.preventDefault();
    
    categoryFormModal.hide();

    confirmModal.generate(null, (e)=>{
        let pk = document.getElementById('categoryFormPk').value;
        let url = `/category/${pk}/delete/`;

        makeRequestSimple(url,null,confirmModal,['tagContainer','tagFormModal']);
    });
}

/* select a source from the list and populate fields for it */
const sourceChoosePkHandle = (e) => {
    e.preventDefault();

    let pk = parseInt(e.currentTarget.value);

    if (pk>=0) {
        let abbr = document.getElementById(`source-${pk}-abbr-name`).value;
        let official = document.getElementById(`source-${pk}-official`).value === 'True';
        let pages = document.getElementById(`source-${pk}-pages`).value;

        document.getElementById('sourceChooseAbbr').textContent = abbr;
        document.getElementById('sourceChooseAbbr').htmlFor = 'sourceChooseEdit';
        document.getElementById('sourceChooseOfficial').textContent = official ? 'Official' : 'Homebrew';
        document.getElementById('sourceChooseEdit').classList.remove('hidden');
        document.getElementById('sourceChoosePk').classList[official ? 'add' : 'remove']('green-outline');
        document.getElementById('sourceChoosePk').classList[!official ? 'add' : 'remove']('red-outline');
        document.getElementById('sourceChoosePage').max = pages;
        document.getElementById('sourceChoosePage').dispatchEvent(new InputEvent('change'));
        information.source = pk;
        information.page = parseInt(document.getElementById('sourceChoosePage').value);
    } else {
        document.getElementById('sourceChooseAbbr').textContent = 'Choose';
        document.getElementById('sourceChooseAbbr').htmlFor = 'sourceChooseNew';
        document.getElementById('sourceChooseOfficial').textContent = 'Full Name';
        document.getElementById('sourceChooseEdit').classList.add('hidden');
        document.getElementById('sourceChoosePk').classList.remove('green-outline');
        document.getElementById('sourceChoosePk').classList.remove('red-outline');
        document.getElementById('sourceChoosePage').max = Infinity;
        information.source = null;
        information.page = parseInt(document.getElementById('sourceChoosePage').value);
    }
}

/* verify that the chosen page is valid */
const sourceChoosePageHandle = (e) => {
    let val = parseInt(e.currentTarget.value);
    let min = parseInt(e.currentTarget.min);
    let max = parseFloat(e.currentTarget.max);
    if (val < min) {
        e.currentTarget.value = min;
    } else if (val > max) {
        e.currentTarget.value = max;
    }
    information.page = parseInt(e.currentTarget.value);
}

/* create a modal for editing a chosen source */
const sourceChooseEditHandle = (e) => {
    let pk = document.getElementById('sourceChoosePk').value;
    let name = document.getElementById(`source-${pk}-name`).value;
    let abbr = document.getElementById(`source-${pk}-abbr-name`).value;
    let official = document.getElementById(`source-${pk}-official`).value === 'True';
    let pages = parseFloat(document.getElementById(`source-${pk}-pages`).value);
    sourceFormModal.generate({
        pk: pk,
        name: name,
        abbr: abbr,
        official: official,
        pages: pages,
    });
}

/* create a modal for adding a new source */
const sourceChooseNewHandle = (e) => {
    sourceFormModal.generate({});
}

/* edit/add a source using the modal */
const sourceFormSubmitHandle = (e) => {
    e.preventDefault();

    let data = new URLSearchParams();

    let pk = document.getElementById('sourceFormPk').value;
    let name = document.getElementById('sourceFormName').value;
    let official = document.getElementById('sourceFormOfficial').checked;
    let abbr = document.getElementById('sourceFormAbbr').value;
    let pages = document.getElementById('sourceFormPages').value;
    let pageInf = document.getElementById('sourceFormPageInf').checked;

    let url = (pk >= 0) ? `/source/${pk}/edit/` : '/source/add/';
    let valid = true;
    if (!name) {
        setValid('sourceFormName', false);
        valid = false;
    }
    if (!abbr) {
        setValid('sourceFormAbbr', false);
        valid = false;
    }
    if (!pages && !pageInf) {
        setValid('sourceFormPages', false);
        valid = false;
    }
    if (!valid) {
        return false;
    }

    data.append('name', name);
    data.append('official', official);
    data.append('abbr', abbr);
    data.append('pages', pageInf ? "NULL" : pages);

    makeRequestSimple(url, data, sourceFormModal, ['sourceContainer']);
}

/* delete a source using the modal */
const sourceFormDeleteHandle = (e) => {
    e.preventDefault();

    sourceFormModal.hide();

    confirmModal.generate(null, (e)=>{
        let pk = document.getElementById('sourceFormPk').value;
        let url = `/source/${pk}/delete/`;
        
        makeRequestSimple(url, null, confirmModal, ['sourceContainer']);
    });
}

/* check if the name given belongs to a monster already, and populate the form if it does */
const monsterNameChoose = (e) => {
    let names = document.getElementById('monsterNameList').children;
    let found = false;
    let editBtn = document.getElementById('editMonster');
    information.name = e.currentTarget.value;
    for (let item of names) {
        if (e.currentTarget.value == item.value) {
            found = true;
            let editBtnHandle = (e) => {
                let pk = item.getAttribute('data-pk');
                let url = `/monster/${pk}/`;
                fetch(url, {method: 'GET'}).then((res) => {
                    if (!res.ok) {
                        throw new Error(`Response was ${res.status}`);
                    }
                    return res.json();
                }).then((data) => {
                    let newinfo = {};
                    newinfo.name = data['name'];
                    newinfo.description = data['info'];
                    newinfo.page = data['page'];
                    newinfo.pk = pk;
                    newinfo.source = data['source-pk'];
                    newinfo.tags = new Set(data['tag-pk']);
                    newinfo.xp = data['xp-pk'];
                    info_backup = deepCopyInfo(newinfo);
                    setPageContent(newinfo);
                    editBtn.classList.add('hidden');
                    document.getElementById('addMonster').classList.remove('hidden');
                    editBtnRemove(e);
                }).catch((err)=>{
                    console.error(err);
                    errorModal.generate(err.message);
                });
            }
            let editBtnRemove = (e) => {
                editBtn.removeEventListener('click', editBtnHandle);
                document.getElementById('monsterName').removeEventListener('change', editBtnRemove);
            }

            editBtn.addEventListener('click', editBtnHandle);
            document.getElementById('monsterName').addEventListener('change', editBtnRemove);
            editBtn.classList.remove('hidden');
            
            break;
        }
    }
    if (!found) {
        editBtn.classList.add('hidden');
    }
}

const addMonsterHandle = (e) => {
    e.preventDefault();

    information.pk = null;
    info_backup = deepCopyInfo(info_default);
    setPageContent(deepCopyInfo(information));
    e.currentTarget.classList.add('hidden');
}

const monsterXPHandle = (e) => {
    information.xp = parseInt(e.currentTarget.value) >= 0 ? e.currentTarget.value : null;
}

const monsterInfoHandle = (e) => {
    information.description = e.currentTarget.value;
}

const monsterFormSubmit = (e) => {
    e.preventDefault();

    let data = new URLSearchParams();

    let url = information.pk ? `/monster/${information.pk}/edit/` : '/monster/add/';
    let valid = true;

    if (!information.name) {
        setValid('monsterName', false);
        valid = false;
    }
    if (!information.xp || information.xp <= 0) {
        setValid('monsterXP', false);
        valid = false;
    }
    if (!information.source || information.source <= 0) {
        setValid('sourceChoosePk', false);
        valid = false;
    }
    if (!information.page || information.page <= 0) {
        setValid('sourceChoosePage', false);
        valid = false;
    }

    if (!valid) {
        information.pk = info_backup.pk
        errorModal.generate('Some attributes are invalid. Please fix red fields and try again.');
        return false;
    }

    if (information.name != info_backup.name) data.append('name', information.name);
    if (information.xp != info_backup.xp) data.append('xp', information.xp);
    if (information.description != info_backup.description) data.append('info', information.description);
    if (information.source != info_backup.source) data.append('source', information.source);
    if (information.page != info_backup.page) data.append('page', information.page);
    if (information.tags != info_backup.tags) {
        information.tags.forEach((tag) => {
            data.append('tag', tag);
        });
    }

    fetch(url, {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        body: data,
    }).then((res)=>{
        if (!res.ok) {
            throw new Error(`Response was ${res.status}`);
        }
        return res.json();
    }).then((data) => {
        information.pk = data.pk;
        info_backup = deepCopyInfo(information);
        reRender(['monsterContainer'], (e) => {
            document.getElementById('addMonster').classList.remove('hidden');
        });
    }).catch((err)=>{
        console.error(err);
        errorModal.generate(err.message);
    });
}

const monsterFormSaveAs = (e) => {
    e.preventDefault();

    information.pk = null;
    
    document.getElementById('monsterForm').dispatchEvent(new Event('submit', {'submitter': e.currentTarget}));
}

const monsterFormReset = (e) => {
    e.preventDefault();

    setPageContent(info_backup);
}

const monsterFormDelete = (e) => {
    e.preventDefault();

    confirmModal.generate(null, (e)=>{
        let url = `/monster/${information.pk}/delete/`;

        makeRequestSimple(url, null, confirmModal, ['monsterContainer'], ()=>{
            information.pk = null;
            info_backup = deepCopyInfo(info_default);
            monsterFormReset(e);
        });
    });
}

resetTooltips();