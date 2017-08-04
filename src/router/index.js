import Vue from 'vue'
import Router from 'vue-router'
import Movie from '@/components/movie/movie'
import MovieDetail from '@/components/movie-detail/movie-detail'
import Search from '@/components/search/search'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'movie'
    },
    {
      path: '/movie',
      component: Movie
//    children:[
//    	{
//    		path:':id',
//    		component:MovieDetail
//    	}
//    ]
    },
    {
      path: '/search',
      component: Search
    },
    {
       path: '/movie/:id',
       component: MovieDetail
    }
    
  ]
})
