const uploadButton = document.getElementById('upload')
const uploadArea = document.getElementById('upload_area')

const fileList = document.createElement('table')
fileList.className = 'file__list'

const wrapper = document.querySelector('.wrapper')

wrapper.append(fileList)

const labelFilter = document.createElement('label')
labelFilter.textContent = 'Фильтровать по типу файла'
labelFilter.className = 'filter__label-type'
const typeFilter = document.createElement('select')
typeFilter.name = 'file_type'
typeFilter.className = 'filter__select'
labelFilter.append(typeFilter)

const labelFileSize = document.createElement('label')
labelFileSize.textContent = "Минимальный размер файла, байт"
labelFileSize.className = 'filter__label-size'
const sizeFilter = document.createElement('input')
sizeFilter.className = 'filter__size'
sizeFilter.name = 'min_file_size'
sizeFilter.type = 'number'
sizeFilter.min = 0
labelFileSize.append(sizeFilter)

labelFileSize.addEventListener('change', (e) => {
  let files = Object.keys(localStorage)
  let res = files.filter(elem => {
    let fileInfo = JSON.parse(localStorage.getItem(elem))
    return fileInfo.fileSize >= +e.target.value
  })
  displayFiles(res)
})

typeFilter.addEventListener('change', (e) => {
  if (e.target.value != 'all_files') {

    let files = Object.keys(localStorage)

    let res = files.filter(elem =>  {
      let fileInfo = JSON.parse(localStorage.getItem(elem))
      return fileInfo.fileName.split('.').pop() == e.target.value
    })

    displayFiles(res)

  } else {
    displayFiles(Object.keys(localStorage))
  }
})



function setTypeOptions(array) {
  typeFilter.innerHTML = `
  <option value="all_files">Все типы</option>
  `
  for (let elem of array) {
    let newOption = document.createElement('option')
    newOption.innerText = elem
    newOption.value = elem
    typeFilter.append(newOption)
  }
  typeFilter.value = ''
  wrapper.append(labelFilter)
}



function getStoredFileTypes() {
  let types = {}
  if (localStorage.length) {
    let files = Object.keys(localStorage)
    files.forEach((file)=> {
      let fileInfo = JSON.parse(localStorage.getItem(file))
      types[fileInfo.fileName.split('.').pop()] = 1
    })
  }
  return Object.keys(types)
}


function formatNumber(num, sep = ' '){
  let intPart = String(Math.floor(num));
  let floatPart = String(num)
  if (floatPart.includes('.')) {
    floatPart = `,${floatPart.slice(floatPart.indexOf('.') + 1)}`
  } else {
    floatPart = '';
  }
  let segmTotal = Math.ceil(intPart.length / 3)
  let firstSegm = intPart.length % 3;
  let result = firstSegm > 0 ? `${intPart.slice(0, firstSegm)}${sep}`:'';

  for (let i = 1; i <= segmTotal; i++) {
    result +=`${intPart.slice(firstSegm + 3 * (i - 1), firstSegm + i * 3)}${sep}`;
  }
  result = `${result.trim()}${floatPart}`;
  return result;
}


displayFiles(Object.keys(localStorage))

function displayFiles(files) {
  if (localStorage.length) {
    setTypeOptions(getStoredFileTypes())
    wrapper.append(labelFileSize)
    fileList.innerHTML = ''
    wrapper.append(fileList)
    const fileListHeader = document.createElement('thead')
    fileListHeader.innerHTML = `<tr>
                              <th>Имя файла</th>
                              <th>MIME type</th>
                              <th>Размер, байт</th>
                              <th></th>
                              <th></th>
                            </tr>`

    fileList.append(fileListHeader)

    for (let file of files) {
      let fileInfo = JSON.parse(localStorage.getItem(file))
      let newRow = document.createElement('tr')
      newRow.innerHTML = `
                          <td class='td_name'>${fileInfo.fileName}</td>
                          <td class='td_type'>${fileInfo.fileType.slice(fileInfo.fileType.indexOf('/') + 1)}</td>
                          <td class='td_size'>${formatNumber(fileInfo.fileSize)}</td>
                          <td class='td_button'><a href=${file} download=${fileInfo.fileName}><img src="images/upload.svg" alt='Download icon' width="18"></a></td>
                        `
      let downloadCell = document.createElement('td')
      downloadCell.innerHTML = `
                                <img src="images/delete.png" alt="Delete icon" width="22">
                               `
      downloadCell.className = 'delete__button'

      downloadCell.onclick = () => {
        localStorage.removeItem(file)
        displayFiles(Object.keys(localStorage))
      }               
      newRow.append(downloadCell)

      fileList.append(newRow)
    }

    

  } else {
    if (document.querySelector('.file__list')) {
      wrapper.removeChild(fileList)
    }
    if (document.querySelector('.filter__label-size')) {
      wrapper.removeChild(labelFileSize)
    }
    if (document.querySelector('.filter__label-type')) {
      wrapper.removeChild(labelFilter)
    }
    // fileList.innerHTML = ''
  }
}


uploadButton.addEventListener('change', (e) => {

  const files = e.target.files;
  console.log(files);
  if (files.length) {
    [...files].forEach((fileUploaded) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileUploaded)
      reader.onload = function (e) {
        let fileInfo = {
          'fileName': fileUploaded.name,
          'fileSize': fileUploaded.size,
          'fileType': fileUploaded.type
        }
        console.log(fileInfo);
        localStorage.setItem(e.target.result, JSON.stringify(fileInfo))
        console.log(localStorage.getItem(e.target.result))
        displayFiles(Object.keys(localStorage))
      }
    })
    console.log('completed')
  }
})


uploadArea.addEventListener('dragenter', (e) => {
  e.preventDefault()
  uploadArea.classList.add('upload-area-over')
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault()
  uploadArea.classList.remove('upload-area-over')
})

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault()
})

uploadArea.addEventListener('drop', (e)=> {
  e.preventDefault()
  uploadArea.classList.remove('upload-area-over')
  const files = e.dataTransfer.files;
  if (files.length) {

    [...files].forEach((fileUploaded) => {
      const reader = new FileReader()
      reader.readAsDataURL(fileUploaded)
      
      reader.onload = function (e) {
        let fileInfo = {
          'fileName': fileUploaded.name,
          'fileSize': fileUploaded.size,
          'fileType': fileUploaded.type
        }
        console.log(fileInfo);
        localStorage.setItem(e.target.result, JSON.stringify(fileInfo))
        console.log(localStorage.getItem(e.target.result))
        displayFiles(Object.keys(localStorage))
      }

    })
  }

})