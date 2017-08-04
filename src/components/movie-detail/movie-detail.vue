<template>
<transition name="slide">
	<div class="movie-detail-wrapper">
		<div class="fixed-title">
			<span class="back" @click="back">
		        <i class="icon-back"></i>
		      </span>
			<span class="type" ref="fixed">
				<span class="movie-name">{{movieDetail.title}}</span>
			</span>
		</div>
		<v-scroll class="movie-detail" :data="movieDetail" :probeType="probeType" :listenScroll="listenScroll" ref="scroll">
			<div class="scroll-wrapper">
				<div class="scroll-content" v-if="movieDetail.images">
					<div class="bg-image" ref="image">
			            <img :src="movieDetail.images.large"/>
			        </div>
			        <v-movieinfo :movieDetail="movieDetail"></v-movieinfo>
			        <div class="toggle-wrapepr">
			            <V-toggle :toggle="toggle" :currentIndex="currentIndex" @toggle="switchItem"></V-toggle>
			        </div>
			        <v-shortcomment v-show="currentIndex===0" :comments="movieDetail.popular_comments" :commentNum="movieDetail.comments_count">
			        	
			        </v-shortcomment>
			        <v-moviecomment v-show="currentIndex===1" :reviews="movieDetail.popular_reviews.slice(0,5)" :reviewNum="movieDetail.reviews_count" >
			        	
			        </v-moviecomment>
				</div>
			</div>
			<v-loading :fullScreen="fullScreen" v-show="!movieDetail.images"></v-loading>
		</v-scroll>
	</div>
</transition>
	
</template>

<script>
	  import VMovieinfo from '@/components/movie-info/movie-info';
	  import VScroll from '@/baseparts/scroll/scroll';
	  import VLoading from '@/baseparts/loading/loading';
	  import VToggle from '@/baseparts/toggle/toggle';
	  import VShortcomment from '@/components/short-comment/short-comment';
	  import VMoviecomment from '@/components/movie-comment/movie-comment';
	  import { mapGetters, mapMutations } from 'vuex';
	  import { getMovieDetail } from '@/api/movie-detail';

	export default{
		 name: 'movieDetail', // 创建name属性用于keep-alive组件定位本组件防止缓存
	    created() {
	      this.probeType = 3; // scroll组件需要实施派发scroll事件，且支持swipe
	      this.listenScroll = true; // scroll组件监听scroll事件并派发滚动位置
	      this._getDetail(); // 获取电影详细信息
	      
	    },
	    data() {
	      return {
	        movieDetail: {},
	        fullScreen: true, // 用于loadmore组件全屏加载效果
	        toggle: [
	          {name: '短评'},
	          {name: '影评'}
	        ],
	        currentIndex: 0,
	      };
	    },
	    computed: {
	      ...mapGetters([
	        'movie'
	      ])
	    },
	    methods: {
	      back() { // 回退到上一页面
	        this.$router.back();
	      },
	      switchItem(index) { // 切换评论tab栏目
	        this.currentIndex = index;
	        this.$nextTick(() => {
	          this.$refs.scroll.refresh();
	        });
	      },
	      _getDetail() {
	        if (!this.movie.id) { // 在当前界面刷新回退到主界面
	          this.$router.push('/movie');
	          return;
	        }
//	        console.log(this.movie);
	        getMovieDetail(this.movie.id).then((res) => { // 获取电影详细
//	          console.log(res);
	          if (!this.$route.params.id) { // 防止快速切换报错
	            return;
	          }
	          this.movieDetail = res;	          
	          let me = this;
	          // 使用vue-lazyload监听事件，每次进入只触发一次
	          this.$Lazyload.$once('loaded', function ({ el, src }) {
	            if (src === res.images.large) {
	              setTimeout(() => {
	                if (!me.$route.params.id) { // 防止路由快速切换报错
	                  return;
	                }
	                me.$refs.scroll.refresh(); // scroll组件重新计算高度
	              }, 20);
	            }
	          });
	        });
	      },
	      ...mapMutations({
	        setReview: 'SET_REVIEW_ID',
	        setDiscussion: 'SET_DISCUSSION_TYPE',
	      })
	    },
	    components: {
	      VMovieinfo,
	      VScroll, 
	      VLoading,
	      VToggle,
	      VShortcomment,
	      VMoviecomment
	    }
	}
</script>

<style lang="scss" scoped>
	@import "../../common/style/variable.scss";
	
	.movie-detail-wrapper{
		position: fixed;
		z-index: 10;
		top:0;
		left:0;
		right:0;
		bottom:0;
		background: #fff;
	}
	.slide-enter-active,.slide-leave-active{
		transition:.3s;
	}
	.slide-enter,.slide-leave-to{
		transform: translate3d(100%,0,0);
	}
    
    .fixed-title {
    	position: fixed;
    	top: 0;
    	width: 100%;
    	height: 40px;
    	z-index: 11;
    	background-color: rgba(85, 85, 85, .6);
    	text-align: center;
    	.back {
    		position: absolute;
    		top: 0px;
    		left: 6px;
    		z-index: 50;
    		.icon-back {
    			display: block;
    			padding: 10px;
    			font-size: $font-size-large;
    			color: $color-background;
    		}
    	}
    	.type {
    		.movie-name {
    			display: block;
    			padding-top: 11px;
    			width: 100%;
    			color: $color-background;
    		}
    	}
    }
      
    .movie-detail {
    	position: fixed;
			z-index: 10;
			top:0;
			left:0;
			right:0;
			bottom:0;
			background: #fff;
    	.bg-image {
    		text-align: center;
    		padding: 50px 0 20px 0;
    		background-color: $color-background-f;
    		img {
    			width: 50%;
    		}
    	}
    	.toggle-wrapepr {
    		padding: 5px 20px;
    		background-color: red;
    	}
    }
    
    .loading-wrapper{
    	position: absolute;
    	z-index: 100;
    	top:0;
    	left:0;
    	right:0;
    	height: 100%;
    	
    }
                                   
</style>