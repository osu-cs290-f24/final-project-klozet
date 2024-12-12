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
    const searchOutfitsInput = document.getElementById('search-outfits');
    const allItems = [];
    const savedOutfits = [];
    let isSelectingOutfit = false;
    let currentOutfit = [];

    function loadJSONData() {

        fetch('closet.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    addItemToCloset(item.name, item.type, item.color, item.imageURL)
                })
            })
            .catch(error => console.error('Error loading clothes data:', error))

        fetch('outfits.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(outfit => {
                    savedOutfits.push(outfit)

                    const category = outfit.category
                    const existingOptions = Array.from(outfitCategoryFilter.options).map(option => option.value.toLowerCase())
                    if (!existingOptions.includes(category.toLowerCase())) {
                        const newOption = document.createElement('option')
                        newOption.value = category.toLowerCase()
                        newOption.textContent = category
                        outfitCategoryFilter.appendChild(newOption)
                    }
                })

                const options = Array.from(outfitCategoryFilter.options)
                options.sort((a, b) => a.text.localeCompare(b.text))
                outfitCategoryFilter.innerHTML = ''
                options.forEach(option => outfitCategoryFilter.appendChild(option))

                renderSavedOutfits()
            })
            .catch(error => console.error('Error loading outfits data:', error))
    }

    function showWelcomeAlert() {
        Swal.fire({
        title: "Welcome to your Virtual Clozet!",
        text: "Add items to Your Closet, then choose one and click Add to Outfit. \n Repeat until you're happy with your look, then save it! \nYou can view your saved outfits below. \nHappy outfit making!",
        // icon: "info",
        imageUrl: 'closet.png',
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: 'Closet Icon',
        confirmButtonText: "Get Started",
        customClass: {
            closeButton: 'custom-close-btn'
          }
        }).then(() => {
        document.getElementById("open-tutorial").classList.remove("hidden");
        });
    }
    
    // window.onload = function () {
    //     showWelcomeAlert();
    // };
    
    document.getElementById("open-tutorial").onclick = function () {
        showWelcomeAlert();
    };

    document.getElementById('more-ideas-button').addEventListener('click', function() {
        window.open('https://www.pinterest.com', '_blank');
      });

    function showOutfitSuccessAlert() {
        Swal.fire({
        title: "Success!",
        text: "Your outfit has been saved successfully!",
        icon: "success",
        customClass: {
            closeButton: 'custom-close-btn'
          }
        }).then(() => {
        document.getElementById("save-outfit-button").classList.remove("hidden");
        });
    }

    function showMissingNameCategoryError() {
        Swal.fire({
        title: "Oops!",
        text: "Don't forget to provide an outfit name and category.",
        icon: "warning",
        customClass: {
            closeButton: 'custom-close-btn'
          }
        }).then(() => {
        document.getElementById("save-outfit-button").classList.remove("hidden");
        });
    }

    function showMissingItemError() {
        Swal.fire({
        title: "Oops!",
        text: "Don't forget to add at least one item to complete your outfit!.",
        icon: "warning",
        customClass: {
            closeButton: 'custom-close-btn'
          }
        }).then(() => {
        document.getElementById("save-outfit-button").classList.remove("hidden");
        });
    }
  
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

        const nameElement = document.createElement('p');
        nameElement.textContent = name;

        const imgElement = document.createElement('img');
        imgElement.src = imageURL;
        imgElement.alt = name;    

        newItem.appendChild(imgElement);
        newItem.appendChild(nameElement);

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
            showMissingNameCategoryError()
            return
        }
        if (currentOutfit.length === 0) {
            showMissingItemError()
            return
        }

        const outfit = {
            name: outfitName,
            category: outfitCategory,
            items: currentOutfit.map(item => ({
                name: item.querySelector('p').textContent, 
                type: item.dataset.type, 
                color: item.dataset.color, 
                imageURL: item.querySelector('img').src 
            }))
        }

        savedOutfits.push(outfit)

        const existingOptions = Array.from(outfitCategoryFilter.options).map(option => option.value.toLowerCase())
        if (!existingOptions.includes(outfitCategory.toLowerCase())) {
            const newOption = document.createElement('option')
            newOption.value = outfitCategory
            newOption.textContent = outfitCategory
            outfitCategoryFilter.appendChild(newOption)
        }
        
        const options = Array.from(outfitCategoryFilter.options)
        options.sort((a, b) => a.text.localeCompare(b.text))
        outfitCategoryFilter.innerHTML = ''
        options.forEach(option => outfitCategoryFilter.appendChild(option))

        const existingOutfit = savedOutfits.some(existingOutfit => existingOutfit.category === outfit.category);
        
        showOutfitSuccessAlert()
        renderSavedOutfits()
        cancelOutfitCreation()
    }

    function renderSavedOutfits() {
        const searchTerm = searchOutfitsInput.value.toLowerCase();
        const selectedCategory = outfitCategoryFilter.value.toLowerCase();
        savedOutfitsContainer.innerHTML = ''; 

        const filteredOutfits = savedOutfits.filter(outfit => {
            const matchesCategory = selectedCategory === '' || outfit.category.toLowerCase() === selectedCategory;
            const matchesSearchTerm = outfit.name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearchTerm;
        });

        filteredOutfits.forEach(outfit => {
            const outfitElement = document.createElement('div');
            outfitElement.className = 'outfit-item';
            outfitElement.innerHTML = `<h3>${outfit.name}</h3><p>${outfit.category}</p>`;
            savedOutfitsContainer.appendChild(outfitElement);

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'outfit-items-container';
            outfit.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'outfit-item-preview';
    
                const itemImage = document.createElement('img');
                itemImage.src = item.imageURL;
                itemImage.alt = item.name;
    
                const itemName = document.createElement('p');
                itemName.textContent = item.name;
    
                itemElement.appendChild(itemImage);
                itemElement.appendChild(itemName);
                itemsContainer.appendChild(itemElement);
            });
    
            outfitElement.appendChild(itemsContainer);
            savedOutfitsContainer.appendChild(outfitElement);
        });
    }

    const options = Array.from(outfitCategoryFilter.options)
    options.sort((a, b) => a.text.localeCompare(b.text))

    outfitCategoryFilter.innerHTML = ''
    options.forEach(option => outfitCategoryFilter.appendChild(option))

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
    searchOutfitsInput.addEventListener('input', renderSavedOutfits);
    outfitCategoryFilter.addEventListener('change', renderSavedOutfits);

    loadJSONData();
});