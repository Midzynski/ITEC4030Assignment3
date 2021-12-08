const express = require('express')
const router = new express.Router()



// models
const Movie = require(__basedir + '/models/movie')
const Comment = require(__basedir + '/models/comment')

const DEFAULT_MOVIES_PER_PAGE = 10
const DEFAULT_COMMENTS_PER_PAGE = 3

/**
 * Some API endpoints in this application are sorted and paginated. Here, we will go over
 * some details about sorting and paginating the resulting movies.
 * 
 * In this applicaiton, we sort the movies in our database based on "popularity" in a decreasing order
 * so that top results are the most popular ones. To learn how to use sort in mongoose,
 * please visit their documentation: https://mongoosejs.com/docs/api.html#query_Query-sort
 * 
 * Pagination is used to return parts of the results to the user in series of pages.
 * You can read about pagination in mongodb here: https://docs.mongodb.com/manual/reference/method/cursor.skip/#pagination-example
 * For example imagine that maximum number of items per page is 5 and we have 7 items in
 * out database. As a result, we need to return the first 5 elements in the first page.
 * For the second page, we need to `skip` over the first 5 elements and return the remaining
 * elements (up to a maximum of 5). As a result, our query from the database for paginated
 * results would typically look like this:
 *    const results = await Movie.find({...}).sort({...}).skip((page - 1) * limit).limit(limit)
 * Note: `page` is the page that we want to fetch the results for and `limit` is the maximum
 * number of elements allowed per page. In our previous example, limit was 5.
 * Note: the number of pages can be calculated as `Math.ceil(count / limit)`
 * 
 * In this application, we will use the `DEFAULT_MOVIES_PER_PAGE` variable as the maximum 
 * number of items per page for the endpoints
 * that return a list of movies and `DEFAULT_COMMENTS_PER_PAGE` variable as the maximum 
 * number of items per page for the endpoints that returna  list of comments.
 */

// GET /movies -> gets a list of movies, sorted and paginated
router.get('/movies', async (req, res) => {
  // TODO: fill out the code for the endpoint
  
  const page = parseInt(req.query.page);
  
  // console.log(page);
  const limit = DEFAULT_MOVIES_PER_PAGE;

  const startIndex = (page-1) * limit
  

    /////////////////////////////////////this works but testing/////////////////////////////////////////
    const results = {}
    results.results = await Movie.find().limit(limit).skip(startIndex).limit(limit).lean().exec()
    
    // const results = await Movie.find().limit(limit).skip(startIndex).limit(limit).exec()
    
    const movieCount = await Movie.count();
    // console.log(movieCount)
    var moviePages = Math.ceil(movieCount/limit);
  
    const finalPage = moviePages

    if (page < finalPage){
      results.next = {
        page: page +1,
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page -1,
      }
    }

    results.finalPage = (finalPage)
   
    res.render('numberedPage',{results: results});
  
})



// GET /movies/:id --> gets a movie by id
router.get('/movies/:id', async (req, res) => {
  // TODO: fill out the code for the endpoint
  const movieID = req.params.id;
  const movieList = await Movie.find().lean()
  var results = [];
  var searchField = "_id"
  var searchVal = movieID;
  for (var i=0; i< movieList.length; i++){
    if (movieList[i][searchField] == searchVal) {
      results.push(movieList[i]);
      //res.json(results)
      res.render('searchById',{results: results});
      }
  }
})

// POST /search/movies/by-genres --> searches for JSON array of genres we want to search in, sorted and paginated
/**
 * Note: only return movies that match **all** genres. For example, if out request says
 * `["Thriller", "Action"]`, we need to look for movies that are BOTH thriller AND action.
 * For more information, see: https://docs.mongodb.com/manual/reference/operator/query/all/
 */
router.post('/search/movies/by-genres', async (req, res) => {
  // TODO: fill out the code for the endpoint
})

// POST /search/movies/by-countries --> searches for movies with JSON array of countries
/**
 * Note: here, return movies with production_countries matching to ANY of the countries
 * listed. For example for a request for ["Canada","United States of America"], we need
 * to return any movies that include either Canada or the US in their production countries
 * list.
 * For more information, see: https://docs.mongodb.com/manual/reference/operator/query/in/
 */
router.post('/search/movies/by-countries', async (req, res) => {
  // TODO: fill out the code for the endpoint
})

// POST /movies/:id/comments --> creates a comment for a movie, gets the object structure as JSON
/**
 * Note: here we want to `populate` the movie field.
 * For more information, see: https://mongoosejs.com/docs/populate.html
 */
router.post('/movies/:id/comments', async (req, res) => {
  // TODO: fill out the code for the endpoint
})

// GET /movies/:id/comments --> gets the comments for a movie, paginated, sorted by posting date (descending, meaning from new to old)
router.get('/movies/:id/comments', async (req, res) => {
  // TODO: fill out the code for the endpoint
})



module.exports = router
