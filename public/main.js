/***************************
=======Delete Letter=======
***************************/
document.querySelectorAll('.delete').forEach((item, i)=>{
  item.addEventListener('click', element =>{
    fetch('letter', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: element.currentTarget.parentElement.id
      })
    }).then(function (response) {
      console.log(response.body)
      window.location.reload()
    })
  })
})

/***************************
=======Nice Button=======
***************************/
document.querySelectorAll('.nice').forEach((item, i) => {
  item.addEventListener('click', element => {
    console.log(element.currentTarget.getAttribute('nice'))
    fetch('nice', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: element.currentTarget.parentElement.id,
        nice: element.currentTarget.getAttribute('nice')
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  })
});

/***************************
=======Select Reference=======
***************************/
document.querySelectorAll('.useReference').forEach((item, i) =>{
  item.addEventListener('click', element => {
    fetch('communityReference', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({

        id: element.currentTarget.parentElement.id

      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      document.querySelector('#edit-module .title').value = data.title
      document.querySelector('#edit-module .referenceArticleID').value = data.id
      document.querySelector('#edit-module .language').value = data.language
      document.querySelector('#edit-module textarea').value = data.body
      document.querySelector('.original-reference').classList.add('hide')
      document.querySelector('.selected-reference').classList.remove('hide')

      document.querySelector('#select-chosen-reference').classList.remove('hide')
      document.querySelector('#find-new-reference').classList.add('hide')

      document.querySelector('.selected-reference .title').innerText = data.title
      document.querySelector('.selected-reference .ref-auth-name').innerText = data.authorName
      document.querySelector('.selected-reference .reference-language').innerText = data.language
      document.querySelector('.selected-reference .reference-nice').innerText = data.nice
      document.querySelector('.selected-reference .ref-body').innerText = data.body
    })
  })
})

document.querySelector('#select-original-reference').addEventListener('click', event => {
  document.querySelector('.selected-reference').classList.add('hide')
  document.querySelector('.original-reference').classList.remove('hide')
})
document.querySelector('#select-chosen-reference').addEventListener('click', event => {
  document.querySelector('.selected-reference').classList.remove('hide')
  document.querySelector('.original-reference').classList.add('hide')
})

/**Aside panel functionality**/
document.querySelector('.info-button').addEventListener('click', toggleAside)
document.querySelector('#hide-aside').addEventListener('click', toggleAside)

function toggleAside(){       document.querySelector('aside').classList.toggle('reveal')
}
/**Aside Panel end*/
