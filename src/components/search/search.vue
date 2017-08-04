<template>
<transition name="slide">
	<div class="movie-search">
		<v-searchbox @query="onQueryChange" :tagSearch="tagSearch" ref="searchBox" v-show="!tagSearch">

		</v-searchbox>
		<div class="fixed-title" v-show="tagSearch">
			<span class="back" @click="back">
		        <i class="icon-back"></i>
		    </span>
			<span class="type">
		        <span>关于{{query}}的电影</span>
			</span>
		</div>
		<div class="shortcut-wrapper" v-show="!query">
			<v-scroll class="shortcut" :beforeScroll="beforeScroll" @beforeScroll="listenScroll" ref="shortcut">
				<div class="">
					<div class="tag-list">
						<div class="douban-tag tag">
							<h2>豆瓣电影</h2>
							<span v-for="item in doubanTag" class="tag-item" @click="tagQuery(item)">{{item}}</span>
						</div>
						<div class="movie-tag tag">
							<h2>电影类型</h2>
			                <span v-for="item in movieTag" class="tag-item" @click="tagQuery(item)">{{item}}</span>
			           </div>
					</div>
					<div class="search-history">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click="showConfirm"><i class="icon-bin"></i></span>
						</h1>
						<v-searchhistory :searches="searchHistory" @select="addQuery" @delete="deleteOne"></v-searchhistory>
					</div>
				</div>
			</v-scroll>
		</div>
		<div class="search-result" :class="{'tag-search': tagSearch}" v-show="query" ref="searchResult">
			<v-searchresult :query="query" :tagSearch="tagSearch" @listScroll="blurInput" @select="saveSearch" ref="suggest"></v-searchresult>
		</div>
		<v-confirmbox text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory" ref="confirm">
			
		</v-confirmbox>
	</div>
</transition>
</template>

<script type="text/ecmascript-6">
  import VSearchbox from '@/baseparts/searchBox/searchBox';
  import VSearchresult from '@/components/search-result/search-result';
  import VScroll from '@/baseparts/scroll/scroll';
  import VConfirmbox from '@/baseparts/confirm-box/confirm-box';
  import VSearchhistory from '@/baseparts/search-history/search-history';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: 'search',
    data() {
      return {
        query: '',
        doubanTag: ['经典', '豆瓣高分'],
        movieTag: ['爱情', '喜剧', '科幻', '动作', '悬疑'],
        tagSearch: false,
        beforeScroll: true
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    mounted() {
      this.$nextTick(() => {
        this.focusInput();
      });
    },
    methods: {
      back() { // 清除搜索项
        this.tagSearch = false;
        this.query = '';
        // this.$refs.searchBox.clear();
      },
      listenScroll() {
        this.blurInput();
      },
      onQueryChange(query) { // 搜索框查询改变
        this.query = query;
      },
      tagQuery(query) { // 搜索标签内容,按标签搜索
        // 隐藏搜索栏，区分关键字搜索和标签搜索
        this.tagSearch = true;
        this.query = query;
        // this.$refs.searchBox.setQuery(query);
      },
      addQuery(query) { // 将搜索历史搜索框并搜索
        this.$refs.searchBox.setQuery(query);
      },
      saveSearch() {
        if (!this.tagSearch) {
          this.saveSearchHistory(this.query);
        }
      },
      deleteOne(item) {
        this.deleteSearchHistory(item);
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      blurInput() {
        this.$refs.searchBox.blur();
      },
      focusInput() {
        this.$refs.searchBox.focus();
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    watch: {
      // 由于shortcut-wrapper会在搜索内容存在的时候隐藏，dom会重新发生变化，所以这里需要再次刷新scroll组件
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20);
        }
      }
    },
    components: {
      VSearchbox,
      VSearchhistory,
      VSearchresult,
      VScroll,
      VConfirmbox
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../common/style/variable.scss";
  @import "../../common/style/mixin.scss";
  
  .movie-search{
  	position: fixed;
    z-index: 500;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
    &.slide-enter-active,.slide-leave-active{
		transition:all .3s;
	}
	&.slide-enter,.slide-leave-to{
		transform: translate3d(0,100%,0);
	}
  }
         
    .fixed-title {
    	@include border-bottom-1px($color-line);
    	position: fixed;
    	top: 0;
    	width: 100%;
    	height: 50px;
    	z-index: 200;
    	background-color: red;
    	.back {
    		position: absolute;
    		top: 0px;
    		left: 6px;
    		z-index: 50;
    		.icon-back {
    			display: block;
    			padding: 15px;
    			font-size: $font-size-large;
    			color: #fff;
    		}
    	}
    	.type {
    		line-height: 50px;
    		font-size: $font-size-medium-x;
    		padding-left: 60px;
    		color: #fff;
    	}
    }
           
    .shortcut-wrapper {
    	position: fixed;
    	top: 50px;
    	bottom: 0;
    	width: 100%;
    	.shortcut {
    		height: 100%;
    		overflow: hidden;
    		.tag-list {
    			padding: 0 15px;
    			width: 90%;
    			.tag {
    				@include border-bottom-1px($color-line);
    				padding: 20px 0;
    				h2{
    					font-size: 16px;
    					padding-bottom: 10px;
    				}
    				&:last-child {
    					@include border-bottom-1px($color-theme-f);
    				}
    				&.movie-tag {
    					.tag-item {
    						margin-bottom: 15px;
    					}
    				}
    				.tag-item {
    					display: inline-block;
    					margin-right: 15px;
    					padding: 8px 16px;
    					font-size: $font-size-medium;
    					color: #666;
    					border: 1px solid $color-yushou;
    					border-radius: 10px;
    				}
    			}
    		}
    		.search-history {
    			position: relative;
    			margin: 20px 20px 0 20px;
    			.title {
    				display: flex;
    				align-items: top;
    				height: 40px;
    				font-size: $font-size-large;
    				color: $color-yushou;
    				.text {
    					flex: 1
    				}
    				.clear {
    					@include extend-click();
    					.icon-bin {
    						font-size: $font-size-large;
    						color: $color-yushou;
    					}
    				}
    			}
    		}
    	}
    }
                 
    .search-result {
    	position: fixed;
    	width: 100%;
    	top: 50px;
    	bottom: 0;
    	background: $color-background;
    }
      
</style>
