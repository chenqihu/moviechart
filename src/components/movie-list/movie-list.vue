<template>
  <div class="movie-list">
    <ul>
      <li v-for="(movie,index) in movies" @click="selectItem(movie)" ref="group">
        <div class="date" v-if="needDate && !dateEqual(index)">{{movie.date}}</div>
        <div class="item">
          <div class="info-img">
            <img v-lazy="movie.image" height="120" width="80">
          </div>
          <div class="info-desc">
            <p class="title">{{movie.title}}</p>
            <p class="score" v-if="movie.rating!==0">豆瓣评分<span>{{movie.rating}}</span></p>
            <p class="score" v-else>暂无评分</span></p>
            <div class="director">导演: {{movie.director}}</div>
            <div class="casts">主演: {{movie.casts}}</div>
            <div class="hasWatched" v-if="needDate">{{movie.collectCount}}人想看</div>
            <div class="hasWatched" v-else>{{movie.collectCount}}人看过</div>            
          </div>
          <div class="purchse">
          	<span v-if="needDate" class="othercolor">预售</span>
          	<span v-else>购票</span>
          </div>
        </div>
      </li>
    </ul>
    <v-loadmore :hasMore="hasMore" v-show="movies.length"></v-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
import VLoadmore from '@/baseparts/loadmore/loadmore';
  export default {
    props: {
      movies: {
        type: Array,
        default: []
      },
      needDate: {
        type: Boolean,
        default: false
      },
      hasMore: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        casts: [],
        showScore: true
      };
    },
    created() {
      this.listHeight = [];
      this.indexMap = {};
    },
    computed: {
    },
    methods: {
      selectItem(movie) {
        this.$emit('select', movie);
      },
      dateEqual(index) { // 确定相邻两部电影日期是否一样，划分日期分组
        if (index === 0) {
          return false;
        }
        return this.movies[index].date === this.movies[index - 1].date;
      },
      recalculate() { // 重新计算各个区域高度，防止用户在发起新数据请求后切换选项卡无法正确获取高度
        setTimeout(() => { // 需要延迟来保证dom更新
          this.getMap();
          this._calculateHeight();
        }, 20);
      },
      getMap() { // 根据日期创建电影分组
        let map = {};
        for (let i = 0; i < this.movies.length; i++) {
          if (map[this.movies[i].date]) {
            map[this.movies[i].date].push(i);
          } else {
            map[this.movies[i].date] = [i];
          }
        }
        this.indexMap = map;
      },
      _calculateHeight() { // 计算每个区间的高度
        this.listHeight = [];
        const list = this.$refs.group;
        let height = 0;
        let map = Object.values(this.indexMap);
        this.listHeight.push(height);
        map.forEach((item, index) => {
          item.forEach((item) => {
            height += list[item].clientHeight;
          });
          this.listHeight.push(height);
        });
        this.$emit('getHeight', this.listHeight);
        this.$emit('getMap', Object.keys(this.indexMap));
      }
    },
    watch: {
      movies() {
        if (this.needDate) {
          setTimeout(() => { // 需要延迟来保证dom更新
            this.getMap();
            this._calculateHeight();
          }, 20);
        }
      }
    },
    components: {
      VLoadmore
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../common/style/variable.scss";
  @import "../../common/style/mixin.scss";
  .movie-list {
  	.date {
  		width: 100%;
  		background-color: $color-background-d;
  		padding-left: 15px;
  		height: 30px;
  		line-height: 30px;
  	}
  	.item {
  		display: flex;
  		align-items: center;
  		box-sizing: border-box;
  		padding: 15px;
  		.info-img {
  			flex: 80px 0 0;
  			margin-right: 10px;
  		}
  		.info-desc {
  			height: 120px;
  			flex: 1;
  			display: flex;
  			flex-direction: column;
  			justify-content: space-around;
  			overflow: hidden;
  			.title {
  				font-size: $font-size-medium-x;
  				color: $color-text-f;
  			}
  			.score{
  				font-size: 14px;
  				span{
  					padding-left:5px;
  					font-size:16px;
  				};
  			}
  			.director {
  				font-size: $font-size-small;
  			}
  			.casts {
  				font-size: $font-size-small;
  				@include no-wrap();
  			}
  			.hasWatched {
  				color: $color-text-f;
  				font-size: $font-size-small;
  			}
  		}
  		.purchse{
  			flex: 0 0 15%;
  			span{
  				display: inline-block;
  				width:45px;
  				height:25px;
  				line-height: 25px;
  				text-align: center;
  				background-color:$color-maoyan;
  				border-radius: 20px;
  				color:#fff;
  				font-size: 14px;
  			}
  			.othercolor{
  				background-color:$color-yushou;
  			}
  		}
  	}
  }
                       
</style>
