let tableBody = document.getElementById('table-body');
let selectAll = document.getElementById('select-all');
let search = document.getElementById('search');
let noData = document.getElementById('no-data');
let deleteSelected = document.getElementById('delete-selected')
let pagination = document.getElementById('pagination')

let requiredData = []
async function getInfo()
{
    let apiURL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
    try
    {
        let response = await fetch(apiURL)
        requiredData = await response.json()

        setInfo(requiredData)

        search.addEventListener('keyup', function()
        {
            tableBody.innerHTML = ''
            let val = this.value

            let modifiedData = searchTable(val, requiredData)
            if(modifiedData.length == 0)
            {
                noData.style.display = 'block'
                deleteSelected.style.display = 'none'
                pagination.style.display = 'none'
            }
            else
            {
                setInfo(modifiedData)
                noData.style.display = 'none'
                deleteSelected.style.display = 'initial'
            }
        })
    }
    catch(error)
    {
        console.log(error);
    }
}

function searchTable(value, data)
{
    let filteredData = []

    data.forEach(eachItem =>
        {
            value = value.toLowerCase()
            let name = eachItem.name.toLowerCase()

            if(name.includes(value) || eachItem.email.includes(value) || eachItem.role.includes(value))
                filteredData.push(eachItem)
        })

    return filteredData
}

function setInfo(requiredData)
{
    tableBody.innerHTML = ''

    requiredData.forEach(eachItem =>
        {
            let newRow = document.createElement('tr');
            newRow.classList.add('row')
            tableBody.appendChild(newRow)

            let checkbox = document.createElement('td')

            let checkboxItem = document.createElement('input')
            checkboxItem.classList.add('selection')
            checkboxItem.setAttribute('type', 'checkbox')
            checkbox.appendChild(checkboxItem)

            newRow.appendChild(checkbox)

            checkboxItem.addEventListener('click', function()
            {
                if(this.checked)
                {
                    newRow.style.backgroundColor = 'rgba(211, 211, 211, 0.6)'
                }
                else
                {
                    newRow.style.backgroundColor = 'transparent'
                }
            })

            let nameItem = document.createElement('td')
            nameItem.classList.add('name')
            nameItem.innerText = eachItem.name
            newRow.appendChild(nameItem)

            let emailItem = document.createElement('td')
            emailItem.classList.add('email')
            emailItem.innerText = eachItem.email
            newRow.appendChild(emailItem)

            let roleItem = document.createElement('td')
            roleItem.classList.add('role')
            roleItem.innerText = eachItem.role
            newRow.appendChild(roleItem)

            let actionsItem = document.createElement('td')

            let editItem = document.createElement('i')
            editItem.classList.add('edit', 'fa-solid', 'fa-pen-to-square')
            actionsItem.appendChild(editItem)

            let deleteItem = document.createElement('i')
            deleteItem.classList.add('delete', 'fa-solid','fa-trash')
            actionsItem.appendChild(deleteItem)

            newRow.appendChild(actionsItem)

            deleteItem.addEventListener('click', () => deleteRow(newRow))
            editItem.addEventListener('click', () => editRow(editItem, actionsItem, nameItem, emailItem, roleItem))
        })
}

function deleteRow(newRow)
{
    tableBody.removeChild(newRow)
    let tempData = requiredData
    requiredData = []
    tempData.map(eachItem =>
        {
            for(let i=0; i< document.getElementsByClassName('name').length; i++)
            {
                if(eachItem.name == document.getElementsByClassName('name')[i].innerHTML)
                    requiredData.push(eachItem)
            }
        })
}

deleteSelected.addEventListener('click', function()
{
    let tempData = requiredData
    requiredData = []
    let listItems = document.getElementsByClassName('selection')
    tempData.map(eachItem =>
        {
            for(let i=0; i< listItems.length; i++)
            {
                if(listItems[i].checked != true)
                {
                    if(eachItem.name == listItems[i].parentElement.nextSibling.innerText)
                        requiredData.push(eachItem)
                }
            }
    })
    setInfo(requiredData)
})

function editRow(editItem, actionsItem, nameItem, emailItem, roleItem)
{
    editItem.style.display = 'none'

    let save = document.createElement('span')
    save.classList.add('save')
    save.innerHTML = '<b><u>Save<u><b>'
    save.style.color = 'blue'
    actionsItem.prepend(save)

    let nameTemp = nameItem.innerText
    nameItem.innerText = ''
    let nameInput = document.createElement('input')
    nameInput.setAttribute('value', `${nameTemp}`)
    nameItem.appendChild(nameInput)

    let emailTemp = emailItem.innerText
    emailItem.innerText = ''
    let emailInput = document.createElement('input')
    emailInput.setAttribute('value', `${emailTemp}`)
    emailItem.appendChild(emailInput)

    let roleTemp = roleItem.innerText
    roleItem.innerText = ''
    let roleInput = document.createElement('input')
    roleInput.setAttribute('value', `${roleTemp}`)
    roleItem.appendChild(roleInput)

    save.addEventListener('click', function()
    {
        if(nameInput.value == '' || emailInput.value == '' || roleInput.value == '')
            alert('One or more fields is empty, please enter the values to continue')
        else
        {
            actionsItem.removeChild(this)
            editItem.style.display = 'initial'

            nameItem.innerText = nameInput.value
            emailItem.innerText = emailInput.value
            roleItem.innerText = roleInput.value 

            requiredData = []

            let rows = document.getElementsByClassName('row')
            for(let i=0; i<rows.length; i++)
            {
                let children = rows[i].children
                for(let j=1; j<children.length-1; j++)
                {
                    if(j == 1)
                    {
                        var name = children[j].innerText
                    }
                    else if(j == 2)
                    {
                        var email = children[j].innerText
                    }
                    else
                    {
                        var role = children[j].innerText
                    }
                }

                requiredData.push({id:i+1, name, email, role})
            }
        }
    })
}

selectAll.addEventListener('click', () =>
{
    let listItems = document.getElementsByClassName('selection')
    
    if(selectAll.checked)
    {
        for(let i=0; i< listItems.length; i++)
        {
            listItems[i].checked = true;
            listItems[i].parentElement.parentElement.style.backgroundColor = 'rgba(211, 211, 211, 0.6)'
        }
    }
    else
    {
        for(let i=0; i< listItems.length; i++)
        {
            listItems[i].checked = false;
            listItems[i].parentElement.parentElement.style.backgroundColor = 'transparent'
        }
    }
})


getInfo()