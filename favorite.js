const Base_URL = 'https://webdev.alphacamp.io'
const Index_URL = Base_URL + '/api/movies/'
const Poster_URL = Base_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')

//把資料從local storage中抓下來並存到movies裡
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

//這邊用data而不直接使用movie是為了降低程式的耦合性
function renderMovieList(movies) {
  let htmlContent = ''
  movies.forEach((item) => {
    htmlContent += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src= "${Poster_URL + item.image}"
                class="card-img-top" alt="Movie Poster">
              <div class="card-body p-1 ">
                <h5 class="card-title ">${item.title}</h5>
                <div class="card-footer">
                  <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                    data-bs-target="#movie-modal" data-id=${item.id}>More</button>
                  <button type="button" class="btn btn-danger btn-remove" data-id=${item.id}>x</button>
                </div>
              </div>
            </div>
           </div>
          </div>`
  })
  dataPanel.innerHTML = htmlContent
}

renderMovieList(movies)

//邏輯一：當我一點擊More btn, 幫我傳送id值，並傳到另一個function中
//邏輯二：當我一點擊add btn, 幫我傳送id值，並
dataPanel.addEventListener("click", function (event) {
  if (event.target.matches(".btn-show-movie")) {
    let id = (Number(event.target.dataset.id))
    showMovieModal(id)
  } else if (event.target.matches(".btn-remove")) {
    let id2 = event.target.dataset.id
    removefromFavorites(Number(id2))
  }
})

function removefromFavorites(id2){
  console.log(id2)

  function index(movie){
    movie.id === id2
  }

  movies.findIndex(index)

  // const index = movies.findIndex((movie) => movie.id === id2)
  movies.splice(index, 1)
  //存回local storage裡面
  localStorage.setItem('favoriteMovies',JSON.stringify(movies))
  //更新頁面
  renderMovieList(movies)
}
//   //把movie加入list陣列中
//   list.push(movie)
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// }


function showMovieModal(id) {
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const MovieModalImage = document.querySelector('#movie-modal-image img')
  const MovieModalDate = document.querySelector('#movie-modal-date')
  const MovieModalDescription = document.querySelector('#movie-modal-description')

  //用axios取得res
  axios
    .get(Index_URL + id)
    .then(function (response) {
      const data = response.data.results
      movieModalTitle.innerHTML = data.title
      MovieModalImage.src = Poster_URL + data.image
      MovieModalDate.innerText = data.release_date
      MovieModalDescription.innerText = data.description
    })
    .catch(function (error) {
      console.log(error)
    })
}

//這邊會listen to dataPanel 因為中間是動態式生成的，直接querySelector會抓不到

    
