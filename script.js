document.addEventListener('DOMContentLoaded', function() {
    const addItemButton = document.getElementById('add-item-button');
    const modal = document.getElementById('add-item-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const cancelButton = document.getElementById('modal-cancel');
    const acceptButton = document.getElementById('modal-accept');
    const closetContainer = document.getElementById('closet-items');
    const searchInput = document.getElementById('search-closet');
    const colorSort = document.getElementById('color-sort');
    const typeSort = document.getElementById('type-sort');
    const createOutfitButton = document.getElementById('create-outfit-button');
    const addToOutfitButton = document.getElementById('add-to-outfit-button');
    const cancelOutfitButton = document.getElementById('cancel-outfit-button');
    const saveOutfitButton = document.getElementById('save-outfit-button');
    const savedOutfitsContainer = document.getElementById('saved-outfits-container');
    const outfitCategoryFilter = document.getElementById('outfit-category-filter');
    const allItems = [];
    const savedOutfits = [];
    let isSelectingOutfit = false;
    let currentOutfit = [];

    function showModal() {
        modal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
        clearInputs();
    }

    function clearInputs() {
        document.getElementById('item-name').value = '';
        document.getElementById('item-image').value = '';
        document.getElementById('item-image-upload').value = '';
        document.getElementById('item-type').value = '';
        document.getElementById('item-type-new').value = '';
        document.getElementById('item-color').value = '';
        document.getElementById('item-color-new').value = '';
    }

    function createNewItem() {
        const name = document.getElementById('item-name').value.trim();
        let imageURL = document.getElementById('item-image').value.trim();
        const imageUpload = document.getElementById('item-image-upload').files[0];
        let type = document.getElementById('item-type').value;
        const typeNew = document.getElementById('item-type-new').value.trim();
        let color = document.getElementById('item-color').value;
        const colorNew = document.getElementById('item-color-new').value.trim();

        if (!name || (!imageURL && !imageUpload) || (!type && !typeNew) || (!color && !colorNew)) {
            alert('Please fill out all required fields');
            return;
        }

        if (typeNew) {
            type = typeNew;
            addOption(typeSort, type);
        }

        if (colorNew) {
            color = colorNew;
            addOption(colorSort, color);
        }

        if (imageUpload) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageURL = e.target.result;
                addItemToCloset(name, type, color, imageURL);
            };
            reader.readAsDataURL(imageUpload);
        } else {
            addItemToCloset(name, type, color, imageURL);
        }
    }

    function addItemToCloset(name, type, color, imageURL) {
        const newItem = document.createElement('div');
        newItem.className = 'clothing-item';
        newItem.dataset.type = type;
        newItem.dataset.color = color;

        newItem.innerHTML = `
            <img src="${imageURL}" alt="${name}">
            <p>${name}</p>
        `;

        newItem.addEventListener('click', function() {
            if (isSelectingOutfit) {
                newItem.classList.toggle('selected');
            }
        });

        allItems.push(newItem);
        closetContainer.appendChild(newItem);
        hideModal();
    }

    function addOption(selectElement, value) {
        const option = document.createElement('option');
        option.value = value.toLowerCase();
        option.textContent = value;
        selectElement.appendChild(option);
    }

    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedColor = colorSort.value.toLowerCase();
        const selectedType = typeSort.value.toLowerCase();

        allItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            const itemType = item.dataset.type.toLowerCase();
            const itemColor = item.dataset.color.toLowerCase();

            const matchesSearch = itemText.includes(searchTerm);
            const matchesColor = selectedColor === '' || itemColor === selectedColor;
            const matchesType = selectedType === '' || itemType === selectedType;

            if (matchesSearch && matchesColor && matchesType) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function startOutfitCreation() {
        isSelectingOutfit = true;
        createOutfitButton.classList.add('hidden');
        addToOutfitButton.classList.remove('hidden');
        cancelOutfitButton.classList.remove('hidden');
        document.getElementById('outfit-name').classList.remove('hidden');
        document.getElementById('outfit-category').classList.remove('hidden');
        saveOutfitButton.classList.remove('hidden');
    }

    function cancelOutfitCreation() {
        isSelectingOutfit = false
        createOutfitButton.classList.remove('hidden')
        addToOutfitButton.classList.add('hidden')
        cancelOutfitButton.classList.add('hidden')
        document.getElementById('outfit-name').classList.add('hidden')
        document.getElementById('outfit-category').classList.add('hidden')
        saveOutfitButton.classList.add('hidden')
        clearOutfitSelection()
    }

    function clearOutfitSelection() {
        currentOutfit = []
        document.getElementById('current-outfit').innerHTML = ''
        document.getElementById('current-outfit').classList.add('hidden')
        document.querySelectorAll('.clothing-item.selected').forEach(item => {
           item.classList.remove('selected')
        })
    }

    function addToOutfit() {
        const selectedItems = document.querySelectorAll('.clothing-item.selected')
        selectedItems.forEach(item => {
            if (!currentOutfit.includes(item)) {
                currentOutfit.push(item.cloneNode(true))
         }
            item.classList.remove('selected')
      })
        renderCurrentOutfitPreview()
    }

    function renderCurrentOutfitPreview() {
        const currentOutfitContainer = document.getElementById('current-outfit')
        currentOutfitContainer.innerHTML = ''
        currentOutfit.forEach(item => {
            currentOutfitContainer.appendChild(item)
        })
        currentOutfitContainer.classList.remove('hidden')
    }

    function saveOutfit() {
    const outfitName = document.getElementById('outfit-name').value.trim()
    const outfitCategory = document.getElementById('outfit-category').value.trim()

    if (!outfitName || !outfitCategory) {
        alert('Please provide an outfit name and category.')
        return
    }
    if (currentOutfit.length === 0) {
        alert('Please select at least one item for your outfit.')
        return
    }

    const outfit = {
        name: outfitName,
        category: outfitCategory,
        items: currentOutfit.map(item => item.outerHTML)
    }

    savedOutfits.push(outfit)
    renderSavedOutfits()
    cancelOutfitCreation()
    }

    function renderSavedOutfits() {
        const savedOutfitsContainer = document.getElementById('saved-outfits-container')
        savedOutfitsContainer.innerHTML = ''
    
        const filteredOutfits = savedOutfits.filter(outfit => 
            !outfitCategoryFilter.value || outfit.category === outfitCategoryFilter.value
        )
    
        filteredOutfits.forEach(outfit => {
            const outfitElement = document.createElement('div')
            outfitElement.className = 'saved-outfit'
            outfitElement.innerHTML = `
                <h3>${outfit.name}</h3>
                <p>Category: ${outfit.category}</p>
                <div class="outfit-preview">
                    ${outfit.items.join('')}
                </div>
            `
            savedOutfitsContainer.appendChild(outfitElement)
        })
    }

    addItemButton.addEventListener('click', showModal);
    cancelButton.addEventListener('click', hideModal);
    acceptButton.addEventListener('click', createNewItem);

    searchInput.addEventListener('input', filterItems);
    colorSort.addEventListener('change', filterItems);
    typeSort.addEventListener('change', filterItems);

    createOutfitButton.addEventListener('click', startOutfitCreation);
    cancelOutfitButton.addEventListener('click', cancelOutfitCreation);
    addToOutfitButton.addEventListener('click', addToOutfit);
    saveOutfitButton.addEventListener('click', saveOutfit);
    outfitCategoryFilter.addEventListener('change', renderSavedOutfits);
});

