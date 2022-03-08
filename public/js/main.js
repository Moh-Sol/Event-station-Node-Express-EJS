


function deleteEvent() {

    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    axios.delete('/events/delete/' + id)
        .then(res => {
            console.log(res.data)
            alert('event was deleted')
            window.location.href = '/events'
        })
        .catch(err => console.log(err))
}

// uppload Avtar 


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {

            let image = document.getElementById('imagePlaceHolder')
            image.style.display = 'block'
            image.src = e.target.result;

        }
        reader.readAsDataURL(input.files[0])
    }

}
