<template>
	<div class="movie-info">
		<div class="movie-main-info">
			<div class="desc">
				<h2 class="title">{{movieDetail.title}}</h2>
				<span class="tag">{{tags}}</span>
				<span class="original-title">原名: {{movieDetail.original_title}}</span>
				<span class="pubdate">上映时间: {{pubdate}}</span>
				<span class="duration">片长: {{durations}}</span>
			</div>
			<div class="movie-ratings">
				<span class="origin">豆瓣评分</span>
				<span class="rating" v-if="rating">{{normalizeScore()}}</span>	
				<span class="noscore" v-else>暂无评分</span>
				<span class="num" v-if="rating">{{movieDetail.ratings_count}}人</span>
			</div>
		</div>
		<div class="movie-watch">
			<div class="want-watch" @click="saveWantedMovie" :class="{'wanted': isWanted(movieDetail.id)}" v-text="wantedText"></div>
			<div class="has-watch" @click="saveWatchedMovie" :class="{'watched': isWatched(movieDetail.id)}">
				{{watchedText}}
			</div>
		</div>
		<div class="movie-brief">
			<h2 class="title">剧情简介</h2>
      		<p class="content">&nbsp;&nbsp;&nbsp;&nbsp;{{movieDetail.summary}}</p>
		</div>
		<v-scroll class="casts" :scrollX="this.scrollX" :eventPassthrough="this.eventPassthrough" ref="scroll">
			<div class="casts-content" ref="content">
		        <h2 class="title">影人</h2>
		        <div class="cast-item" v-for="item in allCasts">
		          <img v-lazy="item.avatars.large" width="90" height="120">
		          <h3 class="item-title">{{item.name}}</h3>
		          <span v-if="item.isDirector">导演</span>
		        </div>
		        <div class="no-result" v-if="!allCasts.length">抱歉，暂无影人信息</div>
		    </div>
		</v-scroll>
	</div>
</template>

<script>
  	import VScroll from '@/baseparts/scroll/scroll';
  	import { mapGetters, mapActions } from 'vuex';
  
	export default {
	    props: {
	      movieDetail: {
	        type: Object,
	        default: {}
	      }
	    },
	    data() {
	      return {
	        scrollX: true,
	        eventPassthrough: 'vertical',
	        needNullStar: true,
	        watchedText: '看过',
	        wanted: false,
	        wantedText: '想看',
	        hasWatched: false
	      };
	    },
	    mounted() {
	      this.$nextTick(() => {
	        this._initPics();
	        this.$refs.scroll.refresh();
	      });
	    },
	    computed: {
	      rating() {
	        let rating = this.movieDetail.rating.average;
	        if (rating === 0) {
	          return false;
	        }
	        return true;
	      },
	      tags() {
	        let year = this.movieDetail.year;
	        let tag = this.movieDetail.genres.join('/');
	        return `${year}/${tag}`;
	      },
	      durations() {
	        return this.movieDetail.durations[0];
	      },
	      pubdate() {
	        let pubdate = '';
	        let date = this.movieDetail.pubdates;
	        for (let i = 0; i < date.length; i++) {
	          if (date[i].indexOf('电影节') === -1) {
	            pubdate = date[i]; // 没有在中国大陆上映，取不为电影节的最后一个信息
	          }
	          if (date[i].indexOf('中国大陆') > -1) {
	            pubdate = date[i];
	            break;
	          }
	        }
	        if (!pubdate) {
	          pubdate = '暂无信息';
	        }
	        return pubdate;
	      },
	      allCasts() { // 获取导演和演员的分组
	        let removeIndex = [];
	        this.movieDetail.directors.forEach((item, index) => {
	          item.isDirector = true;
	          if (item.avatars === null) { // 有的导演不存在照片
	            removeIndex.push(index);
	          }
	        });
	        for (let i = removeIndex.length; i > 0; i--) { // 移除信息不完全的导演
	          this.movieDetail.directors.splice(removeIndex[i - 1], 1);
	        }
	        removeIndex = []; // 重置移除清单
	        this.movieDetail.casts.forEach((item, index) => {
	          // console.log(index);
	          if (item.avatars === null) { // 有的演员不存在照片
	            removeIndex.push(index);
	          }
	        });
	        for (let i = removeIndex.length; i > 0; i--) { // 移除信息不完全的演员
	          this.movieDetail.casts.splice(removeIndex[i - 1], 1);
	        }
	        return this.movieDetail.directors.concat(this.movieDetail.casts);
	      },
	      ...mapGetters([
	        'movie',
	        'watchedMovies',
	        'wantedMovies'
	      ])
	    },
	    methods: {
	      saveWatchedMovie() {
	        this.markWatchedMovie(this.movie);
	        const index = this.watchedMovies.findIndex((item) => {
	          return item.id === this.movie.id;
	        });
	        if (index > -1) {
	          this.hasWatched = true;
	          this.watchedText = '已看过';
	        } else {
	          this.hasWatched = false;
	          this.watchedText = '看过 ';
	        }
	      },
	      saveWantedMovie() {
	        this.markWantedMovie(this.movie);
	        const index = this.wantedMovies.findIndex((item) => {
	          return item.id === this.movie.id;
	        });
	        if (index > -1) {
	          this.wantedText = '已想看';
	        } else {
	          this.wantedText = '想看';
	        }
	      },
	      isWanted(id) {
	        const index = this.wantedMovies.findIndex((item) => {
	          return item.id === id;
	        });
	        if (index > -1) {
	          this.wantedText = '已想看';
	          return true;
	        }
	        return false;
	      },
	      isWatched(id) {
	        const index = this.watchedMovies.findIndex((item) => {
	          return item.id === id;
	        });
	        if (index > -1) {
	          this.hasWatched = true;
	          return true;
	        }
	        return false;
	      },
	      normalizeScore() { // 数位补零
	        let len = this.movieDetail.rating.average.toString().length;
	        if (len < 2) {
	          return `${this.movieDetail.rating.average}.0`;
	        }
	        return this.movieDetail.rating.average;
	      },
	      _initPics() {
	        let picWidth = 90;
	        let margin = 8;
	        let width = (picWidth + margin) * this.allCasts.length - margin;
	        this.$refs.content.style.width = width + 'px';
	      },
	      ...mapActions([
	        'markWantedMovie',
	        'markWatchedMovie'
	      ])
	    },
	    components: {
	      VScroll
	    }
  	};
</script>

<style lang="scss" scoped>
	@import "../../common/style/variable.scss";
  	@import "../../common/style/mixin.scss";
  	
  	.movie-info {
  		background-color: $color-background;
  		padding: 0 20px;
  	}
  	
  	.movie-main-info {
  		display: flex;
  		height: 140px;
  		justify-content: space-between;
  		.desc {
  			flex: 70% 0 0;
  			overflow: hidden;
  			display: flex;
  			flex-direction: column;
  			justify-content: space-around;
  			.title {
  				font-size: $font-size-large;
  				color: $color-text-f;
  				padding: 10px 0 5px 0;
  			}
  			span {
  				font-size: $font-size-small;
  			}
  		}
  		.movie-ratings {
  			height: 60px;
  			margin-top: 25px;
  			padding: 10px 15px;
  			display: flex;
  			flex-direction: column;
  			align-items: center;
  			justify-content: space-between;
  			box-shadow: 0px 0px 5px #ccc;
  			background-color: #f8f8f8;
  			span {
  				font-size: $font-size-small;
  				color: $color-text;
  				&.rating {
  					font-size: $font-size-large;
  					color: $color-text-f;
  				}
  			}
  			.noscore{
  				font-size: 14px;
  			}
  		}
  	}
  	
  	.movie-brief {
  		margin-top: 20px;
  		padding-top: 20px;
  		.title {
  			font-size: $font-size-small;
  		}
  		.content {
  			padding-top: 10px;
  			font-size: $font-size-medium;
  			color: $color-text-f;
  			line-height: 25px;
  		}
  	}
  	
  	.movie-watch {
  		margin-top: 20px;
  		line-height: 35px;
  		height: 35px;
  		display: flex;
  		text-align: center;
  		font-size: $font-size-medium;
  		color: $color-yushou;
  		.want-watch {
  			flex: 1;
  			border: 1px solid $color-yushou;
  			border-radius: 5px;
  			margin-right: 20px;
  			&.wanted {
  				border: 1px solid red;
  				color: red;
  			}
  		}
  		.has-watch {
  			flex: 1;
  			border: 1px solid $color-yushou;
  			border-radius: 5px;
  			&.watched {
  				border: 1px solid red;
  				color: red;
  			}
  			img {
  				display: inline-block;
  				vertical-align: middle;
  				padding-bottom: 2px;
  				border-radius: 50%;
  			}
  		}
  	}
  	
  	.casts {
  		padding: 30px 0;
  		width: 100%;
  		white-space: nowrap;
  		overflow: hidden;
  		font-size: 0;
  		.casts-content {
  			.title {
  				font-size: $font-size-small;
  				padding-bottom: 20px;
  			}
  			.cast-item {
  				width: 90px;
  				vertical-align: top;
  				display: inline-block;
  				text-align: center;
  				margin-right: 8px;
  				font-size: $font-size-small;
  				img {
  					height: 120px;
  					width: 90px;
  				}
  				.item-title {
  					color: $color-text-f;
  					padding: 8px 0 5px 0;
  				}
  			}
  			.no-result {
  				text-align: center;
  				font-size: $font-size-small;
  				font-size: $color-theme-f;
  			}
  		}
  	}
        
         
</style>